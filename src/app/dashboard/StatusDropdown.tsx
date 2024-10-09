'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import { changeOrderStatus } from './actions';
import { useRouter } from 'next/navigation';

const LABEL_MAP: Record<keyof typeof OrderStatus, string> = {
  awaiting_shipment: 'Awaiting Shipment',
  fulfilled: 'Fulfilled',
  shipped: 'Shipped',
};

function StatusDropdown({
  id,
  orderStatus,
}: {
  id: string;
  orderStatus: OrderStatus;
}) {
  const router = useRouter();

  const { mutate } = useMutation({
    mutationKey: ['change-order-status'],
    mutationFn: changeOrderStatus,
    onSuccess: () => router.refresh(),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'outline'}
          className='w-53 flex items-center justify-center'
        >
          {LABEL_MAP[orderStatus]}
          <ChevronsUpDown className='ml-4 size-4 shrink-0 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-0'>
        {Object.keys(OrderStatus).map((status, indexStatus) => (
          <DropdownMenuItem
            key={indexStatus}
            className={cn(
              'flex cursor-default items-center gap-1 p-2.5 text-sm hover:bg-zinc-100',
              { 'bg-zinc-100': orderStatus === status },
            )}
            onClick={() => mutate({ id, newStatus: status as OrderStatus })}
          >
            <Check
              className={cn(
                'mr-2 size-4 text-primary',
                orderStatus === status ? 'opacity-100' : 'opacity-0',
              )}
            />
            {LABEL_MAP[status as OrderStatus]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default StatusDropdown;
