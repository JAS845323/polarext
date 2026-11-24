// Replace with your live Polar.sh Checkout link(s) after creating products in Polar.
const POLAR_CHECKOUT_URL = 'https://buy.polar.sh/polar_cl_JOUtaxug7idO6T32vNYuAYgL67hf6MvtT37IR3iRD2N';
const POLAR_STANDARD_URL = 'https://buy.polar.sh/polar_cl_pi57oDERpuWUxarZU1yR8bZvIvdNUXwage0353rOJAJ';

document.querySelectorAll('[data-checkout-cta]').forEach((el) => {
  const tier = el.getAttribute('data-checkout-cta');
  const href = tier === 'standard' && POLAR_STANDARD_URL ? POLAR_STANDARD_URL : POLAR_CHECKOUT_URL;
  el.setAttribute('href', href);
});

// --- Accessible Architecture Tabs with hidden="until-found" + beforematch sync ---
const featTabs = Array.from(document.querySelectorAll('.preview-tab'));
const featPanels = Array.from(document.querySelectorAll('.preview-panels > [role="tabpanel"]'));

function activateFeatureTab(tabButton) {
  const targetId = tabButton.id;
  for (const btn of featTabs) {
    btn.setAttribute('aria-selected', btn === tabButton ? 'true' : 'false');
  }
  for (const panel of featPanels) {
    const isMatch = panel.getAttribute('aria-labelledby') === targetId;
    if (isMatch) {
      panel.removeAttribute('hidden');
      panel.setAttribute('tabindex', '0');
    } else {
      panel.setAttribute('hidden', 'until-found');
      panel.removeAttribute('tabindex');
    }
  }
}

for (const btn of featTabs) {
  btn.addEventListener('click', () => {
    activateFeatureTab(btn);
  });
}

document.querySelector('.preview-panels')?.addEventListener('beforematch', (event) => {
  const panel = event.target?.closest?.('[role="tabpanel"]');
  const tabId = panel?.getAttribute('aria-labelledby');
  const matchingTab = tabId ? document.getElementById(tabId) : null;
  if (matchingTab) {
    activateFeatureTab(matchingTab);
  }
});

// --- Interactive Live Browser Extension Simulator ---
const simState = {
  surface: 'sidepanel',
  subtab: 'inspector',
  scanned: false,
  isPro: false,
  offline: false,
  logLines: [
    '// Ready. Click "Scan Sample Page" or open the License tab to test Polar.sh activation.',
  ],
};

const simElements = {
  surfaceTitle: document.getElementById('sim-surface-title'),
  scorePill: document.getElementById('sim-score-pill'),
  tierPill: document.getElementById('sim-tier-pill'),
  popupView: document.getElementById('sim-popup-view'),
  sidepanelView: document.getElementById('sim-sidepanel-view'),
  popLinks: document.getElementById('sim-pop-links'),
  popExt: document.getElementById('sim-pop-ext'),
  popIssues: document.getElementById('sim-pop-issues'),
  scanStatus: document.getElementById('sim-scan-status'),
  inspectorResults: document.getElementById('sim-inspector-results'),
  panelInspector: document.getElementById('sim-panel-inspector'),
  panelPro: document.getElementById('sim-panel-pro'),
  panelLicense: document.getElementById('sim-panel-license'),
  proLocked: document.getElementById('sim-pro-locked'),
  proUnlocked: document.getElementById('sim-pro-unlocked'),
  keyInput: document.getElementById('sim-key-input'),
  activateBtn: document.getElementById('sim-activate-btn'),
  deactivateBtn: document.getElementById('sim-deactivate-btn'),
  offlineBtn: document.getElementById('sim-offline-btn'),
  apiLog: document.getElementById('sim-api-log'),
};

function appendSimLog(entry) {
  simState.logLines.unshift(entry);
  simState.logLines = simState.logLines.slice(0, 6);
  if (simElements.apiLog) {
    simElements.apiLog.textContent = simState.logLines.join('\n\n');
  }
}

function renderSimulator() {
  if (!simElements.surfaceTitle) return;

  const isPopup = simState.surface === 'popup';
  simElements.surfaceTitle.textContent = isPopup
    ? 'PolarExt Toolbar Popup'
    : 'PolarExt Side Panel';
  if (simElements.popupView) simElements.popupView.hidden = !isPopup;
  if (simElements.sidepanelView) simElements.sidepanelView.hidden = isPopup;

  document.querySelectorAll('.sim-view-btn').forEach((btn) => {
    btn.setAttribute(
      'aria-pressed',
      btn.getAttribute('data-sim-view') === simState.surface ? 'true' : 'false',
    );
  });

  document.querySelectorAll('.sim-subtab').forEach((btn) => {
    btn.setAttribute(
      'aria-pressed',
      btn.getAttribute('data-sim-tab') === simState.subtab ? 'true' : 'false',
    );
  });

  if (simElements.panelInspector) {
    simElements.panelInspector.hidden = simState.subtab !== 'inspector';
  }
  if (simElements.panelPro) {
    simElements.panelPro.hidden = simState.subtab !== 'pro';
  }
  if (simElements.panelLicense) {
    simElements.panelLicense.hidden = simState.subtab !== 'license';
  }

  if (simElements.scorePill) {
    simElements.scorePill.textContent = simState.scanned ? 'SEO 74/100' : 'Not scanned';
  }
  if (simElements.popLinks) simElements.popLinks.textContent = simState.scanned ? '14' : '—';
  if (simElements.popExt) simElements.popExt.textContent = simState.scanned ? '6' : '—';
  if (simElements.popIssues) simElements.popIssues.textContent = simState.scanned ? '4' : '—';

  if (simElements.scanStatus) simElements.scanStatus.hidden = simState.scanned;
  if (simElements.inspectorResults) simElements.inspectorResults.hidden = !simState.scanned;

  if (simElements.tierPill) {
    simElements.tierPill.classList.toggle('pro', simState.isPro);
    simElements.tierPill.textContent = simState.isPro
      ? simState.offline
        ? 'PRO (Offline Grace)'
        : 'PRO Active'
      : 'Free Tier';
  }

  if (simElements.proLocked) simElements.proLocked.hidden = simState.isPro;
  if (simElements.proUnlocked) simElements.proUnlocked.hidden = !simState.isPro;
  if (simElements.deactivateBtn) simElements.deactivateBtn.hidden = !simState.isPro;
  if (simElements.offlineBtn) {
    simElements.offlineBtn.setAttribute('aria-pressed', String(simState.offline));
  }
}

