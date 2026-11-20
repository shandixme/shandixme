// shandixme.com — opening animation on the home page: a pixel desktop computer on a desk switches on
// (power light, old-TV screen line, picture, loading bar), then the view dives into the screen to reveal the site.
// Plays once per browser tab (sessionStorage). The <head> of index.html decides whether to play it
// (adds class "intro" to <html>); it is skipped for reduced motion and for links straight to a section (#works).
// Click, tap, any key, or the Skip button ends it early. Timings live in css/style.css (search "opening animation").
(function () {
  var html = document.documentElement;
  if (!html.classList.contains('intro')) return;
  try { sessionStorage.setItem('shandixme-intro', '1'); } catch (e) {}

  var END = 4300;   // ms; must match the fade-out delay in style.css

  function r(x, y, w, h, fill, extra) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '"' + (extra || '') + '/>';
  }
  var line = ' stroke="#6C78B8" stroke-width="1"';
  function repeat(from, to, step, fn) { var s = ''; for (var i = from; i <= to; i += step) s += fn(i); return s; }

  // Scene drawn on a 96 x 72 pixel grid (1 unit = 1 big pixel). Screen: x 27–69, y 11–39, centre (48, 25).
  var svg =
    '<svg class="intro-scene" viewBox="0 0 96 72" shape-rendering="crispEdges" aria-hidden="true">' +
      '<defs>' +
        '<linearGradient id="intro-sky" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#86A8EC"/><stop offset=".55" stop-color="#B4BDF2"/><stop offset="1" stop-color="#CFEADF"/>' +
        '</linearGradient>' +
        '<pattern id="intro-dot" width="2" height="2" patternUnits="userSpaceOnUse">' + r(0, 0, 1, 1, '#FFFFFF') + '</pattern>' +
        '<pattern id="intro-scan" width="1" height="1" patternUnits="userSpaceOnUse">' + r(0, 0, 1, 0.3, '#1F2552') + '</pattern>' +
        '<clipPath id="intro-screen">' + r(27, 11, 42, 28, '#000') + '</clipPath>' +
      '</defs>' +
      // desk: top surface, front with two drawers (mint handles)
      r(2.5, 56.5, 91, 5, '#B4BDE8', line) +
      r(2.5, 61.5, 91, 10, '#C5CBE8', line) +
      r(6.5, 63.5, 24, 3, '#DCE1F5', line) + r(16, 64.5, 4, 1, '#94D6BF') +
      r(6.5, 67.5, 24, 3, '#DCE1F5', line) + r(16, 68.5, 4, 1, '#94D6BF') +
      r(65.5, 63.5, 24, 7, '#DCE1F5', line) + r(75, 66.5, 4, 1, '#94D6BF') +
      // small plant on the left
      r(12, 44, 1, 8, '#4FAE8E') + r(9, 46, 3, 2, '#94D6BF') + r(13, 45, 3, 2, '#94D6BF') + r(10, 49, 2, 2, '#4FAE8E') + r(13, 48, 3, 2, '#4FAE8E') +
      r(9.5, 51.5, 6, 4.5, '#DCE1F5', line) +
      // keyboard and mouse
      r(26.5, 57.5, 36, 3, '#F1F3FB', line) +
      repeat(28, 60, 2, function (x) { return r(x, 58, 1, 1, '#C5CBE8'); }) +
      repeat(29, 59, 2, function (x) { return r(x, 59, 1, 1, '#C5CBE8'); }) +
      r(66.5, 57.5, 4, 3, '#F1F3FB', line) +
      // tower on the right: drive slots, vents, disk light, power light
      r(77.5, 24.5, 13, 31, '#F1F3FB', line) +
      r(80, 28, 8, 1, '#8D97CC') + r(79.5, 31.5, 9, 3, '#DCE1F5', ' stroke="#6C78B8" stroke-width=".5"') +
      r(80, 40, 8, 1, '#C5CBE8') + r(80, 42, 8, 1, '#C5CBE8') + r(80, 44, 8, 1, '#C5CBE8') +
      r(80, 50, 2, 1, '#8D97CC', ' class="intro-disk"') + r(86, 50, 2, 1, '#8D97CC', ' class="intro-led"') +
      // monitor: stand, case, bezel, screen
      r(42.5, 48.5, 11, 3, '#DCE1F5', line) +
      r(36.5, 51.5, 23, 4, '#F1F3FB', line) +
      r(21.5, 5.5, 53, 43, '#F1F3FB', line) + r(22, 6, 52, 1, '#FFFFFF') +
      r(25, 9, 46, 32, '#DCE1F5') + r(26, 10, 44, 30, '#8D97CC') +
      r(27, 11, 42, 28, '#1F2552') +
      // screen picture (switched on by CSS)
      '<g class="intro-power" clip-path="url(#intro-screen)">' +
        r(27, 11, 42, 28, 'url(#intro-sky)') +
        r(27, 11, 42, 3, 'url(#intro-dot)', ' opacity=".5"') +
        '<polygon points="27,39 27,33 30,33 30,31 35,31 35,33 38,33 38,35 41,35 41,39" fill="#FFFFFF"/>' +
        '<polygon points="56,39 56,34 59,34 59,32 64,32 64,30 69,30 69,39" fill="#FFFFFF"/>' +
        '<polygon points="54,11 54,13 58,13 58,14 66,14 66,13 69,13 69,11" fill="#FFFFFF"/>' +
        r(31, 16, 1, 1, '#FFFFFF') + r(63, 19, 1, 1, '#FFE48A') + r(34, 23, 1, 1, '#94D6BF') +
        // pixel heart (same 7x6 shape as the window title bars)
        '<path transform="translate(44.5 14)" fill="#4FAE8E" d="M1,0h2v1h-2z M4,0h2v1h-2z M0,1h7v2h-7z M1,3h5v1h-5z M2,4h3v1h-3z M3,5h1v1h-1z"/>' +
        '<text x="48" y="26" text-anchor="middle" font-family="Pixelify Sans, sans-serif" font-weight="700" font-size="3.4" fill="#1F2552">shandixme.exe</text>' +
        r(36, 29, 24, 3, '#F1F3FB', ' stroke="#6C78B8" stroke-width=".5"') +
        r(37, 30, 22, 1, '#4FAE8E', ' class="intro-bar"') +
        r(27, 11, 42, 28, 'url(#intro-scan)', ' opacity=".07"') +
      '</g>' +
      // old-TV switch-on: a white line that opens into the full screen
      r(27, 11, 42, 28, '#FFFFFF', ' class="intro-crt"') +
      r(27, 11, 1, 1, '#8D97CC') + r(68, 11, 1, 1, '#8D97CC') + r(27, 38, 1, 1, '#8D97CC') + r(68, 38, 1, 1, '#8D97CC') +
      // monitor chin: vents, power button, power light
      repeat(29, 41, 3, function (x) { return r(x, 43, 2, 1, '#C5CBE8') + r(x, 45, 2, 1, '#C5CBE8'); }) +
      r(59.5, 42.5, 4, 3, '#DCE1F5', ' stroke="#6C78B8" stroke-width=".5"') +
      r(66, 44, 2, 1, '#8D97CC', ' class="intro-led"') +
    '</svg>';

  var overlay = document.createElement('div');
  overlay.className = 'intro-overlay';
  overlay.innerHTML = svg + '<button type="button" class="intro-skip">Skip</button>';
  document.body.appendChild(overlay);
  html.style.overflow = 'hidden';

  // how far to zoom so the monitor screen covers the whole window
  var scene = overlay.querySelector('.intro-scene');
  var b = scene.getBoundingClientRect(), u = b.width / 96;
  var cx = b.left + 48 * u, cy = b.top + 25 * u;
  var zoom = Math.max(Math.max(cx, innerWidth - cx) / (21 * u), Math.max(cy, innerHeight - cy) / (14 * u)) * 1.08;
  scene.style.setProperty('--zoom', zoom.toFixed(2));

  var done = false, timer;
  function finish(fast) {
    if (done) return; done = true;
    clearTimeout(timer);
    html.classList.remove('intro'); html.style.overflow = '';
    if (fast) overlay.classList.add('is-skipping');
    setTimeout(function () { overlay.remove(); }, fast ? 300 : 600);
    document.removeEventListener('keydown', skip);
  }
  function skip() { finish(true); }
  timer = setTimeout(function () { finish(false); }, END);
  overlay.addEventListener('click', skip);
  document.addEventListener('keydown', skip);
})();
