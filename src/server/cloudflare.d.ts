// Minimal typings for the Workers runtime pieces edgeCache touches.
declare module 'cloudflare:workers' {
  export const waitUntil: (promise: Promise<unknown>) => void;
}
