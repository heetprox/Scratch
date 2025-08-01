import { prisma } from '@/lib/db';
import { CreateScratchCardParams, ScratchCard } from '@/types';

export async function createScratchCard(data: CreateScratchCardParams): Promise<ScratchCard> {
  return await prisma.scratchCard.create({
    data: {
      username: data.username,
      name: data.name,
      image: data.image,
      description: data.description,
      walletAddresses: data.walletAddresses,
    },
  });
}

export async function getScratchCardByUsername(username: string): Promise<ScratchCard | null> {
  return await prisma.scratchCard.findUnique({
    where: { username },
    include: {
      payments: true,
    },
  });
}

export async function getAllScratchCards(): Promise<ScratchCard[]> {
  return await prisma.scratchCard.findMany({
    include: {
      payments: true,
    },
  });
}

export async function updateScratchCard(
  username: string,
  data: Partial<CreateScratchCardParams>
): Promise<ScratchCard> {
  return await prisma.scratchCard.update({
    where: { username },
    data,
  });
}

export async function deleteScratchCard(username: string): Promise<ScratchCard> {
  return await prisma.scratchCard.delete({
    where: { username },
  });
}