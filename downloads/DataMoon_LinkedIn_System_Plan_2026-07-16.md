# DataMoon × LinkedIn — Autonomous Audience-Intelligence System
**Prepared:** 16 July 2026 · **Owner:** Taylor Cunningham · **Context:** ScaleLogix / Republic lead-gen stack
**Purpose:** A research-backed plan for two connected builds — (1) an autonomous automation layer around DataMoon, and (2) a custom skill that turns a DataMoon audience into a LinkedIn-informed creative-strategy report that tells us exactly how to speak to that demographic in Meta ads.

---

## 0. The one reframe that makes this safe and cheap

Your stated goal is: *"When we upload this audience into Meta, we should know exactly what these people care about on average."*

Read that back. The deliverable is an **average** — a psychographic fingerprint of a segment. It is **not** a dossier on 5,000 named individuals. That distinction is the whole game, because it changes the build from "scrape everyone" (expensive, fragile, and a ban risk on two platforms) to "**sample enough people to characterise the segment, aggregate, and throw the raw profiles away**" (cheap, robust, defensible).

Two hard numbers make the case:

- **Statistics:** to know what a segment believes to within ±6–7% at 95% confidence, you need a random sample of roughly **200–300 people — regardless of whether the audience is 2,000 or 50,000.** Scraping all 10,000 accountants tells you almost nothing more than a clean random 250 does. It just costs ~40× more and multiplies the risk 40×.
- **Risk:** the value (creative direction) lives in the *aggregate*. The risk (ToS violations, privacy exposure, ban surface) lives in the *per-person raw data*. Aggregate-and-discard keeps the value and deletes the risk.

So the entire system below is designed around: **sample → analyse → aggregate → discard raw → keep only the fingerprint.**

### The two tripwires that can ban an ad account
This team has already been burned by pixel/account problems. There are exactly two places this system can create a *business-ending* problem, and both are avoidable:

1. **The Meta upload itself (biggest risk, and separate from LinkedIn).** Meta's Customer List Custom Audiences terms require the advertiser to represent and warrant they have *"all necessary rights and permissions and a lawful basis"* to use the uploaded contact data ([Meta Custom Audience Terms](https://www.facebook.com/legal/terms/customaudience)). A cold list sourced from a third-party data broker (DataMoon) that the person never gave *you* consent to hold is the classic trigger for audience rejection and, repeated, account restriction. **This risk exists whether or not we ever touch LinkedIn.** It has to be handled with a deliberate human attestation gate — never an automated push.
2. **LinkedIn automated access.** LinkedIn's User Agreement prohibits automated scraping. In January 2025 LinkedIn sued Nubela, the company behind **Proxycurl** (the tool everyone used for this), over fake-account scraping; Proxycurl settled and **shut down in July 2025** ([Linked API](https://linkedapi.io/guides/proxycurl-alternatives), [Bright Data](https://brightdata.com/blog/web-data/proxycurl-alternatives)). Cookie-session scrapers still exist but soft-block at ~50 profiles/hour and put the logged-in account at ban risk. The fix is to use a **compliant, transparently-sourced data provider** for anything at scale, and reserve cookie-session tools for tiny samples at accepted risk.

Everything below is built so neither tripwire is ever hit by accident.

### A third, quieter one: privacy law
You (the controller) are UK-based; the targets are US consumers. Building and storing per-person post-analysis dossiers is personal-data processing under **UK GDPR** and **US state laws (CCPA/CPRA)**. Sampling, aggregating, and discarding the raw pulls this back to a defensible footing. Storing a permanent "lake" of individual LinkedIn dossiers is the thing to *not* build.

---

## PART 1 — DataMoon Integration & Automation

