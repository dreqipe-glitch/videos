/* «سْلَاامْ سْلَاحْ» series intro: the page's female gendarme (same design as the explainer character), rigged for
   the ceremonial "Présentez armes" with a generic service rifle. Gendarme.svg(id) writes the layered SVG;
   Gendarme.solve(...) gives the joint angles that put each hand exactly on the rifle (two-bone IK). */
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
    <g id="${p}-${side}hgrip" opacity="0">
      <path d="M-17,-1 C-21,12 -19,30 -8,39 C0,43 12,41 17,31 C21,20 19,8 15,-1 Z" fill="${C.skin}" ${S}/>
      <path d="M-13,15 Q0,11 13,15 M-13,25 Q0,21 13,25" stroke="${C.skinShade}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M-17,10 C-24,14 -24,24 -16,27" fill="${C.skin}" ${S}/>
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
    const mag = "";
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

  // rifle in local units: muzzle at y −206, butt plate at +235; grips: handguard −100/−90, stock wrist +58
  function rifle(p) {
    const steel = "#2B3039", wood = "#8A5A34", woodDark = "#6E4426", sling = "#F3F1EA";
    return `
      <path d="M12,-140 Q30,30 14,196" stroke="${C.line}" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M12,-140 Q30,30 14,196" stroke="${sling}" stroke-width="5.5" fill="none" stroke-linecap="round"/>
      <rect x="-4" y="-198" width="8" height="56" rx="2" fill="${steel}" ${S}/>
      <rect x="-3" y="-206" width="6" height="11" rx="1.5" fill="${steel}"/>
      <path d="M-11,-152 L11,-152 L12,-8 L-12,-8 Z" fill="${wood}" ${S}/>
      <path d="M-4,-140 L-4,-20 M5,-130 L5,-40" stroke="${woodDark}" stroke-width="2.5" opacity="0.6"/>
      <rect x="-13" y="-150" width="26" height="9" rx="2" fill="${steel}" ${S} stroke-width="2.5"/>
      <rect x="-13" y="-98" width="26" height="9" rx="2" fill="${steel}" ${S} stroke-width="2.5"/>
      <rect x="-12" y="-12" width="24" height="70" rx="4" fill="#3A404A" ${S}/>
      <circle cx="17" cy="12" r="5.5" fill="${steel}" ${S} stroke-width="2.5"/>
      <path d="M3,56 Q16,60 14,84 Q6,92 1,84" stroke="${C.line}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M-9,54 L9,54 L11,110 L-11,110 Z" fill="${wood}" ${S}/>
      <path d="M-11,106 L11,106 L23,226 Q0,236 -23,226 Z" fill="${wood}" ${S}/>
      <path d="M4,112 L14,224" stroke="${woodDark}" stroke-width="5" opacity="0.5" stroke-linecap="round"/>
      <rect x="-24" y="224" width="48" height="11" rx="3" fill="${steel}" ${S}/>
      <circle cx="12" cy="-140" r="3.5" fill="${steel}"/><circle cx="14" cy="196" r="3.5" fill="${steel}"/>`;
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
    <!-- ceremonial rifle (generic, simplified), drawn vertical around its centre, under both arms -->
    <g id="${p}-rifleGhost2" opacity="0" transform="translate(98,637) rotate(0)">${rifle(p + "g2")}</g>
    <g id="${p}-rifleGhost1" opacity="0" transform="translate(98,637) rotate(0)">${rifle(p + "g1")}</g>
    <g id="${p}-rifle" transform="translate(98,637) rotate(0)">${rifle(p)}</g>
    <!-- arms in front: her left arm, then her right arm -->
    <g id="${p}-shL" transform="translate(292,312)">${arm(p, "L")}</g>
    <g id="${p}-shR" transform="translate(128,312)">${arm(p, "R")}</g>
  </g>
</svg>`;
  }

  // two-bone IK: shoulder S, target T (where the grip centre must land), upper a, forearm+grip b, elbowOut ±1
  function solve(S, T, a, b, elbowOut) {
    const dx = T[0] - S[0], dy = T[1] - S[1];
    const d = Math.min(Math.hypot(dx, dy), a + b - 0.5);
    const deg = (r) => (r * 180) / Math.PI;
    const phi = Math.atan2(-dx, dy); // angle that maps the arm's local "down" onto the target direction
    const alpha = Math.acos(Math.max(-1, Math.min(1, (a * a + d * d - b * b) / (2 * a * d))));
    let best = null;
    for (const sgn of [1, -1]) {
      const tu = phi + sgn * alpha;
      const E = [S[0] - a * Math.sin(tu), S[1] + a * Math.cos(tu)];
      const tf = Math.atan2(-(T[0] - E[0]), T[1] - E[1]);
      const cand = { up: deg(tu), fore: deg(tf - tu), ex: E[0] };
      if (!best || (elbowOut < 0 ? cand.ex < best.ex : cand.ex > best.ex)) best = cand;
    }
    return best;
  }

  window.Gendarme = { svg, solve, C };
})();
