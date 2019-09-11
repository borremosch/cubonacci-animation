const fs = require("fs");

const svg = fs.readFileSync("images/box-animation.svg").toString("utf-8");

const matches = svg.match(/(values|points)="([^"]+)"/g);

const xValues = matches
  .map(match =>
    match
      .replace(/(values|points)="/, "")
      .replace('"', "")
      .split(/[ ,;]/)
      .filter((value, i) => i % 2 === 0)
      .map(x => parseFloat(x))
  )
  .flat();
const yValues = matches
  .map(match =>
    match
      .replace(/(values|points)="/, "")
      .replace('"', "")
      .split(/[ ,;]/)
      .filter((value, i) => i % 2 === 1)
      .map(y => parseFloat(y))
  )
  .flat();

const minX = xValues.reduce((min, x) => {
  return Math.min(min, x);
}, Number.MAX_VALUE);
const maxX = xValues.reduce((max, x) => {
  return Math.max(max, x);
}, -Number.MAX_VALUE);

const minY = yValues.reduce((min, y) => {
  return Math.min(min, y);
}, Number.MAX_VALUE);
const maxY = yValues.reduce((max, y) => {
  return Math.max(max, y);
}, -Number.MAX_VALUE);

console.log({
  minX,
  minY,
  maxX,
  maxY
});

if (minX < 0 || maxX < 0) {
  // Replace values
  const newSvg = svg.replace(
    /(values|points)="([^"]+)"/g,
    (match, prop, values) => {
      return `${prop}="${values
        .split(";")
        .map(valueList =>
          valueList
            .split(/[ ,]/)
            .map((value, i) =>
              (parseFloat(value) - (i % 2 ? minY : minX))
                .toFixed(2)
                .replace(/\.?0+$/, "")
            )
            .join(" ")
        )
        .join(";")}"`;
    }
  );

  console.log(newSvg);
}
