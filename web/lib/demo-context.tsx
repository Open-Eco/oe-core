"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

/**
 * Demo Context Provider
 *
 * Provides demo functionality using browser sessionStorage for data persistence.
 * This works in both local development and hosted environments (e.g., Vercel).
 *
 * Demo data characteristics:
 * - Stored in browser sessionStorage (client-side only)
 * - Persists during browser session
 * - Cleared when browser session ends or user clears storage
 * - No server-side persistence required
 * - Compatible with hosted demo instances
 */

// Demo data types
export type DemoOrganization = {
  id: string;
  name: string;
  slug: string;
  verified: boolean;
  createdAt: string;
};

export type DemoFacility = {
  id: string;
  organizationId: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  createdAt: string;
};

export type DemoActivity = {
  id: string;
  organizationId: string;
  facilityId?: string;
  category: string;
  subcategory?: string;
  activityType: string;
  quantity: number;
  unit: string;
  periodStart: string;
  periodEnd: string;
  source: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

type DemoContextType = {
  organizations: DemoOrganization[];
  facilities: DemoFacility[];
  activities: DemoActivity[];
  currentOrgId: string | null;
  setCurrentOrgId: (id: string | null) => void;
  createOrganization: (name: string, slug: string) => DemoOrganization;
  createFacility: (organizationId: string, name: string, address?: string, city?: string, country?: string) => DemoFacility;
  createActivity: (activity: Omit<DemoActivity, "id" | "createdAt">) => DemoActivity;
  getActivitiesByOrg: (organizationId: string) => DemoActivity[];
  getFacilitiesByOrg: (organizationId: string) => DemoFacility[];
  clearDemo: () => void;
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const STORAGE_KEY = "openeco_demo_data";

// ── Seed data ────────────────────────────────────────────────────────────────

const SEED_ORG_ID = "demo_seed_org_acme";
const SEED_FACILITY_HQ = "demo_seed_facility_hq";
const SEED_FACILITY_BERLIN = "demo_seed_facility_berlin";
const SEED_FACILITY_MANCHESTER = "demo_seed_facility_manchester";

function buildSeedData(): {
  organizations: DemoOrganization[];
  facilities: DemoFacility[];
  activities: DemoActivity[];
  currentOrgId: string;
} {
  const now = new Date("2024-01-01T00:00:00Z");

  const organizations: DemoOrganization[] = [
    {
      id: SEED_ORG_ID,
      name: "Acme Corporation",
      slug: "acme-corp",
      verified: true,
      createdAt: now.toISOString(),
    },
  ];

  const facilities: DemoFacility[] = [
    {
      id: SEED_FACILITY_HQ,
      organizationId: SEED_ORG_ID,
      name: "HQ – London",
      address: "1 Canada Square",
      city: "London",
      country: "United Kingdom",
      createdAt: now.toISOString(),
    },
    {
      id: SEED_FACILITY_BERLIN,
      organizationId: SEED_ORG_ID,
      name: "Berlin Office",
      address: "Unter den Linden 1",
      city: "Berlin",
      country: "Germany",
      createdAt: now.toISOString(),
    },
    {
      id: SEED_FACILITY_MANCHESTER,
      organizationId: SEED_ORG_ID,
      name: "Manchester Plant",
      address: "Trafford Park Road",
      city: "Manchester",
      country: "United Kingdom",
      createdAt: now.toISOString(),
    },
  ];

  const makeId = (n: number) => `demo_seed_activity_${n}`;
  const period = (month: number) => ({
    periodStart: new Date(2024, month - 1, 1).toISOString(),
    periodEnd: new Date(2024, month, 0).toISOString(),
  });

  const activities: DemoActivity[] = [
    // Electricity – HQ
    { id: makeId(1), organizationId: SEED_ORG_ID, facilityId: SEED_FACILITY_HQ, category: "electricity", activityType: "electricity_grid", quantity: 12500, unit: "kWh", ...period(1), source: "manual", createdAt: now.toISOString() },
    { id: makeId(2), organizationId: SEED_ORG_ID, facilityId: SEED_FACILITY_HQ, category: "electricity", activityType: "electricity_grid", quantity: 11800, unit: "kWh", ...period(2), source: "manual", createdAt: now.toISOString() },
    { id: makeId(3), organizationId: SEED_ORG_ID, facilityId: SEED_FACILITY_HQ, category: "electricity", activityType: "electricity_grid", quantity: 13200, unit: "kWh", ...period(3), source: "manual", createdAt: now.toISOString() },
    // Electricity – Berlin
    { id: makeId(4), organizationId: SEED_ORG_ID, facilityId: SEED_FACILITY_BERLIN, category: "electricity", activityType: "electricity_grid", quantity: 8400, unit: "kWh", ...period(1), source: "manual", createdAt: now.toISOString() },
    { id: makeId(5), organizationId: SEED_ORG_ID, facilityId: SEED_FACILITY_BERLIN, category: "electricity", activityType: "electricity_grid", quantity: 7900, unit: "kWh", ...period(2), source: "manual", createdAt: now.toISOString() },
    // Fuel – Manufacturing Plant
    { id: makeId(6), organizationId: SEED_ORG_ID, facilityId: SEED_FACILITY_MANCHESTER, category: "fuel", activityType: "natural_gas", quantity: 4200, unit: "m³", ...period(1), source: "manual", createdAt: now.toISOString() },
    { id: makeId(7), organizationId: SEED_ORG_ID, facilityId: SEED_FACILITY_MANCHESTER, category: "fuel", activityType: "natural_gas", quantity: 3900, unit: "m³", ...period(2), source: "manual", createdAt: now.toISOString() },
    { id: makeId(8), organizationId: SEED_ORG_ID, facilityId: SEED_FACILITY_MANCHESTER, category: "fuel", activityType: "diesel", quantity: 1800, unit: "litres", ...period(1), source: "manual", createdAt: now.toISOString() },
    // Water
    { id: makeId(9), organizationId: SEED_ORG_ID, facilityId: SEED_FACILITY_HQ, category: "water", activityType: "water_supply", quantity: 320, unit: "m³", ...period(1), source: "manual", createdAt: now.toISOString() },
    { id: makeId(10), organizationId: SEED_ORG_ID, facilityId: SEED_FACILITY_MANCHESTER, category: "water", activityType: "water_supply", quantity: 980, unit: "m³", ...period(1), source: "manual", createdAt: now.toISOString() },
    // Waste
    { id: makeId(11), organizationId: SEED_ORG_ID, facilityId: SEED_FACILITY_MANCHESTER, category: "waste", activityType: "landfill", quantity: 4.2, unit: "tonnes", ...period(1), source: "manual", createdAt: now.toISOString() },
    { id: makeId(12), organizationId: SEED_ORG_ID, facilityId: SEED_FACILITY_HQ, category: "waste", activityType: "recycling", quantity: 1.8, unit: "tonnes", ...period(1), source: "manual", createdAt: now.toISOString() },
    // Corporate Travel
    { id: makeId(13), organizationId: SEED_ORG_ID, category: "corporate_travel", activityType: "flights_long_haul", quantity: 24, unit: "flights", ...period(1), source: "manual", createdAt: now.toISOString() },
    { id: makeId(14), organizationId: SEED_ORG_ID, category: "corporate_travel", activityType: "flights_short_haul", quantity: 62, unit: "flights", ...period(1), source: "manual", createdAt: now.toISOString() },
    // Supply Chain
    { id: makeId(15), organizationId: SEED_ORG_ID, category: "supply_chain", activityType: "purchased_goods", quantity: 185000, unit: "GBP", ...period(1), source: "manual", createdAt: now.toISOString() },
    { id: makeId(16), organizationId: SEED_ORG_ID, category: "supply_chain", activityType: "purchased_goods", quantity: 210000, unit: "GBP", ...period(2), source: "manual", createdAt: now.toISOString() },
    // Installations
    { id: makeId(17), organizationId: SEED_ORG_ID, facilityId: SEED_FACILITY_MANCHESTER, category: "installations", activityType: "refrigerants_r410a", quantity: 3.5, unit: "kg", ...period(1), source: "manual", createdAt: now.toISOString() },
  ];

  return { organizations, facilities, activities, currentOrgId: SEED_ORG_ID };
}

// ── Storage helpers ───────────────────────────────────────────────────────────

function loadFromStorage(): {
  organizations: DemoOrganization[];
  facilities: DemoFacility[];
  activities: DemoActivity[];
  currentOrgId: string | null;
} {
  if (typeof window === "undefined") {
    return { organizations: [], facilities: [], activities: [], currentOrgId: null };
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error("Error loading demo data from storage:", err);
  }

  return { organizations: [], facilities: [], activities: [], currentOrgId: null };
}

function saveToStorage(data: {
  organizations: DemoOrganization[];
  facilities: DemoFacility[];
  activities: DemoActivity[];
  currentOrgId: string | null;
}) {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Error saving demo data to storage:", err);
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function DemoProvider({ children }: { children: ReactNode }) {
  const [organizations, setOrganizations] = useState<DemoOrganization[]>([]);
  const [facilities, setFacilities] = useState<DemoFacility[]>([]);
  const [activities, setActivities] = useState<DemoActivity[]>([]);
  const [currentOrgId, setCurrentOrgIdState] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Load from sessionStorage on mount; seed with demo data if none exists
  useEffect(() => {
    const loaded = loadFromStorage();

    if (loaded.organizations.length === 0) {
      // First visit – pre-populate with realistic seed data
      const seed = buildSeedData();
      setOrganizations(seed.organizations);
      setFacilities(seed.facilities);
      setActivities(seed.activities);
      setCurrentOrgIdState(seed.currentOrgId);
    } else {
      setOrganizations(loaded.organizations);
      setFacilities(loaded.facilities);
      setActivities(loaded.activities);
      setCurrentOrgIdState(loaded.currentOrgId);
    }

    setInitialized(true);
  }, []);

  // Save to sessionStorage whenever data changes
  useEffect(() => {
    if (initialized) {
      saveToStorage({
        organizations,
        facilities,
        activities,
        currentOrgId,
      });
    }
  }, [organizations, facilities, activities, currentOrgId, initialized]);

  const setCurrentOrgId = (id: string | null) => {
    setCurrentOrgIdState(id);
  };

  const createOrganization = (name: string, slug: string): DemoOrganization => {
    const org: DemoOrganization = {
      id: `demo_org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      slug,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    setOrganizations((prev) => [...prev, org]);
    setCurrentOrgId(org.id);
    return org;
  };

  const createFacility = (
    organizationId: string,
    name: string,
    address?: string,
    city?: string,
    country?: string
  ): DemoFacility => {
    const facility: DemoFacility = {
      id: `demo_facility_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      organizationId,
      name,
      address,
      city,
      country,
      createdAt: new Date().toISOString(),
    };
    setFacilities((prev) => [...prev, facility]);
    return facility;
  };

  const createActivity = (activity: Omit<DemoActivity, "id" | "createdAt">): DemoActivity => {
    const newActivity: DemoActivity = {
      ...activity,
      id: `demo_activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setActivities((prev) => [...prev, newActivity]);
    return newActivity;
  };

  const getActivitiesByOrg = (organizationId: string): DemoActivity[] => {
    return activities.filter((a) => a.organizationId === organizationId);
  };

  const getFacilitiesByOrg = (organizationId: string): DemoFacility[] => {
    return facilities.filter((f) => f.organizationId === organizationId);
  };

  const clearDemo = () => {
    setOrganizations([]);
    setFacilities([]);
    setActivities([]);
    setCurrentOrgId(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <DemoContext.Provider
      value={{
        organizations,
        facilities,
        activities,
        currentOrgId,
        setCurrentOrgId,
        createOrganization,
        createFacility,
        createActivity,
        getActivitiesByOrg,
        getFacilitiesByOrg,
        clearDemo,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
}

