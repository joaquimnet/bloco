export async function copyToClipboard(content: string) {
  try {
    await navigator.clipboard.writeText(content);
    console.log('Bloco: exported content to clipboard.', `(${content.length})`);
  } catch (err) {
    console.log('Bloco: could not copy content to clipboard.', `(${content.length})`);
    console.error(err);
  }
}
