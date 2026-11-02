import { buildIndex } from "@/lib/content";

// Arama dizini derleme anında tek bir statik JSON dosyası olarak üretilir
// (out/arama-dizini.json). ⌘K paleti ve /arsiv bunu ilk ihtiyaçta bir kez indirir;
// böylece 900'e yakın kayıt her sayfanın HTML'ine gömülmez.
export const dynamic = "force-static";

export function GET() {
  const slim = buildIndex().map((e) => {
    // istemcide kullanılmayan/boş alanları at
    const o: Record<string, unknown> = { ...e };
    for (const k of Object.keys(o)) if (o[k] === undefined || o[k] === null || o[k] === "") delete o[k];
    return o;
  });
  return Response.json(slim);
}
