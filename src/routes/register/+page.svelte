<script>
    import { goto } from "$app/navigation";
    import { currentEvent } from "$lib/stores";
</script>

<div class="page">
    <div class="header">
        <h1>Register for Biobrawl 2025</h1>
    </div>
    <div class="body">
        <button class="primary" on:click={() => (window.location.href = $currentEvent.registration.link)}>Register with Google Forms</button>
        <button class="secondary" on:click={() => (window.location.href = $currentEvent.registration.alternativeLink)}>Register through WeChat</button>
    </div>
</div>

<style lang="scss">
    .page {
        display: flex;
        align-items: center;
        flex-direction: column;
        .header {
            background-color: rgb(96, 145, 109);
            width: 100vw;
            padding: 6rem 0;
            text-align: center;
            h1 {
                font-size: 3rem;
                color: white;
            }
        }

        .body {
            margin-top: 3rem;
            display: flex;
            flex-direction: row;
            gap: 2rem;
            align-items: center;
        }
    }

    .primary {
        @include button-primary;
        font-size: 2rem;
        font-weight: bold;
        padding: 1rem 2rem;
        border-radius: 1rem;
    }

    .secondary {
        @include button-secondary;
        font-size: 2rem;
        font-weight: bold;
        padding: 1rem 2rem;
        border-radius: 1rem;
    }

    @media (max-width: $mobile-width) {
        .page > .body {
            flex-direction: column;
            padding: 16px;
        }
    }
</style>
