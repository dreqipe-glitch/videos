/* Reel 2, scene 3B «وارتباط المرأة الدركية بهذا المجال»: the pink badge ring with its four value medals, the horse-head
   icon and its connector, the horseshoe frame and the «الفروسية» headline. g3 builds it up; g4 mounts the same elements in
   their end state and opens on them, so the match-cut between the two compositions lines up pixel for pixel.
   Scene3B.mount(prefix, host) inserts the elements; Scene3B.G holds the shared geometry (frame coordinates, 1080×1920). */
(function () {
  const G = {
    cx: 380, cy: 950, ring: 165, // badge centre = the bust's centre in 3B
    bust: { x: -160, y: 60, scale: 0.882 }, // transform of a 340×380 bust window at left 370 / top 700
    md: [[497, 833], [263, 833], [497, 1067], [263, 1067]], // الصبر, القوة, التركيز, الانضباط (whole pixels: same raster in g3 and g4)
    conn: [548, 722, 950],
  };
  const L = "M535,620 C300,620 120,700 120,900 L120,1290";
  const R = "M535,620 C770,620 950,700 950,900 L950,1290";
  const CSS = `
    .s3b-abs { position: absolute; }
    .s3b-svg { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; overflow: visible; }
    .s3b-zglow { left: 80px; top: 650px; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(255,149,165,0.26), rgba(255,149,165,0) 66%); }
    .s3b-ring { left: ${G.cx - G.ring}px; top: ${G.cy - G.ring}px; width: ${2 * G.ring}px; height: ${2 * G.ring}px; border-radius: 50%;
      border: 4px solid var(--pink); box-shadow: 0 0 30px rgba(255,149,165,0.5), inset 0 0 24px rgba(255,149,165,0.3); }
    .s3b-md { position: absolute; width: 104px; height: 104px; margin: -52px 0 0 -52px; border-radius: 50%; padding: 20px; color: var(--pink);
      background: #141E2E; border: 3px solid rgba(255,149,165,0.75); box-shadow: 0 10px 26px rgba(0,0,0,0.4), 0 0 18px rgba(255,149,165,0.25); }
    .s3b-md svg { width: 100%; height: 100%; }
    .s3b-click { position: absolute; width: 104px; height: 104px; margin: -52px 0 0 -52px; border-radius: 50%; border: 5px solid #FFF0F3; opacity: 0; }
    .s3b-horse { left: 725px; top: 865px; width: 170px; height: 170px; color: var(--pink); }
    .s3b-horse svg { width: 100%; height: 100%; filter: drop-shadow(0 0 12px rgba(255,149,165,0.45)); }
    .s3b-shoe path { fill: none; stroke: var(--pink); stroke-width: 9; stroke-linecap: round; }
    .s3b-shoe circle { fill: #0B1320; stroke: var(--pink); stroke-width: 3.5; }
    .s3b-glow { filter: blur(10px); }
    .s3b-glow path { stroke: #FFC4CD; stroke-width: 24; fill: none; stroke-linecap: round; }
    .s3b-conn line { stroke: var(--pink); stroke-width: 5; stroke-linecap: round; filter: drop-shadow(0 0 6px rgba(255,149,165,0.8)); }
    .s3b-conn circle { fill: #FFF0F3; filter: drop-shadow(0 0 10px #FF95A5); }
    .s3b-fh { position: absolute; left: 90px; right: 120px; top: 390px; text-align: center; font-weight: 900; font-size: 110px; line-height: 140px; color: var(--ink); white-space: nowrap; }
    .s3b-fw { position: relative; display: inline-block; }
    .s3b-ful { position: absolute; left: 6px; right: 6px; bottom: 2px; height: 11px; border-radius: 6px; background: linear-gradient(90deg, var(--pink-dk), var(--pink)); transform-origin: 100% 50%; }`;

  function mount(p, host, { medals = true } = {}) {
    const md = medals ? G.md.map(([x, y], i) =>
      `<div class="s3b-md" id="${p}-m${i + 1}" style="left:${x}px;top:${y}px">${Pkg.icon(["hourglass", "arm", "target", "chevrons"][i])}</div>
       <div class="s3b-click" id="${p}-k${i + 1}" style="left:${x}px;top:${y}px"></div>`).join("") : "";
    host.insertAdjacentHTML("beforeend", `<style>${CSS}</style>
      <div class="s3b-abs s3b-zglow" id="${p}-zglow"></div>
      <svg class="s3b-svg s3b-shoe" id="${p}-shoe" viewBox="0 0 1080 1920">
        <g class="s3b-glow" id="${p}-shoeglow"><path d="${L}"/><path d="${R}"/></g>
        <g id="${p}-shoeL"><path id="${p}-sl" d="${L}"/><path id="${p}-tl" d="M102,1290 L138,1290"/><g id="${p}-nl"></g></g>
        <g id="${p}-shoeR"><path id="${p}-sr" d="${R}"/><path id="${p}-tr" d="M932,1290 L968,1290"/><g id="${p}-nr"></g></g>
      </svg>
      <svg class="s3b-svg s3b-conn" id="${p}-conn" viewBox="0 0 1080 1920">
        <line id="${p}-cl" x1="${G.conn[0]}" y1="${G.conn[2]}" x2="${G.conn[1]}" y2="${G.conn[2]}"/>
        <circle id="${p}-cdot" cx="${G.conn[0]}" cy="${G.conn[2]}" r="9"/>
      </svg>
      <div class="s3b-abs s3b-ring" id="${p}-bring"></div>
      <div class="s3b-abs s3b-horse" id="${p}-horse">${Pkg.icon("horse")}</div>
      ${md}
      <div class="s3b-fh" id="${p}-fh"><span class="s3b-fw" id="${p}-fw">الفروسية<span class="s3b-ful" id="${p}-ful"></span></span></div>`);
    // nail holes along each arm of the horseshoe
    [["sl", "nl"], ["sr", "nr"]].forEach(([a, g]) => {
      const path = document.getElementById(`${p}-${a}`), len = path.getTotalLength();
      document.getElementById(`${p}-${g}`).innerHTML = [0.2, 0.4, 0.6, 0.8].map((t) => {
        const pt = path.getPointAtLength(len * t);
        return `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="7"/>`;
      }).join("");
    });
  }

  window.Scene3B = { G, mount };
})();
