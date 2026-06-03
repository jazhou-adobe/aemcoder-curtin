# Enable Universal Editor (UE) Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable Universal Editor (UE) support for the aemcoder-curtin project so pages can be edited using da.site's Universal Editor.

**Architecture:** The UE runtime scripts (`ue.js`, `ue-utils.js`) are loaded conditionally when the page is opened in a UE environment (detected via hostname pattern `*.ue.da.live` or `*.stage-ue.da.live`). These scripts handle DOM instrumentation — preserving `data-aue-*` attributes during block re-renders, and responding to UE UI events (accordion open, carousel slide, tab switch). The three root-level JSON config files (`component-models.json`, `component-definition.json`, `component-filters.json`) already exist; this plan also adds a `build:json` script so per-block `_blockname.json` source files can regenerate the root-level files.

**Tech Stack:** Vanilla JavaScript (ES6+), AEM Edge Delivery Services, da.site Universal Editor

---

## Current State Summary

Already present:
- `component-definition.json` (root) — all blocks defined ✅
- `component-filters.json` (root) — complete ✅
- `component-models.json` (root) — all models defined ✅
- Per-block `_blockname.json` source files in `blocks/*/` ✅

Missing:
- `ue/scripts/ue-utils.js` — DOM attribute movement utilities
- `ue/scripts/ue.js` — UE runtime (mutation observer + event handlers)
- UE loading conditional in `scripts/scripts.js`
- `build:json` npm script + `ue/models/` JSON source structure (for maintainability)

---

## File Structure

**Create:**
- `ue/scripts/ue-utils.js` — `moveAttributes()` and `moveInstrumentation()` utilities
- `ue/scripts/ue.js` — UE mutation observer + event handler runtime
- `ue/models/component-definition.json` — JSON pointer to merge block definitions
- `ue/models/component-filters.json` — JSON pointer to merge block filters
- `ue/models/component-models.json` — JSON pointer to merge block models
- `ue/models/page.json` — page-metadata model (page-level fields)
- `ue/models/section.json` — section model + definition + filter
- `ue/models/text.json` — text component definition/model
- `ue/models/image.json` — image component definition/model

**Modify:**
- `scripts/scripts.js` — add UE script loading conditional before `loadPage()`
- `package.json` — add `build:json` script and `merge-json-cli` + `npm-run-all` devDependencies

---

## Tasks

### Task 1: Create `ue/scripts/ue-utils.js`

**Files:**
- Create: `ue/scripts/ue-utils.js`

Reference: da-block-collection `ue/scripts/ue-utils.js` exports `moveAttributes` and `moveInstrumentation`.

- [ ] **Step 1: Create the utility file**

```javascript
/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * Moves attributes from one element to another.
 * @param {Element} from - The source element
 * @param {Element} to - The target element
 * @param {string[]} [attributes] - List of attribute names to move; if omitted, all attributes are moved
 */
export function moveAttributes(from, to, attributes) {
  const attrs = attributes || [...from.attributes].map((a) => a.name);
  attrs.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value !== null) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Moves instrumentation attributes (data-aue-* and data-richtext-*) from one element to another.
 * @param {Element} from - The source element
 * @param {Element} to - The target element
 */
export function moveInstrumentation(from, to) {
  const instrumentationAttrs = [...from.attributes]
    .map((a) => a.name)
    .filter((name) => name.startsWith('data-aue-') || name.startsWith('data-richtext-'));
  moveAttributes(from, to, instrumentationAttrs);
}
```

- [ ] **Step 2: Verify file exists**

```bash
cat ue/scripts/ue-utils.js
```

---

### Task 2: Create `ue/scripts/ue.js`

**Files:**
- Create: `ue/scripts/ue.js`

This script is loaded only in UE environments. It sets up:
1. A MutationObserver to track cards/carousel/accordion DOM mutations and preserve `data-aue-*` attributes
2. Event listeners for `aue:content-patch` (reset picture sources after media updates) and `aue:ui-select` (open the selected accordion/carousel/tab item)

