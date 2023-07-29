const AUDIO = {
  CHECK: {
    src: '/audio/check.ogg',
    volume: 0.3,
  },
  REMOVE: {
    src: '/audio/remove.ogg',
    volume: 0.5,
  },
  DING: {
    src: '/audio/ding.mp3',
    volume: 0.1,
  },
};

export function play(audioKey: keyof typeof AUDIO) {
  const resource = AUDIO[audioKey];
  const audio = new Audio(resource.src);
  audio.volume = resource.volume;
  audio.play();
}
