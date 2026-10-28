export type OpticsDetectionResult = {
  isOptics: boolean;
  type: 'concave-mirror' | 'convex-mirror' | 'convex-lens' | 'concave-lens';
  initialD: number;
};

/**
 * Intelligent detector for Tier A Canonical NCERT Visual Simulations:
 * Detects whether an interactive canvas block or chat query represents an optics simulation
 * (Spherical Mirrors: Concave/Convex, Lenses: Convex/Concave), and extracts the appropriate
 * initial parameters.
 */
export function detectOpticsCanvas(
  tag: string,
  rawCode: string,
  contextText: string,
): OpticsDetectionResult {
  const isOpticsTag = tag === 'optics' || tag.startsWith('optics');
  const combined = `${tag} ${rawCode} ${contextText}`.toLowerCase();

  // 1. Try parsing JSON if rawCode starts and ends with braces
  const trimmedCode = rawCode.trim();
  if (trimmedCode.startsWith('{') && trimmedCode.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmedCode);
      const typeStr = String(parsed.type || '').toLowerCase();
      if (
        typeStr === 'concave-mirror' ||
        typeStr === 'convex-mirror' ||
        typeStr === 'convex-lens' ||
        typeStr === 'concave-lens'
      ) {
        return {
          isOptics: true,
          type: typeStr as OpticsDetectionResult['type'],
          initialD: Number(parsed.dObj || parsed.initialObjectDistance || 35),
        };
      }
    } catch {
      // not valid json, fall through
    }
  }

  // 2. Check if tag is optics or if code/context strongly indicates spherical mirror or lens ray diagram
  const hasOpticsKeywords =
    (combined.includes('mirror') || combined.includes('lens')) &&
    (combined.includes('ray') ||
      combined.includes('focus') ||
      combined.includes('focal') ||
      combined.includes('pole') ||
      combined.includes('principal axis') ||
      combined.includes('chapterreadyoptics') ||
      combined.includes('objslider') ||
      combined.includes('concave') ||
      combined.includes('convex'));

  if (!isOpticsTag && !hasOpticsKeywords) {
    return { isOptics: false, type: 'concave-mirror', initialD: 35 };
  }

  // 3. Determine specific mirror or lens type
  let type: OpticsDetectionResult['type'] = 'concave-mirror';
  if (combined.includes('convex lens')) {
    type = 'convex-lens';
  } else if (combined.includes('concave lens')) {
    type = 'concave-lens';
  } else if (combined.includes('convex mirror')) {
    type = 'convex-mirror';
  } else {
    type = 'concave-mirror';
  }

  // 4. Determine initial object distance from context or presets
  let initialD = 35; // Default: Between F and P (Case 6)
  if (
    combined.includes('between c and f') ||
    combined.includes('between f and c') ||
    combined.includes('between 2f and f')
  ) {
    initialD = 105;
  } else if (combined.includes('at c') || combined.includes('at 2f')) {
    initialD = 140;
  } else if (combined.includes('beyond c') || combined.includes('beyond 2f')) {
    initialD = 190;
  } else if (combined.includes('at f') || combined.includes('at focus')) {
    initialD = 70;
  } else if (
    combined.includes('between f and p') ||
    combined.includes('between p and f') ||
    combined.includes('between f1 and o')
  ) {
    initialD = 35;
  }

  return { isOptics: true, type, initialD };
}
