export const EMOJI_SUBSTITUTIONS = {
  'note: ': '📝 ',
  'bloco: ': '⬛ ',
  'idea: ': '💡',
  'task: ': '📆 ',
};

export function applySubstitutions(text: string) {
  let newText = text;

  for (const sub of Object.keys(EMOJI_SUBSTITUTIONS)) {
    newText = newText.replace(new RegExp(sub, 'i'), EMOJI_SUBSTITUTIONS[sub as keyof typeof EMOJI_SUBSTITUTIONS]);
  }

  return newText;
}
