<script lang="ts">
    import classroom from "$lib/images/classroom.jpg";
    import berkeley from "$lib/images/ucberkeley.jpg";
</script>

<section id="title">
    <h1>About Us</h1>
    <h2>Meet our instructors</h2>
</section>

<section id="mission">
    <img src={classroom} alt="" />
    <div>
        <h1>Our Mission</h1>
        <h2>Bringing academic excellence to every student</h2>
        <p>
            Our goal is to supplement inadequate school resources, provide high-quality tutoring for students, assist them in transitioning smoothly to high school, and encourage deeper exploration in
            their academic fields.
        </p>
    </div>
</section>

<section id="mission">
    <div>
        <h1 style="margin-bottom: 16px;">Our Story</h1>
        <p>
            In 2024, HelixEd began running online summer courses for middle school students. Ran by instructors who attend top universtiies, and high school TAs with excellent academic records,
            HelixEd has grown to a community of over 100 students.
        </p>
    </div>
    <img src={berkeley} alt="" />
</section>

<style lang="scss">
    #title {
        padding: 80px 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: darken($background-color, 10%);
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
        }
        img {
            width: auto;
            min-width: 300px;
            max-width: 400px;
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
