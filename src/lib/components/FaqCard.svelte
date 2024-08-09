<script lang="ts">
    export let question: string;
    export let answer: string;

    let isOpen: boolean;

    function toggleOpen() {
        isOpen = !isOpen;
    }
</script>

<div class="question">
    <button on:click={toggleOpen}>
        <h2>{question}</h2>
        <span>▼</span>
    </button>

    <div class={"bottom" + (isOpen ? " open" : "")}><p>{answer}</p></div>
</div>

<style lang="scss">
    .question {
        padding: 16px;
        border-radius: 20px;
        // box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
        width: 100%;
        max-width: 1000px;

        display: flex;
        flex-direction: column;

        > button {
            display: flex;
            flex-direction: row;
            align-items: center;
            border-style: none;
            width: 100%;
            background-color: $background-color;
            font-size: large;

            h2 {
                margin-left: -0.25em;
                margin-right: auto;
            }
        }

        .bottom {
            overflow: hidden;
            max-height: 0px;
            margin-top: 0px;

            transition:
                max-height 0.3s ease,
                margin-top 0.3s ease;

            &.open {
                max-height: 50px;
            }
        }
    }
</style>
