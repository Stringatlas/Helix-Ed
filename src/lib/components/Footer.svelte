<script>
    import instaIcon from "$lib/images/icons/instagram.png";
    import fbIcon from "$lib/images/icons/facebook.png";
    import linkedIcon from "$lib/images/icons/linkedin.png";

    let instagram = "https://www.instagram.com/realhelixed";
    let linkedin = "https://www.linkedin.com/company/102697298/";
    let facebook = "https://www.facebook.com/profile.php?id=61563365050376";

    const currentYear = new Date().getFullYear();
    
    // Obfuscated email to prevent spam bots
    const emailUser = 'helix-ed.org';
    const emailDomain = 'gmail.com';
    let emailAddress = '';
    
    // Construct email on client-side to avoid plain text in HTML
    function revealEmail() {
        emailAddress = `${emailUser}@${emailDomain}`;
        window.location.href = `mailto:${emailAddress}`;
    }
</script>

<section>
    <div id="social">
        <hr />
        <a href={linkedin}><img src={linkedIcon} alt="" /></a>
        <a href={instagram}><img src={instaIcon} alt="" /></a>
        <a href={facebook}><img src={fbIcon} alt="" /></a>
        <hr />
    </div>

    <div class="credit">
        <div>
            <a href="/privacy-policy" style="margin-right: 1rem">Privacy Policy</a>
            <a href="/attributions">Attributions</a>
            <p>Contact: <button class="email-link" on:click={revealEmail} type="button">helix-ed.org@gmail.com</button></p>
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
    
    .email-link {
        background: none;
        border: none;
        color: rgb(222, 222, 222);
        text-decoration: underline;
        cursor: pointer;
        padding: 0;
        font: inherit;
        transition: opacity 0.2s ease;
        
        &:hover {
            opacity: 0.8;
        }
        
        &:focus {
            outline: 2px solid rgba(222, 222, 222, 0.5);
            outline-offset: 2px;
        }
    }
</style>
