'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { addDiscount } from '../../_actions/discounts'
import { Checkbox } from '@/components/ui/checkbox'
import { DiscountType } from '@/generated/prisma/client'

export function DiscountForm({ products }: { products: { name: string; id: string }[] }) {
  const [error, action] = useActionState(addDiscount, {})
  const [allProducts, setAllProducts] = useState(true)
  const today = new Date()
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset())

  return (
    <form
      action={action}
      className='space-y-8'>
      <div className='space-y-2'>
        <Label htmlFor='code'>Discount</Label>
        <Input
          type='text'
          id='code'
          name='code'
          required
        />
        {error.code && <div className='text-destructive'>{error.code}</div>}
      </div>
      <div className='flex items-baseline gap-8 space-y-2'>
        <div className='space-y-2'>
          <Label htmlFor='type'>Discount Type</Label>
          <RadioGroup
            id='type'
            name='type'
            defaultValue={DiscountType.PERCENTAGE}>
            <div className='flex items-center gap-2'>
              <RadioGroupItem
                id='percentage'
                value={DiscountType.PERCENTAGE}
              />
              <Label htmlFor='percentage'>Percentage</Label>
            </div>
            <div className='flex items-center gap-2'>
              <RadioGroupItem
                id='fixed'
                value={DiscountType.FIXED}
              />
              <Label htmlFor='fixed'>Fixed</Label>
            </div>
          </RadioGroup>
          {error.type && <div className='text-destructive'>{error.type}</div>}
        </div>
        <div className='flex-grow space-y-2'>
          <Label htmlFor='amount'>Discount Amount</Label>
          <Input
            type='number'
            id='amount'
            name='amount'
            required
          />
          {error.amount && <div className='text-destructive'>{error.amount}</div>}
        </div>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='limit'>Limit</Label>
        <Input
          type='number'
          id='limit'
          name='limit'
        />
        <div className='text-muted-foreground'>Leave blank for infinite uses</div>
        {error.limit && <div className='text-destructive'>{error.limit}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='expiresAt'>Expiration</Label>
        <Input
          type='datetime-local'
          id='expiresAt'
          name='expiresAt'
          className='w-max'
          min={today.toJSON().split(':').slice(0, -1).join(':')}
        />
        <div className='text-muted-foreground'>Leave blank for no expiration</div>
        {error.expiresAt && <div className='text-destructive'>{error.expiresAt}</div>}
      </div>
      <div className='space-y-2'>
        <Label>Allowed Products</Label>
        {error.allProducts && <div className='text-destructive'>{error.allProducts}</div>}
        {error.productIds && <div className='text-destructive'>{error.productIds}</div>}
        <div className='flex items-center gap-2'>
          <Checkbox
            id='allProducts'
            name='allProducts'
            checked={allProducts}
            onCheckedChange={(e) => setAllProducts(e === true)}
          />
          <Label htmlFor='allProducts'>All Products</Label>
        </div>
        {products.map((product) => (
          <div
            key={product.id}
            className='flex items-center gap-2'>
            <Checkbox
              id={product.id}
              name='productIds'
              disabled={allProducts}
              value={product.id}
            />
            <Label htmlFor={product.id}>{product.name}</Label>
          </div>
        ))}
      </div>
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type='submit'
      disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  )
}
