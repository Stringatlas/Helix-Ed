<script lang="ts">
    // Obfuscated email addresses to prevent spam bots
    const contactEmailUser = 'helix-ed.org';
    const zelleEmailUser = 'helixed.org';
    const emailDomain = 'gmail.com';
    
    function openContactEmail() {
        window.location.href = `mailto:${contactEmailUser}@${emailDomain}`;
    }
</script>

<main>
    <section class="contact-section">
        <h1>Contact Us</h1>
        <p class="contact-email">
            Email: <button class="email-link" on:click={openContactEmail} type="button">{contactEmailUser}@{emailDomain}</button>
        </p>
    </section>

    <section class="donate-section">
        <h2>Support Our Vision</h2>
        <p class="donate-desc">HelixEd (Tax ID: 99-3230895) is a non-profit organization under IRC 501(c)(3). All donations are tax deductible.</p>
        <h3>How to Donate</h3>
        <ul>
            <li><b>Benevity Cause Portal:</b> <a href="https://causes.benevity.org/causes/840-993230895">https://causes.benevity.org/causes/840-993230895</a></li>
            <li><b>Zelle:</b> {zelleEmailUser}@{emailDomain}</li>
        </ul>
    </section>
</main>

<style lang="scss">
    main {
        max-width: 700px;
        margin: 0 auto;
        padding: 3rem 1.5rem 4rem 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 3.5rem;
    }

    .contact-section {
        margin-bottom: 2.5rem;
        h1 {
            font-size: 2.3rem;
            font-weight: 700;
            margin-bottom: 1.2rem;
            color: #23272f;
            letter-spacing: -1px;
        }
        .contact-email {
            font-size: 1.15rem;
            color: #23272f;
            margin-bottom: 0;
            // a {
            //     color: #1a1a1a;
            //     text-decoration: underline;
            //     font-weight: 500;
            //     word-break: break-all;
            //     &:hover {
            //         color: #444;
            //     }
            // }
        }
    }

    .donate-section {
        h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.7rem;
            color: #23272f;
        }
        .donate-desc {
            font-size: 1.08rem;
            color: #444;
            margin-bottom: 1.2rem;
        }
        h3 {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 0.7rem;
            color: #23272f;
        }
        ul {
            margin: 0 0 0 1.2rem;
            padding: 0;
            list-style: disc inside;
            li {
                margin-bottom: 0.6rem;
                font-size: 1.05rem;
                color: #23272f;
                b {
                    font-weight: 600;
                    color: #23272f;
                }
                a {
                    color: #1a1a1a;
                    text-decoration: underline;
                    &:hover {
                        color: #444;
                    }
                }
            }
        }
    }

    .email-link {
        background: none;
        border: none;
        color: #1a1a1a;
        text-decoration: underline;
        cursor: pointer;
        padding: 0;
        font: inherit;
        transition: color 0.2s ease;
        
        &:hover {
            color: #444;
        }
        
        &:focus {
            outline: 2px solid rgba(26, 26, 26, 0.3);
            outline-offset: 2px;
        }
    }

    @media (max-width: 600px) {
        main {
            padding: 2rem 0.5rem 2.5rem 0.5rem;
            gap: 2.2rem;
        }
        .contact-section h1 {
            font-size: 1.5rem;
        }
        .donate-section h2 {
            font-size: 1.1rem;
        }
        .donate-section h3 {
            font-size: 1rem;
        }
        .donate-section ul li {
            font-size: 0.98rem;
        }
    }
</style>
