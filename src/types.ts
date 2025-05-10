export interface Song {
  title: string;
  lyrics: string[];
  artwork: string;
  artist: string;
}

export interface SanityProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: {
    asset: {
      url: string;
      altText: string;
    };
  }[];
  shopifyProductId: string;
}
