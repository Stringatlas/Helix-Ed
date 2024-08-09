<script lang="ts">
    import { goto } from "$app/navigation";
</script>

<section id="header">
    <h1>Bio Brawl 2025</h1>
    <h2>May 18th, 8am-2pm PST</h2>

    <button on:click={() => goto("/register")} class="button-primary">Register Now</button>
</section>

<section class="body">
    <div class="main-content">
        <h2>Contest Format</h2>
        <p>held on zoom. written rounds and elimation rounds</p>
    </div>

    <div class="cards-container">
        <div class="side-by-side">
            <div class="card half-width">
                <h2>Who can register</h2>
                <p>Grades 6-12</p>
            </div>
            <div class="card half-width">
                <h2>Team size</h2>
                <p>Teams of 3</p>
            </div>
        </div>

        <div class="card full-width">
            <h2>Prizes</h2>
            <p>1st place: $200</p>
            <p>2nd place: $120</p>
            <p>3rd place: $80</p>
            <p>4th-6th place: $30</p>
        </div>
        <!-- <div class="card">
        <h2>Entry</h2>
        <p>free</p>
    </div> -->
    </div>
</section>

<style lang="scss">
    .button-primary {
        @include button-primary;
    }

    .body {
        display: grid;
        grid-template-columns: 1fr 0.3fr;
        gap: 24px;
    }

    .main-content {
        border-right-style: solid;
    }

    #header {
        text-align: center;
        margin: 40px 0px 40px 0px;

        h1 {
            margin-bottom: 24px;
        }

        h2 {
            margin-bottom: 12px;
        }
    }

    h1 {
        font-size: 52px;
    }

    .cards-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 16px;

        .side-by-side {
            display: flex;
            gap: 16px;
            flex-direction: row;
        }
    }

    .card {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        border-radius: 20px;
        padding: 16px;
        display: inline-block;
        flex: 1;

        h2 {
            margin-bottom: 0.25em;
            text-align: center;
        }

        p {
            line-height: 1.5;
            letter-spacing: 1.5;
        }
    }

    .half-width {
        flex: auto;
    }

    // .full-width {
    //     flex: 50% 0 0;
    // }
</style>
