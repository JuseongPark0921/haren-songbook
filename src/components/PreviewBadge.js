export default function PreviewBadge() {
  const isPreview =
    process.env.NEXT_PUBLIC_SITE_ENV === "preview" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

  if (!isPreview) return null;

  return (
    <div className="fixed bottom-3 right-3 z-50 rounded-full bg-[#3b1d6a]/80 px-3 py-1 text-xs font-semibold text-white shadow-lg">
      TEST / PREVIEW
    </div>
  );
}
