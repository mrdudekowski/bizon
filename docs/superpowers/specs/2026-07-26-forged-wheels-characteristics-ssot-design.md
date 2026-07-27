# BIZON Forged Wheels Characteristics SSOT — Design

**Date:** 2026-07-26

**Status:** Approved for workbook implementation

**Deliverable:** `BIZON_Forged_Wheels_Catalog_Source_of_Truth.xlsx`

**Reference:** `outputs/019f9ced-8954-7c91-b1a9-c1bf0cf6d55d/BIZON_TBR_Catalog_Source_of_Truth.xlsx`

## 1. Goal

Create an AI-readable Excel Single Source of Truth for BIZON forged wheels. The workbook is a test implementation of the future catalog architecture: its example models, vehicle records, names, and technical values may be replaced later without changing stable relationships or control rules.

This stage produces and verifies the workbook only. It does not change Payload collections, frontend filters, routes, or public site code.

## 2. Scope

- Passenger cars, SUVs, and pickups only.
- No truck or bus wheels.
- Five existing BIZON designs: Atlas, Vector, Nomad, Ember, and Bastion.
- Approximately 20 variants across the five designs.
- Both stocked standard SKUs and made-to-order configurations.
- A small demonstration fitment matrix for eight vehicles:
  - Jeep Wrangler JL Rubicon
  - Jeep Gladiator JT
  - Ford Bronco VI
  - TANK 300
  - Toyota Land Cruiser 300
  - Toyota Hilux VIII
  - Lexus GX 550
  - Nissan Skyline R34
- Example catalog and fitment rows use `source_type=internal_demo`.
- The owner has authorized these example rows to use lifecycle status `published`.

## 3. Selected Architecture

Use a hybrid model:

- stable identity, relationships, and safety-critical fields are wide, explicit columns;
- optional characteristics are controlled through a registry and typed value rows;
- a derived wide catalog view makes the workbook easy for people and AI agents to read;
- filter configuration is independent from characteristic storage and display;
- future Payload mapping supports adding, hiding, or removing optional characteristics without migrating the protected core.

Rejected alternatives:

- fixed columns for every characteristic: readable but requires schema changes for extensions;
- pure EAV for all fields: flexible but unnecessarily difficult to read and query.

## 4. Workbook Structure

### Guidance

| Sheet | Purpose |
| --- | --- |
| `00_README` | Workbook map, editing rules, relationships, statuses, units, and color legend |
| `22_CHANGELOG` | Append-only record of structural and data changes |

### Core catalog

| Sheet | Purpose |
| --- | --- |
| `01_WHEEL_MODELS` | One row per BIZON design/model |
| `02_WHEEL_VARIANTS` | Concrete sellable configurations and standard SKUs |
| `03_MODEL_FEATURES` | Atomic marketing and product advantages |
| `04_PRODUCTION_PLATFORMS` | Allowed made-to-order size and engineering envelopes |

### Dynamic characteristics

| Sheet | Purpose |
| --- | --- |
| `05_ATTRIBUTE_REGISTRY` | Characteristic definitions and control metadata |
| `06_ATTRIBUTE_VALUES` | Typed optional values attached to models, variants, or platforms |
| `07_FILTER_REGISTRY` | Public filter behavior and enablement |
| `08_FILTER_VALUES` | Available values/counts derived from published valid variants |
| `09_DICTIONARIES` | Stable keys and localized labels for enumerations |

### Fitment

| Sheet | Purpose |
| --- | --- |
| `10_VEHICLES` | Vehicle generation/trim, axle loads, hubs, and brake package |
| `11_FITMENT_SETS` | Model-to-vehicle fitment set and installation conditions |
| `12_FITMENT_AXLES` | Front/rear wheel variant, quantity, and recommended tire size |
| `13_INSTALLATION_KITS` | Fasteners, threads, seats, rings, torque, and quantities |

### Media and provenance

| Sheet | Purpose |
| --- | --- |
| `14_MEDIA_MAPPING` | Existing asset paths, roles, alt text, order, and Payload destination |
| `15_SOURCE_MAPPING` | Source type, locator, owner, date, and notes |

### Controls and transfer

