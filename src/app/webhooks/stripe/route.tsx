import db from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import PurchaseReceiptEmail from '@/email/PurchaseReceipt'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get('stripe-signature') as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  )

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object
    const productId = charge.metadata.productId
    const discountId = charge.metadata.discountId
    const email = charge.billing_details.email
    const total = charge.amount

    const product = await db.product.findUnique({ where: { id: productId } })
    if (product == null || email == null) {
      return new NextResponse('Bad Request', { status: 400 })
    }

    const userFields = {
      email,
      orders: { create: { productId, total } },
    }

    const {
      orders: [order],
    } = await db.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt: 'desc' }, take: 1 } },
    })

    if (discountId != null) {
      await db.discount.update({
        where: { id: discountId },
        data: { uses: { increment: 1 } },
      })
    }

    await resend.emails.send({
      from: `Support <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: 'Order Confirmation',
      react: (
        <PurchaseReceiptEmail
          order={order}
          product={product}
        />
      ),
    })
  }

  return new NextResponse()
}
