'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps, ReactNode } from 'react'
import { cn } from 'lib/utils'

export function AdminNav({ children }: { children: ReactNode }) {
  return (
    <div className='sticky top-0 bg-sky-900'>
      <div className='flex mx-auto text-white w-[1600px]'>{children}</div>
    </div>
  )
}

export function AdminNavLink(props: Omit<ComponentProps<typeof Link>, 'className'>) {
  const pathName = usePathname()
  return (
    <Link
      {...props}
      className={cn(
        'p-4 font-bold hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground',
        pathName === props.href && 'bg-background text-foreground'
      )}
    />
  )
}
