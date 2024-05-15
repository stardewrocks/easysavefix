<script lang="ts">
    import type { ChangeEventHandler } from "svelte/elements";
    import readFileContent from "$lib/readFileContent";
    import { get } from "svelte/store";
    import { onMount } from "svelte";

    let createMode = false

    let saveFiles: Array<File> = [] as any;
    let fileContent: string = ''

    let saveFileUploadError: string = '';
    let saveFileDownloadLink: string = '';

    let params = null as any

    
    let beforeRe =  ''
    let afterRe =  ''
    let fixText =  ''
    
    
    onMount(() => {
        params = new URLSearchParams(window.location.search);
        beforeRe = params?.get('before') ?? ''
        afterRe = params?.get('after') ?? ''
        fixText = params?.get('title') ?? ''

        if (!beforeRe || !afterRe || !fixText) createMode = true
        if (params?.has('creation')) createMode = true
    })
    

    const handleUploadedFile: ChangeEventHandler<HTMLInputElement> = async (e) => {
        const { files } = e.currentTarget
        if (files?.length == 0 || !files) return false
        
        saveFiles = files as unknown as File[]
        const file = files[0]

        if (
               file.name.includes('.') 
            || file.size < 1e5 /*100,000*/ 
        ) {
            saveFileUploadError = `${file.name} is not a valid Stardew Valley save file!`
            // return false;
            return;
        } else {
            saveFileUploadError = ''
        }

        console.log(file)
        const content = await readFileContent(file)
        const preRegex = new RegExp(beforeRe, 'gm')

        console.log(preRegex, afterRe)

        const newContent = content.replace(
            preRegex,
            afterRe
        )

        const newFile = new File(newContent.split('\n'), file.name, {
            type: file.type,
            lastModified: file.lastModified
        })

        saveFileDownloadLink = URL.createObjectURL(newFile)
        
        
    }
</script>


{#if !createMode}
    <h1>{fixText}</h1>
    <h3>Upload your save file to run this fixer/modifier.</h3>

    <h4 class="third-party-warning">This is created by a third-party and stardew.rocks is not responsible for any issues that may occur. Always back up your save before using a save editor.</h4>
    
    <br />
    <label for="save-upload-input">Upload your save file (Name_123456789)</label>
    <input 
        id="save-upload-input"
        type="file"
        on:change={handleUploadedFile}
    />
    {#if saveFileUploadError && saveFileUploadError != ''}
        <h3 class="error">{saveFileUploadError}</h3>
    {:else if saveFileDownloadLink}
        <a href={saveFileDownloadLink} download>Download modified save</a>
    {/if}

    <details>
        <summary>See replacing text</summary>
        <span><code>/{beforeRe}/gm</code> -> <code>{afterRe}</code></span>
    </details>
{:else}
    <h1>Create your own save fixer/modifier</h1>

    <label for="fix-title">Fix title</label>
    <input id="fix-title" type="text" bind:value={fixText}>
    <br />
    
    <label for="before-regex">Match Regex (Javascript, <code>/xyz/gm</code>)</label>
    <input id="before-regex" type="text" bind:value={beforeRe}>
    <br />
    
    <label for="after-regex">Match Replacement</label>
    <input id="after-regex" type="text" bind:value={afterRe}>
    <br />
    <br />

    <button id="create-fix-btn" on:click={() => {
        const linkWithoutParams = window.location.href.replace(window.location.search, '')
        window.location.href = linkWithoutParams + `?before=${encodeURIComponent(beforeRe)}&after=${encodeURIComponent(afterRe)}&title=${fixText}`
    }}>Create!</button>
{/if}

<style lang="scss">

    .error {
        color: red;
        font-weight: bold;
    }

    .third-party-warning {
        color: red;

        font-weight: bold;
        
        border-radius: 2px;
    }

    #create-fix-btn {
        outline: none;
        
        border: 2px solid rgb(0, 74, 0);
        border-radius: 5px;
        
        background-color:  green;
        color: white;
        
        width: 5em;
        height: 2em;
    }

    details {
        position: absolute;
        bottom: 10%;
    }
</style>