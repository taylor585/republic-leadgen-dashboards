# Republic Go-Live Implementation Plan
**Companion to:** [Republic_LeadGen_Spec_2026-07-15.md](Republic_LeadGen_Spec_2026-07-15.md) · [LeadTiers_Research_2026-07-15.md](LeadTiers_Research_2026-07-15.md)
**Prepared:** 15 July 2026 · **Nominal sales start:** ~Mon 20 July (SOFT — Jerome: "seems a little early"; gates below decide)
**Principle:** Sales can start when the *answers* exist (Ryan & Cole pack) and fulfilment can absorb the March scenario (18 deals in one week) without Taylor becoming the bottleneck.

---

## Phase 0 — Decisions & proof (NOW → ~Thu 17 Jul)
*Everything here runs in parallel. This phase produces facts; nothing downstream is trustworthy without them.*

| # | Action | Owner | Exit criteria |
|---|---|---|---|
| 0.1 | **Decide territory model (D1)** — locked state/region vs open, per vertical | Taylor recommends, Will ratifies | Written rule; supply maths can start |
| 0.2 | **Kick off LeadHunter live battery via Codex** (research doc §1.4) across the candidate launch verticals | Taylor → Codex | Numbers for volume, cost, match, geo, ceiling per vertical |
| 0.3 | **Data Moon structured evaluation** (research doc §3.3) | Taylor | Tier-1 go/no-go with data, not anecdote |
| 0.4 | **Break-test Scott's demo** — voice quality, inbound-only claim, GHL install, economics | David (+ Taylor) | Pass/fail verdict + what it can be trusted for |
| 0.5 | **Compliance map for outbound AI** (D13) — GHL/Twilio approval path, state AI-disclosure laws, per-vertical regs for each candidate industry | David (sales/compliance) + Taylor | Table: per industry → outbound AI allowed / human-only / avoid |
| 0.6 | **Lead Distro vs in-house review** (D6) — login walkthrough vs Clark-coded GHL round-robin | David (Jerome sends login) | Adopt / replicate / drop recommendation |
| 0.7 | **Collect inputs:** guarantee stack (Will), 25-page offer overview (Jerome→Dmytro+Taylor), Dmytro's ops notes → Google Doc, Figma CRO samples (David), ICP docs → Dmytro (Taylor) | All | Everything in shared drive |
| 0.8 | **Choose launch verticals (D18)** using 0.2 + 0.5 outputs | Team | Named list (3–5), each passing compliance + capacity |

**Parallel urgent track (not Republic, cannot wait):**
| 0.9 | **ScaleLogix landing crisis (WS-6):** Taylor sends ICP docs/URLs to Dmytro same-day; Dmytro drafts the per-ICP template; David reviews structure; decide whether live spend gets paused on the worst pages while rebuild happens | Taylor + Dmytro + David | New template approved; ads no longer pointing at trust-free pages |

---

## Phase 1 — Build (≈Thu 17 → Tue 22 Jul)
*Starts as Phase 0 facts arrive; don't wait for all of them.*