- [ ] **Step 1: Create the UE runtime script**

```javascript
/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { moveInstrumentation } from './ue-utils.js';

/**
 * Sets up MutationObservers to preserve UE instrumentation attributes during
 * block re-renders (cards, carousel, accordion).
 */
function setupObservers() {
  // Cards: rows become <li> elements after block decoration
  document.querySelectorAll('.cards > div').forEach((cardsDiv) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          const removed = [...mutation.removedNodes].find(
            (r) => r.nodeType === Node.ELEMENT_NODE,
          );
          if (removed) moveInstrumentation(removed, node);
        });
      });
    });
    observer.observe(cardsDiv, { childList: true });
  });

  // Carousel: slides are replaced during initialization
  document.querySelectorAll('.carousel > div').forEach((carouselDiv) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          const removed = [...mutation.removedNodes].find(
            (r) => r.nodeType === Node.ELEMENT_NODE,
          );
          if (removed) moveInstrumentation(removed, node);
        });
      });
    });
    observer.observe(carouselDiv, { childList: true });
  });

  // Accordion: items are reconstructed as <details> elements
  document.querySelectorAll('.accordion > div').forEach((accordionDiv) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          const removed = [...mutation.removedNodes].find(
            (r) => r.nodeType === Node.ELEMENT_NODE,
          );
          if (removed) moveInstrumentation(removed, node);
        });
      });
    });
    observer.observe(accordionDiv, { childList: true });
  });
}

/**
 * Sets up Universal Editor event handlers.
 */
function setupUEEventHandlers() {
  // Reset picture srcset/source elements after media content patch
  document.addEventListener('aue:content-patch', (ev) => {
    const { detail } = ev;
    if (!detail || !detail.element) return;

    const element = document.querySelector(`[data-aue-resource="${detail.element}"]`);
    if (!element) return;

    element.querySelectorAll('picture source').forEach((source) => source.remove());
    element.querySelectorAll('picture img').forEach((img) => img.removeAttribute('srcset'));
  });

  // Handle UI selection events (accordion open, carousel slide, tab activate)
  document.addEventListener('aue:ui-select', (ev) => {
    const { detail } = ev;
    if (!detail || !detail.element) return;

    const element = document.querySelector(`[data-aue-resource="${detail.element}"]`);
    if (!element) return;

    // Accordion: open the selected <details> element
    if (element.closest('.accordion')) {
      element.querySelectorAll('details').forEach((d) => d.removeAttribute('open'));
      const details = element.querySelector('details');
      if (details) details.setAttribute('open', '');
      return;
    }

    // Carousel: show the selected slide
    if (element.closest('.carousel')) {
      const carousel = element.closest('.carousel');
      carousel.querySelectorAll('[aria-hidden]').forEach((slide) => {
        slide.setAttribute('aria-hidden', 'true');
      });
      element.setAttribute('aria-hidden', 'false');
      return;
    }

    // Tabs: activate the selected tab panel
    if (element.closest('.tabs')) {
      const tabs = element.closest('.tabs');
      tabs.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
        panel.setAttribute('aria-hidden', 'true');
      });
      tabs.querySelectorAll('[role="tab"]').forEach((tab) => {
        tab.setAttribute('aria-selected', 'false');
      });
      const panelId = element.getAttribute('data-aue-resource');
      if (panelId) {
        const panel = tabs.querySelector(`[aria-labelledby="${panelId}"]`);
        const tab = tabs.querySelector(`[aria-controls="${panelId}"]`);
        if (panel) panel.setAttribute('aria-hidden', 'false');
        if (tab) tab.setAttribute('aria-selected', 'true');
      }
    }
  });
}

/**
 * Initializes UE instrumentation.
 */
export default function init() {
  setupObservers();
  setupUEEventHandlers();
}
```

- [ ] **Step 2: Verify file exists**

```bash
cat ue/scripts/ue.js
```

---

### Task 3: Add UE loading code to `scripts/scripts.js`

**Files:**
- Modify: `scripts/scripts.js:198-204`

