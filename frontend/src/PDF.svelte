<script>
let doc =  null;
export let currentUri =  '';
export let currentPage =  0;
export let currentScroll =  0;
export let pages =  1;

import * as pdfjs from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?worker&url';
import { onMount } from 'svelte';
import { renderPage } from './lib/pdf';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

let canvas;

export const setScroll = async percentage => {
	const targetScrollTop = (canvas.scrollHeight * percentage) / 1;
	window.scrollTo(0, targetScrollTop);
};

export const setPage = async page => {
	if (currentPage == page || page < 1 || page > pages) return;
	currentScroll = 0;
	currentPage = page;

	return await renderPage(doc, canvas)(page);
};

export const load = async uri => {
	if (currentUri == uri) return;

	doc = await pdfjs.getDocument(uri).promise;
	currentUri = uri;
	pages = doc.numPages;

	await setPage(1);
};
</script>

<main>
<canvas bind:this={canvas}></canvas>
</main>

<style>
</style>
