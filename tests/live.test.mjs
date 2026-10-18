import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'vite';
import { createServer as createHttpServer } from 'node:http';
import { svelte } from '@sveltejs/vite-plugin-svelte';
const server = await createServer({ configFile: false, publicDir: 'static', plugins: [svelte({ hot: false })],
	resolve: { alias: { $lib: resolve('src/lib') } },
	server: { middlewareMode: true, hmr: { server: createHttpServer() }, watch: null }, optimizeDeps: { noDiscovery: true, include: [] } });
after(() => server.close());
const { createLiveClient, isStale, ageLabel, timeLabels, LIVE_ORIGIN } = await server.ssrLoadModule('/src/lib/public/live-client.ts');
const { default: View } = await server.ssrLoadModule('/src/lib/components/LiveResults.svelte');
const { default: Standings } = await server.ssrLoadModule('/src/lib/components/LiveStandings.svelte');
const fixtures = Object.fromEntries(await Promise.all(['status', 'standings', 'bracket', 'snapshot'].map(async name => [name, JSON.parse(await readFile(`tests/fixtures/${name}.json`, 'utf8'))])));
const event = { eventID: '2027', year: 2027, name: 'BioBrawl 2027', date: 'January 16, 2027', time: '8am–5pm Pacific time' };
const epoch = Date.parse(fixtures.status.updatedAt);
const settle = async () => { for (let i = 0; i < 3; i++) await new Promise(resolve => setImmediate(resolve)); };
function fakeClock() {
	let now = epoch + 20_000, id = 0;
	const timers = new Map();
	return { now: () => now, setTimeout: (fn, ms) => { const key = ++id; timers.set(key, { at: now + ms, fn }); return key; },
		clearTimeout: key => timers.delete(key), timers,
		async advance(ms) {
			const until = now + ms;
			for (;;) {
				const next = [...timers].filter(([, t]) => t.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
				if (!next) break;
				now = next[1].at; timers.delete(next[0]); next[1].fn(); await settle();
			}
			now = until; await settle();
		}
	};
}
function harness() {
	const clock = fakeClock(), calls = [], states = [];
	let reply = endpoint => structuredClone(fixtures[endpoint]);
	const wire = async (url, options) => {
		const endpoint = url.split('/').at(-1); calls.push({ url, options });
		const body = await reply(endpoint);
		return body instanceof Response ? body : { ok: true, json: async () => body };
	};
	const client = createLiveClient('2027', value => states.push(value), { fetch: wire, clock });
	return { client, clock, calls, states, state: () => states.at(-1), reply: fn => { reply = fn; } };
}
const bundle = () => ({ ...structuredClone(fixtures), updatedAt: fixtures.status.updatedAt });

test('a fresh cycle uses only three credential-free, fixed-origin HTTP GETs and exact C3 parsers', async () => {
	const h = harness(); h.client.start(); await settle();
	assert.equal(h.calls.length, 3);
	assert.equal(h.state().bundle.status.phase, 'complete');
	assert.equal(h.state().pending, false);
	assert.equal(h.state().unavailable, false);
	for (const call of h.calls) {
		assert.ok(call.url.startsWith(`${LIVE_ORIGIN}/api/public/v1/events/2027/`));
		assert.equal(call.options.credentials, 'omit'); assert.equal(call.options.redirect, 'error');
		assert.equal(call.options.mode, 'cors'); assert.ok(call.options.signal instanceof AbortSignal);
		assert.equal(call.options.headers, undefined);
	}
	h.client.stop(); assert.equal(h.clock.timers.size, 0);
	assert.throws(() => createLiveClient('../2027', () => {}));
});

test('complete continues polling at 30 seconds and a reopen resumes ten-second polling', async () => {
	const h = harness(); h.client.start(); await settle();
	await h.clock.advance(29_999); assert.equal(h.calls.length, 3);
	h.reply(endpoint => ({ ...structuredClone(fixtures[endpoint]), phase: 'bracket' }));
	await h.clock.advance(1); assert.equal(h.calls.length, 6); assert.equal(h.state().bundle.status.phase, 'bracket');
	await h.clock.advance(10_000); assert.equal(h.calls.length, 9); h.client.stop();
});

test('a partial failure retains the whole last bundle, marks it unavailable and recovers', async () => {
	const h = harness(); h.client.start(); await settle(); const previous = h.state().bundle;
	h.reply(endpoint => endpoint === 'bracket' ? new Response('PRIVATE upstream body', { status: 503 }) : ({ ...fixtures[endpoint], phase: 'bracket' }));
	h.client.refresh(); await settle();
	assert.deepEqual(h.state().bundle, previous); assert.equal(h.state().unavailable, true);
	assert.equal(isStale(h.state(), h.clock.now()), true);
	assert.doesNotMatch(JSON.stringify(h.states), /PRIVATE upstream body/);
	h.reply(endpoint => structuredClone(fixtures[endpoint])); h.client.refresh(); await settle();
	assert.equal(h.state().unavailable, false); h.client.stop();
});

test('wrong event, mixed phases, schema drift and unverified scores cannot replace the last bundle', async () => {
	for (const mutate of [
		f => { f.status.eventID = '2026'; },
		f => { f.bracket.phase = 'bracket'; },
		f => { f.standings.divisions[0].pools[0].standings[0].team.roster = ['PRIVATE']; },
		f => { f.bracket.divisions[0].matches[0].verified = false; },
		f => { f.status.updatedAt = 'not an instant'; },
		f => { f.bracket.generatedAt = '2099-01-01T00:00:00Z'; }
	]) {
		const h = harness(); h.client.start(); await settle(); const previous = h.state().bundle;
		const changed = structuredClone(fixtures); mutate(changed); h.reply(endpoint => changed[endpoint]);
		h.client.refresh(); await settle(); assert.deepEqual(h.state().bundle, previous); assert.equal(h.state().unavailable, true); h.client.stop();
	}
});

test('a hung transport or body is bounded to two seconds even when it ignores abort', async () => {
	for (const hung of ['transport', 'body']) {
		const clock = fakeClock(), states = []; let calls = 0;
		const client = createLiveClient('2027', value => states.push(value), { clock, fetch: async () => {
			calls++;
			if (hung === 'transport') return new Promise(() => {});
			return { ok: true, json: () => new Promise(() => {}) };
		} });
		client.start(); client.refresh(); await settle(); assert.equal(calls, 3);
		await clock.advance(1999); assert.equal(states.at(-1).pending, true);
		await clock.advance(1); assert.equal(states.at(-1).pending, false); assert.equal(states.at(-1).unavailable, true);
		assert.equal(states.at(-1).bundle, null); assert.equal(calls, 3);
		await clock.advance(9999); assert.equal(calls, 3);
		await clock.advance(1); assert.equal(calls, 6); client.stop();
	}
});

test('stop aborts in-flight work and late replies cannot emit or schedule another poll', async () => {
	const h = harness(); const waiting = [];
	h.reply(endpoint => new Promise(resolve => waiting.push(() => resolve(fixtures[endpoint]))));
	h.client.start(); h.client.refresh(); assert.equal(h.calls.length, 3);
	h.client.stop(); const emitted = h.states.length;
	assert.ok(h.calls.every(call => call.options.signal.aborted));
	for (const resolve of waiting) resolve(); await settle();
	assert.equal(h.states.length, emitted); assert.equal(h.clock.timers.size, 0);
	await h.clock.advance(60_000); assert.equal(h.calls.length, 3);
});

test('age uses the oldest server timestamp, rejects rollback and marks old successful responses stale', async () => {
	const h = harness(); h.reply(endpoint => endpoint === 'standings' ? { ...fixtures[endpoint], generatedAt: '2027-01-17T00:59:00Z' } : fixtures[endpoint]);
	h.client.start(); await settle();
	assert.equal(h.state().bundle.updatedAt, '2027-01-17T00:59:00Z');
	assert.equal(isStale(h.state(), h.clock.now()), true);
	const previous = h.state().bundle;
	h.reply(endpoint => ({ ...fixtures[endpoint], ...(endpoint === 'status' ? { updatedAt: '2027-01-17T00:58:00Z' } : {}) }));
	h.client.refresh(); await settle(); assert.deepEqual(h.state().bundle, previous); assert.equal(h.state().unavailable, true); h.client.stop();
	assert.equal(ageLabel(fixtures.status.updatedAt, epoch + 20_000), '20 seconds ago');
	assert.equal(ageLabel(fixtures.status.updatedAt, epoch + 120_000), '2 minutes ago');
});

test('timestamps label the visitor and event zones, including a different local date', () => {
	const labels = timeLabels('2027-01-17T01:00:00Z', 'Asia/Tokyo');
	assert.match(labels.visitor, /Jan 17/); assert.match(labels.event, /Jan 16.*PST/);
	assert.equal(timeLabels('2027-01-17T01:00:00Z', 'America/Los_Angeles').event, null);
});

test('SSR is a useful static shell and performs no live request', async () => {
	const previous = globalThis.fetch; let calls = 0;
	globalThis.fetch = () => { calls++; throw new Error('No server-side live fetch'); };
	try {
		const route = await server.ssrLoadModule('/src/routes/live/+page.server.ts');
		assert.equal(route.prerender, true);
		const catalog = JSON.parse(await readFile('static/data/events.json', 'utf8'));
		assert.equal(route.load().event?.eventID ?? null, catalog.find(event => event.active)?.eventID ?? null);
		const html = View.render({ event }).html;
		assert.match(html, /Live results are temporarily unavailable/);
		assert.match(html, /Final results will be posted here after the event/);
		assert.match(html, /Pacific time/); assert.doesNotMatch(html, /<iframe|Checking for live/);
		assert.equal(calls, 0);
		assert.match(View.render({ event: null }).html, /No current competition/);
	} finally { globalThis.fetch = previous; }
});

test('live UI shows supplied rankings, ties, pending totals and resolution notes without recomputing', () => {
	const standings = structuredClone(fixtures.standings);
	const rows = standings.divisions[0].pools[0].standings;
	rows[0].rank = 2; rows[0].ties = 1; rows[0].rankingPoints = null; rows[0].provisional = true; rows[0].unresolved = 'COIN_FLIP_NEEDED';
	rows[1].decidedBy = 'TIEBREAKER_MATCH'; standings.divisions[0].pools[0].pool = 'Pool A';
	const html = Standings.render({ standings }).html;
	for (const text of ['Pool A', 'Pending', 'Provisional.', 'Coin flip needed.', 'Tiebreaker match.', 'Points against', '>T<']) assert.ok(html.includes(text), text);
	assert.ok(html.indexOf('Atlas') < html.indexOf('Birch'));
});

test('live, complete and stale renderings preserve scores only behind the verified union', () => {
	const state = { bundle: bundle(), unavailable: false, pending: false };
	const html = View.render({ event, state, now: epoch + 20_000, visitorZone: 'America/New_York' }).html;
	for (const text of ['Competition complete', 'awaiting publication', '20 seconds ago', 'Event time:', 'EST', 'PST', 'Round-robin standings', 'DE7', 'Reset not needed']) assert.ok(html.includes(text), text);
	assert.doesNotMatch(html, /Results published/);
	const stale = View.render({ event, state: { ...state, unavailable: true }, now: epoch + 120_000 }).html;
	assert.match(stale, /Live updates unavailable/); assert.match(stale, /last successful update/); assert.match(stale, /2 minutes ago/); assert.match(stale, /Atlas/);
	const invalidMatch = state.bundle.bracket.divisions[0].matches[0]; invalidMatch.status = 'in_progress'; invalidMatch.verified = false; invalidMatch.scoreTop = 987654;
	assert.doesNotMatch(View.render({ event, state, now: epoch }).html, /987654/);
});

test('a committed current-year snapshot takes precedence even with failed or retained live data', () => {
	const html = View.render({ event, snapshot: fixtures.snapshot, state: { bundle: bundle(), unavailable: true, pending: false }, now: epoch }).html;
	for (const text of ['Results archive available', '/results/2027', 'placements', 'Atlas', 'DE7']) assert.ok(html.includes(text), text);
	assert.doesNotMatch(html, /Live updates unavailable|awaiting publication|Round-robin standings/);
});


test('a fresh HTTP or malformed-JSON failure has no payload or upstream details to render', async () => {
	for (const reply of [() => new Response('PRIVATE denied', { status: 403 }), () => new Response('{invalid JSON'), () => { throw new Error('PRIVATE network failure'); }]) {
		const h = harness(); h.reply(reply); h.client.start(); await settle();
		assert.equal(h.state().bundle, null); assert.equal(h.state().unavailable, true); assert.equal(h.state().pending, false);
		const html = View.render({ event, state: h.state(), now: h.clock.now() }).html;
		assert.match(html, /Live results are temporarily unavailable/); assert.doesNotMatch(html, /PRIVATE|invalid JSON/); h.client.stop();
	}
});


test('the production browser wrappers preserve the global receiver for fetch and timers (F-207)', async () => {
	const original = { fetch: globalThis.fetch, setTimeout: globalThis.setTimeout, clearTimeout: globalThis.clearTimeout };
	let reads = 0, scheduled = 0, cleared = 0, key = 0;
	globalThis.fetch = async function(url) {
		assert.equal(this, globalThis); reads++;
		const endpoint = String(url).split('/').at(-1), body = structuredClone(fixtures[endpoint]);
		body[endpoint === 'status' ? 'updatedAt' : 'generatedAt'] = new Date().toISOString();
		return { ok: true, json: async () => body };
	};
	globalThis.setTimeout = function() { assert.equal(this, globalThis); scheduled++; return ++key; };
	globalThis.clearTimeout = function() { assert.equal(this, globalThis); cleared++; };
	const states = [], client = createLiveClient('2027', value => states.push(value));
	try {
		client.start(); await settle();
		assert.equal(reads, 3); assert.equal(scheduled, 2); assert.ok(cleared >= 1);
		assert.ok(states.at(-1).bundle); assert.equal(states.at(-1).unavailable, false);
	} finally { client.stop(); Object.assign(globalThis, original); }
});
