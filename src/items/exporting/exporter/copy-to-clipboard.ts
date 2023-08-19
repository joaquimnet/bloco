export async function copyToClipboard(content: string) {
  return navigator.clipboard.writeText(content);
}
