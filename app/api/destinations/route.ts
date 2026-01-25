import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const destinations = await prisma.city.findMany();
  return NextResponse.json(destinations);
}

