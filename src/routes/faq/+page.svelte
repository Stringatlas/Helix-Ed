<script lang="ts">
    import FaqCard from "$lib/components/FaqCard.svelte";
    import { faqs } from "$lib/stores/stores";
</script>

<section class="faq-section">
    <h1 class="faq-title">Frequently Asked Questions</h1>
    <div class="faq-list">
        {#each $faqs as faq}
            <FaqCard question={faq.question} answer={faq.answer} />
        {/each}
    </div>
</section>

<style lang="scss">
    .faq-section {
        max-width: 900px;
        margin: $spacing-3xl auto;
        padding: 0 $spacing-lg;
        
        @media (max-width: $mobile-width) {
            margin: $spacing-2xl auto;
            padding: 0 $spacing-md;
        }
    }
    
    .faq-title {
        font-size: $font-size-4xl;
        font-weight: 700;
        margin-bottom: $spacing-3xl;
        text-align: center;
        color: $primary;
        
        @media (max-width: $mobile-width) {
            font-size: $font-size-3xl;
            margin-bottom: $spacing-2xl;
        }
    }
    
    .faq-list {
        display: flex;
        flex-direction: column;
        gap: $spacing-lg;
    }
</style>