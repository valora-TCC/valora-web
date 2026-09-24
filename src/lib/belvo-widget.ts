const BELVO_SCRIPT_SRC = 'https://cdn.belvo.io/belvo-widget-1-stable.js';

export type BelvoWidgetEvent = {
  eventName?: string;
  meta_data?: { message?: string };
  message?: string;
};

export type BelvoWidgetLink = {
  id?: string;
  link?: string;
  institution?: string;
  institution_name?: string;
};

type BelvoSdk = {
  createWidget: (
    accessToken: string,
    config: Record<string, unknown>,
  ) => { build: () => void };
};

declare global {
  interface Window {
    belvoSDK?: BelvoSdk;
  }
}

function loadBelvoScript(): Promise<void> {
  if (window.belvoSDK) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${BELVO_SCRIPT_SRC}"]`,
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Falha ao carregar Belvo SDK')), {
        once: true,
      });
      if (window.belvoSDK) resolve();
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = BELVO_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Falha ao carregar Belvo SDK'));
    document.head.appendChild(script);
  });
}

export async function openBelvoConnectWidget(input: {
  accessToken: string;
  onSuccess: (link: BelvoWidgetLink) => void;
  onExit?: (data?: unknown) => void;
  onEvent?: (event: BelvoWidgetEvent) => void;
}): Promise<void> {
  await loadBelvoScript();

  for (let i = 0; i < 40; i += 1) {
    if (window.belvoSDK?.createWidget) break;
    await new Promise((r) => setTimeout(r, 100));
  }

  if (!window.belvoSDK?.createWidget) {
    throw new Error('Belvo SDK indisponível neste navegador.');
  }

  const host = document.getElementById('belvo');
  if (host) host.innerHTML = '';

  window.belvoSDK
    .createWidget(input.accessToken, {
      locale: 'pt',
      country_codes: ['BR'],
      institution_types: ['retail'],
      institutions: 'ofmockbank_br_retail',
      access_mode: 'single',
      callback: (data: BelvoWidgetLink) => input.onSuccess(data),
      onExit: (data: unknown) => input.onExit?.(data),
      onEvent: (event: BelvoWidgetEvent) => input.onEvent?.(event),
    })
    .build();
}