Add the UE conditional import before calling `loadPage()`. The hostname check covers both `*.ue.da.live` and `*.stage-ue.da.live`.

- [ ] **Step 1: Add UE loading conditional**

In `scripts/scripts.js`, replace the final lines:

```javascript
// BEFORE (current):
async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
```

```javascript
// AFTER:
async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

if (/\.(stage-ue|ue)\.da\.live$/.test(window.location.hostname)) {
  await import(`${window.hlx.codeBasePath}/ue/scripts/ue.js`).then(({ default: ue }) => ue());
}

loadPage();
```

- [ ] **Step 2: Verify the edit is correct**

```bash
tail -20 scripts/scripts.js
```

---

### Task 4: Create `ue/models/` source JSON structure

**Files:**
- Create: `ue/models/page.json`
- Create: `ue/models/text.json`
- Create: `ue/models/image.json`
- Create: `ue/models/section.json`
- Create: `ue/models/component-models.json`
- Create: `ue/models/component-definition.json`
- Create: `ue/models/component-filters.json`

These are the source files that the build script merges into root-level files.

- [ ] **Step 1: Create `ue/models/page.json`**

```json
{
  "models": [
    {
      "id": "page-metadata",
      "fields": [
        {
          "component": "text",
          "name": "title",
          "label": "Title"
        },
        {
          "component": "text",
          "name": "description",
          "label": "Description"
        },
        {
          "component": "reference",
          "name": "image",
          "label": "Image"
        },
        {
          "component": "text",
          "name": "robots",
          "label": "Robots",
          "description": "Index control via robots"
        },
        {
          "component": "text",
          "name": "sku",
          "label": "SKU",
          "description": "Optional: Specify a product SKU for this page"
        }
      ]
    }
  ]
}
```

- [ ] **Step 2: Create `ue/models/text.json`**

```json
{
  "definitions": [
    {
      "title": "Text",
      "id": "text",
      "plugins": {
        "da": {
          "name": "text",
          "type": "text"
        }
      }
    }
  ]
}
```

- [ ] **Step 3: Create `ue/models/image.json`**

```json
{
  "definitions": [
    {
      "title": "Image",
      "id": "image",
      "model": "image",
      "plugins": {
        "da": {
          "name": "image",
          "type": "image",
          "fields": [
            {
              "name": "imageAlt",
              "selector": "img[alt]"
            },
            {
              "name": "image",
              "selector": "img[src]"
            }
          ]
        }
      }
    }
  ],
  "models": [
    {
      "id": "image",
      "fields": [
        {
          "component": "reference",
          "name": "image",
          "label": "Image",
          "multi": false,
          "valueType": "string"
        },
        {
          "component": "text",
          "name": "imageAlt",
          "label": "Alt Text"
        }
      ]
    }
  ]
}
```

- [ ] **Step 4: Create `ue/models/section.json`**

