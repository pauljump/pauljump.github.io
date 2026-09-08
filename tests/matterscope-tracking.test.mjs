import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../case/matterscope-tracking.js', import.meta.url), 'utf8');
function browser(url, beacon = true) {
  const messages = [], listeners = {}, storage = new Map();
  const location = new URL(url);
  const document = { visibilityState: 'visible', referrer: 'https://x.com/post?private=ignored',
    addEventListener: (type, fn) => { listeners[type] = fn; } };
  const ctx = { location, document, URL, URLSearchParams, Blob, Date,
    crypto: { randomUUID: () => 'test-visitor' },
    localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    navigator: { sendBeacon: (endpoint, blob) => { if (beacon) messages.push({endpoint, blob}); return beacon; } },
    fetch: (endpoint, options) => { messages.push({endpoint, body: options.body}); return Promise.resolve(); },
    addEventListener: (type, fn) => { listeners[type] = fn; } };
  ctx.window = ctx;
  vm.runInNewContext(source, ctx);
  return { messages, listeners, document,
    click: attrs => listeners.click({target: {closest: () => ({id: attrs.id,
      href: attrs.href, matches: selector => selector === attrs.selector,
      hasAttribute: key => key in attrs, getAttribute: key => attrs[key] })}}),
    payloads: () => Promise.all(messages.map(async m => JSON.parse(m.body || await m.blob.text()))) };
}
const hosted = 'https://pauljump.github.io/case/matterscope-demo.html?utm_source=x&utm_campaign=legora-matterscope&secret=ignored';
test('offline downloads and other hosts never emit events', () => {
  for (const url of ['file:///tmp/matterscope-demo.html', 'http://localhost:8247/case/matterscope-demo.html', 'https://example.com/case/matterscope-demo.html']) {
    assert.equal(browser(url).messages.length, 0);
  }
});
test('campaign attribution, bounded semantic interactions, and outbound source clicks', async () => {
  const b = browser(hosted);
  b.click({'data-tab': 'evidence'});
  b.click({selector: '.source-link', textContent: 'PRIVATE DOCUMENT'});
  b.click({id: 'download'});
  b.click({selector: 'a[href]', href: 'https://github.com/pauljump/matterscope?secret=ignored'});
  const events = await b.payloads();
  assert.deepEqual(events.map(e => e.event), ['page_view', 'demo:tab', 'demo:read-source', 'demo:download-draft', 'outbound:github.com']);
  assert.ok(events.every(e => e.campaign === 'legora-matterscope' && e.source === 'x'));
  assert.equal(events[0].referrer, 'https://x.com/post');
  assert.equal(events[1].props.tab, 'evidence');
  assert.ok(!JSON.stringify(events).includes('PRIVATE DOCUMENT'));
  assert.ok(!JSON.stringify(events).includes('secret'));
});
test('rejected beacon falls back to fetch and dwell is emitted', async () => {
  const b = browser(hosted, false);
  b.document.visibilityState = 'hidden';
  b.listeners.visibilitychange();
  const events = await b.payloads();
  assert.equal(events[0].event, 'page_view');
  assert.equal(events[1].event, 'page_dwell');
  assert.equal(typeof events[1].props.dwellMs, 'number');
});
test('hosted CSP permits analytics and requested stats block is gone', () => {
  const html = readFileSync(new URL('../case/matterscope-demo.html', import.meta.url), 'utf8');
  assert.ok(html.includes("connect-src https://pulse.polyfeeds.dev;"));
  assert.ok(html.includes('<script src="./matterscope-tracking.js" defer>'));
  const casePage = readFileSync(new URL('../case/index.html', import.meta.url), 'utf8');
  assert.ok(!casePage.includes('synthetic documents explicitly selected; no host project directory mounted'));
  assert.ok(casePage.includes('link_click:matterscope-demo'));
});
test('case link carries attribution into a new tab and records internal navigation', async () => {
  const html = readFileSync(new URL('../case/index.html', import.meta.url), 'utf8');
  const beacon = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('var property = "pauljump-case"'));
  const b = browser(hosted);
  b.messages.length = 0;
  // Reuse the browser fixture for the existing case beacon.
  const link = {href: 'https://pauljump.github.io/case/matterscope-demo.html'};
  const messages = [], listeners = {};
  const ctx = {URL, URLSearchParams, Blob, Date, Math,
    location: new URL('https://pauljump.github.io/case/?utm_source=x&utm_campaign=legora-matterscope#matterscope'),
    document: {visibilityState: 'visible', referrer: '', documentElement: {scrollHeight: 10000},
      querySelectorAll: selector => selector.includes('matterscope-demo.html') ? [link] : [],
      addEventListener: (type, fn) => {listeners[type] = fn;}},
    innerWidth: 1200, innerHeight: 800, scrollY: 0,
    localStorage: {getItem: () => 'test'}, sessionStorage: {getItem: () => '/case/'},
    navigator: {sendBeacon: (url, blob) => {messages.push(blob);return true;}},
    addEventListener: () => {}};
  ctx.window = ctx;
  vm.runInNewContext(beacon, ctx);
  assert.equal(new URL(link.href).searchParams.get('utm_campaign'), 'legora-matterscope');
  listeners.click({target: {closest: () => link}});
  const events = await Promise.all(messages.map(async b => JSON.parse(await b.text())));
  assert.deepEqual(events.map(e => e.event), ['page_view','link_click:matterscope-demo']);
});
