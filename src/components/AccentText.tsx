// Renders `text` with the first occurrence of `accent` set as the italic
// accent word. If `accent` is not found, the text is rendered plain.
export function AccentText({ text, accent }: { text: string; accent: string }) {
  const at = text.indexOf(accent);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="accent-word">{accent}</span>
      {text.slice(at + accent.length)}
    </>
  );
}
