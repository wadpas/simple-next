import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/components/ui/card'
import { formatCurrency, formatNumber } from 'lib/formatters'
import { db } from 'lib/prisma'

export default async function AdminDashboard() {
  const salesData = await getSalesData()

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <DashboardCard
        title='Sales'
        subtitle={`${formatNumber(salesData.totalOrders)} Orders`}
        body={formatCurrency(salesData.totalSales)}
      />
    </div>
  )
}

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { sum: true },
    _count: true,
  })

  return {
    totalSales: data._sum.sum || 0,
    totalOrders: data._count,
  }
}

type DashboardCardProps = {
  title: string
  subtitle: string
  body: string
}

async function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  )
}
