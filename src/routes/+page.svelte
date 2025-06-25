<script lang="ts">
    import { goto } from "$app/navigation";
    import { currentEvent } from "$lib/stores/stores";
</script>

<section id="header">
    <img src="/images/biobrawl-2.webp" alt="biobrawl background logo" />
</section>

<section id="announcement">
    <h2>Registration Closed</h2>
</section>

<section class="body">
    <div class="main-content">
        <h2 style="margin-top: 0">Rules</h2>
        <a href="/biobrawl-rules.pdf">View our rules</a>
        <h2>Important Dates</h2>
        <!-- <h3>Middle School</h3> -->
        <ul>
            <li><b>Registration opens:</b> {$currentEvent.registration?.opens}</li>
            <li><b>Registration deadline:</b> {$currentEvent.registration?.closes}</li>
            <li><b>Mock competition:</b> {$currentEvent.mock?.date}</li>
            <li><b>Competition:</b> January 11th, 2025, 8 am - 5 pm PST</li>
        </ul>
        <!-- <h3>High School</h3>
        <ul>
            <li>Registration opens: {registrationOpens}, 2024, 12:00 am PST</li>
            <li>Registration deadline: January 12th, 2025, 11:59 pm PST</li>
            <li>Competition: January 18th, 2025, 8 am - 5 pm PST</li>
        </ul> -->

        <h2>About Us</h2>
        <p>
            The BioBrawl Biology Bowl is a dynamic, student-led competition debuting in 2024, designed to ignite curiosity and passion for the life sciences. Through a quiz bowl-like format, BioBrawl
            covers a wide range of topics, including human anatomy, physiology, pathology, botany, zoology, evolution, cell biology, genetics, ecology, and ethology. Our mission is to inspire students
            to explore the frontiers of science and discover the endless possibilities within the life sciences.
        </p>
    </div>

    <div class="cards-container">
        <div class="side-by-side">
            <div class="card half-width">
                <h2>Who can register</h2>
                <p>Grades {$currentEvent.grades}</p>
            </div>
            <div class="card half-width">
                <h2>Team size</h2>
                <p>Teams of {$currentEvent.teamSize}</p>
            </div>
        </div>

        <div class="card full-width">
            <h2>Where</h2>
            <p>{$currentEvent.location}, {$currentEvent.time}</p>
        </div>

        <div class="card full-width">
            <h2>Registration fee</h2>
            <p>${$currentEvent.registrationFee} / team</p>
        </div>
        <div class="card full-width prizes">
            <h1>Prizes per division</h1>
            <h2>1st Place</h2>
            <p>${$currentEvent.prizes?.first} / team</p>
            <h2>2nd Place</h2>
            <p>${$currentEvent.prizes?.second} / team</p>
            <h2>3rd Place</h2>
            <p>${$currentEvent.prizes?.third} / team</p>
        </div>
    </div>
</section>

<style lang="scss">
    .prizes {
        text-align: center;
        h1 {
            font-size: 2.5rem;
            margin-bottom: 0.2em;
        }
        h2 {
            font-size: 1.5rem;
        }

        p {
            color: #016107;
            font-weight: bold;
            font-size: 2rem;
            margin-bottom: 1rem;
        }
    }

    // .button-primary {
    //     @include button-primary;
    // }

    .body {
        display: grid;
        grid-template-columns: 1fr 0.5fr;
    }

    .main-content {
        border-right-style: solid;
        padding: 2rem;

        h2 {
            margin-top: 1.5em;
            margin-bottom: 0.2em;
        }
        // h3 {
        //     margin-bottom: 0.2em;
        //     margin-top: 0.75em;
        // }

        li,
        p {
            line-height: 1.75;
            letter-spacing: 1.75;
        }
    }

    #announcement {
        padding: 2rem;
        text-align: center;
        background-color: #016107;
        color: white;
    }

    #header {
        text-align: center;
        background-color: white;
        img {
            height: 80vh;
            width: auto;
        }

        // h1 {
        //     margin-bottom: 24px;
        // }

        // h2 {
        //     margin-bottom: 12px;
        // }
    }

    h1 {
        font-size: 52px;
    }

    .cards-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 16px;
        padding: 1.5rem;

        .side-by-side {
            display: flex;
            gap: 16px;
            flex-direction: row;
        }
    }

    .card {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        border-radius: 20px;
        padding: 24px 8px;
        display: inline-block;
        flex: 1;
        text-align: center;

        h2 {
            margin-bottom: 0.25em;
            text-align: center;
        }

        p {
            line-height: 1.75;
            letter-spacing: 1.75;
        }
    }

    .half-width {
        flex: auto;
    }

    .full-width {
        flex: 0 0 0;
    }

    @media (max-width: $mobile-width) {
        .body {
            display: flex;
            flex-direction: column-reverse;
        }

        .main-content {
            border-right-style: none;
        }
        #header {
            img {
                height: auto;
                width: 100%;
            }
        }
    }
</style>
