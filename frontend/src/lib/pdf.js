export const renderPage = async (pdf, p, canvas, num) => {
  const page = await pdf.getPage(num);
  const viewport = page.getViewport({
    scale: p.clientWidth / page.view[2],
  });
  // Support HiDPI-screens.
  const outputScale = window.devicePixelRatio || 1;

  const context = canvas.getContext("2d");
  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);

  const transform =
    outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

  const renderContext = {
    canvasContext: context,
    transform: transform,
    viewport: viewport,
  };
  page.render(renderContext);
};
