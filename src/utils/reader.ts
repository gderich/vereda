// Works with the partial URL implementation in React Native 0.74.
export function isScriptureUrl(value: string): boolean {
  return /^https:\/\/www\.churchofjesuschrist\.org\/study\/scriptures\/[a-z0-9/-]+(?:[?#][^\s]*)?$/.test(
    value,
  );
}
