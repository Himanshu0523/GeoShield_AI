# GeoShield AI — Official Human-Made Command Center UI/UX Specification

## 0. Core Principle: Designed Around Decisions, Not Screens

GeoShield AI is designed around a fundamental operational loop:

```text
OBSERVE ──> UNDERSTAND ──> PRIORITIZE ──> ACT ──> VERIFY ──> LEARN
```

Every UI component must answer one of these operational requirements:
1. **Observe**: What is happening?
2. **Understand**: Why is it happening and what changed?
3. **Prioritize**: What needs attention first?
4. **Act**: What operational step can be taken?
5. **Verify**: Did the action take effect?
6. **Learn**: How does the model update based on ground-truth evidence?

---

## 1. Situation Awareness Layer
Every major view begins with a high-level Situation Summary rather than requiring operators to stitch data together from isolated cards.
- Displays current risk state, recent delta (e.g. `+18% flood risk`, `-12% road access`), and exact timestamp of the last assessment.

---

## 2. "Why This Matters" Context
Metrics must always include context and attribution.
- Avoid showing standalone numbers (e.g. `82`).
- Always show bounds, trend, and contributing factors (e.g., `82 / 100 HIGH · ↑ 11 points since 06:00 · Primary triggers: 74mm rain, soil saturation`).

---

## 3. Decision Density
Prioritize decision-relevant information over administrative analytics.
- Focus on active hazard dispatches, high-risk sectors, blocked corridors, exposed populations, and pending field verifications.
- Omit vanity statistics (e.g., total database rows, raw API hit counters).

---

## 4. Change Over Time Everywhere
Pair critical values with trend indicators:
- `↑ Rapidly Increasing`, `→ Stable`, or `↓ Improving`.
- Always satisfy three operator questions:
  1. What is it?
  2. What was it?
  3. Where is it heading?

---

## 5. First-Class Data Freshness
Telemetry freshness is explicitly displayed on every card and data table:
- Display exact timestamp (e.g. `Updated 08:31 IST`), source name (`Open-Meteo`), and age status (`● Live`, `⚠ 44m stale`).

---

## 6. Source Transparency & Explainability
Multi-source inputs are explicitly attributed:
- Display model confidence score alongside feature contributions (e.g., `Rainfall +31%`, `Soil moisture +24%`, `Field observations +14%`).

---

## 7. Explicit Human Override
Operators must have explicit mechanisms to review and override ML recommendations:
- Record operator overrides with rationale and timestamp (e.g., `⚠ Manual Override: Model HIGH → Operator CRITICAL by Cmdr. Sharma`).

---

## 8. Complete Evidence Trail
Operational actions maintain an chronological audit trail:
- Log detection, threshold trigger, automated notification, operator acknowledgment, field verification, and escalation history.

---

## 9. Progressive Disclosure
Structure information across three depth levels:
- **Level 1 (Immediate)**: High-level risk score, affected corridors, active alerts.
- **Level 2 (Context)**: Rainfall breakdown, soil saturation, slope physics, population exposure.
- **Level 3 (Technical Evidence)**: Model versioning, feature weights, confidence metrics, raw telemetry logs.

---

## 10. Role-Aware UX
Adapt primary views by user responsibility:
- **Field Inspector**: Nearby dispatches, camera, GPS tag, offline sync, single-tap verify.
- **Emergency Manager**: Sector overview, priority matrix, road corridors, active dispatches.
- **Analyst**: Risk trends, forecast curves, model confidence, feature contributions.
- **Admin**: User roles, region boundaries, alert rule thresholds, system health.

---

## 11. Operator Memory
Maintain recent navigation context and active workspace investigations so operators never lose track of ongoing tasks.

---

## 12. Graceful Degraded & Offline States
When network or satellite feeds degrade:
- Clearly display `⚠ CONNECTION DEGRADED — Showing last known information (Updated 08:32 IST)`.
- On field devices, store observations locally and display sync status (`✓ 4 saved locally, ↑ 2 pending sync`).

---

## 13. Data Quality vs. Model Confidence
Distinguish data feed health from ML confidence:
- Display Data Quality indicators (`Weather: Good`, `Satellite: Stale`, `Field Reports: Limited`) alongside ML Model Confidence.

---

## 14. Operational GIS Mapping
Maps tell stories rather than just displaying geometry:
- Region clicks reveal situation summaries, primary hazard triggers, affected road corridors, and recommended actions.

---

## 15. Real-World Consequence Scaling
Map numerical risk values to human-scale impact:
- Translate scores to potential population exposure, route blockages, and proximity to critical infrastructure (hospitals, shelters).

---

## 16. Quiet Urgency & Calm Design
Avoid excessive visual noise or flashing banners. Communicate urgency through clean typography, clear visual hierarchy, subtle status badges, and structured motion.

---

## 17. Situation Room Dashboard Focus
Structure the primary dashboard around **"What Needs Attention Now"**, ordered by severity, trend rate, and required operational response.

---

## 18. Explicit Prioritization Rationale ("Why Am I Seeing This?")
Every priority item details why it was ranked first (e.g., `✓ Rapid risk escalation`, `✓ High population exposure`, `✓ Key transport corridor blocked`).

---

## 19. Authentic Operational Nomenclature
Use authentic domain terminology (sector names, highway corridor IDs, block designations) rather than generic placeholders.

---

## 20. Honest Uncertainty & Precision Bounds
Avoid false precision (e.g. prefer `~18,000 people exposed` over `18,437` and `Elevated flood risk next 6h` over unverified minute-level predictions).

---

## 21. Data Integrity Warnings
Proactively inform operators when satellite or sensor passes are missed or delayed due to environmental conditions.

---

## 22. Action-Oriented Operational Verbs
Use operational language: *Monitor, Assess, Investigate, Verify, Acknowledge, Escalate, Dispatch, Resolve, Reassess*.

---

## 23. Single Visual Center of Gravity
Every view has one dominant focal point (e.g., Map for `/map`, Priority Matrix for `/priority`, Verification Queue for `/field-reports`).

---

## 24. Structured Information Rhythm
Balance dense telemetry tables with breathing room and clear visual separation between headers, summaries, evidence panels, and action controls.

---

## 25. Utility-First Component Rule
Never add UI components merely to fill empty space. Add elements only if they support operator situation awareness, decision-making, or action verification.

---

## 26. The 10-Point Command Center Evaluation Test
Before shipping any GeoShield view, verify:
1. **Situation**: Can the situation be understood in 3 seconds?
2. **Change**: Is what changed immediately visible?
3. **Cause**: Are primary triggers clearly explained?
4. **Confidence**: Is data freshness and quality transparent?
5. **Consequence**: Are human and infrastructural impacts clear?
6. **Action**: Is the next operational step obvious?
7. **Evidence**: Can the underlying data/model reasoning be inspected?
8. **Recovery**: Does the UI handle degraded/offline states safely?
9. **Human Control**: Can an authorized operator verify or override recommendations?
10. **Trust**: Does the interface remain calm, readable, and trustworthy at 3:00 AM during a live crisis?
