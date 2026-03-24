import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@imotory.com" },
    update: {},
    create: {
      email: "admin@imotory.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
    // ... 187 lines omitted
    {
    // ... 186 lines omitted
    {
    // ... 185 lines omitted
    {
    // ... 184 lines omitted
    {
    // ... 183 lines omitted
    {
    // ... 182 lines omitted
  }
    // ... 181 lines omitted
}
// ... 180 more lines (total: 202)

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
