<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import Footer from "$lib/components/Footer.svelte";
</script>

<section id="nav">
    <Navbar />
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
    }

    * {
        margin: 0;
        padding: 0;
    }

    main {
        // background: radial-gradient(circle at center, darken($background-color, 100%) 0%, $background-color 100%) !important;
        margin: 0;
        margin-top: $nav-height;
        color: $text-color;
    }
</style>
