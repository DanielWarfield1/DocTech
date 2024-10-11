<script>
    import { onMount } from "svelte";
import PDF from "./PDF.svelte";
import Recognition from "./Recognition.svelte";

let recog = {};
let action = [];
let words = [];

let load = async uri => {};
let setPage = async page => {};
let page = 0;

onMount(() => {
	load('example.pdf').then(() => console.log('loaded'));
});
</script>

<main>
<div class="pdf">
<PDF bind:currentPage={page} bind:setPage bind:load />
<button on:click={() => setPage(page - 1)}>up page</button>
<button on:click={() => setPage(page + 1)}>down page</button>
</div>

<div class="recognition">
<p>words: {words.join(' ')}</p>
<p>action: {action.join(' ')}</p>
<button on:click={() => recog?.start()}>start recording</button>

<Recognition bind:words bind:recognition={recog} callback={words => (action = words)}  />
</div>
</main>

