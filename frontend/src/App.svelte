<script>
    import { onMount } from "svelte";
    import PDF from "./PDF.svelte";
    import Recognition from "./Recognition.svelte";
    import toast, { Toaster } from "svelte-french-toast";

    let load = async (uri) => {};
    let setPage = async (page) => {};
    let setScroll = async (percentage) => {};
    let page = 0;
    let currentUri = "";

    const handleAction = async (action) => {
        try {
            const processingToast = toast("Processing...");
            const data = await (
                await fetch(
                    `${import.meta.env.VITE_API_URL}/query?query=${encodeURIComponent(action)}&current_page=${page}`,
                )
            ).json();
            if (data.error) throw Error(data.error);
            if (data.pdf) await load(data.pdf);
            if (data.next_page) await setPage(page + 1);
            if (data.previous_page) await setPage(page - 1);
            if (data.find_fig) await setPage(data.page);
            if (data.snap_page) await setPage(data.page.snap_page);
            if (data.scroll_up) await setScroll(-0.2);
            if (data.scroll_down) await setScroll(0.2);
            toast.dismiss(processingToast);
            toast.success("Done!");
        } catch (err) {
            toast.error(err.toString());
        }
    };
</script>

<main>
    <PDF
        class={"pdf" + (currentUri == "" ? " hide" : "")}
        bind:currentUri
        bind:currentPage={page}
        bind:setPage
        bind:setScroll
        bind:load
    />

    <div class="recognition">
        <Recognition callback={handleAction} main={currentUri == ""} />
    </div>

    <Toaster />
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        height: 90vh;
    }

    :global(.pdf) {
        height: 50vh;
        overflow-y: scroll;
        overflow-x: none;
    }

    .recognition {
        flex: 1;
    }

    :global(.hide) {
        display: none;
    }
</style>
