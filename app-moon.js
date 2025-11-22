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

  let DPR = Math.min(2, Math.max(1, window.devicePixelRatio || 1)); // cap at 2x for performance
  let W = window.innerWidth, H = window.innerHeight;
  
  // Generate stars for background (reduced from 300 to 150 for performance)
  const stars = [];
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      brightness: Math.random() * 0.8 + 0.2,
      size: Math.random() * 1.5,
      blinkPhase: Math.random() * Math.PI * 2,
      blinkSpeed: 0.002 + Math.random() * 0.003
    });
  }
  
  // Shooting stars
  const shootingStars = [];
  for (let i = 0; i < 3; i++) {
    shootingStars.push({
      x: Math.random() * W,
      y: Math.random() * H * 0.5,
      vx: 2 + Math.random() * 3,
      vy: 0.5 + Math.random() * 1.5,
      brightness: 0.8,
      trail: 40,
      active: true,
      spawnTime: Math.random() * 10000
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

  // pointer to create subtle parallax of moon and rays (throttle to every 2-3 frames)
  let pX = 0.5, pY = 0.5; // normalized 0..1
  let lastPointerUpdate = 0;
  window.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - lastPointerUpdate > 50) { // throttle: update every 50ms
      pX = e.clientX / W;
      pY = e.clientY / H;
      lastPointerUpdate = now;
    }
  }, { passive: true });

  // Clouds layer (reduced from 4 to 2 layers for performance)
  const CLOUD_LAYERS = 2;
  const clouds = [];
  for (let z=0; z<CLOUD_LAYERS; z++){
    const count = 3 + z*1; // reduced count
    for (let i=0;i<count;i++){
      clouds.push({
        x: Math.random()*W,
        y: Math.random()*H*0.9,
        sx: 60 + Math.random()*220 + z*40,
        sy: 24 + Math.random()*80 + z*12,
        speed: 1.5 + Math.random()*3 + z*0.8,
        alpha: 0.22 + z*0.12 + Math.random()*0.12,
        z: z,
        phase: Math.random()*Math.PI*2
      });
    }
  }

  // Ambient glow blobs scattered across the viewport to make glow even
  const AMBIENT_COUNT = 10;
  const ambientBlobs = [];
  for (let i = 0; i < AMBIENT_COUNT; i++) {
    const sizeFactor = 0.25 + Math.random() * 0.7; // relative to max dimension
    ambientBlobs.push({
      rx: Math.random(), // relative x (0..1)
      ry: Math.random() * 0.95, // relative y
      sizeFactor: sizeFactor,
      offsetAmpFactor: 0.02 + Math.random() * 0.06, // fraction of screen for subtle motion
      intensity: 0.015 + Math.random() * 0.06,
      speed: 0.00015 + Math.random() * 0.0006,
      phase: Math.random() * Math.PI * 2,
      x: 0,
      y: 0,
      r: 0
    });
  }

  // Rays config (kept but will not be used for bright radial rays)
  const RAY_COUNT = 36;
  const rays = new Array(RAY_COUNT).fill(0).map((_,i)=>({
    angle: (i/RAY_COUNT) * Math.PI*2,
    width: 6 + Math.random()*10,
    length: (Math.max(W,H))*0.9 * (0.6 + Math.random()*0.6),
    speed: 0.001 + Math.random()*0.0025,
    phase: Math.random()*Math.PI*2
  }));

  function drawMoonGlow(){
    // More natural moon glow - softer and more gradual
    const g = ctx.createRadialGradient(moon.x, moon.y, 0, moon.x, moon.y, moon.r*8);
    g.addColorStop(0, 'rgba(255,255,245,0.65)');
    g.addColorStop(0.08, 'rgba(255,250,220,0.35)');
    g.addColorStop(0.18, 'rgba(255,240,180,0.08)');
    g.addColorStop(0.35, 'rgba(200,200,180,0.02)');
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
    // cloud as multiple overlapping ellipses for soft look (reduced complexity)
    ctx.save();
    ctx.translate(c.x, c.y + Math.sin(t*0.001 + c.phase)*8);
    ctx.globalAlpha = c.alpha;
    ctx.fillStyle = 'rgba(6,8,12,0.96)';
    // Use smaller blur for performance
    ctx.filter = 'blur(10px)';
    const parts = 2 + Math.floor(c.sx / 80); // reduced from original calculation
    for (let i=0;i<parts;i++){
      const rx = (i - parts/2) * (c.sx/parts*0.6);
      const ry = (Math.cos(i) * c.sy*0.2);
      ctx.beginPath(); ctx.ellipse(rx, ry, c.sx*0.5, c.sy*0.5, Math.PI*0.08 * i, 0, Math.PI*2); ctx.fill();
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

    // Draw stars with blinking animation
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      // Update blink phase and compute brightness modulation
      s.blinkPhase += s.blinkSpeed;
      const blinkMod = (Math.sin(s.blinkPhase) + 1) * 0.5; // 0..1 sine wave
      const modulatedBrightness = s.brightness * (0.2 + blinkMod * 0.8); // fade between 20% and 100%
      ctx.fillStyle = `rgba(255, 255, 255, ${modulatedBrightness})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Update and draw shooting stars
    for (let i = 0; i < shootingStars.length; i++) {
      const ss = shootingStars[i];
      if (now - ss.spawnTime > 5000) {
        ss.spawnTime = now + 8000 + Math.random() * 6000;
        ss.x = Math.random() * W;
        ss.y = Math.random() * H * 0.5;
        ss.active = true;
      }
      
      if (ss.active) {
        ss.x += ss.vx;
        ss.y += ss.vy;
        
        if (ss.x > W + 100 || ss.y > H) {
          ss.active = false;
        } else {
          // Draw shooting star trail
          ctx.save();
          ctx.globalAlpha = ss.brightness * 0.6;
          const trailGrad = ctx.createLinearGradient(ss.x - ss.vx * ss.trail, ss.y - ss.vy * ss.trail, ss.x, ss.y);
          trailGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          trailGrad.addColorStop(0.5, 'rgba(200, 220, 255, 0.3)');
          trailGrad.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
          ctx.strokeStyle = trailGrad;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(ss.x - ss.vx * ss.trail, ss.y - ss.vy * ss.trail);
          ctx.lineTo(ss.x, ss.y);
          ctx.stroke();
          
          // Draw bright core
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
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
