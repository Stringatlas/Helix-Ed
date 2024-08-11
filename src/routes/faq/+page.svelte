<script lang="ts">
    import FaqCard from "$lib/components/FaqCard.svelte";
    import faqs from "$lib/faqs.json";
</script>

<h1>Frequently Asked Questions</h1>
<div class="faq">
    {#each faqs as faq}
        <FaqCard question={faq.question} answer={faq.answer} />
        <hr />
    {/each}
</div>

<style lang="scss">
    h1 {
        margin-bottom: 24px;
    }

    .faq {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
</style>
