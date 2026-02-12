import { prisma } from "@/lib/prisma"
import { z } from "zod"
import type {
  AggregatedEmissions,
  ActivityDataItem,
  OrganizationProfile,
  CollectionResult,
  CollectionError,
} from "../types"

/**
 * Validation schemas for collector methods
 */
const CollectEmissionsSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  periodStart: z.date({
    required_error: "Period start date is required",
    invalid_type_error: "Period start must be a valid date",
  }),
  periodEnd: z.date({
    required_error: "Period end date is required",
    invalid_type_error: "Period end must be a valid date",
  }),
}).refine(
  (data) => data.periodEnd > data.periodStart,
  {
    message: "Period end must be after period start",
    path: ["periodEnd"],
  }
)

const CollectActivityDataSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  periodStart: z.date({
    required_error: "Period start date is required",
    invalid_type_error: "Period start must be a valid date",
  }),
  periodEnd: z.date({
    required_error: "Period end date is required",
    invalid_type_error: "Period end must be a valid date",
  }),
}).refine(
  (data) => data.periodEnd > data.periodStart,
  {
    message: "Period end must be after period start",
    path: ["periodEnd"],
  }
)

const CollectOrganizationProfileSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
})

/**
 * ReportDataCollector - Gathers all data needed for a report
 * 
 * This collector is responsible for fetching and aggregating data from the database
 * for use in report generation. It provides methods to collect emissions data,
 * activity data, and organization profiles with comprehensive validation.
 */
