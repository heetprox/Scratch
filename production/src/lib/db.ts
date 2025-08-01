import { PrismaClient } from '@prisma/client';
import { PrismaSingleton } from '@/types';

const globalForPrisma = global as unknown as PrismaSingleton;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;