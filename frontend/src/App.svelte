<script>
import { onMount } from "svelte";
import PDF from "./PDF.svelte";
import Recognition from "./Recognition.svelte";

let recog = {};
let action = [];
let words = [];
let error = null;

let load = async uri => {};
let setPage = async page => {};
let setScroll = async percentage => {};
let page = 0;

const handleAction = async action => {
	try {
	error = null;
	 const data = await (await fetch(`${import.meta.env.VITE_API_URL}?query=${encodeURIComponent(action)}&current_page=${page}`)).json();
	 console.log(data);
	 if (data.error) throw Error(data.error);
	 // probably broken ?
	 if (data.pdf) await load(data.pdf);
	 if (data.next_page) await setPage(page + 1);
	 if (data.previous_page) await setPage(page - 1);
	 if (data.snap_page) await setPage(data.page.snap_page);
	 if (data.scroll_up) await setScroll(-0.2);
	 if (data.scroll_down) await setScroll(0.2);
	} catch (err) {
	error = err.toString();
	}
};

onMount(() => {
	load('example.pdf').then(() => console.log('loaded'));
	});
</script>

<main>
<div class="pdf">
<PDF bind:currentPage={page} bind:setPage bind:setScroll bind:load />
</div>

<div class="recognition">
<p>words: {words.join(' ')}</p>
<p>action: {action.join(' ')}</p>
<button on:click={() => recog?.start()}>start recording</button>

<Recognition bind:words bind:recognition={recog} callback={handleAction}  />
</div>

<p>{error}</p>
</main>

<style>
.pdf {
	height: 50vh;
	overflow: scroll;
}
</style>
