<script lang="ts">
    import FaqCard from "$lib/components/FaqCard.svelte";

    let faqs = [
        {
            question: "Where will the contest be held?",
            answer: "The contest will be held online on zoom",
        },
        {
            question: "How many people per team?",
            answer: "Each team consists of up to 3 members with an optional alternate",
        },
        {
            question: "What topics will be covered in the contest?",
            answer: "very intellectual content",
        },
    ];
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