document.querySelectorAll('.sim-view-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    simState.surface = btn.getAttribute('data-sim-view') || 'sidepanel';
    renderSimulator();
  });
});

document.querySelectorAll('.sim-subtab').forEach((btn) => {
  btn.addEventListener('click', () => {
    simState.subtab = btn.getAttribute('data-sim-tab') || 'inspector';
    renderSimulator();
  });
});

document.getElementById('sim-open-panel-btn')?.addEventListener('click', () => {
  simState.surface = 'sidepanel';
  renderSimulator();
});

document.getElementById('sim-goto-license-btn')?.addEventListener('click', () => {
  simState.subtab = 'license';
  renderSimulator();
});

document.getElementById('sim-scan-btn')?.addEventListener('click', () => {
  simState.scanned = true;
  appendSimLog(
    `[Content Script -> SW] SCAN_ACTIVE_TAB complete
{
  "score": 74,
  "totalLinks": 14,
  "externalCount": 6,
  "issues": ["MISSING_NOOPENER", "MISSING_DESCRIPTION"]
}`,
  );
  renderSimulator();
});

document.getElementById('sim-fill-demo-btn')?.addEventListener('click', () => {
  if (simElements.keyInput) {
    simElements.keyInput.value = 'POLAR-DEMO-PRO-2026';
  }
});

simElements.activateBtn?.addEventListener('click', () => {
  const key = (simElements.keyInput?.value || '').trim();
  if (!key) {
    appendSimLog('// Enter a key or click "Fill Demo" first.');
    return;
  }
  simState.isPro = true;
  simState.subtab = 'pro';
  appendSimLog(
    `POST https://api.polar.sh/v1/customer-portal/license-keys/activate
Request:  { "key": "${key}", "organization_id": "public-org-uuid", "label": "Chrome Extension – demo" }
Response: 200 OK { "id": "act-demo-01", "status": "granted", "limit_activations": 3, "usage": 0, "limit_usage": 100 }`,
  );
  renderSimulator();
});

simElements.deactivateBtn?.addEventListener('click', () => {
  simState.isPro = false;
  simState.offline = false;
  appendSimLog(
    `POST https://api.polar.sh/v1/customer-portal/license-keys/deactivate
Response: 204 No Content -> Cleared local activation in chrome.storage.local`,
  );
  renderSimulator();
});

simElements.offlineBtn?.addEventListener('click', () => {
  simState.offline = !simState.offline;
  if (simState.isPro && simState.offline) {
    appendSimLog(
      `[Daily Alarm] Revalidation hit TypeError (Offline)
-> Within 72h grace window (lastValidatedAt + 72h). Pro features remain unlocked.`,
    );
  } else if (simState.isPro) {
    appendSimLog(
      `POST https://api.polar.sh/v1/customer-portal/license-keys/validate
Response: 200 OK { "status": "granted" } -> Restored online verification.`,
    );
  }
  renderSimulator();
});

document.getElementById('sim-reset-btn')?.addEventListener('click', () => {
  simState.surface = 'sidepanel';
  simState.subtab = 'inspector';
  simState.scanned = false;
  simState.isPro = false;
  simState.offline = false;
  simState.logLines = [
    '// Ready. Click "Scan Sample Page" or open the License tab to test Polar.sh activation.',
  ];
  if (simElements.keyInput) simElements.keyInput.value = '';
  if (simElements.apiLog) simElements.apiLog.textContent = simState.logLines[0];
  renderSimulator();
});

renderSimulator();

// --- Expand all / Collapse all FAQ accordion controls (with fallback for browsers without invoker commands) ---
function setAllDetails(accordion, expand) {
  for (const details of accordion.querySelectorAll(':scope > details')) {
    details.open = expand;
  }
}

document.addEventListener(
  'command',
  (event) => {
    if (event.command !== '--toggle-all') return;
    const expand = event.source.getAttribute('aria-expanded') !== 'true';
    setAllDetails(event.target, expand);
  },
  { capture: true },
);

if (!Object.hasOwn(HTMLButtonElement.prototype, 'commandForElement')) {
  const toggleBtn = document.querySelector('[command="--toggle-all"]');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const targetId = toggleBtn.getAttribute('commandfor');
      const accordion = targetId ? document.getElementById(targetId) : null;
      if (!accordion) return;
      const expand = toggleBtn.getAttribute('aria-expanded') !== 'true';
      setAllDetails(accordion, expand);
    });
  }
}

document.addEventListener(
  'toggle',
  (event) => {
    const target = event.target;
    if (!(target instanceof HTMLDetailsElement) || !target.matches('.accordion > details')) {
      return;
    }
    const accordion = target.parentElement;
    const button = accordion?.querySelector('[command="--toggle-all"]');
    if (!accordion || !button) return;
    const items = accordion.querySelectorAll(':scope > details');
    const allOpen = Array.prototype.every.call(items, (d) => d.open);
    button.setAttribute('aria-expanded', String(allOpen));
  },
  { capture: true },
);
