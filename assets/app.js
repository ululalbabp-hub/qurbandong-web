/* Qurbandong — Web Pelanggan (frontend) */
(function () {
  'use strict';

  var API = (window.QB_CONFIG && window.QB_CONFIG.API_URL) || '';
  var IMG = 'assets/img/';
  var FALLBACK = IMG + 'domba-1.jpg';
  var view = document.getElementById('view');
  var state = { cfg: null, sesi: loadSesi(), timers: [] };

  /* ---------------- util ---------------- */
  function e(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rp(n) { return 'Rp' + Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function jt(n) { n = Number(n) || 0; return 'Rp' + (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : (n % 1e5 === 0 ? 1 : 2)).replace('.', ',') + ' jt'; }
  function rjt(a, b) { function f(n) { return (n / 1e6).toFixed(n % 1e5 === 0 ? 1 : 2).replace('.', ','); } return 'Rp' + f(a) + '–' + f(b) + ' jt'; }
  function kg(n) { return (Number(n) || 0).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' kg'; }
  var BLN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  function pd(s) { if (!s) return null; if (s instanceof Date) return s; var m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/); return m ? new Date(+m[1], +m[2] - 1, +m[3], 12) : new Date(s); }
  function tgl(s, jam) { var d = pd(s); if (!d || isNaN(d)) return '-'; var t = d.getDate() + ' ' + BLN[d.getMonth()] + ' ' + d.getFullYear(); if (jam) t += ', ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); return t; }
  function tglPendek(s) { var d = pd(s); return d ? d.getDate() + ' ' + BLN[d.getMonth()] : '-'; }
  function waLink(text, n) { var no = (state.cfg && (n === 2 ? state.cfg.waAdmin2 : state.cfg.waAdmin)) || '628118301181'; return 'https://wa.me/' + no + (text ? '?text=' + encodeURIComponent(text) : ''); }
  function store(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (x) { } }
  function load(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (x) { return null; } }
  function loadSesi() { return load('qb_sesi'); }
  function setSesi(s) { state.sesi = s; store('qb_sesi', s); if (typeof clearC === 'function') clearC(); renderHeader(); }
  function img(src, alt, cls) { return '<img src="' + e(src || FALLBACK) + '" alt="' + e(alt || '') + '"' + (cls ? ' class="' + cls + '"' : '') + ' loading="lazy" onerror="this.onerror=null;this.src=\'' + FALLBACK + '\'">'; }
  function toast(msg, isErr) {
    var t = document.createElement('div'); t.className = 'toast' + (isErr ? ' err-toast' : ''); t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3800);
  }
  function go(h) { if (location.hash === h) route(); else location.hash = h; }
  function copy(text) {
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { toast('Disalin: ' + text); }, function () { toast(text); });
    else toast(text);
  }
  function busy(btn, on) { if (!btn) return; btn.classList.toggle('is-loading', on); if (on) { btn.dataset.t = btn.innerHTML; btn.innerHTML = 'Memproses…'; } else if (btn.dataset.t) btn.innerHTML = btn.dataset.t; }
  function formData(form) { var o = {}; new FormData(form).forEach(function (v, k) { o[k] = typeof v === 'string' ? v.trim() : v; }); return o; }
  function icon(name, size, color) {
    var p = {
      back: '<path d="M15 5l-7 7 7 7"/>', check: '<path d="M5 12l5 5 9-10"/>', x: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
      wa: '<path d="M3.5 20.5l1.3-4A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .8a4 4 0 0 1-2.1-2.1l.8-1-1-2z"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', swap: '<path d="M4 8h13l-3-3"/><path d="M20 16H7l3 3"/>',
      search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>', pen: '<path d="M4 20h4l10-10-4-4L4 16z"/><path d="M13 7l4 4"/>',
      chart: '<path d="M4 18l5-6 4 3 7-9"/>', people: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M15 15.5c.6-.3 1.3-.5 2-.5 2.2 0 4 1.8 4 4"/>',
      play: '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>', chev: '<path d="M9 5l7 7-7 7"/>', alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/>',
      copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'
    }[name] || '';
    return '<svg width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="' + (color || 'currentColor') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }
  function backBar(href, title, sub) {
    return '<div class="row" style="padding:16px 0 4px"><a class="btn btn-outline btn-sm" href="' + href + '" aria-label="Kembali" style="width:44px;padding:0">' + icon('back') + '</a><div><h1 class="h3">' + e(title) + '</h1>' + (sub ? '<div class="xs muted">' + e(sub) + '</div>' : '') + '</div></div>';
  }
  function statusChip(st) {
    var c = { 'Tersedia': 'chip-ok', 'Ditahan': 'chip-hold', 'Menunggu Bayar': 'chip-hold', 'DP': 'chip', 'Tabungan': 'chip', 'Lunas': 'chip-ok', 'Selesai': 'chip-dark', 'Ajukan Batal': 'chip-hold', 'Batal': 'chip-grey', 'Kedaluwarsa': 'chip-grey' }[st] || 'chip';
    var label = st === 'Ditahan' ? 'Sedang dipesan' : st;
    return '<span class="chip ' + c + '">' + e(label) + '</span>';
  }

  /* ---------------- API ---------------- */
  function api(action, payload) {
    if (!API) return Promise.reject(new Error('Web belum terhubung ke server. Isi API_URL di assets/config.js.'));
    var body = Object.assign({ action: action, token: state.sesi && state.sesi.token }, payload || {});
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.ok) {
          var err = new Error(j.error || 'Gagal'); err.code = j.code;
          if (j.code === 'AUTH' && state.sesi && /masuk terlebih|Khusus admin/.test(j.error || '')) { setSesi(null); }
          throw err;
        }
        if (!BACA[action]) clearC();
        return j.data;
      }, function (x) { if (x && x.code) throw x; throw new Error('Tidak bisa terhubung ke server. Periksa koneksi internet Anda.'); });
  }
  /* ---------------- data cepat ----------------
   * Halaman yang pernah dibuka tampil seketika dari salinan terakhir, lalu diperbarui diam-diam
   * di belakang layar. Katalog & detail domba disimpan di browser (maks 6 jam), data pribadi/admin
   * hanya di memori tab. Setiap aksi yang mengubah data membuang salinan agar tidak ada data lama. */
  var BACA = { config: 1, katalog: 1, domba: 1, saya: 1, pesanan: 1, adminRingkas: 1, adminPesanan: 1, adminDetail: 1, adminStok: 1, adminHarga: 1 };
  var PUBLIK = { katalog: 1, domba: 1 }, MAKS_UMUR = 6 * 3600 * 1000, SEGAR_MS = 4000;
  var mem = {}, jalan = {};
  function ckey(a, p) { return a + ':' + JSON.stringify(p || {}); }
  function getC(k, publik) {
    if (mem[k]) return mem[k];
    if (publik) { var v = load('qbc_' + k); if (v && v.t && Date.now() - v.t < MAKS_UMUR) { mem[k] = v; return v; } }
    return null;
  }
  function putC(a, p, d) { var k = ckey(a, p), v = { t: Date.now(), d: d }; mem[k] = v; if (PUBLIK[a]) store('qbc_' + k, v); }
  function clearC() {
    mem = {}; jalan = {};
    try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf('qbc_') === 0) localStorage.removeItem(k); }); } catch (x) { }
  }
  function ambil(a, p) {
    var k = ckey(a, p); if (jalan[k]) return jalan[k];
    var pr = api(a, p).then(function (d) { delete jalan[k]; putC(a, p, d); return d; }, function (x) { delete jalan[k]; throw x; });
    jalan[k] = pr; return pr;
  }
  /* Pengguna sedang mengetik/mengubah isian? Jangan ganti tampilan di bawah tangannya. */
  function sedangIsi() {
    var a = document.activeElement;
    if (a && view.contains(a) && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && a.type !== 'checkbox' && a.type !== 'radio' && !a.dataset.bebas) return true;
    return Array.prototype.some.call(view.querySelectorAll('input,textarea,select'), function (el) {
      if (el.dataset.bebas) return false;
      if (el.type === 'checkbox' || el.type === 'radio') return el.checked !== el.defaultChecked;
      if (el.tagName === 'SELECT') return Array.prototype.some.call(el.options, function (o) { return o.selected !== o.defaultSelected; });
      return el.value !== el.defaultValue;
    });
  }
  function data(a, p) {
    var k = ckey(a, p), c = getC(k, PUBLIK[a]);
    if (c) {
      if (Date.now() - c.t > SEGAR_MS) {
        var h = location.hash, lama = JSON.stringify(c.d);
        ambil(a, p).then(function (d) { if (JSON.stringify(d) !== lama && location.hash === h && !sedangIsi()) route(true); }).catch(function () { });
      }
      return Promise.resolve(c.d);
    }
    return ambil(a, p);
  }
  function prefetch(a, p) {
    if (!API) return;
    var c = getC(ckey(a, p), PUBLIK[a]);
    if (c && Date.now() - c.t < 30000) return;
    ambil(a, p).catch(function () { });
  }
  /* Ambil lebih dulu data halaman tujuan saat kursor/jari menyentuh tautan. */
  function prefetchHash(h) {
    var m;
    if (h === '#/katalog') return prefetch('katalog');
    if ((m = h.match(/^#\/(?:domba|pesan)\/([^/?]+)$/))) return prefetch('domba', { tag: decodeURIComponent(m[1]) });
    if (!state.sesi) return;
    if (h === '#/saya') return prefetch('saya');
    if ((m = h.match(/^#\/pesanan\/([^/?]+)/))) return prefetch('pesanan', { id: decodeURIComponent(m[1]) });
    if (state.sesi.peran !== 'admin') return;
    if (h === '#/admin' || h === '#/admin/pesanan') return prefetch('adminPesanan', { filter: 'tindakan', q: '' });
    if (h === '#/admin/stok') return prefetch('adminStok', {});
    if (h === '#/admin/harga') return prefetch('adminHarga', {});
    if ((m = h.match(/^#\/admin\/pesanan\/([^/?]+)$/))) return prefetch('adminDetail', { id: decodeURIComponent(m[1]) });
  }
  function onIntent(ev) {
    var a = ev.target && ev.target.closest && ev.target.closest('a[href^="#/"]');
    if (a) prefetchHash(a.getAttribute('href'));
  }
  document.addEventListener('pointerover', onIntent, { passive: true });
  document.addEventListener('touchstart', onIntent, { passive: true });
  document.addEventListener('focusin', onIntent);
  /* Ukuran foto Drive sesuai tempat tampilnya (foto kecil = jauh lebih cepat). */
  function th(url, w) { return url ? String(url).replace(/([?&]sz=)w\d+/, '$1w' + w) : url; }

  function cfg() {
    if (state.cfg) return Promise.resolve(state.cfg);
    var cached = load('qb_cfg');
    var p = api('config').then(function (c) { state.cfg = c; store('qb_cfg', c); renderFooter(); return c; });
    if (cached) { state.cfg = cached; p.catch(function () { }); return Promise.resolve(cached); }
    return p;
  }

  /* ---------------- shell ---------------- */
  function renderHeader() {
    var s = state.sesi, h = location.hash || '#/';
    var nav = '<a class="nav-hide' + (/^#\/katalog/.test(h) ? ' active' : '') + '" href="#/katalog">Katalog</a>' +
      '<a class="nav-hide' + (/^#\/nabung/.test(h) ? ' active' : '') + '" href="#/nabung">Nabung</a>';
    if (s && s.peran === 'admin') nav += '<a href="#/admin" class="' + (/^#\/admin/.test(h) ? 'active' : '') + '">Admin</a>';
    nav += s ? '<a class="pill-outline' + (/^#\/(saya|pesanan)/.test(h) ? ' active' : '') + '" href="#/saya">Domba Saya</a>' : '<a class="pill-outline" href="#/masuk">Masuk</a>';
    document.getElementById('nav').innerHTML = nav;
  }
  function renderFooter() {
    var c = state.cfg || {};
    document.getElementById('footer').innerHTML =
      '<div class="wrap foot-grid"><div class="stack"><div class="row"><span class="logo-box"><img src="' + IMG + 'logo.png" alt="Qurbandong"></span><b style="color:#fff;letter-spacing:1px">QURBANDONG FARM</b></div>' +
      '<span>Peternakan penggemukan domba di Gunung Wangun, Pamoyanan, Bogor. Kunjungan kandang setiap hari 08.00–17.00.</span>' +
      (c.mapsUrl ? '<a href="' + e(c.mapsUrl) + '" target="_blank" rel="noopener">Buka lokasi di Google Maps →</a>' : '') + '</div>' +
      '<div class="stack"><b style="color:#fff">Hubungi kami</b><a href="' + waLink('') + '">WA 0811-8301-181</a><a href="' + waLink('', 2) + '">WA 0822-7777-2127</a>' +
      '<a href="mailto:' + e(c.emailAdmin || 'qurbandong1@gmail.com') + '">' + e(c.emailAdmin || 'qurbandong1@gmail.com') + '</a><span>Instagram &amp; TikTok @qurbandong</span></div>' +
      '<div class="stack"><b style="color:#fff">Informasi</b><a href="#/katalog">Katalog domba</a><a href="#/nabung">Tabungan qurban</a><a href="#/syarat">Syarat &amp; Ketentuan</a><a href="#/privasi">Kebijakan Privasi</a><a href="#/masuk">Masuk / Domba Saya</a></div></div>';
  }
  function loading() { view.innerHTML = '<div class="wrap stack mt-lg"><div class="skeleton" style="height:220px"></div><div class="skeleton" style="height:22px;width:60%"></div><div class="skeleton" style="height:22px;width:40%"></div></div>'; }
  function fail(err) {
    view.innerHTML = '<div class="wrap narrow"><div class="card mt-lg stack center"><b class="h3">Belum bisa dimuat</b><p class="muted">' + e(err.message || err) + '</p>' +
      '<div class="wrap-row" style="justify-content:center"><button class="btn btn-primary" id="retry">Coba lagi</button><a class="btn btn-outline" href="' + waLink('Assalamu\'alaikum, web Qurbandong tidak bisa dibuka.') + '">Hubungi admin</a></div></div></div>';
    var b = document.getElementById('retry'); if (b) b.onclick = route;
  }

  /* ---------------- chart ---------------- */
  function chart(riwayat, min, max, iduladha, naikBulan) {
    var pts = (riwayat || []).map(function (r) { return { t: pd(r.t).getTime(), kg: r.kg }; }).filter(function (p) { return p.kg; });
    if (!pts.length) return '<p class="muted small">Belum ada data timbang.</p>';
    var W = 360, H = 200, L = 34, R = 10, T = 14, B = 26;
    var end = pd(iduladha) ? pd(iduladha).getTime() : pts[pts.length - 1].t + 90 * 864e5;
    var t0 = pts[0].t, t1 = Math.max(end, pts[pts.length - 1].t + 864e5);
    var last = pts[pts.length - 1];
    var proj = [];
    if (naikBulan > 0 && last.kg < max) {
      var monthsToMax = (max - last.kg) / naikBulan, tMax = last.t + monthsToMax * 30.4 * 864e5;
      proj = [last, { t: Math.min(tMax, t1), kg: Math.min(max, last.kg + naikBulan * (Math.min(tMax, t1) - last.t) / (30.4 * 864e5)) }];
    }
    var lo = Math.floor(Math.min(pts[0].kg, min || pts[0].kg) / 5) * 5 - 5, hi = Math.ceil(Math.max(max || last.kg, last.kg) / 5) * 5 + 2;
    function x(t) { return L + (t - t0) / (t1 - t0 || 1) * (W - L - R); }
    function y(v) { return T + (hi - v) / (hi - lo) * (H - T - B); }
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Grafik bobot: ' + pts.map(function (p) { return kg(p.kg); }).join(', ') + '">';
    if (max) s += '<rect x="' + L + '" y="' + y(max) + '" width="' + (W - L - R) + '" height="' + Math.max(2, y(min) - y(max)) + '" fill="#FFE5C8"/><text x="' + (W - R - 4) + '" y="' + (y(max) + 12) + '" font-size="10" text-anchor="end" fill="#8A4A14">target ' + min + '–' + max + ' kg</text>';
    for (var g = lo; g <= hi; g += 5) s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g) + '" y2="' + y(g) + '" stroke="#F0E6D8"/><text x="' + (L - 6) + '" y="' + (y(g) + 3) + '" font-size="10" text-anchor="end" fill="#5E625F">' + g + '</text>';
    if (proj.length) s += '<polyline points="' + proj.map(function (p) { return x(p.t) + ',' + y(p.kg); }).join(' ') + '" fill="none" stroke="#E9762B" stroke-width="2.5" stroke-dasharray="5 5"/>';
    s += '<polyline points="' + pts.map(function (p) { return x(p.t) + ',' + y(p.kg); }).join(' ') + '" fill="none" stroke="#2A2D2B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
    pts.forEach(function (p, i) {
      var isLast = i === pts.length - 1;
      s += '<circle cx="' + x(p.t) + '" cy="' + y(p.kg) + '" r="' + (isLast ? 6 : 4.5) + '" fill="' + (isLast ? '#E9762B' : '#2A2D2B') + '" stroke="#fff" stroke-width="2"/>';
      s += '<text x="' + x(p.t) + '" y="' + (H - 8) + '" font-size="10" text-anchor="middle" fill="#5E625F">' + BLN[new Date(p.t).getMonth()] + '</text>';
    });
    if (pd(iduladha)) s += '<text x="' + (W - R) + '" y="' + (H - 8) + '" font-size="10" text-anchor="end" fill="#8A4A14">Iduladha</text>';
    return s + '</svg>';
  }

  /* ---------------- shared bits ---------------- */
  function skItems(c) {
    return [
      ['Harga per kg hidup.', 'Harga akhir = bobot riil saat timbang akhir (H-' + c.h.timbang + ' Iduladha, dengan bukti foto & video) × harga/kg yang terkunci saat akad. Bobot di atas batas atas target dihitung sebagai bonus; bobot di bawah target dibayar sesuai bobot riil.'],
      ['DP minimal ' + c.dpPersen + '%', 'dari estimasi harga (batas atas target). Harga/kg terkunci dan domba tercatat atas nama Anda setelah DP terkonfirmasi.'],
      ['Waktu tahan ' + (c.tahanMenit >= 60 ? (c.tahanMenit / 60) + ' jam' : c.tahanMenit + ' menit') + '.', 'Pembayaran via Virtual Account atau transfer bank. Jika pembayaran tidak masuk dalam waktu itu, domba kembali tersedia untuk umum.'],
      ['Pelunasan', 'paling lambat H-' + c.h.lunas + ' Iduladha, setelah bobot akhir ditimbang H-' + c.h.timbang + '. Cicilan boleh kapan saja sebelumnya; bila cicilan melebihi harga final, selisihnya dikembalikan paling lambat 2 minggu. Jika sampai H-' + c.h.lunas + ' belum lunas, admin akan menghubungi Anda; bila tetap tidak dilunasi, pesanan dianggap batal sesuai poin 5.'],
      ['Pembatalan', 'oleh pembeli setelah domba dipilih: dana dikembalikan setelah dipotong biaya pakan dan tenaga kandang yang benar-benar sudah dikeluarkan (' + rp(c.biayaHarian) + '/ekor/hari sejak akad, tidak melebihi dana masuk). Dikembalikan paling lambat 2 minggu.'],
      ['Pemantauan.', 'Timbang dan foto diperbarui 1× sebulan di halaman Domba Saya.'],
      ['Risiko sebelum serah terima.', 'Jika domba sakit atau mati sebelum serah terima, Anda bisa memilih ulang domba dari katalog atau kami ganti dengan domba sesuai bobot target, tanpa biaya.'],
      ['Gratis ongkir', 'untuk wilayah Jabodetabek. Di luar Jabodetabek ongkir dikonfirmasi admin. Jadwal kirim dikonfirmasi admin.'],
      ['Ganti domba', 'boleh selama stok pengganti tersedia, maksimal ' + c.maksGanti + '× per pesanan dan paling lambat H-' + c.h.ganti + ' Iduladha, tanpa biaya. Dana dipindahkan utuh; harga akhir mengikuti bobot riil domba baru.'],
      ['Tabungan qurban', '(domba belum dipilih): bila dibatalkan, seluruh dana dikembalikan utuh tanpa potongan.'],
      ['Jasa penyembelihan', 'tersedia dengan biaya tambahan' + (c.biayaSembelih ? ' ' + rp(c.biayaSembelih) + '/ekor' : ' (dikonfirmasi admin)') + '. Dokumentasi video & foto gratis.'],
      ['Notifikasi & data.', 'Bukti bayar, update bulanan, tagihan, dan pengingat dikirim lewat email. Data Anda dikelola sesuai Kebijakan Privasi.']
    ];
  }
  function skHtml(c) {
    return '<ol class="stack small" style="padding-left:20px;margin:0">' + skItems(c).map(function (s) { return '<li><b>' + e(s[0]) + '</b> ' + e(s[1]) + '</li>'; }).join('') + '</ol>';
  }
  function sheepCard(d) {
    return '<a class="sheep" href="#/domba/' + encodeURIComponent(d.tag) + '"><div class="ph">' + img(th(d.foto, 600), 'Foto domba ' + d.tag) + statusChip(d.status) + '</div><div class="body">' +
      '<span class="xs muted bold">' + e(d.tag) + '</span><span class="bold">Target ' + d.min + '–' + d.max + ' kg</span>' +
      '<span class="xs">Sekarang ' + kg(d.bobot) + (d.naikBulan ? ' · +' + kg(d.naikBulan) + '/bln' : '') + '</span>' +
      (d.umur ? '<span class="xs muted">' + e(d.sex || 'Jantan') + ' · umur ± ' + e(d.umur) + '</span>' : '') +
      '<span class="price">' + rjt(d.estMin, d.estMax) + '</span>' +
      (d.status === 'Ditahan' ? '<span class="hold-note">Dipesan orang lain · lepas ±' + d.lepasMenit + ' menit lagi jika tidak dibayar</span>' : '') + '</div></a>';
  }

  /* ================= PAGES ================= */

  function pageBeranda() {
    return cfg().then(function (c) {
      var b = c.batch || {}, pct = b.total ? Math.round(b.dipesan / b.total * 100) : 0;
      var edu = [
        ['Riwayat', 'Jelas: tanggal masuk, kandang, dan setiap timbangan tercatat.', 'Sering tidak diketahui; bisa sudah berpindah beberapa pasar.'],
        ['Pakan', 'Terjadwal: hijauan segar (odot) + pakan tambahan terukur.', 'Tidak diketahui; bisa digenjot sesaat sebelum dijual.'],
        ['Kesehatan', 'Obat cacing, vitamin, dan pemeriksaan rutin selama pemeliharaan.', 'Hanya terlihat dari luar saat membeli.'],
        ['Kondisi tubuh', 'Padat dan berotot hasil pertumbuhan bertahap.', 'Bervariasi; bisa kurus atau terlihat besar karena perut penuh.'],
        ['Bobot saat ditimbang', 'Ditimbang rutin tiap bulan, angkanya bisa dibandingkan.', 'Satu kali timbang; bisa bias oleh isi pakan & air di perut.'],
        ['Stres hari H', 'Lebih rendah; sudah terbiasa dengan kandang dan perawat.', 'Lebih tinggi akibat perjalanan & pindah tempat berkali-kali.'],
        ['Harga & pilihan', 'Harga/kg terkunci sejak awal, pilihan masih banyak.', 'Harga cenderung naik mendekati hari H, pilihan tinggal sisa.']
      ];
      var faq = [
        ['Apakah dombanya memenuhi syarat qurban?', 'Ya. Domba yang kami jual dipilih sesuai syarat sah qurban: cukup umur, sehat, dan tidak cacat. Umur di katalog adalah perkiraan.'],
        ['Kapan harga final diketahui?', 'Harga per kg terkunci saat akad (DP). Bobot akhir ditimbang H-' + c.h.timbang + ' Iduladha, lengkap dengan foto & video timbangan, lalu harga final dihitung dari bobot itu.'],
        ['Kapan saya harus melunasi?', 'Setelah DP, Anda boleh mencicil kapan saja. Sisa tagihan dihitung dari bobot akhir (timbang H-' + c.h.timbang + ') dan dilunasi paling lambat H-' + c.h.lunas + ' Iduladha.'],
        ['Kapan domba dikirim?', 'Menjelang Iduladha sesuai jadwal per wilayah yang dikonfirmasi admin. Gratis ongkir untuk Jabodetabek.'],
        ['Bisa sekalian disembelihkan?', 'Bisa, dengan tambahan biaya penyembelihan. Dokumentasi video dan foto gratis, dikirim ke email dan halaman Domba Saya.'],
        ['Bagaimana jika domba sakit atau mati sebelum hari H?', 'Anda bisa memilih ulang domba dari katalog atau kami ganti dengan domba sesuai bobot target, tanpa biaya.'],
        ['Bagaimana jika saya membatalkan?', 'Jika domba sudah dipilih, dana dikembalikan setelah dipotong biaya pakan dan tenaga kandang yang benar-benar sudah dikeluarkan (' + rp(c.biayaHarian) + '/hari). Tabungan yang belum memilih domba dikembalikan utuh. Maksimal 2 minggu.'],
        ['Bayarnya lewat apa? Bisa lihat ke kandang?', 'Pembayaran via Virtual Account atau transfer bank. Kandang di Gunung Wangun, Pamoyanan, Bogor terbuka untuk kunjungan setiap hari pukul 08.00–17.00.']
      ];
      var html = '<div class="wrap">' +
        '<section class="hero mt">' + '<img src="' + IMG + 'domba-3.jpg" alt="Domba di kandang Qurbandong Farm">' +
        '<div class="hero-inner"><span class="chip">Qurban Iduladha ' + e((c.iduladha || '').slice(0, 4)) + ' · Bogor</span>' +
        '<h1 class="h1">Pilih sendiri dombanya. Pantau sampai hari H.</h1><p>Bukan "domba sesuai foto" — domba asli bereartag, ditimbang tiap bulan.</p>' +
        '<div class="wrap-row"><a class="btn btn-primary" href="#/katalog">Pilih domba qurban</a><a class="btn btn-outline" href="#/nabung">Nabung qurban</a></div></div></section>' +

        '<section class="stats mt"><div class="card"><b>' + c.dpPersen + '%</b><span class="small">DP saja, sisanya bisa dicicil</span></div><div class="card"><b>Gratis</b><span class="small">ongkir se-Jabodetabek</span></div>' +
        '<div class="card"><b>' + c.maksGanti + '×</b><span class="small">ganti domba, tanpa biaya</span></div><div class="card"><b>1×/bln</b><span class="small">update bobot &amp; foto</span></div></section>' +

        '<section class="section split"><div class="hero" style="min-height:340px"><img src="' + IMG + 'domba-4.jpg" alt="Domba qurban di kandang"><div class="hero-inner"><span class="eyebrow" style="color:var(--cream)">Rasakan qurbannya</span><h2 class="h2">Kenali hewan qurbanmu, sejak hari pertama.</h2></div></div>' +
        '<div class="card stack-lg"><p>Qurban bukan sekadar membeli hewan di hari terakhir. Di Qurbandong, Anda memilih sendiri dombanya, melihatnya tumbuh dari bulan ke bulan, dan di hari H Anda tahu persis siapa yang Anda qurbankan.</p>' +
        [['search', 'Pilih & kenali', 'Lihat foto aslinya, nomor eartag, jenis, dan umurnya.'], ['pen', 'Beri nama panggilan', 'Si Jalu, Si Gagah — nama pilihan keluarga tampil di halaman Domba Saya.'], ['chart', 'Lihat ia tumbuh', 'Bobot, foto, dan catatan kesehatan diperbarui tiap bulan.'], ['people', 'Kunjungi bersama keluarga', 'Ajak anak bertemu dombanya di kandang kaki Gunung Wangun.']].map(function (x) {
          return '<div class="row" style="align-items:flex-start"><span style="flex:none;width:36px;height:36px;border-radius:999px;background:var(--cream);display:flex;align-items:center;justify-content:center">' + icon(x[0], 18, '#8A4A14') + '</span><span><b>' + x[1] + '</b><br><span class="small muted">' + x[2] + '</span></span></div>';
        }).join('') +
        '<p class="highlight bold">"Qurban yang dikenal, lebih terasa maknanya — bagi Anda, dan bagi keluarga yang ikut menyaksikan."</p></div></section>' +

        '<section class="section split"><div class="stack"><h2 class="h2">Ingin qurban terbaik, tapi masih khawatir…</h2><div class="pill-row">' +
        ['Domba yang datang beda dengan fotonya?', 'Tidak tahu dombanya dirawat bagaimana?', 'Harga borongan, hitungannya tidak jelas?', 'Berdesakan di pasar hewan menjelang hari H?'].map(function (t) { return '<div>' + icon('x', 20, '#B4561A') + e(t) + '</div>'; }).join('') + '</div></div>' +
        '<div class="card-dark stack"><span class="eyebrow" style="color:var(--pumpkin)">Di Qurbandong</span><h2 class="h2" style="color:#fff">Anda pilih. Kami rawat. Anda pantau.</h2>' +
        [['Lebih pasti', 'Domba asli bereartag — yang Anda pilih, itu yang Anda terima.'], ['Lebih transparan', 'Harga per kg, bobot & foto diperbarui tiap bulan.'], ['Lebih tenang', 'Dijamin sampai hari H, gratis ganti ' + c.maksGanti + '×, gratis ongkir Jabodetabek.']].map(function (x) {
          return '<div class="row" style="align-items:flex-start;background:var(--jet-2);border-radius:14px;padding:12px 14px"><span style="flex:none;width:28px;height:28px;border-radius:999px;background:var(--pumpkin);display:flex;align-items:center;justify-content:center">' + icon('check', 16, '#2A2D2B') + '</span><span><b>' + x[0] + '</b><br><span class="small" style="color:var(--cream)">' + x[1] + '</span></span></div>';
        }).join('') + '</div></section>' +

        (b.tampil && b.total ? '<section class="section"><div class="card-cream stack center"><p><b>Pilih lebih awal, pilihan lebih banyak.</b><br>Menjelang Iduladha, yang tersisa tinggal stok sisaan.</p>' +
          '<div class="card stack" style="text-align:left"><div class="between small"><b>' + e(b.label) + '</b><span>' + (b.dipesan ? '<b class="accent">' + b.dipesan + '</b> dari ' + b.total + ' ekor sudah dipesan' : '<b class="accent">' + b.total + '</b> ekor siap dipilih') + '</span></div><div class="progress"><i style="width:' + pct + '%"></i></div><span class="xs muted">Angka diperbarui otomatis dari data kandang.</span></div>' +
          '<h2 class="h3">Amankan domba qurban Anda sekarang</h2><div class="wrap-row" style="justify-content:center"><a class="btn btn-primary" href="#/katalog">Pilih domba — DP mulai ' + c.dpPersen + '%</a><a class="btn btn-outline" href="' + waLink('Assalamu\'alaikum Qurbandong, saya ingin konsultasi qurban.') + '">Konsultasi via WhatsApp</a></div></div></section>' : '') +

        '<section class="section stack"><div class="between"><h2 class="h2">Domba yang tersedia</h2><a href="#/katalog" class="bold">Lihat semua →</a></div><div class="grid" id="home-katalog">' + [1, 2, 3, 4].map(function () { return '<div class="skeleton" style="height:320px"></div>'; }).join('') + '</div></section>' +

        '<section class="section stack"><span class="eyebrow">Kenapa Qurbandong</span><h2 class="h2">Qurban yang bisa Anda lihat tumbuhnya.</h2><div class="split">' +
        [['01', 'Domba asli, bukan katalog foto', 'Setiap domba punya nomor eartag. Yang Anda pilih di web adalah domba yang sama yang Anda terima.'],
        ['02', 'Pantau bobot & foto tiap bulan', 'Grafik bobot, foto terbaru, dan catatan kesehatan di halaman Domba Saya.'],
        ['03', 'Harga per kg, lebih dari target = bonus', 'Bayar sesuai bobot riil saat timbang akhir. Kalau melebihi target, kelebihannya untuk Anda.'],
        ['04', 'Dijamin sampai hari H', 'Jika domba sakit atau mati sebelum serah terima, Anda bisa pilih ulang atau kami ganti dengan domba sesuai bobot target.'],
        ['05', 'Pakan hijauan dari kebun sendiri', 'Rumput odot segar dari lahan 2,5 ha milik Qurbandong. Kandang di kaki Gunung Wangun.']].map(function (x) {
          return '<div class="card row" style="align-items:flex-start;gap:14px"><b style="font-size:22px;color:var(--pumpkin);width:30px;flex:none">' + x[0] + '</b><span><b>' + x[1] + '</b><br><span class="small muted">' + x[2] + '</span></span></div>';
        }).join('') + '</div></section>' +

        '<section class="section stack"><span class="eyebrow">Edukasi</span><h2 class="h2">Domba penggemukan vs domba dadakan</h2><p class="muted">Domba dadakan adalah domba yang baru dibeli dari pasar atau bandar menjelang Iduladha. Domba penggemukan dipelihara berbulan-bulan di satu kandang dengan pakan dan perawatan terjadwal. Bedanya terasa di hari H.</p>' +
        '<div class="compare" role="table" aria-label="Perbandingan domba penggemukan dan dadakan"><div class="r head" role="row"><span role="columnheader"></span><b role="columnheader">Penggemukan</b><b role="columnheader" style="color:var(--cream)">Dadakan</b></div>' +
        edu.map(function (r) { return '<div class="r" role="row"><b role="rowheader">' + e(r[0]) + '</b><span role="cell">' + e(r[1]) + '</span><span role="cell" class="muted">' + e(r[2]) + '</span></div>'; }).join('') + '</div>' +
        '<div class="card-cream small"><b>Jujur saja:</b> tidak semua domba dadakan buruk, dan banyak peternak menjualnya dengan baik. Tapi tanpa riwayat yang jelas, pembeli sulit memastikannya. Di Qurbandong, riwayat itu bisa Anda lihat sendiri sejak hari pertama.</div></section>' +

        ((c.testimoni || []).length ? '<section class="section stack"><span class="eyebrow">Testimoni</span><h2 class="h2">Kata mereka yang sudah qurban bersama Qurbandong</h2><div class="testi">' +
          c.testimoni.map(function (t) { return '<article class="card stack"><div aria-label="Rating 5 dari 5" style="color:var(--pumpkin)">★★★★★</div><p class="muted" style="font-style:italic">"' + e(t.kutipan) + '"</p><div><b>' + e(t.nama) + '</b><div class="xs muted">' + e([t.kota, t.info].filter(Boolean).join(' · ')) + '</div></div></article>'; }).join('') +
          '<a class="card-dark stack center" style="flex:none;width:200px;justify-content:center;text-decoration:none" href="https://instagram.com/qurbandong" target="_blank" rel="noopener"><b>Video testimoni</b><span class="small" style="color:var(--cream)">Tonton di Instagram @qurbandong</span></a></div></section>' : '') +

        '<section class="section stack"><h2 class="h2">Layanan kami</h2><div class="split">' +
        '<a class="card row" style="text-decoration:none;color:inherit" href="#/katalog">' + img(IMG + 'domba-1.jpg', 'Domba qurban', '').replace('<img', '<img style="width:96px;height:96px;object-fit:cover;border-radius:12px;flex:none"') + '<span><b>Qurban</b><br><span class="small">Pilih domba online, DP ' + c.dpPersen + '%. Kirim hidup, atau disembelihkan + dokumentasi gratis.</span><br><b class="small accent">Lihat katalog →</b></span></a>' +
        '<a class="card row" style="text-decoration:none;color:inherit" href="#/nabung">' + img(IMG + 'domba-2.jpg', 'Tabungan qurban', '').replace('<img', '<img style="width:96px;height:96px;object-fit:cover;border-radius:12px;flex:none"') + '<span><b>Tabungan qurban</b><br><span class="small">Cicil dari sekarang, pilih domba saat bobotnya siap.</span><br><b class="small accent">Mulai nabung →</b></span></a>' +
        '<div class="card-dark stack"><b>Aqiqah</b><span class="small" style="color:var(--cream)">Domba sehat untuk aqiqah putra (2 ekor) atau putri (1 ekor).' + (c.paketAqiqah ? ' ' + e(c.paketAqiqah) : ' Tanyakan paket & harga ke admin.') + '</span>' +
        '<a class="btn btn-primary" href="' + waLink('Assalamu\'alaikum Qurbandong, saya ingin tanya layanan aqiqah.') + '">' + icon('wa') + ' Pesan aqiqah via WhatsApp</a></div></div></section>' +

        '<section class="section stack"><h2 class="h2">Cara pesan qurban</h2><div class="card stack">' +
        [['Pilih domba', ' di katalog sesuai budget dan target bobot.'], ['Setujui syarat', ', bayar DP ' + c.dpPersen + '% via Virtual Account atau transfer bank.'], ['Dapat ID pesanan', ' otomatis, akun & link pantau dikirim ke email.'], ['Timbang akhir H-' + c.h.timbang, ' dengan bukti foto & video, lunasi H-' + c.h.lunas + '. Kirim gratis se-Jabodetabek atau disembelihkan.']].map(function (x, i) {
          return '<div class="row" style="align-items:flex-start"><span style="flex:none;width:28px;height:28px;border-radius:999px;background:' + (i === 3 ? 'var(--pumpkin)' : 'var(--cream)') + ';display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px">' + (i + 1) + '</span><span><b>' + x[0] + '</b>' + e(x[1]) + '</span></div>';
        }).join('') + '</div></section>' +

        '<section class="section stack"><span class="eyebrow">Pertanyaan umum</span><h2 class="h2">Yang sering ditanyakan</h2>' +
        faq.map(function (f) { return '<details class="faq"><summary>' + e(f[0]) + '</summary><p>' + e(f[1]) + '</p></details>'; }).join('') + '</section></div>';
      view.innerHTML = html;
      data('katalog').then(function (k) {
        var el = document.getElementById('home-katalog'); if (!el) return;
        var items = k.items.slice(0, 4);
        el.innerHTML = items.length ? items.map(sheepCard).join('') : '<div class="empty" style="grid-column:1/-1">Stok batch berikutnya segera hadir. <a href="#/nabung">Mulai nabung dulu →</a></div>';
      }).catch(function () { var el = document.getElementById('home-katalog'); if (el) el.innerHTML = '<div class="empty" style="grid-column:1/-1">Katalog belum bisa dimuat.</div>'; });
    });
  }

  function pageKatalog() {
    return Promise.all([cfg(), data('katalog')]).then(function (r) {
      var c = r[0], items = r[1].items, f = load('qb_filter') || { rentang: '' };
      function draw() {
        var list = items.filter(function (d) {
          if (f.rentang) { var p = f.rentang.split('-').map(Number); if (d.max < p[0] || d.min > p[1]) return false; }
          return true;
        });
        document.getElementById('kat-grid').innerHTML = list.length ? list.map(sheepCard).join('') : '<div class="empty" style="grid-column:1/-1">Belum ada domba yang cocok. <a href="#/nabung">Nabung untuk bobot ini →</a></div>';
        document.getElementById('kat-count').innerHTML = '<b>' + list.filter(function (d) { return d.status === 'Tersedia'; }).length + '</b> domba tersedia · yang sudah terjual otomatis disembunyikan';
      }
      var ranges = ['', '30-36', '36-40', '40-50'];
      view.innerHTML = '<div class="wrap stack mt-lg"><h1 class="h2">Pilih domba qurbanmu</h1>' +
        '<div class="card between small"><span>Harga ' + e(tgl(c.harga.mulai).replace(/^\d+ /, '')) + '</span><span><b class="accent">Domba Tanduk ' + rp(c.harga.tanduk) + '/kg</b> · DP ' + c.dpPersen + '%</span></div>' +
        ((c.hargaJadwal && c.hargaJadwal[0]) ? '<div class="card-cream small"><b>Harga naik jadi ' + rp(c.hargaJadwal[0].harga) + '/kg mulai ' + e(tgl(c.hargaJadwal[0].mulai)) + '.</b> Akad lebih awal, harga per kg terkunci di harga hari ini.</div>' : '') +
        '<div class="wrap-row" role="group" aria-label="Filter bobot">' +
        '<label class="sr-only" for="f-rentang">Target bobot</label><select id="f-rentang" data-bebas="1" class="input" style="width:auto;padding:8px 12px;font-size:14px">' + ranges.map(function (x) { return '<option value="' + x + '"' + (f.rentang === x ? ' selected' : '') + '>' + (x ? x.replace('-', '–') + ' kg' : 'Semua bobot') + '</option>'; }).join('') + '</select></div>' +
        '<span class="small muted" id="kat-count"></span><div class="grid" id="kat-grid"></div>' +
        '<a class="card-cream stack" style="text-decoration:none;color:inherit" href="#/nabung"><b>Mau bobot lain yang belum ada?</b><span class="small">Nabung dulu sekarang, pilih dombanya saat batch dengan bobot itu sudah siap di kandang.</span><b class="small accent">Mulai nabung qurban →</b></a>' +
        '<p class="xs muted">Harga akhir = bobot riil saat timbang akhir × harga/kg, maksimal batas atas target. Lebih dari target = bonus. Gratis ongkir Jabodetabek.</p></div>';
      document.getElementById('f-rentang').onchange = function () { f.rentang = this.value; store('qb_filter', f); draw(); };
      draw();
    });
  }

  function pageDomba(tag) {
    return Promise.all([cfg(), data('domba', { tag: tag })]).then(function (r) {
      var c = r[0], d = r[1];
      var media = (d.media || []).length ? d.media : [{ foto: d.foto, t: d.tglTimbang }];
      view.innerHTML = '<div class="wrap">' + backBar('#/katalog', d.tag + ' · Domba Tanduk', 'Target ' + d.min + '–' + d.max + ' kg') +
        '<div class="split mt"><div class="gallery"><div class="main">' + img(media[0].foto, 'Foto domba ' + d.tag).replace('<img', '<img id="g-main"') + '</div>' +
        (media.length > 1 ? '<div class="thumbs">' + media.map(function (m, i) { return '<button aria-label="Foto ' + tgl(m.t) + '" aria-current="' + (i === 0) + '" data-src="' + e(m.foto) + '">' + img(th(m.foto, 200), '') + '</button>'; }).join('') + '</div>' : '') +
        '<span class="xs muted">Foto ' + tgl(media[0].t) + ' · diperbarui tiap bulan</span></div>' +
        '<div class="stack">' + statusChip(d.status) + '<span class="small muted bold">Eartag ' + e(d.tag) + ' · Domba Tanduk · ' + e(d.sex || 'Jantan') + (d.umur ? ' · umur ± ' + e(d.umur) : '') + '</span>' +
        '<h1 class="h1" style="font-size:30px">Target ' + d.min + '–' + d.max + ' kg</h1><span class="chip chip-ok" style="align-self:flex-start">Memenuhi syarat sah qurban</span>' +
        '<span class="small">Siap untuk Iduladha ' + e((c.iduladha || '').slice(0, 4)) + (d.kandang ? ' · Kandang ' + e(d.kandang) : '') + '</span>' +
        '<div class="metrics"><div class="card"><span class="xs muted">Bobot masuk</span><b>' + kg(d.bobotAwal) + '</b><span class="xs muted">' + tgl(d.masuk) + '</span></div>' +
        '<div class="card"><span class="xs muted">Bobot terkini</span><b class="accent">' + kg(d.bobot) + '</b><span class="xs muted">timbang ' + tglPendek(d.tglTimbang) + '</span></div>' +
        '<div class="card"><span class="xs muted">Naik rata-rata</span><b>' + kg(d.naikBulan) + '</b><span class="xs muted">per bulan</span></div></div>' +
        '<div class="card chart"><div class="between"><b>Perkembangan bobot</b><span class="xs muted">timbang 1×/bulan</span></div>' + chart(d.riwayat, d.min, d.max, c.iduladha, d.naikBulan) + '</div>' +
        '<div class="card stack"><b>Cara harga dihitung</b><div class="kv"><span>Harga per kg hidup</span><b>' + rp(d.hargaKg) + '</b></div><div class="kv"><span>Estimasi (' + d.min + '–' + d.max + ' kg)</span><b class="accent">' + rp(d.estMin) + ' – ' + rp(d.estMax).replace('Rp', '') + '</b></div><div class="divider"></div>' +
        '<div class="small stack"><div><b>≥ ' + d.max + ' kg:</b> bayar ' + rp(d.estMax) + '. Kelebihannya <b>bonus</b> untuk Anda.</div><div><b>' + d.min + '–' + d.max + ' kg:</b> bayar sesuai bobot riil saat timbang akhir.</div><div><b>&lt; ' + d.min + ' kg:</b> tetap bayar sesuai bobot riil, tidak dibulatkan ke target.</div></div></div>' +
        '<div class="card-cream small stack"><b>Ketentuan singkat</b><span>DP minimal ' + c.dpPersen + '% mengunci domba ini dan harga/kg-nya atas nama Anda.</span><span>Bobot akhir ditimbang H-' + c.h.timbang + ' Iduladha, lengkap dengan foto &amp; video timbangan.</span><span>Bisa kirim hidup atau disembelihkan (dokumentasi gratis). Gratis ongkir Jabodetabek.</span><span>Batal: hanya dipotong biaya pakan &amp; tenaga kandang yang sudah keluar.</span><a href="#/syarat">Baca syarat lengkap</a></div>' +
        ((d.mirip || []).length ? '<b class="mt">Domba mirip</b><div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">' + d.mirip.slice(0, 2).map(sheepCard).join('') + '</div>' : '') +
        '</div></div>' +
        (d.status === 'Tersedia' ? '<div class="sticky-cta mt-lg"><div style="flex:1"><span class="xs muted">DP mulai</span><br><b class="accent" style="font-size:20px">' + rp(d.dp) + '</b></div><a class="btn btn-primary" href="#/pesan/' + encodeURIComponent(d.tag) + '">Pesan dengan DP</a></div>'
          : '<div class="card-cream mt-lg">Domba ini sedang dipesan orang lain. Jika tidak dibayar dalam ±' + d.lepasMenit + ' menit, domba kembali tersedia. <a href="#/katalog">Lihat domba lain →</a></div>') + '</div>';
      document.body.classList.toggle('has-sticky', d.status === 'Tersedia');
      Array.prototype.forEach.call(document.querySelectorAll('.thumbs button'), function (b) {
        b.onclick = function () { document.getElementById('g-main').src = b.dataset.src; Array.prototype.forEach.call(document.querySelectorAll('.thumbs button'), function (x) { x.setAttribute('aria-current', String(x === b)); }); };
      });
    }).catch(function (err) {
      if (err.code === 'GONE') return pageDiambil(tag, 'Domba ' + tag + ' sudah tidak tersedia');
      throw err;
    });
  }

  function pageDiambil(tag, judul) {
    return data('katalog').then(function (k) {
      var items = k.items.filter(function (x) { return x.status === 'Tersedia'; }).slice(0, 4);
      view.innerHTML = '<div class="wrap narrow stack mt-lg"><div class="card stack center"><span style="margin:auto;width:56px;height:56px;border-radius:999px;background:var(--pumpkin);display:flex;align-items:center;justify-content:center">' + icon('clock', 28, '#2A2D2B') + '</span>' +
        '<h1 class="h3">' + e(judul || ('Maaf, ' + tag + ' baru saja dipesan orang lain')) + '</h1><p class="muted">Domba yang sedang ditahan akan kembali tersedia jika pemesannya tidak membayar dalam batas waktu.</p></div>' +
        '<b>Domba yang masih tersedia</b><div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">' + items.map(sheepCard).join('') + '</div>' +
        '<a class="btn btn-outline" href="#/katalog">Lihat semua katalog</a></div>';
    });
  }

  /* -------- checkout (pesan & nabung) -------- */
  function formPembeli(c, opts) {
    var s = state.sesi, logged = s && s.lingkup === 'all';
    return '<form id="f-pesan" class="stack" novalidate>' +
      '<div class="card stack"><b class="h3">Data pembeli</b>' +
      (logged ? '<div class="highlight small">Masuk sebagai <b>' + e(s.email) + '</b>. <a href="#" id="ganti-akun">Bukan Anda?</a></div>' +
        '<div class="field"><label for="p-nama">Nama lengkap <span class="req">*</span></label><input class="input" id="p-nama" name="nama" required value="' + e(s.nama || '') + '" autocomplete="name"></div>'
        : '<p class="xs muted">Wajib sekarang: nama, email, WhatsApp &amp; kata sandi. Alamat &amp; data kirim boleh dilengkapi nanti — kami ingatkan lewat email.</p>' +
        '<div class="field"><label for="p-nama">Nama lengkap <span class="req">*</span></label><input class="input" id="p-nama" name="nama" required autocomplete="name"></div>' +
        '<div class="field"><label for="p-email">Email <span class="req">*</span> <span class="muted" style="font-weight:400">(semua notifikasi dikirim ke sini)</span></label><input class="input" id="p-email" name="email" type="email" required autocomplete="email"></div>' +
        '<div class="field"><label for="p-wa">No. telepon / WhatsApp <span class="req">*</span></label><input class="input" id="p-wa" name="wa" type="tel" inputmode="tel" required autocomplete="tel" placeholder="08xx"></div>' +
        '<div class="field"><label for="p-pass">Buat kata sandi <span class="req">*</span> <span class="muted" style="font-weight:400">(min. 6 karakter, untuk masuk ke Domba Saya)</span></label><input class="input" id="p-pass" name="password" type="password" required minlength="6" autocomplete="new-password"></div>' +
        '<span class="xs muted">Sudah punya akun? <a href="#/masuk?lanjut=' + encodeURIComponent(location.hash) + '">Masuk dulu</a> agar data terisi otomatis.</span>') +
      '<div class="field"><label for="p-shohibul">Nama shohibul qurban (untuk sertifikat)</label><input class="input" id="p-shohibul" name="shohibul" placeholder="mis. Ahmad Fauzi bin Abdullah"></div>' +
      (opts.panggilan ? '<div class="field"><label for="p-panggilan">Nama panggilan domba (opsional)</label><input class="input" id="p-panggilan" name="panggilan" maxlength="30" placeholder="mis. Si Jalu"></div>' : '') +
      '<div class="field"><label for="p-alamat">Alamat lengkap</label><textarea class="input" id="p-alamat" name="alamat" rows="3" autocomplete="street-address"></textarea></div></div>' +
      '<div class="card stack"><div class="between"><b class="h3">Pengiriman</b><span class="xs muted">gratis ongkir Jabodetabek</span></div>' +
      '<span class="label">Layanan hari H</span><div class="choice" role="radiogroup" aria-label="Layanan hari H"><label><input type="radio" name="layanan" value="Hidup" checked><span>Kirim hidup</span><span class="xs muted">Gratis ongkir Jabodetabek</span></label>' +
      '<label><input type="radio" name="layanan" value="Sembelih"><span>Disembelihkan</span><span class="xs muted">' + (c.biayaSembelih ? '+' + rp(c.biayaSembelih) : '+biaya sembelih') + ' · dokumentasi gratis</span></label></div>' +
      '<label class="check"><input type="checkbox" name="kirimSama" id="p-sama"> Kirim ke alamat pembeli</label>' +
      '<div id="kirim-lain" class="stack"><div class="field"><label for="p-kirim">Alamat pengiriman</label><textarea class="input" id="p-kirim" name="alamatKirim" rows="3"></textarea></div>' +
      '<div class="field"><label for="p-penerima">Nama penerima</label><input class="input" id="p-penerima" name="penerima" placeholder="mis. Panitia Qurban Masjid …"></div>' +
      '<div class="field"><label for="p-hp">No. HP penerima</label><input class="input" id="p-hp" name="hpPenerima" type="tel" inputmode="tel"></div></div>' +
      '<span class="xs muted">Boleh dikosongkan dulu. Pengingat dikirim lewat email sampai data lengkap. Bisa diubah dari Domba Saya sampai H-' + c.h.ubahKirim + '.</span></div>' +
      '<p class="err" id="p-err" role="alert"></p><button class="btn btn-primary btn-block" type="submit">' + e(opts.cta) + '</button></form>';
  }
  function bindPesan(c, submit) {
    var f = document.getElementById('f-pesan'), sama = document.getElementById('p-sama');
    sama.onchange = function () { document.getElementById('kirim-lain').style.display = sama.checked ? 'none' : ''; };
    var ga = document.getElementById('ganti-akun'); if (ga) ga.onclick = function (ev) { ev.preventDefault(); logout(true); };
    f.onsubmit = function (ev) {
      ev.preventDefault();
      var d = formData(f), err = document.getElementById('p-err'), btn = f.querySelector('button[type=submit]');
      d.kirimSama = sama.checked; d.setuju = true;
      var logged = state.sesi && state.sesi.lingkup === 'all';
      if (!d.nama) return (err.textContent = 'Nama lengkap wajib diisi.');
      if (!logged) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email || '')) return (err.textContent = 'Email tidak valid.');
        if ((d.wa || '').replace(/\D/g, '').length < 9) return (err.textContent = 'Nomor WhatsApp tidak valid.');
        if ((d.password || '').length < 6) return (err.textContent = 'Kata sandi minimal 6 karakter.');
      }
      err.textContent = ''; busy(btn, true);
      submit(d).then(function (res) {
        if (res.token) setSesi({ token: res.token, email: res.pesanan.email, nama: res.pesanan.nama, peran: 'pembeli', lingkup: 'all' });
        go('#/pesanan/' + res.pesanan.id);
      }).catch(function (x) {
        busy(btn, false);
        if (x.code === 'TAKEN' || x.code === 'GONE') return pageDiambil(d.tag || '', x.message);
        err.textContent = x.message; toast(x.message, true);
      });
    };
  }
  function skStep(c, onOk) {
    return '<div class="card stack"><b class="h3">Syarat &amp; Ketentuan</b>' + skHtml(c) + '</div>' +
      '<label class="check card" style="border:2px solid var(--pumpkin)"><input type="checkbox" id="sk-ok"> <span>Saya telah membaca dan menyetujui Syarat &amp; Ketentuan serta <a href="#/privasi" target="_blank">Kebijakan Privasi</a> Qurbandong Farm.</span></label>' +
      '<button class="btn btn-primary btn-block" id="sk-next" disabled>Setuju &amp; lanjut isi data</button><span class="xs muted center">Waktu persetujuan dan versi S&amp;K (' + e(c.skVersi) + ') tersimpan bersama pesanan Anda.</span>';
  }
  function bindSk(next) {
    var cb = document.getElementById('sk-ok'), b = document.getElementById('sk-next');
    cb.onchange = function () { b.disabled = !cb.checked; };
    b.onclick = next;
  }

  function pagePesan(tag) {
    return Promise.all([cfg(), data('domba', { tag: tag })]).then(function (r) {
      var c = r[0], d = r[1];
      if (d.status !== 'Tersedia') return pageDiambil(tag);
      var head = '<div class="card row">' + img(d.foto, d.tag).replace('<img', '<img style="width:64px;height:64px;border-radius:12px;object-fit:cover;flex:none"') +
        '<div class="small"><b style="font-size:15px">' + e(d.tag) + ' · ' + d.min + '–' + d.max + ' kg</b><br>Estimasi ' + rp(d.estMin) + ' – ' + rp(d.estMax).replace('Rp', '') + '<br><span class="accent bold">DP ' + c.dpPersen + '%: ' + rp(d.dp) + '</span></div></div>';
      view.innerHTML = '<div class="wrap narrow stack">' + backBar('#/domba/' + encodeURIComponent(tag), 'Pesan domba ' + tag, 'Langkah 1 dari 2 · Syarat & Ketentuan') + head + skStep(c) + '</div>';
      bindSk(function () {
        view.innerHTML = '<div class="wrap narrow stack">' + backBar('#/domba/' + encodeURIComponent(tag), 'Pesan domba ' + tag, 'Langkah 2 dari 2 · Data & pembayaran') + head + formPembeli(c, { cta: 'Tahan domba & lanjut bayar DP ' + rp(d.dp), panggilan: true }) + '</div>';
        bindPesan(c, function (data) { data.tag = tag; return api('pesan', data); });
        window.scrollTo(0, 0);
      });
    }).catch(function (err) { if (err.code === 'GONE') return pageDiambil(tag, 'Domba ' + tag + ' sudah tidak tersedia'); throw err; });
  }

  function pageNabung() {
    return cfg().then(function (c) {
      var pilih = { ras: 'Tanduk', rentang: c.tabunganRentang[0] || '34-36' };
      function calc() {
        var p = pilih.rentang.split('-').map(Number), hk = c.harga.tanduk;
        var est = [p[0] * hk, p[1] * hk], dp = Math.ceil(p[1] * hk * c.dpPersen / 100 / 1000) * 1000;
        return { est: est, dp: dp, cicil: Math.ceil((est[1] - dp) / 6 / 1000) * 1000, hk: hk };
      }
      function summary() {
        var k = calc();
        document.getElementById('nb-sum').innerHTML = '<div class="kv"><span>Estimasi harga (' + pilih.rentang.replace('-', '–') + ' kg)</span><b>' + rjt(k.est[0], k.est[1]) + '</b></div>' +
          '<div class="kv"><span>DP sekarang (' + c.dpPersen + '%)</span><b class="accent">' + rp(k.dp) + '</b></div><div class="kv"><span>Contoh cicilan 6×</span><b>' + rp(k.cicil) + '/bulan</b></div>' +
          '<span class="xs muted">Harga/kg mengikuti harga bulan saat Anda memilih domba, lalu terkunci. Batal sebelum memilih domba: dana kembali utuh.</span>';
      }
      view.innerHTML = '<div class="wrap narrow stack">' + backBar('#/', 'Nabung qurban', 'Untuk bobot yang belum ada di kandang') +
        '<h1 class="h2">Bobot yang Anda mau belum ada di kandang?</h1><p>Pesan slot bobotnya sekarang dengan DP. Saat batch itu siap, Anda dapat notifikasi email dan bisa memilih dombanya langsung dari katalog.</p>' +
        '<div class="card stack"><span class="label">Domba Tanduk · ' + rp(c.harga.tanduk) + '/kg</span>' +
        '<span class="label">Pilih rentang bobot</span><div class="choice" id="nb-rentang">' + c.tabunganRentang.map(function (x, i) { return '<label><input type="radio" name="rentang" value="' + e(x) + '"' + (i === 0 ? ' checked' : '') + '><span>' + e(x.replace('-', '–')) + ' kg</span></label>'; }).join('') + '</div></div>' +
        '<div class="card stack" id="nb-sum"></div>' +
        '<div class="card stack small"><b>Alurnya</b><span>1. Bayar DP → dapat ID tabungan otomatis.</span><span>2. Cicil kapan saja, saldo tercatat di Domba Saya.</span><span>3. Domba sesuai bobot ready → notifikasi email, Anda pilih dari katalog lebih dulu.</span><span>4. Saldo tabungan jadi DP domba pilihan; pantau sampai hari H.</span></div>' +
        '<button class="btn btn-primary btn-block" id="nb-next">Lanjut</button></div>';
      Array.prototype.forEach.call(document.querySelectorAll('#nb-rentang input'), function (i) { i.onchange = function () { pilih[i.name] = i.value; summary(); }; });
      summary();
      document.getElementById('nb-next').onclick = function () {
        var k = calc();
        view.innerHTML = '<div class="wrap narrow stack">' + backBar('#/nabung', 'Nabung Tanduk ' + pilih.rentang.replace('-', '–') + ' kg', 'Syarat & Ketentuan') + skStep(c) + '</div>';
        bindSk(function () {
          view.innerHTML = '<div class="wrap narrow stack">' + backBar('#/nabung', 'Nabung Tanduk ' + pilih.rentang.replace('-', '–') + ' kg', 'Data pembeli') + formPembeli(c, { cta: 'Buat tabungan & bayar DP ' + rp(k.dp) }) + '</div>';
          bindPesan(c, function (data) { data.ras = pilih.ras; data.rentang = pilih.rentang; return api('nabung', data); });
          window.scrollTo(0, 0);
        });
      };
    });
  }

  /* -------- akun -------- */
  function pageMasuk(q) {
    return cfg().then(function () {
      var lanjut = (q && q.lanjut) || '#/saya', tab = 'akun';
      function draw() {
        view.innerHTML = '<div class="wrap narrow stack mt-lg"><h1 class="h2">Masuk ke Domba Saya</h1><p class="muted">Pantau bobot, foto, pembayaran, dan pengiriman domba Anda.</p>' +
          '<div class="tabs" role="tablist"><button role="tab" aria-selected="' + (tab === 'akun') + '" data-tab="akun">Akun</button><button role="tab" aria-selected="' + (tab === 'id') + '" data-tab="id">ID pesanan</button></div>' +
          (tab === 'akun' ? '<form class="card stack" id="f-login"><div class="field"><label for="l-id">Email atau nomor WhatsApp</label><input class="input" id="l-id" name="id" required autocomplete="username"></div>' +
            '<div class="field"><label for="l-pw">Kata sandi</label><input class="input" id="l-pw" name="password" type="password" required autocomplete="current-password"></div>' +
            '<label class="check"><input type="checkbox" name="ingat" checked> Tetap masuk di perangkat ini</label><p class="err" id="l-err" role="alert"></p>' +
            '<button class="btn btn-primary" type="submit">Masuk</button><button type="button" class="btn btn-ghost" id="lupa">Lupa kata sandi?</button></form>'
            : '<form class="card stack" id="f-quick"><div class="field"><label for="q-id">ID pesanan</label><input class="input" id="q-id" name="id" required placeholder="QDB-27-0001" style="text-transform:uppercase"></div>' +
            '<div class="field"><label for="q-wa">Nomor WhatsApp saat memesan</label><input class="input" id="q-wa" name="wa" type="tel" required></div><p class="err" id="q-err" role="alert"></p>' +
            '<button class="btn btn-primary" type="submit">Lihat pesanan</button><span class="xs muted">Akses cepat untuk melihat satu pesanan. Untuk mengubah alamat, ganti domba, atau membatalkan, masuk dengan akun.</span></form>') +
          '<div class="card-cream small"><b>Belum punya akun?</b><br>Akun dibuat otomatis saat Anda memesan domba pertama kali — cukup buat kata sandi di halaman pemesanan.</div></div>';
        Array.prototype.forEach.call(document.querySelectorAll('[data-tab]'), function (b) { b.onclick = function () { tab = b.dataset.tab; draw(); }; });
        var fl = document.getElementById('f-login');
        if (fl) {
          fl.onsubmit = function (ev) {
            ev.preventDefault(); var d = formData(fl), btn = fl.querySelector('[type=submit]'); busy(btn, true);
            api('login', { id: d.id, password: d.password, ingat: !!d.ingat }).then(function (s) { setSesi(s); if (s.peran === 'admin') { prefetch('adminPesanan', { filter: 'tindakan', q: '' }); prefetch('adminStok', {}); } go(s.peran === 'admin' && lanjut === '#/saya' ? '#/admin' : lanjut); })
              .catch(function (x) { busy(btn, false); document.getElementById('l-err').textContent = x.message; });
          };
          document.getElementById('lupa').onclick = function () {
            var em = document.getElementById('l-id').value.trim();
            if (!/@/.test(em)) { document.getElementById('l-err').textContent = 'Isi email Anda di kolom atas, lalu tekan "Lupa kata sandi?" lagi.'; return; }
            api('lupaSandi', { email: em }).then(function () { toast('Jika email terdaftar, tautan atur ulang sudah dikirim.'); }).catch(function (x) { toast(x.message, true); });
          };
        }
        var fq = document.getElementById('f-quick');
        if (fq) {
          fq.onsubmit = function (ev) {
            ev.preventDefault(); var d = formData(fq), btn = fq.querySelector('[type=submit]'); busy(btn, true);
            api('loginPesanan', { id: d.id, wa: d.wa }).then(function (s) { setSesi(s); go('#/pesanan/' + d.id.toUpperCase()); })
              .catch(function (x) { busy(btn, false); document.getElementById('q-err').textContent = x.message; });
          };
        }
      }
      draw();
    });
  }
  function pageReset(kode) {
    view.innerHTML = '<div class="wrap narrow stack mt-lg"><h1 class="h2">Buat kata sandi baru</h1><form class="card stack" id="f-reset"><div class="field"><label for="r-pw">Kata sandi baru (min. 6 karakter)</label><input class="input" id="r-pw" name="password" type="password" minlength="6" required autocomplete="new-password"></div><p class="err" id="r-err" role="alert"></p><button class="btn btn-primary" type="submit">Simpan &amp; masuk</button></form></div>';
    var f = document.getElementById('f-reset');
    f.onsubmit = function (ev) {
      ev.preventDefault(); var btn = f.querySelector('[type=submit]'); busy(btn, true);
      api('resetSandi', { kode: kode, password: f.password.value }).then(function (s) { setSesi(s); toast('Kata sandi diperbarui.'); go('#/saya'); })
        .catch(function (x) { busy(btn, false); document.getElementById('r-err').textContent = x.message; });
    };
    return Promise.resolve();
  }
  function logout(stay) {
    var t = state.sesi && state.sesi.token;
    if (t) api('logout', {}).catch(function () { });
    setSesi(null);
    if (stay) route(); else go('#/');
  }

  function needLogin() {
    if (!state.sesi) { go('#/masuk?lanjut=' + encodeURIComponent(location.hash)); return true; }
    return false;
  }

  function pageSaya() {
    if (needLogin()) return Promise.resolve();
    return Promise.all([cfg(), data('saya')]).then(function (r) {
      var d = r[1];
      if (d.lingkup && d.lingkup !== 'all' && d.pesanan.length === 1) return go('#/pesanan/' + d.pesanan[0].id);
      view.innerHTML = '<div class="wrap narrow stack mt-lg"><div class="between"><h1 class="h2">Assalamu\'alaikum, ' + e((d.nama || '').split(' ')[0]) + '</h1><button class="btn btn-ghost" id="out">Keluar</button></div>' +
        (d.pesanan.length ? d.pesanan.map(function (o) {
          return '<a class="card row" style="text-decoration:none;color:inherit" href="#/pesanan/' + e(o.id) + '">' + img(o.domba && o.domba.foto, o.tag).replace('<img', '<img style="width:72px;height:72px;border-radius:12px;object-fit:cover;flex:none"') +
            '<div class="stack" style="gap:2px;flex:1"><div class="between"><b>' + (o.panggilan ? '"' + e(o.panggilan) + '" · ' : '') + e(o.tag || 'Tabungan') + '</b>' + statusChip(o.status) + '</div>' +
            '<span class="small muted">' + e(o.id) + ' · target ' + o.min + '–' + o.max + ' kg</span><span class="small">Dana masuk <b>' + rp(o.hitung.paid) + '</b>' + (o.domba && o.domba.bobot ? ' · bobot ' + kg(o.domba.bobot) : '') + '</span></div></a>';
        }).join('') : '<div class="card empty">Belum ada pesanan. <a href="#/katalog">Pilih domba →</a></div>') +
        '<div class="wrap-row"><a class="btn btn-outline" href="#/katalog">Pesan domba lagi</a><a class="btn btn-outline" href="#/nabung">Nabung qurban</a></div></div>';
      document.getElementById('out').onclick = function () { logout(); };
    });
  }

  /* -------- pesanan (Domba Saya) -------- */
  function payBox(o, c) {
    var until = new Date(o.ditahanSampai);
    var bayar = o.gatewayUrl
      ? '<a class="btn btn-primary btn-block" href="' + e(o.gatewayUrl) + '" target="_blank" rel="noopener">Bayar via Virtual Account</a><span class="xs muted center">Pembayaran terdeteksi otomatis. Halaman ini diperbarui setelah Anda kembali.</span>'
      : '<span class="small">Transfer <b>tepat</b> ke rekening berikut:</span><div class="highlight stack" style="gap:4px"><span class="small">' + e(o.transfer.bank) + ' a.n. ' + e(o.transfer.atasNama || '-') + '</span>' +
      '<div class="between"><b style="font-size:20px;letter-spacing:1px">' + e(o.transfer.rekening || '[nomor rekening]') + '</b><button class="btn btn-outline btn-sm" data-copy="' + e(o.transfer.rekening) + '">' + icon('copy', 16) + ' Salin</button></div></div>' +
      '<div class="highlight between"><span class="small">Nominal tepat</span><b style="font-size:20px">' + rp(o.transfer.jumlah) + '</b><button class="btn btn-outline btn-sm" data-copy="' + o.transfer.jumlah + '">' + icon('copy', 16) + ' Salin</button></div>' +
      '<span class="xs muted">3 digit terakhir (' + o.kodeUnik + ') adalah kode unik pesanan Anda agar pembayaran mudah dicocokkan.</span>' +
      (o.laporTransfer ? '<div class="card-cream small">Laporan transfer terkirim: ' + e(o.laporTransfer) + '. Admin sedang memeriksa.</div>' :
        '<form id="f-lapor" class="stack"><button class="btn btn-primary btn-block" type="submit">Saya sudah transfer</button></form>') +
      '<a class="btn btn-outline" href="' + waLink('Assalamu\'alaikum, saya sudah transfer DP untuk pesanan ' + o.id + ' sebesar ' + rp(o.transfer.jumlah) + '. Berikut bukti transfernya:') + '">' + icon('wa') + ' Kirim bukti ke admin</a>';
    return '<section class="card stack" style="border:2px solid var(--pumpkin)"><div class="between"><b class="h3">Bayar DP ' + c.dpPersen + '%</b><span class="chip chip-hold" data-until="' + until.toISOString() + '">' + icon('clock', 14) + ' <span class="cd">--:--</span></span></div>' +
      '<span class="small">Domba ditahan untuk Anda sampai <b>' + tgl(until, true) + ' WIB</b>. Jika belum dibayar, domba kembali tersedia untuk umum.</span>' + bayar + '</section>';
  }
  function cicilBox(o) {
    return '<details class="card"><summary class="bold">Cicil / bayar sekarang</summary><div class="stack mt"><span class="small">Transfer berapa pun ke rekening di bawah, lalu laporkan agar admin mencatatnya.</span>' +
      '<div class="highlight stack" style="gap:4px"><span class="small">' + e(o.transfer.bank) + ' a.n. ' + e(o.transfer.atasNama || '-') + '</span><div class="between"><b style="font-size:18px">' + e(o.transfer.rekening || '[nomor rekening]') + '</b><button class="btn btn-outline btn-sm" data-copy="' + e(o.transfer.rekening) + '">Salin</button></div></div>' +
      '<form id="f-cicil" class="stack"><div class="field"><label for="c-jml">Jumlah yang ditransfer (Rp)</label><input class="input" id="c-jml" name="jumlah" inputmode="numeric" required></div><div class="field"><label for="c-cat">Catatan (opsional)</label><input class="input" id="c-cat" name="catatan" placeholder="mis. transfer dari BCA a.n. …"></div>' +
      '<button class="btn btn-primary" type="submit">Laporkan transfer</button></form></div></details>';
  }
  function pagePesanan(id) {
    if (needLogin()) return Promise.resolve();
    return Promise.all([cfg(), data('pesanan', { id: id })]).then(function (r) {
      var c = r[0], o = r[1], d = o.domba || {}, full = o.lingkup === 'all';
      var head = '<div class="card row" style="gap:14px">' + img(d.foto, 'Domba ' + o.tag).replace('<img', '<img style="width:92px;height:92px;border-radius:14px;object-fit:cover;flex:none"') +
        '<div class="stack" style="gap:3px">' +
        (o.tag ? '<b style="font-size:20px">' + (o.panggilan ? '"' + e(o.panggilan) + '"' : e(o.tag)) + (full ? ' <button class="btn btn-ghost btn-sm" id="edit-nama" style="min-height:0;padding:0 4px">' + icon('pen', 14) + ' ' + (o.panggilan ? 'ubah' : 'beri nama') + '</button>' : '') + '</b>' +
          '<span class="small bold">' + e(o.tag) + '</span><span class="small muted">Target ' + o.min + '–' + o.max + ' kg' + (d.umur ? ' · ± ' + e(d.umur) : '') + (d.kandang ? ' · ' + e(d.kandang) : '') + '</span>'
          : '<b style="font-size:20px">Tabungan Tanduk</b><span class="small muted">Rentang ' + o.min + '–' + o.max + ' kg</span>') +
        '<div class="wrap-row">' + statusChip(o.status) + (d.status && o.tag ? '<span class="chip ' + (/sehat/i.test(d.status) ? 'chip-ok' : 'chip-hold') + '">' + e(d.status) + '</span>' : '') + '</div></div></div>';
      var html = '<div class="wrap narrow stack">' + backBar('#/saya', o.id, o.nama) + head;

      if (o.status === 'Menunggu Bayar') html += payBox(o, c);
      if (o.status === 'Kedaluwarsa') html += '<div class="card-cream stack"><b>Waktu tahan sudah habis</b><span class="small">Pesanan ini tidak dibayar tepat waktu, jadi domba dikembalikan ke katalog. Jika Anda sudah transfer, hubungi admin agar dana dicatat.</span><div class="wrap-row"><a class="btn btn-primary" href="#/katalog">Pilih domba lagi</a><a class="btn btn-outline" href="' + waLink('Assalamu\'alaikum, pesanan ' + o.id + ' kedaluwarsa padahal saya sudah transfer.') + '">Hubungi admin</a></div></div>';
      if (o.status === 'Batal' || o.status === 'Ajukan Batal') html += '<div class="card-cream stack"><b>' + (o.status === 'Batal' ? 'Pesanan dibatalkan' : 'Pengajuan batal sedang diproses') + '</b><span class="small">Dana dikembalikan ' + rp(o.refund) + (o.potongan ? ' (potongan biaya riil ' + rp(o.potongan) + ')' : '') + ', paling lambat 2 minggu.</span></div>';

      if (o.tipe === 'Tabungan' && o.status === 'Tabungan') {
        html += '<div class="card-dark stack"><b class="h3" style="color:#fff">Saldo tabungan ' + rp(o.hitung.paid) + '</b><span class="small" style="color:var(--cream)">Saat domba Tanduk ' + o.min + '–' + o.max + ' kg siap, Anda bisa memilihnya di sini lebih dulu. Harga/kg terkunci saat memilih.</span>' +
          ((o.pilihan || []).length ? '<a class="btn btn-primary" href="#/pesanan/' + e(o.id) + '/pilih">Pilih domba sekarang (' + o.pilihan.length + ' tersedia)</a>' : '<span class="small">Belum ada domba yang cocok — kami kabari lewat email.</span>') + '</div>';
      }

      if (o.tag && [ 'DP', 'Lunas', 'Selesai', 'Ajukan Batal'].indexOf(o.status) >= 0) {
        html += '<section class="card stack chart"><div class="between"><b class="h3">Perkembangan bobot</b><span class="xs muted">timbang 1×/bulan</span></div>' +
          '<div class="row" style="gap:24px"><div><span class="xs muted">Terakhir · ' + tglPendek(d.tglTimbang) + '</span><br><b style="font-size:24px">' + kg(d.bobot) + '</b></div>' +
          '<div><span class="xs muted">Naik sejak masuk</span><br><b style="font-size:24px" class="accent">+' + kg((d.bobot || 0) - (d.bobotAwal || 0)) + '</b></div></div>' +
          chart(d.riwayat, o.min, o.max, c.iduladha, d.naikBulan) + '<span class="xs muted">Garis putus-putus = perkiraan pertumbuhan.</span></section>';
        if ((d.media || []).length) {
          html += '<section class="card stack"><div class="between"><b class="h3">Foto &amp; video terbaru</b><span class="xs muted">' + tgl(d.media[0].t) + '</span></div><div class="grid" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">' +
            d.media.slice(0, 6).map(function (m) { return '<a href="' + e(m.link) + '" target="_blank" rel="noopener" aria-label="Buka media ' + tgl(m.t) + '">' + img(m.foto, 'Foto ' + tgl(m.t)).replace('<img', '<img style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px"') + '</a>'; }).join('') + '</div></section>';
        }
      }

      if (['Menunggu Bayar', 'Kedaluwarsa'].indexOf(o.status) < 0) {
        var est = o.hitung;
        html += '<section class="card stack"><div class="between"><b class="h3">Pembayaran</b><span class="xs muted">' + (o.tag ? 'lunas H-' + c.h.lunas + ', setelah timbang akhir' : 'tabungan') + '</span></div>' +
          (o.tag ? '<div class="progress"><i style="width:' + Math.min(100, Math.round(est.paid / ((est.total || est.estMax) || 1) * 100)) + '%"></i></div>' : '') +
          '<div class="kv" style="align-items:baseline"><span>Total dana masuk</span><b style="font-size:22px">' + rp(est.paid) + '</b></div>' +
          (o.bayar.length ? '<div class="highlight stack small" style="gap:4px"><b class="xs muted">Riwayat pembayaran</b>' + o.bayar.map(function (p) { return '<div class="kv small"><span>' + tgl(p.waktu) + ' · ' + e(p.metode) + '</span><b>' + rp(p.jumlah) + '</b></div>'; }).join('') + '</div>' : '') +
          (o.tag ? (est.total ? '<div class="kv"><span>Sisa tagihan final</span><b class="accent">' + rp(est.sisa) + '</b></div>' : '<div class="kv"><span>Perkiraan sisa (maks. ' + o.max + ' kg)</span><b>' + rp(est.sisa) + '</b></div>') +
            '<div class="kv"><span>Harga terkunci</span><b>' + rp(o.hargaKg) + '/kg</b></div>' : '') +
          (o.laporTransfer ? '<div class="card-cream small">Laporan transfer: ' + e(o.laporTransfer) + ' — menunggu dicatat admin.</div>' : '') + '</section>';
        if (['DP', 'Tabungan', 'Lunas'].indexOf(o.status) >= 0 && est.sisa > 0) html += cicilBox(o);
      }

      if (o.tag && full && ['DP', 'Lunas'].indexOf(o.status) >= 0 && !o.dataLengkap) {
        html += '<a href="#/pesanan/' + e(o.id) + '/kirim" class="card row" style="text-decoration:none;color:inherit;border:2px solid var(--pumpkin)">' + icon('alert', 26, '#B4561A') + '<span style="flex:1"><b>Lengkapi data pengiriman</b><br><span class="small">Alamat &amp; nomor penerima belum lengkap. Batas H-' + c.h.timbang + '.</span></span><b class="accent">Isi →</b></a>';
      }
      if (o.boleh.ganti && full) {
        html += '<a href="#/pesanan/' + e(o.id) + '/ganti" class="card-cream row" style="text-decoration:none;color:inherit">' + icon('swap', 26) + '<span style="flex:1"><b>Ingin ganti domba?</b><br><span class="small">Gratis, sisa kesempatan ' + (c.maksGanti - o.jumlahGanti) + '×, selama stok tersedia.</span></span><b class="accent">Ganti →</b></a>';
      }

      if (o.tag && ['DP', 'Lunas', 'Selesai'].indexOf(o.status) >= 0) {
        html += '<nav class="list" aria-label="Menu pesanan">' +
          '<a class="rowlink" href="#/pesanan/' + e(o.id) + '/tagihan"><span><b>Timbang akhir &amp; tagihan</b><br><span class="xs muted">' + (o.bobotAkhir ? 'Bobot akhir ' + kg(o.bobotAkhir) + ' · sisa ' + rp(o.hitung.sisa) : 'Bobot akhir keluar H-' + c.h.timbang + ' Iduladha') + '</span></span>' + icon('chev') + '</a>' +
          '<a class="rowlink" href="#/pesanan/' + e(o.id) + '/kirim"><span><b>Pengiriman &amp; status hari H</b><br><span class="xs muted">' + (o.layanan === 'Sembelih' ? 'Disembelihkan' : 'Kirim hidup') + (o.statusKirim ? ' · ' + e(o.statusKirim) : '') + '</span></span>' + icon('chev') + '</a>' +
          (o.boleh.batal && full ? '<a class="rowlink muted" href="#/pesanan/' + e(o.id) + '/batal"><span>Batalkan pesanan</span>' + icon('chev') + '</a>' : '') + '</nav>';
      } else if (o.boleh.batal && full && o.status === 'Tabungan') {
        html += '<nav class="list"><a class="rowlink muted" href="#/pesanan/' + e(o.id) + '/batal"><span>Batalkan tabungan</span>' + icon('chev') + '</a></nav>';
      } else if (o.status === 'Menunggu Bayar' && full) {
        html += '<button class="btn btn-ghost" id="batal-tunggu">Batalkan pesanan ini</button>';
      }

      if ((d.kondisi || []).length) {
        html += '<section class="card stack small"><b class="h3">Catatan kandang</b>' + d.kondisi.slice(0, 6).map(function (k) { return '<div class="row" style="align-items:flex-start"><b class="accent" style="width:56px;flex:none">' + tglPendek(k.t) + '</b><span>' + e([k.status, k.ket, k.pindah ? 'Pindah ke ' + k.pindah : ''].filter(Boolean).join(' · ')) + '</span></div>'; }).join('') + '</section>';
      }
      if (!full) html += '<div class="card-cream small">Anda masuk dengan akses cepat (ID pesanan). Untuk mengubah data, ganti domba, atau membatalkan, <a href="#/masuk">masuk dengan akun</a>.</div>';
      html += '<div class="wrap-row"><a class="btn btn-outline" href="' + waLink('Assalamu\'alaikum admin, saya ingin bertanya tentang pesanan ' + o.id + '.') + '">' + icon('wa') + ' Chat admin</a></div></div>';
      view.innerHTML = html;

      bindCopy(); startCountdown();
      var fl = document.getElementById('f-lapor');
      if (fl) fl.onsubmit = function (ev) {
        ev.preventDefault(); var btn = fl.querySelector('button'); busy(btn, true);
        api('laporTransfer', { id: o.id, jumlah: o.transfer.jumlah, catatan: 'DP' }).then(function () { toast('Terima kasih. Admin akan memeriksa transfer Anda.'); route(); }).catch(function (x) { busy(btn, false); toast(x.message, true); });
      };
      var fc = document.getElementById('f-cicil');
      if (fc) fc.onsubmit = function (ev) {
        ev.preventDefault(); var dd = formData(fc), btn = fc.querySelector('button'); busy(btn, true);
        api('laporTransfer', { id: o.id, jumlah: Number(String(dd.jumlah).replace(/\D/g, '')), catatan: dd.catatan }).then(function () { toast('Laporan terkirim. Saldo bertambah setelah dicatat admin.'); route(); }).catch(function (x) { busy(btn, false); toast(x.message, true); });
      };
      var en = document.getElementById('edit-nama');
      if (en) en.onclick = function () {
        var n = window.prompt('Nama panggilan untuk domba ' + o.tag + ':', o.panggilan || '');
        if (n === null) return;
        api('ubahData', { id: o.id, data: { panggilan: n } }).then(function () { toast('Nama panggilan disimpan.'); route(); }).catch(function (x) { toast(x.message, true); });
      };
      var bt = document.getElementById('batal-tunggu');
      if (bt) bt.onclick = function () {
        if (!window.confirm('Batalkan pesanan ' + o.id + '? Domba akan kembali ke katalog.')) return;
        api('ajukanBatal', { id: o.id, alasan: 'Dibatalkan pembeli sebelum bayar' }).then(function () { toast('Pesanan dibatalkan.'); go('#/saya'); }).catch(function (x) { toast(x.message, true); });
      };
    });
  }
  function bindCopy() { Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (b) { b.onclick = function () { copy(b.dataset.copy); }; }); }
  function startCountdown() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-until]'), function (el) {
      var until = new Date(el.dataset.until).getTime(), cd = el.querySelector('.cd');
      function tick() {
        var s = Math.max(0, Math.floor((until - Date.now()) / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60;
        cd.textContent = (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(ss).padStart(2, '0') + ' lagi';
        if (!s) { cd.textContent = 'habis'; }
      }
      tick(); state.timers.push(setInterval(tick, 1000));
    });
  }

  function pageGanti(id, mode) {
    if (needLogin()) return Promise.resolve();
    return Promise.all([cfg(), data('pesanan', { id: id })]).then(function (r) {
      var c = r[0], o = r[1], pilih = mode === 'pilih';
      var list = pilih ? (o.pilihan || []) : (o.pengganti || []);
      if (!pilih && !o.boleh.ganti) { view.innerHTML = '<div class="wrap narrow">' + backBar('#/pesanan/' + o.id, 'Ganti domba', o.id) + '<div class="card">Kesempatan ganti domba sudah habis atau sudah lewat batas H-' + c.h.ganti + '.</div></div>'; return; }
      var sel = list[0] ? list[0].tag : '';
      function draw() {
        var s = list.filter(function (x) { return x.tag === sel; })[0];
        view.innerHTML = '<div class="wrap narrow stack">' + backBar('#/pesanan/' + o.id, pilih ? 'Pilih domba tabungan' : 'Ganti domba', o.id + (pilih ? '' : ' · sisa kesempatan ' + (c.maksGanti - o.jumlahGanti) + '×')) +
          (o.tag ? '<div class="card row">' + img(o.domba && o.domba.foto, o.tag).replace('<img', '<img style="width:64px;height:64px;border-radius:12px;object-fit:cover;flex:none"') + '<div class="small"><span class="xs muted bold">DOMBA SAAT INI</span><br><b>' + e(o.tag) + ' · ' + o.min + '–' + o.max + ' kg</b><br>Dana masuk ' + rp(o.hitung.paid) + '</div></div>' : '<div class="card small">Saldo tabungan <b>' + rp(o.hitung.paid) + '</b> akan menjadi DP domba yang Anda pilih.</div>') +
          '<div class="between"><b>' + (pilih ? 'Pilih domba' : 'Pilih pengganti') + '</b><span class="xs muted">hanya stok tersedia</span></div>' +
          (list.length ? '<div class="stack" role="radiogroup">' + list.map(function (x) {
            var diff = x.estMax - (o.max * (o.hargaKg || x.hargaKg));
            return '<button class="card row" role="radio" aria-checked="' + (x.tag === sel) + '" data-tag="' + e(x.tag) + '" style="text-align:left;cursor:pointer;border:' + (x.tag === sel ? '2px solid var(--pumpkin)' : '1px solid var(--line)') + '">' +
              img(x.foto, x.tag).replace('<img', '<img style="width:72px;height:72px;border-radius:12px;object-fit:cover;flex:none"') + '<span style="flex:1" class="small"><b style="font-size:15px">' + e(x.tag) + '</b><br>Target ' + x.min + '–' + x.max + ' kg · sekarang ' + kg(x.bobot) + '<br><b class="accent">' + rjt(x.estMin, x.estMax) + '</b></span>' +
              (!pilih ? '<span class="chip">' + (diff === 0 ? 'Rp0' : (diff > 0 ? '+' : '−') + rp(Math.abs(diff)).replace('Rp', 'Rp')) + '</span>' : '') + '</button>';
          }).join('') + '</div>' : '<div class="card empty">Belum ada domba yang tersedia saat ini.</div>') +
          (s ? '<div class="card stack small"><b class="h3">Ringkasan</b><div class="kv"><span>Domba ' + (pilih ? 'pilihan' : 'baru') + '</span><b>' + e(s.tag) + ' · ' + s.min + '–' + s.max + ' kg</b></div><div class="kv"><span>Dana dipindahkan utuh</span><b>' + rp(o.hitung.paid) + '</b></div>' +
            '<div class="kv"><span>Harga/kg</span><b>' + rp(pilih ? s.hargaKg : o.hargaKg) + (pilih ? ' (terkunci sekarang)' : ' (tetap)') + '</b></div>' + (!pilih ? '<div class="kv"><span>Biaya ganti</span><b>Gratis</b></div>' : '') +
            '<span class="xs muted">Domba ' + (pilih ? 'pilihan' : 'baru') + ' langsung dikunci untuk Anda. ' + (o.tag ? e(o.tag) + ' baru dilepas ke katalog setelah penggantian berhasil.' : '') + '</span></div>' +
            '<button class="btn btn-primary btn-block" id="do-ganti">' + (pilih ? 'Pilih ' : 'Konfirmasi ganti ke ') + e(s.tag) + '</button>' : '') + '</div>';
        Array.prototype.forEach.call(document.querySelectorAll('[data-tag]'), function (b) { b.onclick = function () { sel = b.dataset.tag; draw(); }; });
        var dg = document.getElementById('do-ganti');
        if (dg) dg.onclick = function () {
          busy(dg, true);
          api(pilih ? 'pilihDomba' : 'ganti', { id: o.id, tag: sel }).then(function () { toast(pilih ? 'Domba dipilih.' : 'Domba berhasil diganti.'); go('#/pesanan/' + o.id); })
            .catch(function (x) { busy(dg, false); toast(x.message, true); if (x.code === 'TAKEN') route(); });
        };
      }
      draw();
    });
  }

  function pageTagihan(id) {
    if (needLogin()) return Promise.resolve();
    return Promise.all([cfg(), data('pesanan', { id: id })]).then(function (r) {
      var c = r[0], o = r[1], h = o.hitung, d = o.domba || {};
      var bukti = (d.media || [])[0];
      var tl = [
        ['DP ' + c.dpPersen + '%', o.tglAkad ? tgl(o.tglAkad) + ' · ' + rp(o.dp) : '-', o.tglAkad ? 'done' : 'now'],
        ['Cicilan (opsional)', 'Total masuk ' + rp(h.paid), h.paid > o.dp + o.kodeUnik ? 'done' : 'next'],
        ['Timbang akhir H-' + c.h.timbang, o.bobotAkhir ? kg(o.bobotAkhir) + ' · harga final dihitung' : 'Dijadwalkan ' + tgl(c.tgl.timbang), o.bobotAkhir ? 'done' : 'next'],
        ['Pelunasan paling lambat H-' + c.h.lunas, tgl(c.tgl.lunas) + (h.total ? ' · sisa ' + rp(h.sisa) : ''), o.status === 'Lunas' || o.status === 'Selesai' ? 'done' : (o.bobotAkhir ? 'now' : 'next')]
      ];
      view.innerHTML = '<div class="wrap narrow stack">' + backBar('#/pesanan/' + o.id, 'Timbang akhir & tagihan', o.id + ' · ' + o.tag) +
        '<section class="card"><b class="h3">Jadwal pembayaran</b><div class="tl mt">' + tl.map(function (t, i) {
          return '<div class="tl-item ' + t[2] + '"><div class="tl-dot"><span>' + (t[2] === 'done' ? icon('check', 14, '#fff') : i + 1) + '</span>' + (i < tl.length - 1 ? '<i></i>' : '') + '</div><div class="tl-body"><b>' + e(t[0]) + '</b><br><span class="small muted">' + e(t[1]) + '</span></div></div>';
        }).join('') + '</div></section>' +
        (o.bobotAkhir ? '<section class="card-dark stack"><div class="between"><span class="eyebrow" style="color:var(--pumpkin)">Bobot akhir</span><span class="xs" style="color:var(--cream)">ditimbang H-' + c.h.timbang + '</span></div><b style="font-size:40px;line-height:1">' + kg(o.bobotAkhir) + '</b>' +
          (bukti ? '<a href="' + e(bukti.link) + '" target="_blank" rel="noopener">' + img(bukti.foto, 'Foto timbang akhir').replace('<img', '<img style="width:100%;max-height:260px;object-fit:cover;border-radius:12px"') + '</a><span class="xs" style="color:var(--cream)">Foto &amp; video diambil langsung dari catatan timbang kandang (QDF Ternak). Ketuk untuk membuka.</span>' : '') + '</section>'
          : '<div class="card-cream small">Bobot akhir akan ditimbang <b>' + tgl(c.tgl.timbang) + '</b> (H-' + c.h.timbang + ') lengkap dengan foto &amp; video. Tagihan final dikirim ke email Anda.</div>') +
        '<section class="card stack"><b class="h3">Perhitungan harga</b>' +
        (o.bobotAkhir ? '<div class="kv"><span>Bobot akhir</span><b>' + kg(o.bobotAkhir) + '</b></div>' : '<div class="kv"><span>Estimasi (' + o.min + '–' + o.max + ' kg)</span><b>' + rp(h.estMin) + ' – ' + rp(h.estMax).replace('Rp', '') + '</b></div>') +
        '<div class="kv"><span>Harga terkunci saat akad</span><b>' + rp(o.hargaKg) + '/kg</b></div>' +
        (h.hargaFinal ? '<div class="kv"><span>Harga domba' + (o.bobotAkhir > o.max ? ' (maks. ' + o.max + ' kg, sisanya bonus)' : '') + '</span><b>' + rp(h.hargaFinal) + '</b></div>' : '') +
        '<div class="kv"><span>Jasa sembelih</span><b>' + (o.layanan === 'Sembelih' ? (h.sembelih ? rp(h.sembelih) : 'dikonfirmasi admin') : 'Rp0 · kirim hidup') + '</b></div><div class="divider"></div>' +
        (h.total ? '<div class="kv"><span>Total tagihan</span><b>' + rp(h.total) + '</b></div>' : '') +
        '<div class="kv"><span>Sudah dibayar</span><b>' + rp(h.paid) + '</b></div>' +
        '<div class="highlight between"><span><b>' + (h.kelebihan ? 'Kelebihan bayar' : (h.total ? 'Sisa tagihan' : 'Perkiraan sisa')) + '</b><br><span class="xs muted">' + (h.kelebihan ? 'dikembalikan maks. 2 minggu' : 'bayar paling lambat H-' + c.h.lunas) + '</span></span><b style="font-size:20px" class="accent">' + rp(h.kelebihan || h.sisa) + '</b></div>' +
        '<span class="xs muted">Bobot ≥ ' + o.max + ' kg: maksimal ' + rp(h.estMax) + ', kelebihan bobotnya bonus untuk Anda.</span></section>' +
        (h.hargaFinal && h.sisa > 0 ? '<section class="card stack">' + (o.gatewayUrl && o.finalDisetujui ? '<a class="btn btn-primary" href="' + e(o.gatewayUrl) + '" target="_blank" rel="noopener">Bayar ' + rp(h.sisa) + ' via Virtual Account</a>' :
          '<span class="small">Transfer <b>' + rp(h.sisa) + '</b> ke ' + e(o.transfer.bank) + ' <b>' + e(o.transfer.rekening) + '</b> a.n. ' + e(o.transfer.atasNama) + ', lalu laporkan.</span>' +
          (o.boleh.setujuiFinal ? '<button class="btn btn-primary" id="setuju-final">Setujui harga final</button>' : '<button class="btn btn-primary" id="lapor-lunas">Saya sudah transfer pelunasan</button>')) +
          '<a class="btn btn-ghost" href="' + waLink('Assalamu\'alaikum, saya ingin bertanya soal bobot akhir pesanan ' + o.id + '.') + '">Ada pertanyaan soal bobot? Hubungi admin</a></section>' : '') + '</div>';
      var sf = document.getElementById('setuju-final');
      if (sf) sf.onclick = function () { busy(sf, true); api('setujuiFinal', { id: o.id }).then(function () { toast('Harga final disetujui.'); route(); }).catch(function (x) { busy(sf, false); toast(x.message, true); }); };
      var ll = document.getElementById('lapor-lunas');
      if (ll) ll.onclick = function () { busy(ll, true); api('laporTransfer', { id: o.id, jumlah: h.sisa, catatan: 'Pelunasan' }).then(function () { toast('Laporan pelunasan terkirim.'); go('#/pesanan/' + o.id); }).catch(function (x) { busy(ll, false); toast(x.message, true); }); };
    });
  }

  function pageKirim(id) {
    if (needLogin()) return Promise.resolve();
    return Promise.all([cfg(), data('pesanan', { id: id })]).then(function (r) {
      var c = r[0], o = r[1], full = o.lingkup === 'all', sembelih = o.layanan === 'Sembelih';
      var st = o.statusKirim || '';
      var steps = [['Timbang akhir', o.bobotAkhir ? 'H-' + c.h.timbang + ' · ' + kg(o.bobotAkhir) : 'H-' + c.h.timbang + ' Iduladha', o.bobotAkhir ? 'done' : 'next'],
      ['Lunas', o.status === 'Lunas' || o.status === 'Selesai' ? 'Pembayaran lengkap' : 'Paling lambat H-' + c.h.lunas, o.status === 'Lunas' || o.status === 'Selesai' ? 'done' : 'next']];
      var flow = sembelih ? ['Siap disembelih', 'Disembelih', 'Dokumentasi terkirim'] : ['Siap dikirim', 'Dalam perjalanan', 'Diterima'];
      var idx = flow.map(function (x) { return x.toLowerCase(); }).indexOf(st.toLowerCase());
      if (o.status === 'Selesai') idx = 2;
      flow.forEach(function (f, i) { steps.push([f, i === idx && o.infoKirim ? o.infoKirim : (sembelih ? ['Domba menunggu di kandang hingga hari H', 'Hari H / hari tasyrik', 'Video & foto dikirim ke email dan halaman ini'][i] : ['Domba dicek kesehatan & dimandikan', 'Nama & nomor sopir dikirim via email', 'Foto serah terima dengan penerima'][i]), i < idx ? 'done' : (i === idx ? (i === 2 ? 'done' : 'now') : 'next')]); });
      view.innerHTML = '<div class="wrap narrow stack">' + backBar('#/pesanan/' + o.id, 'Pengiriman & status hari H', o.id + ' · ' + o.tag) +
        '<section class="card"><div class="tl">' + steps.map(function (t, i) { return '<div class="tl-item ' + t[2] + '"><div class="tl-dot"><span>' + (t[2] === 'done' ? icon('check', 14, '#fff') : i + 1) + '</span>' + (i < steps.length - 1 ? '<i></i>' : '') + '</div><div class="tl-body"><b>' + e(t[0]) + '</b><br><span class="small muted">' + e(t[1]) + '</span></div></div>'; }).join('') + '</div></section>' +
        (o.linkDok ? '<a class="btn btn-dark" href="' + e(o.linkDok) + '" target="_blank" rel="noopener">' + icon('play') + ' Lihat dokumentasi</a>' : '') +
        (full ? '<form class="card stack" id="f-kirim"><b class="h3">Layanan &amp; tujuan</b>' +
          '<div class="choice"><label><input type="radio" name="layanan" value="Hidup"' + (!sembelih ? ' checked' : '') + (o.boleh.ubahLayanan ? '' : ' disabled') + '><span>Kirim hidup</span><span class="xs muted">Gratis ongkir Jabodetabek</span></label><label><input type="radio" name="layanan" value="Sembelih"' + (sembelih ? ' checked' : '') + (o.boleh.ubahLayanan ? '' : ' disabled') + '><span>Disembelihkan</span><span class="xs muted">' + (c.biayaSembelih ? '+' + rp(c.biayaSembelih) : '+biaya sembelih') + ' · dokumentasi gratis</span></label></div>' +
          '<div class="field"><label for="k-alamat">Alamat pengiriman</label><textarea class="input" id="k-alamat" name="alamatKirim" rows="3"' + (o.boleh.ubahKirim ? '' : ' disabled') + '>' + e(o.alamatKirim) + '</textarea></div>' +
          '<div class="field"><label for="k-penerima">Nama penerima</label><input class="input" id="k-penerima" name="penerima" value="' + e(o.penerima) + '"' + (o.boleh.ubahKirim ? '' : ' disabled') + '></div>' +
          '<div class="field"><label for="k-hp">No. HP penerima</label><input class="input" id="k-hp" name="hpPenerima" type="tel" value="' + e(o.hpPenerima) + '"' + (o.boleh.ubahKirim ? '' : ' disabled') + '></div>' +
          '<div class="field"><label for="k-shohibul">Nama shohibul qurban</label><input class="input" id="k-shohibul" name="shohibul" value="' + e(o.shohibul) + '"></div>' +
          '<span class="xs muted">Alamat bisa diubah sampai H-' + c.h.ubahKirim + ', layanan sampai H-' + c.h.timbang + '. Setelah itu hubungi admin.</span><button class="btn btn-primary" type="submit">Simpan</button></form>'
          : '<div class="card small"><b>' + e(o.penerima || '-') + '</b> · ' + e(o.hpPenerima || '-') + '<br><span class="muted">' + e(o.alamatKirim || 'Alamat belum diisi') + '</span></div>') +
        '<a class="btn btn-outline" href="' + waLink('Assalamu\'alaikum, saya ingin bertanya soal pengiriman pesanan ' + o.id + '.') + '">' + icon('wa') + ' Hubungi admin pengiriman</a></div>';
      var f = document.getElementById('f-kirim');
      if (f) f.onsubmit = function (ev) {
        ev.preventDefault(); var d = formData(f), data = { shohibul: d.shohibul }, btn = f.querySelector('[type=submit]');
        if (o.boleh.ubahKirim) { data.alamatKirim = d.alamatKirim; data.penerima = d.penerima; data.hpPenerima = d.hpPenerima; }
        if (o.boleh.ubahLayanan && d.layanan) data.layanan = d.layanan;
        busy(btn, true);
        api('ubahData', { id: o.id, data: data }).then(function () { toast('Data pengiriman disimpan.'); go('#/pesanan/' + o.id); }).catch(function (x) { busy(btn, false); toast(x.message, true); });
      };
    });
  }

  function pageBatal(id) {
    if (needLogin()) return Promise.resolve();
    return Promise.all([cfg(), data('pesanan', { id: id })]).then(function (r) {
      var c = r[0], o = r[1], b = o.batalEstimasi || { hari: 0, potongan: 0, refund: o.hitung.paid, biayaHarian: c.biayaHarian, penuh: true };
      if (!o.boleh.batal) { view.innerHTML = '<div class="wrap narrow">' + backBar('#/pesanan/' + o.id, 'Batalkan pesanan', o.id) + '<div class="card">Pesanan ini tidak bisa dibatalkan dari web. Hubungi admin.</div></div>'; return; }
      view.innerHTML = '<div class="wrap narrow stack">' + backBar('#/pesanan/' + o.id, 'Batalkan pesanan', o.id) +
        (o.boleh.ganti ? '<a href="#/pesanan/' + e(o.id) + '/ganti" class="card-cream stack" style="text-decoration:none;color:inherit"><b>Kurang cocok dengan dombanya?</b><span class="small">Anda masih punya ' + (c.maksGanti - o.jumlahGanti) + '× kesempatan ganti domba gratis, tanpa potongan apa pun.</span><b class="small accent">Ganti domba saja →</b></a>' : '') +
        '<section class="card stack"><b class="h3">' + e(o.id) + ' · ' + e(o.tag || 'Tabungan') + '</b><div class="kv"><span>Dana masuk</span><b>' + rp(o.hitung.paid) + '</b></div>' +
        (b.penuh ? '<div class="kv"><span>Potongan</span><b>Rp0</b></div><span class="xs muted">Domba belum dipilih, jadi belum ada biaya pemeliharaan. Dana dikembalikan utuh.</span>'
          : '<div class="kv"><span>Dipelihara sejak akad</span><b>' + b.hari + ' hari</b></div><div class="kv"><span>Biaya pakan + tenaga kandang</span><b>' + rp(b.biayaHarian) + '/hari</b></div><div class="kv"><span>Potongan biaya riil</span><b class="accent">− ' + rp(b.potongan) + '</b></div>') +
        '<div class="highlight between"><b>Dana dikembalikan</b><b style="font-size:20px">' + rp(b.refund) + '</b></div>' +
        (!b.penuh ? '<span class="xs muted">Potongan hanya sebesar biaya pakan &amp; tenaga kandang yang benar-benar sudah dikeluarkan untuk domba Anda, dan tidak pernah melebihi dana yang sudah masuk. Angka final dihitung pada hari pengajuan diproses.</span>' : '') + '</section>' +
        '<form class="card stack" id="f-batal"><div class="field"><label for="b-alasan">Alasan pembatalan (opsional)</label><select class="input" id="b-alasan" name="alasan"><option value="">Pilih alasan</option><option>Rencana qurban berubah</option><option>Kendala dana</option><option>Lainnya</option></select></div>' +
        '<div class="field"><label for="b-rek">Rekening pengembalian <span class="req">*</span></label><input class="input" id="b-rek" name="rekening" required placeholder="Bank · nomor rekening · atas nama"></div>' +
        '<span class="xs muted">Dana dikembalikan paling lambat 2 minggu. Domba kembali tersedia di katalog.</span><button class="btn btn-danger" type="submit">Ajukan pembatalan</button></form></div>';
      var f = document.getElementById('f-batal');
      f.onsubmit = function (ev) {
        ev.preventDefault(); var d = formData(f), btn = f.querySelector('[type=submit]');
        if (!d.rekening) return toast('Isi rekening pengembalian.', true);
        if (!window.confirm('Ajukan pembatalan ' + o.id + '?')) return;
        busy(btn, true);
        api('ajukanBatal', { id: o.id, alasan: d.alasan, rekening: d.rekening }).then(function () { toast('Pengajuan pembatalan terkirim.'); go('#/pesanan/' + o.id); }).catch(function (x) { busy(btn, false); toast(x.message, true); });
      };
    });
  }

  function pageSyarat() {
    return cfg().then(function (c) {
      view.innerHTML = '<div class="wrap narrow stack mt-lg"><h1 class="h2">Syarat &amp; Ketentuan</h1><span class="xs muted">Versi ' + e(c.skVersi) + '</span><div class="card">' + skHtml(c) + '</div></div>';
    });
  }
  function pagePrivasi() {
    return cfg().then(function (c) {
      var sec = [
        ['Data yang kami kumpulkan', 'Nama lengkap, nama shohibul qurban, email, nomor telepon/WhatsApp, alamat pembeli, alamat pengiriman, nama & nomor penerima, rekening untuk pengembalian dana, serta riwayat pesanan dan pembayaran.'],
        ['Untuk apa data dipakai', 'Memproses pesanan dan pembayaran, mengirim update bobot & foto domba, tagihan dan pengingat lewat email, mengatur pengiriman atau penyembelihan, menerbitkan sertifikat qurban, dan mengembalikan dana bila ada. Kami tidak menjual data Anda dan tidak memakainya untuk iklan pihak lain.'],
        ['Siapa yang dapat mengakses', 'Hanya admin Qurbandong. Tim kandang hanya melihat nomor eartag dan ID pesanan. Data dibagikan secara terbatas kepada penyedia pembayaran (untuk memproses transaksi), layanan email (untuk notifikasi), dan sopir pengiriman (nama, nomor & alamat penerima saja).'],
        ['Penyimpanan & keamanan', 'Data disimpan di akun Google milik Qurbandong dengan akses terbatas. Kata sandi disimpan dalam bentuk terenkripsi (hash), bukan teks asli. Halaman web hanya menampilkan data milik Anda setelah Anda masuk.'],
        ['Berapa lama disimpan', 'Selama pesanan aktif, lalu 2 tahun setelah transaksi selesai untuk keperluan pembukuan. Setelah itu data dihapus atau dianonimkan.'],
        ['Hak Anda', 'Anda berhak meminta salinan data, memperbaiki data yang salah, meminta penghapusan data (setelah tidak ada transaksi berjalan), dan menarik persetujuan. Kami menanggapi paling lambat 3 hari kerja.'],
        ['Jika terjadi kebocoran data', 'Kami akan memberi tahu Anda lewat email paling lambat 3 × 24 jam sejak mengetahuinya, beserta langkah yang kami ambil.'],
        ['Kontak', 'Email ' + (c.emailAdmin || 'qurbandong1@gmail.com') + ' · WhatsApp 0811-8301-181.']
      ];
      view.innerHTML = '<div class="wrap narrow stack mt-lg"><h1 class="h2">Kebijakan Privasi</h1><p class="small muted">Qurbandong Farm (Gunung Wangun, Pamoyanan, Bogor) mengelola data pribadi Anda sesuai Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.</p><div class="card stack">' +
        sec.map(function (s, i) { return '<div><b>' + (i + 1) + '. ' + e(s[0]) + '</b><p class="small">' + e(s[1]) + '</p></div>'; }).join('') + '</div></div>';
    });
  }

  /* ================= ADMIN ================= */
  function adminBar(active) {
    setTimeout(function () { /* halaman admin lain disiapkan lebih dulu supaya pindah tab terasa instan */
      if (active !== 'pesanan') prefetch('adminPesanan', { filter: 'tindakan', q: '' });
      if (active !== 'stok') prefetch('adminStok', {});
      if (active !== 'harga') prefetch('adminHarga', {});
    }, 400);
    return '<div class="admin-bar"><div class="wrap"><b style="color:var(--pumpkin);margin-right:8px">ADMIN</b>' +
      [['pesanan', 'Pesanan'], ['stok', 'Stok domba'], ['harga', 'Harga & pengaturan']].map(function (x) { return '<a href="#/admin/' + x[0] + '" class="' + (active === x[0] ? 'active' : '') + '">' + x[1] + '</a>'; }).join('') + '</div></div>';
  }
  function needAdmin() {
    if (!state.sesi) { go('#/masuk?lanjut=' + encodeURIComponent('#/admin')); return true; }
    if (state.sesi.peran !== 'admin') { view.innerHTML = '<div class="wrap narrow"><div class="card mt-lg">Halaman ini khusus admin.</div></div>'; return true; }
    return false;
  }
  function pageAdminPesanan(q) {
    if (needAdmin()) return Promise.resolve();
    var f = (q && q.f) || 'tindakan', s = (q && q.q) || '';
    return data('adminPesanan', { filter: f === 'semua' ? '' : f, q: s }).then(function (d) {
      var rk = d.ringkas;
      view.innerHTML = adminBar('pesanan') + '<div class="wrap stack mt">' +
        '<div class="stats"><div class="card"><span class="xs muted">Pesanan aktif</span><b style="color:var(--jet)">' + rk.aktif + '</b></div><div class="card"><span class="xs muted">Dana masuk</span><b style="color:var(--jet)">' + jt(rk.dana) + '</b></div><div class="card-cream"><span class="xs">Perlu tindakan</span><b style="font-size:28px">' + rk.tindak + '</b></div><div class="card"><span class="xs muted">Data kirim belum lengkap</span><b style="color:var(--jet)">' + rk.belumLengkap + '</b></div></div>' +
        '<form class="row" id="f-cari"><label class="sr-only" for="a-q">Cari</label><input class="input" id="a-q" name="q" value="' + e(s) + '" placeholder="ID, nama, eartag, atau nomor WA"><button class="btn btn-dark" type="submit">Cari</button></form>' +
        '<div class="wrap-row">' + [['tindakan', 'Perlu tindakan'], ['Menunggu Bayar', 'Menunggu bayar'], ['DP', 'DP'], ['Lunas', 'Lunas'], ['tabungan', 'Tabungan'], ['Ajukan Batal', 'Ajukan batal'], ['Batal', 'Batal'], ['semua', 'Semua']].map(function (x) {
          return '<a class="btn btn-sm ' + (f === x[0] ? 'btn-dark' : 'btn-outline') + '" href="#/admin/pesanan?f=' + encodeURIComponent(x[0]) + '">' + x[1] + '</a>';
        }).join('') + '</div>' +
        '<div class="stack">' + (d.items.length ? d.items.map(function (x) {
          return '<a class="card stack" style="text-decoration:none;color:inherit;gap:4px" href="#/admin/pesanan/' + e(x.id) + '"><div class="between"><b>' + e(x.id) + ' · ' + e(x.tag) + '</b>' + statusChip(x.status) + '</div>' +
            '<div class="between small muted"><span>' + e(x.nama) + ' · ' + e(x.wa) + '</span><span>masuk <b style="color:var(--jet)">' + rp(x.paid) + '</b></span></div>' +
            (x.tindakan ? '<span class="xs bold" style="color:var(--accent-dark)">' + e(x.tindakan) + '</span>' : '') + '</a>';
        }).join('') : '<div class="card empty">Tidak ada pesanan.</div>') + '</div></div>';
      document.getElementById('f-cari').onsubmit = function (ev) { ev.preventDefault(); go('#/admin/pesanan?f=semua&q=' + encodeURIComponent(this.q.value)); };
    });
  }
  function pageAdminDetail(id) {
    if (needAdmin()) return Promise.resolve();
    return Promise.all([cfg(), data('adminDetail', { id: id })]).then(function (r) { drawAdminDetail(r[0], r[1]); });
  }
  function drawAdminDetail(c, o) {
    var h = o.hitung, d = o.domba || {}, bh = o.batalHitung || {};
    view.innerHTML = adminBar('pesanan') + '<div class="wrap narrow stack">' + backBar('#/admin/pesanan', o.id, o.nama + ' · ' + (o.tag || 'Tabungan ' + o.min + '–' + o.max + ' kg')) +
      (o.peringatan ? '<div class="card-cream bold">' + e(o.peringatan) + '</div>' : '') +
      '<div class="wrap-row">' + statusChip(o.status) + '<span class="chip">' + e(o.layanan) + '</span>' + (o.dataLengkap ? '' : '<span class="chip chip-hold">Data kirim belum lengkap</span>') + '</div>' +
      '<section class="card stack small"><b class="h3">Pembeli</b><span>' + e(o.email) + ' · <a href="https://wa.me/' + e(String(o.wa).replace(/^0/, '62')) + '">' + e(o.wa) + '</a></span><span class="muted">Shohibul: ' + e(o.shohibul || '-') + '</span><span class="muted">Alamat: ' + e(o.alamat || '-') + '</span>' +
      '<span class="muted">Kirim: ' + e(o.penerima || '-') + ' · ' + e(o.hpPenerima || '-') + ' · ' + e(o.alamatKirim || '-') + '</span><span class="muted">Akad ' + tgl(o.tglAkad) + ' · harga ' + rp(o.hargaKg) + '/kg · ganti ' + o.jumlahGanti + '×</span>' +
      (o.laporTransfer ? '<span class="card-cream">Lapor transfer: ' + e(o.laporTransfer) + '</span>' : '') + '</section>' +
      '<section class="card stack"><div class="between"><b class="h3">Pembayaran</b><b style="font-size:18px">' + rp(h.paid) + '</b></div>' +
      o.bayar.map(function (p) { return '<div class="kv small highlight"><span>' + tgl(p.waktu, true) + ' · ' + e(p.metode) + '</span><b>' + rp(p.jumlah) + '</b></div>'; }).join('') +
      '<form id="f-bayar" class="grid-form"><div class="field"><label for="ab-j">Jumlah (Rp)</label><input class="input" id="ab-j" name="jumlah" inputmode="numeric" required value="' + (o.status === 'Menunggu Bayar' || o.status === 'Kedaluwarsa' ? o.dp + o.kodeUnik : (h.sisa || '')) + '"></div>' +
      '<div class="field"><label for="ab-m">Metode</label><select class="input" id="ab-m" name="metode"><option>Transfer BCA</option><option>Transfer bank lain</option><option>Tunai</option><option>VA</option></select></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="ab-r">Referensi (opsional)</label><input class="input" id="ab-r" name="referensi" placeholder="No. referensi mutasi"></div>' +
      '<button class="btn btn-primary" style="grid-column:1/-1" type="submit">Catat pembayaran diterima</button></form><span class="xs muted">Setelah dicatat, email bukti bayar &amp; saldo terbaru terkirim otomatis.</span></section>' +
      (o.tag && ['DP', 'Lunas', 'Selesai'].indexOf(o.status) >= 0 ? '<section class="card stack"><b class="h3">Bobot akhir (H-' + c.h.timbang + ')</b><span class="small muted">Bobot terbaru dari QDF Ternak: <b>' + kg(d.bobot) + '</b> (' + tgl(d.tglTimbang) + ')</span>' +
        (o.bobotAkhir ? '<div class="kv"><span>Bobot akhir terkunci</span><b>' + kg(o.bobotAkhir) + '</b></div><div class="kv"><span>Harga final</span><b>' + rp(h.hargaFinal) + '</b></div><div class="kv"><span>Sisa</span><b>' + rp(h.sisa) + '</b></div>' : '') +
        '<form id="f-bobot" class="row"><label class="sr-only" for="ak-b">Bobot (kg)</label><input class="input" id="ak-b" name="bobot" inputmode="decimal" value="' + (o.bobotAkhir || d.bobot || '') + '"><button class="btn btn-primary" type="submit" style="flex:none">Kunci &amp; kirim tagihan</button></form></section>' : '') +
      (o.tag && ['DP', 'Lunas', 'Selesai'].indexOf(o.status) >= 0 ? '<section class="card stack"><b class="h3">Pengiriman / sembelih</b><form id="f-status" class="stack"><div class="field"><label for="as-s">Status</label><select class="input" id="as-s" name="status">' +
        ['', 'Siap dikirim', 'Dalam perjalanan', 'Diterima', 'Siap disembelih', 'Disembelih', 'Dokumentasi terkirim'].map(function (x) { return '<option' + (x === o.statusKirim ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="as-i">Info untuk pembeli</label><input class="input" id="as-i" name="info" value="' + e(o.infoKirim) + '" placeholder="mis. Sopir Pak Rudi 0812…, tiba pukul 09.00"></div>' +
        '<div class="field"><label for="as-l">Link dokumentasi (Drive/YouTube)</label><input class="input" id="as-l" name="link" value="' + e(o.linkDok) + '"></div><button class="btn btn-outline" type="submit">Simpan &amp; kabari pembeli</button></form></section>' : '') +
      (['DP', 'Tabungan', 'Ajukan Batal', 'Menunggu Bayar', 'Kedaluwarsa'].indexOf(o.status) >= 0 ? '<section class="card stack"><b class="h3">Pembatalan &amp; refund</b>' +
        (o.rekeningRefund ? '<span class="small">Rekening: <b>' + e(o.rekeningRefund) + '</b> · alasan: ' + e(o.alasanBatal || '-') + '</span>' : '') +
        '<div class="kv"><span>Hari sejak akad</span><b>' + (bh.hari || 0) + ' hari</b></div><div class="kv"><span>Biaya pakan + tenaga / hari</span><b>' + rp(bh.biayaHarian) + '</b></div>' +
        '<form id="f-batal" class="stack"><div class="field"><label for="ap-p">Potongan biaya riil (Rp)</label><input class="input" id="ap-p" name="potongan" inputmode="numeric" value="' + (bh.potongan || 0) + '"></div><span class="small">Refund ke pembeli: <b class="accent">' + rp(h.paid - (bh.potongan || 0)) + '</b></span>' +
        '<button class="btn btn-danger" type="submit">Proses pembatalan</button></form></section>' : '') +
      '<section class="card stack"><b class="h3">Catatan admin</b><form id="f-cat" class="stack"><textarea class="input" name="catatan" rows="2">' + e(o.catatanAdmin) + '</textarea><button class="btn btn-outline btn-sm" type="submit">Simpan catatan</button></form></section>' +
      '<section class="card stack xs muted"><b class="h3" style="color:var(--jet)">Riwayat</b>' + (o.log || []).map(function (l) { return '<span>' + tgl(l.waktu, true) + ' · ' + e(l.aksi) + ' · ' + e(l.oleh) + (l.detail ? ' · ' + e(l.detail).slice(0, 140) : '') + '</span>'; }).join('') + '</section></div>';

    function act(formId, action, build, confirmMsg) {
      var f = document.getElementById(formId); if (!f) return;
      f.onsubmit = function (ev) {
        ev.preventDefault(); var dd = formData(f), btn = f.querySelector('[type=submit]');
        if (confirmMsg && !window.confirm(confirmMsg)) return;
        busy(btn, true);
        api(action, Object.assign({ id: o.id }, build(dd))).then(function (res) { toast('Tersimpan.'); putC('adminDetail', { id: o.id }, res); drawAdminDetail(c, res); window.scrollTo(0, 0); }).catch(function (x) { busy(btn, false); toast(x.message, true); });
      };
    }
    act('f-bayar', 'catatBayar', function (dd) { return { jumlah: Number(String(dd.jumlah).replace(/\D/g, '')), metode: dd.metode, referensi: dd.referensi }; });
    act('f-bobot', 'kunciBobot', function (dd) { return { bobot: Number(String(dd.bobot).replace(',', '.')) }; }, 'Kunci bobot akhir dan kirim tagihan ke pembeli?');
    act('f-status', 'statusKirim', function (dd) { return dd; });
    act('f-batal', 'prosesBatal', function (dd) { return { potongan: Number(String(dd.potongan).replace(/\D/g, '')) || 0 }; }, 'Proses pembatalan pesanan ini? Domba akan dilepas ke katalog.');
    act('f-cat', 'catatanAdmin', function (dd) { return { catatan: dd.catatan }; });
  }

  function pageAdminStok() {
    if (needAdmin()) return Promise.resolve();
    return data('adminStok', {}).then(function (d) { drawStok(d); });
  }
  var SARAN_UMUR = '14 bulan'; /* saran umur perkiraan bila belum diisi */
  var SARAN_TAMBAH = 2, SARAN_RENTANG = 5; /* saran target: bobot aman + 2 kg; batas atas = target + 5 kg */
  function saran(x) { return x.aman ? { min: x.aman + SARAN_TAMBAH, max: x.aman + SARAN_TAMBAH + SARAN_RENTANG } : null; }
  function drawStok(d) {
    var avail = d.items.filter(function (x) { return x.tampil && !x.pesanan; });
    var qs = function (sel, root) { return (root || document).querySelector(sel); };
    var norm = function (t) { return String(t || '').toLowerCase().replace(/[^a-z0-9]/g, ''); };
    function rowHtml(x, i) {
      var warn = !x.dariQdf && x.aman && x.min > x.aman + SARAN_TAMBAH + SARAN_RENTANG ? '<span class="srow-warn xs" title="Perkiraan bobot aman sampai timbang akhir: ' + x.aman + ' kg">⚠ target jauh di atas bobot aman (' + x.aman + ' kg)</span>' : '';
      var sg = saran(x), vMin = x.dariQdf && sg ? sg.min : x.min, vMax = x.dariQdf && sg ? sg.max : x.max;
      var chip = x.pesanan ? statusChip(x.pesanan.status === 'Ditahan' ? 'Ditahan' : x.pesanan.status) : (/^sehat$/i.test(x.status || 'Sehat') ? '' : '<span class="chip chip-grey">' + e(x.status) + '</span>');
      return '<div class="srow" data-i="' + i + '">' +
        '<label class="srow-chk" title="Tampil di web"><input type="checkbox" name="tampil"' + (x.tampil ? ' checked' : '') + ' aria-label="Tampil di web ' + e(x.tag) + '"></label>' +
        img(th(x.foto, 120), x.tag, 'srow-img') +
        '<div class="srow-info"><div><b>' + e(x.tag) + '</b> <span class="xs muted">' + e(x.sex) + ' · ' + e(x.kandang) + '</span> ' + chip + '</div>' +
        '<div class="xs muted">' + kg(x.bobot) + ' · timbang ' + tglPendek(x.tglTimbang) + (x.pesanan ? ' · <a href="#/admin/pesanan/' + e(x.pesanan.id) + '">' + e(x.pesanan.id) + '</a>' : '') + '</div>' + warn + '</div>' +
        '<div class="srow-in"><input class="input" name="min" inputmode="decimal" value="' + e(vMin) + '" placeholder="min" aria-label="Target min ' + e(x.tag) + '"><span class="muted">–</span><input class="input" name="max" inputmode="decimal" value="' + e(vMax) + '" placeholder="max" aria-label="Target max ' + e(x.tag) + '"><input class="input srow-umur" name="umur" value="' + e(x.umur || SARAN_UMUR) + '" placeholder="Umur" aria-label="Umur ' + e(x.tag) + '"></div></div>';
    }
    view.innerHTML = adminBar('stok') + '<div class="wrap stack mt"><div class="card small between"><span>Domba di QDF Ternak: <b>' + d.items.length + '</b> <button type="button" class="btn btn-ghost btn-sm" id="s-segar" title="Bobot &amp; foto dari QDF disegarkan otomatis tiap 10 menit">↻ Muat ulang dari QDF</button></span><span>Tampil &amp; tersedia: <b>' + avail.length + '</b> · dipesan: <b>' + d.items.filter(function (x) { return x.pesanan; }).length + '</b></span></div>' +
      '<div class="card stack stok-tools"><div class="row"><input class="input" id="s-cari" data-bebas="1" type="search" placeholder="Cari eartag, mis. QD-025" autocomplete="off" aria-label="Cari eartag"><select class="input" id="s-filter" data-bebas="1" aria-label="Saring" style="max-width:150px"><option value="semua">Semua</option><option value="tampil">Sudah tampil</option><option value="belum">Belum tampil</option><option value="dipesan">Dipesan</option></select></div>' +
      '<div class="between"><label class="check"><input type="checkbox" id="s-all"> Centang semua yang terlihat</label><span class="xs muted" id="s-count"></span></div></div>' +
      '<div class="card stok-list" id="s-list">' + d.items.map(rowHtml).join('') + '</div>' +
      '<p class="xs muted">Kolom target dan umur sudah terisi saran: target <b>bobot aman + 2 kg</b> (min) dan <b>min + 5 kg</b> (max), umur <b>14 bulan</b>. Centang domba yang mau ditampilkan, ganti angka bila perlu, lalu tekan <b>Simpan perubahan</b> sekali untuk semuanya. Bobot, foto, kandang &amp; status diambil otomatis dari QDF Ternak; target awal juga dari QDF Ternak. Domba berstatus Sakit tidak tampil. Tombol <b>Saran</b> = perkiraan bobot aman sampai timbang akhir + 5 kg. Tanda ⚠ berarti target di atas saran itu.</p>' +
      '<form class="card stack" id="f-manual"><b class="h3">Pesan manual (pembeli via WhatsApp)</b><span class="xs muted">Memakai sistem tahan yang sama dengan web, jadi tidak bisa tabrakan. Pembeli menerima email berisi instruksi bayar &amp; bisa masuk dengan ID pesanan + nomor WA.</span>' +
      '<div class="field"><label for="m-tag">Domba</label><select class="input" id="m-tag" name="tag">' + d.items.filter(function (x) { return !x.pesanan && x.max; }).map(function (x) { return '<option value="' + e(x.tag) + '">' + e(x.tag) + ' · ' + x.min + '–' + x.max + ' kg' + (x.tampil ? '' : ' (tidak tampil)') + '</option>'; }).join('') + '</select></div>' +
      '<div class="grid-form"><div class="field"><label for="m-nama">Nama pembeli</label><input class="input" id="m-nama" name="nama" required></div><div class="field"><label for="m-wa">No. WhatsApp</label><input class="input" id="m-wa" name="wa" type="tel" required></div></div>' +
      '<div class="field"><label for="m-email">Email pembeli</label><input class="input" id="m-email" name="email" type="email" required></div><button class="btn btn-primary" type="submit">Tahan domba &amp; kirim instruksi bayar</button></form></div>' +
      '<div class="stok-save" id="s-bar" hidden><span id="s-n"></span><button class="btn btn-primary btn-sm" id="s-save" type="button">Simpan perubahan</button></div>';
    var list = qs('#s-list'), rows = Array.prototype.slice.call(list.querySelectorAll('.srow')), cari = qs('#s-cari'), fil = qs('#s-filter'), all = qs('#s-all'), bar = qs('#s-bar');
    function cur(r) { return { min: qs('[name=min]', r).value.trim(), max: qs('[name=max]', r).value.trim(), umur: qs('[name=umur]', r).value.trim(), tampil: qs('[name=tampil]', r).checked }; }
    var orig = d.items.map(function (x) { return { min: String(x.min || ''), max: String(x.max || ''), umur: String(x.umur || '').trim(), tampil: !!x.tampil }; });
    function dirtyRows() { return rows.filter(function (r) { return JSON.stringify(cur(r)) !== JSON.stringify(orig[Number(r.dataset.i)]); }); }
    function refreshBar() {
      var n = 0; rows.forEach(function (r) { var dd = JSON.stringify(cur(r)) !== JSON.stringify(orig[Number(r.dataset.i)]); r.classList.toggle('dirty', dd); if (dd) n++; });
      bar.hidden = !n; qs('#s-n').textContent = n + ' domba diubah';
    }
    function apply() {
      state.stokQ = cari.value; state.stokF = fil.value;
      var q = norm(cari.value), f = fil.value, n = 0;
      rows.forEach(function (r) {
        var x = d.items[Number(r.dataset.i)];
        var ok = (!q || norm(x.tag).indexOf(q) > -1) && (f === 'semua' || (f === 'tampil' && x.tampil && !x.pesanan) || (f === 'belum' && !x.tampil && !x.pesanan) || (f === 'dipesan' && !!x.pesanan));
        r.hidden = !ok; if (ok) n++;
      });
      qs('#s-count').textContent = 'Terlihat ' + n + ' dari ' + rows.length;
    }
    cari.value = state.stokQ || ''; fil.value = state.stokF || 'semua';
    cari.oninput = apply; fil.onchange = apply;
    all.onchange = function () { rows.forEach(function (r) { if (!r.hidden) qs('[name=tampil]', r).checked = all.checked; }); refreshBar(); };
    list.addEventListener('input', refreshBar); list.addEventListener('change', refreshBar);
    apply(); refreshBar();
    qs('#s-save').onclick = function () {
      var ch = dirtyRows(), btn = this, bad = null;
      ch.forEach(function (r) { var v = cur(r); if (!bad && v.tampil && (!v.min || !v.max)) bad = r; });
      if (bad) { toast('Isi target min dan max dulu untuk ' + d.items[Number(bad.dataset.i)].tag + ' sebelum menampilkannya.', true); bad.scrollIntoView({ block: 'center' }); qs('[name=min]', bad).focus(); return; }
      busy(btn, true); btn.innerHTML = 'Menyimpan ' + ch.length + ' domba…';
      var items = ch.map(function (r) { var x = d.items[Number(r.dataset.i)], v = cur(r); return { tag: x.tag, min: v.min, max: v.max, umur: v.umur, tampil: v.tampil, catatan: x.catatan || '' }; });
      api('simpanStokMassal', { items: items }).catch(function (er) {
        if (!/Aksi tidak dikenal/.test(er.message)) throw er;
        /* server belum diperbarui: simpan satu per satu seperti cara lama */
        return items.reduce(function (pr, it) { return pr.then(function () { return api('simpanStok', it); }); }, Promise.resolve());
      }).then(function (res) {
        putC('adminStok', {}, res); toast(ch.length + ' domba disimpan. Katalog sudah diperbarui.'); drawStok(res);
      }).catch(function (er) { busy(btn, false); toast(er.message, true); });
    };
    qs('#s-segar').onclick = function () {
      var btn = this; busy(btn, true);
      api('adminStok', { segarkan: true }).then(function (res) { putC('adminStok', {}, res); toast('Data QDF Ternak dimuat ulang.'); drawStok(res); }).catch(function (er) { busy(btn, false); toast(er.message, true); });
    };
    var fm = document.getElementById('f-manual');
    fm.onsubmit = function (ev) {
      ev.preventDefault(); var dd = formData(fm), btn = fm.querySelector('[type=submit]'); busy(btn, true);
      api('pesanManual', dd).then(function (res) { toast('Pesanan ' + res.pesanan.id + ' dibuat.'); go('#/admin/pesanan/' + res.pesanan.id); }).catch(function (er) { busy(btn, false); toast(er.message, true); });
    };
  }

  function pageAdminHarga() {
    if (needAdmin()) return Promise.resolve();
    return data('adminHarga', {}).then(function (d) { drawHarga(d); });
  }
  function drawHarga(d) {
    var S = d.pengaturan, today = new Date(), first = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    var ymd = first.getFullYear() + '-' + String(first.getMonth() + 1).padStart(2, '0') + '-01';
    var keys = [['dp_persen', 'DP minimal (%)'], ['tahan_menit', 'Waktu tahan (menit)'], ['biaya_harian', 'Biaya pakan + tenaga / ekor / hari (Rp)'], ['biaya_sembelih', 'Biaya jasa sembelih (Rp, 0 = belum ditetapkan)'], ['maks_ganti', 'Maksimal ganti domba'],
      ['tanggal_iduladha', 'Tanggal Iduladha (yyyy-mm-dd)'], ['pelunasan_h', 'Batas pelunasan (H-)'], ['timbang_akhir_h', 'Timbang akhir (H-)'], ['batas_ganti_h', 'Batas ganti (H-)'],
      ['bank_nama', 'Bank transfer manual'], ['bank_rekening', 'Nomor rekening'], ['bank_atas_nama', 'Atas nama'], ['url_web', 'Alamat web'], ['maps_url', 'Link Google Maps'], ['paket_aqiqah', 'Keterangan paket aqiqah'], ['batch_label', 'Label batch di beranda'], ['tabungan_rentang', 'Rentang tabungan (pisahkan koma)'], ['rentang_kg', 'Lebar range target (kg)'], ['naik_aman_bulan', 'Kenaikan aman (kg/bulan) untuk peringatan target']];
    view.innerHTML = adminBar('harga') + '<div class="wrap narrow stack mt">' +
      '<section class="card stack"><div class="between"><b class="h3">Harga per kg hidup</b><span class="xs muted">berlaku sekarang</span></div><div class="kv"><span>Domba Tanduk</span><b>' + rp(d.sekarang.tanduk) + '/kg</b></div></section>' +
      '<form class="card stack" id="f-harga"><b class="h3">Jadwalkan harga baru</b><div class="field"><label for="h-mulai">Berlaku mulai</label><input class="input" type="date" id="h-mulai" name="mulai" value="' + ymd + '" required></div>' +
      '<div class="grid-form"><div class="field"><label for="h-t">Harga domba Tanduk (Rp/kg)</label><input class="input" id="h-t" name="tanduk" inputmode="numeric" value="' + d.sekarang.tanduk + '" required></div></div>' +
      '<span class="xs muted">Pesanan yang sudah DP tetap memakai harga saat akad. Katalog &amp; DP otomatis menyesuaikan saat tanggal berlaku tiba.</span><button class="btn btn-primary" type="submit">Simpan &amp; jadwalkan harga</button></form>' +
      '<section class="card stack small"><b class="h3">Riwayat harga</b>' + d.riwayat.map(function (r) { return '<div class="kv"><span>' + tgl(r.mulai) + '</span><span>' + rp(r.tanduk) + '/kg <span class="muted">· ' + e(r.oleh) + '</span></span></div>'; }).join('') + '</section>' +
      '<form class="card stack" id="f-set"><b class="h3">Pengaturan pesanan</b>' + keys.map(function (k) { return '<div class="field"><label for="s-' + k[0] + '">' + e(k[1]) + '</label><input class="input" id="s-' + k[0] + '" name="' + k[0] + '" value="' + e(S[k[0]]) + '"></div>'; }).join('') +
      '<button class="btn btn-dark" type="submit">Simpan pengaturan</button></form></div>';
    var fh = document.getElementById('f-harga');
    fh.onsubmit = function (ev) {
      ev.preventDefault(); var dd = formData(fh), btn = fh.querySelector('[type=submit]'); busy(btn, true);
      api('simpanHarga', { mulai: dd.mulai, harga: Number(String(dd.tanduk).replace(/\D/g, '')) }).then(function (res) { toast('Harga dijadwalkan.'); state.cfg = null; store('qb_cfg', null); putC('adminHarga', {}, res); drawHarga(res); }).catch(function (x) { busy(btn, false); toast(x.message, true); });
    };
    var fs = document.getElementById('f-set');
    fs.onsubmit = function (ev) {
      ev.preventDefault(); var dd = formData(fs), btn = fs.querySelector('[type=submit]'); busy(btn, true);
      api('simpanPengaturan', { data: dd }).then(function (res) { toast('Pengaturan disimpan.'); state.cfg = null; store('qb_cfg', null); putC('adminHarga', {}, res); drawHarga(res); }).catch(function (x) { busy(btn, false); toast(x.message, true); });
    };
  }

  /* ================= ROUTER ================= */
  var routes = [
    [/^#?\/?$/, pageBeranda],
    [/^#\/katalog$/, pageKatalog],
    [/^#\/domba\/([^/?]+)$/, pageDomba],
    [/^#\/pesan\/([^/?]+)$/, pagePesan],
    [/^#\/nabung$/, pageNabung],
    [/^#\/masuk$/, pageMasuk],
    [/^#\/reset\/([^/?]+)$/, pageReset],
    [/^#\/saya$/, pageSaya],
    [/^#\/pesanan\/([^/?]+)$/, pagePesanan],
    [/^#\/pesanan\/([^/?]+)\/ganti$/, function (id) { return pageGanti(id, 'ganti'); }],
    [/^#\/pesanan\/([^/?]+)\/pilih$/, function (id) { return pageGanti(id, 'pilih'); }],
    [/^#\/pesanan\/([^/?]+)\/tagihan$/, pageTagihan],
    [/^#\/pesanan\/([^/?]+)\/kirim$/, pageKirim],
    [/^#\/pesanan\/([^/?]+)\/batal$/, pageBatal],
    [/^#\/syarat$/, pageSyarat],
    [/^#\/privasi$/, pagePrivasi],
    [/^#\/admin(\/pesanan)?$/, function () { return pageAdminPesanan(arguments[arguments.length - 1]); }],
    [/^#\/admin\/pesanan\/([^/?]+)$/, pageAdminDetail],
    [/^#\/admin\/stok$/, pageAdminStok],
    [/^#\/admin\/harga$/, pageAdminHarga]
  ];
  function route(diam) {
    diam = diam === true;
    var sy = window.scrollY;
    state.timers.forEach(clearInterval); state.timers = [];
    document.body.classList.remove('has-sticky');
    var full = location.hash || '#/', qi = full.indexOf('?'), path = qi >= 0 ? full.slice(0, qi) : full, q = {};
    if (qi >= 0) full.slice(qi + 1).split('&').forEach(function (kv) { var p = kv.split('='); if (p[0]) q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); });
    renderHeader();
    for (var i = 0; i < routes.length; i++) {
      var m = path.match(routes[i][0]);
      if (m) {
        var args = m.slice(1).filter(function (x) { return x !== undefined && x !== '/pesanan'; }).map(decodeURIComponent);
        args.push(q);
        if (!diam) { loading(); window.scrollTo(0, 0); }
        var p;
        try { p = routes[i][1].apply(null, args); } catch (x) { p = Promise.reject(x); }
        Promise.resolve(p).then(function () { if (diam) window.scrollTo(0, sy); }, diam ? function () { } : fail);
        return;
      }
    }
    view.innerHTML = '<div class="wrap narrow"><div class="card mt-lg stack center"><b class="h3">Halaman tidak ditemukan</b><a class="btn btn-primary" href="#/">Ke beranda</a></div></div>';
  }
  window.addEventListener('hashchange', route);
  document.getElementById('wa-float').href = waLink('Assalamu\'alaikum Qurbandong, saya ingin konsultasi qurban.');
  renderFooter(); route();
  (window.requestIdleCallback || function (f) { setTimeout(f, 1200); })(function () {
    prefetch('katalog');
    if (state.sesi && state.sesi.peran === 'admin') { prefetch('adminPesanan', { filter: 'tindakan', q: '' }); prefetch('adminStok', {}); }
  });
  cfg().then(function () { document.getElementById('wa-float').href = waLink('Assalamu\'alaikum Qurbandong, saya ingin konsultasi qurban.'); }).catch(function () { });
})();
