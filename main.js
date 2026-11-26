// Replace with your live Polar.sh Checkout link(s) after creating products in Polar.
const POLAR_CHECKOUT_URL = 'https://buy.polar.sh/polar_cl_JOUtaxug7idO6T32vNYuAYgL67hf6MvtT37IR3iRD2N';
const POLAR_STANDARD_URL = 'https://buy.polar.sh/polar_cl_pi57oDERpuWUxarZU1yR8bZvIvdNUXwage0353rOJAJ';

// Conditionally load Popover polyfill only if native support is absent
if (!Object.hasOwn(HTMLElement.prototype, 'popover')) {
  import('https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js').catch(() => {});
}

document.querySelectorAll('[data-checkout-cta]').forEach((el) => {
  const tier = el.getAttribute('data-checkout-cta');
  const href = tier === 'standard' && POLAR_STANDARD_URL ? POLAR_STANDARD_URL : POLAR_CHECKOUT_URL;
  el.setAttribute('href', href);
});

// ============================================================================
// 1. FLAGSHIP #SWAP — PRECISION MIGRATION & DOMAIN SWAP CONSOLE
// ============================================================================
const swapState = {
  mode: 'diff',
  env: 'prod',
  orgId: 'aad06cf1-4a61-4e81-a5df-2639524e8047',
  benefitId: '785a6431-8a0e-43e1-8c6a-9d2251e3d0a8',
  dailyLimit: 5,
};

const swapEls = {
  filepath: document.getElementById('swap-active-filepath'),
  tabpanel: document.getElementById('swap-tabpanel'),
  orgInput: document.getElementById('swap-org-input'),
  benefitInput: document.getElementById('swap-benefit-input'),
  limitInput: document.getElementById('swap-limit-input'),
  leftBadge: document.getElementById('swap-left-badge'),
  leftEndpoint: document.getElementById('swap-left-endpoint'),
  leftMeta: document.getElementById('swap-left-meta'),
  leftCode: document.getElementById('swap-left-code'),
  rightBadge: document.getElementById('swap-right-badge'),
  rightEndpoint: document.getElementById('swap-right-endpoint'),
  rightCode: document.getElementById('swap-right-code'),
  copyBtn: document.getElementById('swap-copy-btn'),
  copyLabel: document.getElementById('swap-copy-label'),
  toast: document.getElementById('copy-toast'),
  toastText: document.getElementById('copy-toast-text'),
  toastClose: document.getElementById('copy-toast-close'),
  toastLive: document.getElementById('toast-live'),
};

function getPolarHost() {
  return swapState.env === 'sandbox' ? 'sandbox-api.polar.sh' : 'api.polar.sh';
}

