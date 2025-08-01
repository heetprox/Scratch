import { prisma } from '@/lib/db';
import { Payment } from '@/types';

export async function createPayment(data: {
  scratchCardId: string;
  amount: number;
  network: string;
  address: string;
}): Promise<Payment> {
  return await prisma.payment.create({
    data: {
      scratchCardId: data.scratchCardId,
      amount: data.amount.toString(),
      network: data.network,
      address: data.address,
      done: false,
    },
  });
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  return await prisma.payment.findUnique({
    where: { id },
  });
}

export async function updatePaymentStatus(
  id: string,
  transactionHash: string,
  timestamp: number
): Promise<Payment> {
  return await prisma.payment.update({
    where: { id },
    data: {
      done: true,
      transactionHash,
      timestamp: BigInt(timestamp),
    },
  });
}

export async function getPaymentsByScratchCardId(scratchCardId: string): Promise<Payment[]> {
  return await prisma.payment.findMany({
    where: { scratchCardId },
    orderBy: { createdAt: 'desc' },
  });
}