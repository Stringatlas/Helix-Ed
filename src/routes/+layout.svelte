<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import Footer from "$lib/components/Footer.svelte";

    import { page } from "$app/stores";
    import { derived } from "svelte/store";

    const isBioBrawl = derived(page, ($page) => {
        return $page.url.pathname.startsWith("/bio-brawl");
    });

    const organizationJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Helix-Ed',
        url: 'https://helix-ed.org',
        logo: 'https://helix-ed.org/logo.png',
        sameAs: [
            'https://www.instagram.com/realhelixed',
            'https://www.linkedin.com/company/102697298/',
            'https://www.facebook.com/profile.php?id=61563365050376'
        ]
    };
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${JSON.stringify(organizationJsonLd)}</script>`}
</svelte:head>

<section id="nav">
    <Navbar />
</section>

<div class="page-content">
    <slot></slot>
</div>

<section id="footer">
    <Footer />
</section>

<style lang="scss">
    #nav {
        position: fixed;
        top: 0;
        z-index: 1000;
        width: 100%;
    }

    .page-content {
        min-height: calc(100vh - $nav-height);
    }

    * {
        margin: 0;
        padding: 0;
    }

    .page-content {
        // background: radial-gradient(circle at center, darken($background-color, 100%) 0%, $background-color 100%) !important;
        margin: 0;
        margin-top: $nav-height;
        color: $text-color;
    }
</style>
