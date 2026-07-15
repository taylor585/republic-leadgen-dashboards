# Lead Tiers Research — Mechanics, Costs & Evaluation Protocols
**Companion to:** [Republic_LeadGen_Spec_2026-07-15.md](Republic_LeadGen_Spec_2026-07-15.md) · **Prepared:** 15 July 2026 · **Owner:** Taylor Cunningham
**Purpose:** The working research document for the three-tier lead structure — what each tier actually is, what it costs, how leads move between tiers, what we still have to prove, and the exact test batteries that will prove it. Question IDs (0.x, A/B/C/D) reference the master spec's question bank.

---

## 0. The structure at a glance

```
TIER 3  ULTRA-HIGH INTENT   Our paid Meta ads → lead takes a high-value action     highest price
        (the "siphon")      (e.g. books a call happening within 2–3 days)
─────────────────────────────────────────────────────────────────────────────────
TIER 2  HIGH INTENT         LeadHunter — prospect DECLARED an urgent need          core product
        (LeadHunter)        in the last 7 days; not opted in; 0–100 scored;
                            3 internal sub-tiers
─────────────────────────────────────────────────────────────────────────────────
TIER 1  LOW INTENT          Data Moon — behavioural tracking/enrichment            cheapest
        (Data Moon)         ("followed around the internet, graded")               (or dropped)
```

Rule of thumb behind the tiers: **Tier 1 guesses intent from behaviour signals stitched together; Tier 2 reads intent the prospect stated in their own words; Tier 3 has intent proven by an action taken in our own funnel.** Price follows proof.

---

## 1. Tier 2 — LeadHunter (the core engine)

### 1.1 Mechanics (what we know)
- **Behavioural intent mining:** finds people *saying* they urgently need the service — actual statements ("I need help with X," "looking to hire someone for Y") on online platforms, not inferred behaviour.
- **Recency window:** last **7 days** (a 30-day comparison pass is part of the test battery).
- **Scoring:** 0–100 intent scale. Working thresholds: **70+** = sellable/guarantee-grade, **80+** = consistently qualified (the self-learning framework targets this band).
- **Self-learning search framework:** stores which keywords/searches produced high-intent (80+) results, retries and iterates on winners, spends a few exploratory searches per run, and continuously builds its own database of proven search patterns. Volume and efficiency should therefore *improve* over time (test F16 quantifies this).
- **Enrichment:** records come enriched for outreach (contactability fields — phone/email/LinkedIn; completeness % is measured in the battery, C8).
- **Provenance:** built and used by Taylor personally to land clients **without running any ads** — the strongest existing proof of concept.
- **Claimed stats needing substantiation (A5):** ~**91% match rate**; the **10 → 5–7 conversations → ~2 deals** pipeline. The substantiation file (which verticals, what sample size, where the data lives) must exist before sales quote these.

### 1.2 The three internal sub-tiers (TO MAP — WS-7)
LeadHunter itself has **three distinct lead tiers** that have never been formally mapped. Required output — a table defining, per sub-tier:

| Sub-tier | Score band / signal basis | Recency | Enrichment level | Cost per record | Intended use / price point |
|---|---|---|---|---|---|
| LH-A (top) | *TBD — e.g. explicit "need it now" statement, 80+* | *TBD* | *TBD* | *from cost dashboard* | *guarantee-grade setter calls* |
| LH-B (mid) | *TBD* | *TBD* | *TBD* | *from cost dashboard* | *TBD* |
| LH-C (base) | *TBD* | *TBD* | *TBD* | *from cost dashboard* | *TBD* |

This mapping must be produced **alongside the cost dashboard** so each sub-tier carries a real unit cost.

### 1.3 Cost dashboard (what it must document)
The existing dashboard breaks down what LeadHunter runs cost us. For the research file we need, per vertical:
- Cost per search / per run
- Cost per raw record vs per **70+ enriched** record (all-in: data + enrichment + any outreach touch — A2)
- Cost curve as volume deepens in one vertical in one month (does cheap intent exhaust? — battery B6*)
- Per-industry ceilings (some verticals have higher ceilings — get an average and a range)

