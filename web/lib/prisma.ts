import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy initialization: Only create adapter when PrismaClient is instantiated
// This allows the module to load during build time without requiring DATABASE_URL
function getPrismaClient(): PrismaClient {
  // Use DATABASE_URL or a placeholder during build
  // During Next.js build, DATABASE_URL may not be set, but we need a valid connection string
  // for the adapter. Use a placeholder that will fail at runtime if not replaced.
  const connectionString = process.env.DATABASE_URL || 
    'postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public'
  
  // Check if we're using the placeholder (build time)
  const isPlaceholder = !process.env.DATABASE_URL && 
    connectionString.includes('placeholder')
  
  if (isPlaceholder) {
    console.warn('DATABASE_URL not set - using placeholder for build. Database calls will fail at runtime.')
  }

  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

