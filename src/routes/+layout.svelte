<script lang="ts">
    import Footer from "$lib/components/Footer.svelte";
    import BioBrawlNavbar from "$lib/components/Navbar.svelte";
    import "../global.scss";
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
