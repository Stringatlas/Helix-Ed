<script lang="ts">
    import { goto } from "$app/navigation";

    import { browser } from "$app/environment";

    let bioBrawlLink: string = "";
    if (browser) {
        bioBrawlLink = window.location.hostname.includes("localhost") ? "/bio-brawl" : "https://biobrawl.helix-ed.org";
    }

    let isDropdownOpen = false;

    function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen;
    }

    function openDropdown() {
        isDropdownOpen = true;
    }

    function closeDropdown() {
        isDropdownOpen = false;
    }

    let mobileMenuOpen = false;

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }
</script>

<nav>
    <ul>
        <li class="logo">
            <a href="/"><img src="/logo.png" alt="logo" /></a>
        </li>
        <div class={"nav-links" + (mobileMenuOpen ? " active" : "")}>
            <li><a href={bioBrawlLink}>Bio Brawl</a></li>
            <li class="dropdown" on:mouseleave={closeDropdown}>
                <a id="our-classes" href="/" on:mouseenter={() => {}} on:click|preventDefault={toggleDropdown}>Our classes<span style="font-size: 16px">▼</span></a>
                <ul class={`dropdown-menu ${isDropdownOpen ? "active" : ""}`}>
                    <li><a href="/subjects/physics">Physics</a></li>
                    <li><a href="/subjects/chemistry">Chemistry</a></li>
                    <li><a href="/subjects/biology">Biology</a></li>
                    <li><a href="/subjects/economics">Economics</a></li>
                    <li><a href="/subjects/math">Math</a></li>
                </ul>
            </li>

            <li><a href="/about-us">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/recruiting">Recruiting</a></li>
            <button class="enroll-button" on:click={() => goto("/enroll")}>Enroll</button>
        </div>

        <div class="mobile-menu">
            <button class="hamburger-menu" on:click={toggleMobileMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="black" class="bi bi-list" viewBox="0 0 16 16">
                    <path
                        fill-rule="evenodd"
                        d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                    />
                </svg>
            </button>
        </div>
    </ul>
</nav>

<style lang="scss">
    .hamburger-menu {
        @include invisible-button;
        display: none;
        pointer-events: none;
    }

    .enroll-button {
        background: $primary;
        color: black;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
    }

    img {
        height: 40px;
    }

    #our-classes {
        display: flex;
        flex-direction: row;
        gap: 4px;
        align-items: center;
    }

    a {
        font-size: 16px;
        color: $text-color;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    nav {
        background: $background-color;
        color: white;
        padding: 12px 20px;
        border-style: solid;
        border-width: 0px 0px 1px 0px;
        border-color: black;
        margin: 0;
    }

    ul {
        display: flex;
        align-items: center;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .logo {
        margin-right: auto;
    }

    .nav-links {
        margin-right: 20px;
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-menu {
        display: block;
        position: absolute;
        top: 100%;
        left: 0;
        background: $background-color;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        padding: 8px 0;
        z-index: 1;

        pointer-events: none;

        opacity: 0;
        transition: opacity 0.3s ease;

        &.active {
            opacity: 1;
            pointer-events: all;
        }
    }

    .dropdown-menu li {
        display: block;
    }

    .dropdown-menu a {
        color: $text-color;
        padding: 10px 20px;
        display: block;
        text-decoration: none;
        transition: background-color 0.3s ease;
    }

    .dropdown-menu a:hover {
        background-color: lighten($background-color, 10%);
    }

    @media (max-width: $mobile-width) {
        .hamburger-menu {
            display: inline;
            pointer-events: all;
        }

        .nav-links {
            display: none;
            pointer-events: none;

            &.active {
                display: flex;
                pointer-events: all;
                flex-direction: column;
                position: absolute;
                top: 100%;
                width: 100%;
                left: 0;
                background: $background-color;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

                padding: 8px 0;
                z-index: 1;

                font-size: large;
            }
        }
    }
</style>
