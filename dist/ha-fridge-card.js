// ha-fridge-card.js
// Профессиональная карточка для холодильника Toshiba GR-RF695WI-PGJ
// v1.0.0 — Reduced spacing

import { FRIDGE_TRANSLATIONS } from './i18n/index.js';

// ─── Background presets ────────────────────────────────────────────────
const FRIDGE_BG_PRESETS = [
  { id: 'default', label: 'Default',  c1: '#0a1628', c2: '#1a2d4a' },
  { id: 'night',   label: 'Night',    c1: '#0d0d1a', c2: '#1a0a3a' },
  { id: 'sunset',  label: 'Sunset',   c1: '#1a0a00', c2: '#ff6b35' },
  { id: 'forest',  label: 'Forest',   c1: '#0a1a0a', c2: '#1a5c1a' },
  { id: 'aurora',  label: 'Aurora',   c1: '#0a0a1a', c2: '#00cc88' },
  { id: 'ocean',   label: 'Ocean',    c1: '#001020', c2: '#0055aa' },
  { id: 'ice',     label: 'Ice',      c1: '#0a1828', c2: '#88ddff' },
  { id: 'deep_neon', label: '🔵 Neon', c1: '#020b18', c2: '#00d4ff' },
  { id: 'custom',  label: '✏ Custom', c1: null,      c2: null },
];

// ─── Helpers ────────────────────────────────────────────────────────────
function fridgePresetGradient(preset, c1, c2, alpha) {
  const a = (alpha || 85) / 100;
  const p = FRIDGE_BG_PRESETS.find(x => x.id === preset) || FRIDGE_BG_PRESETS[0];
  const g1 = (preset === 'custom' ? c1 : p.c1) || '#0a1628';
  const g2 = (preset === 'custom' ? c2 : p.c2) || '#1a2d4a';
  return `linear-gradient(145deg, ${g1}${Math.round(a*255).toString(16).padStart(2,'0')} 0%, ${g2}${Math.round(a*255).toString(16).padStart(2,'0')} 100%)`;
}

// ─── Temperature color helper ──────────────────────────────────────────
function fridgeTempColor(temp, min, max, isCold = true) {
  const t = Math.max(min, Math.min(max, temp));
  const pct = (t - min) / (max - min);
  if (isCold) {
    if (pct < 0.33) {
      const p = pct / 0.33;
      return `rgb(${Math.round(30 + 70 * p)}, ${Math.round(100 + 120 * p)}, ${Math.round(220 - 80 * p)})`;
    } else if (pct < 0.66) {
      const p = (pct - 0.33) / 0.33;
      return `rgb(${Math.round(100 + 80 * p)}, ${Math.round(220 - 40 * p)}, ${Math.round(140 - 60 * p)})`;
    } else {
      const p = (pct - 0.66) / 0.34;
      return `rgb(${Math.round(180 + 70 * p)}, ${Math.round(180 - 80 * p)}, ${Math.round(80 - 70 * p)})`;
    }
  } else {
    if (pct < 0.33) {
      const p = pct / 0.33;
      return `rgb(${Math.round(80 + 150 * p)}, ${Math.round(200 - 80 * p)}, ${Math.round(80 - 60 * p)})`;
    } else if (pct < 0.66) {
      const p = (pct - 0.33) / 0.33;
      return `rgb(${Math.round(230 + 20 * p)}, ${Math.round(120 + 40 * p)}, ${Math.round(20 + 10 * p)})`;
    } else {
      const p = (pct - 0.66) / 0.34;
      return `rgb(${Math.round(250 + 5 * p)}, ${Math.round(160 - 80 * p)}, ${Math.round(30 - 20 * p)})`;
    }
  }
}

// ─── DEFAULT CONFIG ────────────────────────────────────────────────────
const FRIDGE_DEFAULT_CONFIG = {
  language: 'ru',
  title: 'Холодильник',
  subtitle: 'Multi-Door Refrigerator',
  owner_name: 'Smart Home',
  layout: 'flex',
  background_preset: 'default',
  bg_color1: '#0a1628',
  bg_color2: '#1a2d4a',
  bg_alpha: 85,
  bg_blur: 12,
  temp_unit: 'C',
  theme: 'default',
  color_temp_freezer: '',
  color_temp_fridge: '',
  color_temp_flex: '',
  color_accent: '#00d4ff',
  color_text: '',
  color_door_open: '#ff6b35',
  show_greet: true,
  show_zones: true,
  show_status: true,
  show_mode: true,
  show_power: true,
  freezer_entity: '',
  freezer_setting_entity: '',
  freezer_door_entity: '',
  fridge_entity: '',
  fridge_setting_entity: '',
  fridge_door_entity: '',
  flex_entity: '',
  flex_setting_entity: '',
  flex_door_entity: '',
  mode_entity: '',
};

// ─── CSS ───────────────────────────────────────────────────────────────
const FRIDGE_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:host{display:block;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif}
.card{background:${fridgePresetGradient('default')};border-radius:24px;border:1px solid rgba(255,255,255,0.1);
  overflow:hidden;position:relative;box-shadow:0 12px 48px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.08)}
.card::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 20% 30%,rgba(0,150,255,0.04),transparent 60%)}
.inner{position:relative;z-index:1;padding:16px 18px 14px}

