<script>
    import { goto } from "$app/navigation";
    import { currentEvent } from "$lib/stores/stores";
</script>

<div class="register-page">
    <header class="page-header">
        <h1>Register for BioBrawl {$currentEvent?.eventID}</h1>
        <p class="header-subtitle">Join the ultimate biology competition and showcase your knowledge!</p>
    </header>
    
    <main class="page-content">
        {#if $currentEvent.registration?.link}
            <button 
                class="register-btn register-btn--primary" 
                on:click={() => (window.location.href = $currentEvent.registration?.link ?? "/")}
                aria-label="Register for BioBrawl {$currentEvent?.eventID}"
            >
                🎯 Register Now
            </button>
        {:else}
            <button 
                class="register-btn register-btn--secondary" 
                on:click={() => (window.location.href = $currentEvent.registration?.alternativeLink ?? "/")}
                aria-label="Register for BioBrawl {$currentEvent?.eventID} via alternative link"
            >
                📝 Register Here
            </button>
        {/if}
        
        <div class="registration-info">
            <div class="info-card">
                <h3>Registration Details</h3>
                <ul>
                    <li><strong>Event:</strong> BioBrawl {$currentEvent?.eventID}</li>
                    <li><strong>Date:</strong> {$currentEvent?.date}</li>
                    {#if $currentEvent?.time}
                        <li><strong>Time:</strong> {$currentEvent.time}</li>
                    {/if}
                    {#if $currentEvent?.location}
                        <li><strong>Location:</strong> {$currentEvent.location}</li>
                    {/if}
                    {#if $currentEvent?.registrationFee}
                        <li><strong>Fee:</strong> ${$currentEvent.registrationFee} per team</li>
                    {/if}
                </ul>
            </div>
        </div>
    </main>
</div>

<style lang="scss">
    .register-page {
        min-height: calc(100vh - 140px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: $spacing-2xl $spacing-lg;
        background: linear-gradient(135deg, $background-light 0%, $background-color 100%);
    }

    .page-header {
        text-align: center;
        max-width: 800px;
        margin-bottom: $spacing-3xl;
        
        h1 {
            font-size: $font-size-5xl;
            font-weight: 700;
            color: $primary;
            margin-bottom: $spacing-lg;
            line-height: $line-height-tight;
            
            @media (max-width: $mobile-width) {
                font-size: $font-size-4xl;
            }
        }
        
        .header-subtitle {
            font-size: $font-size-xl;
            color: $text-secondary;
            margin: 0;
            line-height: $line-height-normal;
            
            @media (max-width: $mobile-width) {
                font-size: $font-size-lg;
            }
        }
    }

    .page-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-2xl;
        width: 100%;
        max-width: 600px;
    }

    .register-btn {
        font-size: $font-size-2xl;
        font-weight: 700;
        padding: $spacing-xl $spacing-3xl;
        border-radius: $radius-xl;
        min-width: 280px;
        box-shadow: $shadow-lg;
        
        @include button-base;
        
        &--primary {
            background: linear-gradient(135deg, $primary, $primary-light);
            color: white;
            
            &:hover:not(:disabled) {
                background: linear-gradient(135deg, $primary-dark, $primary);
                transform: translateY(-3px);
                box-shadow: $shadow-xl;
            }
        }
        
        &--secondary {
            background: linear-gradient(135deg, $secondary, $secondary-light);
            color: white;
            
            &:hover:not(:disabled) {
                background: linear-gradient(135deg, $secondary-dark, $secondary);
                transform: translateY(-3px);
                box-shadow: $shadow-xl;
            }
        }
        
        @media (max-width: $mobile-width) {
            font-size: $font-size-xl;
            padding: $spacing-lg $spacing-2xl;
            min-width: 240px;
        }
    }

    .registration-info {
        width: 100%;
        max-width: 500px;
        
        .info-card {
            background: white;
            border-radius: $radius-xl;
            padding: $spacing-2xl;
            box-shadow: $shadow-md;
            border: 1px solid $border-light;
            
            h3 {
                font-size: $font-size-2xl;
                font-weight: 700;
                color: $primary;
                margin-bottom: $spacing-lg;
                text-align: center;
            }
            
            ul {
                list-style: none;
                padding: 0;
                margin: 0;
                
                li {
                    padding: $spacing-md 0;
                    border-bottom: 1px solid $border-light;
                    font-size: $font-size-lg;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    
                    &:last-child {
                        border-bottom: none;
                    }
                    
                    strong {
                        color: $text-color;
                        font-weight: 600;
                        min-width: 80px;
                    }
                }
            }
        }
    }

    @media (max-width: $mobile-width) {
        .register-page {
            padding: $spacing-xl $spacing-md;
        }
        
        .page-header {
            margin-bottom: $spacing-2xl;
        }
        
        .registration-info {
            .info-card {
                padding: $spacing-xl;
                
                h3 {
                    font-size: $font-size-xl;
                }
                
                ul li {
                    font-size: $font-size-base;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: $spacing-sm;
                    
                    strong {
                        min-width: auto;
                    }
                }
            }
        }
    }
</style>
