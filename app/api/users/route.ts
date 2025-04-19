import { db } from 'lib/prisma'

export async function GET(request: Request) {
  const data = await db.user.findMany()

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { email } = body
  const nickname = email.split('@')[0]

  const newUser = await db.user.create({
    data: {
      email,
      nickname,
    },
  })

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}
