import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  twilio_opt_in: boolean;
  registered_at: Date;
  position: number;
}

export interface RateLimitRecord {
  ip: string;
  registrations: number[];
  last_cleanup: Date;
}

const DEFAULT_START_COUNT = parseInt(process.env.WAITLIST_START_COUNT || "366", 10);

export async function initializeDatabase() {
  // Initialize metadata if not exists
  const existing = await prisma.waitlistMetadata.findUnique({
    where: { key: 'last_position' }
  });
  
  if (!existing) {
    await prisma.waitlistMetadata.create({
      data: { key: 'last_position', value: DEFAULT_START_COUNT }
    });
  }
  
  console.log('✅ Database initialized');
}

export async function addWaitlistEntry(entry: Omit<WaitlistEntry, 'position' | 'registered_at'>) {
  await initializeDatabase();
  
  // Get next position
  const metadata = await prisma.waitlistMetadata.findUnique({
    where: { key: 'last_position' }
  });
  
  const currentPosition = metadata?.value || DEFAULT_START_COUNT;
  const newPosition = currentPosition + 1;

  // Insert entry
  await prisma.waitlistEntry.create({
    data: {
      id: entry.id,
      name: entry.name,
      email: entry.email,
      phone: entry.phone,
      twilioOptIn: entry.twilio_opt_in,
      position: newPosition
    }
  });

  // Update position counter
  await prisma.waitlistMetadata.upsert({
    where: { key: 'last_position' },
    update: { value: newPosition },
    create: { key: 'last_position', value: newPosition }
  });

  return newPosition;
}

export async function getWaitlistCount() {
  await initializeDatabase();
  
  const metadata = await prisma.waitlistMetadata.findUnique({
    where: { key: 'last_position' }
  });
  
  return metadata?.value || DEFAULT_START_COUNT;
}

export async function checkEmailExists(email: string) {
  const entry = await prisma.waitlistEntry.findUnique({
    where: { email },
    select: { position: true }
  });
  
  return entry;
}

export async function updateRateLimit(ip: string, registrations: number[]) {
  await prisma.rateLimit.upsert({
    where: { ip },
    update: {
      registrations: JSON.stringify(registrations),
      lastCleanup: new Date()
    },
    create: {
      ip,
      registrations: JSON.stringify(registrations)
    }
  });
}

export async function getRateLimit(ip: string) {
  const record = await prisma.rateLimit.findUnique({
    where: { ip },
    select: { registrations: true, lastCleanup: true }
  });
  
  if (!record) return null;
  
  return {
    registrations: JSON.parse(record.registrations),
    lastCleanup: record.lastCleanup.getTime()
  };
}