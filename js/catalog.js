/* ======================================================
   CATALOG — Завантаження каталогів СЕС та УЗЕ
   Сховище: n8n Static Data (GET/POST /kp-data)
====================================================== */

(function () {

  const DATA_URL    = 'https://n8n.rayton.net/webhook/kp-data';
  const SES_STORAGE = 'rayton_catalog';
  const UZE_STORAGE = 'rayton_uze_catalog';

  window.SES_CATALOG = null;
  window.CATALOG     = null;
  window.UZE_CATALOG = null;

  // ── Внутрішнє завантаження всіх даних з n8n ──────────────────
  async function fetchAll() {
    const res  = await fetch(DATA_URL, { cache: 'no-store' });
    return await res.json();
  }

  // ── СЕС каталог ───────────────────────────────────────────────
  async function loadSES() {
    try {
      const data = await fetchAll();
      if (data.ses_catalog) {
        window.SES_CATALOG = data.ses_catalog;
        window.CATALOG     = data.ses_catalog;
        localStorage.setItem(SES_STORAGE, JSON.stringify(data.ses_catalog));
        return;
      }
    } catch { /* fallback below */ }

    const stored = localStorage.getItem(SES_STORAGE);
    if (stored) {
      try {
        const p = JSON.parse(stored);
        window.SES_CATALOG = p;
        window.CATALOG     = p;
        return;
      } catch { }
    }
    if (window.SES_CATALOG_DATA) {
      window.SES_CATALOG = window.SES_CATALOG_DATA;
      window.CATALOG     = window.SES_CATALOG_DATA;
    }
  }

  async function saveSES(catalog) {
    window.SES_CATALOG = catalog;
    window.CATALOG     = catalog;
    localStorage.setItem(SES_STORAGE, JSON.stringify(catalog));
    await fetch(DATA_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ses_catalog: catalog })
    });
  }

  // ── УЗЕ каталог ───────────────────────────────────────────────
  async function loadUZE() {
    try {
      const data = await fetchAll();
      if (data.uze_catalog) {
        window.UZE_CATALOG = data.uze_catalog;
        localStorage.setItem(UZE_STORAGE, JSON.stringify(data.uze_catalog));
        return;
      }
    } catch { /* fallback below */ }

    const stored = localStorage.getItem(UZE_STORAGE);
    if (stored) {
      try { window.UZE_CATALOG = JSON.parse(stored); return; } catch { }
    }
    if (window.UZE_CATALOG_DATA) {
      window.UZE_CATALOG = JSON.parse(JSON.stringify(window.UZE_CATALOG_DATA));
    }
  }

  async function saveUZE(catalog) {
    window.UZE_CATALOG = catalog;
    localStorage.setItem(UZE_STORAGE, JSON.stringify(catalog));
    await fetch(DATA_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ uze_catalog: catalog })
    });
  }

  // ── Менеджери ─────────────────────────────────────────────────
  async function loadManagers() {
    try {
      const data = await fetchAll();
      if (data.managers?.length) return data.managers;
    } catch { }
    const stored = localStorage.getItem('rayton_managers');
    return stored ? JSON.parse(stored) : [];
  }

  async function saveManagers(managers) {
    localStorage.setItem('rayton_managers', JSON.stringify(managers));
    await fetch(DATA_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ managers })
    });
  }

  // ── Налаштування (шаблони, папки) ────────────────────────────
  async function loadSettings() {
    try {
      const data = await fetchAll();
      if (data.settings && Object.keys(data.settings).length) return data.settings;
    } catch { }
    const stored = localStorage.getItem('rayton_settings');
    return stored ? JSON.parse(stored) : {};
  }

  async function saveSettings(settings) {
    localStorage.setItem('rayton_settings', JSON.stringify(settings));
    await fetch(DATA_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ settings })
    });
  }

  // ── Init при завантаженні сторінки ────────────────────────────
  document.addEventListener('DOMContentLoaded', async () => {
    await loadSES();
    window.dispatchEvent(new CustomEvent('catalogReady', { detail: window.SES_CATALOG }));
  });

  // ── Публічний API ─────────────────────────────────────────────
  window.CatalogAPI = {
    load:         loadSES,
    save:         saveSES,
    loadSES,
    saveSES,
    loadUZE,
    saveUZE,
    loadManagers,
    saveManagers,
    loadSettings,
    saveSettings,
  };

})();
