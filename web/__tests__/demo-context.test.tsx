/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DemoProvider, useDemo } from "../lib/demo-context";

// Helper component that exposes context values via data-testid attributes
function DemoConsumer() {
  const {
    organizations,
    facilities,
    activities,
    currentOrgId,
    getActivitiesByOrg,
    getFacilitiesByOrg,
  } = useDemo();

  const orgActivities = currentOrgId ? getActivitiesByOrg(currentOrgId) : [];
  const orgFacilities = currentOrgId ? getFacilitiesByOrg(currentOrgId) : [];

  return (
    <div>
      <span data-testid="org-count">{organizations.length}</span>
      <span data-testid="facility-count">{facilities.length}</span>
      <span data-testid="activity-count">{activities.length}</span>
      <span data-testid="current-org-id">{currentOrgId ?? ""}</span>
      <span data-testid="org-activity-count">{orgActivities.length}</span>
      <span data-testid="org-facility-count">{orgFacilities.length}</span>
      {organizations.map((o) => (
        <span key={o.id} data-testid={`org-name-${o.id}`}>
          {o.name}
        </span>
      ))}
    </div>
  );
}

// Seed data is loaded from sessionStorage on mount. We clear it before each test.
beforeEach(() => {
  sessionStorage.clear();
});

describe("DemoProvider – seed data", () => {
  it("auto-seeds one organization on first visit", async () => {
    await act(async () => {
      render(
        <DemoProvider>
          <DemoConsumer />
        </DemoProvider>
      );
    });

    expect(screen.getByTestId("org-count").textContent).toBe("1");
  });

  it("seeds 'Acme Corporation' as the default organization", async () => {
    await act(async () => {
      render(
        <DemoProvider>
          <DemoConsumer />
        </DemoProvider>
      );
    });

    const orgId = screen.getByTestId("current-org-id").textContent ?? "";
    expect(orgId).toBeTruthy();
    expect(screen.getByTestId(`org-name-${orgId}`).textContent).toBe(
      "Acme Corporation"
    );
  });

  it("seeds at least 3 facilities", async () => {
    await act(async () => {
      render(
        <DemoProvider>
          <DemoConsumer />
        </DemoProvider>
      );
    });

    const count = Number(screen.getByTestId("facility-count").textContent);
    expect(count).toBeGreaterThanOrEqual(3);
  });

  it("seeds at least 10 activities", async () => {
    await act(async () => {
      render(
        <DemoProvider>
          <DemoConsumer />
        </DemoProvider>
      );
    });

    const count = Number(screen.getByTestId("activity-count").textContent);
    expect(count).toBeGreaterThanOrEqual(10);
  });

  it("associates all seeded activities with the default org", async () => {
    await act(async () => {
      render(
        <DemoProvider>
          <DemoConsumer />
        </DemoProvider>
      );
    });

    const totalActivities = Number(screen.getByTestId("activity-count").textContent);
    const orgActivities = Number(screen.getByTestId("org-activity-count").textContent);
    expect(orgActivities).toBe(totalActivities);
  });

  it("associates all seeded facilities with the default org", async () => {
    await act(async () => {
      render(
        <DemoProvider>
          <DemoConsumer />
        </DemoProvider>
      );
    });

    const totalFacilities = Number(screen.getByTestId("facility-count").textContent);
    const orgFacilities = Number(screen.getByTestId("org-facility-count").textContent);
    expect(orgFacilities).toBe(totalFacilities);
  });

  it("persists seed data to sessionStorage", async () => {
    await act(async () => {
      render(
        <DemoProvider>
          <DemoConsumer />
        </DemoProvider>
      );
    });

    const stored = sessionStorage.getItem("openeco_demo_data");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.organizations).toHaveLength(1);
    expect(parsed.organizations[0].name).toBe("Acme Corporation");
  });

  it("does not re-seed when data already exists in sessionStorage", async () => {
    // Pre-populate storage with existing org
    sessionStorage.setItem(
      "openeco_demo_data",
      JSON.stringify({
        organizations: [
          { id: "existing_org", name: "Existing Corp", slug: "existing", verified: false, createdAt: new Date().toISOString() },
        ],
        facilities: [],
        activities: [],
        currentOrgId: "existing_org",
      })
    );

    await act(async () => {
      render(
        <DemoProvider>
          <DemoConsumer />
        </DemoProvider>
      );
    });

    // Should still have only the pre-existing org, not the seed org too
    expect(screen.getByTestId("org-count").textContent).toBe("1");
    const orgId = screen.getByTestId("current-org-id").textContent ?? "";
    expect(screen.getByTestId(`org-name-${orgId}`).textContent).toBe("Existing Corp");
  });
});
