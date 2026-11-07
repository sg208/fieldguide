// DOM-free allowlist sanitizer for Wikipedia summaries (runs in the Worker and the browser).
// Anything not listed is dropped; text is escaped so output is safe to inject.
const ALLOWED = new Set(['p', 'b', 'i', 'em', 'strong', 'br', 'a']);
const VOID = new Set(['br']);
// Elements whose content is code or embedded documents: drop the content too.
const DROP_WITH_CONTENT = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'noscript',
  'template',
  'textarea',
]);

// A tag: quoted attribute values may contain ">".
const TAG = /^<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/;
const HREF = /(?:^|\s)href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i;

const escapeAttribute = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

/** Text node: keep well-formed entities, escape everything else. */
const safeText = (raw: string): string =>
  raw.replace(
    /&(?!(?:#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);)|[<>"]/g,
    (char) => ESCAPES[char] ?? char
  );

/** https URL on *.wikipedia.org, normalised; anything else null. */
export const safeWikipediaUrl = (
  raw: string | null | undefined
): string | null => {
  if (!raw) return null;
  try {
    const url = new URL(raw.replace(/&amp;/g, '&'));
    const isWikipedia =
      url.protocol === 'https:' && url.hostname.endsWith('.wikipedia.org');
    return isWikipedia ? url.href : null;
  } catch {
    return null;
  }
};

const closeTags = (names: string[]): string =>
  [...names]
    .reverse()
    .map((entry) => `</${entry}>`)
    .join('');

const hrefFrom = (attributes: string): string | null => {
  const match = HREF.exec(attributes);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
};

type SanitizeState = { out: string; rest: string; open: string[] };

const skipWithContent = (state: SanitizeState, name: string): void => {
  const close = new RegExp(`</${name}\\s*>`, 'i').exec(state.rest);
  state.rest = close ? state.rest.slice(close.index + close[0].length) : '';
};

const closeTag = (state: SanitizeState, name: string): void => {
  const index = state.open.lastIndexOf(name);
  if (index !== -1) state.out += closeTags(state.open.splice(index));
};

const openTag = (
  state: SanitizeState,
  name: string,
  attributes: string
): void => {
  if (VOID.has(name)) {
    state.out += `<${name}>`;
    return;
  }
  if (name !== 'a') {
    state.open.push(name);
    state.out += `<${name}>`;
    return;
  }
  const href = safeWikipediaUrl(hrefFrom(attributes));
  if (!href) return;
  state.open.push(name);
  state.out += `<a href="${escapeAttribute(href)}" rel="noopener noreferrer">`;
};

const handleTag = (
  state: SanitizeState,
  name: string,
  isClosing: boolean,
  attributes: string
): void => {
  if (DROP_WITH_CONTENT.has(name) && !isClosing) {
    skipWithContent(state, name);
    return;
  }
  if (!ALLOWED.has(name)) return;
  if (isClosing) closeTag(state, name);
  else openTag(state, name, attributes);
};

export const sanitizeHtml = (input: string): string => {
  const state: SanitizeState = { out: '', rest: input, open: [] };
  while (state.rest.length > 0) {
    const lt = state.rest.indexOf('<');
    if (lt === -1) {
      state.out += safeText(state.rest);
      break;
    }
    state.out += safeText(state.rest.slice(0, lt));
    state.rest = state.rest.slice(lt);
    const tag = TAG.exec(state.rest);
    if (!tag) {
      state.out += '&lt;';
      state.rest = state.rest.slice(1);
      continue;
    }
    const [whole, slash, rawName = '', attributes = ''] = tag;
    state.rest = state.rest.slice(whole.length);
    handleTag(state, rawName.toLowerCase(), Boolean(slash), attributes);
  }
  return state.out + closeTags(state.open);
};
