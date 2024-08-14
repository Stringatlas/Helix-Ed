<script lang="ts">
    import InstructorCard from "$lib/components/InstructorCard.svelte";
    import instructors from "$lib/instructorData.json";
    import { capitalizeFirstLetter } from "$lib/util";
</script>

<main>
    <section id="mission">
        <div>
            <h1>Questions?</h1>
            <p>
                Contact us at <a href="mailto:helix-ed.org@gmail.com">helix-ed.org@gmail.com</a>
            </p>
        </div>
    </section>

    <section id="mission">
        <div>
            <h1 style="margin-bottom: 16px;">Support our vision</h1>
            <h2>Donate with tax deductable methods</h2>
            <p>HelixEd (Tax ID: 99-3230895) is a non profit organization under IRC 501(c)(3). Tax Deductible Donation Methods:</p>
            <ul>
                <li><p>Company matching program of "Benevity Cause Portal" (<a href="https://causes.benevity.org/causes/840-993230895">https://causes.benevity.org/causes/840-993230895</a>)</p></li>
                <li><p>Direct donation through our Zelle at helixed.org@gmail.com</p></li>
            </ul>
        </div>
    </section>
</main>

<style lang="scss">
    a {
        text-decoration: none;
    }

    #mission {
        display: flex;
        flex-direction: row;
        margin: 60px 120px;
        gap: 40px;

        div {
            display: flex;
            flex: 1;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
        }

        h1 {
            margin-bottom: 8px;
        }
        h2 {
            margin-bottom: 16px;
        }
    }

    h1 {
        font-size: 52px;
        margin: 0;
    }

    h2 {
        margin: 0;
        font-family: "Istok Web";
    }
    p {
        line-height: 1.5;
    }

    section {
        padding: 8px;
    }
</style>
