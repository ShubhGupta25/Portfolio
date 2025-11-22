// app-moon.js
// Render a bright moon, scattered rays and moving clouds on a full-screen canvas.
// Simple 2D canvas implementation with layered parallax to simulate 3D.

(function(){
  // Respect reduced-motion
  try { if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch(e) {}

  // Use existing moon-canvas element from HTML (placed at start of body)
  const canvas = document.getElementById('moon-canvas');
  if (!canvas) {
    console.error('moon-canvas not found!');
    throw new Error('moon-canvas element not found in DOM');
  }
  
  // Ensure canvas has proper styling applied
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-100';
  canvas.style.pointerEvents = 'none';
  canvas.style.display = 'block';
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get canvas 2d context');
    throw new Error('Could not get canvas 2d context');
  }
  
  // Draw test color immediately to verify canvas is working
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle = '#0066ff';  // bright blue - unmissable
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.font = '24px Arial';
  ctx.fillText('CANVAS WORKING - MOON SHOULD APPEAR HERE', 50, 50);
  console.log('Test canvas render complete');

  let DPR = Math.max(1, window.devicePixelRatio || 1);
  let W = window.innerWidth, H = window.innerHeight;
  
  // Generate stars for background
  const stars = [];
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      brightness: Math.random() * 0.7 + 0.3
    });
  }
  
  function resize(){
    DPR = Math.max(1, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();
  
  console.log('Moon canvas initialized:', {
    canvas: canvas.id,
    width: W,
    height: H,
    dpr: DPR,
    zIndex: canvas.style.zIndex
  });

  // moon position (screen coords). Start centered-top-left area
  let moon = { x: W*0.75, y: H*0.22, r: Math.min(200, Math.max(80, Math.min(W,H)*0.12)), img: null };

  // try to load a local moon image from assets (recommended). User can place a public-domain
  // moon image at ./assets/moon.png or ./assets/moon.jpg or ./assets/moon.webp
  const MOON_SOURCES = ['./assets/moon.png', './assets/moon.jpg', './assets/moon.webp'];
  function loadMoonImage() {
    return new Promise((res) => {
      let i = 0;
      function tryNext(){
        if (i >= MOON_SOURCES.length) return res(null);
        const src = MOON_SOURCES[i++];
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => res(img);
        img.onerror = () => tryNext();
        img.src = src;
      }
      tryNext();
    });
  }

  // attempt to load moon texture (non-blocking)
  loadMoonImage().then((img) => {
    if (img) {
      moon.img = img;
      // scale moon radius to image size but clamp to viewport fraction
      const ideal = Math.min(img.naturalWidth, img.naturalHeight) * 0.35;
      moon.r = Math.min(Math.max(80, ideal), Math.min(W,H)*0.2);
    }
  }).catch(() => {});

  // pointer to create subtle parallax of moon and rays
  let pX = 0.5, pY = 0.5; // normalized 0..1
  window.addEventListener('pointermove', (e) => { pX = e.clientX / W; pY = e.clientY / H; }, { passive: true });

  // Clouds layer
  const CLOUD_LAYERS = 4;
  const clouds = [];
  for (let z=0; z<CLOUD_LAYERS; z++){
    const count = 4 + z*2;
    for (let i=0;i<count;i++){
      clouds.push({
        x: Math.random()*W,
        y: Math.random()*H*0.9,
        sx: 60 + Math.random()*220 + z*40,
        sy: 24 + Math.random()*80 + z*12,
        speed: 6 + Math.random()*20 + z*8,
        alpha: 0.22 + z*0.12 + Math.random()*0.12,
        z: z,
        phase: Math.random()*Math.PI*2
      });
    }
  }

  // Rays config
  const RAY_COUNT = 36;
  const rays = new Array(RAY_COUNT).fill(0).map((_,i)=>({
    angle: (i/RAY_COUNT) * Math.PI*2,
    width: 6 + Math.random()*10,
    length: (Math.max(W,H))*0.9 * (0.6 + Math.random()*0.6),
    speed: 0.001 + Math.random()*0.0025,
    phase: Math.random()*Math.PI*2
  }));

  function drawMoonGlow(){
    // large soft radial for overall moon light
    const g = ctx.createRadialGradient(moon.x, moon.y, 0, moon.x, moon.y, moon.r*6);
    g.addColorStop(0, 'rgba(255,255,245,0.95)');
    g.addColorStop(0.12, 'rgba(255,250,220,0.55)');
    g.addColorStop(0.28, 'rgba(255,240,200,0.12)');
    g.addColorStop(1, 'rgba(8,10,14,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);

    // If a moon image is available, draw it with soft edge and slight bloom overlay
    if (moon.img) {
      const img = moon.img;
      const drawR = moon.r;
      // draw subtle bloom under image
      const bloom = ctx.createRadialGradient(moon.x, moon.y, 0, moon.x, moon.y, drawR*1.8);
      bloom.addColorStop(0, 'rgba(255,250,230,0.18)');
      bloom.addColorStop(1, 'rgba(255,250,230,0)');
      ctx.fillStyle = bloom; ctx.beginPath(); ctx.arc(moon.x, moon.y, drawR*1.6, 0, Math.PI*2); ctx.fill();

      // draw image centered; scale to fit radius
      const scale = (drawR*2) / Math.max(img.naturalWidth, img.naturalHeight);
      const iw = img.naturalWidth * scale, ih = img.naturalHeight * scale;
      ctx.save();
      // circular clip to ensure edges are soft
      ctx.beginPath(); ctx.arc(moon.x, moon.y, drawR, 0, Math.PI*2); ctx.clip();
      ctx.drawImage(img, moon.x - iw/2, moon.y - ih/2, iw, ih);
      ctx.restore();

      // subtle top highlight
      const mg = ctx.createRadialGradient(moon.x - drawR*0.18, moon.y - drawR*0.12, drawR*0.04, moon.x, moon.y, drawR);
      mg.addColorStop(0, 'rgba(255,255,255,0.85)');
      mg.addColorStop(0.6, 'rgba(255,255,238,0.35)');
      mg.addColorStop(1, 'rgba(255,245,220,0.0)');
      ctx.beginPath(); ctx.fillStyle = mg; ctx.arc(moon.x, moon.y, drawR, 0, Math.PI*2); ctx.fill();
    } else {
      // moon disc (procedural)
      const mg = ctx.createRadialGradient(moon.x - moon.r*0.2, moon.y - moon.r*0.15, moon.r*0.1, moon.x, moon.y, moon.r);
      mg.addColorStop(0, 'rgba(255,255,255,1)');
      mg.addColorStop(0.6, 'rgba(255,255,238,0.95)');
      mg.addColorStop(1, 'rgba(255,245,220,0.0)');
      ctx.beginPath(); ctx.fillStyle = mg; ctx.arc(moon.x, moon.y, moon.r, 0, Math.PI*2); ctx.fill();
    }
  }

  function drawCloud(c, t){
    // cloud as multiple overlapping ellipses for soft look
    ctx.save();
    ctx.translate(c.x, c.y + Math.sin(t*0.001 + c.phase)*8);
    ctx.globalAlpha = c.alpha;
    ctx.fillStyle = 'rgba(6,8,12,0.96)';
    ctx.filter = 'blur(18px)';
    const parts = Math.max(3, Math.round(c.sx/40));
    for (let i=0;i<parts;i++){
      const rx = (i - parts/2) * (c.sx/parts*0.6) + Math.sin(t*0.0007 + i) * 8;
      const ry = (Math.cos(i) * c.sy*0.2);
      ctx.beginPath(); ctx.ellipse(rx, ry, c.sx*0.6, c.sy*0.6, Math.PI*0.12 * i, 0, Math.PI*2); ctx.fill();
    }
    ctx.filter = 'none';
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // main loop
  let last = performance.now();
  let frameCount = 0;
  function loop(now){
    frameCount++;
    const dt = now - last; last = now;
    // clear with subtle night tint (keep darker near edges)
    ctx.clearRect(0,0,W,H);
    // night base - slightly lighter to show canvas is rendering
    ctx.fillStyle = '#0a0d15'; 
    ctx.fillRect(0,0,W,H);
    
    if (frameCount === 1) {
      console.log('Moon loop started, canvas dims:', canvas.width, 'x', canvas.height, 'logical:', W, 'x', H);
    }

    // Draw stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      ctx.fillStyle = `rgba(255, 255, 255, ${s.brightness})`;
      ctx.fillRect(s.x, s.y, 1, 1);
    }

    // compute moon pos with pointer parallax
    const targetX = W * (0.72 + (pX-0.5) * 0.08);
    const targetY = H * (0.18 + (pY-0.5) * 0.06);
    moon.x += (targetX - moon.x) * 0.06;
    moon.y += (targetY - moon.y) * 0.06;

    // render glow and moon (clouds will naturally block some light)
    drawMoonGlow();

    // draw clouds front-to-back (higher z is farther, move faster)
    // clouds with larger z move faster and blur more
    for (let i=0;i<clouds.length;i++){
      const c = clouds[i];
      // parallax movement: cloud x shifts with time and pointer
      c.x += (c.speed * 0.02) * (1 + c.z*0.3) * (dt*0.06);
      c.x += (pX - 0.5) * (10 * (c.z+1));
      if (c.x > W + 220) c.x = -220 - Math.random()*200;
    }

    // draw darker overlay to simulate clouds blocking rays: draw clouds as dark shapes on top
    for (let i=clouds.length-1;i>=0;i--){ drawCloud(clouds[i], now); }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

})();
