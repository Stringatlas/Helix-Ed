<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Course } from "$lib/types";

    export let courseData: Course;

    let isHovered = false;
</script>

<div 
    class="card" 
    class:hovered={isHovered}
    on:mouseenter={() => isHovered = true}
    on:mouseleave={() => isHovered = false}
    role="button" 
    tabindex="0"
    on:click={() => courseData.registrationOpen && goto("/classes/" + courseData.slug.current)}
    on:keydown={(e) => e.key === 'Enter' && courseData.registrationOpen && goto("/classes/" + courseData.slug.current)}
>
    <!-- Status Badge -->
    <div class="status-badge" class:open={courseData.registrationOpen} class:closed={!courseData.registrationOpen}>
        <div class="status-indicator"></div>
        <span class="status-text">
            {courseData.registrationOpen ? 'Open' : 'Closed'}
        </span>
    </div>

    <!-- Card Content -->
    <div class="card-content">
        <div class="course-header">
            <h1 class="course-title">{courseData.season} {courseData.title}</h1>
            <h2 class="course-dates">{courseData.dates}</h2>
        </div>

        <div class="course-description">
            <p>{courseData.content}</p>
        </div>

        <div class="card-footer">
            {#if courseData.registrationOpen}
                <button 
                    class="enroll-button"
                    on:click|stopPropagation={() => goto("/classes/" + courseData.slug.current)}
                >
                    View Course Details
                    <span class="button-icon">→</span>
                </button>
            {:else}
                <div class="closed-notice">
                    <span class="closed-text">Registration Closed</span>
                    <p class="closed-subtext">Check back for future offerings</p>
                </div>
            {/if}
        </div>
    </div>

    <!-- Decorative Elements -->
    <div class="card-glow" class:visible={isHovered}></div>
    <div class="corner-accent"></div>
</div>

<style lang="scss">
    .card {
        position: relative;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;
        padding: 0;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.08),
            0 1px 3px rgba(0, 0, 0, 0.1);
        
        &:hover, &.hovered {
            transform: translateY(-4px) scale(1.01);
            box-shadow: 
                0 8px 20px rgba(0, 0, 0, 0.08),
                0 4px 8px rgba($primary, 0.1);
            background: rgba(255, 255, 255, 0.9);
            border-color: rgba($primary, 0.2);
        }
        
        &:active {
            transform: translateY(-2px) scale(1.005);
        }
    }

    .status-badge {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        padding: 8px 14px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        z-index: 10;
        transition: all 0.3s ease;
        
        .status-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
            transition: all 0.3s ease;
        }
        
        .status-text {
            font-weight: 600;
        }
        
        &.open {
            background: linear-gradient(135deg, rgba($primary, 0.9) 0%, rgba($primary, 0.7) 100%);
            color: white;
            box-shadow: 0 4px 12px rgba($primary, 0.3);
            
            .status-indicator {
                background: rgba(255, 255, 255, 0.9);
                box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
            }
        }
        
        &.closed {
            background: linear-gradient(135deg, rgba(#ef4444, 0.9) 0%, rgba(#ef4444, 0.7) 100%);
            color: white;
            box-shadow: 0 4px 12px rgba(#ef4444, 0.3);
            
            .status-indicator {
                background: rgba(255, 255, 255, 0.9);
            }
        }
    }

    .card-content {
        padding: 30px;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .course-header {
        margin-bottom: 20px;
        
        .course-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: $accent;
            margin-bottom: 8px;
            line-height: 1.3;
            transition: color 0.3s ease;
        }
        
        .course-dates {
            font-size: 1rem;
            font-weight: 500;
            color: lighten($accent, 30%);
            margin: 0;
            opacity: 0.8;
        }
    }

    .course-description {
        flex-grow: 1;
        margin-bottom: 24px;
        
        p {
            color: $text-color;
            line-height: 1.6;
            font-size: 1rem;
            margin: 0;
            opacity: 0.9;
        }
    }

    .card-footer {
        margin-top: auto;
    }

    .enroll-button {
        width: 100%;
        padding: 14px 24px;
        font-size: 1rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border-radius: 12px;
        transition: all 0.3s ease;
        
        .button-icon {
            font-size: 1.2rem;
            transition: transform 0.3s ease;
        }
        
        @include button-primary;
        
        &:hover {
            transform: none; // Override the mixin transform
            box-shadow: 0 4px 12px rgba($primary, 0.3);
            
            .button-icon {
                transform: translateX(2px);
            }
        }
    }

    .closed-notice {
        text-align: center;
        padding: 16px;
        background: rgba(#ef4444, 0.1);
        border: 1px solid rgba(#ef4444, 0.2);
        border-radius: 12px;
        
        .closed-text {
            display: block;
            color: #dc2626;
            font-weight: 600;
            font-size: 1rem;
            margin-bottom: 4px;
        }
        
        .closed-subtext {
            color: lighten(#dc2626, 20%);
            font-size: 0.85rem;
            margin: 0;
            opacity: 0.8;
        }
    }

    .card-glow {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at center, rgba($primary, 0.1) 0%, transparent 70%);
        border-radius: 20px;
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none;
        
        &.visible {
            opacity: 0.6;
        }
    }

    .corner-accent {
        position: absolute;
        top: 0;
        left: 0;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, rgba($primary, 0.1) 0%, transparent 70%);
        border-radius: 20px 0 20px 0;
        pointer-events: none;
    }

    // Enhanced hover effects for the entire card
    .card:hover {
        .course-title {
            color: $primary;
        }
        
        .status-badge {
            transform: scale(1.02);
        }
        
        .corner-accent {
            background: linear-gradient(135deg, rgba($primary, 0.2) 0%, transparent 70%);
        }
    }

    @media (max-width: $mobile-width) {
        .card {
            &:hover, &.hovered {
                transform: translateY(-2px) scale(1.005);
            }
        }
        
        .status-badge {
            top: 15px;
            right: 15px;
            padding: 6px 10px;
            font-size: 0.8rem;
        }
        
        .card-content {
            padding: 24px 20px;
        }
        
        .course-header {
            margin-bottom: 16px;
            
            .course-title {
                font-size: 1.3rem;
            }
            
            .course-dates {
                font-size: 0.9rem;
            }
        }
        
        .course-description {
            margin-bottom: 20px;
            
            p {
                font-size: 0.95rem;
            }
        }
        
        .enroll-button {
            padding: 12px 20px;
            font-size: 0.95rem;
        }
    }
</style>
