<script lang="ts">
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    import { events, currentEvent } from "$lib/stores/stores";
    import { onMount, onDestroy } from "svelte";

    let bioBrawlLink: string = "";
    let homePage: string = "";
    let isDropdownOpen = false;
    let isMobile = false;
    let mobileMenuOpen = false;
    let mediaQuery: MediaQueryList | null = null;
    let mediaQueryHandler: ((e: MediaQueryListEvent) => void) | null = null;

    if (browser) {
        bioBrawlLink = window.location.hostname.includes("localhost") ? "/bio-brawl" : "https://biobrawl.helix-ed.org";
        homePage = window.location.hostname.replace(/^biobrawl\./, "");
    }

    onMount(() => {
        if (browser) {
            // Check if device is mobile/touch device
            mediaQuery = window.matchMedia("(max-width: 768px)");
            isMobile = mediaQuery.matches;
            
            // Update mobile detection on resize
            mediaQueryHandler = (e: MediaQueryListEvent) => {
                isMobile = e.matches;
                if (!isMobile && isDropdownOpen) {
                    // Close dropdown when switching to desktop
                    isDropdownOpen = false;
                }
            };
            mediaQuery.addEventListener('change', mediaQueryHandler);
        }
    });

    onDestroy(() => {
        // Clean up event listener to prevent memory leaks
        if (mediaQuery && mediaQueryHandler) {
            mediaQuery.removeEventListener('change', mediaQueryHandler);
        }
    });

    function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen;
    }

    function openDropdown() {
        // Only auto-open on hover for desktop
        if (!isMobile) {
            isDropdownOpen = true;
        }
    }

    function closeDropdown() {
        // Only auto-close on mouse leave for desktop
        if (!isMobile) {
            isDropdownOpen = false;
        }
    }

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }
</script>

<nav aria-label="Main navigation">
    <div class="nav-container">
        <div class="nav-brand">
            <a href={"https://www." + homePage} aria-label="HelixEd home">
                <img src="/logo.png" alt="HelixEd logo" />
            </a>
        </div>
        
        <div class={"nav-links" + (mobileMenuOpen ? " active" : "")} role="menubar"> 
            <a href={"https://www." + homePage} role="menuitem">HelixEd</a>
            <a href="/" role="menuitem">Home</a>
            <a href="/faq" role="menuitem">Competition FAQ</a>
            
            <div class="dropdown" role="group" on:mouseleave={closeDropdown}>
                <button 
                    id="past-competitions" 
                    on:mouseenter={openDropdown} 
                    on:click={toggleDropdown}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    aria-controls="dropdown-menu"
                    class="dropdown-trigger"
                    role="menuitem"
                >
                    Past competitions
                    <svg class="dropdown-icon" class:open={isDropdownOpen} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4 6l4 4 4-4H4z"/>
                    </svg>
                </button>
                <ul 
                    id="dropdown-menu"
                    class="dropdown-menu"
                    class:active={isDropdownOpen}
                    role="menu"
                    aria-labelledby="past-competitions"
                > 
                    {#each $events.filter(e => !e.active) as event}
                        <li role="none">
                            <a href={`/results/${event.eventID}`} role="menuitem">BioBrawl {event.year}</a>
                        </li>
                    {/each}
                </ul>
            </div>
            
            <button 
                class="btn-primary" 
                on:click={() => goto("/register")}
                aria-label="Register for BioBrawl {$currentEvent?.year}"
            >
                Register for BioBrawl {$currentEvent?.year}
            </button>
        </div>

        <button 
            class="mobile-menu-toggle" 
            on:click={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="nav-links"
            aria-label="Toggle navigation menu"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
            </svg>
        </button>
    </div>
</nav>

<style lang="scss">
    nav {
        background: $background-color;
        border-bottom: 1px solid $border-color;
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: $shadow-sm;
    }

    .nav-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: $desktop-width;
        margin: 0 auto;
        padding: $spacing-sm $spacing-lg;
        
        @media (max-width: $tablet-width) {
            padding: $spacing-sm $spacing-md;
        }
    }

    .nav-brand {
        flex-shrink: 0;
        
        img {
            height: 40px;
            width: auto;
        }
    }

    .nav-links {
        display: flex;
        align-items: center;
        gap: $spacing-xl;
        
        a {
            color: $text-color;
            font-weight: 500;
            font-size: $font-size-base;
            padding: $spacing-sm 0;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
            
            &:hover {
                color: $primary;
                border-bottom-color: $primary;
                text-decoration: none;
            }
        }
    }

    .dropdown {
        position: relative;
    }

    .dropdown-trigger {
        @include invisible-button;
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        color: $text-color;
        font-weight: 500;
        font-size: $font-size-base;
        font-family: inherit;
        padding: $spacing-sm 0;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
        
        &:hover,
        &[aria-expanded="true"] {
            color: $primary;
            border-bottom-color: $primary;
        }
    }

    .dropdown-icon {
        transition: transform 0.2s ease;
        
        &.open {
            transform: rotate(180deg);
        }
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        min-width: 200px;
        background: $background-color;
        border: 1px solid $border-light;
        border-radius: $radius-lg;
        box-shadow: $shadow-lg;
        padding: $spacing-sm 0;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-$spacing-xs);
        transition: all 0.2s ease;
        list-style: none;
        margin: 0;
        
        &.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        a {
            display: block;
            padding: $spacing-md $spacing-lg;
            color: $text-color;
            border-bottom: none !important;
            border-radius: 0;
            
            &:hover {
                background: $background-light;
                color: $primary;
            }
        }
    }

    .btn-primary {
        @include button-sm;
        & {
            background: $primary;
            color: white;
            white-space: nowrap;
        }
        
        &:hover:not(:disabled) {
            background: $primary-dark;
            transform: translateY(-1px);
            box-shadow: $shadow-md;
        }
        
        &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: $shadow-sm;
        }
    }

    .mobile-menu-toggle {
        @include invisible-button;
        display: none;
        padding: $spacing-sm;
        color: $text-color;
        
        svg {
            width: 24px;
            height: 24px;
        }
    }

    @media (max-width: $mobile-width) {
        .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            background: $background-color;
            border-top: 1px solid $border-color;
            padding: $spacing-lg;
            gap: $spacing-lg;
            box-shadow: $shadow-lg;
            
            &.active {
                display: flex;
            }
            
            a {
                font-size: $font-size-lg;
                padding: $spacing-md 0;
                text-align: center;
                border-bottom: 1px solid $border-light;
                
                &:last-of-type {
                    border-bottom: none;
                }
            }
        }
        
        .dropdown {
            width: 100%;
            
            .dropdown-trigger {
                width: 100%;
                justify-content: center;
                padding: $spacing-md 0;
                border-bottom: 1px solid $border-light;
                font-size: $font-size-lg;
            }
        }
        
        .dropdown-menu {
            position: static;
            box-shadow: none;
            border: none;
            background: $background-light;
            margin-top: 0;
            border-radius: 0;
            padding: 0;
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.2s ease;
            
            &.active {
                max-height: 300px; // Enough for several menu items
                opacity: 1;
            }
            
            a {
                padding: $spacing-sm $spacing-lg;
                font-size: $font-size-base;
                border-bottom: 1px solid $border-light !important;
                text-align: left;
                
                &:hover {
                    background: $background-darker;
                }
                
                &:last-child {
                    border-bottom: none !important;
                }
            }
        }
        
        .mobile-menu-toggle {
            display: block;
        }
        
        .btn-primary {
            width: 100%;
            justify-content: center;
            margin-top: $spacing-md;
            border-bottom: none !important;
        }
    }
</style>