### 1.1 What DataMoon actually exposes
Confirmed from the live API docs at [intentdocs.datamoon.com](https://intentdocs.datamoon.com/): DataMoon is a **REST API with `X-API-Key` header auth** and a genuinely rich surface. It is not just a UI — an AI agent can drive the whole thing. Endpoint map:

| Capability | Endpoint(s) | Notes |
|---|---|---|
| List feeds | `GET /intent/feeds` | paginated, searchable |
| Build / preview a feed | `POST /intent/feeds/builder` | **free-text query** → this is how "accountants in Alabama >$250k with email+phone" becomes a feed |
| Feed size / stats | `POST /intent/feeds/stats` | uses `lookback_days` |
| Filter fields + values | `POST /intent/feeds/filters/fields`, `/filters/values` | drives autocomplete for precise targeting |
| Preview / count export | `POST /intent/feeds/exports/preview`, `/exports/count` | `preview_rows`, `skip_count` |
| Create export (async) | `POST /intent/feeds/exports` | `page_size` 1k–50k, `max_rows`, **`require_contact_id`** (contact-linked rows only) |
| Poll / read export | `POST /intent/feeds/exports/list`, `/exports/page` | status: `building` → `ready` → `failed` |
| Download CSV | `POST /intent/feeds/exports/download-url` | 1-hour signed URL |
| Enrichment bundles | `GET /enrich/bundles` | list enabled bundles |
| Enrich contacts | `POST /enrich/emails`, `/phones`, `/professional`, `/interests`, `/individual-core`, `/location`, `/household`, `/purchases`, … | bulk `contact_ids[]` — **`/enrich/professional` is where the LinkedIn URL lives** |
| Credits | `GET /organization/credits` | records-credit pool |

**Critical gap:** the DataMoon API docs mention **no webhooks, no Zapier app, no Make app, and no direct Meta/Facebook push.** (Its sibling product **AudienceLab** *does* have native Meta Custom Audience sync, GoHighLevel, and Zapier/Make webhooks per [audiencelab.io/integrations](https://audiencelab.io/integrations/) — so if your DataMoon seat shares the AudienceLab back end, a native Meta sync may exist in the UI. Confirm which surface your login has.) Either way, **the automation has to be built on the REST API directly** — which is good news, because a REST API is far more controllable than a Zapier tile.

### 1.2 Three ways to automate it (recommended first)

**Option A — Build a DataMoon MCP server (recommended).**
A thin wrapper that turns each REST endpoint into an MCP tool, so Claude/any agent drives DataMoon directly in natural language ("build a feed of Alabama accountants >$250k with email and phone, tell me how many there are, and export the first 300 with contact IDs"). This is the "autonomous system an AI can connect to directly" you asked for. Proposed tool surface:

```
datamoon_list_feeds            → GET  /intent/feeds
datamoon_build_feed            → POST /intent/feeds/builder      (free-text + filters; preview or save)
datamoon_feed_stats            → POST /intent/feeds/stats
datamoon_filter_fields         → POST /intent/feeds/filters/fields
datamoon_filter_values         → POST /intent/feeds/filters/values
datamoon_export_count          → POST /intent/feeds/exports/count
datamoon_create_export         → POST /intent/feeds/exports      (require_contact_id=true)
datamoon_export_status         → POST /intent/feeds/exports/list
datamoon_export_download_url   → POST /intent/feeds/exports/download-url
datamoon_enrich                → POST /enrich/{bundle}           (contact_ids[])
datamoon_credits               → GET  /organization/credits
```
- ~150 lines of Python/TypeScript over the REST API; API key in env, never in the model context.
- **Guardrail baked in:** there is deliberately **no** `datamoon_push_to_meta` tool. Export and enrich are safe/reversible; pushing an audience to an ad platform is the gated action (see 1.4) and stays manual.

**Option B — Make.com (or Zapier) scenario via the HTTP module.**
Because there's no native DataMoon app, you use the generic **"HTTP / Custom API call"** module with the `X-API-Key` header to hit the same endpoints, then chain: build feed → poll export → fetch CSV → drop into Google Sheets / GHL. Make handles the async polling loop cleanly. This is the no-code path if you want non-engineers to run it; the MCP server is the agent-native path. They can coexist (both call the same API).

**Option C — Native AudienceLab Meta sync (only if your seat has it).**
If your DataMoon login is on the AudienceLab back end, the UI can push a saved audience to Meta Custom Audiences in a few clicks. Convenient — but it walks straight into Tripwire #1, so it stays behind the human attestation gate regardless of how easy the button is.

### 1.3 The autonomous DataMoon flow
```
 Agent prompt ("Alabama accountants >$250k, email+phone required")
        │
        ▼
 datamoon_build_feed ──► datamoon_feed_stats  (how many exist? enough to sample?)
        │
        ▼
 datamoon_create_export (require_contact_id=true, page_size=…)
        │  (async: poll)
        ▼
 datamoon_export_status → ready → datamoon_export_download_url → CSV
        │
        ▼
 datamoon_enrich (professional → LinkedIn URLs; emails; phones)
        │
        ▼
 → hands off to PART 2 (LinkedIn analysis on a SAMPLE)
        │
        ▼
 creative-strategy report ──►  [HUMAN GATE 1.4] ──► Meta upload + creative build
```

### 1.4 The Meta-upload attestation gate (non-negotiable)
Before any audience built from DataMoon data is uploaded to Meta, a human must confirm, in writing/log:
- the data has a lawful basis and we can represent *"all necessary rights and permissions"* per Meta's terms;
- the segment isn't a restricted/sensitive category (health, financial hardship, etc. — Meta bans targeting on these);
- we're comfortable with the source given this account's history.

Bake this as a checklist step in the SOP, not a tool the agent can call unattended. This one gate is what keeps the ad account alive.

---

## PART 2 — LinkedIn Audience-Analysis Skill

### 2.1 What it produces
Input: a DataMoon audience (contact IDs + LinkedIn URLs, e.g. "accountants in Alabama >$250k, email+phone required").
Output: a **Creative Strategy Report** that tells us, for this specific demographic, exactly what the ads/videos/statics/copy must say — grounded in what these people actually post about, worry about, aspire to, and respond to. It plugs straight into the existing [world-class-copywriting](../) and b2c-agent creative skills.

### 2.2 The provider-abstraction layer (this is what keeps it alive)
The skill must **not** hard-wire one scraping method — that's how you end up dead when the next Proxycurl gets sued. It talks to a `linkedin_provider` interface with swappable back ends, ranked by risk:

| Back end | What it is | Compliance | Throughput | Use for |
|---|---|---|---|---|
| **Google-index / SERP** (lowest LinkedIn-account risk) | Read *public* posts LinkedIn already let Google index — via a search dork, run in the Chrome MCP or a SERP API. **You never automate against LinkedIn at all.** | Reading public search-engine results; no LinkedIn login touched | Low–medium; partial coverage (~20–40% of names surface useful posts); Google CAPTCHAs if hit too fast | **The pilot + LinkedIn-specific risk avoidance** |
| **Compliant data API** (recommended for scale) | Bright Data, People Data Labs, Coresignal, ScrapIn, Apify | Transparent public-record sourcing; Bright Data has **won scraping cases vs Meta and X** ([Bright Data](https://brightdata.com/blog/web-data/best-linkedin-scraping-tools)); PDL publishes its methodology ([DEV](https://dev.to/zackrag/linkedin-scraping-is-dead-5-legal-tos-safe-alternatives-that-actually-work-in-2026-3f36)) | High, parallel | **Scale + anything client-facing** |
| **Cookie-session MCP** (sample-only, accepted risk) | e.g. [stickerdaniel/linkedin-mcp-server](https://github.com/stickerdaniel/linkedin-mcp-server) — exposes `get_person_profile` incl. a `posts` section | Violates LinkedIn UA; account can be banned; soft-blocks ~50/hr, sequential | Low | Tiny R&D samples only, on a burner account, never at audience scale |
| **NULL / fixtures** | canned JSON | n/a | n/a | Building & testing the skill offline |

**On the "we're only reading, not messaging" point — you're substantially right, and here's the precise version.** The ban trigger in LinkedIn's User Agreement is *automated access*, not outreach, so "we don't message them" doesn't itself clear the UA. **But** reading *public* data is legally defensible (the *hiQ v. LinkedIn* line of cases established that scraping public profiles isn't computer-fraud "hacking"), the residual exposure is an *account ban* rather than a lawsuit, and at ~25 profiles/run that exposure is small and containable. So my earlier caution was calibrated for thousands; **at your pilot scale the honest read is: this is doable.** Just pick the least-risky fetch that gets the data — which is often your Google idea.

**Your Google-dork workaround — good instinct, refined syntax.** Because it reads Google's index instead of automating LinkedIn, it sidesteps the LinkedIn-account risk almost entirely. Your `inurl:linkedin.com/post AND (intitle:"Name")` has the right shape; two tweaks make it hit:
- LinkedIn public post URLs are `/posts/` (plural) and carry the person's name in the slug, so `site:` + name-in-quotes beats `intitle:` (post titles are often just truncated body text):
  - `site:linkedin.com/posts "Jane Smith"`
  - `site:linkedin.com/posts "Jane Smith" (accountant OR CPA OR tax OR Alabama)`  ← disambiguates common names
  - `site:linkedin.com/in "Jane Smith" Alabama accountant`  ← finds the profile itself
- Google ANDs terms implicitly, so the literal `AND` is optional. Run these human-paced through the **Chrome MCP** (reads your real browser) or a SERP API to avoid Google's own bot-block. Weakness is *coverage*, not compliance — only public, indexed posts appear — so it pairs well with a compliant API for the ones it misses.

The vendor test to apply (from the compliance research): *"Can you explain in plain language how they collected this data, and have they published that explanation?"* If yes → usable. If it relies on fake accounts or undisclosed broker chains → out.

The skill's method (sampling, analysis, aggregation, report) is identical regardless of back end — only the fetch adapter changes.

### 2.3 Pipeline
```
Stage 0  INTAKE      audience definition + contact list (from DataMoon)
Stage 1  SAMPLE      random-sample N (pilot 25; confident read 200–300); log it's a sample, not a census
Stage 2  FETCH       per contact: profile (headline, role, industry, tenure, location, about)
                     + last 10 posts/reposts + top engaged topics       [via provider layer]
Stage 3  EXTRACT     per profile → structured record:
                     pains · desires · aspirations · objections · vocabulary/phrasing ·
                     values · content formats they engage · seniority/authority · life-stage cues
Stage 4  AGGREGATE   roll the N records into ONE psychographic fingerprint
                     (frequency-ranked themes, representative verbatim language, distribution notes)
Stage 5  REPORT      creative strategy mapped to ad assets (see 2.5)
Stage 6  DISPOSE     discard raw per-person data; retain only the aggregate fingerprint + report
```

### 2.4 Sample size — the pilot vs the confident read
Two honest tiers, because the **unit of confidence is the *person*, not the post:**

- **Pilot — 25 contacts × last 10 posts = 250 posts.** This is a genuinely good starting point and will produce a usable creative brief. 250 posts is a *lot* of qualitative material — more than enough to surface the real vocabulary, tone, recurring pains and the identity these people perform. What 25 people *can't* give you is tight percentages: a theme showing up in ~17+/25 feeds (≈two-thirds) is a trustworthy signal you can build creative on; a theme in 5/25 is a maybe, not a finding. So treat the pilot output as **strong directional hypotheses**, not precise averages — which is exactly what you need to write the first round of ads.
- **Confident read — 200–300 contacts.** Sampling error for a proportion at 95% confidence is ~±6.9% at N=200 and ~±5.7% at N=300, and finite-population correction means a 10,000-person audience needs essentially the same N as a 2,000-person one. Reserve this for a flagship vertical where you want quotable numbers.

Recommendation: **run the 25-contact pilot first** (cheap, fast, low-risk, proves the whole pipeline end-to-end), review the report, and only scale N up for verticals worth the spend. The report always *states its own sample size and confidence* so nobody mistakes a 25-person hypothesis for a 300-person fact.

### 2.5 The Creative Strategy Report (the deliverable)
Structured so a copywriter, a video editor, and a static designer can each act without re-reading anything:

1. **Segment snapshot** — who they are, sample size + confidence, top 5 roles/industries, seniority mix.
2. **Psychographic fingerprint** — ranked: dominant pains · desires · aspirations · fears · identity markers · values. Each with a frequency ("appeared in ~62% of sampled feeds") and 2–3 *verbatim* phrases they actually use (their language, for message-match).
3. **Awareness & sophistication read** (Schwartz) — where this segment sits, which sets the angle: problem-aware vs solution-aware, how many competing claims they've already heard.
4. **Message map** — the 3–5 angles most likely to land, each with the pain it answers and the objection it must pre-empt.
5. **Asset-level direction:**
   - **Hooks** (first 3 seconds) — 8–10 written in their vocabulary.
   - **Ad copy** — primary text + headline patterns, tone, reading level, what to never say.
   - **Video/VSL scripts** — narrative arc, proof points that matter to *them*, objections to handle, CTA framing.
   - **Static images** — concepts, visual cues, the identity they want reflected, text overlays.
   - **Offer framing / CTA** — what "book a call" should feel like for this segment.
6. **Do-not-say list** — clichés, wrong assumptions, and compliance-sensitive claims for this vertical.
7. **Method & governance footer** — sample size, provider used, date, and the reminder that this is aggregate intelligence (no individual dossiers retained).

### 2.6 Skill file structure
```
scalelogix-audience-intel/
  SKILL.md                     # trigger, workflow, guardrails, provider selection
  references/
    report-template.md         # the Stage-5 structure above
    extraction-schema.json      # the Stage-3 per-profile fields
    compliance-gate.md          # Meta attestation + LinkedIn provider rules
    sampling.md                 # N selection + how to state confidence
  scripts/
    linkedin_provider.py        # the abstraction layer (bright_data | pdl | cookie_mcp | fixtures)
    sample.py                   # random sampling from a DataMoon export
    aggregate.py                # N records → fingerprint
```
`SKILL.md` hard-codes the governance: default to a compliant provider, sample-not-census, aggregate-then-discard, and the Meta gate is a required checklist item before any "upload" step is even discussed.

---

## PART 3 — How the two halves connect (end to end)
```
DataMoon MCP ──build feed──► audience ──export+enrich──► contacts (+LinkedIn URLs)
     │                                                          │
     │                                          SAMPLE 200–300  ▼
     │                                   scalelogix-audience-intel skill
     │                                    (provider layer → analyse → aggregate)
     │                                                          │
     │                                             Creative Strategy Report
     │                                                          │
     ▼                                              ┌───────────┴───────────┐
[HUMAN GATE: Meta rights attestation]  ◄────────────┤  feeds creative build │
     │                                              │  (copy, video, static)│
     ▼                                              └───────────────────────┘
Meta Custom Audience upload  +  on-brand creative that matches the fingerprint
```
The report is the bridge: it's what makes the Meta audience *worth* uploading, and it's produced without ever needing to scrape the whole audience.

---

## PART 4 — Build plan

| Phase | What | Output | Effort |
|---|---|---|---|
| **1** | DataMoon MCP server over the REST API (no Meta-push tool) | Agent can build feeds, count, export, enrich by voice | ~½–1 day |
| **2** | Provider eval + pick 1 compliant LinkedIn source; build `linkedin_provider.py` with a fixtures back end | Working fetch adapter + a burner-account cookie path for R&D | ~1 day |
| **3** | Extraction + aggregation + report template; run on ONE real sample (e.g. Alabama accountants) | First Creative Strategy Report | ~1–2 days |
| **4** | Wire DataMoon → sample → skill → report; add the Meta attestation checklist | End-to-end run on a real audience | ~1 day |
| **5** | Harden: rate-limit handling, cost caps per run, discard-raw job, logging | Production-safe SOP | ongoing |

### Decisions you need to make (I'll recommend on each when you're ready)
- **D-a — Compliant provider:** Bright Data (court-tested, dataset + live) vs People Data Labs (published methodology, ~$1k/mo) vs a cheaper real-time scraper (Apify/ScrapIn). Recommend piloting **Bright Data or PDL** for anything client-facing.
- **D-b — Confirm your DataMoon seat's Meta-sync surface** (native AudienceLab push vs API-only). Changes whether Option C exists.
- **D-c — Sample size default** (I recommend 250) and per-run cost cap.
- **D-d — Where the fingerprint library lives** (one per audience, reusable across campaigns) — this becomes a genuine ScaleLogix asset over time.

### Risk register
| Risk | Mitigation |
|---|---|
| Meta rejects/bans on cold DataMoon list | Human attestation gate; avoid restricted categories; warm the account; consider running the *insight* even where you don't upload the *list* |
| LinkedIn bans the account used | Default to compliant provider; cookie-session only on a burner, sample-scale, accepted-risk |
| UK GDPR / CCPA exposure from dossiers | Sample-not-census; aggregate-then-discard; no permanent individual store |
| Provider gets sued/dies (Proxycurl redux) | Provider-abstraction layer — swap back ends without touching the skill |
| Garbage-in (DataMoon low intent) | This system *characterises* the segment; pair with the Tier-1 Data Moon quality eval already in the Republic plan |

---

## Appendix — compliance sources (quoted, attributed)
- **Meta Custom Audiences:** advertiser must warrant *"all necessary rights and permissions and a lawful basis"* to use uploaded data — [facebook.com/legal/terms/customaudience](https://www.facebook.com/legal/terms/customaudience)
- **Proxycurl shutdown / LinkedIn enforcement:** [Linked API — Proxycurl alternatives](https://linkedapi.io/guides/proxycurl-alternatives) · [Bright Data — Proxycurl alternatives](https://brightdata.com/blog/web-data/proxycurl-alternatives)
- **Compliant LinkedIn data alternatives & vendor test:** [DEV — LinkedIn scraping is dead, 5 ToS-safe alternatives](https://dev.to/zackrag/linkedin-scraping-is-dead-5-legal-tos-safe-alternatives-that-actually-work-in-2026-3f36)
- **Cookie-session MCP (capabilities + its own ToS warning):** [stickerdaniel/linkedin-mcp-server](https://github.com/stickerdaniel/linkedin-mcp-server)
- **DataMoon API surface:** [intentdocs.datamoon.com](https://intentdocs.datamoon.com/)
- **AudienceLab native integrations (Meta/GHL/Zapier):** [audiencelab.io/integrations](https://audiencelab.io/integrations/)
