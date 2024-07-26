<script lang="ts">
    import type { InstructorData } from "$lib/types";
    import { capitalizeFirstLetter } from "$lib/util";

    export let instructorData: InstructorData;
    export let subject: string;

    let showBio: boolean = false;

    function toggleBio() {
        showBio = !showBio;
        console.log(showBio);
    }
</script>

<div id="card-container">
    <div id="top-container">
        <div class="text-container">
            <h2>{instructorData.name}</h2>
            <h3>{capitalizeFirstLetter(subject)} {instructorData.role}</h3>
            <h4>{instructorData.school}</h4>
        </div>
        <img src={instructorData.imagePath} alt="instructor" />
        <button id="toggle-button" class={showBio ? "active" : ""} on:click={toggleBio}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
            </svg>
        </button>
    </div>

    <div id="bottom-container" class={showBio ? "active" : ""}>
        <p>{instructorData.bio}</p>
    </div>
</div>

<style lang="scss">
    $card-height: 150px;
    $card-padding: 16px;
    $card-width: 500px;

    $animation-duration: 0.5s;

    #toggle-button {
        position: absolute;
        // background: linear-gradient(to top, rgb(65, 70, 79), rgba(255, 0, 0, 0));
        background: radial-gradient(ellipse at bottom, lighten($background-color, 10%) 0%, rgba(255, 0, 0, 0) 75%);
        height: 30px;

        border-style: none;
        bottom: -$card-padding;
        left: -$card-padding;
        width: calc(100% + 2 * $card-padding);

        transition:
            transform $animation-duration ease,
            opacity $animation-duration ease,
            bottom $animation-duration ease;

        opacity: 0.2;

        svg {
            transform: rotate(180deg);
            transition: transform $animation-duration ease;
        }

        &.active {
            opacity: 1;
            // height: 46px;
            // bottom: -$card-padding - 16px;
            // background: radial-gradient(ellipse, lighten($background-color, 10%) 0%, rgba(255, 0, 0, 0) 75%);
            background: none;

            bottom: svg {
                transform: rotate(0deg);
            }
        }

        &:hover {
            opacity: 1;
        }
    }

    h2 {
        letter-spacing: -0.03em;
        margin-bottom: 4px;
    }

    h3 {
        letter-spacing: -0.02em;
        margin-bottom: 24px;
    }

    p {
        line-height: 1.25;
        text-align: justify;
    }

    #top-container {
        display: flex;
        position: relative;
        flex-direction: row;
        align-items: center;
    }

    #bottom-container {
        overflow: hidden;
        max-height: 0px;
        margin-top: 0px;

        transition:
            max-height $animation-duration ease,
            margin-top $animation-duration ease;

        &.active {
            margin-top: 32px;
            max-height: 500px;
        }
    }

    #card-container {
        width: $card-width;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        padding: $card-padding;
        border-radius: 8px;

        position: relative;
        background: radial-gradient(circle at top left, darken($background-color, 5%) 0%, $background-color 80%);
    }

    .text-container {
        flex: 1;
    }

    img {
        height: $card-height;
        width: $card-height;
        border-radius: 50%;
        object-fit: cover;
    }
</style>
