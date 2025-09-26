<script lang="ts">
    import { onMount } from 'svelte';
    
    export let first: string | undefined;
    export let second: string | undefined;
    export let third: string | undefined;
    
    let podiumContainer: HTMLElement;
    let uniformWidth = 160; // Default width
    
    onMount(() => {
        if (podiumContainer) {
            calculateUniformWidth();
        }
    });
    
    function calculateUniformWidth() {
        if (!podiumContainer) return;
        
        // Create a temporary element to measure text width
        const measurer = document.createElement('div');
        measurer.style.position = 'absolute';
        measurer.style.visibility = 'hidden';
        measurer.style.whiteSpace = 'nowrap';
        measurer.style.fontSize = window.innerWidth <= 768 ? '0.875rem' : '1rem';
        measurer.style.fontWeight = '600';
        measurer.style.fontFamily = getComputedStyle(document.body).fontFamily;
        document.body.appendChild(measurer);
        
        const names = [first, second, third].filter(Boolean) as string[];
        let maxWidth = 120; // Minimum width
        
        names.forEach(name => {
            measurer.textContent = name;
            const textWidth = measurer.offsetWidth;
            // Add padding (32px) and some extra space (16px) for wrapping
            const neededWidth = Math.min(textWidth + 48, 200);
            maxWidth = Math.max(maxWidth, neededWidth);
        });
        
        document.body.removeChild(measurer);
        uniformWidth = maxWidth;
        
        // Apply the uniform width to all podiums
        const podiums = podiumContainer.querySelectorAll('.podium') as NodeListOf<HTMLElement>;
        podiums.forEach(podium => {
            podium.style.width = `${uniformWidth}px`;
        });
    }
</script>

<div class="podium-container" bind:this={podiumContainer}>
    <div class="podium" data-place="2">
        <div class="medal silver">2</div>
        <div class="team-name">{second || 'TBD'}</div>
    </div>

    <div class="podium" data-place="1">
        <div class="medal gold">1</div>
        <div class="team-name">{first || 'TBD'}</div>
    </div>

    <div class="podium" data-place="3">
        <div class="medal bronze">3</div>
        <div class="team-name">{third || 'TBD'}</div>
    </div>
</div>

<style lang="scss">
    .podium-container {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        height: 350px;
        padding: $spacing-xl;
        margin: $spacing-2xl 0;
        
        @media (max-width: $mobile-width) {
            height: 280px;
            padding: $spacing-lg;
        }
    }

    .podium {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        margin: 0 $spacing-sm;
        width: 160px; /* Default width, will be overridden by JavaScript */
        padding: $spacing-lg $spacing-md;
        background: linear-gradient(135deg, #3498db, #2980b9);
        border-radius: $radius-xl;
        position: relative;
        box-shadow: $shadow-lg;
        
        @media (max-width: $mobile-width) {
            margin: 0 $spacing-xs;
            padding: $spacing-md $spacing-sm;
        }
    }

    $animation-duration: 1.8s;

    .podium[data-place="1"] {
        height: 100%;
        animation: rise-up1 $animation-duration ease-out forwards;
        background: linear-gradient(135deg, #f39c12, #e67e22);
    }

    .podium[data-place="2"] {
        height: 85%;
        animation: rise-up2 $animation-duration ease-out 0.2s forwards;
        background: linear-gradient(135deg, #95a5a6, #7f8c8d);
    }

    .podium[data-place="3"] {
        height: 70%;
        animation: rise-up3 $animation-duration ease-out 0.4s forwards;
        background: linear-gradient(135deg, #cd7f32, #b87333);
    }

    @keyframes rise-up1 {
        from { height: 0; opacity: 0; }
        to { height: 100%; opacity: 1; }
    }

    @keyframes rise-up2 {
        from { height: 0; opacity: 0; }
        to { height: 85%; opacity: 1; }
    }

    @keyframes rise-up3 {
        from { height: 0; opacity: 0; }
        to { height: 70%; opacity: 1; }
    }

    .medal {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: $font-size-2xl;
        margin-top: $spacing-lg;
        box-shadow: $shadow-md;
        border: 3px solid rgba(255, 255, 255, 0.3);
        
        @media (max-width: $mobile-width) {
            width: 50px;
            height: 50px;
            font-size: $font-size-xl;
            margin-top: $spacing-md;
        }
    }

    .gold {
        background: radial-gradient(circle, #ffd700, #ffed4e);
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    }

    .silver {
        background: radial-gradient(circle, #c0c0c0, #e8e8e8);
        box-shadow: 0 0 20px rgba(192, 192, 192, 0.5);
    }

    .bronze {
        background: radial-gradient(circle, #cd7f32, #daa520);
        box-shadow: 0 0 20px rgba(205, 127, 50, 0.5);
    }

    .team-name {
        margin-top: $spacing-lg;
        font-size: $font-size-base;
        font-weight: 600;
        text-align: center;
        color: white;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        opacity: 0;
        animation: fade-in-up 0.8s ease-out 2.2s forwards;
        line-height: $line-height-tight;
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
        width: 100%;
        padding: 0 $spacing-xs;
        box-sizing: border-box;
        
        @media (max-width: $mobile-width) {
            font-size: $font-size-sm;
            margin-top: $spacing-md;
        }
    }

    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
