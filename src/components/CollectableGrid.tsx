"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "./ui/select";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "./ui/resizable";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { AspectRatio } from "./ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import songs from "./songsData";
import { sanityClient } from "../lib/sanity";

// Define the Song type
type Song = {
  title: string;
  artist: string;
  artwork: string;
  links: {
    spotify: string;
    appleMusic: string;
    youtube: string;
  };
  lyrics?: Record<string, string>;
  credits?: string;
  videoLink?: string;
};

// Define the SanityProduct type
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

const photos = [
  { src: "/pressphotos/1.jpg", alt: "Press Photo 1" },
  { src: "/pressphotos/1.jpg", alt: "Press Photo 1" },
  { src: "/pressphotos/1.jpg", alt: "Press Photo 1" },
  { src: "/pressphotos/2.jpeg", alt: "Press Photo 2" },
  { src: "/pressphotos/3.jpeg", alt: "Press Photo 3" },

  // Add more photos as needed
];

const PressPhotoCarousel = () => (
  <section className="my-12">
    <div className="relative max-w-full overflow-hidden">
      <Carousel className="max-w-full overflow-hidden">
        <CarouselContent className="flex items-center justify-center">
          {photos.map((photo, index) => (
            <CarouselItem
              key={index}
              className="w-full flex-shrink-0 sm:w-auto"
            >
              <AspectRatio ratio={4 / 3} className="relative w-full">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                  priority
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-2" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-2" />
      </Carousel>
    </div>
  </section>
);

const AboutSection = () => (
  <section className="my-12">
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="font-reenie text-4xl">Maxwell Young</span>
        </CardTitle>
        <CardDescription>Musician, DJ, and visual artist</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Maxwell Young is a singer/songwriter/producer from Wellington, New
          Zealand. His music began getting attention when his boom bap beats
          inspired by College Dropout era Kanye instrumentals were featured on a
          selection of successful YouTuber Casey Neistat&apos;s videos. His
          first show was opening for The Internet at San Fran in Wellington. He
          went on to release a bedroom pop album featuring the likes of Clairo.
          He continued releasing music and opening for more international acts
          such as Peanut Butter Wolf and Snail Mail. Maxwell has garnered praise
          from The 1975, Phoebe Bridgers, and Brockhampton.
        </p>
        <br />
        <p>
          Since then, he has been focused on creating alternative pop music
          which feels new but clarifying, songs which try to stick out with
          newness and earnestness with his music partner Eddie
          &apos;Lontalius&apos; Johnston. Many songs have been released from
          their collaboration as well as music videos made with friends. An EP
          was released in 2022 called Birthday Girl featuring one of
          Maxwell&apos;s proudest songs &apos;Believe,&apos; and in 2023 Maxwell
          began consistently releasing singles. In 2024, he continues to build
          his catalogue with new music that pushes the boundaries of his style
          and artistry.
        </p>
      </CardContent>
      <CardFooter>
        <p>Magic is everywhere.</p>
      </CardFooter>
    </Card>
  </section>
);

const CollectableGrid: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedLyricSong, setSelectedLyricSong] = useState<string | null>(
    null,
  );
  const [products, setProducts] = useState<SanityProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const sanityProducts: SanityProduct[] = await sanityClient.fetch(
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
          }`,
        );
        setProducts(sanityProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    void fetchProducts();
  }, []);

  const openDrawer = (song: Song) => {
    setSelectedSong(song);
    setSelectedLyricSong(
      song.lyrics ? Object.keys(song.lyrics)[0] ?? null : null,
    );
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setSelectedSong(null);
    setSelectedLyricSong(null);
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="bg-dark text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {songs.map((song, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => openDrawer(song)}
                className="cursor-pointer overflow-hidden rounded-lg p-4"
              >
                <Image
                  src={song.artwork}
                  alt={song.title}
                  width={150}
                  height={150}
                  className="mx-auto rounded-lg"
                />
                <h2 className="mt-4 text-xl font-bold text-primary">
                  {song.title}
                </h2>
                <p className="text-secondary">{song.artist}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-stretch md:flex-row">
            <div className="md:w-1/2">
              <PressPhotoCarousel />
            </div>
            <Separator
              orientation="vertical"
              className="mx-4 my-12 hidden md:block"
            />
            <div className="md:w-1/2">
              <AboutSection />
            </div>
          </div>

          <div className="mt-12">
            {/* <h2 className="text-2xl font-bold">Products</h2> */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <Card key={product._id}>
                  <CardHeader>
                    <CardTitle>{product.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.description && <p>{product.description}</p>}
                    {product.images?.[0]?.asset?.url && (
                      <Image
                        src={product.images[0].asset.url}
                        alt={product.images[0].asset.altText ?? "Product Image"}
                        width={150}
                        height={150}
                        className="rounded-lg"
                      />
                    )}
                    {product.price && <p>Price: ${product.price.toFixed(2)}</p>}
                  </CardContent>
                  {product.shopifyProductId && (
                    <CardFooter>
                      <a
                        href={`https://your-shopify-domain.com/products/${product.shopifyProductId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View on Shopify
                      </a>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="p-4">
            <DrawerHeader>
              <DrawerTitle>{selectedSong?.title}</DrawerTitle>
              <DrawerClose onClick={closeDrawer} />
            </DrawerHeader>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel className="flex-shrink-0 p-4">
                {selectedSong && (
                  <Image
                    src={selectedSong.artwork}
                    alt={selectedSong.title}
                    width={300}
                    height={300}
                    className="mx-auto rounded-lg"
                  />
                )}
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel className="max-h-96 flex-grow overflow-y-auto p-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="lyrics">
                    <AccordionTrigger>Lyrics</AccordionTrigger>
                    <AccordionContent className="max-h-48 overflow-y-auto">
                      {selectedSong?.lyrics && (
                        <>
                          {Object.keys(selectedSong.lyrics).length > 1 && (
                            <div className="mb-4">
                              <Select
                                onValueChange={(value) =>
                                  setSelectedLyricSong(value)
                                }
                                value={selectedLyricSong ?? ""}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a song" />
                                </SelectTrigger>
                                <SelectContent className="bg-background text-foreground">
                                  {Object.keys(selectedSong.lyrics).map(
                                    (songTitle, index) => (
                                      <SelectItem key={index} value={songTitle}>
                                        {songTitle}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <div className="max-h-48 overflow-y-auto bg-background">
                            {selectedLyricSong &&
                              selectedSong.lyrics[selectedLyricSong]
                                ?.split("\n")
                                .map((line, index) => (
                                  <p key={index}>{line}</p>
                                ))}
                          </div>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="credits">
                    <AccordionTrigger>Credits</AccordionTrigger>
                    <AccordionContent className="max-h-48 overflow-y-auto">
                      <div className="max-h-48 overflow-y-auto bg-background">
                        {selectedSong?.credits
                          ?.split("\n")
                          .map((line, index) => <p key={index}>{line}</p>)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {selectedSong?.videoLink && (
                  <div className="mt-4">
                    <a
                      href={selectedSong.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Watch Music Video
                    </a>
                  </div>
                )}
                <div className="mt-4">
                  <p className="text-gray-400">Available on:</p>
                  <div className="flex flex-wrap space-x-2">
                    <a
                      href={selectedSong?.links.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer text-blue-500 hover:underline"
                    >
                      Spotify
                    </a>
                    <a
                      href={selectedSong?.links.appleMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer text-blue-500 hover:underline"
                    >
                      Apple Music
                    </a>
                    <a
                      href={selectedSong?.links.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer text-blue-500 hover:underline"
                    >
                      YouTube
                    </a>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
            <DrawerFooter>
              <button
                onClick={closeDrawer}
                className="mt-4 cursor-pointer text-red-500 hover:underline"
              >
                Close
              </button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        {/* <StoreSectionComponent /> */}

        <footer className="bg-dark py-4 text-center text-secondary">
          <div className="container mx-auto flex flex-col justify-center md:flex-row md:flex-wrap">
            <div className="flex flex-wrap justify-center">
              <a
                href="https://open.spotify.com/artist/5HONdRTLNvBjlD2LirKp0q"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 my-1 cursor-pointer text-primary hover:underline"
              >
                Spotify
              </a>
              <a
                href="https://music.apple.com/us/artist/maxwell-young/1113632139"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 my-1 cursor-pointer text-primary hover:underline"
              >
                Apple Music
              </a>
              <a
                href="https://soundcloud.com/maxwell_young"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 my-1 cursor-pointer text-primary hover:underline"
              >
                SoundCloud
              </a>
              <a
                href="https://www.youtube.com/@maxwell_young"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 my-1 cursor-pointer text-primary hover:underline"
              >
                YouTube
              </a>
              <a
                href="https://x.com/internetmaxwell"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 my-1 cursor-pointer text-primary hover:underline"
              >
                Twitter
              </a>
              <a
                href="https://instagram.com/maxwell_young"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 my-1 cursor-pointer text-primary hover:underline"
              >
                Instagram
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CollectableGrid;
