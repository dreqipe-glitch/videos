/* Host character: an original flat-vector female gendarme, built once and shared by every insert.
   Heroine.mount(container, id) writes her SVG; Heroine.rig(tl, id) returns seek-safe actions that
   add tweens to a paused timeline at absolute times (seconds, local to that composition). */
(function () {
  const C = {
    skin: "#C98D67", skinShade: "#A9704F", skinLight: "#DDA582",
    hair: "#241914", hairLight: "#3A2A21",
    cap: "#61748E", capTop: "#7A8CA5", capShade: "#4E5F77",
    jacket: "#6A7D97", jacketShade: "#566881", jacketLight: "#8091AA",
    trousers: "#55667E", trousersShade: "#46556B",
    shirt: "#DCE4EE", tie: "#28324A",
    white: "#F3F1EA", whiteShade: "#CFCBC1",
    red: "#C1272D", gold: "#C9A227", goldLit: "#EBCB67",
    shoe: "#15181E", visor: "#171B23", line: "#18202D",
    lip: "#9A4B3D", mouthIn: "#5A2219", blush: "#E0907C",
  };
  const S = `stroke="${C.line}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;

  // hand variants, drawn pointing down (+y) from the wrist at 0,0
  function hands(p, side) {
    return `
    <g id="${p}-${side}hopen">
      <path d="M-15,-2 C-19,14 -16,30 -8,38 C-2,43 6,43 11,37 C17,29 19,14 15,-2 Z" fill="${C.skin}" ${S}/>
      <path d="M-14,8 C-24,14 -26,24 -20,28 C-15,30 -11,24 -9,18" fill="${C.skin}" ${S}/>
      <path d="M-5,26 L-5,38 M3,27 L3,40 M10,25 L10,35" stroke="${C.skinShade}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    </g>
    <g id="${p}-${side}hpoint" opacity="0">
      <rect x="-8" y="22" width="13" height="40" rx="6.5" fill="${C.skin}" ${S}/>
      <path d="M-16,-2 C-19,12 -17,26 -9,32 C-2,36 9,35 14,28 C18,20 18,8 15,-2 Z" fill="${C.skin}" ${S}/>
      <path d="M-15,8 C-22,14 -20,24 -13,24" fill="${C.skin}" ${S}/>
      <path d="M2,30 Q8,30 12,25" stroke="${C.skinShade}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </g>`;
  }

  function arm(p, side) {
    // side: "R" = her right arm (viewer's left), "L" = her left arm
    const mag = side === "R" ? `
        <g id="${p}-mag" opacity="0">
          <rect x="-7" y="10" width="14" height="60" rx="7" fill="#2B2F38" ${S}/>
          <rect x="-8" y="62" width="16" height="12" rx="3" fill="${C.gold}" ${S}/>
          <circle cx="0" cy="112" r="40" fill="rgba(170,205,235,0.22)" stroke="${C.line}" stroke-width="4"/>
          <circle cx="0" cy="112" r="40" fill="none" stroke="${C.gold}" stroke-width="9"/>
          <circle cx="0" cy="112" r="47" fill="none" stroke="${C.line}" stroke-width="3"/>
          <path d="M-18,96 Q-8,84 8,86" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.75"/>
        </g>` : "";
    return `
    <g id="${p}-arm${side}" transform="rotate(0)">
      <path d="M-24,-10 Q0,-26 24,-10 L20,116 Q0,126 -20,116 Z" fill="${C.jacket}" ${S}/>
      <path d="M${side === "R" ? "-14" : "14"},0 L${side === "R" ? "-12" : "12"},110" stroke="${C.jacketShade}" stroke-width="7" stroke-linecap="round" opacity="0.6"/>
      <g id="${p}-fore${side}" transform="translate(0,112) rotate(0)">
        <circle cx="0" cy="0" r="20" fill="${C.jacket}" ${S}/>
        <path d="M-19,0 L19,0 L16,96 L-16,96 Z" fill="${C.jacket}" ${S}/>
        <rect x="-18" y="84" width="36" height="16" rx="5" fill="${C.jacketShade}" ${S}/>
        <circle cx="${side === "R" ? "9" : "-9"}" cy="92" r="3" fill="${C.gold}"/>
        <g id="${p}-hand${side}" transform="translate(0,100) rotate(0)">
          ${mag}
          ${hands(p, side)}
        </g>
      </g>
    </g>`;
  }

  function svg(p) {
    return `
<svg viewBox="0 0 420 924" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <ellipse id="${p}-shadow" cx="210" cy="892" rx="128" ry="16" fill="#000" opacity="0.35"/>
  <g id="${p}-body" transform="translate(0,0) translate(210,880) scale(1,1) translate(-210,-880)">
    <!-- legs -->
    <g id="${p}-legL" transform="rotate(0 240 560)">
      <path d="M212,560 L268,560 L262,850 L218,850 Z" fill="${C.trousers}" ${S}/>
      <path d="M248,575 L246,846" stroke="${C.trousersShade}" stroke-width="6" opacity="0.7"/>
      <path d="M212,846 Q214,830 236,830 L262,830 Q290,834 296,858 Q298,872 284,874 L218,874 Q210,872 212,846 Z" fill="${C.shoe}" ${S}/>
      <path d="M230,838 Q256,834 280,846" stroke="#3A404C" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>
    <g id="${p}-legR" transform="rotate(0 180 560)">
      <path d="M152,560 L208,560 L202,850 L158,850 Z" fill="${C.trousers}" ${S}/>
      <path d="M172,575 L174,846" stroke="${C.trousersShade}" stroke-width="6" opacity="0.7"/>
      <path d="M208,846 Q206,830 184,830 L158,830 Q130,834 124,858 Q122,872 136,874 L202,874 Q210,872 208,846 Z" fill="${C.shoe}" ${S}/>
      <path d="M190,838 Q164,834 140,846" stroke="#3A404C" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>
    <!-- her left arm, behind the torso edge -->
    <g id="${p}-shL" transform="translate(292,312)">${arm(p, "L")}</g>
    <!-- torso -->
    <g id="${p}-torso" transform="translate(210,590) scale(1,1) translate(-210,-590)">
      <path d="M160,284 Q210,272 260,284 L298,302 Q308,312 306,336 L288,500 L292,584 Q210,598 128,584 L132,500 L114,336 Q112,312 122,302 Z" fill="${C.jacket}" ${S}/>
      <path d="M252,292 L296,306 Q304,316 302,336 L284,500 L288,580 Q262,586 240,588 Z" fill="${C.jacketShade}" opacity="0.55"/>
      <!-- shirt, tie, lapels -->
      <path d="M186,282 L210,350 L234,282 Q210,276 186,282 Z" fill="${C.shirt}" ${S}/>
      <path d="M204,300 L216,300 L220,348 L210,362 L200,348 Z" fill="${C.tie}" ${S}/>
      <path d="M182,280 L210,362 L176,330 L170,292 Z" fill="${C.jacketLight}" ${S}/>
      <path d="M238,280 L210,362 L244,330 L250,292 Z" fill="${C.jacketLight}" ${S}/>
      <!-- front placket and buttons -->
      <path d="M210,364 L210,584" stroke="${C.jacketShade}" stroke-width="4"/>
      <circle cx="222" cy="394" r="5.5" fill="${C.gold}" ${S}/>
      <circle cx="222" cy="446" r="5.5" fill="${C.gold}" ${S}/>
      <circle cx="222" cy="546" r="5.5" fill="${C.gold}" ${S}/>
      <!-- chest pockets -->
      <path d="M142,372 L190,372 L188,398 L144,398 Z" fill="${C.jacketLight}" ${S}/>
      <path d="M230,372 L278,372 L276,398 L232,398 Z" fill="${C.jacketLight}" ${S}/>
      <!-- simple gold badge (not the emblem) -->
      <circle cx="166" cy="352" r="11" fill="${C.gold}" ${S}/>
      <circle cx="166" cy="352" r="4.5" fill="${C.goldLit}"/>
      <!-- epaulettes -->
      <path d="M126,300 L170,290 L172,304 L130,316 Z" fill="${C.capShade}" ${S}/>
      <path d="M294,300 L250,290 L248,304 L290,316 Z" fill="${C.capShade}" ${S}/>
      <circle cx="160" cy="298" r="4" fill="${C.gold}"/><circle cx="260" cy="298" r="4" fill="${C.gold}"/>
      <!-- white cross strap and belt -->
      <path d="M248,288 L264,294 L156,500 L138,500 Z" fill="${C.white}" ${S}/>
      <rect x="128" y="490" width="164" height="26" rx="6" fill="${C.white}" ${S}/>
      <rect x="196" y="487" width="28" height="32" rx="5" fill="${C.gold}" ${S}/>
      <rect x="204" y="495" width="12" height="16" rx="2" fill="${C.goldLit}"/>
    </g>
    <!-- head: breath wrapper, then nod/tilt -->
    <g id="${p}-headB" transform="translate(0,0)">
    <g id="${p}-head" transform="translate(0,0) rotate(0 210 280)">
      <rect x="190" y="236" width="40" height="52" rx="12" fill="${C.skinShade}" ${S}/>
      <circle cx="276" cy="226" r="27" fill="${C.hair}" ${S}/>
      <path d="M262,214 Q276,206 290,214" stroke="${C.hairLight}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M144,170 Q140,120 210,112 Q280,120 276,170 L278,212 Q270,236 256,222 L162,222 Q150,236 142,212 Z" fill="${C.hair}" ${S}/>
      <ellipse cx="146" cy="196" rx="11" ry="17" fill="${C.skin}" ${S}/>
      <ellipse cx="274" cy="196" rx="11" ry="17" fill="${C.skin}" ${S}/>
      <path d="M152,160 C152,112 268,112 268,160 L268,186 C268,232 240,258 210,258 C180,258 152,232 152,186 Z" fill="${C.skin}" ${S}/>
      <path d="M238,240 C254,226 264,206 266,184" stroke="${C.skinShade}" stroke-width="7" fill="none" opacity="0.35" stroke-linecap="round"/>
      <!-- hair under the cap, swept back -->
      <path d="M154,166 Q170,146 196,150 Q176,156 166,180 Z" fill="${C.hair}"/>
      <path d="M266,166 Q250,146 224,150 Q244,156 254,180 Z" fill="${C.hair}"/>
      <ellipse cx="178" cy="222" rx="12" ry="8" fill="${C.blush}" opacity="0.32"/>
      <ellipse cx="242" cy="222" rx="12" ry="8" fill="${C.blush}" opacity="0.32"/>
      <g id="${p}-brows" transform="translate(0,0)">
        <path id="${p}-browR" d="M168,172 Q181,164 194,170" stroke="${C.hair}" stroke-width="6.5" fill="none" stroke-linecap="round"/>
        <path id="${p}-browL" d="M226,170 Q239,164 252,172" stroke="${C.hair}" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      </g>
      <g id="${p}-eyes">
        <g id="${p}-eyeR" transform="translate(182,194) scale(1,1) translate(-182,-194)"><ellipse cx="182" cy="194" rx="12" ry="9.5" fill="#FFFFFF" ${S} stroke-width="3"/><circle class="${p}-iris" cx="181" cy="195" r="7" fill="#2E1C13"/><circle cx="183.5" cy="192" r="2.4" fill="#FFF"/></g>
        <g id="${p}-eyeL" transform="translate(238,194) scale(1,1) translate(-238,-194)"><ellipse cx="238" cy="194" rx="12" ry="9.5" fill="#FFFFFF" ${S} stroke-width="3"/><circle class="${p}-iris" cx="237" cy="195" r="7" fill="#2E1C13"/><circle cx="239.5" cy="192" r="2.4" fill="#FFF"/></g>
        <path d="M168,188 Q182,180 196,188 M224,188 Q238,180 252,188" stroke="${C.line}" stroke-width="4" fill="none" stroke-linecap="round"/>
      </g>
      <path d="M209,202 Q205,216 208,222 Q212,225 216,222" stroke="${C.skinShade}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <g id="${p}-mouthSmile"><path d="M194,234 Q210,246 226,234" stroke="${C.lip}" stroke-width="4.5" fill="none" stroke-linecap="round"/></g>
      <g id="${p}-mouthOpen" opacity="0"><path d="M195,232 Q210,230 225,232 Q222,250 210,251 Q198,250 195,232 Z" fill="${C.mouthIn}" stroke="${C.lip}" stroke-width="3"/><path d="M201,244 Q210,240 219,244 Q214,250 210,250 Q205,250 201,244 Z" fill="#C4605A"/></g>
      <!-- kepi -->
      <g id="${p}-cap">
        <path d="M150,148 L144,74 Q210,56 276,74 L270,148 Z" fill="${C.cap}" ${S}/>
        <ellipse cx="210" cy="74" rx="66" ry="13" fill="${C.capTop}" ${S}/>
        <path d="M236,72 L262,76 L258,146 L244,148 Z" fill="${C.capShade}" opacity="0.5"/>
        <path d="M148,120 L272,120 L270,148 L150,148 Z" fill="${C.red}" ${S}/>
        <path d="M150,124 L270,124" stroke="${C.goldLit}" stroke-width="2.5" opacity="0.8"/>
        <circle cx="210" cy="104" r="9" fill="${C.gold}" ${S}/>
        <circle cx="210" cy="104" r="3.5" fill="${C.goldLit}"/>
        <path d="M144,148 Q210,136 276,148 Q268,170 210,172 Q152,170 144,148 Z" fill="${C.visor}" ${S}/>
        <path d="M162,156 Q210,150 258,156" stroke="#3B4252" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>
    </g>
    </g>
    <!-- her right arm, in front -->
    <g id="${p}-shR" transform="translate(128,312)">${arm(p, "R")}</g>
  </g>
</svg>`;
  }

  const POSES = {
    rest:    { uR: 9,   fR: -6,   uL: -9,  fL: 6 },
    mag:     { uR: 40,  fR: 120,  uL: -9,  fL: 6, hR: 10 },
    point:   { uR: 140, fR: -14,  uL: -9,  fL: 6, hand: "point" },
    pointL:  { uR: 98,  fR: -8,   uL: -9,  fL: 6, hand: "point" },
    salute:  { uR: 142, fR: 100,  uL: -9,  fL: 6, hR: 92 },
    wave:    { uR: 150, fR: 18,   uL: -9,  fL: 6, hR: 0 },
    heart:   { uR: -16, fR: -124, uL: -9,  fL: 6, hR: -60 },
    present: { uR: 20,  fR: -78,  uL: -20, fL: 78, hR: -20, hL: 20 },
    proud:   { uR: 6,   fR: -4,   uL: -6,  fL: 4 },
  };

  // deterministic hash for blink and talk spacing
  function hrand(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

  function rig(tl, p) {
    const el = (s) => document.getElementById(p + "-" + s);
    const st = { uR: 0, fR: 0, hR: 0, uL: 0, fL: 0, hL: 0, headY: 0, headA: 0, bodyY: 0, bodySx: 1, bodySy: 1, hand: "open" };
    const tf = {
      armR: (a) => `rotate(${a})`, armL: (a) => `rotate(${a})`,
      foreR: (a) => `translate(0,112) rotate(${a})`, foreL: (a) => `translate(0,112) rotate(${a})`,
      handR: (a) => `translate(0,100) rotate(${a})`, handL: (a) => `translate(0,100) rotate(${a})`,
      head: (y, a) => `translate(0,${y}) rotate(${a} 210 280)`,
      body: (y, sx, sy) => `translate(0,${y}) translate(210,880) scale(${sx},${sy}) translate(-210,-880)`,
      torso: (sx, sy) => `translate(210,590) scale(${sx},${sy}) translate(-210,-590)`,
      eye: (cx, s) => `translate(${cx},194) scale(1,${s}) translate(-${cx},-194)`,
    };
    const T = (id, str, t, dur, ease) => tl.to(el(id), { attr: { transform: str }, duration: dur, ease }, t);
    const body = (t, dur, ease, y, sx, sy) => {
      st.bodyY = y; st.bodySx = sx; st.bodySy = sy;
      T("body", tf.body(y, sx, sy), t, dur, ease);
    };
    const head = (t, dur, ease, y, a) => { st.headY = y; st.headA = a; T("head", tf.head(y, a), t, dur, ease); };

    const api = {
      pose(name, t, dur = 0.38, ease = "back.out(1.5)") {
        const q = POSES[name];
        // the upper arm leads, forearm and hand follow a beat later (follow-through)
        T("armR", tf.armR(q.uR), t, dur, ease);
        T("foreR", tf.foreR(q.fR), t + 0.05, dur, ease);
        T("handR", tf.handR(q.hR || 0), t + 0.09, dur, ease);
        T("armL", tf.armL(q.uL), t + 0.03, dur * 1.1, "power3.out");
        T("foreL", tf.foreL(q.fL), t + 0.08, dur * 1.1, "power3.out");
        T("handL", tf.handL(q.hL || 0), t + 0.1, dur * 1.1, "power3.out");
        Object.assign(st, { uR: q.uR, fR: q.fR, uL: q.uL, fL: q.fL });
        const h = q.hand || "open";
        if (h !== st.hand) {
          tl.set(el("Rhopen"), { opacity: h === "open" ? 1 : 0 }, t + dur * 0.35);
          tl.set(el("Rhpoint"), { opacity: h === "point" ? 1 : 0 }, t + dur * 0.35);
          st.hand = h;
        }
        return api;
      },
      set(name, t) { return api.pose(name, t, 0.001, "none"); },
      prop(on, t) { tl.set(el("mag"), { opacity: on ? 1 : 0 }, t); return api; },
      idle(t0, t1) {
        // breathing: torso swells, head and shoulders rise a little later
        for (let t = t0, i = 0; t < t1 - 0.2; t += 1.7, i++) {
          const d = Math.min(1.7, t1 - t), up = i % 2 === 0;
          T("torso", tf.torso(up ? 0.996 : 1, up ? 1.014 : 1), t, d, "sine.inOut");
          T("headB", `translate(0,${up ? -4 : 0})`, t + 0.12, d, "sine.inOut");
          T("shR", `translate(128,${up ? 308 : 312})`, t + 0.06, d, "sine.inOut");
          T("shL", `translate(292,${up ? 308 : 312})`, t + 0.08, d, "sine.inOut");
        }
        return api;
      },
      blinks(t0, t1, seed = 1) {
        let t = t0 + 0.5 + hrand(seed) * 1.2, k = 0;
        while (t < t1 - 0.25) {
          for (const [id, cx] of [["eyeR", 182], ["eyeL", 238]]) {
            T(id, tf.eye(cx, 0.08), t, 0.06, "power2.in");
            T(id, tf.eye(cx, 1), t + 0.09, 0.09, "power2.out");
          }
          t += 2 + hrand(seed * 31 + ++k) * 2;
        }
        return api;
      },
      talk(t0, t1) {
        let open = false;
        for (let t = t0, k = 0; t < t1 - 0.05; t += 0.1 + hrand(k++ + 7) * 0.08) {
          open = !open;
          tl.set(el("mouthOpen"), { opacity: open ? 1 : 0 }, t);
          tl.set(el("mouthSmile"), { opacity: open ? 0 : 1 }, t);
        }
        tl.set(el("mouthOpen"), { opacity: 0 }, t1);
        tl.set(el("mouthSmile"), { opacity: 1 }, t1);
        return api;
      },
      nod(t, n = 1) {
        const a = st.headA;
        for (let i = 0; i < n; i++) {
          head(t + i * 0.32, 0.12, "power2.in", 8, a + 4);
          head(t + i * 0.32 + 0.12, 0.2, "power2.out", 0, a);
        }
        return api;
      },
      tilt(t, deg, dur = 0.3) { head(t, dur, "back.out(2)", st.headY, deg); return api; },
      brow(t, hold = 0.9) {
        T("brows", "translate(0,-9)", t, 0.14, "back.out(3)");
        T("brows", "translate(0,0)", t + hold, 0.3, "power2.inOut");
        return api;
      },
      look(t, dx, dur = 0.2) { tl.to(document.querySelectorAll("." + p + "-iris"), { attr: { transform: `translate(${dx},0)` }, duration: dur, ease: "power2.out" }, t); return api; },
      wave(t0, t1) {
        let i = 0;
        for (let t = t0; t < t1 - 0.1; t += 0.22, i++) T("foreR", tf.foreR(i % 2 ? 4 : 36), t, 0.22, "sine.inOut");
        T("foreR", tf.foreR(POSES.wave.fR), t1, 0.18, "sine.out");
        return api;
      },
      walk(t0, t1) {
        // step cycle: legs swing in opposition, body bobs on each contact, free arm counter-swings
        const step = 0.27;
        let i = 0;
        for (let t = t0; t < t1 - 0.05; t += step, i++) {
          const s = i % 2 ? 1 : -1;
          T("legL", `rotate(${7 * s} 240 560)`, t, step, "sine.inOut");
          T("legR", `rotate(${-7 * s} 180 560)`, t, step, "sine.inOut");
          body(t, step / 2, "sine.out", -9, 1, 1);
          body(t + step / 2, step / 2, "sine.in", 0, 1, 1);
          T("armL", tf.armL(-9 + 7 * s), t, step, "sine.inOut");
        }
        T("legL", "rotate(0 240 560)", t1, 0.16, "power2.out");
        T("legR", "rotate(0 180 560)", t1, 0.16, "power2.out");
        T("armL", tf.armL(st.uL || -9), t1, 0.2, "power2.out");
        return api;
      },
      hop(t) {
        // landing: squash, stretch, settle
        body(t, 0.08, "power2.in", 0, 1.035, 0.95);
        body(t + 0.08, 0.12, "power2.out", 0, 0.99, 1.025);
        body(t + 0.2, 0.2, "sine.inOut", 0, 1, 1);
        return api;
      },
    };
    return api;
  }

  window.Heroine = {
    mount(sel, p) { document.querySelector(sel).innerHTML = svg(p); },
    rig,
  };
})();
