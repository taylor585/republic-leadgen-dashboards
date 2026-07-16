# POC Test — LinkedIn Analysis via Google Index
**Audience:** `audience_export_6028.csv` — 36 Alabama accounting/finance professionals, high income, email+phone present
**Method:** Google-index search only (no LinkedIn login touched, no messages sent) · **Date:** 16 July 2026
**Goal:** prove the pipeline on 5 successfully analyzed contacts.

> **Data handling:** this report uses only each person's *public professional identity* (name, title, firm, public posts). The home addresses, personal phones, personal emails, income and net-worth fields from the CSV were deliberately not used and are not reproduced anywhere.

---

## Result: pipeline works. 5 contacts analyzed. Method findings are the real prize.

### The 5 analyzed contacts (public professional content only)

| # | Person | Role / firm | What their public content is about |
|---|---|---|---|
| 1 | **Nick Cadden** | CIO, Carr Riggs & Ingram | The richest feed. Posts on CECL, GASB due process, **board-meeting productivity** ("8 steps…"), cybersecurity, disaster recovery, data privacy for nonprofits, construction-accounting certs; tagged at an AlabamaCIO GenAI event framed as **"enhance rather than replace."** |
| 2 | **Caterina Mozingo** | Partner (CPA/PFS), Aldridge Borden | **Forbes Best-In-State CPA 2024 & 2025**; personal-financial-planning specialist; career-journey narrative; board appointments; posts around financial planning/advisory. |
| 3 | **Keith Hundley** | Partner, Carr Riggs & Ingram | Speaker at Federal Grants Institute / CAPLAW; content on **Single Audit Act, OMB Uniform Guidance, occupational-fraud detection**, nonprofit & government grant compliance. |
| 4 | **Steve Rutland** | Partner, Data & Digital Services, RSM US | Theme: **technology transformation of finance & accounting, ROI on tools, digital modernization.** (This is the row DataMoon mislabeled "Sophia Archer" — see data-quality note.) |
| 5 | **Erin Howell** | Partner, Carr Riggs & Ingram | Newly elevated partner (2023, CRI's largest partner class); **nonprofit + hospitality/healthcare** audit specialty; firm-pride / belonging content. |

---

## The aggregate creative read (the actual deliverable)

Even at n=5, a coherent fingerprint appears — this is what ads to this demographic should do.

**What they care about (from what they actually post):**
- **Regulatory survival** — CECL, GASB, OMB, Single Audit. Ever-changing compliance is their daily weather.
- **Risk & fraud prevention** — they see themselves as the last line of defense.
- **Technology & AI, cautiously** — genuinely curious, but the winning frame is **"enhance, not replace."** ROI-driven, not hype-driven.
- **Recognition & status** — Forbes lists, partner titles, speaking slots. Professional identity is central.
- **Firm pride & belonging** — partner classes, growth, "we".
- **Practical efficiency** — frameworks, "8 steps," process.

**So the ads to this segment should:**
- **Lead with credibility and de-risking, not hype.** Named firms, specific numbers, "trusted by CPAs." This audience buys proof.
- **Use "augment your expertise," never "replace it."** Their stated fear is being replaced; sell leverage.
- **Tone: authoritative, precise, conservative.** High reading level signals respect. Zero hustle/bro energy.
- **Speak to identity** — they're trusted advisors and experts; frame the offer as making them *more* of that.
- **Be concrete and educational** — frameworks and ROI, not slogans.
- **Do-not-say:** don't imply replacing their judgment; no aggressive scarcity/hype; nothing vague ("quality you can trust"); don't assume tech-aversion (they follow AI) *or* early-adoption.

**Confidence:** directional hypothesis, not a validated average — n=5, and 3 of 5 are Carr Riggs & Ingram (a firm with an unusually strong posting culture), which skews it. Enough to write a first creative round; widen the sample to firm up.

---

## Method findings (what the POC actually proved)

1. **Direct LinkedIn access is fully blocked** — every attempt to fetch a profile/post URL returns **HTTP 999**. Google's index is the only viable read path. Your instinct to go through Google was correct and is now confirmed the *only* option, not just the safest.
2. **Profile-match hit rate ≈ 100%** — Google reliably surfaces the correct person's profile from name + firm + city.
3. **Actual-post hit rate is low and clusters by role** — roughly **~38% of people searched had real analyzable posts**, and they were almost entirely **partners, firm leaders, marketers, and tech roles.** Staff, managers and junior associates post little or nothing publicly. The signal comes from the vocal minority.
4. **DataMoon data-quality issues surfaced immediately** — and this matters for the Tier-1 evaluation:
   - **Name↔profile mismatches:** row labeled "Sophia Archer" is actually Steve Rutland; "Candy Harkins" → a kyle-harkins profile; "Tammy Jones" → lewis-jones; "Darren Hipps" → kaye-jaeger.
   - **Location mismatches:** "Eddie Douglas" listed Birmingham AL but is Starke FL; "Stephanie Carton" listed Montgomery AL but LinkedIn shows SF Bay Area.
   The per-row matching/enrichment is **not reliable** — treat DataMoon rows as leads to verify, not facts.

---

## What this means for the build

- **The skill should blend two public signals, not rely on posts alone:** (a) *post analysis* for the vocal minority who post, plus (b) *public professional signal* (firm bios, awards, speaking, press) which is reliably findable for **everyone**. Posts give voice; profiles give coverage. Together they characterise the segment even when most people are quiet.
- **Sampling should over-weight likely-posters** (partners/leaders/marketers/tech) when the goal is *voice/vocabulary*, and use the full random sample when the goal is *demographics*.
- **Add a verification step** for DataMoon rows before they're trusted (the name/location mismatches would poison a creative read and, worse, a Meta upload).
- **Google is the engine.** Run human-paced via the Chrome MCP or a SERP API. Coverage, not compliance, is the constraint — exactly as the plan predicted.

**Bottom line:** the end-to-end pipeline works. We can take a DataMoon audience, read public content through Google without touching LinkedIn, and produce a real creative brief — with the honest caveat that post-depth depends on the role mix, and DataMoon's rows need verifying.
