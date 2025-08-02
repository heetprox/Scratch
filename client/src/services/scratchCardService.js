import prisma from '../lib/db';

export async function createScratchCard(data) {
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

export async function getScratchCardByUsername(username) {
  return await prisma.scratchCard.findUnique({
    where: { username },
    include: {
      payments: true,
    },
  });
}

export async function getAllScratchCards() {
  return await prisma.scratchCard.findMany({
    include: {
      payments: true,
    },
  });
}

export async function updateScratchCard(
  username,
  data 
) {
  return await prisma.scratchCard.update({
    where: { username },
    data,
  });
}

export async function deleteScratchCard(username) {
  return await prisma.scratchCard.delete({
    where: { username },
  });
}