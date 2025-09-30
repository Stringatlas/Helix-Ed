<script lang="ts">
    import { goto } from "$app/navigation";
    import { client } from "$lib/stores/sanityClient";
    import { page } from "$app/stores";

    let subject: string;
    let notFound = false;

    $: subject = $page.params.slug;

    $: (async () => {
        if (!subject) return;
        try {
            // GROQ: find a featured course for this subject
            const query = `*[_type == 'course' && featured == true && subject == $subject][0]{ slug }`;
            const course = await client.fetch(query, { subject });
            
            console.log("slug", subject);
            console.log("Course found:", course);
            
            if (course && course.slug && course.slug.current) {
                goto(`/classes/${course.slug.current}`);
            } else {
                notFound = true;
            }
        } catch (error) {
            console.warn('Failed to fetch course from Sanity:', error);
            notFound = true;
        }
    })();
</script>

{#if notFound}
    <div class="subject-not-found">
        <div class="error-content">
            <h1>Subject Not Available</h1>
            <p>We currently do not offer classes for <strong>{subject}</strong></p>
            <p>Check back later as we're always adding new courses!</p>
            <a href="/" class="back-home-btn">← Back to Home</a>
        </div>
    </div>
{/if}

<style lang="scss">
    .subject-not-found {
        min-height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: $spacing-2xl $spacing-lg;
    }

    .error-content {
        text-align: center;
        max-width: 600px;
        padding: $spacing-3xl;
        background: $background-light;
        border-radius: $radius-xl;
        border: 1px solid $border-light;
        box-shadow: $shadow-md;
        
        h1 {
            font-size: $font-size-4xl;
            color: $primary;
            margin-bottom: $spacing-lg;
            
            @media (max-width: $mobile-width) {
                font-size: $font-size-3xl;
            }
        }
        
        p {
            font-size: $font-size-lg;
            color: $text-secondary;
            margin-bottom: $spacing-lg;
            line-height: $line-height-relaxed;
            
            &:last-of-type {
                margin-bottom: $spacing-2xl;
            }
            
            strong {
                color: $text-color;
                font-weight: 600;
            }
        }
        
        .back-home-btn {
            display: inline-flex;
            align-items: center;
            gap: $spacing-sm;
            padding: $spacing-md $spacing-lg;
            background: $primary;
            color: white;
            border-radius: $radius-lg;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.2s ease;
            
            &:hover {
                background: $primary-dark;
                transform: translateY(-2px);
                box-shadow: $shadow-md;
                text-decoration: none;
            }
        }
    }

    @media (max-width: $mobile-width) {
        .subject-not-found {
            padding: $spacing-xl $spacing-md;
        }
        
        .error-content {
            padding: $spacing-2xl;
            
            p {
                font-size: $font-size-base;
            }
        }
    }
</style>