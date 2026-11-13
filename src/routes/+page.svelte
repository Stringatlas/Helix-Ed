<script lang="ts">
    import { currentEvent } from "$lib/stores/stores";
    import { onMount } from "svelte";
    import { FileTextFill } from "svelte-bootstrap-icons";

    $: scheduleItems = ($currentEvent?.schedule ?? []).filter(
        (i) => i?.label?.trim() && i?.when?.trim()
    );

    onMount(() => {
        console.log('Current Event:', $currentEvent);
    });
</script>

<section class="hero-section">
    <img 
        src="/images/biobrawl-2.webp" 
        alt="BioBrawl competition hero"
        loading="eager"
        decoding="async"
        fetchpriority="high"
    />
</section>

{#if $currentEvent}
    <section class="announcement-banner">
        <h2>Registration for {$currentEvent.name} is {$currentEvent.registration?.isOpen ? 'Open' : 'Closed'}</h2>
    </section>

    {#if $currentEvent.live}
        <section class="bracket-section">
            <h2 class="section-title">{$currentEvent.name} is Live!</h2>
            <h3 class="section-subtitle">View The Competition Bracket</h3>
            <iframe 
                title="Elimination bracket"
                src={$currentEvent.results?.eliminationBracket} 
                class="bracket-iframe"
                loading="lazy"
            ></iframe>
        </section>
    {/if}

    <div class="main-content">
        <div class="content-primary">
            {#if $currentEvent.description?.trim()}
                <p class="about-text summary-text">{$currentEvent.description.trim()}</p>
            {/if}

            <h2 class="section-title">Rules</h2>
            <a href={$currentEvent.rules} class="rules-link">
                <FileTextFill /> 
                Read the Information Document
            </a>
            
            <h2 class="section-title">Important Dates</h2>
            <ul class="dates-list">
                {#if scheduleItems.length}
                    {#each scheduleItems as item, index (item._key ?? index)}
                        <li>
                            <strong>{item.label}:</strong> {item.when}
                            {#if item.note?.trim()}
                                <span class="schedule-note">({item.note.trim()})</span>
                            {/if}
                        </li>
                    {/each}
                {:else}
                {#if !$currentEvent.registration?.isOpen}
                    <li><strong>Registration opens:</strong> {$currentEvent.registration?.opens}</li>
                {/if}
                {#if $currentEvent.rulesWorkshop?.date}
                    <li><strong>Rules Workshop:</strong> {$currentEvent.rulesWorkshop.date}</li>
                {/if}
                <li><strong>Registration deadline:</strong> {$currentEvent.registration?.closes}</li>
                <li><strong>Mock competition:</strong> {$currentEvent.mock?.date}</li>
                <li><strong>Competition:</strong> {$currentEvent.date}, {$currentEvent.time}</li>
                {/if}
            </ul>

            <h2 class="section-title">About Us</h2>
            <p class="about-text">
                The BioBrawl Biology Bowl is a dynamic, student-led competition debuting in 2024, designed to ignite curiosity and passion for the life sciences. BioBrawl
                covers a wide range of topics, including human anatomy, physiology, pathology, botany, zoology, evolution, cell biology, genetics, ecology, and ethology. Our mission is to inspire students
                to explore the frontiers of science and discover the endless possibilities within the life sciences.
            </p>
        </div>

        <div class="content-sidebar">
            <div class="info-cards-row">
                <div class="info-card">
                    <h3 class="card-title">Who can register</h3>
                    <p class="card-text">Grades {$currentEvent.grades}</p>
                </div>
                <div class="info-card">
                    <h3 class="card-title">Team size</h3>
                    <p class="card-text">Teams of {$currentEvent.teamSize}</p>
                </div>
            </div>

            <div class="info-card">
                <h3 class="card-title">Where</h3>
                <p class="card-text">{$currentEvent.location}</p>
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    .hero-section {
        text-align: center;
        background-color: $background-color;
        
        img {
            width: 100%;
            height: auto;
            max-height: 80vh;
            object-fit: contain;
        }
    }

    .announcement-banner {
        padding: $spacing-xl;
        text-align: center;
        background: linear-gradient(135deg, $primary, $primary-dark);
        color: white;
        
        h2 {
            font-size: $font-size-3xl;
            font-weight: 700;
            margin: 0;
        }
    }

    .bracket-section {
        max-width: $desktop-width;
        margin: $spacing-3xl auto;
        padding: 0 $spacing-lg;
        
        @media (max-width: $mobile-width) {
            margin: $spacing-2xl auto;
            padding: 0 $spacing-md;
        }
        
        .section-title {
            font-size: $font-size-3xl;
            font-weight: 700;
            margin-bottom: $spacing-md;
            color: $text-color;
        }
        
        .section-subtitle {
            font-size: $font-size-lg;
            color: $text-muted;
            margin-bottom: $spacing-xl;
        }
        
        .bracket-iframe {
            width: 100%;
            height: 80vh;
            min-height: 600px;
            border: 1px solid $border-color;
            border-radius: $radius-lg;
            box-shadow: $shadow-md;
            
            @media (max-width: $mobile-width) {
                height: 60vh;
                min-height: 400px;
            }
        }
    }

    .main-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: $spacing-3xl;
        max-width: $desktop-width;
        margin: $spacing-3xl auto;
        padding: 0 $spacing-lg;
        
        @media (max-width: $mobile-width) {
            grid-template-columns: 1fr;
            gap: $spacing-2xl;
            margin: $spacing-2xl auto;
            padding: 0 $spacing-md;
        }
    }

    .content-primary {
        .section-title {
            font-size: $font-size-3xl;
            font-weight: 700;
            margin-bottom: $spacing-lg;
            color: $text-color;
            
            &:not(:first-child) {
                margin-top: $spacing-3xl;
            }
        }
        
        .rules-link {
            display: inline-flex;
            align-items: center;
            gap: $spacing-sm;
            padding: $spacing-md $spacing-lg;
            background: $primary-light;
            color: white;
            border-radius: $radius-lg;
            text-decoration: none;
            font-weight: 600;
            margin-bottom: $spacing-xl;
            transition: all 0.2s ease;
            
            &:hover {
                background: $primary;
                transform: translateY(-2px);
                box-shadow: $shadow-md;
                text-decoration: none;
            }
        }
        
        .dates-list {
            list-style: none;
            padding: 0;
            margin: $spacing-lg 0;
            
            li {
                padding: $spacing-md 0;
                border-bottom: 1px solid $border-light;
                font-size: $font-size-lg;
                
                &:last-child {
                    border-bottom: none;
                }
                
                strong {
                    color: $primary;
                    font-weight: 600;
                }
            }
        }
        
        .about-text {
            font-size: $font-size-lg;
            line-height: $line-height-relaxed;
            color: $text-secondary;
            margin-top: $spacing-lg;
        }

        .summary-text {
            white-space: pre-line;
            margin-top: 0;
        }

        .schedule-note {
            color: $text-muted;
        }
    }

    .content-sidebar {
        display: flex;
        flex-direction: column;
        gap: $spacing-lg;
    }

    .info-cards-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: $spacing-lg;
        
        @media (max-width: $mobile-width) {
            grid-template-columns: 1fr;
        }
    }

    .info-card {
        background: white;
        border-radius: $radius-xl;
        padding: $spacing-xl;
        box-shadow: $shadow-md;
        text-align: center;
        border: 1px solid $border-light;
        transition: all 0.3s ease;
        
        &:hover {
            transform: translateY(-4px);
            box-shadow: $shadow-xl;
        }
        
        .card-title {
            font-size: $font-size-xl;
            font-weight: 700;
            margin-bottom: $spacing-md;
            color: $primary;
        }
        
        .card-text {
            font-size: $font-size-lg;
            color: $text-secondary;
            margin: 0;
        }
    }

    @media (max-width: $mobile-width) {
        .announcement-banner {
            padding: $spacing-xl $spacing-md;
            
            h2 {
                font-size: $font-size-2xl;
            }
        }
        
        .content-primary {
            .section-title {
                font-size: $font-size-2xl;
                
                &:not(:first-child) {
                    margin-top: $spacing-2xl;
                }
            }
            
            .about-text {
                font-size: $font-size-base;
            }
        }
    }
</style>
