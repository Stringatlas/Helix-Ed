<script lang="ts">
    import { onMount } from "svelte";

    // Define types for the component props
    type TypewriterProps = {
        words: string[];
        typingSpeed?: number;
        deletingSpeed?: number;
        pauseTime?: number;
    };

    // Props with default values
    export let words: TypewriterProps["words"];
    export let typingSpeed: TypewriterProps["typingSpeed"] = 100;
    export let deletingSpeed: TypewriterProps["deletingSpeed"] = 50;
    export let pauseTime: TypewriterProps["pauseTime"] = 1000;

    // Reactive variables for managing state
    let currentIndex = 0;
    let currentWord = "";
    let isDeleting = false;

    onMount(() => {
        update();
    });

    function update() {
        const fullWord = words[currentIndex];
        const typeSpeed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && currentWord.length < fullWord.length) {
            // typing
            currentWord = fullWord.substring(0, currentWord.length + 1);
        } else if (!isDeleting && currentWord.length === fullWord.length) {
            // pause before deleting
            setTimeout(() => {
                isDeleting = true;
                update();
            }, pauseTime);

            return;
        } else if (isDeleting && currentWord.length > 0) {
            // deleting
            currentWord = fullWord.substring(0, currentWord.length - 1);
        } else if (isDeleting && currentWord.length === 0) {
            // move to the next word
            isDeleting = false;
            currentIndex = (currentIndex + 1) % words.length;
        }

        setTimeout(update, typeSpeed);
    }
</script>

<div class="typewriter">
    <span>{currentWord}</span><span class="caret">|</span>
</div>

<style lang="scss">
    .typewriter {
        /* font-size: 24px; */
        /* border-right: 2px solid; */
        /* overflow: hidden; */
        text-align: start;
        display: inline-block;
        overflow: visible;
        white-space: nowrap;
    }

    .caret {
        display: inline-block;
        background-color: rgb(0, 0, 0);
        width: 2px;
        color: transparent;
        animation: blink 0.7s step-end infinite;
    }

    @keyframes blink {
        from,
        to {
            background-color: transparent;
        }
        50% {
            background-color: rgb(0, 0, 0);
        }
    }
</style>
