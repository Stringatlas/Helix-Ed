<script lang="ts">
    export let data: Record<string, unknown>;
    $: json = JSON.stringify(data).replace(/</g, "\\u003c");
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${json}</script>`}
</svelte:head>
