import { Suspense } from "react";
import dynamic from "next/dynamic";
import { EmailCapture } from "~/components/EmailCapture";
import { sanityClient } from "~/lib/sanity";

// Skeleton for album grid - shows immediately
function AlbumGridSkeleton() {
  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-8">
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-2xl bg-foreground/5"
            style={{
              animationDelay: `${i * 100}ms`,
              animationDuration: "1.5s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const CollectableGrid = dynamic(() => import("~/components/CollectableGrid"), {
  ssr: false,
  loading: () => <AlbumGridSkeleton />,
});

type SanityProduct = {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  images?: Array<{
    asset: {
      url: string;
      altText?: string;
    };
  }>;
  shopifyProductId?: string;
};

async function getProducts(): Promise<SanityProduct[]> {
  try {
    const products: SanityProduct[] = await sanityClient.fetch(
      `*[_type == "product"]{
        _id,
        title,
        description,
        price,
        images[]{
          asset->{
            url,
            altText
          }
        },
        shopifyProductId
      }`
    );
    return products;
  } catch (error) {
    console.error("[Sanity] Products fetch error:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-[90vh]">
      {/* Main Discography Grid */}
      <section className="container mx-auto py-8">
        <Suspense fallback={<AlbumGridSkeleton />}>
          <CollectableGrid initialProducts={products} />
        </Suspense>
      </section>

      {/* Minimal Email Capture */}
      <section className="border-t border-white/5 py-8">
        <div className="container mx-auto px-4">
          <EmailCapture variant="minimal" />
        </div>
      </section>
    </main>
  );
}
