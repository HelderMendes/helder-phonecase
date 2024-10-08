import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatusDropdown from './StatusDropdown';

const DashboardPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const ADMIN_EMAIL01 = process.env.ADMIN_EMAIL01;

  // if (
  //   !user ||
  //   (user.email !== process.env.ADMIN_EMAIL &&
  //     user.email !== process.env.ADMIN_EMAIL01)
  // )
  //   return notFound();
  if (!user || user.email !== process.env.ADMIN_EMAIL) return notFound();

  const orders = await db.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
      shippingAddress: true,
    },
  });

  const lastWeekSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const lastMonthSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const WEEKLY_GOAL = 500;
  const MONTHLY_GOAL = 2500;

  return (
    <div className='flex min-h-screen w-full bg-muted/40'>
      <div className='mx-auto flex w-full max-w-7xl flex-col sm:gap-4 sm:py-4'>
        <div className='flex flex-col gap-16'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>Last Week</CardDescription>
                <CardTitle className='text-4xl'>
                  {formatPrice(lastWeekSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-sm text-muted-foreground'>
                  of {formatPrice(WEEKLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  value={((lastWeekSum._sum.amount ?? 0) * 100) / WEEKLY_GOAL}
                />
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>Last Month</CardDescription>
                <CardTitle className='text-4xl'>
                  {formatPrice(lastMonthSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-sm text-muted-foreground'>
                  of {formatPrice(MONTHLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  value={((lastMonthSum._sum.amount ?? 0) * 100) / MONTHLY_GOAL}
                />
              </CardFooter>
            </Card>
          </div>

          <h1 className='text-4xl font-bold tracking-tight'>Incoming Orders</h1>
          <div>
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className=''>Customer</TableHead>
                  <TableHead className='hidden sm:table-cell'>Status</TableHead>
                  <TableHead className='hidden sm:table-cell'>
                    Purchase date
                  </TableHead>
                  <TableHead className='text-right'>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='font-medium'>
                {orders.map((order, indexOrder) => (
                  <TableRow key={indexOrder} className='bg-accent'>
                    <TableCell>
                      <div className='font-medium'>
                        {order.shippingAddress?.name}
                      </div>
                      <div className='hidden text-muted-foreground sm:table-cell md:inline'>
                        {order.user.email}
                      </div>
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      <div>
                        <StatusDropdown
                          id={order.id}
                          orderStatus={order.status}
                        />
                        {/* {order.isPaid === true ? 'Awaiting payment' : 'Paid'} */}
                      </div>
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      {order.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-right'>
                      {/* <div>€ {order.amount.toFixed(2)}</div> */}
                      <div>{formatPrice(order.amount)}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
