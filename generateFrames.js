const isometricCToXRatio = Math.cos((30 / 180) * Math.PI);
const isometricCToYRatio = Math.sin((30 / 180) * Math.PI);

const BOX_FLAP_LENGTH = 10;

function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return `#${Math.round(r * 255)
    .toString(16)
    .padStart(2, "0")}${Math.round(g * 255)
    .toString(16)
    .padStart(2, "0")}${Math.round(b * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

const flaps = [
  {
    // Rechst voor
    name: "right front",
    point1X: 44.94,
    point1Y: 21.63,
    point2X: 26.8,
    point2Y: 32.11,
    xModifier: 1,
    yModifier: -1,
    delay: 1,
    rotation: 14.8,
    verticalBrightness: 0.88
  },
  {
    // Links voor
    name: "left front",
    point1X: 26.8,
    point1Y: 32.11,
    point2X: 8.66,
    point2Y: 21.63,
    xModifier: -1,
    yModifier: -1,
    rotation: 15,
    verticalBrightness: 0.94
  },
  {
    // Rechts achter
    name: "right back",
    point1X: 44.94,
    point1Y: 21.63,
    point2X: 26.8,
    point2Y: 11.16,
    xModifier: 1,
    yModifier: 1,
    rotation: 15,
    verticalBrightness: 0.94
  },
  {
    // Links achter
    name: "left back",
    point1X: 26.8,
    point1Y: 11.16,
    point2X: 8.66,
    point2Y: 21.63,
    xModifier: -1,
    yModifier: 1,
    delay: 1,
    rotation: 14.8,
    verticalBrightness: 0.88
  }
];

for (const flap of flaps) {
  let values = "";

  for (let i = -45; i <= 180; i += flap.rotation) {
    const worldXOffset = Math.cos((i / 180) * Math.PI);
    const worldYOffset = Math.sin((i / 180) * Math.PI);

    const xOffset = worldXOffset * isometricCToXRatio;
    const yOffset =
      worldXOffset * isometricCToYRatio * flap.yModifier + worldYOffset;

    const point3X = flap.point2X + xOffset * BOX_FLAP_LENGTH * flap.xModifier;
    const point3Y = flap.point2Y - yOffset * BOX_FLAP_LENGTH;
    const point4X = flap.point1X + xOffset * BOX_FLAP_LENGTH * flap.xModifier;
    const point4Y = flap.point1Y - yOffset * BOX_FLAP_LENGTH;

    if (values) {
      values += ";";
    }
    values += `${flap.point1X
      .toFixed(2)
      .replace(/\.?0+$/, "")},${flap.point1Y.toFixed(2)} ${flap.point2X
      .toFixed(2)
      .replace(/\.?0+$/, "")},${flap.point2Y
      .toFixed(2)
      .replace(/\.?0+$/, "")} ${point3X.toFixed(2)},${point3Y
      .toFixed(2)
      .replace(/\.?0+$/, "")} ${point4X
      .toFixed(2)
      .replace(/\.?0+$/, "")},${point4Y.toFixed(2).replace(/\.?0+$/, "")}`;
  }

  let keyFrames = "";
  for (let i = 0; i <= 15; i++) {
    if (keyFrames) {
      keyFrames += ";";
    }
    keyFrames += (i / 15).toFixed(2).replace(/\.?0+$/, "");
  }

  const horizontalColor = HSVtoRGB(0.05833, 0.37, 1);
  const verticalColor = HSVtoRGB(0.05833, 0.37, flap.verticalBrightness);

  console.log(`
  <polygon class="cls-3" points="${values.split(";")[0]}">
    <animate attributeName="points"
      values="${values}"
      keyTimes="${keyFrames}"
      dur="5s"
      begin="${flap.delay || 0}s"
      repeatCount="1"
      fill="freeze"
    />
    <animate attributeName="fill"
      values="${horizontalColor};${horizontalColor};${verticalColor};${horizontalColor}"
      keyTimes="0;0.2;0.60;1"
      dur="5s"
      begin="${flap.delay || 0}s"
      repeatCount="1"
      fill="freeze"
    />
  </polygon>`);
}
