// Only one 3D scene renders at a time. Each scene says whether it wants to
// run (it is on screen, the tab is visible, its canvas is mounted); the
// most recent scene to ask wins, and when it stops wanting, the one before
// it (if it still wants) takes over. Scenes read the result with
// useSceneActive and pause their frame loop when it is false.
import { useSyncExternalStore } from "react";

export type SceneId = "hero" | "pipeline";

const wants = new Map<SceneId, number>();
const listeners = new Set<() => void>();
let seq = 0;
let current: SceneId | null = null;

function recompute() {
  let best: SceneId | null = null;
  let at = -1;
  for (const [id, n] of wants) {
    if (n > at) {
      best = id;
      at = n;
    }
  }
  if (best !== current) {
    current = best;
    listeners.forEach((l) => l());
  }
}

/** Ask to run (`on` true) or give it up. Repeated asks keep the order. */
export function wantScene(id: SceneId, on: boolean) {
  if (on) {
    if (!wants.has(id)) wants.set(id, ++seq);
  } else wants.delete(id);
  recompute();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** True while `id` is the scene allowed to render. */
export function useSceneActive(id: SceneId) {
  return useSyncExternalStore(
    subscribe,
    () => current === id,
    () => false,
  );
}
