/**
 * Computes remaining calendar days until CBSE Class 10 Board Examinations (Feb 15, 2027).
 * Kept in a pure client-safe module (no Node `fs` imports) so Client Components can import it directly.
 */
export function getDaysToBoardExams(targetDateStr = '2027-02-15T09:00:00+05:30'): number {
  const target = new Date(targetDateStr).getTime();
  const now = Date.now();
  const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}
