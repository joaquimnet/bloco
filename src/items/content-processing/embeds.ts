const urlRegex = /(https?:\/\/[^\s]+)/g;
const base64Regex = /data:image[^\s]+/g;

export const extractEmbeds = (content: string) => {
  const linkSet = new Set<string>();
  const imageSet = new Set<string>();

  const newText = content
    .replace(urlRegex, (match) => {
      linkSet.add(match);
      return '[LINK]';
    })
    .replace(base64Regex, (match) => {
      imageSet.add(match);
      return '';
    })
    .trim();

  return { text: newText, links: [...linkSet], images: [...imageSet] };
};
