<script lang="ts">
    import { onMount } from 'svelte';
    
    export let src: string;
    export let alt: string;
    export let width: number | undefined = undefined;
    export let height: number | undefined = undefined;
    export let loading: 'lazy' | 'eager' = 'lazy';
    export let className: string = '';
    export let priority: boolean = false;
    
    let imageLoaded = false;
    let imageError = false;
    
    // Use eager loading for priority images
    $: actualLoading = priority ? 'eager' : loading;
    
    function handleLoad() {
        imageLoaded = true;
    }
    
    function handleError() {
        imageError = true;
        console.error(`Failed to load image: ${src}`);
    }
</script>

<img 
    {src} 
    {alt}
    width={width}
    height={height}
    loading={actualLoading}
    decoding={priority ? 'sync' : 'async'}
    class={className}
    class:loaded={imageLoaded}
    class:error={imageError}
    on:load={handleLoad}
    on:error={handleError}
/>

<style lang="scss">
    img {
        transition: opacity 0.3s ease-in-out;
        opacity: 0;
        
        &.loaded {
            opacity: 1;
        }
        
        &.error {
            opacity: 0.5;
            filter: grayscale(100%);
        }
    }
</style>
