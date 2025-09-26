
<script lang="ts">
    export let question: string;
    export let answer: string;
    let open = false;
    let answerId = `faq-answer-${Math.random().toString(36).slice(2, 10)}`;
</script>

<div
    class="faq-card"
    tabindex="0"
    role="button"
    aria-expanded={open}
    aria-controls={answerId}
    on:click={() => open = !open}
    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open = !open; } }}
>
    <div class="faq-question">
        <span>{question}</span>
        <svg class:open={open} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 8L10 13L15 8" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
    <div
        class="faq-answer"
        id={answerId}
        aria-hidden={!open}
        style="max-height: {open ? '500px' : '0'};"
    >
        <span>{answer}</span>
    </div>
</div>

<style>
.faq-card {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    margin-bottom: 1.5rem;
    padding: 1.5rem 1.75rem;
    cursor: pointer;
    transition: box-shadow 0.2s, border 0.2s;
    outline: none;
    border: 1.5px solid #f0f0f0;
}
.faq-card:focus, .faq-card:hover {
    box-shadow: 0 6px 24px rgba(0,0,0,0.14);
    border: 1.5px solid #b3d0ff;
}
.faq-question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    font-size: 1.13rem;
    color: #1a1a1a;
    letter-spacing: 0.01em;
}
.faq-answer {
    margin-top: 0.85rem;
    color: #3a3a3a;
    font-size: 1.01rem;
    line-height: 1.7;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1);
}
.faq-card[aria-expanded="true"] .faq-answer {
    max-height: 500px;
}
svg {
    transition: transform 0.3s;
}
svg.open {
    transform: rotate(180deg);
}
@media (max-width: 600px) {
    .faq-card {
        padding: 1.1rem 0.9rem;
    }
    .faq-question {
        font-size: 1rem;
    }
    .faq-answer {
        font-size: 0.97rem;
    }
}
</style>
