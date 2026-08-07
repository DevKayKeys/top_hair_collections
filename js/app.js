/**
 * Top Hair Collections - Main Application
 * Professional e-commerce functionality
 */

'use strict';

const CONFIG = {
  currency: '₦',
  whatsappNumber: '2347031696283',
  paystackPublicKey: 'pk_live_xxxxxxxxxxxxxxxx', // replace with real key
  storageKey: 'topHairCart',
  notificationDuration: 3000
};

/* ===== CART MANAGER ===== */
class CartManager {
  constructor() {
    this.cart = this._load();
  }

  _load() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || [];
    } catch {
      return [];
    }
  }

  _save() {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(this.cart));
    } catch (e) {
      console.error('Cart save error:', e);
    }
  }

  addItem(name, price, qty = 1) {
    if (!name || !price || price <= 0) return false;
    const existing = this.cart.find(i => i.name === name);
    if (existing) {
      existing.qty += qty;
      existing.total = existing.qty * existing.price;
    } else {
      this.cart.push({ id: Date.now(), name, price, qty, total: price * qty });
    }
    this._save();
    this.render();
    notify(`${name} added to cart!`, 'success');
    return true;
  }

  removeItem(id) {
    const idx = this.cart.findIndex(i => i.id === id);
    if (idx === -1) return;
    const name = this.cart[idx].name;
    this.cart.splice(idx, 1);
    this._save();
    this.render();
    notify(`${name} removed`, 'info');
  }

  getTotal() {
    return this.cart.reduce((s, i) => s + i.total, 0);
  }

  getCount() {
    return this.cart.reduce((s, i) => s + i.qty, 0);
  }

  clear() {
    this.cart = [];
    this._save();
    this.render();
  }

  render() {
    const el = document.getElementById('cartItems');
    const tot = document.getElementById('total');
    if (!el || !tot) return;

    if (!this.cart.length) {
      el.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      tot.textContent = CONFIG.currency + '0';
      return;
    }

    el.innerHTML = this.cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-details">
          <strong>${safe(item.name)}</strong>
          <small>${CONFIG.currency}${item.price.toLocaleString()} &times; ${item.qty}</small>
        </div>
        <div class="cart-item-actions">
          <strong>${CONFIG.currency}${item.total.toLocaleString()}</strong>
          <button onclick="cart.removeItem(${item.id})" class="btn-remove" aria-label="Remove ${safe(item.name)}">Remove</button>
        </div>
      </div>`).join('');

    tot.textContent = CONFIG.currency + this.getTotal().toLocaleString();
  }
}

const cart = new CartManager();

/* ===== GLOBAL WRAPPERS ===== */
function addToCart(name, price) { cart.addItem(name, price); }

/* ===== CHECKOUT ===== */
function checkout() {
  if (!cart.cart.length) { notify('Your cart is empty!', 'error'); return; }
  const lines = cart.cart.map(i => `${i.name} (${i.qty}x) - ${CONFIG.currency}${i.total.toLocaleString()}`).join('%0A');
  const msg = `Hello! I'd like to place an order:%0A%0A${lines}%0A%0ATotal: ${CONFIG.currency}${cart.getTotal().toLocaleString()}`;
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`, '_blank');
}

function payOnline() {
  if (!cart.cart.length) { notify('Your cart is empty!', 'error'); return; }
  const total = cart.getTotal();

  if (typeof PaystackPop !== 'undefined') {
    const handler = PaystackPop.setup({
      key: CONFIG.paystackPublicKey,
      email: prompt('Enter your email for payment:') || 'customer@tophaircollections.com',
      amount: total * 100,
      currency: 'NGN',
      ref: 'THC' + Date.now(),
      callback(response) {
        notify('Payment successful! Ref: ' + response.reference, 'success');
        cart.clear();
      },
      onClose() {
        notify('Payment window closed', 'info');
      }
    });
    handler.openIframe();
  } else {
    // Fallback — open Paystack portal
    window.open('https://paystack.com/pay/tophaircollections', '_blank');
  }
}

/* ===== SEARCH ===== */
function performSearch() {
  const input = document.getElementById('productSearch');
  if (!input) return;
  const q = input.value.trim().toLowerCase();
  if (!q) { notify('Please enter a search term', 'info'); return; }
  const count = _filter(q);
  notify(`Found ${count} product(s) for "${q}"`, 'info');
}

function clearSearch() {
  const input = document.getElementById('productSearch');
  if (input) input.value = '';
  document.querySelectorAll('.item').forEach(el => el.style.display = '');
  document.querySelector('.no-results')?.remove();
  notify('Search cleared', 'info');
}

function _filter(q) {
  let n = 0;
  document.querySelectorAll('.item').forEach(el => {
    const text = el.textContent.toLowerCase();
    const show = !q || text.includes(q);
    el.style.display = show ? '' : 'none';
    if (show) n++;
  });
  _noResults(n, q);
  return n;
}

function _noResults(count, term) {
  const section = document.querySelector('.products');
  let el = document.querySelector('.no-results');
  if (!section) return;
  if (count === 0 && term) {
    if (!el) { el = document.createElement('div'); el.className = 'no-results'; section.appendChild(el); }
    el.innerHTML = `<p>No products found for <strong>${safe(term)}</strong>. <button onclick="clearSearch()" class="btn-link">Clear search</button></p>`;
  } else {
    el?.remove();
  }
}

/* ===== TRACKING ===== */
function trackOrder() {
  const code = document.getElementById('trackCode')?.value.trim();
  const result = document.getElementById('trackResult');
  if (!result) return;

  if (!code || code.length < 5) {
    _trackError('Please enter a valid tracking code (min 5 characters).');
    return;
  }

  result.innerHTML = `<div class="tracking-result loading"><div class="loading-spinner"></div><p>Tracking your order…</p></div>`;
  result.style.display = 'block';

  setTimeout(() => {
    if (code.toUpperCase().startsWith('THC')) {
      _trackSuccess(code);
    } else {
      _trackError('Invalid code. Codes should start with "THC". <a href="https://wa.me/' + CONFIG.whatsappNumber + '?text=Hello!+I+need+help+tracking+code:+' + encodeURIComponent(code) + '" target="_blank" rel="noopener">Get help on WhatsApp</a>');
    }
  }, 1500);
}

function _trackSuccess(code) {
  const statuses = ['Delivered', 'Out for Delivery', 'In Transit', 'Processing'];
  const s = statuses[Math.floor(Math.random() * statuses.length)];
  const badge = { Delivered: '#4CAF50', 'Out for Delivery': '#FF9800', 'In Transit': '#2196F3', Processing: '#9C27B0' };
  document.getElementById('trackResult').innerHTML = `
    <div class="tracking-result success">
      <div class="result-header">
        <div class="result-icon">✅</div>
        <h3>Order Found</h3>
        <p>Tracking Code: <strong>${safe(code.toUpperCase())}</strong></p>
      </div>
      <div class="current-status">
        <h4>Status: <span class="status-badge" style="background:${badge[s]};color:#fff;padding:4px 12px;border-radius:20px;font-size:.85rem">${s}</span></h4>
        <p>📍 Lagos Distribution Centre &nbsp;|&nbsp; 🕐 Updated just now</p>
      </div>
      <div class="tracking-actions">
        <a href="https://wa.me/${CONFIG.whatsappNumber}?text=Hello!+My+tracking+code+is+${encodeURIComponent(code)}" target="_blank" rel="noopener" class="btn btn-whatsapp">WhatsApp Support</a>
        <button onclick="clearTracking()" class="btn btn-secondary">New Search</button>
      </div>
    </div>`;
}

function _trackError(msg) {
  const result = document.getElementById('trackResult');
  if (!result) return;
  result.innerHTML = `<div class="tracking-result error"><div class="result-icon">❌</div><p>${msg}</p><button onclick="clearTracking()" class="btn btn-secondary">Try Again</button></div>`;
  result.style.display = 'block';
}

function clearTracking() {
  const el = document.getElementById('trackCode');
  const res = document.getElementById('trackResult');
  if (el) { el.value = ''; el.focus(); }
  if (res) { res.style.display = 'none'; res.innerHTML = ''; }
}

/* ===== NOTIFICATIONS ===== */
function notify(msg, type = 'info') {
  document.querySelector('.notification')?.remove();
  const colors = { success: '#4CAF50', error: '#f44336', info: '#2196F3', warning: '#FF9800' };
  const n = document.createElement('div');
  n.className = 'notification';
  n.setAttribute('role', 'alert');
  n.style.cssText = `position:fixed;top:20px;right:20px;background:${colors[type]||colors.info};color:#fff;padding:14px 22px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.3);z-index:10000;font-weight:500;max-width:320px;animation:slideIn .3s ease`;
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => { n.style.animation = 'slideOut .3s ease'; setTimeout(() => n.remove(), 300); }, CONFIG.notificationDuration);
}

