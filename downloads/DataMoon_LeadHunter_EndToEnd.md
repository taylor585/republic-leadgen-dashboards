# DataMoon × LeadHunter — End-to-End Technical Process
**For: Codex (and any engineer picking this up) · Prepared by ScaleLogix AI · 16 July 2026**

This document explains **exactly** how the DataMoon system works end to end, and how it integrates with LeadHunter. It uses **the same process we proved for LinkedIn analysis via Google advanced-search commands** — DataMoon simply supplies the audience that process runs on.

Live dashboard (public, no login): **https://taylor585.github.io/republic-leadgen-dashboards/datamoon/**

---

## 0. TL;DR
1. **DataMoon** builds a filtered audience and gives us a **LinkedIn URL on every row**.
2. We read each person's **public LinkedIn posts + profile through Google advanced-search commands** (never logging into LinkedIn — direct LinkedIn access is hard-blocked, HTTP 999).
3. We **aggregate** what the segment cares about into a **fingerprint**, and turn it into a **Creative Strategy Report** (what the Meta ads should say).
4. **LeadHunter** is the sibling engine: it supplies real-time *intent* (who is in-market now) while DataMoon supplies *breadth* + the LinkedIn URLs for psychographic analysis. Both feed the **same four-step pipeline and the same Meta ad workflow**.

Proven on a live 36-contact run: ~83% profile coverage, ~33% had readable posts, ~1 in 6 DataMoon rows were wrong (caught automatically), ~8% weren't even the right job.

---

## 1. The model — two engines, one process
| | **DataMoon** (Tier 1) | **LeadHunter** (Tier 2, proprietary) |
|---|---|---|
| Supplies | Breadth — large filterable audiences + a LinkedIn URL per record | Depth — real-time declared intent (0–100 score, 7-day window) |
| Signal type | Behavioural / demographic (lower intent) | "I need this now" statements the person actually made |
| Its weakness | Low intent; ~1 in 6 rows noisy; some off-target | Narrower reach than a broad data set |
| Role in ads | Tells us **how to talk** to a whole segment | Tells us **who** to prioritise right now |

Both engines run through the **same four steps**: **Source → Verify → Analyse → Act.** That shared process is the integration. There is no magic data pipe; the connection is that (a) both produce a contact list with names + LinkedIn URLs, (b) both are read by the identical Google-advanced-command analysis layer (the scripts in this skill), and (c) both converge on the same Meta ad workflow — DataMoon shaping the message, LeadHunter prioritising the spend.

```
                     ┌──────────── same analysis engine ────────────┐
DataMoon feed  ─────▶│ parse_audience → sample → dork(Google) →       │
(breadth+URLs)       │ read public posts/profiles → aggregate →       │──▶ Creative Strategy Report ──▶ Meta ads
LeadHunter leads ───▶│ (identical scripts)                            │        (what to say)              ▲
(real-time intent)   └───────────────────────────────────────────────┘                                   │
        └──────────────────────────── prioritise which contacts to target first ────────────────────────┘
```

---

## 2. Step 1 — Source (DataMoon)
DataMoon is a **REST API** (`X-API-Key` header auth; docs at intentdocs.datamoon.com). Core calls:
- `POST /intent/feeds/builder` — build a feed from a free-text query ("Alabama accountants >$250k, email+phone").
- `POST /intent/feeds/stats` — how big is it.
- `POST /intent/feeds/exports` — async export; set `require_contact_id=true`; `page_size` 1k–50k.
- `POST /intent/feeds/exports/download-url` — 1-hour signed CSV link.
- `POST /enrich/professional` — **this bundle contains the LinkedIn URL** (also `/enrich/emails`, `/phones`, `/interests`, …).

Output is a CSV. The one we tested (`audience_export_6028.csv`) had columns: name, business/personal contact fields, **linkedin_url**, address, city/state, income/net-worth, job_title, department, company, etc. **We use only the professional fields** (see §6 compliance).

> There is **no native DataMoon → Meta push** in the API (its sibling AudienceLab has that in-UI — confirm which back end the seat uses). Automation is built on the REST API. A thin **DataMoon MCP server** wrapping these endpoints is the recommended autonomous layer (no `push_to_meta` tool — that stays a human step).

---

## 3. Step 2 — Verify (`parse_audience.py`)
```
python3 scripts/parse_audience.py audience.csv --out contacts.json
```
- **Strips all sensitive PII** — only `name, title, department, company, company_domain, company_size, city, state, linkedin_url` survive. Addresses, phones, emails, income, net-worth are read past and never emitted.
- **Flags bad rows** by matching the person's name against the LinkedIn-URL slug: `clean` (both names in slug) / `partial` (last name only) / `mismatch` (neither) / `no-url`.
- Scores **likely-posters** by title keywords (partner, CIO, director, marketing…).

Real output on the test file: 36 total → 27 clean, 4 partial, 2 mismatch, 3 no-url, 16 likely-posters. **~1 in 6 rows had name/URL problems** (e.g. a row named "Sophia Archer" whose URL is Steve Rutland). This is why verification is not optional.

