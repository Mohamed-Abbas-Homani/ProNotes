export default function hexColorAverage(color1, color2, degree) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const averageRgb = {
    r: calcRgb(rgb1.r, rgb2.r, degree),
    g: calcRgb(rgb1.g, rgb2.g, degree),
    b: calcRgb(rgb1.b, rgb2.b, degree),
  };
  console.log(averageRgb);
  const averageHex = rgbToHex(averageRgb.r, averageRgb.g, averageRgb.b);

  return averageHex;
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

function calcRgb(rgb1, rgb2, degree) {
  let raw = Math.round((degree * rgb1 + (1 / degree + 0.001) * rgb2) / 2);
  if (raw > 255) return 255;
  else if (!raw) return 0;
  else return raw;
}

export const getRandomHexColor = () => {
  // Generate three random values for RGB
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  // Convert the RGB values to a hex color string
  const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  return hexColor;
};

export const getRandomGoodHexColor = () => {
  // Generate three random values for RGB
  const r1 = Math.floor(Math.random() * 256);
  const g1 = Math.floor(Math.random() * 256);
  const b1 = Math.floor(Math.random() * 256);

  const r2 = magic(r1 % b1);
  const g2 = magic(g1 % r1);
  const b2 = magic(b1 % g1);

  const hexColor1 = `#${r1.toString(16).padStart(2, '0')}${g1.toString(16).padStart(2, '0')}${b1.toString(16).padStart(2, '0')}`;
  const hexColor2 = `#${r2.toString(16).padStart(2, '0')}${g2.toString(16).padStart(2, '0')}${b2.toString(16).padStart(2, '0')}`;
  return { primary_color: hexColor1, secondary_color: hexColor2 };
};

const magic = (num) => {
  return Math.floor((num % 2 ? num * 1.618 : num / 1.618) % 256);
};
