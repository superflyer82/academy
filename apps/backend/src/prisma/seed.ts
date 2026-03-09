import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Kategorien
  const categories = [
    { name: 'Müll & Entsorgung', icon: '🗑️', color: '#F59E0B', responsibleDepartment: 'Entsorgungsamt', targetResolutionDays: 3, sortOrder: 1 },
    { name: 'Straßenschäden', icon: '🛣️', color: '#EF4444', responsibleDepartment: 'Tiefbauamt', targetResolutionDays: 14, sortOrder: 2 },
    { name: 'Ampeln & Schilder', icon: '🚦', color: '#F97316', responsibleDepartment: 'Straßenverkehrsamt', targetResolutionDays: 7, sortOrder: 3 },
    { name: 'Straßenbeleuchtung', icon: '💡', color: '#EAB308', responsibleDepartment: 'Stadtwerke', targetResolutionDays: 5, sortOrder: 4 },
    { name: 'Grünanlagen & Parks', icon: '🌳', color: '#22C55E', responsibleDepartment: 'Grünflächenamt', targetResolutionDays: 10, sortOrder: 5 },
    { name: 'Schrottfahrzeuge', icon: '🚗', color: '#6B7280', responsibleDepartment: 'Ordnungsamt', targetResolutionDays: 21, sortOrder: 6 },
    { name: 'Entwässerung', icon: '🌊', color: '#3B82F6', responsibleDepartment: 'Tiefbauamt', targetResolutionDays: 7, sortOrder: 7 },
    { name: 'Barrierefreiheit', icon: '♿', color: '#8B5CF6', responsibleDepartment: 'Stadtplanungsamt', targetResolutionDays: 30, sortOrder: 8 },
    { name: 'Sonstiges', icon: '📋', color: '#9CA3AF', responsibleDepartment: 'Bürgerservice', targetResolutionDays: 14, sortOrder: 9 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.name },
      update: cat,
      create: cat,
    });
  }

  // Wir brauchen IDs, daher nochmal laden
  const existingCats = await prisma.category.findMany();
  for (const cat of categories) {
    const exists = existingCats.find((c) => c.name === cat.name);
    if (!exists) {
      await prisma.category.create({ data: cat });
    }
  }

  // Admin-Benutzer
  const adminPassword = await bcrypt.hash('Admin1234!', 12);
  await prisma.staffUser.upsert({
    where: { email: 'admin@musterhausen.de' },
    update: {},
    create: {
      email: 'admin@musterhausen.de',
      passwordHash: adminPassword,
      name: 'Admin Musterhausen',
      role: 'ADMIN',
      department: 'IT',
    },
  });

  // Standard-Konfiguration
  const configs = [
    { key: 'city.name', value: 'Stadt Musterhausen' },
    { key: 'city.primaryColor', value: '#2563EB' },
    { key: 'city.defaultLat', value: '48.1374' },
    { key: 'city.defaultLng', value: '11.5755' },
    { key: 'city.defaultZoom', value: '13' },
  ];

  for (const config of configs) {
    await prisma.appConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    });
  }

  console.log('Seeding complete.');
  console.log('Admin login: admin@musterhausen.de / Admin1234!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
