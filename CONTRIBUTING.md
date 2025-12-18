# Contributing to OpenEco

First off, thank you for your interest in contributing to OpenEco.

OpenEco is an open-source, enterprise-grade climate transparency platform. This project sits at the intersection of **emissions accounting**, **governance**, and **open infrastructure for trust**. Contributions here directly shape how organizations measure and disclose their climate impact.

---

## 1. Ground Rules

- Be respectful and collaborative.
- Favor transparency over implicit behavior.
- Document decisions (especially around methodologies and factors).
- Keep the **GHG Protocol, auditability, and reproducibility** in mind at all times.

If you’re unsure about anything, open a GitHub Issue or Discussion before investing a lot of time.

---

## 2. Code of Conduct

This project follows the standard expectations of open-source collaboration:

- Treat all community members with respect.
- No harassment, personal attacks, or discriminatory behavior.
- Assume good intent; critique ideas, not people.

If you experience or witness unacceptable behavior, please contact the maintainers via the GitHub repository (Issues or private contact details if provided there).

---

## 3. How to Contribute

### 3.1. Reporting Bugs

1. Search existing issues to see if it’s already reported.
2. If not, open a **Bug report** and include:
   - What you were doing
   - What you expected to happen
   - What actually happened
   - Steps to reproduce
   - Environment details (OS, Node.js version, database, deployment model)

### 3.2. Proposing Features or Methodology Changes

Because OpenEco is **audit- and methodology-sensitive**, feature and methodology changes should start with an issue or RFC:

1. Open a **Feature request** issue describing:
   - Problem / user need
   - Proposed solution
   - Any relevant standards (GHG Protocol, IPCC, DEFRA, EPA, SBTi, etc.)
2. For larger changes (especially anything touching calculation logic, factors, or reporting frameworks), open or update an RFC under `docs/rfcs/` (if present) and link it from the issue.

### 3.3. Submitting Code Changes

1. **Fork** the repo or create a feature branch in the main repo if you have permission.
2. Create a branch:
   ```bash
   git checkout -b feature/my-change
   ```
3. Make your changes:
   - Follow existing patterns and architecture (`ARCHITECTURE.md`, `OPEN_SOURCE_PLAYBOOK.md`, `Reporting_enginer.md`).
   - Keep changes focused and reasonably small.
4. Run tests / checks where applicable:
   ```bash
   cd web
   npm run lint
   npm run build   # or relevant test commands
   ```
5. Commit with a clear message:
   ```bash
   git commit -m "feat: add XYZ"  # or chore/fix/docs/etc.
   ```
6. Open a **Pull Request** against the `main` branch:
   - Describe *what* you changed and *why*.
   - Note any behavior changes or migration impacts.
   - Link to any related issues or RFCs.

A maintainer will review your PR, request changes if needed, and merge when ready.

### 3.4. Issue Labels & Priority

We use GitHub issue labels to help triage and focus work:

- **High Priority**: Must-address items for the upcoming milestone or that block core use cases (e.g., security issues, data integrity bugs, critical feature gaps for enterprise credibility).
- **Medium Priority**: Important enhancements or bugs that materially improve usability, coverage, or performance, but are not blocking current deployments.
- **Low Priority**: Nice-to-have improvements, minor UI polish, or long-term ideas that can be scheduled opportunistically.

When you open an issue, feel free to suggest a priority, but maintainers may adjust labels based on overall roadmap and capacity.

---

## 4. Development Environment

See `INSTALLATION.md` for detailed setup instructions. In short:

```bash
# Clone and install
git clone https://github.com/Open-Eco/oe-core.git
cd oe-core/web
npm install

# Configure env
cp .env.example .env.local
# Edit DATABASE_URL, NEXTAUTH_SECRET, etc.

# Run database migrations
npx prisma db push

# Start dev server
npm run dev
```

We aim to keep local setup as close as possible to the container/Kubernetes deployments described in `INSTALLATION.md`.

---

## 5. Licensing & Ownership

### 5.1. Project License

- **Code** in this repository is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0-only)**.
- Certain documentation or data sets may use more permissive content licenses (e.g., CC-BY or CC0) as noted in the respective files.

### 5.2. Your Contributions

> **Important:** By contributing, you agree to license your contributions under the project license and to allow the OpenEco organization to steward the project legally.

When you submit a contribution (code, documentation, or other materials) to this repository, you agree that:

1. **You have the right to contribute the material.**
   - You wrote it yourself; or
   - Your employer or rights holder has authorized you to contribute it under these terms.
2. **You license your contribution under AGPL-3.0-only**, consistent with the rest of the codebase.
3. **You grant the OpenEco organization a broad right to use your contribution**, including the right to:
   - Copy, modify, distribute, and sublicense it as part of the project; and
   - Re-license the project as a whole in the future if needed, while preserving AGPL obligations for existing versions.

If you are contributing on behalf of an organization, you confirm that you are authorized to do so and that your organization agrees to these terms.

> This section is a practical, lightweight alternative to a formal paper CLA. For substantial or high-risk contributions (e.g., complex IP, patented methods), maintainers may still request a separate, signed agreement.

---

## 6. Methodology & Factor Changes

Changes affecting **calculation algorithms, emission factors, or reporting methodologies** require extra care, because they impact:

- GHG Protocol alignment
- Auditability and reproducibility
- Regulatory defensibility for users

When proposing such changes, please:

1. Clearly reference relevant standards or guidance (e.g., GHG Protocol, IPCC, DEFRA, EPA, SBTi).
2. Document the rationale and expected impact in the PR and/or an RFC.
3. Include or update **test vectors** where possible:
   - Given input activity data
   - Given factor set
   - Expected emissions output

Maintainers may route these changes through a more formal review process (e.g., `docs/rfcs/`, designated methodology reviewers).

---

## 7. Security & Responsible Disclosure

If you find a security vulnerability:

1. **Do not open a public GitHub issue** with sensitive details.
2. Follow the instructions in `SECURITY_AND_GOVERNANCE.md` (or `SECURITY.md` if present) for responsible disclosure.
3. Provide enough detail for maintainers to reproduce and assess impact.

We will work with you to validate the issue, determine impact, and coordinate disclosure as appropriate.

---

## 8. Questions?

If anything here is unclear or you’re unsure how best to contribute:

- Open a **GitHub Discussion** or **Issue** with the `question` label.
- Or comment directly on a relevant issue/PR.

We’re excited to build an open, credible climate transparency platform with you.