<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    export let isAttracting: boolean = false;
    export let targetEl: HTMLElement | null = null;
    export let subjects: string[] = [
        "Chemistry",
        "Physics",
        "Calculus",
        "Computer Science",
        "Economics",
        "Biology",
    ];

    interface Bubble {
        id: number;
        subject: string;
        x: number; // percentage (0-100)
        y: number; // percentage (0-100)
        targetDx: number; // pixel delta to target
        targetDy: number; // pixel delta to target
        delay: number; // seconds offset for idle animation
        duration: number; // seconds for idle float cycle
        fadeDuration: number; // seconds for idle periodic fade
        fadeDelay: number; // seconds delay for idle periodic fade
        sizeVariant: "small" | "medium" | "large";
    }

    let container: HTMLDivElement;
    let bubbles: Bubble[] = [];
    let resizeObserver: ResizeObserver;

    // Two-phase hover behavior:
    // 1. isAttracting flips true -> bubbles reveal INSTANTLY at full opacity, at rest.
    // 2. After a short beat (REVEAL_HOLD_MS), isPulled flips true -> bubbles fly
    //    towards the button and fade out as they arrive.
    // Both flags reset the moment hover ends, so the whole cycle restarts cleanly
    // next time the button is hovered.
    const REVEAL_HOLD_MS = 160;
    let isPulled = false;
    let pullTimer: ReturnType<typeof setTimeout> | null = null;

    $: if (isAttracting) {
        // Entering hover: cancel any pending timer, show bubbles at rest immediately,
        // then schedule the pull-toward-button phase.
        isPulled = false;
        if (pullTimer) clearTimeout(pullTimer);
        pullTimer = setTimeout(() => {
            isPulled = true;
        }, REVEAL_HOLD_MS);
    } else {
        // Leaving hover: reset both phases immediately so bubbles idle-fade back in
        // fresh on the next hover, rather than resuming mid-flight.
        if (pullTimer) clearTimeout(pullTimer);
        pullTimer = null;
        isPulled = false;
    }

    // Distributes items randomly across right side with collision avoidance
    function generateBubbles(list: string[]): Bubble[] {
        if (!list || list.length === 0) return [];

        const count = list.length;
        const generated: Bubble[] = [];

        // Grid-based jitter distribution across the right half (50% - 90% X, 12% - 84% Y)
        const minX = 52;
        const maxX = 88;
        const minY = 12;
        const maxY = 84;

        // Partition available space into cells to guarantee spread
        const cols = Math.ceil(Math.sqrt(count * 1.3));
        const rows = Math.ceil(count / cols);
        const cellW = (maxX - minX) / cols;
        const cellH = (maxY - minY) / rows;

        // Create slot coordinates
        const slots: Array<{ x: number; y: number }> = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                slots.push({
                    x: minX + c * cellW + cellW * 0.5,
                    y: minY + r * cellH + cellH * 0.5,
                });
            }
        }

        // Shuffle slots
        for (let i = slots.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [slots[i], slots[j]] = [slots[j], slots[i]];
        }

        list.forEach((subject, i) => {
            const slot = slots[i % slots.length] || {
                x: minX + Math.random() * (maxX - minX),
                y: minY + Math.random() * (maxY - minY),
            };

            // Jitter within cell boundaries
            const jitterX = (Math.random() - 0.5) * (cellW * 0.6);
            const jitterY = (Math.random() - 0.5) * (cellH * 0.6);

            const x = Math.max(minX, Math.min(maxX, slot.x + jitterX));
            const y = Math.max(minY, Math.min(maxY, slot.y + jitterY));

            const sizes: Array<"small" | "medium" | "large"> = [
                "small",
                "medium",
                "large",
            ];
            const sizeVariant = sizes[i % sizes.length];

            generated.push({
                id: i,
                subject,
                x,
                y,
                targetDx: 0,
                targetDy: 0,
                delay: -(Math.random() * 6), // Stagger floating phase
                duration: 4.5 + Math.random() * 3, // 4.5s - 7.5s float cycle
                fadeDuration: 4 + Math.random() * 3, // 4s - 7s periodic fade cycle
                fadeDelay: -(Math.random() * 5), // Stagger fade in/out phase
                sizeVariant,
            });
        });

        return generated;
    }

    function calculateAttractionVectors() {
        if (!container || !targetEl || bubbles.length === 0) return;

        const containerRect = container.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        // Calculate center of the target button relative to the container
        const targetCenterX =
            targetRect.left + targetRect.width / 2 - containerRect.left;
        const targetCenterY =
            targetRect.top + targetRect.height / 2 - containerRect.top;

        bubbles = bubbles.map((b) => {
            const homePxX = (b.x / 100) * containerRect.width;
            const homePxY = (b.y / 100) * containerRect.height;

            return {
                ...b,
                targetDx: targetCenterX - homePxX,
                targetDy: targetCenterY - homePxY,
            };
        });
    }

    $: if (subjects) {
        bubbles = generateBubbles(subjects);
        calculateAttractionVectors();
    }

    $: if (isAttracting && targetEl) {
        calculateAttractionVectors();
    }

    onMount(() => {
        bubbles = generateBubbles(subjects);
        calculateAttractionVectors();

        const handleResize = () => {
            calculateAttractionVectors();
        };

        window.addEventListener("resize", handleResize);

        if (typeof ResizeObserver !== "undefined" && container) {
            resizeObserver = new ResizeObserver(() => {
                calculateAttractionVectors();
            });
            resizeObserver.observe(container);
        }

        return () => {
            window.removeEventListener("resize", handleResize);
            if (resizeObserver) resizeObserver.disconnect();
        };
    });

    onDestroy(() => {
        if (resizeObserver) resizeObserver.disconnect();
        if (pullTimer) clearTimeout(pullTimer);
    });
