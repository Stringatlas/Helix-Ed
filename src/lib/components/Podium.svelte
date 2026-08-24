<script lang="ts">
    import { onMount } from 'svelte';
    import type { Place } from '$lib/types';

    /**
     * Preferred API: an arbitrary number of places, so a division with only a
     * first and second can render without an empty third plinth.
     */
    export let places: Place[] = [];

    /** Legacy three-slot API, kept for events stored before divisions existed. */
    export let first: string | undefined = undefined;
    export let second: string | undefined = undefined;
    export let third: string | undefined = undefined;

    const MEDAL_CLASSES = ['gold', 'silver', 'bronze'];

    // Falling back to the three fixed slots preserves the old behaviour of
    // showing three 'TBD' plinths for an event whose results aren't in yet.
    $: resolved =
        places.length > 0
            ? [...places].sort((a, b) => a.rank - b.rank)
            : [
                  { rank: 1, team: first || 'TBD' },
                  { rank: 2, team: second || 'TBD' },
                  { rank: 3, team: third || 'TBD' }
              ];

    // Tallest in the middle: second on the left, first centre, third on the
    // right. With only two places that naturally becomes [second, first].
    $: ordered = (() => {
        const byRank = new Map(resolved.map((p) => [p.rank, p]));
        const podiumOrder = [2, 1, 3].map((r) => byRank.get(r)).filter(Boolean) as Place[];
        const remaining = resolved.filter((p) => p.rank > 3);
        return [...podiumOrder, ...remaining];
    })();

    let podiumContainer: HTMLElement;
    let uniformWidth = 160; // Default width

    onMount(() => {
        if (podiumContainer) {
            calculateUniformWidth();
        }
    });

    // Re-measure when the teams change, otherwise a division rendered after the
    // first paint keeps the previous division's tile width.
    $: if (podiumContainer && ordered) {
        calculateUniformWidth();
    }

    function calculateUniformWidth() {
        if (!podiumContainer) return;

        // Create a temporary element to measure text width
        const measurer = document.createElement('div');
        measurer.style.position = 'absolute';
        measurer.style.visibility = 'hidden';
        measurer.style.whiteSpace = 'nowrap';
        measurer.style.fontSize = window.innerWidth <= 768 ? '0.875rem' : '1rem';
        measurer.style.fontWeight = '600';
        measurer.style.fontFamily = getComputedStyle(document.body).fontFamily;
        document.body.appendChild(measurer);

        const names = ordered.map((p) => p.team).filter(Boolean) as string[];
        let maxWidth = 120; // Minimum width

        names.forEach(name => {
            measurer.textContent = name;
            const textWidth = measurer.offsetWidth;
            // Add padding (32px) and some extra space (16px) for wrapping
            const neededWidth = Math.min(textWidth + 48, 200);
            maxWidth = Math.max(maxWidth, neededWidth);
        });

        document.body.removeChild(measurer);
        uniformWidth = maxWidth;

        // Apply the uniform width to all podiums
        const podiums = podiumContainer.querySelectorAll('.podium') as NodeListOf<HTMLElement>;
        podiums.forEach(podium => {
            podium.style.width = `${uniformWidth}px`;
        });
    }
</script>

<div class="podium-container" bind:this={podiumContainer}>
    {#each ordered as place (place.rank)}
        <div class="podium" data-place={Math.min(place.rank, 3)}>
            <div class="medal {MEDAL_CLASSES[place.rank - 1] ?? 'bronze'}">{place.rank}</div>
            <div class="team-name">{place.team || 'TBD'}</div>
            {#if place.award}
                <div class="award">${place.award}</div>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
    .podium-container {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        height: 350px;
        padding: $spacing-xl;
        margin: $spacing-2xl 0;
        
        @media (max-width: $mobile-width) {
            height: 280px;
            padding: $spacing-lg;
        }
    }

    .podium {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        margin: 0 $spacing-sm;
        width: 160px; /* Default width, will be overridden by JavaScript */
        padding: $spacing-lg $spacing-md;
        background: linear-gradient(135deg, #3498db, #2980b9);
        border-radius: $radius-xl;
        position: relative;
        box-shadow: $shadow-lg;
        
        @media (max-width: $mobile-width) {
            margin: 0 $spacing-xs;
            padding: $spacing-md $spacing-sm;
        }
    }

    $animation-duration: 1.8s;

    .podium[data-place="1"] {
        height: 100%;
        animation: rise-up1 $animation-duration ease-out forwards;
        background: linear-gradient(135deg, #f39c12, #e67e22);
    }

    .podium[data-place="2"] {
        height: 85%;
        animation: rise-up2 $animation-duration ease-out 0.2s forwards;
        background: linear-gradient(135deg, #95a5a6, #7f8c8d);
    }

    .podium[data-place="3"] {
        height: 70%;
        animation: rise-up3 $animation-duration ease-out 0.4s forwards;
        background: linear-gradient(135deg, #cd7f32, #b87333);
    }

    @keyframes rise-up1 {
        from { height: 0; opacity: 0; }
        to { height: 100%; opacity: 1; }
    }

    @keyframes rise-up2 {
        from { height: 0; opacity: 0; }
        to { height: 85%; opacity: 1; }
    }

    @keyframes rise-up3 {
        from { height: 0; opacity: 0; }
        to { height: 70%; opacity: 1; }
    }

    .medal {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: $font-size-2xl;
        margin-top: $spacing-lg;
        box-shadow: $shadow-md;
        border: 3px solid rgba(255, 255, 255, 0.3);
        
        @media (max-width: $mobile-width) {
            width: 50px;
            height: 50px;
            font-size: $font-size-xl;
            margin-top: $spacing-md;
        }
    }

    .gold {
        background: radial-gradient(circle, #ffd700, #ffed4e);
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    }

    .silver {
        background: radial-gradient(circle, #c0c0c0, #e8e8e8);
        box-shadow: 0 0 20px rgba(192, 192, 192, 0.5);
    }

    .bronze {
        background: radial-gradient(circle, #cd7f32, #daa520);
        box-shadow: 0 0 20px rgba(205, 127, 50, 0.5);
    }

    .team-name {
        margin-top: $spacing-lg;
        font-size: $font-size-base;
        font-weight: 600;
        text-align: center;
        color: white;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        opacity: 0;
        animation: fade-in-up 0.8s ease-out 2.2s forwards;
        line-height: $line-height-tight;
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
        width: 100%;
        padding: 0 $spacing-xs;
        box-sizing: border-box;
        
        @media (max-width: $mobile-width) {
            font-size: $font-size-sm;
            margin-top: $spacing-md;
        }
    }

    .award {
        margin-top: $spacing-xs;
        font-size: $font-size-sm;
        font-weight: 700;
        text-align: center;
        color: rgba(255, 255, 255, 0.9);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        opacity: 0;
        animation: fade-in-up 0.8s ease-out 2.4s forwards;

        @media (max-width: $mobile-width) {
            font-size: $font-size-xs;
        }
    }

    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
