import { prisma } from '../lib/prisma';

export async function getConfig(): Promise<Record<string, string>> {
  const configs = await prisma.appConfig.findMany();
  return Object.fromEntries(configs.map((c) => [c.key, c.value]));
}

export async function setConfig(key: string, value: string): Promise<void> {
  await prisma.appConfig.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function setConfigs(data: Record<string, string>): Promise<void> {
  for (const [key, value] of Object.entries(data)) {
    await setConfig(key, value);
  }
}
