<script lang="ts">
    import Footer from "$lib/components/Footer.svelte";
    import BioBrawlNavbar from "$lib/components/Navbar.svelte";
    import "../global.scss";
    import { onMount } from "svelte";
    
    // Prefetch critical routes on mount for better navigation performance
    onMount(() => {
        if (typeof window !== 'undefined') {
            // Prefetch FAQ page after a short delay
            setTimeout(() => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = '/faq';
                document.head.appendChild(link);
            }, 2000);
        }
    });
</script>

<div class="app-layout">
    <BioBrawlNavbar />
    
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
