<script lang="ts">
    import '@fontsource-variable/open-sans';

</script>

<main>
    <slot />
</main>

<style lang="scss">
    :global(body) {
        margin: 0;

        font-weight: 400;
        font-family: 'Open Sans Variable', sans-serif;
    }
    main {
        padding: 2em;
        min-height: 100vh;
        min-width: 100vh;

        color: white;
        background-color: #1a1a1a;
    }

</style>