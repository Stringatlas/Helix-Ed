<script>
    import { onMount } from "svelte";

    let careers = ["engineers", "doctors", "chemists", "teachers", "physicists", "scientists", "astronomers", "biologists", "roboticists", "economists"];
    let currentCareerIndex = 0;
    let currentCareer = careers[currentCareerIndex];

    onMount(() => {
        const interval = setInterval(() => {
            currentCareerIndex = (currentCareerIndex + 1) % careers.length;
            currentCareer = careers[currentCareerIndex];
        }, 2000);

        return () => clearInterval(interval);
    });
</script>

<span class="flipping-text">{currentCareer}</span>

<style lang="scss">
    .flipping-text {
        width: 300px;
        display: inline-block;
        text-align: start;
        animation: fadeInOut 2s ease-in-out infinite;

        @keyframes fadeInOut {
            0%,
            100% {
                opacity: 0;
            }
            50% {
                opacity: 1;
            }
        }
    }
</style>
