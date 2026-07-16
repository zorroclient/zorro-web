// Pull docs content up under the sticky, translucent site header so the navbar
// floats over the top of the page (content scrolls beneath it) — pages add
// their own top padding so the heading clears the header.
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="-mt-20">{children}</div>;
}
