<script lang="ts">
    import type { Place } from '$lib/types';

    export let places: Place[] = [];
    export let first: string | undefined = undefined;
    export let second: string | undefined = undefined;
    export let third: string | undefined = undefined;

    $: resolvedPlaces = (
        places.length
            ? places
            : [
                  { rank: 1, team: first || 'TBD' },
                  { rank: 2, team: second || 'TBD' },
                  { rank: 3, team: third || 'TBD' }
              ]
    ).slice().sort((a, b) => a.rank - b.rank) as Place[];

    $: podiumPlaces = resolvedPlaces.filter((place) => place.rank <= 3);
    $: runnersUp = resolvedPlaces.filter((place) => place.rank > 3);
    $: orderedPodium = [2, 1, 3]
        .map((rank) => podiumPlaces.find((place) => place.rank === rank))
        .filter((place): place is Place => place !== undefined);

    function formatAward(award: string) {
        return award.startsWith('$') ? award : `$${award}`;
    }
</script>

<div class="results">
    <div class="podium-stage" role="list" aria-label="Top places">
        {#each orderedPodium as place (place.rank)}
            <div class="podium" data-place={place.rank} role="listitem">
                <div class="podium-face"></div>
                <div class="podium-content">
                    <div class="place-number">{place.rank}</div>
                    <div class="team-name">{place.team || 'TBD'}</div>
                    {#if place.award != null}
                        <div class="award">{formatAward(place.award)}</div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>

    {#if runnersUp.length}
        <section class="runners-up" aria-labelledby="runners-up-title">
            <h3 id="runners-up-title">Runner-ups</h3>
            <div class="runner-list">
                {#each runnersUp as place (place.rank)}
                    <div class="runner" data-place={place.rank}>
                        <span class="runner-rank">{place.rank}</span>
                        <span class="runner-team">{place.team || 'TBD'}</span>
                        {#if place.award != null}
                            <span class="runner-award">{formatAward(place.award)}</span>
                        {/if}
                    </div>
                {/each}
            </div>
        </section>
    {/if}
</div>

<style lang="scss">
    .results {
        margin: $spacing-2xl 0;
    }

    .podium-stage {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: $spacing-md;
        height: 350px;
        padding: $spacing-xl $spacing-sm 0;
    }

    .podium {
        position: relative;
        flex: 1 1 0;
        width: 0;
        max-width: 180px;
        height: 70%;
        isolation: isolate;
    }

    .podium[data-place="1"] {
        height: 100%;

        .podium-face {
            background: linear-gradient(135deg, #f39c12, #e67e22);
            animation-delay: 180ms;
        }

        .podium-content {
            animation-delay: 720ms;
        }
    }

    .podium[data-place="2"] {
        height: 85%;

        .podium-face {
            background: linear-gradient(135deg, #aab4b5, #748182);
            animation-delay: 60ms;
        }

        .podium-content {
            animation-delay: 600ms;
        }
    }

    .podium[data-place="3"] {
        .podium-face {
            background: linear-gradient(135deg, #cd7f32, #a95f29);
            animation-delay: 300ms;
        }

        .podium-content {
            animation-delay: 840ms;
        }
    }

    .podium-face {
        position: absolute;
        inset: 0;
        z-index: -1;
        border-radius: $radius-xl $radius-xl 0 0;
        background: linear-gradient(135deg, #3498db, #2980b9);
        box-shadow: $shadow-lg;
        transform-origin: bottom;
        animation: podium-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .podium-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: $spacing-lg $spacing-md;
        text-align: center;
        color: white;
        opacity: 0;
        animation: content-arrive 450ms ease-out both;
    }

    .place-number {
        display: grid;
        place-items: center;
        width: 56px;
        height: 56px;
        border: 3px solid rgba(255, 255, 255, 0.45);
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.18);
        box-shadow: $shadow-md;
        font-size: $font-size-2xl;
        font-weight: 700;
    }

    .team-name {
        width: 100%;
        margin-top: $spacing-lg;
        padding: 0 $spacing-xs;
        box-sizing: border-box;
        overflow-wrap: anywhere;
        font-size: $font-size-base;
        font-weight: 600;
        line-height: $line-height-tight;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .award {
        margin-top: $spacing-xs;
        color: rgba(255, 255, 255, 0.9);
        font-size: $font-size-sm;
        font-weight: 700;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .runners-up {
        max-width: 760px;
        margin: $spacing-xl auto 0;
        padding: 0 $spacing-lg;
        animation: runners-arrive 500ms ease-out 900ms both;

        h3 {
            margin: 0 0 $spacing-md;
            color: $text-secondary;
            font-size: $font-size-lg;
            font-weight: 600;
            text-align: center;
        }
    }

    .runner-list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: $spacing-sm;
    }

    .runner {
        display: flex;
        align-items: center;
        min-width: 0;
        min-height: 52px;
        padding: $spacing-sm $spacing-md;
        border: 1px solid $border-light;
        border-radius: $radius-lg;
        background: $background-light;
        box-shadow: $shadow-md;
    }

    .runner-rank {
        display: grid;
        flex: 0 0 34px;
        place-items: center;
        width: 34px;
        height: 34px;
        margin-right: $spacing-md;
        border-radius: $radius-md;
        background: linear-gradient(135deg, #596579, #394457);
        color: white;
        font-size: $font-size-sm;
        font-weight: 700;
    }

    .runner-team {
        min-width: 0;
        overflow-wrap: anywhere;
        color: $text-color;
        font-size: $font-size-sm;
        font-weight: 600;
    }

    .runner-award {
        margin-left: auto;
        padding-left: $spacing-sm;
        color: $text-secondary;
        font-size: $font-size-xs;
        font-weight: 700;
    }

    @keyframes podium-rise {
        from {
            opacity: 0;
            transform: scaleY(0.03);
        }
        to {
            opacity: 1;
            transform: scaleY(1);
        }
    }

    @keyframes content-arrive {
        from {
            opacity: 0;
            transform: translateY(12px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes runners-arrive {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: $mobile-width) {
        .podium-stage {
            gap: $spacing-xs;
            height: 280px;
            padding-top: $spacing-lg;
        }

        .podium-content {
            padding: $spacing-md $spacing-xs;
        }

        .place-number {
            width: 44px;
            height: 44px;
            font-size: $font-size-xl;
        }

        .team-name {
            margin-top: $spacing-md;
            font-size: $font-size-sm;
        }

        .award {
            font-size: $font-size-xs;
        }

        .runners-up {
            padding: 0;
        }

        .runner-list {
            grid-template-columns: 1fr;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .podium-face,
        .podium-content,
        .runners-up {
            animation: none;
            opacity: 1;
            transform: none;
        }
    }
</style>
