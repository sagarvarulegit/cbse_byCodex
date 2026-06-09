export function getChapterHomeHref(isLoggedIn: boolean) {
  return isLoggedIn ? '/dashboard' : '/';
}
