<script lang="ts">
    import CourseCard from "$lib/components/CourseCard.svelte";
    import { openCourses, closedCourses } from "$lib/stores/stores";
</script>

<main>
    <section id="hero-section">
        <div class="hero-content">
            <h1>Our Courses</h1>
            <h2>Discover your passion through our expertly crafted curriculum</h2>
            <p>Join students from around the world in our interactive, engaging courses taught by instructors from top universities.</p>
        </div>
    </section>

    <section id="courses-section">
        <div class="courses-container">
            {#if $openCourses.length > 0}
                <div class="courses-group">
                    <h3 class="group-title">
                        <span class="status-indicator open"></span>
                        Registration Open
                    </h3>
                    <div class="courses-grid">
                        {#each $openCourses as course}
                            <CourseCard courseData={course} />
                        {/each}
                    </div>
                </div>
            {/if}

            {#if $closedCourses.length > 0}
                <div class="courses-group">
                    <h3 class="group-title">
                        <span class="status-indicator closed"></span>
                        Registration Closed
                    </h3>
                    <div class="courses-grid">
                        {#each $closedCourses as course}
                            <CourseCard courseData={course} />
                        {/each}
                    </div>
                </div>
            {/if}
        </div>

        <div class="enrollment-cta">
            <h3>Ready to start your learning journey?</h3>
            <p>Have questions about our courses? Want to learn more about what makes Helix-Ed special?</p>
            <div class="cta-buttons">
                <a href="/contact" class="cta-button primary">Contact Us</a>
                <a href="/about-us" class="cta-button secondary">Learn More</a>
            </div>
        </div>
    </section>
</main>

<style lang="scss">
    main {
        background: linear-gradient(135deg, $background-color 0%, rgba($primary, 0.05) 50%, rgba($secondary, 0.1) 100%);
        min-height: calc(100vh - $nav-height);
        padding: 0;
    }

    #hero-section {
        padding: 4rem 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        
        .hero-content {
            max-width: 800px;
            
            h1 {
                font-size: 3.5rem;
                margin-bottom: 1.5rem;
                color: $accent;
                font-weight: 700;
                position: relative;
                
                &::after {
                    content: '';
                    position: absolute;
                    bottom: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 100px;
                    height: 4px;
                    background: linear-gradient(90deg, $primary 0%, $secondary 100%);
                    border-radius: 2px;
                }
            }
            
            h2 {
                font-size: 1.5rem;
                color: lighten($accent, 20%);
                margin-bottom: 1.5rem;
                font-weight: 400;
                line-height: 1.4;
            }
            
            p {
                font-size: 1.1rem;
                color: $text-color;
                line-height: 1.6;
                margin-bottom: 0;
                opacity: 0.9;
            }
        }
    }

    #courses-section {
        padding: 4rem 2rem;
        
        .courses-container {
            max-width: 1200px;
            margin: 0 auto;
        }
    }

    .courses-group {
        margin-bottom: 4rem;
        
        .group-title {
            display: flex;
            align-items: center;
            font-size: 2rem;
            font-weight: 600;
            color: $accent;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid rgba($primary, 0.2);
            
            .status-indicator {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                margin-right: 1rem;
                
                &.open {
                    background: linear-gradient(135deg, $primary, lighten($primary, 20%));
                    box-shadow: 0 0 10px rgba($primary, 0.3);
                }
                
                &.closed {
                    background: linear-gradient(135deg, #ef4444, #f87171);
                    box-shadow: 0 0 10px rgba(#ef4444, 0.3);
                }
            }
        }
        
        .courses-grid {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
    }

    .enrollment-cta {
        margin-top: 5rem;
        padding: 3rem;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 20px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        text-align: center;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
        
        h3 {
            font-size: 2rem;
            color: $accent;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        
        p {
            font-size: 1.1rem;
            color: $text-color;
            margin-bottom: 2rem;
            line-height: 1.6;
            opacity: 0.9;
        }
        
        .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .cta-button {
            text-decoration: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            
            &.primary {
                @include button-primary;
            }
            
            &.secondary {
                @include button-secondary;
            }
            
            &:hover {
                transform: translateY(-2px);
            }
        }
    }

    @media (max-width: $mobile-width) {
        #hero-section {
            padding: 3rem 1.5rem;
            
            .hero-content {
                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }
                
                h2 {
                    font-size: 1.3rem;
                    margin-bottom: 1rem;
                }
                
                p {
                    font-size: 1rem;
                }
            }
        }
        
        #courses-section {
            padding: 2rem 1rem;
        }
        
        .courses-group {
            .group-title {
                font-size: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .courses-grid {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
        }
        
        .enrollment-cta {
            padding: 2rem 1.5rem;
            margin-top: 3rem;
            
            h3 {
                font-size: 1.5rem;
            }
            
            p {
                font-size: 1rem;
            }
            
            .cta-buttons {
                flex-direction: column;
                align-items: center;
                
                .cta-button {
                    width: 100%;
                    max-width: 250px;
                }
            }
        }
    }
</style>