### 1.4 What the live Codex test must produce (the battery)
Run the same battery **simultaneously across a spread of verticals** (suggested: roofing, plumbing, wealth management, legal/personal injury, one health vertical — adjust to the real launch list, D18). Two passes per vertical: **buyer-intent records** vs **end-lead records** — reported separately. Capture per record: intent score, match validity, resolvable location, signal recency, enrichment fields populated, cost incurred. Bucket at 70+ and 80+, on 7-day and 30-day windows.

**A — Supply volume** (→ 0.1/A1, 0.2, 0.3/B6)
1. Per vertical: 70+ records scrapeable per month, *sustained* not burst. Same at 80+.
2. Split buyer-intent vs end-lead volume.
3. If 10 clients pick the same vertical in the same month: does the pool support **50 verified intent buyers each** — or dry up? (Direct test of the guarantee.)
4. Volume decay: 7-day vs 30-day window.

**B — Cost** (→ A2)
5. All-in cost per 70+ record per vertical; cost to assemble a full 50-buyer batch.
6. Does cost-per-qualified-record rise as we go deeper into a vertical in one month?

**C — Quality, match rate & enrichment** (→ A5)
7. Actual match rate this run, per vertical; operational definition of "match"; does ~91% hold?
8. % of records fully enriched (contactable) vs partial.
9. Sample sizes behind every figure — so the substantiation file genuinely exists.

**D — Intent definition & scoring** (→ B7)
10. Which signals drive 70+ vs 80+ — captured explicitly, in writing.
11. Distinct intent tiers and the exact recency window that counts as "recent."
12. The precise, writable criteria separating a "verified high-intent buyer" from a raw record — the standard a setter and a guarantee can be held to.

**E — Geography / territory** (→ D1)
13. % of records location-resolvable to state/metro.
14. If a client locks a single state: how much does monthly 70+ volume drop, per test vertical? (Decides whether territory exclusivity is viable.)

**F — Capacity ceiling & scaling** (→ C12)
15. How many simultaneous operators can one vertical feed before the 70+ pool dilutes or repeats?
16. Does the self-learning loop increase sustainable monthly volume over the run, and by how much?

**Out of scope for this pass:** outreach → conversation conversion (A3, B6 second half) needs real outreach and 90 days of tracking — a scrape run only proves top-of-funnel volume/quality. Do not over-claim from scrape data.

---

## 2. Tier 3 — The Meta ads siphon (ultra-high intent)

### 2.1 Mechanics (to formalise)
- Source: **our own paid Meta campaigns** (the same funnels rebuilt in WS-1 on the fresh pixel).
- **Promotion trigger:** the lead takes a specific high-value action — the working definition is **booked a call, with the call scheduled within ~2–3 days**. Other candidate triggers (fully completed qualification form + booked; showed to a first call) to be decided in WS-7.
- **The siphon flow (to build):** Meta ad → funnel → qualification form → booking action → GHL automation tags the contact as Tier-3 inventory → routed to the buyer's pipeline (basic) or scheduled into the buyer's calendar (premium service level).
- These are sold as **top-class leads at the highest price** — intent is proven by action, not inferred.
- Open definition question (raised by Dmytro): will buyers demand *booked-appointment* leads specifically? Answer per the ops call: that's exactly the **premium service level** — qualify + schedule → deliver at "scheduled" stage; basic = qualify + deliver immediately.

