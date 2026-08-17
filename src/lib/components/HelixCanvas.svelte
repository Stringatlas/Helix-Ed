<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let canvas: HTMLCanvasElement;
    let container: HTMLDivElement;
    let animId: number;
    let resizeObserver: ResizeObserver;

    // Helix Configuration - Slender & Elongated DNA Geometry
    const RUNGS = 76;
    const TURNS = 5.0;
    const SPEED = 0.011; // Smooth, elegant helical rotation

    // Brand Green Colors
    const colorA = { r: 0, g: 224, b: 0 };    // Helix Brand Electric Green (#00e000)
    const colorB = { r: 16, g: 185, b: 129 };  // Emerald Green (#10b981)
    const colorC = { r: 0, g: 255, b: 65 };   // Neon Highlight (#00ff41)

    function rgba(c: { r: number; g: number; b: number }, a: number) {
        return `rgba(${c.r},${c.g},${c.b},${a})`;
    }

    // Smoothstep fade factor near the ends (t: 0..1) to prevent hard clipping
    function getTipFade(t: number): number {
        const edge = Math.min(t, 1 - t) / 0.15; // Fades across first/last 15%
        const clamped = Math.max(0, Math.min(1, edge));
        return clamped * clamped * (3 - 2 * clamped);
    }

    let rotation = 0;

    onMount(() => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let W = 0;
        let H = 0;
        let DPR = 1;

        function resize() {
            if (!container || !canvas || !ctx) return;
            DPR = Math.min(window.devicePixelRatio || 1, 2);
            const rect = container.getBoundingClientRect();
            W = rect.width;
            H = rect.height;

            canvas.width = W * DPR;
            canvas.height = H * DPR;
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        }

        resize();
        window.addEventListener("resize", resize);

        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(() => resize());
            resizeObserver.observe(container);
        }

        function draw() {
            if (!ctx || W === 0 || H === 0) {
                animId = requestAnimationFrame(draw);
                return;
            }

            ctx.clearRect(0, 0, W, H);

            const cx = W * 0.5;
            const cy = H * 0.5;

            // Inset helix comfortably within canvas bounds so glowing nodes never touch edges
            const paddingY = 40;
            const helixHeight = Math.max(H - paddingY * 2, 540);
            const topY = cy - helixHeight / 2;

            // Slender DNA radius (slimmer diameter for authentic diagram proportions)
            const radius = Math.min(W * 0.12, 58);

            const nodesA: Array<{ x: number; y: number; z: number; t: number }> = [];
            const nodesB: Array<{ x: number; y: number; z: number; t: number }> = [];

            for (let i = 0; i < RUNGS; i++) {
                const t = i / (RUNGS - 1);
                const y = topY + t * helixHeight;
                const angle = t * TURNS * Math.PI * 2 + rotation;

                const ax = cx + Math.sin(angle) * radius;
                const az = Math.cos(angle); // -1..1 depth
                const bx = cx + Math.sin(angle + Math.PI) * radius;
                const bz = Math.cos(angle + Math.PI);

                nodesA.push({ x: ax, y, z: az, t });
                nodesB.push({ x: bx, y, z: bz, t });
            }

            // Draw base pair rungs (depth-sorted)
            const allRungs: Array<{
                a: { x: number; y: number; z: number; t: number };
                b: { x: number; y: number; z: number; t: number };
                depth: number;
                t: number;
            }> = [];

            for (let i = 0; i < RUNGS; i++) {
                const a = nodesA[i];
                const b = nodesB[i];
                const depth = (a.z + b.z) / 2;
                allRungs.push({ a, b, depth, t: a.t });
            }
            allRungs.sort((r1, r2) => r1.depth - r2.depth);

            allRungs.forEach(({ a, b, depth, t }) => {
                const tipFade = getTipFade(t);
                if (tipFade <= 0.01) return;

                const normDepth = (depth + 1) / 2; // 0..1
                const alpha = (0.15 + 0.65 * normDepth) * tipFade;
                const width = 1.0 + 1.2 * normDepth;

                // Base pair gradient connecting Strand A to Strand B with hydrogen bond glow
                const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                grad.addColorStop(0, rgba(colorA, alpha * 0.85));
                grad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.95})`);
                grad.addColorStop(1, rgba(colorB, alpha * 0.85));

                ctx.strokeStyle = grad;
                ctx.lineWidth = width;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();

                // Hydrogen bond junction node on foreground rungs
                if (normDepth > 0.45) {
                    const mx = (a.x + b.x) / 2;
                    const my = (a.y + b.y) / 2;
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
                    ctx.beginPath();
                    ctx.arc(mx, my, 1.5 * normDepth, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Draw backbone strands with smooth end-to-end alpha fade
            function drawStrand(
                c: CanvasRenderingContext2D,
                nodes: Array<{ x: number; y: number; z: number; t: number }>,
                color: { r: number; g: number; b: number }
            ) {
                const strandGrad = c.createLinearGradient(0, topY, 0, topY + helixHeight);
                strandGrad.addColorStop(0, rgba(color, 0));
                strandGrad.addColorStop(0.12, rgba(color, 0.8));
                strandGrad.addColorStop(0.88, rgba(color, 0.8));
                strandGrad.addColorStop(1, rgba(color, 0));

                c.beginPath();
                nodes.forEach((n, i) => {
                    if (i === 0) c.moveTo(n.x, n.y);
                    else {
                        const prev = nodes[i - 1];
                        const mx = (prev.x + n.x) / 2;
                        const my = (prev.y + n.y) / 2;
                        c.quadraticCurveTo(prev.x, prev.y, mx, my);
                    }
                });
                const last = nodes[nodes.length - 1];
                c.lineTo(last.x, last.y);
                c.strokeStyle = strandGrad;
                c.lineWidth = 2.4;
                c.stroke();
            }

            drawStrand(ctx, nodesA, colorA);
            drawStrand(ctx, nodesB, colorB);

            // Draw glowing backbone nodes, back-to-front
            const allNodes = [
                ...nodesA.map(n => ({ ...n, color: colorA, glowColor: colorC })),
                ...nodesB.map(n => ({ ...n, color: colorB, glowColor: colorA }))
            ].sort((n1, n2) => n1.z - n2.z);

            allNodes.forEach(n => {
                const tipFade = getTipFade(n.t);
                if (tipFade <= 0.01) return;

                const normDepth = (n.z + 1) / 2;
                const scale = 0.65 + 0.45 * normDepth;
                const alpha = (0.35 + 0.65 * normDepth) * tipFade;
                const r = 4.2 * scale;

                // Subtle ambient glow
                const gradOuter = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4.5);
                gradOuter.addColorStop(0, rgba(n.glowColor, alpha * 0.45));
                gradOuter.addColorStop(0.5, rgba(n.color, alpha * 0.15));
                gradOuter.addColorStop(1, rgba(n.color, 0));
                ctx.fillStyle = gradOuter;
                ctx.beginPath();
                ctx.arc(n.x, n.y, r * 4.5, 0, Math.PI * 2);
                ctx.fill();

                // Core molecular sphere
                ctx.fillStyle = rgba(n.color, Math.min(1, alpha * 1.15));
                ctx.beginPath();
                ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                ctx.fill();

                // Specular highlight
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
                ctx.beginPath();
                ctx.arc(n.x - r * 0.25, n.y - r * 0.25, r * 0.35, 0, Math.PI * 2);
                ctx.fill();
            });

            rotation += SPEED;
            animId = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            if (animId) cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
            if (resizeObserver) resizeObserver.disconnect();
        };
    });

    onDestroy(() => {
        if (animId) cancelAnimationFrame(animId);
        if (resizeObserver) resizeObserver.disconnect();
    });
</script>

<div
    class="helix-canvas-container"
    bind:this={container}
    role="presentation"
    aria-hidden="true"
>
    <div class="helix-glow-backdrop"></div>
    <canvas bind:this={canvas} class="helix-canvas" aria-hidden="true"></canvas>
</div>

<style lang="scss">
    .helix-canvas-container {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 560px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: visible;
        pointer-events: none;
    }

    .helix-glow-backdrop {
        position: absolute;
        width: 130%;
        height: 130%;
        top: -15%;
        left: -15%;
        background: radial-gradient(
            circle at 50% 50%,
            rgba($primary, 0.16) 0%,
            rgba($neon-green, 0.08) 32%,
            rgba($dark-green, 0.02) 62%,
            transparent 75%
        );
        filter: blur(45px);
        pointer-events: none;
        z-index: 0;
        opacity: 0.9;
    }

    .helix-canvas {
        position: relative;
        display: block;
        z-index: 1;
        // Diagonal tilt with full padding to avoid any shadow clipping
        transform: rotate(34deg);
        transform-origin: center center;
        filter: drop-shadow(0 0 20px rgba($primary, 0.4));
        transition: filter 0.4s ease, opacity 0.4s ease;
        opacity: 0.95;
        pointer-events: none;
    }

    @media (max-width: $mobile-width) {
        .helix-canvas-container {
            min-height: 400px;
        }

        .helix-canvas {
            transform: rotate(24deg);
            filter: drop-shadow(0 0 14px rgba($primary, 0.3));
        }
    }
</style>
