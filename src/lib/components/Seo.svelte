<script lang="ts">
    import { page } from "$app/stores";

    export let title: string;
    export let description: string;
    export let image = "https://helix-ed.org/logo.png";
    export let noindex = false;

    $: canonical = `https://helix-ed.org${$page.url.pathname === "/" ? "/" : $page.url.pathname}`;
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    {#if noindex}
        <meta name="robots" content="noindex, follow" />
    {/if}

    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:site_name" content="Helix-Ed" />
    <meta property="og:locale" content="en_US" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
</svelte:head>
