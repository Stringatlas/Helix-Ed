<script lang="ts">
	import { onMount } from 'svelte';
	import LiveResults from '$lib/components/LiveResults.svelte';
	import { createLiveClient, type LiveState } from '$lib/public/live-client';
	import type { PageData } from './$types';
	export let data: PageData;
	let state: LiveState = { bundle: null, unavailable: false, pending: false };
	let now = 0;
	let visitorZone = 'America/Los_Angeles';
	onMount(() => {
		if (!data.event || data.snapshot) return;
		now = Date.now();
		visitorZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const client = createLiveClient(data.event.eventID, value => { state = value; now = Date.now(); });
		client.start();
		// Age keeps increasing during an outage, even if no response arrives.
		const clock = setInterval(() => { now = Date.now(); }, 5000);
		return () => { clearInterval(clock); client.stop(); };
	});
</script>

<svelte:head>
	<title>{data.event?.name ?? 'BioBrawl'} · Live results</title>
	<meta name="description" content="Verified BioBrawl standings and elimination brackets, with update status and permanent results archives." />
</svelte:head>

<div class="live-page"><LiveResults event={data.event} snapshot={data.snapshot} {state} {now} {visitorZone} /></div>

<style>
	.live-page { max-width: 1280px; width: 100%; padding: 24px clamp(16px, 4vw, 48px) 64px; margin: 0 auto; box-sizing: border-box; min-width: 0; }
</style>
