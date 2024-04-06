<script lang="ts">
    import type { ChangeEventHandler } from "svelte/elements";

    import readFileContent from "$lib/readFileContent";

    let saveFiles: Array<File> = [] as any;
    let fileContent: string = ''

    let saveFileUploadError: string = '';

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
        console.log(content.length)
        console.log(content.replace(/<userID>\d+<\/userID>/g, '<userID />').length)


    }
</script>

<h1>This character belongs to another player</h1>
<h3>Upload your save file to have this issue resolved.</h3>

<label for="save-upload-input">Upload your save file (Name_123456789)</label>
<input 
    id="save-upload-input"
    type="file"
    on:change={handleUploadedFile}
/>
{#if saveFileUploadError && saveFileUploadError != ''}
    <h3 class="error">{saveFileUploadError}</h3>
{/if}

<style lang="scss">

    .error {
        color: red;
        font-weight: bold;


    }
</style>