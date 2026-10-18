<script lang="ts">
    import Footer from "$lib/components/Footer.svelte";
    import BioBrawlNavbar from "$lib/components/Navbar.svelte";
    import "../global.scss";
    import { page } from "$app/stores";
    import type { LayoutData } from "./$types";
    export let data: LayoutData;
    
</script>

<svelte:head>
    {#if !$page.url.pathname.startsWith('/results/')}
        <title>HelixEd BioBrawl</title>
        <meta name="description" content="BioBrawl, the HelixEd biology competition." />
    {/if}
</svelte:head>

<div class="app-layout">
    <BioBrawlNavbar events={data.events} />
    
    <main class="main-content">
        <slot></slot>
    </main>
    
    <Footer />
</div>

<style lang="scss">
    .app-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .main-content {
        flex: 1;
        width: 100%;
    }
</style>
