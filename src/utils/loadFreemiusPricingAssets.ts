export type FreemiusPricingAssets = {
  scripts: string[];
  styles: string[];
};

function loadStylesheet(href: string): Promise<void> {
  if (document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));
    document.head.appendChild(link);
  });
}

function loadScript(src: string): Promise<void> {
  if (document.querySelector(`script[src="${src}"]`)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}

export async function loadFreemiusPricingAssets(
  assets: FreemiusPricingAssets | null | undefined
): Promise<void> {
  if (!assets) {
    return;
  }

  for (const href of assets.styles) {
    await loadStylesheet(href);
  }

  for (const src of assets.scripts) {
    await loadScript(src);
  }
}
