<script lang="ts">
    import { ArrowRight, Books, CalendarBlank, LockKey } from "phosphor-svelte";
    import type { Course } from "$lib/types";

    export let courseData: Course;
</script>

<article class:closed={!courseData.registrationOpen} class="card">
    <div class="card-main">
        <div class="course-eyebrow">
            <Books size={17} weight="bold" aria-hidden="true" />
            <span>{courseData.subject}</span>
            <span class="separator" aria-hidden="true">•</span>
            <span>{courseData.season}</span>
        </div>

        <h3 class="course-title">{courseData.title}</h3>

        <div class="course-date">
            <CalendarBlank size={19} weight="bold" aria-hidden="true" />
            <span>{courseData.dates}</span>
        </div>

        <p class="course-description">{courseData.content}</p>
    </div>

    <div class="card-action">
        {#if courseData.registrationOpen}
            <a class="details-link" href={'/classes/' + courseData.slug.current}>
                <span>View course</span>
                <ArrowRight size={19} weight="bold" aria-hidden="true" />
            </a>
        {:else}
            <div class="closed-notice">
                <LockKey size={20} weight="bold" aria-hidden="true" />
                <div>
                    <strong>Registration closed</strong>
                    <span>Check back for future offerings</span>
                </div>
            </div>
        {/if}
    </div>
</article>

<style lang="scss">
    .card {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 210px;
        align-items: center;
        gap: 2rem;
        padding: 2rem;
        background: #fff;
        border: 1px solid #dbe3ec;
        border-left: 4px solid $primary;
        border-radius: 14px;
        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
        transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

        &:hover {
            border-color: #c5d0dc;
            border-left-color: $primary;
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
            transform: translateY(-2px);
        }

        &.closed {
            border-left-color: #94a3b8;
            box-shadow: none;

            &:hover {
                border-color: #dbe3ec;
                border-left-color: #94a3b8;
                transform: none;
            }
        }
    }

    .course-eyebrow {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        margin-bottom: 0.65rem;
        color: #52705b;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;

        .separator {
            color: #aab6c2;
        }
    }

    .course-title {
        margin: 0 0 0.75rem;
        color: $accent;
        font-size: clamp(1.35rem, 2vw, 1.7rem);
        font-weight: 700;
        line-height: 1.25;
    }

    .course-date {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        margin-bottom: 1rem;
        color: #475569;
        font-size: 0.92rem;
        font-weight: 600;
    }

    .course-description {
        max-width: 760px;
        margin: 0;
        color: #526174;
        font-size: 0.98rem;
        line-height: 1.65;
    }

    .card-action {
        padding-left: 2rem;
        border-left: 1px solid #e5eaf0;
    }

    .details-link {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;
        min-height: 46px;
        padding: 0 1.15rem;
        color: #052e09;
        background: $primary;
        border: 1px solid darken($primary, 5%);
        border-radius: 9px;
        font-size: 0.92rem;
        font-weight: 700;
        text-decoration: none;
        transition: background 0.2s ease, box-shadow 0.2s ease;

        &:hover {
            background: darken($primary, 4%);
            box-shadow: 0 5px 12px rgba($dark-green, 0.18);
        }

        &:focus-visible {
            outline: 3px solid rgba($primary, 0.3);
            outline-offset: 3px;
        }
    }

    .closed-notice {
        display: flex;
        align-items: flex-start;
        gap: 0.65rem;
        color: #64748b;

        strong,
        span {
            display: block;
        }

        strong {
            margin-bottom: 0.25rem;
            color: #475569;
            font-size: 0.9rem;
        }

        span {
            font-size: 0.78rem;
            line-height: 1.45;
        }
    }

    @media (max-width: 800px) {
        .card {
            grid-template-columns: 1fr;
            gap: 1.35rem;
            padding: 1.5rem;
        }

        .card-action {
            padding: 1.25rem 0 0;
            border-top: 1px solid #e5eaf0;
            border-left: 0;
        }

        .closed-notice {
            align-items: center;
        }
    }
</style>
