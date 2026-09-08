// Apply hosted-only analytics to the approved synthetic capture. The source and
// release download remain byte-for-byte unchanged, with no analytics dependency.
import { readFileSync, writeFileSync } from 'node:fs';
const source = new URL('../../matterscope/docs/demo.html', import.meta.url);
const target = new URL('../case/matterscope-demo.html', import.meta.url);
let html = readFileSync(source, 'utf8');
if (!html.includes('captured-synthetic-matter') || html.includes('matterscope-tracking')) throw new Error('Expected original synthetic capture');
html = html.replace("script-src 'unsafe-inline';", "script-src 'self' 'unsafe-inline'; connect-src https://pulse.polyfeeds.dev;");
html = html.replace('</footer>', '<span>Hosted demo uses visit and interaction analytics. Downloaded reports stay offline.</span></footer>');
html = html.replace('</body>', '<script src="./matterscope-tracking.js" defer></script></body>');
writeFileSync(target, html);
