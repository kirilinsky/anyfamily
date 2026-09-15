import { ALL_IDS, packagePitch } from "@/lib/site-content";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_IDS.map((pkg) => ({ pkg }));
}

export async function GET(_: Request, { params }: { params: Promise<{ pkg: string }> }) {
  const { pkg } = await params;
  return new Response(packagePitch(pkg), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
