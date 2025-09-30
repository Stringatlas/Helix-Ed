<script lang="ts">
    import InstructorCard from "$lib/components/InstructorCard.svelte";

    import BookIcon from "$lib/images/icons/book.png";
    import MoneyIcon from "$lib/images/icons/money.png";
    import SchoolIcon from "$lib/images/icons/school.png";

    import testimonials from "$lib/testimonialData.json";
    import TestimonialCard from "$lib/components/TestimonialCard.svelte";
    import FlippingText from "$lib/components/FadingText.svelte";
    import Typewriter from "$lib/components/Typewriter.svelte";
    import type { TestimonialData } from "$lib/types";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { createScene } from "$lib/landingScene";

    let backgroundCanvas: HTMLCanvasElement;
    let backgroundCanvasDiv: HTMLDivElement;

    let careers = ["engineers", "doctors", "chemists", "teachers", 
                    "physicists", "scientists", "astronomers", "biologists", 
                    "roboticists", "economists", "mathematicians"];
    
    onMount(() => {
        // createScene(backgroundCanvas);
    });

    let mouseX: number;
    let mouseY: number;

    function handleMouseMove(event: MouseEvent) {
        const { offsetX, offsetY, target } = event;
        const { clientWidth, clientHeight } = target as HTMLButtonElement;
        const posX = (offsetX / clientWidth) * 100;
        const posY = (offsetY / clientHeight) * 100;
        mouseX = posX;
        mouseY = posY;
    }
</script>

