<script lang="ts">
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
            <a href="/"><img src="/logo.png" alt="logo" /></a>
        </li>
        <div class="nav-links">
            <li class="dropdown" on:mouseleave={closeDropdown}>
                <a id="our-classes" href="/" on:mouseenter={toggleDropdown} on:click|preventDefault={toggleDropdown}>Our classes<span style="font-size: 8px">▼</span></a>
                <ul class={`dropdown-menu ${isDropdownOpen ? "active" : ""}`}>
                    <li><a href="/classes/physics">Physics</a></li>
                    <li><a href="/classes/chemistry">Chemistry</a></li>
                    <li><a href="/classes/biology">Biology</a></li>
                    <li><a href="/classes/economics">Economics</a></li>
                </ul>
            </li>

            <li><a href="/about-us">About Us</a></li>
        </div>
    </ul>
</nav>

<style lang="scss">
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
        font-size: 20px;
        color: $text-color;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    nav {
        background: $background-darker;
        color: white;
        padding: 12px;
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
        background: $background-darker;
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
        background-color: lighten($background-darker, 10%);
    }
</style>
