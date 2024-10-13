<script>
    let doc = null;
    let pageWrapper = null;
    export let currentUri = "";
    export let currentPage = 0;
    export let pages = 1;

    import * as pdfjs from "pdfjs-dist";
    import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?worker&url";
    import { renderPage } from "./lib/pdf";

    pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

    let canvases = Array(100).fill(null);

    export const setScroll = async (percentage) => {
        const targetScrollTop =
            (pageWrapper.scrollHeight * (percentage / pages)) / 1;
        pageWrapper.scrollBy(0, targetScrollTop);
    };

    export const setPage = async (page) => {
        if (currentPage == page || page < 1 || page > pages) return;
        currentPage = page;

        canvases[page - 1].scrollIntoView(true);
    };

    export const load = async (uri) => {
        if (currentUri == uri) return;

        doc = await pdfjs.getDocument(uri).promise;
        currentUri = uri;
        pages = doc.numPages;

        // dont even ask
        await new Promise((res) => setTimeout(res, 200));

        for (let i = 0; i < pages; i++) {
            await renderPage(doc, pageWrapper, canvases[i], i + 1);
        }

        await setPage(1);
    };
</script>

<section bind:this={pageWrapper} {...$$restProps}>
    {#key pages}
        {#each [...Array(pages).keys()] as i}
            <canvas bind:this={canvases[i]}></canvas>
        {/each}
    {/key}
</section>