<body>
    <section id="landing-section">
        <canvas id="background" bind:this={backgroundCanvas}></canvas>
        <h1>Empowering future <span class="typewriter-wrapper"><Typewriter words={careers} /></span><br />through personalized education</h1>
        <h2>Igniting passion and mastery in the sciences</h2>
        <button on:click={() => goto("/enroll")} on:mousemove={handleMouseMove} style="--x: {mouseX}%; --y: {mouseY}%; ">View our courses →</button>
    </section>

    <div class="why-helix-section">
        <h2 class="section-title">Why Helix Ed?</h2>

        <section id="why">
            <div>
                <img src={BookIcon} alt="book icon" />
                <h2>Outstanding Curriculum</h2>
                <p>Dive into a well-structured learning path that has been proven effective, setting you up for success in every lesson.</p>
            </div>
            <div>
                <img src={SchoolIcon} alt="school icon" />
                <h2>Top-Tier Instructors</h2>
                <p>Our instructors come from top universities, ensuring a learning experience that's both high-quality and personalized.</p>
            </div>
            <div>
                <img src={MoneyIcon} alt="money icon" />
                <h2>Quality at a Low Cost</h2>
                <p>Experience premium courses at affordable rates, making education both accessible and effective.</p>
            </div>
        </section>
    </div>

    <!-- <section id="courses">
        <h2 style="text-align: center; font-size: 32px">Our Courses</h2>
    </section> -->

    <section id="testimonials">
        <!-- <h1>Reviews</h1>
        <div>
            {#each testimonials as testimonial}
                <TestimonialCard {...testimonial} />
            {/each}
        </div> -->
    </section>
</body>

<!-- // TODO - use schema.org to improve SEO, structured data // TODO - finish courses section in home page-->


<!-- TODO - biobrawl and mathforreal subsections-->

<style lang="scss">
    button {
        font-size: 1.2rem;
        padding: 1rem 2.5rem;
        border-radius: 50px;
        position: relative;
        overflow: hidden;
        z-index: 1;
        
        // Optional: Add a subtle pulse animation
        animation: subtle-pulse 3s ease-in-out infinite;
        
        @include button-primary;
        
        // Enhanced interactive effect
        &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            transition: width 0.3s ease, height 0.3s ease;
            z-index: -1;
        }
        
        &:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 12px 30px rgba($primary, 0.4);
            
            &::before {
                width: 300px;
                height: 300px;
            }
        }
        
        &:active {
            transform: translateY(-2px) scale(1.02);
        }
    }
    
    @keyframes subtle-pulse {
        0%, 100% { 
            box-shadow: 0 4px 15px rgba($primary, 0.3);
        }
        50% { 
            box-shadow: 0 4px 20px rgba($primary, 0.4);
        }
    }

    .why-helix-section {
        background: transparent; // Let the body gradient show through seamlessly
        padding: 4rem 0;
        margin-top: 0; // No overlap needed with transparent background
        position: relative;
    }

    .section-title {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 3rem;
        color: $accent;
        font-weight: 700;
        position: relative;
        z-index: 1;
        
        &::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: linear-gradient(90deg, $primary 0%, $secondary 100%);
            border-radius: 2px;
        }
    }

    h1 {
        text-align: center;
        font-size: 32px;
        margin-bottom: 16px;
    }

    #why {
        padding: 0 10%;
        display: flex;
        flex-direction: row;
        gap: clamp(2rem, 5vw, 4rem);
        margin-bottom: 120px;
        margin-top: 0;
        position: relative;
        z-index: 1;

        div {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            flex: 1;
            padding: 0;
            background: transparent;
            border-radius: 0;
            backdrop-filter: none;
            border: none;
            transition: all 0.3s ease;
            
            &:hover {
                transform: none;
                box-shadow: none;
                background: transparent;
            }
            
            img {
                width: 80px;
                height: 80px;
                margin-bottom: 24px;
                filter: drop-shadow(0 4px 8px rgba($primary, 0.3));
            }
            
            h2 {
                margin-bottom: 12px;
                color: $accent;
                font-size: 1.5rem;
                font-weight: 600;
            }
            
            p {
                line-height: 1.6;
                letter-spacing: 0.5px;
                color: darken($text-color, 10%);
                font-size: 1rem;
            }
        }
    }

    #landing-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: $text-color;
        // padding: 0 15%;
        height: calc(100vh - $nav-height);
        text-align: center;
        margin-bottom: 0; // Remove margin to allow seamless transition
        position: relative;
        z-index: 0;
        background: transparent; // Let body gradient show through
        padding: 0 2rem;

        canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }

        h1 {
            font-size: 52px;
            margin-bottom: 32px;
            color: $accent;
            font-weight: 700;
            line-height: 1.2;
            
            .typewriter-wrapper {
                color: $primary;
            }
        }
        h2 {
            margin-bottom: 64px;
            color: lighten($accent, 20%);
            font-size: 1.5rem;
            font-weight: 400;
            max-width: 600px;
            line-height: 1.4;
        }
    }
    // #testimonials {
    //     margin: 20px;

    //     div {
    //         justify-content: center;
    //     }

    //     h1 {
    //         font-size: 32px;
    //         margin-bottom: 16px;
    //         text-align: center;
    //     }
    //     div {
    //         display: flex;
    //         flex-direction: row;
    //         gap: 16px;
    //         flex-wrap: wrap;
    //         align-items: flex-start;
    //     }
    // }

    body {
        padding: 8px;
        background: linear-gradient(135deg, $background-color 0%, rgba($primary, 0.05) 50%, rgba($secondary, 0.1) 100%);
        min-height: 100vh;
    }

    @media (max-width: $mobile-width) {
        #landing-section {
            h1 {
                font-size: 10vw;
                margin-bottom: 16px;
                color: black;
            }
            h2 {
                margin-bottom: 64px;
                margin-left: 8px;
                margin-right: 8px;
                color: black;
            }
        }

        #why {
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
            padding: 0 2rem;
            
            div {
                padding: 0;
                text-align: center;
                align-items: center;
                
                img {
                    width: 60px;
                    height: 60px;
                    margin-bottom: 1rem;
                }
                
                h2 {
                    font-size: 1.3rem;
                    margin-bottom: 0.8rem;
                }
                
                p {
                    font-size: 0.95rem;
                    letter-spacing: 0.3px;
                    max-width: none;
                }
            }
        }
        
        @media (max-width: 900px) and (min-width: #{$mobile-width + 1px}) {
            #why {
                padding: 0 5%;
                gap: clamp(1.5rem, 3vw, 2.5rem);
                
                div {
                    text-align: center;
                    align-items: center;
                    
                    h2 {
                        font-size: 1.4rem;
                    }
                    
                    p {
                        font-size: 0.95rem;
                    }
                }
            }
        }
        
        .section-title {
            font-size: 2rem;
            margin-bottom: 2rem;
        }
        
        .why-helix-section {
            padding: 3rem 0;
            margin-top: 0; // No negative margin needed
        }
    }
</style>
