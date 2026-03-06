"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

/**
 * Demo Context Provider
 * 
 * Provides demo functionality using browser sessionStorage for data persistence.
 * This works in both local development and hosted environments (e.g., Pterodactyl).
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

type DemoState = {
  organizations: DemoOrganization[];
  facilities: DemoFacility[];
  activities: DemoActivity[];
  currentOrgId: string | null;
  initialized: boolean;
};

type DemoAction =
  | { type: "INIT"; payload: Omit<DemoState, "initialized"> }
  | { type: "SET_CURRENT_ORG"; id: string | null }
  | { type: "ADD_ORGANIZATION"; org: DemoOrganization }
  | { type: "ADD_FACILITY"; facility: DemoFacility }
  | { type: "ADD_ACTIVITY"; activity: DemoActivity }
  | { type: "CLEAR" };

function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "INIT":
      return { ...action.payload, initialized: true };
    case "SET_CURRENT_ORG":
      return { ...state, currentOrgId: action.id };
    case "ADD_ORGANIZATION":
      return {
        ...state,
        organizations: [...state.organizations, action.org],
        currentOrgId: action.org.id,
      };
    case "ADD_FACILITY":
      return { ...state, facilities: [...state.facilities, action.facility] };
    case "ADD_ACTIVITY":
      return { ...state, activities: [...state.activities, action.activity] };
    case "CLEAR":
      return {
        organizations: [],
        facilities: [],
        activities: [],
        currentOrgId: null,
        initialized: true,
      };
  }
}

const initialDemoState: DemoState = {
  organizations: [],
  facilities: [],
  activities: [],
  currentOrgId: null,
  initialized: false,
};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState);

  // Load from sessionStorage on mount – dispatch a single action (avoids set-state-in-effect lint rule)
  useEffect(() => {
    const loaded = loadFromStorage();
    dispatch({ type: "INIT", payload: loaded });
  }, []);

  // Save to sessionStorage whenever data changes
  useEffect(() => {
    if (state.initialized) {
      saveToStorage({
        organizations: state.organizations,
        facilities: state.facilities,
        activities: state.activities,
        currentOrgId: state.currentOrgId,
      });
    }
  }, [state.organizations, state.facilities, state.activities, state.currentOrgId, state.initialized]);

  const setCurrentOrgId = (id: string | null) => {
    dispatch({ type: "SET_CURRENT_ORG", id });
  };

  const createOrganization = (name: string, slug: string): DemoOrganization => {
    const org: DemoOrganization = {
      id: `demo_org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      slug,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_ORGANIZATION", org });
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
    dispatch({ type: "ADD_FACILITY", facility });
    return facility;
  };

  const createActivity = (activity: Omit<DemoActivity, "id" | "createdAt">): DemoActivity => {
    const newActivity: DemoActivity = {
      ...activity,
      id: `demo_activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_ACTIVITY", activity: newActivity });
    return newActivity;
  };

  const getActivitiesByOrg = (organizationId: string): DemoActivity[] => {
    return state.activities.filter((a) => a.organizationId === organizationId);
  };

  const getFacilitiesByOrg = (organizationId: string): DemoFacility[] => {
    return state.facilities.filter((f) => f.organizationId === organizationId);
  };

  const clearDemo = () => {
    dispatch({ type: "CLEAR" });
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <DemoContext.Provider
      value={{
        organizations: state.organizations,
        facilities: state.facilities,
        activities: state.activities,
        currentOrgId: state.currentOrgId,
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

