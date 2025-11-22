// app-glow.js
// Animates the `.glow` element in a 3D zig-zag pattern between sections.
// Respects `prefers-reduced-motion` and gracefully no-ops if not present.

 (function(){
  const REDUCE = (() => { try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e) { return false; } })();
  if (REDUCE) return; // no motion for accessibility

  const glow = document.querySelector('#glow');
  if (!glow) return;

  let winW = window.innerWidth, winH = window.innerHeight;
  function onResize(){ winW = window.innerWidth; winH = window.innerHeight; }
  window.addEventListener('resize', onResize, { passive: true });

  // config
  const ENTRY_DURATION = 600; // ms for entry tween
  const Z_DEPTH_CLOSE = -60; // near start z
  const Z_DEPTH_FAR = -420; // farthest z for random moves
  const PERSPECTIVE = 1100;

  // state (centered coordinates: 0,0 is viewport center)
  let state = { x: 0, y: 0, z: Z_DEPTH_CLOSE, rotY: 0, rotX: 0 };
  // entry tween
  let entryFrom = null, entryTo = null, entryStart = 0, entryDur = ENTRY_DURATION;
  let lastTime = performance.now();

  // center glow initially
  state.x = 0; state.y = 0; state.z = Z_DEPTH_CLOSE; state.rotY = 0; state.rotX = 0;
  glow.style.transform = `perspective(${PERSPECTIVE}px) translate3d(0px, 0px, ${state.z}px)`;

  function lerp(a,b,t){ return a + (b-a) * t; }

  // Note: scroll-triggered random movement removed — glow will follow pointer only.

  // pointer movement: make glow follow the mouse (live) with smoothing
  let pointerX = 0, pointerY = 0;
  let pointerTarget = { x: 0, y: 0, z: null };
  let pointerActive = false;
  let lastPointerAt = 0;
  const POINTER_TIMEOUT = 900; // ms to consider pointer active after last move
  window.addEventListener('pointermove', (e) => {
    lastPointerAt = performance.now();
    pointerActive = true;
    // convert client coords to centered coords (px)
    const cx = e.clientX - winW/2;
    const cy = e.clientY - winH/2;
    // set pointer target with slight z based on distance from center
    const dist = Math.sqrt(cx*cx + cy*cy);
    const maxDist = Math.sqrt((winW/2)*(winW/2) + (winH/2)*(winH/2));
    const z = lerp(Z_DEPTH_CLOSE, Z_DEPTH_FAR, Math.min(1, dist / maxDist));
    pointerTarget.x = cx; pointerTarget.y = cy; pointerTarget.z = z;
  }, { passive: true });

  function tick(now){
    const dt = Math.min(40, now - lastTime) / 1000; lastTime = now;

      // pointer-driven or idle behavior
      {
      const t = now / 1000;
      // if pointer was active recently, follow pointerTarget smoothly
      if (pointerActive && (now - lastPointerAt) < POINTER_TIMEOUT) {
        // lerp towards pointer target
        state.x += (pointerTarget.x - state.x) * Math.min(1, dt * 10);
        state.y += (pointerTarget.y - state.y) * Math.min(1, dt * 10);
        state.z += (pointerTarget.z - state.z) * Math.min(1, dt * 6);
        // rotations based on pointer offset
        state.rotY += (((pointerTarget.x / Math.max(1, winW/2)) * 0.24) - state.rotY) * Math.min(1, dt * 8);
        state.rotX += (((-pointerTarget.y / Math.max(1, winH/2)) * 0.12) - state.rotX) * Math.min(1, dt * 8);
      } else {
        // gentle idle drift when no pointer
        const idleX = Math.sin(t * 0.6) * 8;
        const idleY = Math.cos(t * 0.5) * 6;
        state.x += (idleX - state.x) * Math.min(1, dt * 0.9);
        state.y += (idleY - state.y) * Math.min(1, dt * 0.9);
        state.z += ((Z_DEPTH_CLOSE + Math.sin(t * 0.4) * 10) - state.z) * Math.min(1, dt * 0.6);
        state.rotY += ((Math.sin(t*0.2) * 0.08) - state.rotY) * Math.min(1, dt * 2);
        state.rotX += ((Math.cos(t*0.3) * 0.04) - state.rotX) * Math.min(1, dt * 2);
      }
      // deactivate pointer if timeout passed
      if ((now - lastPointerAt) >= POINTER_TIMEOUT) pointerActive = false;
    }

    const tx = Math.round(state.x);
    const ty = Math.round(state.y);
    const tz = Math.round(state.z);
    const rY = state.rotY.toFixed(4);
    const rX = state.rotX.toFixed(4);
    glow.style.transform = `perspective(${PERSPECTIVE}px) translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${rY}rad) rotateX(${rX}rad)`;

    requestAnimationFrame(tick);
  }

  // start centered and ready
  glow.style.transform = `perspective(${PERSPECTIVE}px) translate3d(0px, 0px, ${Z_DEPTH_CLOSE}px)`;
  requestAnimationFrame((t)=>{ lastTime = t; requestAnimationFrame(tick); });

  // public API
  window.__glow3d = {
    recompute: () => { winW = window.innerWidth; winH = window.innerHeight; },
    triggerRandom: () => { startTweenTo(randomTarget()); }
  };
})();
