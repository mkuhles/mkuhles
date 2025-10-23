
export const COLOR_SCALE = [
  '#E7E0CF', '#D7D6C2', '#C6CCB6',
  '#ACBFAF', '#9DB8AC', '#8FB1AA',
  '#779EAB', '#628AA3', '#4F7392',
  '#476786', '#3E5C7A'
];

export const lightFontColor = '#fff';
export const darkFontColor = '#111';


export const pickColor = (t: number, scale = COLOR_SCALE) => {
  t = Math.min(1, Math.max(0, t));
  const i = Math.round(t * (scale.length - 1));
  return scale[i];
};

// YIQ-Heuristik (reicht hier völlig)
export const textOn = (hex: string) => {
  const [r,g,b] = hex.replace('#','').match(/.{2}/g)!.map(x => parseInt(x,16));
  const yiq = (r*299 + g*587 + b*114) / 1000; // ~Luminanz
  return yiq >= 140 ? darkFontColor : lightFontColor;
};

export const writeCssVarsToHTML = () => {
  let cssVars = "";
  COLOR_SCALE.forEach((color, index) => {
    cssVars += "--c" + (index+1) + ": " + color + ";\n";
  });
  cssVars += "--text-color: " + darkFontColor + ";\n";
  cssVars += "--text-color-inv: " + lightFontColor + ";\n";

  const head = document.head || document.getElementsByTagName('head')[0];
  let style = document.createElement('style');

  const css = ":root {\n" + cssVars + "\n}";

  head.appendChild(style);
  style.appendChild(document.createTextNode(css));
};
