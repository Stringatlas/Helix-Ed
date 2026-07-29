<script lang="ts">
    import Seo from "$lib/components/Seo.svelte";

    // Built from parts rather than hardcoded, matching the convention in
    // contact/+page.svelte and Footer.svelte — a hardcoded copy here is how the
    // footer ended up holding a stale address.
    const emailUser = 'helixed.org';
    const emailDomain = 'gmail.com';
</script>

<Seo
    title="Privacy Policy | Helix-Ed"
    description="How Helix-Ed handles your data, including our use of Google Analytics."
/>

<div>
    <h1>Privacy Policy</h1>
    <p class="updated">Last updated: 2026-07-29</p>

    <h2>Analytics</h2>
    <p>
        Helix-Ed uses Google Analytics to understand how visitors use our website. Google Analytics
        sets cookies in your browser and collects information such as the pages you visit, your
        approximate location (derived from your IP address), and details about your device and
        browser. We use this information only in aggregate to improve the site — we do not use it to
        identify individual visitors.
    </p>

    <h2>Hosting</h2>
    <p>
        This website is hosted on Vercel, which, like most hosting providers, keeps standard server
        logs (such as IP addresses and request timestamps) for security and reliability purposes.
    </p>

    <h2>Course Content</h2>
    <p>
        Course, instructor, and pricing information displayed on this site is served from our content
        management system, Sanity. Browsing this content does not require you to submit any personal
        information.
    </p>

    <h2>Enrollment</h2>
    <p>
        When you enroll in a course, you are directed to a third-party registration form. Any
        information you enter there is collected and processed by that third-party provider under
        their own privacy policy, not by Helix-Ed directly.
    </p>

    <h2>No Selling of Data</h2>
    <p>We do not sell any of your data to third parties.</p>

    <h2>Your Choices</h2>
    <p>
        You can control or delete cookies through your browser's settings. You can also opt out of
        Google Analytics tracking across all websites by installing the
        <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener">Google Analytics Opt-out Browser Add-on</a>.
    </p>

    <h2>Contact</h2>
    <p>If you have questions about this policy, contact us at {emailUser}@{emailDomain}.</p>
</div>

<style lang="scss">
    div {
        padding: 24px;
        max-width: 700px;
        margin: 0 auto;
    }

    h1 {
        margin-bottom: 0.5rem;
    }

    .updated {
        color: darken($text-color, 20%);
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
    }

    h2 {
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
    }

    p {
        line-height: 1.6;
        margin-bottom: 0.75rem;
    }

    a {
        color: $primary;
    }
</style>