function buildSwapViewData() {
  const host = getPolarHost();
  const org = (swapState.orgId || 'your-public-org-uuid').trim();
  const benefit = (swapState.benefitId || '').trim();
  const limit = Math.max(1, Number(swapState.dailyLimit) || 5);

  if (swapState.mode === 'diff') {
    const leftLines = [
      { kind: 'ctx', text: '// Legacy Lemon Squeezy client call' },
      { kind: 'del', text: "const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {" },
      { kind: 'ctx', text: "  method: 'POST'," },
      { kind: 'del', text: "  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }," },
      { kind: 'del', text: '  body: new URLSearchParams({' },
      { kind: 'del', text: '    license_key: storedKey,' },
      { kind: 'del', text: '    instance_id: storedInstanceId,' },
      { kind: 'del', text: '  }),' },
      { kind: 'ctx', text: '});' },
      { kind: 'ctx', text: 'const data = await res.json();' },
      { kind: 'del', text: "const isPro = Boolean(data.valid && data.license_key?.status === 'active');" },
      { kind: 'ctx', text: '// Stops validating on March 31, 2027' },
    ];

    const rightLines = [
      { kind: 'ctx', text: '// Zero-backend Polar.sh MV3 client call' },
      { kind: 'add', text: `const res = await fetch('https://${host}/v1/customer-portal/license-keys/validate', {` },
      { kind: 'ctx', text: "  method: 'POST'," },
      { kind: 'add', text: "  headers: { 'Content-Type': 'application/json' }," },
      { kind: 'add', text: '  body: JSON.stringify({' },
      { kind: 'add', text: '    key: storedKey,' },
      { kind: 'add', text: `    organization_id: '${org}',` },
      ...(benefit ? [{ kind: 'add', text: `    benefit_id: '${benefit}',` }] : []),
      { kind: 'add', text: '    ...(activationId ? { activation_id: activationId } : {}),' },
      { kind: 'add', text: '  }),' },
      { kind: 'ctx', text: '});' },
      { kind: 'ctx', text: 'const data = await res.json();' },
      { kind: 'add', text: "const isPro = data.status === 'granted' && isGraceWindowValid(lastValidatedAt, now);" },
    ];

    return {
      filepath: 'src/lib/polar-license.ts',
      leftBadge: 'LEGACY // LEMON SQUEEZY',
      leftEndpoint: 'POST /v1/licenses/validate',
      leftMeta: 'Sunsetting Mar 31, 2027',
      rightBadge: 'TARGET // POLAR.SH MV3',
      rightEndpoint: `POST https://${host}/v1/customer-portal/license-keys/validate`,
      leftLines,
      rightLines,
      toastSummary: 'Copied Polar.sh validate snippet to clipboard',
    };
  }

  if (swapState.mode === 'gate') {
    const leftLines = [
      { kind: 'ctx', text: '// Bundled default: src/sidepanel/SidePanelApp.tsx' },
      { kind: 'del', text: "import { evaluatePageAudit } from '../lib/seo-audit.ts';" },
      { kind: 'ctx', text: "import { consumeDailyTrialAction } from '../lib/trial-quota.ts';" },
      { kind: 'ctx', text: "import { ProGate } from '../components/ProGate.tsx';" },
      { kind: 'ctx', text: '' },
      { kind: 'del', text: 'const report = evaluatePageAudit(pageUrl, meta, links, dupes);' },
      { kind: 'ctx', text: `const trial = await consumeDailyTrialAction({ isPro, limit: ${limit} });` },
      { kind: 'ctx', text: '' },
      { kind: 'ctx', text: '<ProGate isPro={isPro} featureName="Pro SEO Checklist">' },
      { kind: 'del', text: '  <SeoChecklistExport report={report} />' },
      { kind: 'ctx', text: '</ProGate>' },
    ];

    const rightLines = [
      { kind: 'ctx', text: '// Swapped custom product: AI Summarizer / Lead Tool' },
      { kind: 'add', text: "import { extractStructuredLeads } from '../lib/lead-extractor.ts';" },
      { kind: 'ctx', text: "import { consumeDailyTrialAction } from '../lib/trial-quota.ts';" },
      { kind: 'ctx', text: "import { ProGate } from '../components/ProGate.tsx';" },
      { kind: 'ctx', text: '' },
      { kind: 'add', text: 'const leads = extractStructuredLeads(activeTabDom);' },
      { kind: 'add', text: `const trial = await consumeDailyTrialAction({ isPro, limit: ${limit} });` },
      { kind: 'ctx', text: '' },
      { kind: 'add', text: '<ProGate isPro={isPro} featureName="Unlimited CSV & Webhook Export">' },
      { kind: 'add', text: '  <LeadExportWorkspace leads={leads} quota={trial} />' },
      { kind: 'ctx', text: '</ProGate>' },
    ];

    return {
      filepath: 'src/sidepanel/SidePanelApp.tsx',
      leftBadge: 'BUNDLED // SEO INSPECTOR',
      leftEndpoint: 'src/lib/seo-audit.ts',
      leftMeta: 'Ships ready to publish',
      rightBadge: 'SWAPPED // YOUR EXTENSION',
      rightEndpoint: 'ProGate + consumeDailyTrialAction()',
      leftLines,
      rightLines,
      toastSummary: 'Copied ProGate + daily trial swap snippet',
    };
  }

  const leftLines = [
    { kind: 'ctx', text: '// Chromium Manifest V3 (dist/manifest.json)' },
    { kind: 'ctx', text: '{' },
    { kind: 'ctx', text: '  "manifest_version": 3,' },
    { kind: 'del', text: '  "permissions": ["storage", "alarms", "sidePanel", "tabs"],' },
    { kind: 'del', text: '  "side_panel": { "default_path": "sidepanel.html" },' },
    { kind: 'del', text: '  "background": { "service_worker": "service-worker.js", "type": "module" },' },
    { kind: 'ctx', text: '  "host_permissions": [' },
    { kind: 'ctx', text: `    "https://${host}/*"` },
    { kind: 'ctx', text: '  ]' },
    { kind: 'ctx', text: '}' },
  ];

  const rightLines = [
    { kind: 'add', text: `# 1. Atomic rebrand (${swapState.env === 'sandbox' ? '--sandbox true' : 'production'})` },
    { kind: 'add', text: `node scripts/setup.mjs --non-interactive --org "${org}"${swapState.env === 'sandbox' ? ' --sandbox true' : ''}` },
    { kind: 'ctx', text: '' },
    { kind: 'add', text: '# 2. Build Chromium (dist/) + Firefox Gecko MV3 (dist-firefox/)' },
    { kind: 'add', text: 'npm run verify' },
    { kind: 'ctx', text: '' },
    { kind: 'ctx', text: '// Auto-emitted Firefox MV3 (dist-firefox/manifest.json):' },
    { kind: 'add', text: '// "sidebar_action": { "default_panel": "sidepanel.html" },' },
    { kind: 'add', text: '// "background": { "scripts": ["service-worker.js"] },' },
    { kind: 'add', text: '// "browser_specific_settings": { "gecko": { "id": "polarext@polarext.dev" } }' },
  ];

  return {
    filepath: 'scripts/setup.mjs + dist-firefox/manifest.json',
    leftBadge: 'CHROMIUM // DIST',
    leftEndpoint: 'Chrome · Edge · Brave · Arc',
    leftMeta: 'side_panel + service_worker',
    rightBadge: 'CLI + GECKO // DIST-FIREFOX',
    rightEndpoint: 'npm run setup && npm run verify',
    leftLines,
    rightLines,
    toastSummary: 'Copied PolarExt setup & verify CLI commands',
  };
}

