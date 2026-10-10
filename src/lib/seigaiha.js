/**
 * Seigaiha (青海波, Japanese ocean wave) Pattern Generator
 *
 * Implements the mathematically exact Seigaiha wave geometry without <defs>/<use>
 * (every circle written explicitly with cx, cy, r so data URIs resolve flawlessly in all browsers).
 *
 * A) MAIN TILE (80x40):
 * Seamless concentric wave grid for section backgrounds.
 * Centers in exact draw order: (40,-20), (0,0), (80,0), (40,20), (0,40), (80,40), (40,60).
 * 4 concentric circles per scale (radii 40, 30, 20, 10), largest to smallest.
 *
 * B) EDGE TILE (80x80, repeat-x only):
 * 2 staggered rows of rounded dome scales with concentric rings for header bottom & footer top transitions.
 * Centers in exact draw order: (0,40), (80,40), (40,60), (0,80), (80,80), (40,100).
 * Area above scales is transparent (no background rect).
 */

/**
 * @typedef {'paper' | 'dark' | 'sage'} SeigaihaVariant
 */

/**
 * @typedef {Object} SeigaihaConfig
 * @property {string} bg - Section background color (opaque)
 * @property {string} line - Wave stroke line color
 * @property {number} opacity - Stroke opacity
 * @property {number} [strokeWidth] - Stroke width in SVG units
 */

/**
 * Master tuning dial for dark sections (PageHeader, footer brand band, wave edge).
 * Adjust line, opacityTile, opacityEdge, strokeWidth here in one place.
 */
export const SEIGAIHA_DARK = {
  bg: '#1A1613',         // Exact zen-espresso token
  line: '#A88A4E',       // Deep antique gold (muted brown-gold)
  opacityTile: 0.24,     // Main tile ring stroke-opacity (lands around #3A2F20)
  opacityEdge: 0.38,     // Edge tile ring stroke-opacity (defines scale silhouette)
  strokeWidth: 0.8,      // Main tile stroke width
  strokeWidthEdge: 0.9,  // Edge tile stroke width
};

/**
 * Standard design token variants for Shizuka Café.
 * @type {Record<SeigaihaVariant, SeigaihaConfig>}
 */
export const SEIGAIHA_VARIANTS = {
  paper: {
    bg: '#F5F1EA',
    line: '#2B211B',
    opacity: 0.12,
    strokeWidth: 0.8,
  },
  dark: {
    bg: SEIGAIHA_DARK.bg,
    line: SEIGAIHA_DARK.line,
    opacity: SEIGAIHA_DARK.opacityTile,
    strokeWidth: SEIGAIHA_DARK.strokeWidth,
  },
  sage: {
    bg: '#ECEBE1',
    line: '#6F8269',
    opacity: 0.28,
    strokeWidth: 0.8,
  },
};

const RADII = [40, 30, 20, 10];

const MAIN_CENTERS = [
  [40, -20],
  [0, 0],
  [80, 0],
  [40, 20],
  [0, 40],
  [80, 40],
  [40, 60],
];

const EDGE_CENTERS = [
  [0, 40],
  [80, 40],
  [40, 60],
  [0, 80],
  [80, 80],
  [40, 100],
];

/**
 * Generates the 80x40 seamless main tile SVG with explicit circles.
 */
export function buildSeigaihaSvg(bg, line, opacity, strokeWidth = 0.8) {
  let circles = '';
  for (let i = 0; i < MAIN_CENTERS.length; i++) {
    const [cx, cy] = MAIN_CENTERS[i];
    for (let j = 0; j < RADII.length; j++) {
      const r = RADII[j];
      circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${bg}" stroke="${line}" stroke-opacity="${opacity}" stroke-width="${strokeWidth}"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" viewBox="0 0 80 40"><rect width="80" height="40" fill="${bg}"/>${circles}</svg>`;
}

/**
 * Generates the 80x80 edge tile SVG with 2 staggered rows of concentric wave scales.
 * Area above scales is transparent.
 */
export function buildSeigaihaEdgeSvg(darkBg, line, opacity = 0.38, strokeWidth = 0.9) {
  let circles = '';
  for (let i = 0; i < EDGE_CENTERS.length; i++) {
    const [cx, cy] = EDGE_CENTERS[i];
    for (let j = 0; j < RADII.length; j++) {
      const r = RADII[j];
      circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${darkBg}" stroke="${line}" stroke-opacity="${opacity}" stroke-width="${strokeWidth}"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">${circles}</svg>`;
}

/**
 * Memoization caches for data URIs.
 */
const mainTileCache = new Map();
const edgeTileCache = new Map();

/**
 * Returns a memoized SVG data URI for the main tile.
 *
 * @param {SeigaihaVariant} [variant='paper']
 * @param {Partial<SeigaihaConfig>} [overrides]
 * @returns {string}
 */
export function getSeigaihaDataUri(variant = 'paper', overrides) {
  const base = SEIGAIHA_VARIANTS[variant] || SEIGAIHA_VARIANTS.paper;
  const bg = overrides?.bg || base.bg;
  const line = overrides?.line || base.line;
  const opacity = overrides?.opacity !== undefined ? overrides.opacity : base.opacity;
  const strokeWidth = overrides?.strokeWidth !== undefined ? overrides.strokeWidth : (base.strokeWidth || 0.8);
  const key = `${bg}|${line}|${opacity}|${strokeWidth}`;

  let uri = mainTileCache.get(key);
  if (!uri) {
    const svg = buildSeigaihaSvg(bg, line, opacity, strokeWidth);
    uri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    mainTileCache.set(key, uri);
  }
  return uri;
}

/**
 * Returns a memoized SVG data URI for the edge wave tile (80x80).
 *
 * @param {string} [darkBg=SEIGAIHA_DARK.bg]
 * @param {string} [line=SEIGAIHA_DARK.line]
 * @param {number} [opacity=SEIGAIHA_DARK.opacityEdge]
 * @param {number} [strokeWidth=SEIGAIHA_DARK.strokeWidthEdge]
 * @returns {string}
 */
export function getSeigaihaEdgeDataUri(
  darkBg = SEIGAIHA_DARK.bg,
  line = SEIGAIHA_DARK.line,
  opacity = SEIGAIHA_DARK.opacityEdge,
  strokeWidth = SEIGAIHA_DARK.strokeWidthEdge
) {
  const key = `${darkBg}|${line}|${opacity}|${strokeWidth}`;
  let uri = edgeTileCache.get(key);
  if (!uri) {
    const svg = buildSeigaihaEdgeSvg(darkBg, line, opacity, strokeWidth);
    uri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    edgeTileCache.set(key, uri);
  }
  return uri;
}
