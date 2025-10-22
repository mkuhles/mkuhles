
export const COLOR_SCALE = [
    '#E7E0CF', '#D7D6C2', '#C6CCB6',
    '#ACBFAF', '#8FB1AA', '#779EAB',
    '#628AA3', '#4F7392',  '#3E5C7A'
];

export const pickColor = (t: number, scale = COLOR_SCALE) => {
  t = Math.min(1, Math.max(0, t));
  const i = Math.round(t * (scale.length - 1));
  return scale[i];
};

// YIQ-Heuristik (reicht hier völlig)
export const textOn = (hex: string) => {
  const [r,g,b] = hex.replace('#','').match(/.{2}/g)!.map(x => parseInt(x,16));
  const yiq = (r*299 + g*587 + b*114) / 1000; // ~Luminanz
  return yiq >= 140 ? '#111' : '#fff';
};
