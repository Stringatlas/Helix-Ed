import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'vite';
import { createServer as createHttpServer } from 'node:http';
const unboundHttp = createHttpServer();
import { svelte } from '@sveltejs/vite-plugin-svelte';

const server = await createServer({ configFile: false, publicDir: 'static', plugins: [svelte({ hot: false })],
	resolve: { alias: { $lib: resolve('src/lib') } },
	server: { middlewareMode: true, hmr: { server: unboundHttp }, watch: null }, optimizeDeps: { noDiscovery: true, include: [] } });
after(() => server.close());
const { parseArchive, parseArchiveFile } = await server.ssrLoadModule('/src/lib/public/archive.ts');
const { bracketView } = await server.ssrLoadModule('/src/lib/public/bracket-view.ts');
const { readArchive, archiveYears, navigationEvents } = await server.ssrLoadModule('/src/lib/server/archives.ts');
const { default: Match } = await server.ssrLoadModule('/src/lib/components/BracketMatch.svelte');
const { default: Page } = await server.ssrLoadModule('/src/routes/results/[eventID]/+page.svelte');
const fixture = JSON.parse(await readFile('tests/fixtures/snapshot.json', 'utf8'));
const copy = value => structuredClone(value);

test('the scoring app snapshot is accepted without adapting its contract', () => {
	assert.deepEqual(parseArchive(fixture, '2027'), { kind: 'snapshot', snapshot: fixture });
});
test('filenames and metadata must agree; paths and unknown schema versions fail', () => {
	assert.throws(() => parseArchive(fixture, '2028'));
	assert.throws(() => parseArchive(fixture, '../2027'));
	assert.throws(() => parseArchive({ ...fixture, snapshotVersion: 2 }, '2027'));
});
test('operational fields cannot be silently copied into archived results', () => {
	for (const mutate of [f => f.token = 'secret', f => f.results.bracketData[0].matches[0].teamTop.roster = ['Name']]) {
		const input = copy(fixture); mutate(input);
		assert.throws(() => parseArchive(input, '2027'));
	}
});
test('unverified scores are rejected at the archive boundary', () => {
	const input = copy(fixture);
	const match = input.results.bracketData[0].matches[0];
	match.status = 'in_progress'; match.verified = false;
	assert.throws(() => parseArchive(input, '2027'));
});
test('existing years are discoverable; a missing year has no CMS fallback', () => {
	for (const year of ['2024', '2025', '2026']) assert.ok(archiveYears().includes(year));
	assert.equal(readArchive('2099'), null);
	assert.equal(readArchive('../2026'), null);
	for (const year of archiveYears()) assert.ok(navigationEvents().some(event => event.hasResults && event.eventID === year));
});
test('legacy years preserve published placements without inventing participation', () => {
	const archive = readArchive('2026');
	assert.equal(archive.kind, 'legacy');
	assert.deepEqual(archive.legacy.divisions.map(d => d.places[0].team), ['Thiamine', 'Dazzling DNA', 'Wayzata']);
	for (const year of archiveYears()) {
		const archive = readArchive(year);
		if (archive.kind !== 'legacy') continue;
		const legacy = archive.legacy;
		assert.equal(legacy.provenance.unverifiedYear, true);
		assert.equal('participation' in legacy, false);
		assert.equal('snapshotVersion' in legacy, false);
	}
});
test('legacy records reject schema drift and unsafe bracket URLs', () => {
	const input = copy(readArchive('2026').legacy);
	assert.throws(() => parseArchive({ ...input, participation: { studentsPlayed: 50 } }, '2026'));
	assert.throws(() => parseArchive({ ...input, bracketUrl: 'javascript:alert(1)' }, '2026'));
	assert.throws(() => parseArchive({ ...input, provenance: { ...input.provenance, unverifiedYear: false } }, '2026'));
});
test('native bracket renders all fifteen slots and twenty-two feeder edges', () => {
	const view = bracketView(fixture.results.bracketData[0]);
	assert.equal(view.nodes.length, 15);
	assert.equal(view.groups.length, 7);
	assert.equal(view.edges.length, 22);
	assert.equal(new Set(view.nodes.map(node => node.match.id)).size, 15);
	assert.ok(view.nodes.every(node => node.x >= 0 && node.y >= 0));
	assert.equal(view.currentRound, 6);
});
test('match cards show scores only on a verified final, including defensive rendering', () => {
	const match = copy(fixture.results.bracketData[0].matches[0]);
	const final = Match.render({ match }).html;
	assert.ok(final.includes('Verified final'));
	assert.ok(final.includes('class="score'));
	for (const status of ['scheduled', 'in_progress', 'walkover', 'empty', 'not_needed', 'unresolved']) {
		const html = Match.render({ match: { ...match, status, verified: false, scoreTop: 987654, scoreBottom: 876543 } }).html;
		assert.doesNotMatch(html, /987654|876543|class="score/);
	}
});
test('a canonical snapshot renders podium, participation, provenance and native bracket offline', () => {
	const { html, head } = Page.render({ data: { archive: parseArchive(fixture, '2027') } });
	for (const value of ['32 students played', '40 students rostered', 'Source:', 'DE7', 'View full bracket', 'Reset not needed']) assert.ok(html.includes(value), value);
	assert.ok(head.includes(fixture.name));
	assert.doesNotMatch(html, /<iframe|TKTK|Event not found/);
});
test('historical pages clearly retain their limits without publishing placeholder claims', () => {
	for (const year of archiveYears()) {
		const archive = readArchive(year);
		if (archive.kind !== 'legacy') continue;
		const html = Page.render({ data: { archive } }).html;
		assert.ok(html.includes('have not been independently verified'));
		assert.ok(html.includes('Open historical bracket source'));
		assert.doesNotMatch(html, /<iframe|TKTK|14 teams|56 participants/);
	}
});


test('canonical and legacy directories cannot be used interchangeably', () => {
	const legacy = readArchive('2026').legacy;
	assert.throws(() => parseArchiveFile('/static/data/results/2026.json', JSON.stringify(legacy), 'snapshot'));
	assert.throws(() => parseArchiveFile('/static/data/legacy-results/2027.json', JSON.stringify(fixture), 'legacy'));
	assert.throws(() => parseArchiveFile('/static/data/results/current.json', JSON.stringify(fixture), 'snapshot'));
	assert.throws(() => parseArchiveFile('/static/data/results/2027.json', '{', 'snapshot'));
});
test('the actual route enumerates archives and returns a real 404 for an absent year', async () => {
	const route = await server.ssrLoadModule('/src/routes/results/[eventID]/+page.server.ts');
	assert.equal(route.prerender, true);
	assert.deepEqual(route.entries(), archiveYears().map(eventID => ({ eventID })));
	assert.equal(route.load({ params: { eventID: '2026' } }).archive.kind, 'legacy');
	assert.throws(() => route.load({ params: { eventID: '2099' } }), error => error.status === 404);
});
