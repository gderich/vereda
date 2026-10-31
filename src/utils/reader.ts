// Only official scripture pages can be loaded in the integrated reader.
export function isScriptureUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "www.churchofjesuschrist.org" &&
      url.pathname.startsWith("/study/scriptures/") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