| Sheet | Purpose |
| --- | --- |
| `16_PAYLOAD_MAPPING` | Future collection/field mapping and migration behavior |
| `17_DB_SCHEMA` | Proposed stable core and dynamic characteristic storage |
| `18_QA_ISSUES` | Explicit data issues, severity, owner, resolution, and publication block |
| `19_VALIDATION_RULES` | Machine-readable validation catalog |
| `20_CMS_IMPORT` | Only published rows that pass blocking validation |
| `21_CATALOG_VIEW` | Derived wide, human- and AI-readable catalog view |

## 5. Stable Identity and Relationships

System keys are English and immutable after publication. Russian labels are stored separately.

Primary relationships:

```text
WHEEL_MODELS
  -> WHEEL_VARIANTS
  -> MODEL_FEATURES
  -> PRODUCTION_PLATFORMS

ATTRIBUTE_REGISTRY
  -> ATTRIBUTE_VALUES

VEHICLES
  -> FITMENT_SETS
  -> FITMENT_AXLES
  -> INSTALLATION_KITS

FILTER_REGISTRY
  -> FILTER_VALUES

published + valid source rows
  -> CMS_IMPORT
  -> CATALOG_VIEW
```

Rows are not physically deleted during normal maintenance. Retired records use lifecycle status `archived`.

## 6. Protected Core

The following fields may be hidden from public display or removed from filter configuration, but remain part of the protected SSOT core:

- model and variant identifiers and relationship;
- SKU and lifecycle status;
- diameter in inches;
- width in inches;
- offset ET in millimetres;
- one or more structured bolt patterns;
- centre bore DIA in millimetres;
- maximum load per wheel in kilograms;
- construction type;
- sale mode and commercial identity.

Structured bolt patterns must not be stored as free text. A physical variant may support one or multiple explicit bolt patterns.

Canonical units:

- diameter and width: inches;
- PCD, ET, DIA, and clearances: millimetres;
- mass and maximum load: kilograms;
- tightening torque: N·m.

Cells hold typed numeric values without embedded unit strings.

## 7. Optional Characteristics

Initial characteristic definitions:

| Key | Meaning | Initial filter |
| --- | --- | --- |
| `beadlock_type` | `none`, `simulated`, or `functional` | Enabled |
| `face_profile` | `flat`, `concave`, or `deep_concave` | Disabled |
| `material_grade` | Material or alloy designation | Disabled |
| `weight_kg` | Mass of one wheel | Disabled |
| `finish_type` | Finish/coating process | Disabled |
| `color_key` | Stable color key | Disabled |
| `spoke_count` | Number of spokes | Disabled |
| `lip_style` | Rim lip style | Disabled |
| `certification` | Certificate or standard reference | Disabled |
| `recommended_use` | `street`, `performance`, or `offroad` | Disabled |
| `customizable` | Made-to-order availability | Disabled |
| `warranty_months` | Warranty term | Disabled |

`ATTRIBUTE_REGISTRY` controls:

- data type;
- canonical unit;
- entity scope;
- required/nullable state;
- dictionary binding;
- display visibility;
- display group and order;
- active/disabled state.

`ATTRIBUTE_VALUES` stores typed values. Exactly one value channel matching the registered data type must be populated per row.

## 8. Filters

Initial public filters:

| Filter | Behavior |
| --- | --- |
| Diameter | Exact-value multi-select |
| Width | Exact-value multi-select |
| ET | Numeric range |
| Construction type | Multi-select: monoblock, two-piece, three-piece |
| Beadlock | Multi-select: none, simulated, functional |

PCD, DIA, load, face profile, finish, color, and other characteristics exist in the SSOT but are not initially public filters.

`FILTER_REGISTRY` is independent from `ATTRIBUTE_REGISTRY` and controls:

- enabled state;
- source field/attribute;
- filter type;
- query parameter;
- URL value type;
- display group/order;
- value sorting;
- empty-value behavior;
- future Payload query strategy and index recommendation.

`FILTER_VALUES` contains only values available in published, non-blocked variants. Empty filter values are not shown. ET exposes the actual available minimum and maximum.

## 9. Product and Production Model

The catalog supports a hybrid sales model:

- standard finishes and stocked configurations have their own SKU rows;
- made-to-order finishes remain configuration options;
- exact custom configurations become variants only when they are sellable records;
- manufacturing capability is defined separately in `PRODUCTION_PLATFORMS`.

