import { parsePublicBracket, parsePublicStandings, parsePublicStatus } from './parse';
import type { PublicBracketPayload, PublicStandingsPayload, PublicStatusPayload } from './types';

/** `05` §4 and `09` §11.1: one bounded HTTP cycle replaces the public view.
 * A partial cycle never combines new standings with an old bracket. Errors
 * retain the last complete public bundle, and disposal excludes late replies.
 * No Firebase client, auth credential, socket or browser storage is involved. */
export const LIVE_ORIGIN = 'https://score.biobrawl.helix-ed.org';
export const LIVE_INTERVAL = 10_000;
export const COMPLETE_INTERVAL = 30_000;
export const REQUEST_TIMEOUT = 2_000;
export const STALE_AFTER = 60_000;
export interface LiveBundle {
	status: PublicStatusPayload;
	standings: PublicStandingsPayload;
	bracket: PublicBracketPayload;
	/** Oldest materialization, rather than the browser's receipt time. */
	updatedAt: string;
}
export interface LiveState { bundle: LiveBundle | null; unavailable: boolean; pending: boolean }
interface Clock {
	now(): number;
	setTimeout(callback: () => void, ms: number): ReturnType<typeof setTimeout>;
	clearTimeout(timer: ReturnType<typeof setTimeout>): void;
}
// Browser timer APIs require their Window receiver; copying the functions
// into a plain clock object works in Node but throws in Chrome (F-207).
const realClock: Clock = { now: () => Date.now(),
	setTimeout: (callback, ms) => globalThis.setTimeout(callback, ms),
	clearTimeout: timer => globalThis.clearTimeout(timer) };

export function createLiveClient(eventID: string, changed: (state: LiveState) => void,
	options: { fetch?: typeof fetch; clock?: Clock } = {}) {
	if (!/^\d{4}$/.test(eventID)) throw new Error('Invalid event year');
	const wire: typeof fetch = options.fetch ?? ((input, init) => globalThis.fetch(input, init));
	const clock = options.clock ?? realClock;
	let state: LiveState = { bundle: null, unavailable: false, pending: false };
	let stopped = false;
	let started = false;
	let inFlight = false;
	let next: ReturnType<typeof setTimeout> | undefined;
	let active: AbortController | undefined;
	const emit = () => changed({ ...state });

	async function poll() {
		if (stopped || inFlight) return;
		if (next !== undefined) clock.clearTimeout(next);
		inFlight = true;
		state = { ...state, pending: true }; emit();
		const controller = new AbortController(); active = controller;
		let deadline: ReturnType<typeof setTimeout> | undefined;
		const cancelled = new Promise<never>((_, reject) => {
			controller.signal.addEventListener('abort', () => reject(new Error('Live request unavailable')), { once: true });
			deadline = clock.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
		});
		try {
			const read = async <T>(endpoint: string, parse: (v: unknown) => T) => {
				const response = await wire(`${LIVE_ORIGIN}/api/public/v1/events/${eventID}/${endpoint}`, {
					signal: controller.signal, credentials: 'omit', redirect: 'error', mode: 'cors'
				});
				if (!response.ok) throw new Error('Live request unavailable');
				return parse(await response.json());
			};
			const [status, standings, bracket] = await Promise.race([
				Promise.all([read('status', parsePublicStatus), read('standings', parsePublicStandings), read('bracket', parsePublicBracket)]),
				cancelled
			]);
			// A request can straddle an origin-cache refresh. Reject mixed phases
			// rather than presenting an internally contradictory competition view.
			if ([status, standings, bracket].some(value => value.eventID !== eventID || value.phase !== status.phase))
				throw new Error('Live request unavailable');
			const times = [status.updatedAt, standings.generatedAt, bracket.generatedAt];
			if (times.some(value => Date.parse(value) > clock.now() + 30_000)) throw new Error('Live request unavailable');
			const updatedAt = times.reduce((oldest, value) => Date.parse(value) < Date.parse(oldest) ? value : oldest);
			if (state.bundle && Date.parse(updatedAt) < Date.parse(state.bundle.updatedAt)) throw new Error('Live request unavailable');
			if (!stopped) state = { bundle: { status, standings, bracket, updatedAt }, unavailable: false, pending: false };
		} catch {
			if (!stopped) state = { ...state, unavailable: true, pending: false };
		} finally {
			if (deadline !== undefined) clock.clearTimeout(deadline);
			controller.abort(); active = undefined; inFlight = false;
			if (!stopped) {
				emit();
				// Complete is reversible and is not publication (D-180). Keep polling
				// at a lower rate until a rebuild supplies the committed archive.
				next = clock.setTimeout(() => { void poll(); }, state.bundle?.status.phase === 'complete' ? COMPLETE_INTERVAL : LIVE_INTERVAL);
			}
		}
	}
	return {
		start() { if (!started && !stopped) { started = true; void poll(); } },
		refresh() { if (started) void poll(); },
		stop() { stopped = true; if (next !== undefined) clock.clearTimeout(next); active?.abort(); }
	};
}

export const isStale = (state: LiveState, now: number) => Boolean(state.bundle &&
	(state.unavailable || now - Date.parse(state.bundle.updatedAt) > STALE_AFTER));
export function ageLabel(instant: string, now: number): string {
	const seconds = Math.max(0, Math.floor((now - Date.parse(instant)) / 1000));
	return seconds < 60 ? `${seconds} seconds ago` : `${Math.floor(seconds / 60)} minutes ago`;
}
export function timeLabels(instant: string, visitorZone: string) {
	const format = (timeZone: string) => new Intl.DateTimeFormat('en-US', {
		month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short', timeZone
	}).format(new Date(instant));
	return { visitor: format(visitorZone), event: visitorZone === 'America/Los_Angeles' ? null : format('America/Los_Angeles') };
}