function renderDiffLines(container, lines) {
  if (!container) return;
  container.textContent = '';
  const frag = document.createDocumentFragment();

  lines.forEach((line, idx) => {
    const row = document.createElement('div');
    row.className = `diff-line${line.kind === 'del' ? ' is-del' : line.kind === 'add' ? ' is-add' : ''}`;

    const ln = document.createElement('span');
    ln.className = 'ln';
    ln.textContent = String(idx + 1).padStart(2, '0');

    const sig = document.createElement('span');
    sig.className = 'sig';
    sig.textContent = line.kind === 'del' ? '-' : line.kind === 'add' ? '+' : ' ';

    const code = document.createElement('span');
    code.textContent = line.text || ' ';

    row.append(ln, sig, code);
    frag.appendChild(row);
  });

  container.appendChild(frag);
}

let currentCopyRawText = '';
let copyResetTimer = null;
let toastDismissTimer = null;
let toastPausedByFocus = false;
let lastToastTrigger = null;

function renderSwapConsole() {
  if (!swapEls.leftCode || !swapEls.rightCode) return;
  const view = buildSwapViewData();

  if (swapEls.filepath) swapEls.filepath.textContent = view.filepath;
  if (swapEls.leftBadge) swapEls.leftBadge.textContent = view.leftBadge;
  if (swapEls.leftEndpoint) swapEls.leftEndpoint.textContent = view.leftEndpoint;
  if (swapEls.leftMeta) swapEls.leftMeta.textContent = view.leftMeta;
  if (swapEls.rightBadge) swapEls.rightBadge.textContent = view.rightBadge;
  if (swapEls.rightEndpoint) swapEls.rightEndpoint.textContent = view.rightEndpoint;

  renderDiffLines(swapEls.leftCode, view.leftLines);
  renderDiffLines(swapEls.rightCode, view.rightLines);

  currentCopyRawText = view.rightLines.map((l) => l.text).join('\n');
  swapEls.copyBtn?.setAttribute('data-toast-msg', view.toastSummary);
}

document.querySelectorAll('[data-swap-mode]').forEach((btn) => {
  btn.addEventListener('click', () => {
    swapState.mode = btn.getAttribute('data-swap-mode') || 'diff';
    document.querySelectorAll('[data-swap-mode]').forEach((b) => {
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    });
    if (swapEls.tabpanel && btn.id) {
      swapEls.tabpanel.setAttribute('aria-labelledby', btn.id);
    }
    renderSwapConsole();
  });
});

document.querySelectorAll('[data-swap-env]').forEach((btn) => {
  btn.addEventListener('click', () => {
    swapState.env = btn.getAttribute('data-swap-env') || 'prod';
    document.querySelectorAll('[data-swap-env]').forEach((b) => {
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });
    renderSwapConsole();
  });
});

swapEls.orgInput?.addEventListener('input', (e) => {
  swapState.orgId = e.target.value;
  renderSwapConsole();
});

swapEls.benefitInput?.addEventListener('input', (e) => {
  swapState.benefitId = e.target.value;
  renderSwapConsole();
});

swapEls.limitInput?.addEventListener('input', (e) => {
  swapState.dailyLimit = Number(e.target.value) || 5;
  renderSwapConsole();
});