**1A — Marketing engine (Taylor)**
1. Stand up the **new Meta pixel** (B2C first; both sides if needed).
2. Build the **Zapier architecture**: DQ leads never reach the pixel; no pixel on DQ pages (existing dq-*.html pattern); only qualified conversions train Meta.
3. Rebuild **ads + messaging + qualifying form** (Fathom-transcript-mined messaging, hard-headed application framing, scarcity, one-shot booking).
4. Implement **budget routing** in the intake: $10–20k → lead gen offer · <$20k → downsell (siphoned + nurtured, never discarded) · $25k+ → tagged highest-ticket-first.
5. Launch structure: **~80/20 lead-gen : agency**, one funnel + spinoff (Taylor's final call, D4).
6. Define the **Tier-3 siphon** tagging (booked-call trigger) so ultra-high-intent inventory exists from day one.

**1B — Fulfilment engine (Dmytro + Taylor, informed by offer overview)**
1. Build the **GHL client template**: B2B half (per-ICP buyer funnels, buyer pipeline, invoicing automation, dashboards) + B2C half (per-ICP lead funnels, hard-rule qualification automations, minutes-level SLA).
2. Implement **routing** (round-robin across active buyers) + **buyer active/inactive kill-switch**.
3. Wire delivery into buyer-side systems (GHL-native first; Housecall Pro-style integrations as needed).
4. Implement the **two service levels** (basic qualify-and-deliver; premium qualify-and-schedule — human setter until D13 clears AI).
5. **Demo + break-test the template** with fake buyers/leads before any real client touches it.

**1C — Sales enablement (Taylor → Will/Ryan/Cole)**
1. Assemble the **Ryan & Cole answer pack** from Phase 0 data: supply floor per vertical, buyer capacity, spend-to-leads table (A4), guarantee validation at worst-quartile, speed-to-lead position.
2. Deliver the **intent-criteria sheet** (B7) and the **91%/pipeline substantiation file** (A5) — or corrected stats if the data says otherwise.
3. **Tier pricing sheet** (WS-7) to Will: 3 tiers + sub-tiers + service levels.

**1D — ScaleLogix CRO rebuild (parallel)**
1. Dmytro's template → one page per ICP, 2–3 split-test variants, rolled across sub-accounts, all **wired into pipelines** (verified).
2. Ownership decision (D9): who runs these pages going forward.

---

## Phase 2 — Launch gate & go-live (≈Wed 23 Jul, or when gates pass)
**Go/no-go gates — ALL must pass before Ryan & Cole's ads spend:**
- ✅ Ryan & Cole pack delivered and acknowledged (they green-light their own marketing off it)
- ✅ GHL client template demo survived break-testing
- ✅ Guarantees restated at levels the Phase-0 data supports (no smoke)
- ✅ Launch verticals named, each compliance-cleared
- ✅ Speed-to-lead answer exists per vertical (Scott / human / hybrid)
- ✅ New pixel live with DQ exclusion verified end-to-end (test lead through every route)

**Go-live week:**
1. Ryan & Cole launch ads (Fri/Mon per Will); internal funnel live in parallel.
2. **First-client all-hands:** first deal expected within ~week one — full team swarms onboarding, iterates the template on a real client.
3. Daily standup during week one: opt-in→booked-call rate (the old failure mode), DQ leakage to pixel (must be zero), qualification SLA (minutes), routing correctness.
4. Start the **90-day outreach conversion tracker** (research R7) from the first buyer-list batch — this is what eventually hardens the 15-conversations guarantee.

---

## Phase 3 — Scale (post-launch → 500–1,000 clients)
1. **Absorb the spike:** monitor for the March scenario; Larissa onboarding capacity, Dmytro automation backlog prioritised by whatever manual step hurts most.
2. **Lead Distro decision executed** (adopt / Clark-built replacement) once David's review lands; migrate routing if replacing.
3. **Speed-to-lead rollout** (Scott partnership or alternative) as a standard install per client GHL — plus resale margin.
4. **Circle course additions** (Taylor's module proposals from the scrape) so clients trend autonomous by month 12 → SaaS-fee tail revenue.
5. **Per-vertical capacity re-tests** before opening each new vertical (same Codex battery); publish an internal "verticals we can honestly sell" list with monthly ceilings.
6. **Quarterly guarantee audit:** actual conversations/first-buyer times vs promised; adjust guarantees before they adjust us.

---

## Risk register (watch these — each has already bitten once or nearly)

| Risk | Signal we watch | Mitigation |
|---|---|---|
| Sales outruns fulfilment (March repeat) | Deals/week vs onboarding throughput | Template automation before launch; Larissa ramped; capacity ceilings published to sales |
| Outbound AI compliance kills premium tier | GHL/Twilio approval stalls; state law | Human setters as default premium mechanism until cleared (D13) |
| Data Moon quality fails | Evaluation gate (D15) | Fallback ready: cheap Meta leads as budget tier |
| Guarantee numbers were optimistic | Codex battery + 90-day tracker | Worst-quartile guarantee setting; push 90-day window to 6 months (Will already open to it) |
| Pixel poisoning recurs | Any DQ event reaching Meta | Zero-tolerance architecture: no pixel on DQ pages, Zapier filter, weekly audit |
| Single-closer dependency (Ro) | Ro's decision this week | Will's retention package; Larissa as backup setter; hiring pipeline |
| Landing-page regression (Hina scenario) | Any page cloned without wiring | Template + wiring checklist; no page ships unverified into a pipeline |
| One-person bottleneck (Taylor) | Taylor on critical path >1 workstream | Dmytro owns fulfilment build; Codex runs the battery; David owns compliance/tool reviews |

---

## Who owns what (one line each)
- **Taylor** — marketing engine, LeadHunter battery + tier pricing, Data Moon verdict, Ryan & Cole pack, ICP docs to Dmytro
- **Dmytro** — GHL ops template build + demo, landing-page template, ops notes doc
- **David** — Scott break-test, compliance map, Lead Distro review, CRO structure review, sales-side readiness
- **Jerome** — access distribution (Lead Distro, Scott demo, offer overview), recording to Will
- **Will** — guarantee stack, pricing ratification, sales team management, Scott commercial terms
- **Codex** — LeadHunter multi-vertical live test battery (research doc §1.4)
