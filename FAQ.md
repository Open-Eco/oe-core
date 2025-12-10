# Open Climate Transparency Platform — FAQ

## 1. What is this platform?

It is an open, transparent, nonprofit climate impact platform that allows companies to:

- Measure their carbon emissions
- Submit and publish their sustainability data
- Generate auditable, standards-aligned reports
- Contribute to a global public database of environmental impact

Our mission is simple:

**Climate transparency should not be paywalled.**

## 2. Is the platform really free?

**Yes.**

The platform is fully free to use, with no paid tiers and no locked features. Sustainability should be accessible to every organization, not just those who can afford enterprise software.

## 3. Why is it open source?

Because transparency requires transparency.

- Companies can audit our math
- Researchers can verify our methodologies
- Volunteers can improve the system
- No hidden algorithms
- No proprietary emission factors

Open code and open data build trust — something the climate sector desperately needs.

## 4. Does open source make the platform less secure?

**No.**

Security comes from architecture and governance, not secrecy.

The platform keeps all sensitive operational elements private:

- Authentication secrets
- API keys
- Production configs
- Database credentials
- Org verification details

Open source only exposes the logic, not the secrets.

This is how Linux, OpenSSL, Kubernetes, and every major encryption library operate — and they power the entire internet.

## 5. If the code is public, couldn't someone hack it?

Seeing code doesn't allow someone to:

- Access another company's data
- Impersonate a verified organization
- Submit false emissions for another entity
- Modify historical logs
- Read any private configuration

Security relies on:

- Strong authentication
- Verified organization identities
- Append-only, immutable audit logs
- Strict per-organization permissions
- Robust input validation

Open code does not equal open access.

## 6. What does "transparent data" mean?

It means companies intentionally publish key sustainability data into a public, global database, including:

- Annual emissions (Scopes 1, 2, 3)
- Resource consumption
- Energy use
- Travel and procurement impacts
- Emission factors used
- Methodology version applied

Transparency eliminates greenwashing and allows researchers, policymakers, and the public to see the truth.

## 7. If our data is public, why do we need security at all?

Because we still need to protect:

- **✔ Integrity** — No one can alter your data after submission.
- **✔ Authenticity** — Only verified representatives of your organization can submit data.
- **✔ Accountability** — All updates occur as append-only entries with public audit trails.
- **✔ Accuracy** — Tampering, spoofing, and falsified entries must be prevented.

Security ensures trust in transparent data.

## 8. How do you verify organizations?

Organizations go through a validation process:

- Domain verification (DNS TXT record)
- Corporate email validation
- Optional legal verification (for large enterprises)
- API signing keys (for automated data submission)

This prevents fake companies from polluting the dataset.

## 9. How are emissions or sustainability calculations protected from manipulation?

All calculations are:

- Versioned
- Public
- Open to review
- Mathematically reproducible
- Backed by globally recognized datasets (IPCC, DEFRA, EPA)

Changes require a transparent RFC process and scientific review.

## 10. Who owns the data in the platform?

The submitting organizations own their data. But by submitting, they agree to publicly publish it under an open data license.

This ensures global reuse by:

- Researchers
- NGOs
- Journalists
- Governments
- Supply chain auditors

## 11. Can companies remove or hide past data?

**No.**

Climate data must be historically accurate.

If a correction is needed, companies issue an updated entry, and the correction appears in a public revision log.

This prevents retroactive greenwashing.

## 12. What happens if a company submits false information?

All data is:

- Public
- Permanently logged
- Monitored by a community of researchers
- Subject to correction requests
- Traceable to a verified account

The transparency model discourages manipulation because the exposure is immediate.

## 13. Will this platform integrate with our internal systems?

**Yes.**

You can connect:

- Energy providers
- Accounting software
- Travel platforms
- Procurement systems
- HR/commuting surveys
- ERP (SAP, Oracle)
- Cloud providers

All integrations use secure API keys and follow zero-trust principles.

## 14. How do you prevent breaking changes to our systems?

Through:

- Semantic versioning
- Deprecation periods
- Public RFC review for major updates
- Community governance
- Long-term dataset versioning

No sudden or opaque changes.

## 15. Why should companies use this instead of a paid platform like Watershed?

Because:

- It's free
- It's transparent
- It avoids vendor lock-in
- It's auditable
- It's collaborative
- It's aligned with science, not sales
- It publishes data globally for accountability
- It creates an open ecosystem rather than a proprietary silo

Paid platforms keep climate data hidden. We believe climate accountability belongs to everyone.

## 16. Can researchers, NGOs, or governments use the dataset?

**Yes — freely.**

All published climate data is accessible via:

- Public datasets
- Bulk downloads
- Open APIs
- Versioned archives

The more eyes on the data, the better.

## 17. Isn't this system vulnerable to denial-of-service or spam?

We implement:

- Rate limiting
- CAPTCHA / proof-of-work for public endpoints
- Verified accounts for submissions
- API key restrictions
- Automated anomaly detection

These controls protect against automated abuse.

## 18. What if someone tries to impersonate a company?

**They can't.**

Identity verification includes:

- DNS domain control
- Verified business email domains
- API signing keys
- Optional notarized verification for large enterprises

Impersonation attempts fail at the verification gate.

## 19. Does this count as "open data"?

**Yes** — this platform creates the world's first open, standardized, auditable global climate impact dataset.

This is a public good.

## 20. How does this initiative stay financially sustainable if it's free?

The project is supported by:

- Grants
- Research partnerships
- Donations
- Volunteer contributions
- Open-source community support
- Academic institutions

There are no paywalls, upsells, or premium tiers.
