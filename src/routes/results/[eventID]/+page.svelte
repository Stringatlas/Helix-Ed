<script lang="ts">
    import { tick } from 'svelte';
    import type { PageData } from './$types';
    import Bracket from '$lib/components/Bracket.svelte';
    import Podium from '$lib/components/Podium.svelte';

    export let data: PageData;

    let activeDivision = 0;

    $: snapshot = data.archive.kind === 'snapshot' ? data.archive.snapshot : null;
    $: legacy = data.archive.kind === 'legacy' ? data.archive.legacy : null;
    $: eventData = data.archive.kind === 'snapshot' ? data.archive.snapshot : data.archive.legacy;
    $: divisions = snapshot?.results.divisions ?? legacy?.divisions ?? [];
    $: if (activeDivision >= divisions.length) activeDivision = 0;

    async function handleTabKey(event: KeyboardEvent, index: number) {
        let next = index;

        if (event.key === 'ArrowRight') next = (index + 1) % divisions.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + divisions.length) % divisions.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = divisions.length - 1;
        else return;

        event.preventDefault();
        activeDivision = next;
        await tick();
        document.getElementById(`division-tab-${next}`)?.focus();
    }
</script>

<svelte:head>
    <title>{eventData?.name ?? 'Results'} · BioBrawl results</title>
    <meta name="description" content={`Results and participation record for ${eventData?.name ?? 'BioBrawl'}.`} />
</svelte:head>

