<script lang="ts">
//   import { page } from "$app/stores";
  import { page } from "$app/stores";
  import { capitalizeFirstLetter } from "$lib/util";
  import { instructors, teachers, tas, officers, courses } from "$lib/stores/stores";
  import type { Instructor, Course } from "$lib/types";
  import InstructorCard from "$lib/components/InstructorCard.svelte";

  let slug: string;
  let subjectTeachers: Instructor[] = [];
  let subjectTAs: Instructor[] = [];
  let course: Course | undefined;

  $: slug = $page.params.slug;
  $: course = $courses.find((c) => c.slug.current == slug);
  
  $: {
    let subject = course?.subject ?? "";
    subjectTeachers = $teachers.filter(
      (instructor) =>
        instructor.subjects &&
        instructor.subjects.some((s) => s.toLowerCase() === subject.toLowerCase()) &&
        course?.instructors?.includes(instructor.name)
    );
    subjectTAs = $tas.filter(
      (instructor) =>
        instructor.subjects &&
        instructor.subjects.some((s) => s.toLowerCase() === subject.toLowerCase()) &&
        course?.instructors?.includes(instructor.name)
    );
  }
</script>

<main>
  {#if course}
    <!-- Hero Section -->
    <section id="hero-section">
      <div class="hero-content">
        <div class="course-header">
          <h1 class="course-title">{course.title}</h1>
          <div class="course-meta">
            <span class="course-season">{course.season}</span>
            <span class="course-dates">{course.dates}</span>
            <div class="registration-status" class:open={course.registrationOpen} class:closed={!course.registrationOpen}>
              <span class="status-indicator"></span>
              <span class="status-text">{course.registrationOpen ? 'Registration Open' : 'Registration Closed'}</span>
            </div>
          </div>
        </div>
        
        {#if course.posterUrl}
          <div class="course-poster">
            <img src={course.posterUrl} alt="{course.title} poster" />
          </div>
        {/if}
      </div>
    </section>

    <!-- Course Content -->
    <section id="course-content">
      <div class="content-container">
        <div class="main-content">
          <div class="content-section">
            <h2 class="section-title">About This Course</h2>
            <p class="section-text">{course.description}</p>
          </div>

          <div class="content-section">
            <h2 class="section-title">Who Should Take This Course?</h2>
            <p class="section-text">{course.studentDescription}</p>
          </div>

          <div class="content-section">
            <h2 class="section-title">Course Content</h2>
            <p class="section-text">{course.content}</p>
          </div>

          <div class="course-details">
            <div class="detail-card">
              <h3>Class Format</h3>
              <p>Small sized Zoom classes with recordings available for two months</p>
            </div>
            
            <div class="detail-card">
              <h3>Refund Policy</h3>
              <p>Full refund for two classes, no refund for further classes</p>
            </div>
          </div>

          <div class="action-section">
            {#if course.registrationOpen}
              <a href={course.registrationForm ?? "#"} class="action-button primary">
                <span>Register Now</span>
                <span class="button-icon">→</span>
              </a>
            {:else}
              <button class="action-button disabled" disabled>
                <span>Registration Closed</span>
              </button>
            {/if}
            
            <a href={course.syllabus ?? "#"} class="action-button secondary">
              <span>View Syllabus</span>
              <span class="button-icon">📄</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Instructors Section -->
    <section id="instructors-section">
      <div class="instructors-container">
        <h2 class="instructors-title">Meet Your Instructors</h2>
        <div class="instructors-grid">
          {#each subjectTeachers as instructor}
            <div class="instructor-wrapper">
              <InstructorCard instructorData={instructor} />
            </div>
          {/each}
          {#each subjectTAs as ta}
            <div class="instructor-wrapper">
              <InstructorCard instructorData={ta} />
            </div>
          {/each}
        </div>
      </div>
    </section>
  {:else}
    <section id="not-found">
      <div class="not-found-content">
        <h1>Course Not Found</h1>
        <p>Sorry, we couldn't find a course with the identifier: <strong>{slug}</strong></p>
        <a href="/enroll" class="action-button primary">View All Courses</a>
      </div>
    </section>
  {/if}
</main>

<style lang="scss">
    main {
        background: linear-gradient(135deg, $background-color 0%, rgba($primary, 0.05) 50%, rgba($secondary, 0.1) 100%);
        min-height: calc(100vh - $nav-height);
        padding: 0;
    }

    #hero-section {
        padding: 3rem 2rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        
        .hero-content {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 3rem;
            align-items: center;
        }
        
        .course-header {
            .course-title {
                font-size: 3rem;
                font-weight: 700;
                color: $accent;
                margin-bottom: 1.5rem;
                line-height: 1.2;
                
                &::after {
                    content: '';
                    display: block;
                    width: 80px;
                    height: 4px;
                    background: linear-gradient(90deg, $primary 0%, $secondary 100%);
                    margin-top: 1rem;
                    border-radius: 2px;
                }
            }
            
            .course-meta {
                display: flex;
                flex-wrap: wrap;
                gap: 1.5rem;
                align-items: center;
                
                .course-season, .course-dates {
                    font-size: 1.1rem;
                    color: lighten($accent, 20%);
                    font-weight: 500;
                }
                
                .registration-status {
                    display: flex;
                    align-items: center;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: 600;
                    
                    &.open {
                        background: linear-gradient(135deg, rgba($primary, 0.9), rgba($primary, 0.7));
                        color: white;
                        box-shadow: 0 4px 12px rgba($primary, 0.3);
                        
                        .status-indicator {
                            background: rgba(255, 255, 255, 0.9);
                            box-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
                        }
                    }
                    
                    &.closed {
                        background: linear-gradient(135deg, rgba(#ef4444, 0.9), rgba(#ef4444, 0.7));
                        color: white;
                        box-shadow: 0 4px 12px rgba(#ef4444, 0.3);
                        
                        .status-indicator {
                            background: rgba(255, 255, 255, 0.9);
                        }
                    }
                    
                    .status-indicator {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        margin-right: 8px;
                    }
                    
                    .status-text {
                        font-size: 0.9rem;
                    }
                }
            }
        }
        
        .course-poster {
            img {
                max-width: 300px;
                width: 100%;
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                transition: transform 0.3s ease;
                
                &:hover {
                    transform: scale(1.02);
                }
            }
        }
    }

    #course-content {
        padding: 4rem 2rem;
        
        .content-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .main-content {
            display: flex;
            flex-direction: column;
            gap: 3rem;
        }
        
        .content-section {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 20px;
            padding: 2.5rem;
            transition: all 0.3s ease;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                background: rgba(255, 255, 255, 0.9);
            }
            
            .section-title {
                font-size: 1.8rem;
                font-weight: 600;
                color: $accent;
                margin-bottom: 1rem;
                position: relative;
                
                &::before {
                    content: '';
                    position: absolute;
                    left: -20px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: 30px;
                    background: linear-gradient(180deg, $primary, $secondary);
                    border-radius: 2px;
                }
            }
            
            .section-text {
                color: $text-color;
                line-height: 1.7;
                font-size: 1.1rem;
                margin: 0;
            }
        }
        
        .course-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin: 2rem 0;
            
            .detail-card {
                background: rgba(255, 255, 255, 0.7);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 15px;
                padding: 2rem;
                text-align: center;
                transition: all 0.3s ease;
                
                &:hover {
                    transform: translateY(-2px);
                    background: rgba(255, 255, 255, 0.85);
                }
                
                h3 {
                    color: $accent;
                    font-size: 1.3rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                
                p {
                    color: $text-color;
                    line-height: 1.6;
                    margin: 0;
                }
            }
        }
        
        .action-section {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 2rem;
        }
        
        .action-button {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 180px;
            justify-content: center;
            
            .button-icon {
                font-size: 1.2rem;
                transition: transform 0.3s ease;
            }
            
            &.primary {
                @include button-primary;
                
                &:hover .button-icon {
                    transform: translateX(3px);
                }
            }
            
            &.secondary {
                @include button-secondary;
                
                &:hover .button-icon {
                    transform: scale(1.1);
                }
            }
            
            &.disabled {
                background: #9ca3af;
                color: white;
                cursor: not-allowed;
                
                &:hover {
                    transform: none;
                    box-shadow: none;
                }
            }
        }
    }

    #instructors-section {
        padding: 4rem 2rem;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(5px);
        
        .instructors-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .instructors-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: $accent;
            text-align: center;
            margin-bottom: 3rem;
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
        
        .instructors-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            
            .instructor-wrapper {
                display: flex;
                justify-content: center;
            }
        }
    }

    #not-found {
        padding: 6rem 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        
        .not-found-content {
            text-align: center;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 20px;
            padding: 4rem;
            max-width: 500px;
            
            h1 {
                font-size: 2.5rem;
                color: $accent;
                margin-bottom: 1rem;
            }
            
            p {
                color: $text-color;
                font-size: 1.1rem;
                line-height: 1.6;
                margin-bottom: 2rem;
                
                strong {
                    color: $primary;
                }
            }
        }
    }

    @media (max-width: $mobile-width) {
        #hero-section {
            padding: 2rem 1rem;
            
            .hero-content {
                grid-template-columns: 1fr;
                gap: 2rem;
                text-align: center;
                
                .course-header .course-title {
                    font-size: 2.2rem;
                    
                    &::after {
                        margin: 1rem auto 0;
                    }
                }
                
                .course-meta {
                    justify-content: center;
                    gap: 1rem;
                    
                    .registration-status {
                        width: 100%;
                        justify-content: center;
                        max-width: 200px;
                    }
                }
            }
            
            .course-poster img {
                max-width: 250px;
            }
        }
        
        #course-content {
            padding: 2rem 1rem;
            
            .content-section {
                padding: 1.5rem;
                
                .section-title {
                    font-size: 1.5rem;
                    
                    &::before {
                        display: none;
                    }
                }
                
                .section-text {
                    font-size: 1rem;
                }
            }
            
            .course-details {
                grid-template-columns: 1fr;
                gap: 1rem;
                
                .detail-card {
                    padding: 1.5rem;
                    
                    h3 {
                        font-size: 1.2rem;
                    }
                }
            }
            
            .action-section {
                flex-direction: column;
                align-items: center;
                
                .action-button {
                    width: 100%;
                    max-width: 280px;
                }
            }
        }
        
        #instructors-section {
            padding: 2rem 1rem;
            
            .instructors-title {
                font-size: 2rem;
                margin-bottom: 2rem;
            }
            
            .instructors-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
        }
        
        #not-found {
            padding: 3rem 1rem;
            
            .not-found-content {
                padding: 2.5rem 1.5rem;
                
                h1 {
                    font-size: 2rem;
                }
                
                p {
                    font-size: 1rem;
                }
            }
        }
    }
</style>