function hidePrecisionToast(restoreFocus = false) {
  const toast = swapEls.toast;
  if (!toast) return;
  if (typeof toast.hidePopover === 'function') {
    try {
      toast.hidePopover();
    } catch {
      toast.classList.remove(':popover-open');
    }
  } else {
    toast.classList.remove(':popover-open');
  }
  if (restoreFocus && lastToastTrigger instanceof HTMLElement) {
    lastToastTrigger.focus();
  }
}

function scheduleToastAutoHide() {
  window.clearTimeout(toastDismissTimer);
  toastDismissTimer = window.setTimeout(() => {
    if (!toastPausedByFocus) {
      hidePrecisionToast(false);
    }
  }, 3200);
}

function showPrecisionToast(message, triggerEl) {
  lastToastTrigger = triggerEl || null;
  if (swapEls.toastText) {
    swapEls.toastText.textContent = message;
  }

  // Screen reader announcement via ariaNotify (when supported) or persistent live region
  if (typeof document.ariaNotify === 'function') {
    document.ariaNotify(message);
  } else if (swapEls.toastLive) {
    swapEls.toastLive.textContent = '';
    window.setTimeout(() => {
      if (swapEls.toastLive) swapEls.toastLive.textContent = message;
    }, 20);
  }

  const toast = swapEls.toast;
  if (!toast) return;
  if (typeof toast.showPopover === 'function') {
    try {
      toast.showPopover();
    } catch {
      toast.classList.add(':popover-open');
    }
  } else {
    toast.classList.add(':popover-open');
  }
  scheduleToastAutoHide();
}

swapEls.toast?.addEventListener('focusin', () => {
  toastPausedByFocus = true;
  window.clearTimeout(toastDismissTimer);
});

swapEls.toast?.addEventListener('focusout', (e) => {
  if (!swapEls.toast?.contains(e.relatedTarget)) {
    toastPausedByFocus = false;
    scheduleToastAutoHide();
  }
});

swapEls.toastClose?.addEventListener('click', () => {
  const hadFocus = swapEls.toast?.contains(document.activeElement);
  window.clearTimeout(toastDismissTimer);
  hidePrecisionToast(Boolean(hadFocus));
});

swapEls.copyBtn?.addEventListener('click', async () => {
  if (!currentCopyRawText) return;
  try {
    await navigator.clipboard.writeText(currentCopyRawText);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = currentCopyRawText;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }

  swapEls.copyBtn.setAttribute('data-copied', 'true');
  if (swapEls.copyLabel) swapEls.copyLabel.textContent = 'Copied';

  const msg =
    swapEls.copyBtn.getAttribute('data-toast-msg') || 'Copied Polar.sh MV3 snippet to clipboard';
  showPrecisionToast(msg, swapEls.copyBtn);

  window.clearTimeout(copyResetTimer);
  copyResetTimer = window.setTimeout(() => {
    swapEls.copyBtn?.removeAttribute('data-copied');
    if (swapEls.copyLabel) swapEls.copyLabel.textContent = 'Copy Snippet';
  }, 2000);
});

renderSwapConsole();

// ============================================================================
// 2. ACCESSIBLE ARCHITECTURE TABS (hidden="until-found" + beforematch)
// ============================================================================
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

// ============================================================================
// 3. INTERACTIVE LIVE BROWSER EXTENSION SIMULATOR
// ============================================================================
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
    `POST https://${getPolarHost()}/v1/customer-portal/license-keys/activate
Request:  { "key": "${key}", "organization_id": "${swapState.orgId}", "label": "Chrome Extension – demo" }
Response: 200 OK { "id": "act-demo-01", "status": "granted", "limit_activations": 3, "usage": 0, "limit_usage": 100 }`,
  );
  renderSimulator();
});

simElements.deactivateBtn?.addEventListener('click', () => {
  simState.isPro = false;
  simState.offline = false;
  appendSimLog(
    `POST https://${getPolarHost()}/v1/customer-portal/license-keys/deactivate
Response: 204 No Content -> Cleared local activation in chrome.storage.local`,
  );
  renderSimulator();
});

simElements.offlineBtn?.addEventListener('click', () => {
  simState.offline = !simState.offline;
  if (simState.isPro && simState.offline) {
    appendSimLog(
      `[Daily Alarm] Revalidation hit TypeError (Offline)
-> Within 72h grace window (clock skew verified). Pro features remain unlocked.`,
    );
  } else if (simState.isPro) {
    appendSimLog(
      `POST https://${getPolarHost()}/v1/customer-portal/license-keys/validate
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

// ============================================================================
// 4. FAQ ACCORDION CONTROLS
// ============================================================================
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
