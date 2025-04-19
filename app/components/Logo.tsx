import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link
      href='/'
      className='flex items-center px-2'>
      <Image
        src='/logo.svg'
        width={0}
        height={0}
        alt='Simple shop'
        className='w-9 h-9'
      />
      <h1 className='mb-1 ml-1 text-2xl font-bold text-sky-500'>imple</h1>
    </Link>
  )
}
