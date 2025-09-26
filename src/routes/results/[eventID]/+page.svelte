<script lang="ts">
    import type { EventData } from "$lib/types";
    import { events } from "$lib/stores/stores";
    import Podium from "$lib/components/Podium.svelte";

    export let data: { eventID: string };
    $: eventData = $events.find(event => event.eventID == data.eventID);
</script>

<main class="results-page">
    {#if eventData && !eventData.active}
        <header class="page-header">
            <h1 class="event-title">{eventData.name}</h1>
            <p class="event-date">{eventData.date}</p>
        </header>

        <div class="results-content">
            <section class="winners-section">
                <h2 class="section-title">🏆 Congratulations to our winners</h2>
                <Podium 
                    first={eventData.results?.winners?.first} 
                    second={eventData.results?.winners?.second} 
                    third={eventData.results?.winners?.third} 
                />

                <div class="thank-you-message">
                    <h2>Thank you to everyone for participating</h2>
                    {#if eventData.results?.description}
                        <p class="event-description">{eventData.results.description}</p>
                    {/if}
                </div>
            </section>

            {#if eventData.results?.eliminationBracket}
                <section class="bracket-section">
                    <h2 class="section-title">📊 Elimination Bracket</h2>
                    <div class="bracket-content">
                        <a 
                            href={eventData.results.eliminationBracket} 
                            class="bracket-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Full Bracket
                        </a>
                        <iframe 
                            title="Elimination bracket"
                            src={eventData.results.eliminationBracket} 
                            class="bracket-iframe"
                            loading="lazy"
                        ></iframe>
                    </div>
                </section>
            {/if}
        </div>
    {:else}
        <div class="error-state">
            <h2>Event not found</h2>
            <p>The requested event could not be found or is still active.</p>
            <a href="/" class="back-link">← Back to Home</a>
        </div>
    {/if}
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

    .bracket-section {
        .bracket-content {
            text-align: center;
            
            .bracket-link {
                display: inline-flex;
                align-items: center;
                gap: $spacing-sm;
                padding: $spacing-md $spacing-lg;
                background: $primary;
                color: white;
                border-radius: $radius-lg;
                text-decoration: none;
                font-weight: 600;
                font-size: $font-size-lg;
                margin-bottom: $spacing-xl;
                transition: all 0.2s ease;
                
                &:hover {
                    background: $primary-dark;
                    transform: translateY(-2px);
                    box-shadow: $shadow-md;
                    text-decoration: none;
                }
            }
            
            .bracket-iframe {
                width: 100%;
                height: 600px;
                border: 1px solid $border-light;
                border-radius: $radius-lg;
                box-shadow: $shadow-md;
                background: white;
                
                @media (max-width: $mobile-width) {
                    display: none;
                }
            }
        }
    }

    .error-state {
        text-align: center;
        padding: $spacing-3xl;
        background: $background-light;
        border-radius: $radius-xl;
        border: 1px solid $border-light;
        
        h2 {
            font-size: $font-size-3xl;
            color: $danger;
            margin-bottom: $spacing-lg;
        }
        
        p {
            font-size: $font-size-lg;
            color: $text-secondary;
            margin-bottom: $spacing-xl;
        }
        
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: $spacing-sm;
            padding: $spacing-md $spacing-lg;
            background: $primary;
            color: white;
            border-radius: $radius-lg;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.2s ease;
            
            &:hover {
                background: $primary-dark;
                transform: translateY(-2px);
                box-shadow: $shadow-md;
                text-decoration: none;
            }
        }
    }

    @media (max-width: $mobile-width) {
        .bracket-section {
            .bracket-content {
                .bracket-link {
                    margin-bottom: $spacing-lg;
                }
            }
        }
    }
</style>