/* ── Header ── */
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px;flex-wrap:wrap;gap:2px}
.header-left{display:flex;flex-direction:column;gap:2px}
.header-title{font-size:18px;font-weight:700;color:var(--cv-text,#ffffff);letter-spacing:-0.3px}
.header-sub{font-size:11px;color:var(--cv-subtext,rgba(255,255,255,0.5));font-weight:400;letter-spacing:0.3px}
.header-right{display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.header-greet{font-size:12px;font-weight:400;color:var(--cv-text,#ffffff);opacity:0.7}
.header-mode{display:flex;align-items:center;gap:6px;padding:3px 10px;border-radius:20px;
  background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);
  font-size:9px;font-weight:600;color:var(--cv-text,#ffffff);opacity:0.6}

/* ── Zones Grid ── */
.zones{display:grid;gap:10px;margin-bottom:10px}
.zones-3{grid-template-columns:repeat(3,1fr)}
.zones-2{grid-template-columns:repeat(2,1fr)}
.zones-1{grid-template-columns:1fr}
.zone{background:rgba(255,255,255,0.04);border-radius:16px;padding:10px 8px 8px;
  border:1px solid rgba(255,255,255,0.06);transition:all 0.3s;position:relative;
  box-shadow:0 2px 8px rgba(0,0,0,0.1);min-width:0}
.zone.door-open{border-color:var(--cv-door-open,#ff6b35);background:rgba(255,107,53,0.08)}
.zone-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;gap:4px;flex-wrap:nowrap}
.zone-name{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.2px;color:var(--cv-text,#ffffff);opacity:0.5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0}
.zone-door{cursor:pointer;font-size:10px;color:var(--cv-door-open,#ff6b35);opacity:0;transition:opacity 0.3s, transform 0.2s;padding:1px 3px;border-radius:4px;flex-shrink:0}
.zone.door-open .zone-door{opacity:1}
.zone-door:hover{transform:scale(1.2);background:rgba(255,107,53,0.15)}
.zone-temp{display:flex;align-items:baseline;gap:2px;margin-bottom:2px;cursor:pointer;flex-wrap:wrap}
.zone-temp:hover .zone-temp-value{opacity:0.8}
.zone-temp-value{font-size:20px;font-weight:700;line-height:1;transition:color 0.4s, opacity 0.2s}
.zone-temp-unit{font-size:11px;font-weight:400;color:var(--cv-text,#ffffff);opacity:0.4}
.zone-setting{font-size:9px;color:var(--cv-text,#ffffff);opacity:0.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.zone-bar{height:2px;border-radius:2px;background:rgba(255,255,255,0.06);margin-top:5px;overflow:hidden}
.zone-bar-fill{height:100%;border-radius:2px;transition:width 0.6s ease;width:0%}

/* Clickable indicators */
.zone-temp-clickable{position:relative}
.zone-temp-clickable::after{content:'📊';font-size:10px;opacity:0;transition:opacity 0.2s;margin-left:3px}
.zone-temp-clickable:hover::after{opacity:0.5}

.zone-door-clickable{position:relative}
.zone-door-clickable::after{content:'📊';font-size:9px;opacity:0;transition:opacity 0.2s;margin-left:2px}
.zone-door-clickable:hover::after{opacity:0.5}

/* ── Status Bar ── */
.status-bar{display:flex;justify-content:space-between;align-items:center;
  padding:6px 10px;background:rgba(255,255,255,0.04);border-radius:12px;
  border:1px solid rgba(255,255,255,0.06);margin-bottom:10px;flex-wrap:wrap;gap:4px}
.status-left{display:flex;align-items:center;gap:6px}
.status-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;animation:pulse 2s ease-in-out infinite}
.status-dot.warning{background:#f59e0b}
.status-dot.danger{background:#ef4444}
.status-dot.offline{background:#6b7280;animation:none}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
.status-text{font-size:11px;font-weight:500;color:var(--cv-text,#ffffff);opacity:0.8}
.status-right{display:flex;align-items:center;gap:10px;font-size:10px;color:var(--cv-text,#ffffff);opacity:0.4}
.status-power{font-weight:600;color:var(--cv-text,#ffffff);opacity:0.6}

/* ── Theme: Light ── */
.theme-light .card{background:rgba(255,255,255,0.85) !important;border-color:rgba(0,0,0,0.08);box-shadow:0 12px 48px rgba(0,0,0,0.12)}
.theme-light .card::before{background:radial-gradient(ellipse at 20% 30%,rgba(0,150,255,0.03),transparent 60%)}
.theme-light .header-title{color:var(--cv-text,#1a1a2e)}
.theme-light .header-sub{color:var(--cv-text,#1a1a2e);opacity:0.4}
.theme-light .header-greet{color:var(--cv-text,#1a1a2e);opacity:0.6}
.theme-light .header-mode{background:rgba(0,0,0,0.04);border-color:rgba(0,0,0,0.08);color:var(--cv-text,#1a1a2e);opacity:0.5}
.theme-light .zone{background:rgba(0,0,0,0.03);border-color:rgba(0,0,0,0.06);box-shadow:0 2px 8px rgba(0,0,0,0.04)}
.theme-light .zone.door-open{border-color:var(--cv-door-open,#ff6b35);background:rgba(255,107,53,0.06)}
.theme-light .zone-name{color:var(--cv-text,#1a1a2e);opacity:0.4}
.theme-light .zone-temp-unit{color:var(--cv-text,#1a1a2e);opacity:0.3}
.theme-light .zone-setting{color:var(--cv-text,#1a1a2e);opacity:0.3}
.theme-light .zone-bar{background:rgba(0,0,0,0.06)}
.theme-light .status-bar{background:rgba(0,0,0,0.03);border-color:rgba(0,0,0,0.06)}
.theme-light .status-text{color:var(--cv-text,#1a1a2e);opacity:0.7}
.theme-light .status-right{color:var(--cv-text,#1a1a2e);opacity:0.4}
.theme-light .status-power{color:var(--cv-text,#1a1a2e);opacity:0.5}

/* ── Theme: Dark ── */
.theme-dark .card{background:${fridgePresetGradient('default')} !important;border-color:rgba(255,255,255,0.08);box-shadow:0 12px 48px rgba(0,0,0,0.5)}
.theme-dark .header-title{color:var(--cv-text,#ffffff)}
.theme-dark .header-sub{color:var(--cv-text,#ffffff);opacity:0.4}
.theme-dark .header-greet{color:var(--cv-text,#ffffff);opacity:0.6}
.theme-dark .header-mode{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.08);color:var(--cv-text,#ffffff);opacity:0.5}
.theme-dark .zone{background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.06)}
.theme-dark .zone-name{color:var(--cv-text,#ffffff);opacity:0.4}
.theme-dark .zone-temp-unit{color:var(--cv-text,#ffffff);opacity:0.3}
.theme-dark .zone-setting{color:var(--cv-text,#ffffff);opacity:0.3}
.theme-dark .zone-bar{background:rgba(255,255,255,0.06)}
.theme-dark .status-bar{background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.06)}
.theme-dark .status-text{color:var(--cv-text,#ffffff);opacity:0.7}
.theme-dark .status-right{color:var(--cv-text,#ffffff);opacity:0.3}
.theme-dark .status-power{color:var(--cv-text,#ffffff);opacity:0.5}

/* ── Responsive ── */
@media(max-width:500px){
  .zones-3{grid-template-columns:1fr}
  .inner{padding:12px 14px 10px}
  .zone-temp-value{font-size:18px}
  .header-title{font-size:16px}
  .header{margin-bottom:6px}
  .status-bar{flex-direction:column;align-items:flex-start;gap:3px}
  .status-right{width:100%;justify-content:space-between}
  .zone-name{font-size:7px;white-space:normal;word-break:break-word}
  .zone-temp{flex-wrap:wrap}
  .zone-temp-value{font-size:16px}
  .zone-temp-unit{font-size:10px}
  .zone-setting{font-size:8px}
  .zone{padding:8px 6px 6px}
  .zones{gap:8px;margin-bottom:8px}
}

@media(max-width:380px){
  .zone-name{font-size:6px}
  .zone-temp-value{font-size:14px}
  .zone-temp-unit{font-size:9px}
  .zone-setting{font-size:7px}
}
`;

// ─── MAIN CARD ──────────────────────────────────────────────────────────
class FridgeCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = { ...FRIDGE_DEFAULT_CONFIG };
    this._hass = null;
    this._initialized = false;
    this._interval = null;
  }

  static getConfigElement() {
    return document.createElement('fridge-card-editor');
  }

  static getStubConfig() {
    return {
      ...FRIDGE_DEFAULT_CONFIG,
      freezer_entity: 'sensor.freezer_actual_temp',
      freezer_setting_entity: 'sensor.freezer_setting_temp',
      freezer_door_entity: 'binary_sensor.freezer_door',
      fridge_entity: 'sensor.refrigerator_actual_temp',
      fridge_setting_entity: 'sensor.refrigerator_setting_temp',
      fridge_door_entity: 'binary_sensor.refrigerator_door',
      flex_entity: 'sensor.flex_zone_actual_temp',
      flex_setting_entity: 'sensor.flex_zone_setting_temp',
      flex_door_entity: 'binary_sensor.flex_zone_door',
      mode_entity: 'sensor.variable_mode',
    };
  }

  getCardSize() {
    return 5;
  }

  get t() {
    return FRIDGE_TRANSLATIONS[this._config.language || 'ru'] || FRIDGE_TRANSLATIONS.ru;
  }

  setConfig(config) {
    this._config = { ...FRIDGE_DEFAULT_CONFIG, ...config };
    this._initialized = false;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._initialized) {
      this._render();
    } else {
      this._update();
    }
  }

  connectedCallback() {
    this._interval = setInterval(() => this._update(), 30000);
  }

  disconnectedCallback() {
    if (this._interval) { clearInterval(this._interval); this._interval = null; }
  }

  // ─── Entity helpers ──────────────────────────────────────────────────
  _state(entityId) {
    if (!entityId || !this._hass?.states) return null;
    return this._hass.states[entityId];
  }

  _getValue(entityId) {
    const s = this._state(entityId);
    if (!s || s.state === 'unavailable' || s.state === 'unknown') return null;
    const v = parseFloat(s.state);
    return isNaN(v) ? null : v;
  }

  _isDoorOpen(entityId) {
    const s = this._state(entityId);
    return s ? s.state === 'on' : false;
  }

  _getUnit(entityId) {
    const s = this._state(entityId);
    return s?.attributes?.unit_of_measurement || '°C';
  }

  // ─── Temperature display ────────────────────────────────────────────
  _formatTemp(value, entityId) {
    if (value === null) return '--';
    const haUnit = this._getUnit(entityId);
    const displayUnit = this._config.temp_unit || 'C';
    let val = value;
    if (haUnit === 'F' && displayUnit === 'C') val = (value - 32) * 5/9;
    else if (haUnit === 'C' && displayUnit === 'F') val = value * 9/5 + 32;
    return val.toFixed(1);
  }

  _getTempSuffix() {
    return (this._config.temp_unit || 'C') === 'F' ? '°F' : '°C';
  }

  // ─── Zone config ────────────────────────────────────────────────────
  _getZones() {
    const cfg = this._config;
    const layout = cfg.layout || 'flex';
    const zones = [];

    zones.push({
      id: 'freezer',
      name: this.t.zones.freezer,
      icon: '❄️',
      entity: cfg.freezer_entity,
      setting: cfg.freezer_setting_entity,
      door: cfg.freezer_door_entity,
      min: -30,
      max: 0,
      colorKey: 'color_temp_freezer',
    });

    if (layout === 'flex' || layout === 'inverted') {
      zones.push({
        id: 'fridge',
        name: this.t.zones.fridge,
        icon: '🧊',
        entity: cfg.fridge_entity,
        setting: cfg.fridge_setting_entity,
        door: cfg.fridge_door_entity,
        min: 0,
        max: 10,
        colorKey: 'color_temp_fridge',
      });
    }

    if (layout === 'flex') {
      zones.push({
        id: 'flex',
        name: this.t.zones.flex,
        icon: '🌡️',
        entity: cfg.flex_entity,
        setting: cfg.flex_setting_entity,
        door: cfg.flex_door_entity,
        min: -5,
        max: 5,
        colorKey: 'color_temp_flex',
      });
    }

    return zones;
  }

  _getLayoutClass() {
    const count = this._getZones().length;
    return `zones-${count}`;
  }

  // ─── Theme helper ──────────────────────────────────────────────────
  _getThemeClass() {
    const theme = this._config.theme || 'default';
    if (theme === 'light') return 'theme-light';
    if (theme === 'dark') return 'theme-dark';
    return '';
  }

  // ─── Open history/more-info ────────────────────────────────────────
  _openHistory(entityId) {
    if (!entityId || !this._hass) return;
    
    const event = new CustomEvent('hass-more-info', {
      detail: { entityId: entityId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  // ─── Render ──────────────────────────────────────────────────────────
  _render() {
    if (!this._hass) {
      return;
    }

    const cfg = this._config;
    const t = this.t;
    const zones = this._getZones();
    const bgGrad = fridgePresetGradient(cfg.background_preset, cfg.bg_color1, cfg.bg_color2, cfg.bg_alpha);
    const accent = cfg.color_accent || '#00d4ff';
    const textColor = cfg.color_text || (cfg.theme === 'light' ? '#1a1a2e' : '#ffffff');
    const doorColor = cfg.color_door_open || '#ff6b35';

    const customCss = `
      --cv-accent: ${accent};
      --cv-text: ${textColor};
      --cv-door-open: ${doorColor};
      background: ${bgGrad};
      backdrop-filter: blur(${cfg.bg_blur || 12}px);
      -webkit-backdrop-filter: blur(${cfg.bg_blur || 12}px);
    `;

    // ── Zone cards ──────────────────────────────────────────────────
    let zonesHtml = '';
    zones.forEach(z => {
      const temp = this._getValue(z.entity);
      const setting = this._getValue(z.setting);
      const doorOpen = this._isDoorOpen(z.door);
      const tempStr = this._formatTemp(temp, z.entity);
      const setStr = setting !== null ? this._formatTemp(setting, z.setting) : '--';
      const suffix = this._getTempSuffix();

      let color = cfg[z.colorKey] || fridgeTempColor(temp !== null ? temp : z.min, z.min, z.max, true);
      if (doorOpen) color = doorColor;

      const pct = temp !== null ? Math.max(0, Math.min(100, ((temp - z.min) / (z.max - z.min)) * 100)) : 0;

      zonesHtml += `
        <div class="zone${doorOpen ? ' door-open' : ''}">
          <div class="zone-header">
            <span class="zone-name" title="${z.name}">${z.icon} ${z.name}</span>
            <span class="zone-door zone-door-clickable" data-entity="${z.door}" data-zone="${z.id}" title="Нажмите для истории двери">${doorOpen ? '🚪' : ''}</span>
          </div>
          <div class="zone-temp zone-temp-clickable" data-entity="${z.entity}" data-zone="${z.id}" title="Нажмите для истории температуры">
            <span class="zone-temp-value" style="color:${color}">${tempStr}</span>
            <span class="zone-temp-unit"> ${suffix}</span>
          </div>
          <div class="zone-setting" title="Установка: ${setStr}${suffix}">${t.setLabel}: ${setStr}${suffix}</div>
          <div class="zone-bar">
            <div class="zone-bar-fill" style="width:${pct}%;background:${color}"></div>
          </div>
        </div>
      `;
    });

    // ── Status ──────────────────────────────────────────────────────
    const anyDoorOpen = zones.some(z => this._isDoorOpen(z.door));
    const modeEntity = cfg.mode_entity ? this._state(cfg.mode_entity) : null;
    const modeText = modeEntity ? modeEntity.state : '—';
    const statusDotClass = anyDoorOpen ? 'warning' : 'normal';
    const statusText = anyDoorOpen ? t.status.doorOpen : t.status.normal;

    const themeClass = this._getThemeClass();

    const html = `
      <style>${FRIDGE_CSS}</style>
      <div class="card ${themeClass}" style="${customCss}">
        <div class="inner">
          <div class="header">
            <div class="header-left">
              <div class="header-title">${cfg.title || t.cardTitle}</div>
              <div class="header-sub">${cfg.subtitle || t.cardSub}</div>
            </div>
            <div class="header-right">
              ${cfg.show_greet !== false ? `<div class="header-greet">${t.greet()} ${cfg.owner_name || 'Smart Home'}</div>` : ''}
              ${cfg.show_mode !== false ? `<div class="header-mode">⚙️ ${t.mode[modeText] || modeText}</div>` : ''}
            </div>
          </div>

          ${cfg.show_zones !== false ? `
            <div class="zones ${this._getLayoutClass()}">
              ${zonesHtml}
            </div>
          ` : ''}

          ${cfg.show_status !== false ? `
            <div class="status-bar">
              <div class="status-left">
                <span class="status-dot ${statusDotClass}"></span>
                <span class="status-text">${statusText}</span>
              </div>
              <div class="status-right">
                ${cfg.show_power !== false ? `<span class="status-power">⚡ -- W</span>` : ''}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    let container = this.shadowRoot.querySelector('#fridge-root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'fridge-root';
      this.shadowRoot.appendChild(container);
    }
    container.innerHTML = html;

    this._initialized = true;
    this._bindEvents();
  }

  // ─── Update ─────────────────────────────────────────────────────────
  _update() {
    if (!this._initialized || !this._hass) return;
    this._render();
  }

  // ─── Events ─────────────────────────────────────────────────────────
  _bindEvents() {
    const sr = this.shadowRoot;

    // Клик по температуре - открываем more-info
    const tempElements = sr?.querySelectorAll('.zone-temp');
    if (tempElements) {
      tempElements.forEach(el => {
        el.addEventListener('click', (e) => {
          const entityId = el.dataset.entity;
          if (entityId) {
            this._openHistory(entityId);
          }
        });
      });
    }

    // Клик по иконке двери - открываем more-info двери
    const doorElements = sr?.querySelectorAll('.zone-door');
    if (doorElements) {
      doorElements.forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const entityId = el.dataset.entity;
          if (entityId) {
            this._openHistory(entityId);
          }
        });
      });
    }
  }
}

// ─── EDITOR ────────────────────────────────────────────────────────────
class FridgeCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = { ...FRIDGE_DEFAULT_CONFIG };
    this._hass = null;
    this._open = { lang: true, title: true, layout: true, entities: true, colors: false, bg: true, display: false };
    this._picker = null;
  }

  setConfig(config) {
    this._config = { ...FRIDGE_DEFAULT_CONFIG, ...config };
    this._render();
  }

  set hass(h) {
    this._hass = h;
    this._syncPickers();
  }

  get t() {
    return FRIDGE_TRANSLATIONS[this._config.language || 'ru'] || FRIDGE_TRANSLATIONS.ru;
  }

  _fire() {
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    }));
  }

  _syncPickers() {
    if (!this._hass || !this.shadowRoot) return;
    const apply = () => {
      this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(p => {
        p.hass = this._hass;
        const domain = p.dataset.domain;
        if (domain) p.includeDomains = domain.split(',');
        const key = p.dataset.key;
        const saved = this._config[key] || '';
        if (saved && p.value !== saved) {
          p.value = saved;
          p.setAttribute('value', saved);
        }
      });
    };
    apply();
    requestAnimationFrame(() => requestAnimationFrame(apply));
  }

  _toggleSection(id) {
    this._open[id] = !this._open[id];
    const body = this.shadowRoot.getElementById('body-' + id);
    const arrow = this.shadowRoot.getElementById('arrow-' + id);
    if (body) {
      body.style.display = this._open[id] ? 'block' : 'none';
      if (arrow) arrow.textContent = this._open[id] ? '▾' : '▸';
      if (this._open[id]) this._syncPickers();
    }
  }

  _colorRow(key, label) {
    const value = this._config[key] || '#ffffff';
    const isOpen = this._picker === key;
    const swatches = ['#00d4ff', '#00ffcc', '#ff6b35', '#ffd740', '#4ade80', '#a78bfa', '#ffffff', '#94a3b8'];
    return `
      <div class="ci">
        <div class="ci-hdr" data-cp="${key}">
          <div class="ci-swatch" style="background:${value};"></div>
          <span class="ci-label">${label}</span>
          <code class="ci-code">${value}</code>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="ci-chv">
            <path d="${isOpen ? 'M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z' : 'M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'}"/>
          </svg>
        </div>
        ${isOpen ? `
          <div class="ci-body">
            <input type="color" data-cp-native="${key}" value="${value}" class="ci-native"/>
            <div class="ci-hex-wrap">
              <span class="ci-hash">#</span>
              <input type="text" data-cp-hex="${key}" value="${value.replace('#','')}" maxlength="6" placeholder="rrggbb" class="ci-hex-inp"/>
            </div>
            <div class="ci-swatches">
              ${swatches.map(c => `<div data-cp-dot="${key}" data-color="${c}" class="ci-dot"
                style="background:${c};outline:${value === c ? '2px solid var(--primary-color)' : '2px solid transparent'};"></div>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  _entityField(key, label, domain) {
    return `
      <div class="row">
        <label>${label}</label>
        <ha-entity-picker data-key="${key}" data-domain="${domain}" allow-custom-entity></ha-entity-picker>
      </div>
    `;
  }

  _toggleSwitch(key, label, desc) {
    const checked = this._config[key] !== false;
    return `
      <div class="disp-row">
        <div class="disp-info">
          <div class="disp-label">${label}</div>
          ${desc ? `<div class="disp-desc">${desc}</div>` : ''}
        </div>
        <label class="tog-wrap">
          <input type="checkbox" class="disp-tog" data-key="${key}" ${checked ? 'checked' : ''}>
          <span class="tog-slider"></span>
        </label>
      </div>
    `;
  }

  _render() {
    const cfg = this._config;
    const t = this.t;
    const lang = cfg.language || 'ru';
    const bgP = cfg.background_preset || 'default';
    const layout = cfg.layout || 'flex';
    const theme = cfg.theme || 'default';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; font-family:var(--primary-font-family,'Inter',sans-serif); }
        .editor { background:var(--card-background-color,#fff); color:var(--primary-text-color); }
        .credit {
          display:flex;align-items:center;gap:8px;padding:12px 16px 8px;
          font-size:12px;color:var(--primary-color);font-weight:500;
          border-bottom:1px solid var(--divider-color);
        }
        .acc-wrap { border-bottom:1px solid var(--divider-color); }
        .acc-head {
          display:flex;align-items:center;gap:10px;padding:14px 16px;cursor:pointer;
          user-select:none;font-size:14px;font-weight:500;color:var(--primary-text-color);
          background:var(--secondary-background-color);
        }
        .acc-head:hover { filter:brightness(.96); }
        .acc-head ha-icon { color:var(--secondary-text-color);--mdi-icon-size:18px; }
        .acc-arrow { margin-left:auto;font-size:14px;color:var(--secondary-text-color); }
        .acc-body { padding:12px 14px;border-top:1px solid var(--divider-color);background:var(--card-background-color,#fff); }
        .row { display:flex;flex-direction:column;margin-bottom:12px; }
        .row:last-child { margin-bottom:0; }
        .row label { font-size:12px;color:var(--secondary-text-color);margin-bottom:4px;font-weight:600; }
        ha-entity-picker { display:block;width:100%; }
        .lang-grid { display:flex;flex-wrap:wrap;gap:6px; }
        .lang-btn {
          display:flex;align-items:center;gap:5px;padding:7px 10px;border-radius:8px;
          border:1.5px solid var(--divider-color);background:var(--secondary-background-color);
          cursor:pointer;font-size:12px;color:var(--primary-text-color);transition:all .2s;
        }
        .lang-btn.on { border-color:var(--primary-color);background:rgba(3,169,244,.12);color:var(--primary-color);font-weight:700; }
        .txt-inp {
          background:var(--input-fill-color,rgba(0,0,0,.04));border:1px solid var(--divider-color);
          border-radius:8px;padding:8px 12px;font-size:13px;color:var(--primary-text-color);
          width:100%;box-sizing:border-box;font-family:inherit;
        }
        .txt-inp:focus { outline:none;border-color:var(--primary-color); }
        .bg-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-bottom:10px; }
        .bgs {
          border-radius:7px;height:38px;cursor:pointer;border:2px solid transparent;
          display:flex;align-items:flex-end;padding:3px 5px;font-size:9px;
          color:rgba(255,255,255,.85);text-shadow:0 1px 3px rgba(0,0,0,.9);
          transition:border-color .15s;white-space:nowrap;overflow:hidden;
        }
        .bgs.on { border-color:var(--primary-color); }
        .sl-row { display:flex;align-items:center;gap:10px;margin-top:8px; }
        .sl-row label { font-size:12px;font-weight:600;color:var(--secondary-text-color);min-width:80px; }
        .sl-row input[type=range] { flex:1;accent-color:var(--primary-color);height:4px;cursor:pointer; }
        .slv { font-size:12px;font-weight:700;color:var(--primary-color);min-width:36px;text-align:right; }
        .ci { border:1px solid var(--divider-color);border-radius:8px;overflow:hidden;margin-bottom:8px; }
        .ci:last-child { margin-bottom:0; }
        .ci-hdr { display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;background:var(--card-background-color,#fff); }
        .ci-swatch { width:24px;height:24px;border-radius:4px;border:1px solid rgba(0,0,0,.1);flex-shrink:0; }
        .ci-label { font-size:13px;flex:1;color:var(--primary-text-color); }
        .ci-code { font-size:11px;color:var(--secondary-text-color);font-family:monospace;background:var(--secondary-background-color);padding:2px 6px;border-radius:3px; }
        .ci-chv { color:var(--secondary-text-color);flex-shrink:0; }
        .ci-body { padding:12px 14px;background:var(--secondary-background-color);border-top:1px solid var(--divider-color);display:flex;flex-direction:column;gap:10px; }
        .ci-native { width:100%;height:44px;border:1px solid var(--divider-color);border-radius:6px;cursor:pointer;padding:2px;background:transparent; }
        .ci-hex-wrap { display:flex;align-items:center;gap:6px;border:1px solid var(--divider-color);border-radius:4px;padding:6px 10px;background:var(--card-background-color,#fff); }
        .ci-hash { color:var(--secondary-text-color);font-size:12px;font-family:monospace; }
        .ci-hex-inp { border:none;outline:none;width:100%;font-size:14px;color:var(--primary-text-color);font-family:monospace;background:transparent; }
        .ci-swatches { display:flex;gap:6px;flex-wrap:wrap; }
        .ci-dot { width:24px;height:24px;border-radius:50%;cursor:pointer;transition:transform .1s;outline-offset:2px; }
        .ci-dot:hover { transform:scale(1.15); }
        .disp-row { display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--divider-color); }
        .disp-row:last-child { border-bottom:none; }
        .disp-info { flex:1;min-width:0; }
        .disp-label { font-size:13px;font-weight:500;color:var(--primary-text-color); }
        .disp-desc { font-size:11px;color:var(--secondary-text-color);margin-top:2px; }
        .tog-wrap { position:relative;width:40px;height:22px;flex-shrink:0;cursor:pointer; }
        .tog-wrap input { opacity:0;width:0;height:0;position:absolute; }
        .tog-slider { position:absolute;inset:0;border-radius:11px;background:var(--divider-color);transition:background .25s; }
        .tog-slider:before { content:'';position:absolute;width:16px;height:16px;border-radius:50%;left:3px;top:3px;background:#fff;transition:transform .25s;box-shadow:0 1px 3px rgba(0,0,0,.3); }
        .tog-wrap input:checked + .tog-slider { background:var(--primary-color); }
        .tog-wrap input:checked + .tog-slider:before { transform:translateX(18px); }
        .reset-btn {
          width:100%;padding:8px;border-radius:7px;border:1px solid var(--divider-color);
          background:transparent;color:var(--secondary-text-color);font-size:12px;
          cursor:pointer;font-family:inherit;margin-top:10px;
        }
        .reset-btn:hover { background:var(--secondary-background-color); }
        .layout-grid { display:grid;grid-template-columns:1fr 1fr;gap:6px; }
        .layout-btn {
          padding:10px 6px;border-radius:8px;border:2px solid var(--divider-color);
          cursor:pointer;text-align:center;font-size:11px;font-weight:600;
          background:var(--secondary-background-color);color:var(--primary-text-color);
          transition:all .2s;
        }
        .layout-btn.on { border-color:var(--primary-color);background:rgba(3,169,244,.08);color:var(--primary-color); }
        .layout-btn .sub { font-size:9px;font-weight:400;color:var(--secondary-text-color);display:block;margin-top:2px; }
        .layout-btn.on .sub { color:var(--primary-color);opacity:0.7; }
        .theme-grid { display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:8px; }
        .theme-btn {
          padding:8px 6px;border-radius:8px;border:2px solid var(--divider-color);
          cursor:pointer;text-align:center;font-size:11px;font-weight:600;
          background:var(--secondary-background-color);color:var(--primary-text-color);
          transition:all .2s;
        }
        .theme-btn.on { border-color:var(--primary-color);background:rgba(3,169,244,.08);color:var(--primary-color); }
        .theme-btn .sub { font-size:9px;font-weight:400;color:var(--secondary-text-color);display:block;margin-top:2px; }
        .theme-btn.on .sub { color:var(--primary-color);opacity:0.7; }
        .temp-unit-grid { display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px; }
        .temp-unit-btn {
          padding:8px 6px;border-radius:8px;border:2px solid var(--divider-color);
          cursor:pointer;text-align:center;font-size:12px;font-weight:600;
          background:var(--secondary-background-color);color:var(--primary-text-color);
          transition:all .2s;
        }
        .temp-unit-btn.on { border-color:var(--primary-color);background:rgba(3,169,244,.08);color:var(--primary-color); }
      </style>

      <div class="editor">
        <div class="credit">🧊 <strong>Fridge Card</strong>
          <span style="color:var(--secondary-text-color);font-weight:400;">v1.3.5 — Reduced spacing</span>
        </div>

        <!-- 0. Language -->
        <div class="acc-wrap">
          <div class="acc-head" id="head-lang">
            <ha-icon icon="mdi:translate"></ha-icon> ${t.edLang}
            <span class="acc-arrow" id="arrow-lang">${this._open.lang ? '▾' : '▸'}</span>
          </div>
          <div class="acc-body" id="body-lang" style="display:${this._open.lang ? 'block' : 'none'}">
            <div class="lang-grid">
              ${Object.entries(FRIDGE_TRANSLATIONS).map(([code, tr]) => `
                <div class="lang-btn ${lang === code ? 'on' : ''}" data-lang="${code}">
                  <img src="https://flagcdn.com/20x15/${tr.flag}.png" width="20" height="15" alt="${tr.lang}" style="border-radius:2px;flex-shrink:0;display:block;">
                  ${tr.lang}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 1. Title & Display -->
        <div class="acc-wrap">
          <div class="acc-head" id="head-title">
            <ha-icon icon="mdi:card-text-outline"></ha-icon> ${t.edTitle}
            <span class="acc-arrow" id="arrow-title">${this._open.title ? '▾' : '▸'}</span>
          </div>
          <div class="acc-body" id="body-title" style="display:${this._open.title ? 'block' : 'none'}">
            <div class="row">
              <label>${t.edTitleLabel}</label>
              <input class="txt-inp" id="inp-title" value="${cfg.title || ''}" placeholder="${t.cardTitle}"/>
            </div>
            <div class="row">
              <label>${t.edSubtitleLabel}</label>
              <input class="txt-inp" id="inp-subtitle" value="${cfg.subtitle || ''}" placeholder="${t.cardSub}"/>
            </div>
            <div class="row">
              <label>${t.edOwnerName}</label>
              <input class="txt-inp" id="inp-owner" value="${cfg.owner_name || ''}" placeholder="Smart Home"/>
            </div>
            ${this._toggleSwitch('show_greet', t.edShowGreet, t.edShowGreetDesc)}
            <div style="margin-top:8px;">
              <div style="font-size:11px;font-weight:700;color:var(--secondary-text-color);margin-bottom:6px;">${t.edTempUnit}</div>
              <div class="temp-unit-grid">
                <div class="temp-unit-btn ${(cfg.temp_unit || 'C') === 'C' ? 'on' : ''}" id="tu-c">${t.edTempUnitC}</div>
                <div class="temp-unit-btn ${(cfg.temp_unit || 'C') === 'F' ? 'on' : ''}" id="tu-f">${t.edTempUnitF}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Layout -->
        <div class="acc-wrap">
          <div class="acc-head" id="head-layout">
            <ha-icon icon="mdi:view-grid"></ha-icon> ${t.edLayout}
            <span class="acc-arrow" id="arrow-layout">${this._open.layout ? '▾' : '▸'}</span>
          </div>
          <div class="acc-body" id="body-layout" style="display:${this._open.layout ? 'block' : 'none'}">
            <div class="layout-grid">
              ${[
                { id: 'flex', label: '❄️🧊🌡️', sub: t.edLayoutFlex },
                { id: 'default', label: '❄️🧊', sub: t.edLayoutDefault },
                { id: 'inverted', label: '🧊❄️', sub: t.edLayoutInverted },
                { id: 'freezer', label: '❄️', sub: t.edLayoutFreezer },
              ].map(l => `
                <div class="layout-btn ${layout === l.id ? 'on' : ''}" data-layout="${l.id}">
                  ${l.label}
                  <span class="sub">${l.sub}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 3. Entities -->
        <div class="acc-wrap">
          <div class="acc-head" id="head-entities">
            <ha-icon icon="mdi:database"></ha-icon> ${t.edEntities}
            <span class="acc-arrow" id="arrow-entities">${this._open.entities ? '▾' : '▸'}</span>
          </div>
          <div class="acc-body" id="body-entities" style="display:${this._open.entities ? 'block' : 'none'}">
            ${this._entityField('freezer_entity', t.edFreezer, 'sensor')}
            ${this._entityField('freezer_setting_entity', t.edFreezerSetting, 'sensor')}
            ${this._entityField('freezer_door_entity', t.edFreezerDoor, 'binary_sensor')}
            ${this._entityField('fridge_entity', t.edFridge, 'sensor')}
            ${this._entityField('fridge_setting_entity', t.edFridgeSetting, 'sensor')}
            ${this._entityField('fridge_door_entity', t.edFridgeDoor, 'binary_sensor')}
            ${this._entityField('flex_entity', t.edFlex, 'sensor')}
            ${this._entityField('flex_setting_entity', t.edFlexSetting, 'sensor')}
            ${this._entityField('flex_door_entity', t.edFlexDoor, 'binary_sensor')}
            ${this._entityField('mode_entity', t.edMode, 'sensor')}
          </div>
        </div>

        <!-- 4. Background -->
        <div class="acc-wrap">
          <div class="acc-head" id="head-bg">
            <ha-icon icon="mdi:palette"></ha-icon> ${t.edBg}
            <span class="acc-arrow" id="arrow-bg">${this._open.bg ? '▾' : '▸'}</span>
          </div>
          <div class="acc-body" id="body-bg" style="display:${this._open.bg ? 'block' : 'none'}">
            <div style="font-size:11px;font-weight:700;color:var(--secondary-text-color);margin-bottom:8px;">${t.edBgPresets}</div>
            <div class="bg-grid">
              ${FRIDGE_BG_PRESETS.map(p => {
                const c1 = p.c1 || '#888', c2 = p.c2 || '#444';
                const isC = p.id === 'custom';
                return `<div class="bgs ${bgP === p.id ? 'on' : ''}" data-bg="${p.id}"
                  style="${isC ? 'background:linear-gradient(135deg,#e0e0e0,#bdbdbd);color:#555;text-shadow:none;' : 'background:linear-gradient(135deg,' + c1 + 'cc 0%,' + c2 + '55 100%);'}">${p.label}</div>`;
              }).join('')}
            </div>
            ${bgP === 'custom' ? `
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;">
                ${this._colorRow('bg_color1', 'Color 1')}
                ${this._colorRow('bg_color2', 'Color 2')}
              </div>
            ` : ''}
            <div class="sl-row">
              <label>${t.edBgAlpha}</label>
              <input type="range" id="inp-bg-alpha" min="0" max="100" step="1" value="${cfg.bg_alpha !== undefined ? cfg.bg_alpha : 85}"/>
              <span class="slv" id="bg-alpha-lbl">${cfg.bg_alpha !== undefined ? cfg.bg_alpha : 85}%</span>
            </div>
            <div class="sl-row" style="margin-top:4px;">
              <label>${t.edBgBlur}</label>
              <input type="range" id="inp-bg-blur" min="0" max="30" step="1" value="${cfg.bg_blur !== undefined ? cfg.bg_blur : 12}"/>
              <span class="slv" id="bg-blur-lbl">${cfg.bg_blur !== undefined ? cfg.bg_blur : 12}px</span>
            </div>
          </div>
        </div>

        <!-- 5. Colors -->
        <div class="acc-wrap">
          <div class="acc-head" id="head-colors">
            <ha-icon icon="mdi:palette-swatch"></ha-icon> ${t.edColors}
            <span class="acc-arrow" id="arrow-colors">${this._open.colors ? '▾' : '▸'}</span>
          </div>
          <div class="acc-body" id="body-colors" style="display:${this._open.colors ? 'block' : 'none'}">
            ${this._colorRow('color_temp_freezer', t.edColorTempFreezer)}
            ${this._colorRow('color_temp_fridge', t.edColorTempFridge)}
            ${this._colorRow('color_temp_flex', t.edColorTempFlex)}
            ${this._colorRow('color_accent', t.edColorAccent)}
            ${this._colorRow('color_text', t.edColorText)}
            ${this._colorRow('color_door_open', t.edColorDoorOpen)}
            <button class="reset-btn" id="btn-reset-colors">${t.edColorsReset}</button>
          </div>
        </div>

        <!-- 6. Display -->
        <div class="acc-wrap">
          <div class="acc-head" id="head-display">
            <ha-icon icon="mdi:eye"></ha-icon> ${t.edDisplay}
            <span class="acc-arrow" id="arrow-display">${this._open.display ? '▾' : '▸'}</span>
          </div>
          <div class="acc-body" id="body-display" style="display:${this._open.display ? 'block' : 'none'}">
            ${this._toggleSwitch('show_zones', t.edShowZones, '')}
            ${this._toggleSwitch('show_status', t.edShowStatus, '')}
            ${this._toggleSwitch('show_mode', t.edShowMode, '')}
            ${this._toggleSwitch('show_power', t.edShowPower, '')}
            <div style="height:1px;background:var(--divider-color);margin:8px 0;"></div>
            <div style="font-size:11px;font-weight:700;color:var(--secondary-text-color);margin-bottom:6px;">${t.edTheme}</div>
            <div class="theme-grid">
              ${[
                { id: 'default', label: '🌓', sub: t.edThemeDefault },
                { id: 'light', label: '☀️', sub: t.edThemeLight },
                { id: 'dark', label: '🌙', sub: t.edThemeDark },
              ].map(th => `
                <div class="theme-btn ${theme === th.id ? 'on' : ''}" data-theme="${th.id}">
                  ${th.label}
                  <span class="sub">${th.sub}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    this._bindEvents();
    this._syncPickers();
  }

  _bindEvents() {
    const sr = this.shadowRoot;

    // Accordion
    ['lang', 'title', 'layout', 'entities', 'bg', 'colors', 'display'].forEach(id => {
      const hdr = sr.getElementById('head-' + id);
      if (hdr) hdr.addEventListener('click', () => this._toggleSection(id));
    });

    // Language
    sr.querySelectorAll('[data-lang]').forEach(btn =>
      btn.addEventListener('click', () => {
        this._config.language = btn.dataset.lang;
        this._fire();
        this._render();
      }));

    // Layout
    sr.querySelectorAll('[data-layout]').forEach(btn =>
      btn.addEventListener('click', () => {
        this._config.layout = btn.dataset.layout;
        this._fire();
        this._render();
      }));

    // Theme
    sr.querySelectorAll('[data-theme]').forEach(btn =>
      btn.addEventListener('click', () => {
        this._config.theme = btn.dataset.theme;
        this._fire();
        this._render();
      }));

    // Text inputs
    const wireText = (id, key) => {
      const el = sr.getElementById(id);
      if (!el) return;
      const commit = () => {
        this._config[key] = el.value.trim();
        this._fire();
      };
      el.addEventListener('change', commit);
      el.addEventListener('blur', commit);
    };
    wireText('inp-title', 'title');
    wireText('inp-subtitle', 'subtitle');
    wireText('inp-owner', 'owner_name');

    // Temperature unit
    const tuC = sr.getElementById('tu-c');
    const tuF = sr.getElementById('tu-f');
    if (tuC) tuC.addEventListener('click', () => {
      this._config.temp_unit = 'C';
      this._fire();
      this._render();
    });
    if (tuF) tuF.addEventListener('click', () => {
      this._config.temp_unit = 'F';
      this._fire();
      this._render();
    });

    // BG preset
    sr.querySelectorAll('[data-bg]').forEach(tile =>
      tile.addEventListener('click', () => {
        this._config.background_preset = tile.dataset.bg;
        this._fire();
        this._render();
      }));

    // BG alpha slider
    const alphaSlider = sr.getElementById('inp-bg-alpha');
    if (alphaSlider) {
      const lbl = sr.getElementById('bg-alpha-lbl');
      alphaSlider.addEventListener('input', () => {
        if (lbl) lbl.textContent = alphaSlider.value + '%';
        this._config.bg_alpha = parseInt(alphaSlider.value);
        this._fire();
      });
    }

    // BG blur slider
    const blurSlider = sr.getElementById('inp-bg-blur');
    if (blurSlider) {
      const lbl = sr.getElementById('bg-blur-lbl');
      blurSlider.addEventListener('input', () => {
        if (lbl) lbl.textContent = blurSlider.value + 'px';
        this._config.bg_blur = parseInt(blurSlider.value);
        this._fire();
      });
    }

    // Color pickers
    sr.querySelectorAll('[data-cp]').forEach(hdr =>
      hdr.addEventListener('click', () => {
        this._picker = this._picker === hdr.dataset.cp ? null : hdr.dataset.cp;
        this._render();
      }));

    sr.querySelectorAll('[data-cp-native]').forEach(inp => {
      inp.addEventListener('input', () => {
        const ci = inp.closest('.ci');
        const sw = ci?.querySelector('.ci-swatch');
        const code = ci?.querySelector('.ci-code');
        const hex = sr.querySelector(`[data-cp-hex="${inp.dataset.cpNative}"]`);
        if (sw) sw.style.background = inp.value;
        if (code) code.textContent = inp.value;
        if (hex) hex.value = inp.value.replace('#', '');
        this._config[inp.dataset.cpNative] = inp.value;
        this._fire();
      });
      inp.addEventListener('change', () => {
        this._config[inp.dataset.cpNative] = inp.value;
        this._fire();
        this._render();
      });
    });

    sr.querySelectorAll('[data-cp-hex]').forEach(inp =>
      inp.addEventListener('change', () => {
        const val = '#' + inp.value.replace('#', '');
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
          this._config[inp.dataset.cpHex] = val;
          this._fire();
          this._render();
        }
      }));

    sr.querySelectorAll('[data-cp-dot]').forEach(dot =>
      dot.addEventListener('click', () => {
        this._config[dot.dataset.cpDot] = dot.dataset.color;
        this._fire();
        this._render();
      }));

    // Reset colors
    const resetBtn = sr.getElementById('btn-reset-colors');
    if (resetBtn) resetBtn.addEventListener('click', () => {
      ['color_temp_freezer', 'color_temp_fridge', 'color_temp_flex',
       'color_accent', 'color_text', 'color_door_open'].forEach(k => delete this._config[k]);
      this._fire();
      this._render();
    });

    // Display toggles
    sr.querySelectorAll('.disp-tog').forEach(tog =>
      tog.addEventListener('change', () => {
        this._config[tog.dataset.key] = tog.checked;
        this._fire();
        this._render();
      }));

    // Entity pickers
    sr.querySelectorAll('ha-entity-picker[data-key]').forEach(picker =>
      picker.addEventListener('value-changed', e => {
        const key = picker.dataset.key;
        const val = e.detail.value;
        const c = { ...this._config };
        if (val) c[key] = val;
        else delete c[key];
        this._config = c;
        this._fire();
      }));
  }
}

// ─── REGISTER ──────────────────────────────────────────────────────────
customElements.define('fridge-card', FridgeCard);
customElements.define('fridge-card-editor', FridgeCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'fridge-card',
  name: 'Toshiba Fridge Card',
  description: 'Professional fridge card for Toshiba GR-RF695WI-PGJ with multi-language support, visual editor, theme support, clickable temperature AND door history',
  preview: true,
});

console.info(
  '%c 🧊 Fridge Card %c v1.0.0 %c ready! (Reduced spacing)',
  'background:#0a1628;color:#00d4ff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px;font-size:12px',
  'background:#00d4ff;color:#0a1628;font-weight:700;padding:2px 6px;border-radius:0 4px 4px 0;font-size:12px',
  'color:#4ade80;font-weight:400;font-size:11px;margin-left:4px'
);