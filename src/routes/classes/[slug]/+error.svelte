<script lang="ts">
    import { page } from "$app/stores";
    import Seo from "$lib/components/Seo.svelte";
</script>

<Seo
    title="Course Not Found | Helix-Ed"
    description="Sorry, we couldn't find that course at Helix-Ed."
    noindex
/>

<main>
    <section id="not-found">
        <div class="not-found-content">
            <h1>Course Not Found</h1>
            <p>Sorry, we couldn't find a course with the identifier: <strong>{$page.params.slug}</strong></p>
            <a href="/enroll" class="action-button">View All Courses</a>
        </div>
    </section>
</main>

<style lang="scss">
    main {
        min-height: calc(100vh - $nav-height);
        background: linear-gradient(135deg, $background-color 0%, rgba($primary, 0.05) 50%, rgba($secondary, 0.1) 100%);
    }

    #not-found {
        display: flex;
        min-height: 60vh;
        padding: 6rem 2rem;
        align-items: center;
        justify-content: center;
    }

    .not-found-content {
        max-width: 500px;
        padding: 4rem;
        text-align: center;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;

        h1 {
            margin-bottom: 1rem;
            color: $accent;
            font-size: 2.5rem;
        }

        p {
            margin-bottom: 2rem;
            color: $text-color;
            font-size: 1.1rem;
            line-height: 1.6;

            strong { color: $primary; }
        }
    }

    .action-button {
        display: inline-flex;
        padding: 1rem 2rem;
        color: white;
        background: linear-gradient(135deg, $primary, darken($primary, 10%));
        border-radius: 12px;
        font-weight: 600;
        text-decoration: none;
    }

    @media (max-width: $mobile-width) {
        #not-found { padding: 3rem 1rem; }
        .not-found-content {
            padding: 2.5rem 1.5rem;
            h1 { font-size: 2rem; }
            p { font-size: 1rem; }
        }
    }
</style>
