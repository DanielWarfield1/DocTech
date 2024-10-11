<script>
import { onMount } from "svelte";
import PDF from "./PDF.svelte";
import Recognition from "./Recognition.svelte";
import toast, { Toaster } from 'svelte-french-toast';

let load = async uri => {};
let setPage = async page => {};
let setScroll = async percentage => {};
let page = 0;

const handleAction = async action => {
	try {
		const processingToast = toast('Processing...');
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
		toast.dismiss(processingToast);
		toast.success('Done!');
	} catch (err) {
		toast.error(err.toString());
	}
};

onMount(() => {
		load('example.pdf').then(() => toast.success("Loaded PDF"));
		});
</script>

<main>
<div class="pdf">
<PDF bind:currentPage={page} bind:setPage bind:setScroll bind:load />
</div>

<div class="recognition">
<Recognition
	callback={handleAction}
/>
</div>

<Toaster />
</main>

<style>
.pdf {
height: 70vh;
overflow: scroll;
}
</style>
