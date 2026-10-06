export function createLazyPlayerAPIMethod(): never {
  throw new Error(
    "[PlayerAPIProvider] Attempted to call an Player API method before initialization. " +
      "Make sure the Player is mounted and has registered its API methods before calling.",
  );
}
