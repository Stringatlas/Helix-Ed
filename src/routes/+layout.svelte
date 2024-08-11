<script lang="ts">
    import Footer from "$lib/components/Footer.svelte";

    import BioBrawlNavbar from "$lib/components/BioBrawlNavbar.svelte";
</script>

<section id="nav">
    <BioBrawlNavbar />
</section>

<main>
    <slot></slot>
</main>

<section id="footer">
    <Footer />
</section>

<style lang="scss">
    $nav-height: 69px;

    #nav {
        position: fixed;
        top: 0;
        z-index: 1000;
        width: 100%;
    }

    main {
        min-height: calc(100vh - $nav-height);
        margin: 0;
        margin-top: $nav-height;
        color: $text-color;
    }
</style>