A production platform defines allowed combinations rather than unrelated global ranges:

- diameter and width pair;
- permitted ET interval;
- available face profiles;
- supported construction types;
- load limit;
- brake and geometry constraints;
- available custom finishes.

This avoids implying that every value inside several independent ranges can be combined.

## 10. Fitment

The primary customer journey remains design-first, followed by vehicle compatibility.

Compatibility permits:

- direct installation;
- approved fasteners;
- approved centring rings.

Spacers and PCD adapters are not treated as compatible installation.

Fitment result states:

- compatible;
- compatible with conditions;
- requires verification;
- incompatible.

One fitment set can use:

- identical front/rear variants;
- staggered front/rear variants;
- separate quantities and recommended tire sizes per axle.

Wheel load validation:

```text
wheel max load kg >= vehicle axle maximum load kg / 2
```

No additional safety coefficient is invented in this test version.

Brake fitment stores the brake package and verification result. Missing brake evidence produces `requires verification`, not automatic compatibility or incompatibility.

Installation kits are structured records containing fastener type, thread, seat, length, quantity, centring-ring dimensions, and tightening torque.

## 11. Lifecycle, Provenance, and Publication

One lifecycle field is used:

- `draft`
- `review`
- `published`
- `archived`

Provenance is separate and does not control publication. Initial example rows use `source_type=internal_demo` and may be `published` as approved by the owner.

Each source reference records:

- source type;
- file, URL, or internal reference;
- location/section where applicable;
- verification owner;
- verification date;
- notes.

## 12. Commercial Fields

The workbook includes basic commercial fields without making them public technical filters by default:

- sale mode;
- availability;
- price;
- price-on-request;
- production lead time;
- SKU status.

## 13. Media

Images are not embedded in Excel. `MEDIA_MAPPING` records:

- media ID;
- model ID;
- repository asset path;
- role/view;
- Russian alt text;
- display order;
- future Payload media field.

Existing Atlas, Vector, Nomad, Ember, and Bastion assets are mapped to the corresponding models.

## 14. AI Readability

The workbook follows the TBR SSOT conventions:

- English stable keys and Russian labels;
- one table per sheet;
- explicit table names;
- atomic values;
- no merged cells in data tables;
- frozen headers and filters;
- typed numbers and dates;
- in-workbook dictionaries and validation rules;
- visible status color legend;
- source columns and audit trail;
- a README that explains every sheet and relationship;
- a wide `CATALOG_VIEW` that avoids requiring an agent to reconstruct routine joins;
- a Payload map that explains the future destination of every field.

## 15. Validation and QA

Blocking checks include:

- duplicate system ID, slug, or SKU;
- broken foreign-key relationship;
- missing protected core field on a published record;
- invalid dictionary key;
- optional value not matching its registered data type;
- unstructured or incomplete bolt pattern;
- custom configuration outside its production platform;
- wheel load below half of the applicable axle load;
- incomplete front/rear fitment set;
- invalid wheel quantity or tire size;
- missing brake verification state;
- filter pointing to a disabled or missing source;
- formula error in an import-driving range.

Critical findings create or update `QA_ISSUES` with `blocks_publication=true`. Blocked rows are excluded from `CMS_IMPORT`.

Final workbook verification must include:

- compact inspection of key ranges and formulas;
- scan for Excel formula errors;
- visual render review of every sheet;
- repair of clipped content, unreadable headers, broken conditional formatting, or malformed tables;
- final `.xlsx` export to the conversation output directory.

## 16. Acceptance Criteria

- All 23 planned sheets exist and are documented.
- Five approved BIZON models and approximately 20 variants are populated.
- Eight demonstration vehicles and representative square/staggered fitments are populated.
- Protected core, optional characteristics, filters, fitment, platforms, media, QA, and Payload mapping are connected by stable IDs.
- Initial filters are diameter, width, ET, construction type, and beadlock.
- Example data is marked `source_type=internal_demo` and lifecycle `published`.
- Blocking QA rules prevent invalid rows from reaching `CMS_IMPORT`.
- The workbook is understandable without repository context.
- The workbook is visually consistent with the TBR SSOT and passes formula and render verification.
- No Payload or frontend code is changed in this stage.
