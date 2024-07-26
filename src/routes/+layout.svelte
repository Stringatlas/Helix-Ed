<script>
    import Navbar from "$lib/components/Navbar.svelte";
</script>

<section>
    <Navbar />
</section>

<main>
    <slot></slot>
</main>

<style lang="scss">
    section {
        position: fixed;
        top: 0;
        z-index: 1000;
        width: 100%;
    }

    * {
        margin: 0;
        padding: 0;
    }

    main {
        // background: radial-gradient(circle at center, darken($background-color, 100%) 0%, $background-color 100%) !important;
        margin: 0;
        margin-top: 69px;
        color: $text-color;
    }
</style>
