// shandixme.com — small behaviours: works inventory, twinkling stars, pixel photo reveal, cursor star trail
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Works inventory: click a slot to show that work in the info panel
  var slots = document.querySelectorAll('.slot');
  function show(btn) {
    slots.forEach(function (b) {
      var on = b === btn;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.getElementById('sel-no').textContent = btn.dataset.no;
    document.getElementById('sel-title').textContent = btn.dataset.title;
    document.getElementById('sel-meta').textContent = btn.dataset.meta;
    // photo: links to the project page; shows the [project photo] placeholder when data-img is empty
    var img = document.getElementById('sel-img');
    var ph = document.getElementById('sel-ph');
    var imgLink = document.getElementById('sel-img-link');
    if (btn.dataset.img) {
      img.src = btn.dataset.img; img.alt = btn.dataset.alt || ''; img.style.display = 'block'; ph.style.display = 'none';
    } else {
      img.removeAttribute('src'); img.alt = ''; img.style.display = 'none'; ph.style.display = 'flex';
    }
    if (btn.dataset.href) { imgLink.href = btn.dataset.href; } else { imgLink.removeAttribute('href'); }
    var link = document.getElementById('sel-link');
    if (btn.dataset.href) { link.href = btn.dataset.href; link.style.display = 'flex'; }
    else { link.style.display = 'none'; }
  }
  slots.forEach(function (b) { b.addEventListener('click', function () { show(b); }); });

  // 2. Twinkle: give every sky star its own rhythm
  document.querySelectorAll('.tw').forEach(function (el) {
    el.style.animationDelay = (-Math.random() * 4).toFixed(2) + 's';
    el.style.animationDuration = (1.6 + Math.random() * 2.4).toFixed(2) + 's';
  });

  // 3. Pixel hover: the works photo is clear, and breaks into pixels step by step on hover or keyboard focus.
  //    Touch screens (no hover) just show the clear photo.
  (function () {
    var box = document.getElementById('sel-img-link');
    var img = document.getElementById('sel-img');
    if (!box || !img || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var BLOCKS = [16, 8, 4, 2, 0];          // block size in px for each step; 0 = clear photo
    var PIXEL = 0, CLEAR = BLOCKS.length - 1;
    var level = CLEAR, target = CLEAR, timer = null;
    var cv = document.createElement('canvas');
    cv.className = 'pix';
    cv.setAttribute('aria-hidden', 'true');
    box.appendChild(cv);
    var small = document.createElement('canvas');

    function draw() {
      var b = BLOCKS[level];
      if (!b || img.style.display === 'none' || !img.complete || !img.naturalWidth) { cv.style.visibility = 'hidden'; return; }
      var W = box.clientWidth, H = box.clientHeight, dpr = window.devicePixelRatio || 1;
      var sw = Math.max(1, Math.round(W / b)), sh = Math.max(1, Math.round(H / b));
      // same crop as object-fit: cover
      var iw = img.naturalWidth, ih = img.naturalHeight, sx = 0, sy = 0, cw = iw, ch = ih;
      if (iw / ih > W / H) { cw = ih * W / H; sx = (iw - cw) / 2; } else { ch = iw * H / W; sy = (ih - ch) / 2; }
      small.width = sw; small.height = sh;
      small.getContext('2d').drawImage(img, sx, sy, cw, ch, 0, 0, sw, sh);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      var c = cv.getContext('2d');
      c.imageSmoothingEnabled = false;
      c.drawImage(small, 0, 0, sw, sh, 0, 0, cv.width, cv.height);
      cv.style.visibility = 'visible';
    }
    function goTo(t) {
      target = t; clearInterval(timer);
      if (reduce) { level = t; draw(); return; }
      timer = setInterval(function () {
        if (level === target) { clearInterval(timer); return; }
        level += level < target ? 1 : -1; draw();
      }, 70);
    }
    box.addEventListener('mouseenter', function () { goTo(PIXEL); });
    box.addEventListener('mouseleave', function () { goTo(CLEAR); });
    box.addEventListener('focus', function () { goTo(PIXEL); });
    box.addEventListener('blur', function () { goTo(CLEAR); });
    img.addEventListener('load', draw);
    slots.forEach(function (b) { b.addEventListener('click', function () { clearInterval(timer); level = target = CLEAR; draw(); }); });
    window.addEventListener('resize', draw);
    draw();
  })();

  // 4. Cursor trail: little stars follow the mouse (skipped on touch screens and reduced motion)
  if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
  var colors = ['#FFFFFF', '#94D6BF', '#FFE48A', '#9AA6DC'];
  var STAR = 'M0,-10 L2.9,-3.1 L9.5,-3.1 L4.3,1.2 L5.9,8.1 L0,4.2 L-5.9,8.1 L-4.3,1.2 L-9.5,-3.1 L-2.9,-3.1Z';
  var last = 0, lx = 0, ly = 0;
  window.addEventListener('mousemove', function (e) {
    var now = performance.now();
    var far = Math.abs(e.clientX - lx) + Math.abs(e.clientY - ly) > 14;
    if (now - last < 45 || !far) return;
    last = now; lx = e.clientX; ly = e.clientY;
    var c = colors[Math.floor(Math.random() * colors.length)];
    var s = document.createElement('div');
    s.className = 'trail';
    s.style.setProperty('--x', (e.clientX + 14 + Math.random() * 10) + 'px');
    s.style.setProperty('--y', (e.clientY + 18 + Math.random() * 10) + 'px');
    s.style.setProperty('--dx', (Math.random() * 24 - 12).toFixed(0) + 'px');
    s.innerHTML = '<svg viewBox="-12 -12 24 24" width="16" height="16" aria-hidden="true"><path d="' + STAR + '" fill="' + c + '" stroke="#6C78B8" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    document.body.appendChild(s);
    setTimeout(function () { s.remove(); }, 800);
  }, { passive: true });
})();
