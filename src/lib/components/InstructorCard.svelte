<script lang="ts">
    import type { Instructor} from "$lib/types";
    import { capitalizeFirstLetter } from "$lib/util";

    const images = import.meta.glob("/src/lib/image/*.{png,jpg,jpeg,svg}", { eager: false });

    export let instructorData: Instructor;

    let showBio: boolean = false;
    let imageUrl: string | undefined = undefined;

    type Module = {
        default: string;
    };
    
    async function loadImage(imagePath: string): Promise<string | undefined> {
        try {
            const module: Module = (await images[`/src/lib/image/${imagePath}`]()) as Module;
            return module.default;
        } catch (error) {
            console.error("Failed to load image:", error);
            return undefined;
        }
    }

    // $: loadImage(instructorData.imagePath).then((url) => (imageUrl = url));

    function toggleBio() {
        showBio = !showBio;
    }
</script>

<div id="card-container">
    <div id="top-container">
        <div class="text-container">
            <h2>{instructorData.name}</h2>
            {#if instructorData.additionalRole}
                <h3 class="additional-role">{instructorData.additionalRole}</h3>
            {/if}
            <h3>
                {instructorData.subjects
                    .map(subject => capitalizeFirstLetter(subject))
                    .join(", ")} {instructorData.role}
            </h3>
            <h4>{instructorData.school}</h4>
        </div>
        <img src={instructorData.imageUrl} alt="instructor" />
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
    $card-height: 160px;
    $card-padding: 20px;
    $card-width: 520px;

    $animation-duration: 0.3s;

    #toggle-button {
        position: absolute;
        background: linear-gradient(135deg, rgba($primary, 0.8) 0%, rgba($primary, 0.6) 100%);
        height: 36px;
        width: 36px;
        border-radius: 50%;
        border-style: none;
        bottom: -18px;
        right: $card-padding;
        cursor: pointer;

        transition: all $animation-duration cubic-bezier(0.4, 0, 0.2, 1);

        opacity: 0.7;

        svg {
            transform: rotate(180deg);
            transition: transform $animation-duration ease;
            color: white;
        }

        &.active {
            opacity: 1;
            background: linear-gradient(135deg, rgba($secondary, 0.9) 0%, rgba($secondary, 0.7) 100%);
            transform: scale(1.1);

            svg {
                transform: rotate(0deg);
            }
        }

        &:hover {
            opacity: 1;
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 8px 20px rgba($primary, 0.4);
        }

        &.active:hover {
            box-shadow: 0 8px 20px rgba($secondary, 0.4);
        }
    }

    h2 {
        letter-spacing: -0.03em;
        margin-bottom: 6px;
        font-size: 1.4rem;
        font-weight: 600;
        color: $accent;
    }

    h3 {
        letter-spacing: -0.02em;
        margin-bottom: 8px;
        font-size: 1rem;
        font-weight: 500;
        color: darken($text-color, 15%);
        
        &.additional-role {
            font-size: 1.1rem;
            font-weight: 600;
            color: $secondary;
            margin-bottom: 4px;
            margin-top: 2px;
        }
    }

    h4 {
        font-size: 0.9rem;
        font-weight: 400;
        color: lighten($accent, 30%);
        margin: 0;
    }

    p {
        line-height: 1.5;
        text-align: justify;
        color: darken($text-color, 10%);
        font-size: 0.95rem;
    }

    #top-container {
        display: flex;
        position: relative;
        flex-direction: row;
        align-items: center;
        gap: 1.5rem;
    }

    #bottom-container {
        overflow: hidden;
        max-height: 0px;
        margin-top: 0px;

        transition: all $animation-duration cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;

        &.active {
            margin-top: 24px;
            max-height: 400px;
            opacity: 1;
        }
    }

    #card-container {
        width: 100%;
        max-width: $card-width;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        padding: $card-padding;
        border-radius: 16px;
        position: relative;
        background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.9) 0%, 
            rgba($background-color, 0.8) 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        transition: all $animation-duration cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
            border-color: rgba($primary, 0.3);
        }
    }

    .text-container {
        flex: 1;
    }

    img {
        height: $card-height;
        width: $card-height;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid rgba($primary, 0.2);
        transition: all $animation-duration ease;

        &:hover {
            border-color: $primary;
            transform: scale(1.02);
        }
    }
</style>
