"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo-context";

type Organization = {
  id: string;
  name: string;
};

type Facility = {
  id: string;
  name: string;
};

type Activity = {
  id: string;
  category: string;
  activityType: string;
  quantity: number;
  unit: string;
  periodStart: string;
  periodEnd: string;
  facility?: Facility | null;
};

export default function DemoActivityPage() {
  const router = useRouter();
  const {
    organizations,
    facilities,
    currentOrgId,
    setCurrentOrgId,
    getFacilitiesByOrg,
    getActivitiesByOrg,
    createActivity,
  } = useDemo();

  const selectedOrgId = currentOrgId || "";

  const [category, setCategory] = useState<string>("electricity");
  const [activityType, setActivityType] = useState<string>("electricity_grid");
  const [facilityId, setFacilityId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [unit, setUnit] = useState<string>("kWh");
  const [periodStart, setPeriodStart] = useState<string>("");
  const [periodEnd, setPeriodEnd] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  useEffect(() => {
    if (organizations.length === 0) {
      router.push("/demo/organizations/new");
    } else if (!currentOrgId && organizations.length > 0) {
      setCurrentOrgId(organizations[0].id);
    }
  }, [organizations, currentOrgId, router, setCurrentOrgId]);

  // Get facilities and activities for current org
  const orgFacilities = selectedOrgId
    ? getFacilitiesByOrg(selectedOrgId)
    : [];
  const recentActivities = selectedOrgId
    ? getActivitiesByOrg(selectedOrgId)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedOrgId) {
      setError("Please select an organization first.");
      return;
    }

    if (!quantity || !periodStart || !periodEnd) {
      setError("Please fill in quantity and date range.");
      return;
    }

    setSubmitting(true);

    try {
      createActivity({
        organizationId: selectedOrgId,
        facilityId: facilityId || undefined,
        category,
        subcategory: undefined,
        activityType,
        quantity: Number(quantity),
        unit,
        periodStart: new Date(periodStart).toISOString(),
        periodEnd: new Date(periodEnd).toISOString(),
        source: "manual",
        metadata: {
          demo: true,
        },
      });

      setSuccess("Activity recorded.");
      setQuantity("");
      setUnit("kWh");
      setActivityType("electricity_grid");
      setPeriodStart("");
      setPeriodEnd("");
    } catch (err) {
      console.error("Error creating activity", err);
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (organizations.length === 0) {
    return (
      <div className="eco-app-shell__loading">
        <span>Redirecting…</span>
      </div>
    );
  }

  return (
    <section className="eco-page">
      <header className="eco-page__header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <button
              onClick={() => router.push("/demo/dashboard")}
              className="eco-button eco-button--ghost"
              style={{ padding: "0.375rem 0.75rem", fontSize: "0.875rem" }}
            >
              ← Back to dashboard
            </button>
          </div>
          <h2 className="eco-page__title">Demo Activity Entry</h2>
          <p className="eco-page__subtitle">
            Quickly record a few activities to see how data flows through the
            system.
          </p>
        </div>
      </header>

      <div className="eco-page__layout eco-page__layout--split">
        <div className="eco-page__section">
          <div className="eco-page__section-header">
            <h3 className="eco-page__section-title">New Activity</h3>
          </div>

          <form className="eco-form" onSubmit={handleSubmit}>
            <div className="eco-form__group">
              <label className="eco-label" htmlFor="org">
                Organization
              </label>
              <select
                id="org"
                className="eco-select__input"
                value={selectedOrgId}
                onChange={(e) => setCurrentOrgId(e.target.value)}
              >
                {organizations.length === 0 && (
                  <option value="">No organizations found</option>
                )}
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="eco-form__group">
              <label className="eco-label" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className="eco-select__input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="electricity">Electricity</option>
                <option value="fuel">Fuel</option>
                <option value="water">Water</option>
                <option value="waste">Waste</option>
                <option value="installations">Installations</option>
                <option value="marketing">Marketing</option>
                <option value="supply_chain">Supply Chain</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="eco-form__group">
              <label className="eco-label" htmlFor="activityType">
                Activity type
              </label>
              <input
                id="activityType"
                className="eco-input"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                placeholder="e.g., electricity_grid"
              />
            </div>

            <div className="eco-form__group">
              <label className="eco-label" htmlFor="facility">
                Facility (optional)
              </label>
              <select
                id="facility"
                className="eco-select__input"
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
              >
                <option value="">No facility</option>
                {orgFacilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="eco-form__group eco-form__group--inline">
              <div>
                <label className="eco-label" htmlFor="quantity">
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  className="eco-input"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="e.g., 1200"
                />
              </div>
              <div>
                <label className="eco-label" htmlFor="unit">
                  Unit
                </label>
                <input
                  id="unit"
                  className="eco-input"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g., kWh"
                />
              </div>
            </div>

            <div className="eco-form__group eco-form__group--inline">
              <div>
                <label className="eco-label" htmlFor="periodStart">
                  Start date
                </label>
                <input
                  id="periodStart"
                  type="date"
                  className="eco-date-input"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                />
              </div>
              <div>
                <label className="eco-label" htmlFor="periodEnd">
                  End date
                </label>
                <input
                  id="periodEnd"
                  type="date"
                  className="eco-date-input"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="eco-form__error">{error}</p>}
            {success && <p className="eco-form__success">{success}</p>}

            <div className="eco-form__actions">
              <button
                type="submit"
                className="eco-button eco-button--primary"
                disabled={submitting}
              >
                {submitting ? "Saving…" : "Record activity"}
              </button>
            </div>
          </form>
        </div>

        <div className="eco-page__section">
          <div className="eco-page__section-header">
            <h3 className="eco-page__section-title">Recent Demo Activities</h3>
          </div>

          {recentActivities.length === 0 ? (
            <div className="eco-empty-state">
              <p className="eco-empty-state__text">
                No activity yet. Add your first record on the left.
              </p>
            </div>
          ) : (
            <div className="eco-table eco-table--compact">
              <div className="eco-table__header">
                <div>Category</div>
                <div>Activity</div>
                <div>Quantity</div>
                <div>Period</div>
              </div>
              <div className="eco-table__body">
                {recentActivities.slice(0, 10).map((a) => (
                  <div key={a.id} className="eco-table__row">
                    <div>{a.category}</div>
                    <div>{a.activityType}</div>
                    <div>
                      {a.quantity} {a.unit}
                    </div>
                    <div>
                      {new Date(a.periodStart).toLocaleDateString()} –{" "}
                      {new Date(a.periodEnd).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


