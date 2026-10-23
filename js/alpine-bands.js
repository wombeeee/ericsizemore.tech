/* @ds-bundle: {"format":4,"namespace":"Alpine","components":[{"name":"Bands"}]} */
(function () {
  // Alpine.bands(el, opts) draws the ridgeline motif into el as an inline SVG.
  // opts: { width, height, bands (1..7, default 7), radius ("radius-lg" | "none"), seed }
  // Colors come from the alpine-* tokens on the page; geometry follows the system's rules:
  // wide hills r = 3 x space-8 (192px) and small hills r = 1.5 x space-8 (96px); the pitch is
  // the radius at cover size and half of it under 200px tall, so the band order stays readable.
  var TOKENS = ["alpine-slate-deep", "alpine-slate", "alpine-storm", "alpine-stone", "alpine-taupe", "alpine-sand", "alpine-sand-light"];
  var PICK = { 1: [0], 2: [0, 6], 3: [0, 2, 6], 4: [0, 2, 4, 6], 5: [0, 1, 2, 4, 6], 6: [0, 1, 2, 3, 5, 6], 7: [0, 1, 2, 3, 4, 5, 6] };
  function edge(width, base, flat, seed) {
    var wide = flat ? [192, 128] : [192, 192], small = flat ? [96, 64] : [96, 96];
    var d = "M0," + base, x = 0, i = seed || 0;
    while (x < width) {
      var w = (i % 3 === 1) ? small : wide, up = (i % 2 === 0) ? 1 : 0;
      var dx = Math.min(w[1], width - x);
      d += " a" + w[0] + "," + w[0] + " 0 0 " + up + " " + dx + ",0";
      x += dx; i++;
    }
    return d + " L" + width + "," + base + " L" + width + ",9999 L0,9999 Z";
  }
  function bands(el, opts) {
    opts = opts || {};
    var width = opts.width || 480, height = opts.height || 300;
    var n = Math.max(1, Math.min(7, opts.bands || 7)), pick = PICK[n], flat = height < 200;
    var rx = opts.radius === "none" ? "0" : "var(--radius-lg)";
    var svg = '<svg viewBox="0 0 ' + width + ' ' + height + '" width="' + width + '" height="' + height + '" aria-hidden="true" style="display:block;border-radius:' + rx + '">';
    svg += '<rect width="' + width + '" height="' + height + '" fill="var(--' + TOKENS[pick[0]] + ')"/>';
    for (var k = 1; k < pick.length; k++) {
      var base = Math.round(height * k / pick.length) - (flat ? 4 : 12);
      svg += '<path d="' + edge(width, base, flat, (opts.seed || 0) + k) + '" fill="var(--' + TOKENS[pick[k]] + ')"/>';
    }
    el.innerHTML = svg + "</svg>";
    return el.firstChild;
  }
  window.Alpine = { bands: bands, tokens: TOKENS.slice() };
})();
