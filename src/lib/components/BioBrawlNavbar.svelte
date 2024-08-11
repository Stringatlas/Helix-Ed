<script lang="ts">
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";

    let homePage: string = "";

    if (browser) {
        homePage = window.location.hostname.replace(/^biobrawl\./, "");
    }

    let isDropdownOpen = false;

    function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen;
    }

    function closeDropdown() {
        isDropdownOpen = false;
    }
</script>

<nav>
    <ul>
        <li class="logo">
            <a href={"https://www." + homePage}><img src="/logo.png" alt="logo" /></a>
        </li>
        <div class="nav-links">
            <li><a href="/">Home</a></li>
            <li class="dropdown" on:mouseleave={closeDropdown}>
                <a id="our-classes" href="/" on:mouseenter={toggleDropdown} on:click|preventDefault={toggleDropdown}>Past competitions<span style="font-size: 16px">▼</span></a>
                <ul class={`dropdown-menu ${isDropdownOpen ? "active" : ""}`}>
                    <li><a href={"/results/2024"}>BioBrawl 2024</a></li>
                </ul>
            </li>

            <li><a href={"/faq"}>FAQ</a></li>
            <button on:click={() => goto("/register")}>Register for BioBrawl 2025</button>
        </div>
    </ul>
</nav>

<style lang="scss">
    button {
        @include button-primary;
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

        opacity: 0;
        transition: opacity 0.3s ease;

        &.active {
            opacity: 1;
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
</style>