export class ReportDataCollector {
  /**
   * Collect aggregated emissions data for an organization within a period
   * 
   * @param organizationId - The organization ID
   * @param periodStart - Start date of the reporting period
   * @param periodEnd - End date of the reporting period
   * @returns Aggregated emissions data with breakdown by scope and category
   */
  async collectEmissions(
    organizationId: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<CollectionResult<AggregatedEmissions>> {
    const errors: CollectionError[] = []

    // Validate input data
    const validation = CollectEmissionsSchema.safeParse({
      organizationId,
      periodStart,
      periodEnd,
    })

    if (!validation.success) {
      validation.error.errors.forEach((err) => {
        errors.push({
          field: err.path.join("."),
          message: err.message,
          code: "VALIDATION_ERROR",
        })
      })
      return { success: false, errors }
    }

    try {
      // Verify organization exists
      const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
      })

      if (!organization) {
        return {
          success: false,
          errors: [
            {
              field: "organizationId",
              message: "Organization not found",
              code: "NOT_FOUND",
            },
          ],
        }
      }

      // Fetch emissions data for the period
      const emissions = await prisma.emissionResult.findMany({
        where: {
          organizationId,
          periodStart: { gte: periodStart },
          periodEnd: { lte: periodEnd },
        },
        orderBy: [{ periodStart: "asc" }],
      })

      if (emissions.length === 0) {
        return {
          success: false,
          errors: [
            {
              field: "emissions",
              message: "No emissions data found for the specified period",
              code: "NO_DATA",
            },
          ],
        }
      }

      // Aggregate emissions by scope and category
      const byScope: Record<string, number> = {}
      const byCategory: Record<string, number> = {}
      let totalCo2e = 0

      emissions.forEach((emission) => {
        totalCo2e += emission.co2e

        if (!byScope[emission.scope]) {
          byScope[emission.scope] = 0
        }
        byScope[emission.scope] += emission.co2e

        if (!byCategory[emission.category]) {
          byCategory[emission.category] = 0
        }
        byCategory[emission.category] += emission.co2e
      })

      const aggregatedEmissions: AggregatedEmissions = {
        totalCo2e,
        byScope,
        byCategory,
        data: emissions.map((e) => ({
          scope: e.scope,
          category: e.category,
          co2e: e.co2e,
          periodStart: e.periodStart,
          periodEnd: e.periodEnd,
          methodology: e.methodology,
          datasetVersion: e.datasetVersion,
        })),
      }

      return {
        success: true,
        data: aggregatedEmissions,
      }
    } catch (error) {
      return {
        success: false,
        errors: [
          {
            field: "database",
            message: error instanceof Error ? error.message : "Database error occurred",
            code: "DATABASE_ERROR",
          },
        ],
      }
    }
  }

  /**
   * Collect activity data for an organization within a period
   * 
   * @param organizationId - The organization ID
   * @param periodStart - Start date of the reporting period
   * @param periodEnd - End date of the reporting period
   * @returns Activity data with evidence status
   */
  async collectActivityData(
    organizationId: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<CollectionResult<ActivityDataItem[]>> {
    const errors: CollectionError[] = []

    // Validate input data
    const validation = CollectActivityDataSchema.safeParse({
      organizationId,
      periodStart,
      periodEnd,
    })

    if (!validation.success) {
      validation.error.errors.forEach((err) => {
        errors.push({
          field: err.path.join("."),
          message: err.message,
          code: "VALIDATION_ERROR",
        })
      })
      return { success: false, errors }
    }

    try {
      // Verify organization exists
      const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
      })

      if (!organization) {
        return {
          success: false,
          errors: [
            {
              field: "organizationId",
              message: "Organization not found",
              code: "NOT_FOUND",
            },
          ],
        }
      }

      // Fetch activity data for the period
      const activityData = await prisma.rawActivityData.findMany({
        where: {
          organizationId,
          periodStart: { gte: periodStart },
          periodEnd: { lte: periodEnd },
        },
        orderBy: [{ periodStart: "asc" }],
      })

      if (activityData.length === 0) {
        return {
          success: false,
          errors: [
            {
              field: "activityData",
              message: "No activity data found for the specified period",
              code: "NO_DATA",
            },
          ],
        }
      }

      // Transform to ActivityDataItem format with evidence status
      const items: ActivityDataItem[] = activityData.map((activity) => ({
        id: activity.id,
        category: activity.category,
        subcategory: activity.subcategory || undefined,
        activityType: activity.activityType,
        quantity: activity.quantity,
        unit: activity.unit,
        periodStart: activity.periodStart,
        periodEnd: activity.periodEnd,
        status: activity.status,
        source: activity.source || undefined,
        // Evidence is considered present if metadata contains evidence-related fields
        hasEvidence: !!(activity.metadata && 
          typeof activity.metadata === 'object' &&
          'evidence' in activity.metadata),
      }))

      return {
        success: true,
        data: items,
      }
    } catch (error) {
      return {
        success: false,
        errors: [
          {
            field: "database",
            message: error instanceof Error ? error.message : "Database error occurred",
            code: "DATABASE_ERROR",
          },
        ],
      }
    }
  }

  /**
   * Collect organization profile including boundaries, facilities, and metadata
   * 
   * @param organizationId - The organization ID
   * @returns Organization profile with facility count and boundaries
   */
  async collectOrganizationProfile(
    organizationId: string
  ): Promise<CollectionResult<OrganizationProfile>> {
    const errors: CollectionError[] = []

    // Validate input data
    const validation = CollectOrganizationProfileSchema.safeParse({
      organizationId,
    })

    if (!validation.success) {
      validation.error.errors.forEach((err) => {
        errors.push({
          field: err.path.join("."),
          message: err.message,
          code: "VALIDATION_ERROR",
        })
      })
      return { success: false, errors }
    }

    try {
      // Fetch organization with facilities
      const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        include: {
          facilities: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
        },
      })

      if (!organization) {
        return {
          success: false,
          errors: [
            {
              field: "organizationId",
              message: "Organization not found",
              code: "NOT_FOUND",
            },
          ],
        }
      }

      // Build organization profile
      const profile: OrganizationProfile = {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        domain: organization.domain || undefined,
        verified: organization.verified,
        facilitiesCount: organization.facilities.length,
        boundaries: {
          operational: organization.facilities.map((f) => f.name),
          organizational: [organization.name],
        },
        metadata: {
          createdAt: organization.createdAt.toISOString(),
          updatedAt: organization.updatedAt.toISOString(),
          verifiedAt: organization.verifiedAt?.toISOString(),
        },
      }

      return {
        success: true,
        data: profile,
      }
    } catch (error) {
      return {
        success: false,
        errors: [
          {
            field: "database",
            message: error instanceof Error ? error.message : "Database error occurred",
            code: "DATABASE_ERROR",
          },
        ],
      }
    }
  }
}
