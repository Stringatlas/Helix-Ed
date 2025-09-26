<script>
    import instaIcon from "$lib/icons/instagram.png";
    import fbIcon from "$lib/icons/facebook.png";
    import linkedIcon from "$lib/icons/linkedin.png";

    let instagram = "https://www.instagram.com/realhelixed";
    let linkedin = "https://www.linkedin.com/company/102697298/";
    let facebook = "https://www.facebook.com/profile.php?id=61563365050376";
</script>

<section>
    <div id="social">
        <hr />
        <a href={linkedin}><img src={linkedIcon} alt="linkedin" /></a>
        <a href={instagram}><img src={instaIcon} alt="instagram" /></a>
        <a href={facebook}><img src={fbIcon} alt="facebook" /></a>
        <hr />
    </div>

    <div class="credit">
        <div>
            <p>Contact: <a href="mailto:helix-ed.org@gmail.com">helix-ed.org@gmail.com</a></p>
            <p>&copy; 2024 HelixEd. All rights reserved. Website by Kevin Zhang</p>
        </div>
    </div>
</section>

<style lang="scss">
    #social {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $spacing-md; // Changed from 16px to $spacing-md (1rem/16px)
        margin-top: $spacing-lg; // Added extra space above social icons
        
        img {
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
        padding: $spacing-md; // Changed from 16px to $spacing-md (1rem/16px)

        .credit {
            text-align: center;
            line-height: 2;
        }
    }
</style>