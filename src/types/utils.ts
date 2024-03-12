export function isType(v: unknown, type: string): boolean {
  return (
    typeof v === "object" &&
    v !== null &&
    (v as Record<string, unknown>).$type === type
  );
}