### 2.2 What must be specified (WS-7)
- [ ] Exact trigger list that promotes a lead to Tier 3 (and disqualifiers).
- [ ] Tagging/automation design in GHL (works with the new-pixel Zapier architecture — DQ leads never touch the pixel or Tier-3 inventory).
- [ ] Freshness SLA for resale (a booked call 2–3 days out is perishable — delivery must be near-instant; ties to the minutes-not-hours qualification SLA, D17).
- [ ] Exclusivity: is a Tier-3 lead sold to exactly one buyer? (Recommended: yes — it's the top tier; round-robin is for volume tiers.)
- [ ] Pricing vs Tier 2 sub-tiers and vs the buyer's alternatives.
- [ ] Economics: cost per Tier-3 lead at current CPL ÷ booking rate (needs A4's CPL-by-vertical table at $1k/$2.5k/$5k spend).

---

## 3. Tier 1 — Data Moon (evaluation underway)

### 3.1 What we know
- **DaaS** ("data as a service"), the AudienceLab alternative. Behavioural: tracks people around the internet ("back end of Google"), sees what they interact with, can flag e.g. someone who searched a term in the last 24 hours, grades the leads.
- Commercials: investors get a **sub-account** as part of the offer. **Catalyst/Venture tier = 25,000 credits/mo; top Venture tier = unlimited.** We hold **8 white-label seats with unlimited data**; every client past 8 costs **$100/mo** for unlimited access.
- Positioning: the **cheapest** leads in the system; resellable; also a fulfilment source clients can arbitrage.

### 3.2 The concerns (why this tier may not survive)
- Jerome's team **cold-called a few Data Moon leads and "didn't get very far."** (Anecdote — but a bad one.)
- Taylor's history with this category: intent inferred from stitched behaviour ("visited a landing page four times") often = **professional tire-kickers**, not buyers.
- If it fails: **fallback is selling our cheap Meta leads as the budget tier** — higher intent anyway, "dirt cheap" to generate.

### 3.3 Evaluation protocol (D15 — structured, not anecdote)
1. Pull a **structured sample** per launch vertical (e.g. 100–200 records × 3 verticals) via the sub-account.
2. Measure: % contactable (valid phone/email), % matching the stated ICP, data freshness, duplication rate against LeadHunter output.
3. **Intent test:** setter cold-calls a randomised subset with a fixed script; log answer rate, conversation rate, "genuinely in-market" rate. Compare against a LeadHunter 70+ control batch.
4. Cost per usable record (credits consumed ÷ usable records) vs cheap Meta CPL.
5. Decision gate: Data Moon stays as Tier 1 only if usable-record cost AND in-market rate beat the Meta-lead fallback. Otherwise: keep it purely as the investors' self-serve data perk (it's already in the offer) and don't resell it as our Tier 1.
6. Define Data Moon lead sub-grades (its own scoring) only if it passes.

---

## 4. Cross-tier mechanics

### 4.1 Delivery & service levels (from the ops architecture, §3b of the spec)
- **Basic:** hard-rule qualification against the buyer's parameters → instant delivery to buyer pipeline + buyer's own system. SLA: **minutes**.
- **Premium:** qualification **+ appointment scheduling** (AI outbound *or* human — compliance D13 decides) → delivered at "scheduled" stage. Higher price.
- **Routing:** round-robin across all active buyers matching the ICP; **buyer active/inactive flag** stops routing instantly.

### 4.2 Pricing framework (to build — deliver to Will)
| Tier | Cost basis (from research above) | Price logic | Guarantee usage |
|---|---|---|---|
| 1 — Data Moon | credits/usable record | cheapest; volume plays; arbitrage-friendly | none |
| 2 — LeadHunter (×3 sub-tiers) | all-in cost per 70+/80+ record | mid–high; per-vertical pricing | backbone of the 50-buyers/15-conversations guarantee |
| 3 — Meta siphon | CPL ÷ booking rate | top price; exclusivity premium; premium service level upsell | First-deal/first-buyer promises |

Set every guarantee-backing number at **worst-quartile**, not average (per the question bank's instruction).

### 4.3 Dependency notes
- Territory decision (D1) changes every per-vertical number → decide before locking any table.
- The spend-to-leads table (A4: CPL by vertical at $1k/$2.5k/$5k) is an **Engine 2/Tier 3 input** — it comes from Meta campaign data, not LeadHunter.
- Compliance (D13) can delete the "AI" option from premium scheduling — price premium assuming a human setter until proven otherwise.

---

## 5. Open items ledger

| # | Item | Feeds | Status |
|---|---|---|---|
| R1 | Run Codex live battery (§1.4) | A1–A3, C12, 0.1–0.3, D1 maths | Ready to hand off |
| R2 | Map LeadHunter's 3 sub-tiers + unit costs | WS-7, pricing | Not started |
| R3 | Produce the 91% / pipeline substantiation file | A5 | Not started |
| R4 | Data Moon structured evaluation (§3.3) | D15, Tier-1 go/no-go | Access received; starting |
| R5 | Define Tier-3 trigger list + tagging + SLA | WS-7, WS-1 build | Not started |
| R6 | CPL-by-vertical spend table ($1k/$2.5k/$5k) | A4, Tier-3 economics | Needs fresh-pixel campaign data |
| R7 | Outreach→conversation 90-day tracking design | A3, B6 | Design now, runs post-launch |
| R8 | Written intent-criteria sheet | B7, guarantee standard | Drafts from battery D-section |
