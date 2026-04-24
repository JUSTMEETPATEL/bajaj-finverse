const EDGE_REGEX = /^[A-Z]->[A-Z]$/;

export function validateEdge(raw: string): {
  valid: boolean;
  trimmed: string;
} {
  const trimmed = raw.trim();
  if (!EDGE_REGEX.test(trimmed)) return { valid: false, trimmed };
  const [src, dst] = trimmed.split("->");
  if (src === dst) return { valid: false, trimmed };
  return { valid: true, trimmed };
}
