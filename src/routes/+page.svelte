<script lang="ts">
    import { goto } from "$app/navigation";
    import { currentEvent } from "$lib/stores/stores";

    console.log("Current Event:", $currentEvent);
</script>

<section class="hero-section">
    <img src="/images/biobrawl-2.webp" alt="BioBrawl competition hero" />
</section>

{#if $currentEvent}
    <section class="announcement-banner">
        <h2>Registration {$currentEvent.registration?.isOpen ? 'Open' : 'Closed'}</h2>
    </section>

    <div class="main-content">
        <div class="content-primary">
            <h2 class="section-title">Rules</h2>
            <a href="/biobrawl-rules.pdf" class="rules-link">
                📋 View our rules
            </a>
            
            <h2 class="section-title">Important Dates</h2>
            <ul class="dates-list">
                {#if !$currentEvent.registration?.isOpen}
                    <li><strong>Registration opens:</strong> {$currentEvent.registration?.opens}</li>
                {/if}
                {#if $currentEvent.rulesWorkshop?.date}
                    <li><strong>Rules Workshop:</strong> {$currentEvent.rulesWorkshop.date}</li>
                {/if}
                <li><strong>Registration deadline:</strong> {$currentEvent.registration?.closes}</li>
                <li><strong>Mock competition:</strong> {$currentEvent.mock?.date}</li>
                <li><strong>Competition:</strong> {$currentEvent.date}, {$currentEvent.time} PST</li>
            </ul>

            <h2 class="section-title">About Us</h2>
            <p class="about-text">
                The BioBrawl Biology Bowl is a dynamic, student-led competition debuting in 2024, designed to ignite curiosity and passion for the life sciences. Through a quiz bowl-like format, BioBrawl
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
                <p class="card-text">{$currentEvent.location}, {$currentEvent.time}</p>
            </div>

            <div class="info-card">
                <h3 class="card-title">Registration fee</h3>
                <p class="card-text">${$currentEvent.registrationFee} / team</p>
            </div>
            
            <div class="info-card prizes-card">
                <h3 class="card-title">Prizes per division</h3>
                <div class="prizes-list">
                    <div class="prize-item">
                        <span class="prize-place">1st Place:</span>
                        <span class="prize-amount">${$currentEvent.prizes?.first} / team</span>
                    </div>
                    <div class="prize-item">
                        <span class="prize-place">2nd Place:</span>
                        <span class="prize-amount">${$currentEvent.prizes?.second} / team</span>
                    </div>
                    <div class="prize-item">
                        <span class="prize-place">3rd Place:</span>
                        <span class="prize-amount">${$currentEvent.prizes?.third} / team</span>
                    </div>
                    {#if $currentEvent.prizes?.fourth}
                        <div class="prize-item">
                            <span class="prize-place">4th Place:</span>
                            <span class="prize-amount">${$currentEvent.prizes.fourth} / team</span>
                        </div>
                    {/if}
                    {#if $currentEvent.prizes?.fifth}
                        <div class="prize-item">
                            <span class="prize-place">5th Place:</span>
                            <span class="prize-amount">${$currentEvent.prizes.fifth} / team</span>
                        </div>
                    {/if}
                </div>
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
        
        &.prizes-card {
            .prizes-list {
                display: flex;
                flex-direction: column;
                gap: $spacing-md;
                
                .prize-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: $spacing-sm 0;
                    border-bottom: 1px solid $border-light;
                    
                    &:last-child {
                        border-bottom: none;
                    }
                    
                    .prize-place {
                        font-weight: 600;
                        color: $text-color;
                    }
                    
                    .prize-amount {
                        font-weight: 700;
                        color: $primary;
                        font-size: $font-size-lg;
                    }
                }
            }
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
