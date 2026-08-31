import fs from "node:fs";

const path = "public/images/tire-iq/axles/VIS-01_trailer-active.svg";
let source = fs.readFileSync(path, "utf8");

if (!source.includes('id="trailerGlow"')) {
  source = source.replace(
    "><g id=\"vehicle-body\">",
    "><defs><filter id=\"trailerGlow\" x=\"-70%\" y=\"-70%\" width=\"240%\" height=\"240%\"><feGaussianBlur stdDeviation=\"17\" result=\"blur\"/><feFlood flood-color=\"#ff5a36\" flood-opacity=\"0.92\" result=\"color\"/><feComposite in=\"color\" in2=\"blur\" operator=\"in\"/><feMerge><feMergeNode/><feMergeNode in=\"SourceGraphic\"/></feMerge></filter></defs><g id=\"vehicle-body\">",
  );
}

source = source.replace('stdDeviation="17"', 'stdDeviation="12"').replace('flood-opacity="0.92"', 'flood-opacity="0.72"');

source = source.replaceAll("stroke-width:4.5px", "stroke-width:14.97px");

for (const id of ["trailer-axle-1", "trailer-axle-2"]) {
  const start = source.indexOf(`<g id="${id}"`);
  const end = source.indexOf("</g>", start);
  if (start === -1 || end === -1) throw new Error(`Missing ${id}`);
  const before = source.slice(0, start);
  const group = source.slice(start, end);
  const after = source.slice(end);
  source = `${before}${group.replaceAll("stroke-opacity:0", "stroke-opacity:1").replaceAll("stroke-opacity:1;", "stroke-opacity:1;filter:url(#trailerGlow);")}${after}`;
}

fs.writeFileSync(path, source);