<main class="results-page">
        <header class="page-header">
            <h1 class="event-title">{eventData.name}</h1>
            <p class="event-date">{eventData.date}</p>
        </header>

        <div class="results-content">
            <section class="winners-section">
                <h2 class="section-title">Congratulations to our winners</h2>

                {#if divisions.length}
                    {#if divisions.length > 1}
                        <div class="division-tabs" role="tablist" aria-label="Competition divisions">
                            {#each divisions as division, index (division.name)}
                                <button
                                    id={`division-tab-${index}`}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeDivision === index}
                                    aria-controls={`division-panel-${index}`}
                                    tabindex={activeDivision === index ? 0 : -1}
                                    class:active={activeDivision === index}
                                    on:click={() => (activeDivision = index)}
                                    on:keydown={(event) => handleTabKey(event, index)}
                                >
                                    {division.name}
                                </button>
                            {/each}
                        </div>
                    {/if}

                    {@const division = divisions[activeDivision]}
                    <div
                        id={`division-panel-${activeDivision}`}
                        class="division-panel"
                        role="tabpanel"
                        aria-labelledby={divisions.length > 1
                            ? `division-tab-${activeDivision}`
                            : undefined}
                        tabindex="0"
                    >
                        {#if divisions.length === 1}
                            <h3 class="division-title">{division.name}</h3>
                        {/if}
                        {#key activeDivision}
                            <Podium places={division.places} />
                        {/key}
                    </div>
                {:else}
                    <p>Placements were not recorded.</p>
                {/if}

                <div class="thank-you-message">
                    <h2>Thank you to everyone for participating</h2>
                    {#if snapshot?.results.description}
                        <p class="event-description">{snapshot.results.description}</p>
                    {/if}
                </div>
            </section>

            {#if snapshot}
                <section aria-label="Participation" class="participation">
                    <h2>Participation</h2>
                    <p>{snapshot.participation.teamsPlayed} teams played · {snapshot.participation.studentsPlayed} students played · {snapshot.participation.schools.length} schools · {snapshot.participation.statesRepresented} states</p>
                    <p>{snapshot.participation.teamsRegistered} teams registered · {snapshot.participation.studentsRostered} students rostered</p>
                    <p>Schools: {snapshot.participation.schools.join(', ')}</p>
                    <p>States: {snapshot.participation.states.join(', ')}</p>
                    {#each snapshot.participation.divisionBreakdown as group}
                        <p>{group.division}: {group.teams} teams · {group.students} students</p>
                    {/each}
                </section>
                {#each snapshot.results.bracketData as division (division.division)}
                    <Bracket {division} />
                {/each}
                {#if snapshot.individualAwards?.length}
                    <section aria-label="Individual awards">
                        <h2>Individual awards</h2>
                        <ul>{#each snapshot.individualAwards as award}
                            <li>{award.recipient} · {award.team} · {award.division} · {award.scope}{award.category ? ` · ${award.category}` : ''}{award.coAward ? ' · Shared award' : ''}</li>
                        {/each}</ul>
                    </section>
                {/if}
                <section class="provenance" aria-label="Results provenance">
                    <h2>About this record</h2>
                    <p>Computed {snapshot.provenance.computedAt} by {snapshot.provenance.computedBy}. Verified matches only.</p>
                    <p class="source-reference">Source: {snapshot.provenance.sourceEventLog}</p>
                    {#if snapshot.provenance.notes}<p>{snapshot.provenance.notes}</p>{/if}
                    {#if snapshot.provenance.unverifiedYear}<p>Historical participation figures have not been independently verified.</p>{/if}
                    <a href={`/data/results/${snapshot.eventID}.json`}>Download results JSON</a>
                </section>
            {:else if legacy}
                <section class="provenance" aria-label="Historical record limitations">
                    <h2>About this historical record</h2>
                    <p>These placements were preserved from the previous site. Participation totals and match-by-match results have not been independently verified.</p>
                    <p>The original bracket is available as an external historical source; it is not part of this archived page.</p>
                    <a href={legacy.bracketUrl} target="_blank" rel="noopener noreferrer">Open historical bracket source</a>
                    <details><summary>Source details</summary><p>{legacy.provenance.source}</p><p>Revision: {legacy.provenance.revision}</p></details>
                </section>
            {/if}
        </div>

</main>

<style lang="scss">
    .results-page {
        max-width: $desktop-width;
        margin: 0 auto;
        padding: $spacing-2xl $spacing-lg;
        
        @media (max-width: $mobile-width) {
            padding: $spacing-xl $spacing-md;
        }
    }

    .page-header {
        text-align: center;
        margin-bottom: $spacing-3xl;
        padding-bottom: $spacing-2xl;
        border-bottom: 2px solid $border-light;
        
        .event-title {
            font-size: $font-size-5xl;
            font-weight: 700;
            color: $primary;
            margin-bottom: $spacing-md;
            
            @media (max-width: $mobile-width) {
                font-size: $font-size-4xl;
            }
        }
        
        .event-date {
            font-size: $font-size-xl;
            color: $text-secondary;
            margin: 0;
            font-weight: 500;
            
            @media (max-width: $mobile-width) {
                font-size: $font-size-lg;
            }
        }
    }

    .results-content {
        display: flex;
        flex-direction: column;
        gap: $spacing-3xl;
    }

    .section-title {
        font-size: $font-size-3xl;
        font-weight: 700;
        text-align: center;
        margin-bottom: $spacing-2xl;
        color: $text-color;
        
        @media (max-width: $mobile-width) {
            font-size: $font-size-2xl;
            margin-bottom: $spacing-xl;
        }
    }

    .winners-section {
        .division-tabs {
            display: flex;
            justify-content: center;
            gap: $spacing-sm;
            max-width: 760px;
            margin: 0 auto $spacing-lg;
            padding: $spacing-xs;
            border-radius: $radius-xl;
            background: $background-darker;

            button {
                flex: 1 1 0;
                padding: $spacing-sm $spacing-lg;
                border: 0;
                border-radius: $radius-lg;
                background: transparent;
                color: $text-secondary;
                font: inherit;
                font-weight: 600;
                cursor: pointer;
                transition: background $transition-normal, color $transition-normal, box-shadow $transition-normal;

                &:hover {
                    color: $primary;
                }

                &:focus-visible {
                    outline: 2px solid $primary;
                    outline-offset: 2px;
                }

                &.active {
                    background: white;
                    color: $primary;
                    box-shadow: $shadow-md;
                }
            }
        }

        .division-panel:focus {
            outline: none;
        }

        .division-title {
            margin-bottom: 0;
            color: $text-secondary;
            font-size: $font-size-2xl;
            font-weight: 600;
            text-align: center;

            @media (max-width: $mobile-width) {
                font-size: $font-size-xl;
            }
        }

        .thank-you-message {
            text-align: center;
            margin-top: $spacing-3xl;
            padding: $spacing-2xl;
            background: $background-light;
            border-radius: $radius-xl;
            border: 1px solid $border-light;
            
            h2 {
                font-size: $font-size-2xl;
                font-weight: 600;
                color: $primary;
                margin-bottom: $spacing-lg;
                
                @media (max-width: $mobile-width) {
                    font-size: $font-size-xl;
                }
            }
            
            .event-description {
                font-size: $font-size-lg;
                line-height: $line-height-relaxed;
                color: $text-secondary;
                max-width: 800px;
                margin: 0 auto;
                
                @media (max-width: $mobile-width) {
                    font-size: $font-size-base;
                }
            }
        }
    }

    .participation, .provenance { padding: $spacing-lg; border: 1px solid $border-color; border-radius: $radius-lg; }
    .source-reference { overflow-wrap: anywhere; font-size: $font-size-sm; }

    @media (max-width: $mobile-width) {
        .winners-section .division-tabs {
            justify-content: flex-start;
            overflow-x: auto;

            button {
                flex: 0 0 auto;
                white-space: nowrap;
            }
        }


    }
</style>
