<script lang="ts">
    import type { Instructor } from "$lib/types";
    import { capitalizeFirstLetter } from "$lib/util";

    export let instructorData: Instructor;

    const firstName = instructorData.name.split(" ")[0];
</script>

<div id="card-container">
    <div id="card-inner">
        <div id="card-front">
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
                <img 
                    src={instructorData.imageUrl} 
                    alt={`${instructorData.name} instructor portrait`} 
                    loading="lazy" 
                    width="150" 
                    height="150"
                />
            </div>
        </div>

        <div id="card-back">
            <h2>About {firstName}</h2>
            <p>{instructorData.bio}</p>
        </div>
    </div>
</div>

<style lang="scss">
    $card-height: 160px;
    $card-padding: 20px;
    $card-width: 520px;

    $animation-duration: 0.3s;

    #card-container {
        width: $card-width;
        max-width: 100%;
        height: $card-height + ($card-padding * 2);
        perspective: 2000px;
        position: relative;
        transition: transform $animation-duration cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
            transform: translateY(-4px);
        }
    }

    #card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform $animation-duration cubic-bezier(0.4, 0, 0.2, 1);

        #card-container:hover & {
            transform: rotateY(180deg);
        }
    }

    #card-front,
    #card-back {
        position: absolute;
        inset: 0;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        padding: $card-padding;
        border-radius: 16px;
        background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.9) 0%, 
            rgba($background-color, 0.8) 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        transition: box-shadow $animation-duration cubic-bezier(0.4, 0, 0.2, 1);

        #card-container:hover & {
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
            border-color: rgba($primary, 0.3);
        }
    }

    #card-front {
        overflow: hidden;
    }

    #card-back {
        transform: rotateY(180deg);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 24px 48px;
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
        margin-bottom: 24px;
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
        margin: 0;
    }

    #top-container {
        display: flex;
        position: relative;
        flex-direction: row;
        align-items: center;
        gap: 1.5rem;
        height: 100%;
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