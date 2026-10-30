/* Shared helpers for the «سْلَاامْ سْلَاحْ» explainer package: line icons, zellige texture and the
   scene shell (background drift, grain, camera push, entry and exit flashes). Seek-safe: every
   change is a tween or set on the composition's paused timeline. */
(function () {
  const F = (n) => n / 30;
  function hrand(n) { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); }

  const ICONS = {
    person: `<circle cx="60" cy="36" r="17"/><path d="M24,104 C24,78 40,62 60,62 C80,62 96,78 96,104"/>`,
    woman: `<circle cx="60" cy="38" r="16"/><path d="M42,44 C38,20 82,20 78,44 C80,56 84,62 90,66"/><path d="M42,44 C40,56 36,62 30,66"/><path d="M26,104 C28,82 42,68 60,68 C78,68 92,82 94,104"/>`,
    officer: `<circle cx="60" cy="44" r="15"/><path d="M40,30 L44,14 Q60,9 76,14 L80,30 Z"/><path d="M36,31 L84,31"/><path d="M22,104 C22,80 40,66 60,66 C80,66 98,80 98,104"/><path d="M60,66 L60,104"/><circle cx="46" cy="82" r="3"/>`,
    magnifier: `<circle cx="50" cy="50" r="30"/><path d="M72,72 L100,100" stroke-width="12"/><path d="M36,40 Q42,30 52,30" stroke-width="5"/>`,
    scales: `<circle cx="60" cy="18" r="6"/><path d="M60,24 L60,98"/><path d="M38,102 L82,102"/><path d="M20,36 L100,36"/><path d="M20,36 L8,70 M20,36 L32,70"/><path d="M6,70 Q20,86 34,70 Z"/><path d="M100,36 L88,70 M100,36 L112,70"/><path d="M86,70 Q100,86 114,70 Z"/>`,
    document: `<path d="M30,12 L74,12 L92,30 L92,108 L30,108 Z"/><path d="M74,12 L74,30 L92,30"/><path d="M44,52 L78,52 M44,68 L78,68 M44,84 L66,84"/>`,
    shield: `<path d="M60,12 L98,26 L98,56 C98,82 82,98 60,108 C38,98 22,82 22,56 L22,26 Z"/><path d="M42,58 L55,71 L80,45"/>`,
    hearthand: `<path d="M60,58 C54,44 34,44 34,60 C34,72 60,86 60,86 C60,86 86,72 86,60 C86,44 66,44 60,58 Z"/><path d="M12,96 L36,96 C44,96 50,104 60,104 L94,104 C102,104 102,94 94,93 L68,91"/><path d="M36,96 C42,90 52,90 60,92"/>`,
    comment: `<path d="M18,22 L102,22 Q110,22 110,30 L110,78 Q110,86 102,86 L52,86 L30,104 L32,86 L18,86 Q10,86 10,78 L10,30 Q10,22 18,22 Z"/>`,
    share: `<path d="M60,74 L60,16"/><path d="M38,38 L60,16 L82,38"/><path d="M30,56 L22,56 L22,104 L98,104 L98,56 L90,56"/>`,
    follow: `<circle cx="48" cy="36" r="16"/><path d="M14,102 C14,78 30,62 48,62 C60,62 70,68 76,78"/><path d="M92,62 L92,98 M74,80 L110,80"/>`,
    check: `<path d="M28,62 L50,84 L94,38"/>`,
    cross: `<path d="M34,34 L86,86 M86,34 L34,86"/>`,
    arrowL: `<path d="M104,60 L18,60"/><path d="M44,34 L18,60 L44,86"/>`,
  };
  function icon(name, extra = "") {
    return `<svg viewBox="0 0 120 120" class="ico" ${extra}>${ICONS[name]}</svg>`;
  }

  // eight-point star lattice, the zellige motif, as a repeating SVG pattern
  function zellige(id) {
    const star = (cx, cy, r) => {
      const pts = [];
      for (let i = 0; i < 16; i++) {
        const a = (Math.PI / 8) * i - Math.PI / 2, rr = i % 2 ? r * 0.62 : r;
        pts.push((cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1));
      }
      return `<polygon points="${pts.join(" ")}"/>`;
    };
    return `<svg class="pkg-zellige" id="${id}" xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="${id}-pat" width="180" height="180" patternUnits="userSpaceOnUse">
        <g fill="none" stroke="#E9CB62" stroke-width="2.2">
          ${star(90, 90, 52)}
          <rect x="62" y="62" width="56" height="56" transform="rotate(45 90 90)"/>
          <rect x="62" y="62" width="56" height="56"/>
          <path d="M0,0 L38,38 M180,0 L142,38 M0,180 L38,142 M180,180 L142,142"/>
          <path d="M90,0 L90,38 M90,180 L90,142 M0,90 L38,90 M180,90 L142,90"/>
          ${star(0, 0, 26)}${star(180, 0, 26)}${star(0, 180, 26)}${star(180, 180, 26)}
        </g></pattern></defs>
      <rect width="100%" height="100%" fill="url(#${id}-pat)"/></svg>`;
  }

  /* Scene shell. Expects, inside the scene: #p-bg, #p-zelhost, #p-cam, #p-grain, #p-in, #p-out (optional), #p-flash.
     dur: scene length in seconds. exit: false for the last insert, which holds to the final frame. */
  function shell(tl, p, dur, { exit = true } = {}) {
    const $ = (s) => document.getElementById(p + "-" + s);
    $("zelhost").innerHTML = zellige(p + "-zel");
    const exitAt = dur - F(7);

    // slow drift: background, texture and graphics move at different rates (parallax)
    tl.fromTo($("bg"), { scale: 1, x: 0 }, { scale: 1.05, x: -18, duration: dur, ease: "none" }, 0);
    tl.fromTo("#" + p + "-zel", { x: 0, y: 0, rotation: 0 }, { x: -110, y: -170, rotation: 2.5, duration: dur, ease: "none" }, 0);

    // grain: the noise tile jumps to a new seeded offset every other frame
    const n = Math.ceil(dur * 15);
    for (let i = 0; i <= n; i++)
      tl.set($("grain"), { x: -Math.floor(hrand(i + p.length * 97) * 320), y: -Math.floor(hrand(i * 3.1 + 5) * 320) }, i / 15);

    // entry: out of the previous footage frame with a zoom-blur and a warm flash
    tl.set($("in"), { opacity: 1 }, 0);
    tl.fromTo($("in"), { scale: 1.03, filter: "blur(2px)" }, { scale: 1.16, filter: "blur(20px)", duration: F(4), ease: "expo.in" }, 0);
    tl.to($("in"), { opacity: 0, duration: F(2), ease: "none" }, F(3));
    tl.fromTo($("flash"), { opacity: 0.25 }, { opacity: 0.92, duration: F(2), ease: "power2.in" }, 0);
    tl.to($("flash"), { opacity: 0, duration: F(6), ease: "power2.out" }, F(2));
    tl.fromTo($("cam"), { scale: 1.24, filter: "blur(16px)" }, { scale: 1.03, filter: "blur(0px)", duration: F(8), ease: "expo.out" }, F(1));
    // constant slow push-in
    tl.fromTo($("cam"), { scale: 1.03 }, { scale: 1.08, duration: (exit ? exitAt : dur) - F(9), ease: "none", immediateRender: false }, F(9));

    if (exit) {
      // exit: whip up into a flash, landing on the next footage frame
      tl.to($("cam"), { scale: 1.26, y: -90, filter: "blur(18px)", duration: F(6), ease: "expo.in" }, exitAt);
      tl.fromTo($("flash"), { opacity: 0 }, { opacity: 0.88, duration: F(5), ease: "power2.in", immediateRender: false }, exitAt);
      tl.set($("out"), { opacity: 1 }, dur - F(2));
      tl.fromTo($("out"), { scale: 1.14, filter: "blur(14px)" }, { scale: 1.015, filter: "blur(2px)", duration: F(2), ease: "expo.out", immediateRender: false }, dur - F(2));
      tl.to($("flash"), { opacity: 0.08, duration: F(2), ease: "power2.out" }, dur - F(2));
    }
  }

  // a gold light band crossing an element (the "search" motif)
  function sweep(tl, el, t, dur = 0.6) {
    tl.fromTo(el, { xPercent: 0, opacity: 1 }, { xPercent: 470, duration: dur, ease: "power2.inOut", immediateRender: false }, t);
    tl.set(el, { opacity: 0 }, t + dur);
  }

  // word reveal for Arabic: whole words only, so letter joining is never broken
  function revealWord(tl, el, t, { dy = 40, blur = 10, dur = 0.34, ease = "expo.out" } = {}) {
    tl.fromTo(el, { opacity: 0, y: dy, filter: `blur(${blur}px)` }, { opacity: 1, y: 0, filter: "blur(0px)", duration: dur, ease }, t);
  }

  window.Pkg = { F, hrand, icon, shell, sweep, revealWord };
  // icons are written as <span data-icon="name"> placeholders in each scene
  window.Pkg.mountIcons = (root) => root.querySelectorAll("[data-icon]").forEach((n) => { n.innerHTML = icon(n.dataset.icon); });
})();