```json
{
  "definitions": [
    {
      "title": "Section",
      "id": "section",
      "plugins": {
        "da": {
          "unsafeHTML": "<div></div>"
        }
      },
      "filter": "section",
      "model": "section"
    }
  ],
  "models": [
    {
      "id": "section",
      "fields": [
        {
          "component": "multiselect",
          "name": "style",
          "label": "Style",
          "options": [
            {
              "name": "Highlight",
              "value": "highlight"
            }
          ]
        },
        {
          "component": "select",
          "name": "padding",
          "label": "Padding",
          "options": [
            { "name": "Default", "value": "" },
            { "name": "Small", "value": "small" },
            { "name": "Medium", "value": "medium" },
            { "name": "Large", "value": "large" },
            { "name": "Big", "value": "big" },
            { "name": "XBig", "value": "xbig" },
            { "name": "XXBig", "value": "xxbig" },
            { "name": "Huge", "value": "huge" },
            { "name": "XHuge", "value": "xhuge" },
            { "name": "XXHuge", "value": "xxhuge" }
          ]
        },
        {
          "component": "select",
          "name": "margin",
          "label": "Margin",
          "options": [
            { "name": "Default", "value": "" },
            { "name": "Small", "value": "small" },
            { "name": "Medium", "value": "medium" },
            { "name": "Large", "value": "large" },
            { "name": "Big", "value": "big" },
            { "name": "XBig", "value": "xbig" },
            { "name": "XXBig", "value": "xxbig" },
            { "name": "Huge", "value": "huge" },
            { "name": "XHuge", "value": "xhuge" },
            { "name": "XXHuge", "value": "xxhuge" }
          ]
        }
      ]
    }
  ],
  "filters": [
    {
      "id": "section",
      "components": [
        "hero",
        "accordion",
        "cards",
        "carousel",
        "columns",
        "commerce-account-header",
        "commerce-account-sidebar",
        "commerce-cart",
        "commerce-checkout",
        "commerce-checkout-success",
        "commerce-confirm-account",
        "commerce-create-account",
        "commerce-create-password",
        "commerce-create-return",
        "commerce-customer-details",
        "commerce-forgot-password",
        "commerce-gift-options",
        "commerce-login",
        "commerce-mini-cart",
        "commerce-order-comments",
        "commerce-order-cost-summary",
        "commerce-order-header",
        "commerce-order-product-list",
        "commerce-order-returns",
        "commerce-order-status",
        "commerce-return-header",
        "commerce-search-order",
        "commerce-shipping-status",
        "commerce-wishlist",
        "enrichment",
        "fragment",
        "image",
        "product-details",
        "product-list-page",
        "product-recommendations",
        "targeted-block",
        "text"
      ]
    }
  ]
}
```

- [ ] **Step 5: Create `ue/models/component-models.json`** (merge pointer file)

```json
[
  { "...": "./page.json#/models" },
  { "...": "./image.json#/models" },
  { "...": "./section.json#/models" },
  { "...": "./blocks/*.json#/models" }
]
```

- [ ] **Step 6: Create `ue/models/component-definition.json`** (merge pointer file)

```json
[
  { "...": "./text.json#/definitions" },
  { "...": "./image.json#/definitions" },
  { "...": "./section.json#/definitions" },
  { "...": "./blocks/*.json#/definitions" }
]
```

- [ ] **Step 7: Create `ue/models/component-filters.json`** (merge pointer file)

```json
[
  { "...": "./section.json#/filters" },
  { "...": "./blocks/*.json#/filters" }
]
```

---

### Task 5: Create per-block JSON files in `ue/models/blocks/`

**Files:**
- Create: `ue/models/blocks/*.json` — one file per block, sourced from existing `blocks/*/_blockname.json` files

The per-block `_blockname.json` files in `blocks/*/` already have the correct `{definitions, models, filters}` structure. Mirror these as `ue/models/blocks/{blockname}.json`. Blocks without models (empty `models: []`) need minimal entries.

- [ ] **Step 1: Create block JSON files for all blocks**

Copy/transform each `blocks/{name}/_{name}.json` to `ue/models/blocks/{name}.json`. The files to create are (24 blocks):

