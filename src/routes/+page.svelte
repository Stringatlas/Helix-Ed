<script lang="ts">
    import BookIcon from "$lib/images/icons/book.png";
    import MoneyIcon from "$lib/images/icons/money.png";
    import SchoolIcon from "$lib/images/icons/school.png";

    import TutorImage from "$lib/images/tutor.jpg";
    import SuccessImage from "$lib/images/goals.jpg";

    import Typewriter from "$lib/components/Typewriter.svelte";
    import HelixCanvas from "$lib/components/HelixCanvas.svelte";
    import SubjectMagnetBubbles from "$lib/components/SubjectMagnetBubbles.svelte";
    import { goto } from "$app/navigation";

    let careers = [
        "engineers",
        "doctors",
        "chemists",
        "inventors",
        "educators",
        "physicists",
        "analysts",
        "scientists",
        "astronomers",
        "biologists",
        "roboticists",
        "economists",
        "mathematicians",
        "programmers",
        "researchers",
        "innovators",
        "entrepreneurs",
        "developers",
    ];

    let isAttracting = false;
    let magnetButtonEl: HTMLButtonElement;
</script>

<body>
    <section id="landing-section">
        <div class="hero-backdrop" aria-hidden="true">
            <HelixCanvas />
        </div>
        <SubjectMagnetBubbles {isAttracting} targetEl={magnetButtonEl} />
        <div class="hero-container">
            <div class="hero-content">
                <h1>
                    Empowering future <br />
                    <span class="typewriter-wrapper"
                        ><Typewriter words={careers} /></span
                    >
                    <br />through personalized education
                </h1>
                <h2>Igniting passion and mastery in the sciences</h2>

                <div class="hero-actions">
                    <button
                        bind:this={magnetButtonEl}
                        class="hero-cta-btn"
                        class:attracting={isAttracting}
                        on:mouseenter={() => (isAttracting = true)}
                        on:mouseleave={() => (isAttracting = false)}
                        on:focus={() => (isAttracting = true)}
                        on:blur={() => (isAttracting = false)}
                        on:click={() => goto("/enroll")}
                    >
                        <span class="btn-text">View our courses</span>
                        <span class="btn-arrow">→</span>
                        <span class="btn-magnet-glow" aria-hidden="true"></span>
                    </button>
                </div>
            </div>
        </div>
    </section>

    <div class="why-helix-section">
        <h2 class="section-title">Why Helix Ed?</h2>
        
        <p class="why-helix-blurb">
            At Helix-Ed, we provide university-led education designed
            for academic success. Our tutors are current students from
            top-tier universities who bring real-world expertise to help
            middle and high school students excel in their academic
            subjects.
        </p>

        <section id="why">
            <div>
                <img
                    src={BookIcon}
                    alt="book icon"
                    loading="eager"
                    fetchpriority="high"
                    width="64"
                    height="64"
                />
                <h2>Outstanding Curriculum</h2>
                <p>
                    Dive into a well-structured learning path that has been
                    proven effective, setting you up for success in every
                    lesson.
                </p>
            </div>
            <div>
                <img
                    src={SchoolIcon}
                    alt="school icon"
                    loading="lazy"
                    width="64"
                    height="64"
                />
                <h2>Top-Tier Instructors</h2>
                <p>
                    Our instructors come from top universities, ensuring a
                    learning experience that's both high-quality and
                    personalized.
                </p>
            </div>
            <div>
                <img
                    src={MoneyIcon}
                    alt="money icon"
                    loading="lazy"
                    width="64"
                    height="64"
                />
                <h2>Quality at a Low Cost</h2>
                <p>
                    Experience premium courses at affordable rates, making
                    education both accessible and effective.
                </p>
            </div>
        </section>
    </div>

    <section id="about-approach">
        <div class="content-wrapper">
            <div class="text-content">
                <h2>University-Led Education That Makes a Difference</h2>
                <p>
                    Our university-led approach to education combines academic
                    excellence with relatable teaching. Each instructor is
                    carefully selected from prestigious universities and trained
                    to deliver personalized, engaging lessons. We believe that
                    learning from passionate university students who recently
                    mastered these subjects themselves creates an ideal
                    environment for academic success.
                </p>
                <p>
                    Whether you're preparing for AP exams, strengthening
                    foundational knowledge, or exploring advanced topics in
                    chemistry, physics, biology, economics, or mathematics, our
                    instructors adapt to your learning style and pace. We focus
                    on building genuine understanding, not just memorization,
                    empowering future engineers, doctors, scientists, and
                    economists through education that inspires.
                </p>
            </div>
            <div class="image-content">
                <img
                    src={TutorImage}
                    alt="Tutor teaching two students"
                    loading="lazy"
                />
            </div>
        </div>
    </section>

    <section id="student-success">
        <div class="content-wrapper reverse">
            <div class="image-content">
                <img
                    src={SuccessImage}
                    alt="Vector art of person achieving academic success"
                    loading="lazy"
                />
            </div>
            <div class="text-content">
                <h2>Proven Results for Academic Success</h2>
                <p>
                    Students working with Helix-Ed consistently achieve their
                    academic goals. Our personalized education approach has
                    helped hundreds of middle and high school students improve
                    grades, gain confidence, and develop lasting study skills.
                    The combination of university-level expertise and affordable
                    pricing makes quality education accessible to all families
                    seeking academic excellence.
                </p>
                <p>
                    From mastering complex concepts in chemistry and physics to
                    building strong foundations in mathematics and economics,
                    our students experience measurable improvements in their
                    understanding and performance. Join the community of
                    successful students who have transformed their academic
                    journey with Helix-Ed.
                </p>
            </div>
        </div>
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

        @include button-primary;

        &:hover {
            box-shadow: 0 4px 12px rgba($primary, 0.4);
        }

        &.hero-cta-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
            font-weight: 600;
            letter-spacing: 0.3px;
            cursor: pointer;
            transition:
                transform 0.28s cubic-bezier(0.34, 1.3, 0.64, 1),
                box-shadow 0.28s ease,
                filter 0.28s ease;
            z-index: 2;

            .btn-text {
                position: relative;
                z-index: 2;
            }

            .btn-arrow {
                position: relative;
                z-index: 2;
                display: inline-block;
                transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            .btn-magnet-glow {
                position: absolute;
                inset: 0;
                border-radius: 50px;
                background: radial-gradient(
                    circle at 50% 50%,
                    rgba(255, 255, 255, 0.4) 0%,
                    rgba($neon-green, 0.2) 60%,
                    transparent 80%
                );
                opacity: 0;
                transition: opacity 0.35s ease;
                pointer-events: none;
                z-index: 1;
            }

            &:hover,
            &.attracting {
                transform: translateY(-2px) scale(1.025);
                box-shadow:
                    0 8px 24px rgba($primary, 0.45),
                    0 0 30px rgba($neon-green, 0.3);

                .btn-arrow {
                    transform: translateX(4px);
                }

                .btn-magnet-glow {
                    opacity: 1;
                }
            }

            &:active {
                transform: translateY(0) scale(0.99);
            }
        }
    }

    .why-helix-section {
        background: transparent;
        padding: 4rem 0;
        margin-top: 0;
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

        @include underline-header
    }

    .why-helix-blurb {
        text-align: center;
        max-width: 640px;
        margin: -1.5rem auto 3rem;
        font-size: 1.1rem;
        line-height: 1.7;
        letter-spacing: 0.3px;
        color: darken($text-color, 10%);
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
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - $nav-height);
        position: relative;
        z-index: 1;
        background: transparent;
        padding: 2rem 6% 3.5rem;
        overflow: hidden;

        .hero-backdrop {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 65%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 0;
            overflow: visible;
            // Fade the bottom edge so the glow blends into the page background
            // instead of hard-clipping at the hero section boundary.
            -webkit-mask-image: linear-gradient(
                to bottom,
                black 0%,
                black 75%,
                transparent 100%
            );
            mask-image: linear-gradient(
                to bottom,
                black 0%,
                black 75%,
                transparent 100%
            );
        }

        .hero-container {
            display: flex;
            align-items: center;
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
            z-index: 2;
        }

        .hero-content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            max-width: 760px;
            z-index: 2;
        }

        h1 {
            font-size: clamp(2.4rem, 3.6vw, 3.6rem);
            margin-bottom: 28px;
            color: $accent;
            font-weight: 700;
            line-height: 1.18;
            text-align: left;

            .typewriter-wrapper {
                color: darken($primary, 10%);
            }
        }

        h2 {
            margin-bottom: 36px;
            color: lighten($accent, 15%);
            font-size: clamp(1.2rem, 1.6vw, 1.45rem);
            font-weight: 500;
            max-width: 620px;
            line-height: 1.45;
            text-align: left;
        }

        .hero-actions {
            display: flex;
            align-items: center;
            gap: 1.25rem;
            flex-wrap: wrap;
            margin-top: 4px;
        }
    }

    #about-approach,
    #student-success {
        padding: 6rem 5%;
        margin-bottom: 0;

        .content-wrapper {
            display: flex;
            align-items: center;
            gap: 4rem;
            max-width: 1400px;
            margin: 0 auto;
        }

        .text-content {
            flex: 1;

            h2 {
                font-size: 2.2rem;
                margin-bottom: 1.5rem;
                color: $accent;
                font-weight: 600;
                text-align: left;
            }

            p {
                line-height: 1.8;
                letter-spacing: 0.4px;
                color: darken($text-color, 10%);
                font-size: 1.05rem;
                margin-bottom: 1.5rem;
            }
        }

        .image-content {
            flex: 1;
            position: relative;

            img {
                width: 100%;
                height: auto;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                object-fit: cover;
                max-height: 400px;
            }

            // Green tint overlay to match background
            &::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba($primary, 0.05);
                border-radius: 12px;
                pointer-events: none;
                mix-blend-mode: multiply;
            }
        }
    }

    // Allow second section image to be more vertical
    #student-success {
        .image-content img {
            max-height: 500px;
        }
    }

    body {
        padding: 0;
        background: linear-gradient(
            135deg,
            $background-color 0%,
            rgba($primary, 0.05) 50%,
            rgba($secondary, 0.1) 100%
        );
        min-height: 100vh;
    }

    @media (max-width: 960px) {
        #landing-section {
            min-height: 100dvh;
            padding: 3.5rem 1.25rem 4.5rem;

            .hero-backdrop {
                width: 100%;
                opacity: 0.55;
                justify-content: center;
                // -webkit-mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
                // mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
            }

            .hero-container {
                justify-content: center;
            }

            .hero-content {
                align-items: center;
                text-align: center;
                max-width: 100%;
                width: 100%;
            }

            h1 {
                // Use more of the available width per line so the headline
                // wraps into fewer, wider lines instead of a narrow ragged
                // stack down the center of the screen.
                font-size: clamp(2.1rem, 9vw, 2.9rem);
                line-height: 1.15;
                margin-bottom: 24px;
                text-align: center;
                max-width: 22ch;
                margin-left: auto;
                margin-right: auto;
            }

            h2 {
                font-size: 1.1rem;
                line-height: 1.5;
                margin-bottom: 28px;
                text-align: center;
                max-width: 34ch;
                margin-left: auto;
                margin-right: auto;
            }

            .hero-actions {
                justify-content: center;
                margin-top: 4px;
            }
        }
    }

    @media (max-width: $mobile-width) {
        #about-approach,
        #student-success {
            padding: 4rem 1.5rem;

            .content-wrapper {
                flex-direction: column;
                gap: 2rem;
            }

            .text-content {
                h2 {
                    font-size: 1.6rem;
                    margin-bottom: 1.5rem;
                    text-align: center;
                }

                p {
                    font-size: 0.95rem;
                    line-height: 1.7;
                }
            }

            .image-content img {
                max-height: 300px;
            }
        }

        #about-approach {
            .content-wrapper {
                flex-direction: column-reverse; // Image first, then text
            }
        }

        // Allow second section image to be taller on mobile too
        #student-success .image-content img {
            max-height: 400px;
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