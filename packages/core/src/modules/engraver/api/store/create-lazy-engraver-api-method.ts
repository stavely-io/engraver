export function createLazyEngraverAPIMethod(): never {
  throw new Error(
    '[EngraverAPIProvider] Attempted to call an Engraver API method before initialization. ' +
      'Make sure the Engraver is mounted and has registered its API methods before calling.',
  );
}
