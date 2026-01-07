import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json([]);
  }
}

// POST: Save a new project
export async function POST(req: Request) {
  try {
    const { prompt, schema } = await req.json();

    const project = await prisma.project.create({
      data: {
        prompt,
        // Postgres accepts the object directly (no JSON.stringify needed)
        schema: schema
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}