<script lang="ts">
    export let universities: string[];

    // Repeating each set keeps the marquee full on wide screens while the
    // second group provides the identical copy needed for a seamless loop.
    $: marqueeItems = [...universities, ...universities];
</script>

<section class="university-marquee" aria-labelledby="university-marquee-title">
    <h2 id="university-marquee-title">
        Learn from students at leading universities
    </h2>

    <p class="screen-reader-list">{universities.join(", ")}</p>
    <div class="marquee-window" aria-hidden="true">
        <div class="marquee-track">
            {#each [0, 1] as group}
                <div class="marquee-group">
                    {#each marqueeItems as university}
                        <span class="university">{university}</span>
                        <span class="separator">•</span>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</section>

<style lang="scss">
    .university-marquee {
        padding: 1.5rem 0 1.75rem;
        overflow: hidden;
        position: relative;

        h2 {
            margin: 0 auto 0.85rem;
            padding: 0 1.5rem;
            color: $accent;
            font-size: clamp(1.35rem, 2.3vw, 2rem);
            font-weight: 600;
            line-height: 1.3;
            text-align: center;
        }
    }

    .marquee-window {
        width: 100%;
        overflow: hidden;
        -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 8%,
            black 92%,
            transparent
        );
        mask-image: linear-gradient(
            to right,
            transparent,
            black 8%,
            black 92%,
            transparent
        );
    }

    .marquee-track {
        display: flex;
        width: max-content;
        animation: marquee-scroll 42s linear infinite;
    }

    .marquee-group {
        display: flex;
        flex-shrink: 0;
        align-items: center;
    }

    .university {
        padding-left: clamp(1.5rem, 3vw, 3rem);
        color: lighten($accent, 10%);
        font-size: clamp(1.05rem, 1.7vw, 1.35rem);
        font-weight: 500;
        letter-spacing: 0.02em;
        white-space: nowrap;
    }

    .separator {
        padding-left: clamp(1.5rem, 3vw, 3rem);
        color: darken($primary, 7%);
        font-size: 0.8rem;
    }

    .screen-reader-list {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    @keyframes marquee-scroll {
        to {
            transform: translateX(-50%);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .marquee-track {
            animation-play-state: paused;
        }
    }

    @media (max-width: $mobile-width) {
        .university-marquee {
            padding: 1.25rem 0 1.5rem;

            h2 {
                margin-bottom: 0.75rem;
            }
        }

        .marquee-track {
            animation-duration: 32s;
        }
    }
</style>
