// This script gewnerrates sprites by calling spreet docker image.
// It also adds a halo to the icons.
// It ignores hale for icons that has a pattern in their file name.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const iconsDir = path.join(__dirname, 'SVGs', 'single SVGs with halo');
const inputDir = path.join(__dirname, 'SVGs', 'input');
// HM TODO: rename to publish
const publishDir = path.join(__dirname, 'output');
const dockerImage = 'ghcr.io/harelm/spreet:0.13.0';
const haloIcons = fs.readdirSync(iconsDir)
  .filter(file => file.endsWith('.svg') && !file.includes('pattern') && !file.includes('arrowline') && !file.includes('cliff'));

// read svg and add a halo
for (let file of haloIcons) {
    let svgContent = fs.readFileSync(path.join(iconsDir, file), 'utf8');
    svgContent = svgContent.replace('<path ', '<path style="stroke:white;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:stroke fill markers" ');
    // add 2 pixels to the width and height, and move the viewBox by 1 pixel in each direction
    svgContent = svgContent.replace(/viewBox="(\d+) (\d+) (\d+(\.\d+)?) (\d+(\.\d+)?)"/, (_match, x, y, width, _widthDec, height) => {
        return `viewBox="${+x} ${+y} ${+width+2} ${+height+2}"`;
    });
    // change traslate by 1 pixel in each direction
    svgContent = svgContent.replace(/translate\((-?\d+(\.\d+)?) (-?\d+(\.\d+)?)\)/g, (_match, x, _decimal, y) => {
        return `translate(${+x+1} ${+y+1})`;
    });
    svgContent = svgContent.replace(/width="(\d+(\.\d+)?)"/, (_match, width) => {
        return `width="${+width+8}"`;
    });
    svgContent = svgContent.replace(/height="(\d+(\.\d+)?)"/, (_match, height) => {
        return `height="${+height+8}"`;
    });
    fs.writeFileSync(path.join(inputDir, file), svgContent);
}

let svgContent = fs.readFileSync(path.join(inputDir, 'david_star.svg'), 'utf8');
svgContent = svgContent.replace('<path ', '<path fill="red" ');
fs.writeFileSync(path.join(inputDir, 'first_aid.svg'), svgContent);
svgContent = fs.readFileSync(path.join(inputDir, 'gate.svg'), 'utf8');
svgContent = svgContent.replace('<path ', '<path fill="red" ');
fs.writeFileSync(path.join(inputDir, 'gate_closed.svg'), svgContent);
svgContent = fs.readFileSync(path.join(inputDir, 'dot.svg'), 'utf8');
svgContent = svgContent.replace('<path ', '<path fill="#1e80e3ff" ');
fs.writeFileSync(path.join(inputDir, 'spring.svg'), svgContent);
svgContent = fs.readFileSync(path.join(inputDir, 'shield.svg'), 'utf8');
svgContent = svgContent.replace('<path ', '<path fill="red" ');
fs.writeFileSync(path.join(inputDir, 'red_shield.svg'), svgContent);
svgContent = fs.readFileSync(path.join(inputDir, 'shield.svg'), 'utf8');
svgContent = svgContent.replace('<path ', '<path fill="green" ');
fs.writeFileSync(path.join(inputDir, 'green_shield.svg'), svgContent);
svgContent = fs.readFileSync(path.join(inputDir, 'shield.svg'), 'utf8');
svgContent = svgContent.replace('<path ', '<path fill="blue" ');
fs.writeFileSync(path.join(inputDir, 'blue_shield.svg'), svgContent);


const patternIcons = fs.readdirSync(iconsDir)
  .filter(file => file.endsWith('.svg') && file.includes('pattern'));

for (let file of patternIcons) {
    fs.copyFileSync(path.join(iconsDir, file), path.join(inputDir, file));
}

// HM TODO: cross and plus patterns

// Generate sprites using the docker image
execSync(`docker run --rm -v ${inputDir}:/app/input -v ${publishDir}:/app/output ${dockerImage} input output/sprite`);