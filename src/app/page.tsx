import dynamic from "next/dynamic";
import { UpcomingReleases } from "~/components/UpcomingReleases";
import { EmailCapture } from "~/components/EmailCapture";
import { sanityClient } from "~/lib/sanity";

const CollectableGrid = dynamic(() => import("~/components/CollectableGrid"), {
  ssr: false,
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
      {/* Upcoming Release Banner - subtle top bar */}
      <UpcomingReleases />

      {/* Main Discography Grid */}
      <section className="container mx-auto py-8">
        <CollectableGrid initialProducts={products} />
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
