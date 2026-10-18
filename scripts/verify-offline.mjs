import { cp, mkdtemp, mkdir, readFile, writeFile, symlink, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
const temp = await mkdtemp(join(tmpdir(), 'biobrawl-archive-proof-'));
try {
	await cp(root, temp, { recursive: true, filter: path => {
		const first = relative(root, path).split('/')[0];
		return !['.git', 'node_modules', '.svelte-kit', '.vercel', 'build', '.env'].includes(first) && !first.startsWith('.env.');
	} });
	await symlink(join(root, 'node_modules'), join(temp, 'node_modules'), 'dir');
	// The synthetic example is added only inside this disposable build, never to
	// the site's published static/ directory. It proves a JSON-only results PR.
	const fixture = JSON.parse(await readFile(join(root, 'tests/fixtures/snapshot.json'), 'utf8'));
	// Reserve a test year so a real results/2027.json PR still passes this proof.
	fixture.eventID = '2099'; fixture.year = 2099;
	fixture.date = '2099-01-16'; fixture.name = 'BioBrawl 2099 — synthetic archive proof';
	const snapshotPath = join(temp, `static/data/results/${fixture.eventID}.json`);
	await assert.rejects(access(snapshotPath), 'The proof must not overwrite a committed snapshot');
	await mkdir(resolve(snapshotPath, '..'), { recursive: true });
	await writeFile(snapshotPath, JSON.stringify(fixture));
	const audit = join(temp, 'network-attempts.log');
	await writeFile(audit, '');
	const guard = join(temp, 'scripts/block-network.mjs');
	const env = { ...process.env, BIOBRAWL_NETWORK_AUDIT: audit,
		NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ''} --import=${guard}` };
	// Prove the guard is actually active before trusting a quiet audit log.
	const probe = spawnSync(process.execPath, ['--input-type=module', '-e', `
		import http from 'node:http';
		import https from 'node:https';
		import net from 'node:net';
		for (const attempt of [() => fetch('https://cdn.sanity.io'),
			() => http.get('http://score.biobrawl.helix-ed.org'),
			() => https.get('https://score.biobrawl.helix-ed.org'),
			() => new net.Socket().connect(443, 'cdn.sanity.io')]) {
			try { await attempt(); process.exit(1); }
			catch (error) { if (!error.message.includes('Outbound network is blocked')) throw error; }
		}
	`], { cwd: temp, env, encoding: 'utf8', timeout: 10000 });
	assert.equal(probe.status, 0, probe.stderr);
	assert.equal((await readFile(audit, 'utf8')).trim().split('\n').length, 4);
	await writeFile(audit, '');
	const run = spawnSync(process.execPath, [join(root, 'node_modules/vite/bin/vite.js'), 'build'], {
		cwd: temp, env, encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024
	});
	if (run.status !== 0) throw new Error(`Offline build failed\n${run.stdout}\n${run.stderr}`);
	assert.equal(await readFile(audit, 'utf8'), '', 'Build attempted an external request');
	for (const year of ['2024', '2025', '2026', fixture.eventID]) {
		const html = await readFile(join(temp, `.svelte-kit/output/prerendered/pages/results/${year}.html`), 'utf8');
		assert.ok(html.includes(`BioBrawl ${year}`) || html.includes(`Bio Brawl ${year}`));
		assert.ok(html.includes('https://www.helix-ed.org'));
		assert.ok(html.includes(`/results/${fixture.eventID}`), 'New snapshot must appear in shared navigation');
		assert.doesNotMatch(html, /<iframe|TKTK|Event not found|cdn\.sanity\.io|https:\/\/www\."/);
		assert.equal((html.match(/<title>/g) ?? []).length, 1, 'Archive title must not be shadowed by the app template');
		if (year === fixture.eventID) {
			assert.ok(html.includes(fixture.name));
			assert.ok(html.includes('32 students played'));
			for (const match of fixture.results.bracketData[0].matches) assert.ok(html.includes(`data-slot="${match.id}"`));
		} else assert.ok(html.includes('have not been independently verified'));
		// This is deployment output, not merely a successful Vite compilation.
		await access(join(temp, `.vercel/output/static/results/${year}.html`));
	}
	const config = JSON.parse(await readFile(join(temp, 'vercel.json'), 'utf8'));
	assert.ok(config.headers.some(route => route.source === '/(.*)' && route.headers.some(header => header.key === 'X-Content-Type-Options' && header.value === 'nosniff')), 'Static security headers must be configured at the hosting layer');
	console.log('Offline archive proof passed: four prerendered results pages and Vercel static output, zero network attempts.');
} finally {
	await rm(temp, { recursive: true, force: true });
}
