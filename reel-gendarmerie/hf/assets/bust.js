/* Female gendarme bust icon for the intro (head and shoulders, front view), drawn once in three treatments:
   "flat" (geometric, solid fills), "duo" (pink + off-white on navy), "soft" (gradients and soft shadows).
   Bust.svg(style, id) returns an SVG string, viewBox 600 × 660. The cap badge is a simple dot, not the emblem. */
(function () {
  const PAL = {
    flat: {
      jacket: "#5D7190", jacketShade: "#4F6280", lapel: "#6B809F", shirt: "#DCE6F2", tie: "#1B2436", strap: "#F1EEE7", strapShade: "#D9D4C9",
      epaulette: "#26324A", button: "#D9DEE6",
      skin: "#D59C77", skinShade: "#BF8462", neck: "#B97F5D", ear: "#CC9370", blush: "#E39A88",
      hair: "#2A1C15", hairLight: "#3D2A20", brow: "#3A271E", eye: "#24170F", lip: "#B65A54", lipLow: "#C76A62",
      crown: "#5D7190", crownTop: "#7084A3", crownShade: "#4F6280", band: "#C1272D", bandShade: "#A31F25",
      visor: "#141A25", visorEdge: "#2C3546", badge: "#FF95A5", badgeRing: "#D9DEE6", badgeIn: "#FFC4CD",
    },
    duo: {
      jacket: "#FF95A5", jacketShade: "#F2849A", lapel: "#E5677D", shirt: "#F4F1EA", tie: "#0B1320", strap: "#F4F1EA", strapShade: "#F4F1EA",
      epaulette: "#E5677D", button: "#F4F1EA",
      skin: "#F4F1EA", skinShade: "#E6DED0", neck: "#E0D7C7", ear: "#ECE6DA", blush: "#FFC4CD",
      hair: "#1B2740", hairLight: "#26365A", brow: "#0B1320", eye: "#0B1320", lip: "#0B1320", lipLow: "#0B1320",
      crown: "#FF95A5", crownTop: "#FFC4CD", crownShade: "#F2849A", band: "#F4F1EA", bandShade: "#E6DED0",
      visor: "#0B1320", visorEdge: "#FF95A5", badge: "#0B1320", badgeRing: "#F4F1EA", badgeIn: "#FF95A5",
    },
  };
  PAL.soft = PAL.flat;

  function svg(style, id) {
    const c = PAL[style];
    const soft = style === "soft";
    const g = (name, a, b, x2 = 0.35, y2 = 1) => soft
      ? `<linearGradient id="${id}-${name}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`
      : "";
    const f = (name, flat) => (soft ? `url(#${id}-${name})` : flat);
    const defs = soft ? `<defs>
      ${g("jacket", "#7A90B2", "#3F5070")}
      ${g("lapel", "#7D93B3", "#5E7393")}
      ${g("crown", "#8094B3", "#44567A", 0.3, 1)}
      ${g("crownTop", "#93A6C2", "#6F84A3", 0, 1)}
      ${g("band", "#D8343A", "#A51F25", 0, 1)}
      ${g("visor", "#2A3344", "#0E131C", 0, 1)}
      ${g("skin", "#EAB792", "#BE8160", 0.5, 1)}
      ${g("neck", "#BC8360", "#A26C4D", 0, 1)}
      ${g("hair", "#43301F", "#1E140E", 0.3, 1)}
      ${g("strap", "#FFFFFF", "#DAD5CB", 0.5, 1)}
      ${g("shirt", "#EEF3F9", "#C9D6E6", 0, 1)}
      <radialGradient id="${id}-badge" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#FFE1E6"/><stop offset="0.6" stop-color="#FF95A5"/><stop offset="1" stop-color="#E5677D"/></radialGradient>
      <filter id="${id}-sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#05080F" flood-opacity="0.45"/></filter>
      <filter id="${id}-blur" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
      <filter id="${id}-sh2" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#05080F" flood-opacity="0.35"/></filter>
    </defs>` : "";
    const sh = soft ? `filter="url(#${id}-sh)"` : "";
    const sh2 = soft ? `filter="url(#${id}-sh2)"` : "";
    return `<svg viewBox="0 0 600 660" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}
  <g id="${id}-shoulders">
    <path d="M44,660 C44,566 96,504 178,480 L258,444 L300,504 L342,444 L422,480 C504,504 556,566 556,660 Z" fill="${f("jacket", c.jacket)}"/>
    <path d="M342,444 L422,480 C504,504 556,566 556,660 L410,660 C420,590 400,520 342,444 Z" fill="${c.jacketShade}" opacity="${soft ? 0.35 : 0.55}"/>
    <path d="M258,444 L300,532 L342,444 L326,432 L300,482 L274,432 Z" fill="${f("shirt", c.shirt)}"/>
    <path d="M291,482 L309,482 L316,552 L300,582 L284,552 Z" fill="${c.tie}"/>
    <path d="M258,444 L300,532 L276,594 L220,476 Z" fill="${f("lapel", c.lapel)}"/>
    <path d="M342,444 L300,532 L324,594 L380,476 Z" fill="${f("lapel", c.lapel)}"/>
    <path d="M152,496 L236,462 L244,482 L162,516 Z" fill="${c.epaulette}"/>
    <path d="M448,496 L364,462 L356,482 L438,516 Z" fill="${c.epaulette}"/>
    <circle cx="228" cy="474" r="5.5" fill="${c.button}"/><circle cx="372" cy="474" r="5.5" fill="${c.button}"/>
    <path d="M392,470 L420,482 L248,660 L208,660 Z" fill="${f("strap", c.strap)}" ${sh2}/>
    <path d="M406,478 L420,482 L248,660 L230,660 Z" fill="${c.strapShade}" opacity="${style === "duo" ? 0 : 0.6}"/>
  </g>
  <g id="${id}-headg" ${sh}>
    <ellipse cx="394" cy="356" rx="42" ry="40" fill="${f("hair", c.hair)}"/>
    <path d="M378,334 Q396,326 414,336" stroke="${c.hairLight}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M196,250 C190,300 196,350 214,384 L386,384 C404,350 410,300 404,250 Z" fill="${f("hair", c.hair)}"/>
    <path d="M264,380 L264,452 C264,470 336,470 336,452 L336,380 Z" fill="${f("neck", c.neck)}"/>
    <ellipse cx="210" cy="318" rx="15" ry="25" fill="${c.ear}"/><ellipse cx="390" cy="318" rx="15" ry="25" fill="${c.ear}"/>
    <path d="M212,262 C212,214 388,214 388,262 L388,318 C388,380 346,422 300,422 C254,422 212,380 212,318 Z" fill="${f("skin", c.skin)}"/>
    <path d="M388,262 L388,318 C388,380 346,422 300,422 C336,410 366,372 370,318 L372,262 Z" fill="${c.skinShade}" opacity="${soft ? 0.35 : 0.5}"/>
    <path d="M214,262 C218,240 252,232 274,236 C246,244 228,262 222,300 Z" fill="${f("hair", c.hair)}"/>
    <path d="M386,262 C382,240 348,232 326,236 C354,244 372,262 378,300 Z" fill="${f("hair", c.hair)}"/>
    <ellipse cx="250" cy="352" rx="18" ry="10" fill="${c.blush}" opacity="${style === "duo" ? 0 : 0.28}"/><ellipse cx="350" cy="352" rx="18" ry="10" fill="${c.blush}" opacity="${style === "duo" ? 0 : 0.28}"/>
    <path d="M246,292 Q264,282 284,290" stroke="${c.brow}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M316,290 Q336,282 354,292" stroke="${c.brow}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <ellipse cx="266" cy="316" rx="10.5" ry="12.5" fill="${c.eye}"/><ellipse cx="334" cy="316" rx="10.5" ry="12.5" fill="${c.eye}"/>
    <circle cx="270" cy="311" r="3.4" fill="#FFFFFF" opacity="0.9"/><circle cx="338" cy="311" r="3.4" fill="#FFFFFF" opacity="0.9"/>
    <path d="M254,308 Q262,301 272,302 M255,309 L248,304" stroke="${c.eye}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M346,308 Q338,301 328,302 M345,309 L352,304" stroke="${c.eye}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M303,322 Q307,344 298,354 Q304,358 312,353" stroke="${c.skinShade}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${style === "duo" ? `<path d="M284,374 Q300,388 316,374" stroke="${c.lip}" stroke-width="6" fill="none" stroke-linecap="round"/>` : `<path d="M281,376 Q291,369 300,373 Q309,369 319,376 Q300,382 281,376 Z" fill="${c.lip}"/>
    <path d="M283,377 Q300,394 317,377 Q300,386 283,377 Z" fill="${c.lipLow}"/>`}
    <path d="M214,262 C250,294 350,294 386,262 L386,284 C352,312 248,312 214,284 Z" fill="${c.skinShade}" opacity="${soft ? 0.55 : 0.6}" ${soft ? `filter="url(#${id}-blur)"` : ""}/>
    <g id="${id}-cap">
      <path d="M146,142 L190,216 L410,216 L454,142 Z" fill="${f("crown", c.crown)}"/>
      <path d="M352,142 L454,142 L410,216 L366,216 Z" fill="${c.crownShade}" opacity="${soft ? 0.3 : 0.55}"/>
      <ellipse cx="300" cy="142" rx="154" ry="34" fill="${f("crownTop", c.crownTop)}"/>
      <path d="M188,208 L412,208 L408,246 L192,246 Z" fill="${f("band", c.band)}"/>
      <path d="M192,238 L408,238 L408,246 L192,246 Z" fill="${c.bandShade}" opacity="0.7"/>
      <path d="M182,244 C230,236 370,236 418,244 C408,270 360,284 300,286 C240,284 192,270 182,244 Z" fill="${f("visor", c.visor)}"/>
      <path d="M204,252 C250,246 350,246 396,252" stroke="${c.visorEdge}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.9"/>
      <circle cx="300" cy="176" r="19" fill="${soft ? `url(#${id}-badge)` : c.badge}" stroke="${c.badgeRing}" stroke-width="5"/>
      <circle cx="300" cy="176" r="7" fill="${c.badgeIn}"/>
      ${soft ? `<ellipse cx="262" cy="132" rx="70" ry="12" fill="#FFFFFF" opacity="0.22"/>
      <path d="M214,250 C260,243 340,243 386,250" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.25"/>
      <path d="M452,146 C446,166 428,184 412,212" stroke="#FFC4CD" stroke-width="5" fill="none" opacity="0.4" stroke-linecap="round" filter="url(#${id}-blur)"/>` : ""}
    </g>

  </g>
  ${soft ? `<path d="M428,484 C506,508 552,566 554,650" stroke="#FFC4CD" stroke-width="6" fill="none" opacity="0.35" stroke-linecap="round" filter="url(#${id}-blur)"/>` : ""}
</svg>`;
  }

  window.Bust = { svg };
})();