</script>

<div
    class="magnet-bubbles-container"
    bind:this={container}
    role="presentation"
    aria-hidden="true"
>
    {#each bubbles as bubble, index (bubble.id)}
        <div
            class="bubble-anchor"
            style="
                left: {bubble.x}%;
                top: {bubble.y}%;
                --delay: {bubble.delay}s;
                --duration: {bubble.duration}s;
                --fade-delay: {bubble.fadeDelay}s;
                --fade-duration: {bubble.fadeDuration}s;
                --target-x: {bubble.targetDx}px;
                --target-y: {bubble.targetDy}px;
                --stagger-index: {index};
            "
        >
            <div
                class="bubble-card {bubble.sizeVariant}"
                class:attracting={isAttracting}
                class:pulled={isAttracting && isPulled}
            >
                <!-- <span class="bubble-dot"></span> -->
                <span class="bubble-text">{bubble.subject}</span>
            </div>
        </div>
    {/each}
</div>

<style lang="scss">
    .magnet-bubbles-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: visible;
        z-index: 3;
    }

    .bubble-anchor {
        position: absolute;
        transform-origin: center center;
        pointer-events: none;
        will-change: transform;
    }

    .bubble-card {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 0.5rem 1rem;
        background: rgba(255, 255, 255, 0.76);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba($primary, 0.38);
        border-radius: 9999px;
        box-shadow:
            0 4px 18px rgba(0, 0, 0, 0.05),
            0 0 12px rgba($primary, 0.12);
        font-family: "Montserrat", sans-serif;
        font-weight: 600;
        color: $accent;
        white-space: nowrap;
        user-select: none;
        pointer-events: none;
        transform: translate3d(0, 0, 0) scale(1);
        will-change: transform, opacity;

        // Size variants
        &.small {
            font-size: 0.78rem;
            padding: 0.38rem 0.82rem;
        }

        &.medium {
            font-size: 0.86rem;
            padding: 0.46rem 0.95rem;
        }

        &.large {
            font-size: 0.94rem;
            padding: 0.54rem 1.1rem;
        }

        .bubble-text {
            letter-spacing: 0.2px;
            color: $accent;
            text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
        }

        // Idle state: Subtle organic floating drift + periodic ambient fade in and out
        &:not(.attracting) {
            animation:
                bubbleFloat var(--duration) ease-in-out infinite alternate
                    var(--delay),
                ambientFadeCycle var(--fade-duration) ease-in-out infinite
                    alternate var(--fade-delay);
            transition:
                transform 0.4s ease,
                opacity 0.3s ease,
                filter 0.3s ease;
        }

        // Attracting — Phase 1 (button hover starts):
        // Reveal INSTANTLY at full opacity, at rest in its home position.
        // No animation, no delay — this must be immediate or bubbles never appear.
        &.attracting {
            animation: none;
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
            filter: blur(0px);
            transition:
                opacity 0.15s ease,
                filter 0.15s ease,
                transform 0.15s ease;
        }

        // Attracting — Phase 2 (after a short hold, added via JS):
        // Fly towards the button center, scaling down and fading out as it nears.
        &.attracting.pulled {
            transform: translate3d(var(--target-x), var(--target-y), 0)
                scale(0.3);
            opacity: 0;
            filter: blur(2px);
            transition:
                transform 0.62s cubic-bezier(0.34, 0.01, 0.68, 1)
                    calc(var(--stagger-index) * 0.02s),
                opacity 0.42s cubic-bezier(0.55, 0, 0.85, 0.2)
                    calc(0.22s + var(--stagger-index) * 0.02s),
                filter 0.42s ease calc(0.22s + var(--stagger-index) * 0.02s);
        }
    }

    // Ambient floating translation
    @keyframes bubbleFloat {
        0% {
            transform: translate3d(0, 0, 0);
        }
        50% {
            transform: translate3d(4px, -7px, 0);
        }
        100% {
            transform: translate3d(-3px, -13px, 0);
        }
    }

    // Periodic ambient fading in and out when idle
    @keyframes ambientFadeCycle {
        0% {
            opacity: 0;
            filter: blur(1.5px);
        }
        35% {
            opacity: 0.85;
            filter: blur(0px);
        }
        70% {
            opacity: 0.95;
            filter: blur(0px);
        }
        100% {
            opacity: 0;
            filter: blur(1px);
        }
    }

    @media (max-width: $mobile-width) {
        .magnet-bubbles-container {
            display: none; // Hide on mobile to keep clean hero hierarchy
        }
    }
</style>
