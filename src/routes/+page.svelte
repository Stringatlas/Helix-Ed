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

    let careers = ["engineers", "doctors", "chemists", "teachers", "physicists", "scientists", "astronomers", "biologists", "roboticists", "economists"];
</script>

<body>
    <section id="landing-section">
        <h1>Empowering future <Typewriter words={careers} /><br />through personalized education</h1>
        <h2>Igniting passion and mastery in the sciences</h2>
        <button>View our courses</button>
    </section>
    <h1>Why Helix Ed?</h1>

    <section id="why">
        <div>
            <img src={BookIcon} alt="" />
            <h2>Outstanding Curriculum</h2>
            <p>Dive into a well-structured learning path that has been proven effective, setting you up for success in every lesson.</p>
        </div>
        <div>
            <img src={SchoolIcon} alt="" />
            <h2>Top-Tier Instructors</h2>
            <p>Our instructors come from top universities, ensuring a learning experience that's both high-quality and personalized.</p>
        </div>
        <div>
            <img src={MoneyIcon} alt="" />
            <h2>Quality at a Low Cost</h2>
            <p>Experience premium courses at affordable rates, making education both accessible and effective.</p>
        </div>
    </section>
    <section id="testimonials">
        <h1>Reviews</h1>
        <div>
            {#each testimonials as testimonial}
                <TestimonialCard {...testimonial} />
            {/each}
        </div>
    </section>
</body>

<style lang="scss">
    button {
        border: none;
        padding: 20px 16px;
        background: radial-gradient(circle at top left, darken($primary, 10%) 0%, $primary 100%);
        border-radius: 16px;
        font-weight: bold;
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
        margin-top: 24px;

        div {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            flex: 1;
            img {
                width: 100px;
                height: 100px;
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
        padding: 0 15%;
        height: 100vh;
        text-align: center;

        h1 {
            font-size: 52px;
            margin-bottom: 16px;
        }
        h2 {
            margin-bottom: 64px;
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
    }

    body {
        padding: 8px;
    }

    div {
        display: flex;
        flex-direction: row;
        gap: 16px;
        flex-wrap: wrap;
        align-items: flex-start;
    }
</style>