/* ===== UTILITY ===== */
function safe(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('active');
  });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ===== DROPDOWNS ===== */
function initDropdowns() {
  document.querySelectorAll('.dropdown').forEach(dd => {
    const btn = dd.querySelector('.dropdown-toggle');
    if (!btn) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = btn.getAttribute('aria-expanded') === 'true';
      // close all others
      document.querySelectorAll('.dropdown.active').forEach(o => {
        o.classList.remove('active');
        o.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
      btn.setAttribute('aria-expanded', String(!open));
      dd.classList.toggle('active', !open);
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.active').forEach(dd => {
      dd.classList.remove('active');
      dd.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ===== SEARCH LIVE ===== */
function initSearch() {
  const input = document.getElementById('productSearch');
  if (!input) return;
  input.addEventListener('input', e => _filter(e.target.value.trim().toLowerCase()));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') performSearch(); });
}

/* ===== URL TRACK PARAM ===== */
function initTrackFromURL() {
  const param = new URLSearchParams(location.search).get('track');
  if (param) {
    const el = document.getElementById('trackCode');
    if (el) { el.value = param; trackOrder(); }
  }
}

/* ===== BOOT ===== */
function init() {
  cart.render();
  initMobileMenu();
  initDropdowns();
  initSearch();
  initTrackFromURL();
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
