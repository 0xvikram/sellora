// Where a live 3D scene may run: desktop with a mouse, motion allowed, and
// WebGL (checked separately, once). Everything else keeps the poster.
export const LIVE_QUERY = "(pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)";

let webgl: boolean | undefined;
export function hasWebGL() {
  if (webgl !== undefined) return webgl;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    webgl = !!gl;
  } catch {
    webgl = false;
  }
  return webgl;
}
