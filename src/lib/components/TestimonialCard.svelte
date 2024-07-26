<script lang="ts">
    export let imagePath: string;
    export let name: string;
    export let role: string;
    export let quote: string;
</script>

<div id="card-container">
    <img src={imagePath} alt="review" />
    <div id="text-container">
        <p id="quote">{quote}</p>
        <p id="info">- {name}, {role}</p>
    </div>
</div>

<style lang="scss">
    #card-container {
        display: flex;
        flex-direction: row;
        gap: 16px;
        align-items: center;

        margin-bottom: 16px;
        width: 500px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        border-radius: 20px;
        padding: 16px;
    }

    #quote {
        font-size: 16px;
        letter-spacing: 1.5;
        line-height: 1.5;
        margin-bottom: 20px;
    }

    p {
        text-align: justify;
    }

    img {
        width: 200px;
        height: 200px;
        border-radius: 5%;
        object-fit: cover;
    }
</style>
