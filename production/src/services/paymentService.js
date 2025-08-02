import prisma from '@/lib/db';
import { v4 } from 'uuid';

export async function createPayment(
  scratchCardId,
  amount,
  network,
  address,
  transactionHash
) {
  return await prisma.payment.create({
    data: {
      id: v4(),
      senderId: scratchCardId,
      amount: typeof amount === 'number' ? amount.toString() : amount,
      network,
      address,
      done: false,
      transactionHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function getPaymentById(id) {
  return await prisma.payment.findUnique({
    where: { id },
  });
}

export async function updatePaymentStatus(
  id,
  transactionHash,
  timestamp
) {
  return await prisma.payment.update({
    where: { id },
    data: {
      done: true,
      transactionHash,
      timestamp: typeof timestamp === 'number' ? BigInt(timestamp) : timestamp,
    },
  });
}

export async function getPaymentsByScratchCardId(scratchCardId) {
  return await prisma.payment.findMany({
    where: { scratchCardId },
    orderBy: { createdAt: 'desc' },
  });
}