<script lang="ts">
    import classroom from "$lib/images/classroom.jpg";
    import berkeley from "$lib/images/ucberkeley.jpg";

    import InstructorCard from "$lib/components/InstructorCard.svelte";
    import { tas, teachers, officers } from "$lib/stores/stores";
</script>

<main>
    <section id="title">
        <h1>About Us</h1>
        <h2>Meet our instructors</h2>
    </section>

    <section class="middle-section">
        <img src={classroom} alt="classroom" />
        <div>
            <h1>Our Mission</h1>
            <h2>Bringing academic excellence to every student</h2>
            <p>
                Our mission is to bridge the gap in school resources by providing exceptional academic support and instruction. We strive to ensure students transition smoothly to high school while
                encouraging them to delve deeply into their areas of interest. Our team of instructors, hailing from prestigious universities from around the United States, is dedicated to helping
                students uncover their passions and emerge as leaders in their chosen fields.
            </p>
        </div>
    </section>

    <section class="middle-section reverse">
        <div>
            <h1>Our Story</h1>
            <h2>From competition to community</h2>
            <p>
                With the goal of expanding academic opportunities for more students, the club leaders of the Basis Independent Silicon Valley USABO Club launched the BioBrawl biology competition in
                May 2024, featuring eight teams and over 40 participants. Building on this success, we soon founded HelixEd to broaden our educational offerings beyond biology by introducing online
                summer courses in Physics, Biology, Chemistry, and Economics for middle school to early high school students. These courses are taught by instructors from top universities and
                supported by high school TAs with excellent academic records, creating a vibrant and supportive learning community. Since its inception, HelixEd has grown into a thriving community,
                providing valuable educational experiences to an increasing number of students.
            </p>
        </div>
        <img src={berkeley} alt="uc berkeley" />
    </section>
</main>

<section id="team">
    <h1>Our Team</h1>
    <h2>Founders</h2>
    <div>
        {#each $officers as instructor}
            <InstructorCard instructorData={instructor} />
        {/each}
    </div>

    <h2>Our Instructors</h2>
    <div>
        {#each $teachers as instructor}
            <InstructorCard instructorData={instructor} />
        {/each}
    </div>

    <h2>Our TAs</h2>
    <div>
        {#each $tas as instructor}
            <InstructorCard instructorData={instructor} />
        {/each}
    </div>
</section>

<style lang="scss">
    #title {
        padding: 4rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: transparent;
        text-align: center;
        
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: $accent;
            font-weight: 700;
        }
        
        h2 {
            font-size: 1.5rem;
            color: $text-color;
            font-weight: 400;
            margin: 0;
        }
    }

    .middle-section {
        display: flex;
        flex-direction: row;
        margin: 4rem clamp(2rem, 8vw, 8rem);
        gap: clamp(1.5rem, 4vw, 3rem);
        align-items: center;
        
        div {
            display: flex;
            flex: 1;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
        }
        
        img {
            width: auto;
            height: auto;
            min-width: clamp(250px, 30vw, 320px);
            max-width: clamp(350px, 40vw, 440px);
            object-fit: contain;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        h1 {
            margin-bottom: 0.75rem;
            font-size: clamp(1.8rem, 3vw, 2.2rem);
            font-weight: 700;
            color: $accent;
        }
        
        h2 {
            margin-bottom: 1.5rem;
            font-size: clamp(1.1rem, 2vw, 1.3rem);
            font-weight: 500;
            color: $accent;
            line-height: 1.3;
        }
        
        p {
            line-height: 1.7;
            font-size: clamp(0.95rem, 1.5vw, 1rem);
            color: darken($text-color, 10%);
            text-align: justify;
            margin: 0;
        }
    }

    h1 {
        font-size: 2.5rem;
        margin: 0;
        color: $accent;
        font-weight: 700;
    }

    h2 {
        margin: 0;
        font-family: "Istok Web";
        color: $primary;
    }
    p {
        line-height: 1.5;
    }

    #team {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 4rem 2rem;
        margin-top: 2rem;

        h1 {
            text-align: center;
            margin-bottom: 3rem;
            font-size: 2.5rem;
            color: $accent;
            
            &::after {
                content: '';
                display: block;
                width: 80px;
                height: 4px;
                background: linear-gradient(90deg, $primary 0%, $secondary 100%);
                margin: 1rem auto 0;
                border-radius: 2px;
            }
        }

        h2 {
            margin-bottom: 2rem;
            font-size: 1.8rem;
            font-weight: 600;
            color: $accent;
        }

        div {
            display: flex;
            flex-direction: row;
            gap: 2rem;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            margin-bottom: 3rem;
        }
    }

    section {
        padding: 1rem;
    }

    @media (max-width: 1024px) and (min-width: #{$mobile-width + 1px}) {
        .middle-section {
            margin: 3rem 2rem;
            gap: 2rem;
            
            img {
                min-width: 280px;
                max-width: 350px;
            }
            
            h1 {
                font-size: 1.9rem;
            }
            
            h2 {
                font-size: 1.2rem;
                margin-bottom: 1.2rem;
            }
            
            p {
                font-size: 0.98rem;
                line-height: 1.6;
            }
        }
    }

    @media (max-width: 900px) and (min-width: #{$mobile-width + 1px}) {
        .middle-section {
            flex-direction: column;
            text-align: center;
            gap: 2rem;
            margin: 3rem 1.5rem;
            
            div {
                align-items: center;
                text-align: center;
            }
            
            img {
                max-width: 100%;
                width: 100%;
                max-width: 400px;
            }
            
            p {
                text-align: justify;
                max-width: 600px;
            }
        }
        
        .reverse {
            flex-direction: column;
        }
    }

    @media (max-width: $mobile-width) {
        main {
            .middle-section {
                display: flex;
                flex-direction: column;
                gap: 2.5rem;
                margin: 2.5rem 1rem;
                align-items: center;

                div {
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                img {
                    width: 100%;
                    max-width: 350px;
                }

                h1 {
                    margin-bottom: 0.75rem;
                    font-size: 1.8rem;
                }
                h2 {
                    margin-bottom: 1.25rem;
                    font-size: 1.1rem;
                }
                
                p {
                    text-align: justify;
                    font-size: 0.95rem;
                }
            }

            .reverse {
                flex-direction: column-reverse;
            }
        }
        
        #title {
            padding: 3rem 1rem;
            
            h1 {
                font-size: 2.2rem;
            }
            
            h2 {
                font-size: 1.3rem;
            }
        }
        
        #team {
            padding: 3rem 1rem;
            
            h1 {
                font-size: 2rem;
                margin-bottom: 2rem;
            }
            
            h2 {
                font-size: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            div {
                gap: 1.5rem;
                margin-bottom: 2.5rem;
            }
        }
    }
</style>
