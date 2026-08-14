import html2pdf from 'html2pdf.js';

export async function exportResumePdf(
  element: HTMLElement,
  fileName = 'resume.pdf',
) {
  if (!element) return;

  const originalTransform = element.style.transform;
  const originalTransformOrigin = element.style.transformOrigin;

  try {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    element.style.transform = 'none';
    element.style.transformOrigin = 'top left';

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

    await html2pdf()
      .set({
        margin: 0,

        filename: fileName,

        image: {
          type: 'jpeg',
          quality: 1,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          scrollX: 0,
          scrollY: 0,
        },

        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
      })
      .from(element)
      .save();
  } finally {
    element.style.transform = originalTransform;
    element.style.transformOrigin = originalTransformOrigin;
  }
}