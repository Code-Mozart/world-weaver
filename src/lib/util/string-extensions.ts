export function toTitleCase(inputString: string): string {
  return inputString.replace(/((?:[A-Z]|[a-z])[^A-Z-_\s]+)/g, function (substring) {
    return substring.charAt(0).toUpperCase() + substring.slice(1).toLowerCase();
  });
}