1. `ue/models/blocks/accordion.json` — sourced from `blocks/accordion` (if exists) or minimal
2. `ue/models/blocks/cards.json`
3. `ue/models/blocks/carousel.json`
4. `ue/models/blocks/columns.json`
5. `ue/models/blocks/hero.json`
6. `ue/models/blocks/fragment.json`
7. `ue/models/blocks/enrichment.json`
8. `ue/models/blocks/targeted-block.json`
9. `ue/models/blocks/commerce-account-header.json`
10. `ue/models/blocks/commerce-account-sidebar.json`
11. `ue/models/blocks/commerce-addresses.json` (currently missing from component-filters.json — check if needed)
12. `ue/models/blocks/commerce-cart.json`
13. `ue/models/blocks/commerce-checkout.json`
14. `ue/models/blocks/commerce-checkout-success.json`
15. `ue/models/blocks/commerce-confirm-account.json`
16. `ue/models/blocks/commerce-create-account.json`
17. `ue/models/blocks/commerce-create-password.json`
18. `ue/models/blocks/commerce-create-return.json`
19. `ue/models/blocks/commerce-customer-details.json`
20. `ue/models/blocks/commerce-customer-information.json` (check if it should be in filters)
21. `ue/models/blocks/commerce-forgot-password.json`
22. `ue/models/blocks/commerce-gift-options.json`
23. `ue/models/blocks/commerce-login.json`
24. `ue/models/blocks/commerce-mini-cart.json`
25. `ue/models/blocks/commerce-order-comments.json`
26. `ue/models/blocks/commerce-order-cost-summary.json`
27. `ue/models/blocks/commerce-order-header.json`
28. `ue/models/blocks/commerce-order-product-list.json`
29. `ue/models/blocks/commerce-order-returns.json`
30. `ue/models/blocks/commerce-order-status.json`
31. `ue/models/blocks/commerce-orders-list.json`
32. `ue/models/blocks/commerce-return-header.json`
33. `ue/models/blocks/commerce-returns-list.json`
34. `ue/models/blocks/commerce-search-order.json`
35. `ue/models/blocks/commerce-shipping-status.json`
36. `ue/models/blocks/commerce-wishlist.json`
37. `ue/models/blocks/product-details.json`
38. `ue/models/blocks/product-list-page.json`
39. `ue/models/blocks/product-recommendations.json`

For each file, source definitions from `component-definition.json` and models from `component-models.json`. Format:
```json
{
  "definitions": [ /* from component-definition.json for this block */ ],
  "models": [ /* from component-models.json for this block, empty array if none */ ],
  "filters": [ /* from component-filters.json for this block, empty array if none */ ]
}
```

**NOTE:** Many of these already exist in `blocks/*/_{name}.json` with correct format — read and copy those. For blocks without a `_blockname.json`, construct from the root-level JSON files.

---

### Task 6: Add `build:json` script to `package.json`

**Files:**
- Modify: `package.json`

Add `merge-json-cli` and `npm-run-all` devDependencies, and the build scripts.

- [ ] **Step 1: Update `package.json`**

Add to `"devDependencies"`:
```json
"merge-json-cli": "^1.0.4",
"npm-run-all": "^4.1.5"
```

Add to `"scripts"`:
```json
"build:json": "npm-run-all -p build:json:models build:json:definitions build:json:filters",
"build:json:models": "merge-json-cli -i \"ue/models/component-models.json\" -o component-models.json",
"build:json:definitions": "merge-json-cli -i \"ue/models/component-definition.json\" -o component-definition.json",
"build:json:filters": "merge-json-cli -i \"ue/models/component-filters.json\" -o component-filters.json"
```

- [ ] **Step 2: Install new devDependencies**

```bash
npm install
```

- [ ] **Step 3: Test the build**

```bash
npm run build:json
```

Expected: Root-level `component-models.json`, `component-definition.json`, `component-filters.json` are regenerated without errors.

- [ ] **Step 4: Verify output matches existing root-level files**

```bash
git diff component-models.json component-definition.json component-filters.json
```

Expected: No meaningful diff (content should be equivalent to existing files).

---

### Task 7: Run linting

- [ ] **Step 1: Run linter**

```bash
npm run lint
```

Expected: No errors. Fix any issues with `npm run lint:fix`.

---

### Task 8: Test in local dev server

- [ ] **Step 1: Verify UE scripts load correctly in a UE-simulated environment**

The UE loading code is conditional on hostname matching `*.ue.da.live` or `*.stage-ue.da.live`. In local dev (`localhost:3000`), the scripts will NOT load — this is correct behavior. Verify the rest of the page works normally.

```bash
npx -y @adobe/aem-cli up --no-open --forward-browser-logs
curl http://localhost:3000/
```

Expected: Page loads without errors.

- [ ] **Step 2: Verify root-level JSON files are accessible**

```bash
curl http://localhost:3000/component-models.json
curl http://localhost:3000/component-definition.json
curl http://localhost:3000/component-filters.json
```

Expected: JSON content returned correctly.
