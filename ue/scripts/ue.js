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
