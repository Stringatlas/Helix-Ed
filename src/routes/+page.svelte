<script lang="ts">
    import InstructorCard from "$lib/components/InstructorCard.svelte";
    import instructors from "$lib/instructorData.json";

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

    let careers = ["engineers", "doctors", "chemists", "teachers", "physicists", "scientists", "astronomers", "biologists", "roboticists", "economists"];
    // onMount(() => {
    //     createScene(backgroundCanvas);
    // });

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

<svelte:head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <link rel="apple-touch-icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Helix-Ed | University-Led Education for High School Success</title>
    <meta name="description" content="Igniting passion and mastery in the sciences! Helix-Ed offers affordable, high-level instruction from university students for middle and high schoolers." />
</svelte:head>

<body>
    <section id="landing-section">
        <canvas id="background" bind:this={backgroundCanvas}></canvas>
        <h1>Empowering future <span class="typewriter-wrapper"><Typewriter words={careers} /></span><br />through personalized education</h1>
        <h2>Igniting passion and mastery in the sciences</h2>
        <button on:click={() => goto("/enroll")} on:mousemove={handleMouseMove} style="--x: {mouseX}%; --y: {mouseY}%; ">View our courses →</button>
    </section>

    <div>
        <h2 style="text-align: center; font-size: 32px">Why Helix Ed?</h2>

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

// TODO - use schema.org to improve SEO // TODO - finish courses section in home page

<style lang="scss">
    button {
        border: none;
        padding: 1rem 3rem;
        font-size: 1.5rem;
        font-family: "Inter";
        background-color: $primary;

        border-radius: 16px;
        // font-weight: bold;
        // transition: background 0.3s ease;

        &:hover {
            background: radial-gradient(circle at var(--x) var(--y), darken($primary, 5%) 0%, $primary 100%);
        }
    }

    h1 {
        text-align: center;
        font-size: 32px;
        margin-bottom: 16px;
    }

    #why {
        padding: 0 15%;
        display: flex;
        flex-direction: row;
        gap: 64px;

        margin-bottom: 120px;
        margin-top: 64px;

        div {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            flex: 1;
            img {
                width: 100px;
                height: 100px;
                margin-bottom: 24px;
            }
            h2 {
                margin-bottom: 4px;
            }
            p {
                line-height: 1.5;
                letter-spacing: 1.5;
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
        margin-bottom: 3rem;
        position: relative;
        z-index: 0;

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
            color: black;
        }
        h2 {
            margin-bottom: 64px;
            color: black;
        }
    }
    #testimonials {
        margin: 20px;

        div {
            justify-content: center;
        }

        h1 {
            font-size: 32px;
            margin-bottom: 16px;
            text-align: center;
        }
        div {
            display: flex;
            flex-direction: row;
            gap: 16px;
            flex-wrap: wrap;
            align-items: flex-start;
        }
    }

    body {
        padding: 8px;
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
            gap: 64px;
        }
    }
</style>