---

## 4. Step 3 — Analyse (the SAME Google-advanced-command process as LinkedIn)
This is the identical method we validated for LinkedIn. **Direct LinkedIn fetch returns HTTP 999 (hard block), so Google's index is the only read path.** No login, no messages.

**Sample first** (never a census):
```
python3 scripts/sample.py contacts.json --n 25 --mode mixed --out sample.json   # pilot
# live: batches of 50 — see references/live-batches.md
```

**Generate the Google dorks** per contact:
```
python3 scripts/dork.py --from-sample sample.json
```
The four validated queries per person:
1. `site:linkedin.com/posts "First Last"` — their public posts (up to 10).
2. `site:linkedin.com/posts "First Last" (CPA OR tax OR <state>)` — disambiguate common names.
3. `site:linkedin.com/in "First Last" <city> <state> <firm>` — the profile (near-100% hit).
4. `"First Last" <firm> (accountant OR CPA)` — firm bios, press, awards, talks (coverage for the ~⅔ who don't post).

**Run them** with the `WebSearch` tool (`allowed_domains:["linkedin.com"]` for 1–3, unrestricted for 4), or the Chrome MCP / a SERP API at scale. For each contact, capture a record matching `references/extraction-schema.json`: themes, pains, desires, objections, values, **vocabulary**, and `posts_found`. Posts give *voice*; profiles give *coverage* — **blend both**.

---

## 5. Step 4 — Act (`aggregate.py` → report)
```
python3 scripts/aggregate.py extractions.json --out fingerprint.json
```
Rolls the per-contact records into one **fingerprint**: theme frequencies (as % of sample), post-hit rate, role mix, ranked vocabulary. Then write the **Creative Strategy Report** from `references/report-template.md` — hooks, ad copy, video scripts, static concepts, do-not-say — grounded in Schwartz awareness. That report is the handoff to the `world-class-copywriting` / b2c creative skills, and (after a human rights-attestation gate) to a Meta Custom Audience upload.

Real fingerprint from the test (see `test-data/fingerprint.json`): themes ranked **tax compliance 37% · nonprofit/government 26% · audit standards 21% · regulatory change 16% · firm growth 16% · tech&AI 11% · fraud/recognition/longevity 11% each.** One line: *this segment lives inside regulation and treats technology cautiously.*

---

## 6. Compliance & guardrails (baked in)
- **PII minimisation** — only public professional identity leaves `parse_audience.py`.
- **No LinkedIn login, no messages** — Google index only; reading public data is defensible (hiQ v. LinkedIn), and at sample scale the account-ban risk is avoided.
- **Meta upload is a separate human step** — Meta requires you warrant "all necessary rights and permissions and a lawful basis"; flagged/off-target rows are removed first. The skill never uploads.
- **Aggregate then discard** — keep the fingerprint + report; discard raw per-person data. No dossier lake (UK-GDPR/CCPA posture).

---

## 7. The test we ran (latest results)
- **Audience:** 36 US accounting professionals (`audience_export_6028.csv`).
- **Coverage:** all 36 processed; 19 individually researched (census of all 16 leaders + staff/noise sample); stopped at saturation.
- **Numbers:** profile coverage ~83% · readable posts ~33% (cluster in leaders/marketers/tech) · DataMoon errors ~1 in 6 · off-target ~8% (a realtor, an airport-ops manager, an HR manager).
- **Voice came from 5 content-rich contacts** (a CIO + four partners; 3 at Carr Riggs & Ingram).
- **Artifacts in `test-data/`:** `contacts.json` (parsed, PII-free), `sample.json`, `extractions.json`, `fingerprint.json`. Full write-ups in `examples/`.

---

## 8. File manifest — what's in this skill
| Path | What Codex gets |
|---|---|
| `SKILL.md` | the workflow + YAML frontmatter |
| `references/DataMoon_LeadHunter_EndToEnd.md` | this document |
| `references/dorks.md` | the Google advanced-command method in detail |
| `references/compliance.md` | the guardrails |
| `references/live-batches.md` | the batches-of-50 live operating procedure |
| `references/report-template.md` · `extraction-schema.json` | output shapes |
| `scripts/parse_audience.py · sample.py · dork.py · aggregate.py` | the runnable pipeline (stdlib only) |
| `test-data/*.json` | real, PII-free I/O from the 36-contact run |
| `examples/Alabama_Accountants_Creative_Strategy_Report.md` | the finished report |
| `examples/POC_method_notes.md` · `System_Plan.md` | method notes + full system plan |
| `LINKS.md` | the live dashboard + all URLs |

**How Codex should use this:** read this doc, then `SKILL.md`, then run `parse_audience.py` on any DataMoon CSV to see the exact data shapes in `test-data/`. The pipeline is identical whether the list came from DataMoon or LeadHunter — that is the integration.
