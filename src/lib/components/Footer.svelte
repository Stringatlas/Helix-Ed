<script>
    import instaIcon from "$lib/images/icons/instagram.png";
    import fbIcon from "$lib/images/icons/facebook.png";
    import linkedIcon from "$lib/images/icons/linkedin.png";

    let instagram = "https://www.instagram.com/realhelixed";
    let linkedin = "https://www.linkedin.com/company/102697298/";
    let facebook = "https://www.facebook.com/profile.php?id=61563365050376";

    const currentYear = new Date().getFullYear();
    
    // Obfuscated email to prevent spam bots
    const emailUser = 'helixed.org';
    const emailDomain = 'gmail.com';
    let emailAddress = `${emailUser}@${emailDomain}`;
    let emailHref = `mailto:${emailAddress}`;

</script>

<section>
    <div id="social">
        <hr />
        <a href={linkedin}><img src={linkedIcon} alt="HelixEd LinkedIn" /></a>
        <a href={instagram}><img src={instaIcon} alt="HelixEd Instagram" /></a>
        <a href={facebook}><img src={fbIcon} alt="HelixEd Facebook" /></a>
        <hr />
    </div>

    <div class="credit">
        <div>
            <a href="/privacy-policy" style="margin-right: 1rem">Privacy Policy</a>
            <a href="/attributions">Attributions</a>
            <p>Contact: <a href={emailHref}>{emailAddress}</a> </p>
            <p>&copy; {currentYear} HelixEd. All rights reserved. Website by <a href="https://github.com/Stringatlas">Kevin Zhang</a></p>
        </div>
    </div>
</section>

<style lang="scss">
    #social {
        display: flex;
        flex-direction: row;
        align-items: center;

        gap: 16px;
        img {
            // background-color: rgb(90, 97, 97);
            filter: invert(75%);
            height: 40px;
        }

        hr {
            flex: 1;
        }
    }

    * {
        color: rgb(222, 222, 222);
    }

    section {
        background-color: rgb(55, 62, 65);
        padding: 16px;

        .credit {
            text-align: center;
            line-height: 2;
        }
    }
</style>
