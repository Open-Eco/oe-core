/**
 * Shared types for the reporting system
 */

export interface EmissionData {
  scope: string
  category: string
  co2e: number
  periodStart: Date
  periodEnd: Date
  methodology: string
  datasetVersion: string
}

export interface AggregatedEmissions {
  totalCo2e: number
  byScope: Record<string, number>
  byCategory: Record<string, number>
  data: EmissionData[]
}

export interface ActivityDataItem {
  id: string
  category: string
  subcategory?: string
  activityType: string
  quantity: number
  unit: string
  periodStart: Date
  periodEnd: Date
  status: string
  source?: string
  hasEvidence: boolean
}

export interface OrganizationProfile {
  id: string
  name: string
  slug: string
  domain?: string
  verified: boolean
  facilitiesCount: number
  boundaries?: {
    facilities: string[]
    organizational: string[]
  }
  metadata?: Record<string, unknown>
}

export interface ReportDataBundle {
  emissions: AggregatedEmissions
  activityData: ActivityDataItem[]
  organization: OrganizationProfile
  periodStart: Date
  periodEnd: Date
  collectedAt: Date
}

export interface CollectionError {
  field: string
  message: string
  code: string
}

export interface CollectionResult<T> {
  success: boolean
  data?: T
  errors?: CollectionError[]
}
