/**
 * Example usage of ReportDataCollector
 * 
 * This file demonstrates how to use the ReportDataCollector to gather
 * data for report generation.
 */

import { ReportDataCollector } from "./collectors"

/**
 * Example: Collecting emissions data
 */
async function exampleCollectEmissions() {
  const collector = new ReportDataCollector()
  
  const result = await collector.collectEmissions(
    "org_123", // organizationId
    new Date("2024-01-01"), // periodStart
    new Date("2024-12-31")  // periodEnd
  )
  
  if (result.success && result.data) {
    console.log("Total CO2e:", result.data.totalCo2e)
    console.log("By Scope:", result.data.byScope)
    console.log("By Category:", result.data.byCategory)
  } else {
    console.error("Errors:", result.errors)
  }
}

/**
 * Example: Collecting activity data
 */
async function exampleCollectActivityData() {
  const collector = new ReportDataCollector()
  
  const result = await collector.collectActivityData(
    "org_123", // organizationId
    new Date("2024-01-01"), // periodStart
    new Date("2024-12-31")  // periodEnd
  )
  
  if (result.success && result.data) {
    console.log(`Found ${result.data.length} activity records`)
    result.data.forEach(item => {
      console.log(`- ${item.activityType}: ${item.quantity} ${item.unit}`)
      console.log(`  Evidence: ${item.hasEvidence ? "Yes" : "No"}`)
    })
  } else {
    console.error("Errors:", result.errors)
  }
}

/**
 * Example: Collecting organization profile
 */
async function exampleCollectOrganizationProfile() {
  const collector = new ReportDataCollector()
  
  const result = await collector.collectOrganizationProfile("org_123")
  
  if (result.success && result.data) {
    console.log("Organization:", result.data.name)
    console.log("Verified:", result.data.verified)
    console.log("Facilities:", result.data.facilitiesCount)
    console.log("Boundaries:", result.data.boundaries)
  } else {
    console.error("Errors:", result.errors)
  }
}

/**
 * Example: Complete report data bundle collection
 */
async function exampleCollectReportBundle() {
  const collector = new ReportDataCollector()
  const organizationId = "org_123"
  const periodStart = new Date("2024-01-01")
  const periodEnd = new Date("2024-12-31")
  
  // Collect all data for a report
  const [emissionsResult, activityResult, profileResult] = await Promise.all([
    collector.collectEmissions(organizationId, periodStart, periodEnd),
    collector.collectActivityData(organizationId, periodStart, periodEnd),
    collector.collectOrganizationProfile(organizationId),
  ])
  
  // Check if all collections were successful
  if (!emissionsResult.success) {
    console.error("Emissions collection failed:", emissionsResult.errors)
    return
  }
  
  if (!activityResult.success) {
    console.error("Activity data collection failed:", activityResult.errors)
    return
  }
  
  if (!profileResult.success) {
    console.error("Organization profile collection failed:", profileResult.errors)
    return
  }
  
  // All data collected successfully
  const reportBundle = {
    emissions: emissionsResult.data!,
    activityData: activityResult.data!,
    organization: profileResult.data!,
    periodStart,
    periodEnd,
    collectedAt: new Date(),
  }
  
  console.log("Report bundle ready:", {
    totalEmissions: reportBundle.emissions.totalCo2e,
    activityRecords: reportBundle.activityData.length,
    organization: reportBundle.organization.name,
  })
  
  return reportBundle
}

// Note: These examples are for demonstration purposes only.
// In a real application, you would call these methods from your API routes
// or background job processors.
