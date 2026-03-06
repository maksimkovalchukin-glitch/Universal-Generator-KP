/* ======================================================
   CATALOG — Завантаження каталогів СЕС та УЗЕ
   Зберігається в n8n Static Data, кешується в localStorage
====================================================== */

(function () {

  const SES_URL     = 'https://n8n.rayton.net/webhook/ses-catalog';
  const UZE_URL     = 'https://n8n.rayton.net/webhook/uze-catalog';
  const SES_STORAGE = 'rayton_catalog';
  const UZE_STORAGE = 'rayton_uze_catalog';

  window.SES_CATALOG = null;
  window.CATALOG     = null; // backward compat alias
  window.UZE_CATALOG = null;

  async function loadSES() {
    try {
      const res  = await fetch(SES_URL, { cache: 'no-store' });
      const data = await res.json();
      if (data.catalog) {
        window.SES_CATALOG = data.catalog;
        window.CATALOG     = data.catalog;
        localStorage.setItem(SES_STORAGE, JSON.stringify(data.catalog));
        return;
      }
    } catch { /* fallback below */ }

    const stored = localStorage.getItem(SES_STORAGE);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        window.SES_CATALOG = parsed;
        window.CATALOG     = parsed;
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
    await fetch(SES_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ catalog })
    });
  }

  async function loadUZE() {
    try {
      const res  = await fetch(UZE_URL, { cache: 'no-store' });
      const data = await res.json();
      if (data.catalog) {
        window.UZE_CATALOG = data.catalog;
        localStorage.setItem(UZE_STORAGE, JSON.stringify(data.catalog));
        return;
      }
    } catch { /* fallback below */ }

    const stored = localStorage.getItem(UZE_STORAGE);
    if (stored) {
      try {
        window.UZE_CATALOG = JSON.parse(stored);
        return;
      } catch { }
    }

    if (window.UZE_CATALOG_DATA) {
      window.UZE_CATALOG = JSON.parse(JSON.stringify(window.UZE_CATALOG_DATA));
    }
  }

  async function saveUZE(catalog) {
    window.UZE_CATALOG = catalog;
    localStorage.setItem(UZE_STORAGE, JSON.stringify(catalog));
    await fetch(UZE_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ catalog })
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await loadSES();
    window.dispatchEvent(new CustomEvent('catalogReady', { detail: window.SES_CATALOG }));
  });

  window.CatalogAPI = {
    load:    loadSES,   // backward compat
    save:    saveSES,   // backward compat
    loadSES,
    saveSES,
    loadUZE,
    saveUZE,
  };

})();
