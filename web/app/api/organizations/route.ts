import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createOrganizationSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  domain: z.string().optional(),
})

// GET /api/organizations - List user's organizations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organizations = await prisma.organizationUser.findMany({
      where: { userId: session.user.id },
      include: {
        organization: true,
      },
    })

    return NextResponse.json({
      organizations: organizations.map((ou: { organization: { id: string; name: string; slug: string } }) => ou.organization),
    })
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/organizations - Create new organization
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = createOrganizationSchema.parse(body)

    // Check if slug is already taken
    const existing = await prisma.organization.findUnique({
      where: { slug: data.slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Organization slug already exists" },
        { status: 400 }
      )
    }

    // Create organization and add user as admin
    const organization = await prisma.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        domain: data.domain,
        users: {
          create: {
            userId: session.user.id,
            role: "ORG_ADMIN",
          },
        },
      },
    })

    return NextResponse.json({ organization }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating organization:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

