const PRINT_ROOT_ID = "weekly-report-print";

function findAppStylesheet(): string | null {
  const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
  return (
    links.find((link) => link.href.includes("assets/style.css"))?.href ??
    links.find((link) => link.href.includes("expenzey-ai"))?.href ??
    null
  );
}

function preparePrintClone(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement;
  stripPrintChrome(clone);

  clone.querySelectorAll(".report-section-body, section, [class*='overflow-y-auto'], [class*='max-h-']").forEach(
    (element) => {
      const node = element as HTMLElement;
      node.style.overflow = "visible";
      node.style.maxHeight = "none";
      node.style.height = "auto";
      node.style.minHeight = "0";
    },
  );

  return clone;
}

function stripPrintChrome(clone: HTMLElement): void {
  const header = clone.querySelector("header");
  if (!header) {
    return;
  }

  header.querySelector(":scope > a")?.remove();

  const actionRow = header.querySelector(":scope > div > div:last-child");
  if (actionRow?.querySelector("button")) {
    actionRow.remove();
  }
}

function buildPrintDocumentHtml(options: {
  title: string;
  bodyHtml: string;
  stylesheetHref: string | null;
}): string {
  const stylesheetTag = options.stylesheetHref
    ? `<link rel="stylesheet" href="${escapeAttribute(options.stylesheetHref)}">`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(options.title)}</title>
  ${stylesheetTag}
  <style>
    html, body {
      margin: 0;
      padding: 24px;
      background: #fff;
      color: #0f172a;
    }

    @page {
      margin: 1cm;
      size: auto;
    }

    .weekly-report-print {
      color: #000 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .weekly-report-print .report-section-body,
    .weekly-report-print [class*="overflow-y-auto"],
    .weekly-report-print [class*="max-h-"] {
      overflow: visible !important;
      max-height: none !important;
      height: auto !important;
      min-height: 0 !important;
    }

    .weekly-report-print section {
      height: auto !important;
      min-height: 0 !important;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .weekly-report-print thead {
      position: static !important;
    }

    .weekly-report-print img {
      break-inside: avoid;
    }
  </style>
</head>
<body>
  ${options.bodyHtml}
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

function waitForStylesheet(doc: Document): Promise<void> {
  const link = doc.querySelector<HTMLLinkElement>('link[rel="stylesheet"]');
  if (!link) {
    return Promise.resolve();
  }

  if (link.sheet) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    link.addEventListener("load", () => resolve(), { once: true });
    link.addEventListener("error", () => resolve(), { once: true });
    window.setTimeout(resolve, 5_000);
  });
}

function waitForImages(doc: Document): Promise<void> {
  const images = Array.from(doc.images);
  if (images.length === 0) {
    return Promise.resolve();
  }

  return Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  ).then(() => undefined);
}

async function waitForPrintReady(doc: Document): Promise<void> {
  await waitForStylesheet(doc);
  await waitForImages(doc);
  await doc.fonts.ready;
}

function triggerPrint(win: Window, onDone: () => void): void {
  win.focus();
  win.print();
  win.addEventListener("afterprint", onDone, { once: true });
  window.setTimeout(onDone, 120_000);
}

function openPrintDocument(html: string): void {
  const printWindow = window.open("", "_blank", "noopener,noreferrer");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    let cleanedUp = false;
    const cleanup = () => {
      if (cleanedUp) {
        return;
      }
      cleanedUp = true;
      if (!printWindow.closed) {
        printWindow.close();
      }
    };

    void waitForPrintReady(printWindow.document).then(() => {
      triggerPrint(printWindow, cleanup);
    });
    return;
  }

  printViaOffscreenIframe(html);
}

function printViaOffscreenIframe(html: string): void {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText = "position:fixed;left:-10000px;top:0;width:900px;height:100vh;border:0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) {
    iframe.remove();
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) {
      return;
    }
    cleanedUp = true;
    iframe.remove();
  };

  void waitForPrintReady(doc).then(() => {
    triggerPrint(win, cleanup);
  });
}

/** Opens print dialog with report-only HTML (no WordPress admin chrome). */
export function printWeeklyReport(fallbackTitle = "Weekly Report"): void {
  const source = document.getElementById(PRINT_ROOT_ID);
  if (!source) {
    return;
  }

  const clone = preparePrintClone(source);
  const title = clone.querySelector("h1")?.textContent?.trim() || fallbackTitle;

  openPrintDocument(
    buildPrintDocumentHtml({
      title,
      bodyHtml: clone.outerHTML,
      stylesheetHref: findAppStylesheet(),
    }),
  );
}
