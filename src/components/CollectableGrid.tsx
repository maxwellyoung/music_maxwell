"use client";
import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
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
import { cn } from "~/lib/utils";

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
  { src: "/pressphotos/4.jpg", alt: "Press Photo 4" },
  { src: "/pressphotos/3.jpeg", alt: "Press Photo 3" },
  { src: "/pressphotos/1.jpg", alt: "Press Photo 1" },
  { src: "/pressphotos/2.jpeg", alt: "Press Photo 2" },
];

// Add a reusable BlurImage component
const BlurImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      fill
      className={cn(
        "object-cover duration-700 ease-in-out",
        isLoading ? "scale-105 blur-sm" : "scale-100 blur-0",
        className,
      )}
      onLoadingComplete={() => setLoading(false)}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADc/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy0vLi44QzxAOEE4Ny42RUhMSk1RV1pZXTpBW2GBgWj/2wBDARUXFx4aHR4eHUE6LTo9QUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  );
};

// Function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string | undefined): string | null => {
  if (!url) return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const id = match?.[2];

  return id && id.length === 11 ? id : null;
};

// YouTube Thumbnail component
const YouTubeThumbnail = ({
  videoUrl,
  alt,
}: {
  videoUrl: string;
  alt: string;
}) => {
  const videoId = getYouTubeVideoId(videoUrl);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "/placeholder.svg";

  return (
    <div className="relative aspect-video w-full overflow-hidden">
      <Image
        src={thumbnailUrl}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
      />
    </div>
  );
};

const PressPhotoCarousel = () => {
  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      className="mx-auto w-full max-w-sm md:max-w-md lg:max-w-lg"
    >
      <CarouselContent>
        {photos.map((photo, index) => (
          <CarouselItem key={index} className="basis-full">
            <div className="p-1">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 flex justify-center gap-2">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
};

const AboutSection = () => (
  <section className="my-12">
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="font-reenie text-4xl">Maxwell Young</span>
        </CardTitle>
        <CardDescription>
          Pop because it&apos;s for people. Alternative because it has to be
          new.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Maxwell Young is a New Zealand artist making emotionally-driven
          alt-pop that&apos;s both personal and unpredictable. He started violin
          at three, learned production in his teens, and unexpectedly landed
          early internet traction when his beats appeared in Casey
          Neistat&apos;s vlogs. Since then, he&apos;s opened for The Internet
          and Snail Mail, with cosigns from The 1975, Phoebe Bridgers, and
          Brockhampton.
        </p>
        <br />
        <p>
          His 2022 EP <em>Birthday Girl</em> marked a shift—toward sharper
          textures, emotional maximalism, and songwriting that feels like
          recollection more than storytelling. <em>In My 20s</em> (2025) picks
          up that thread: a record about spirals, near-misses, and becoming who
          you are while already being someone else. The songs are immediate,
          catchy, and just off enough to stick with you.
        </p>
      </CardContent>
    </Card>
  </section>
);

const SongDrawer = ({
  song,
  open,
  onClose,
}: {
  song: Song;
  open: boolean;
  onClose: () => void;
}) => {
  // Get the first available lyrics version or use the song title if no version is specified
  const defaultVersion = song.lyrics
    ? Object.keys(song.lyrics)[0] ?? song.title
    : song.title;

  const [selectedLyricVersion, setSelectedLyricVersion] =
    useState<string>(defaultVersion);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: "easeOut", duration: 0.3 },
    },
  };

  // Format lyrics to ensure consistent indentation
  const formatText = (text: string | undefined) => {
    if (!text) return "";
    // Remove any existing indentation to normalize the text
    return text
      .split("\n")
      .map((line) => line.trim())
      .join("\n");
  };

  // Get the lyrics safely
  const getLyrics = () => {
    if (!song.lyrics) return "";
    // If there's only one version and it matches the song title, return that
    if (Object.keys(song.lyrics).length === 1 && song.lyrics[song.title]) {
      return song.lyrics[song.title];
    }
    // Otherwise, use the selected version
    return song.lyrics[selectedLyricVersion] ?? "";
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-h-[95vh] rounded-t-3xl border-none bg-neutral-950 p-0 text-white shadow-xl">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
          <DrawerHeader className="flex items-start justify-between p-0">
            <DrawerTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
              {song.title}
            </DrawerTitle>
            <DrawerClose className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-900 hover:text-neutral-300">
              <svg
                width="18"
                height="18"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </DrawerClose>
          </DrawerHeader>

          <div className="mt-4 grid grid-cols-1 gap-6 sm:mt-6 md:grid-cols-2 md:gap-8">
            {/* Left column - Album artwork */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              className="relative aspect-square w-full overflow-hidden rounded-xl shadow-lg md:sticky md:top-6 md:self-start"
            >
              <BlurImage src={song.artwork} alt={song.title} />
              <div className="absolute inset-0 rounded-xl ring-1 ring-white/10"></div>
            </motion.div>

            {/* Right column - Metadata */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col space-y-4 sm:space-y-6"
            >
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <a
                  href={song.links.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-[#1DB954]/10 px-3 py-1.5 text-sm font-medium text-[#1DB954] transition-colors hover:bg-[#1DB954]/20 sm:px-4 sm:py-2"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                  Spotify
                </a>
                <a
                  href={song.links.appleMusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-[#FB233B]/10 px-3 py-1.5 text-sm font-medium text-[#FB233B] transition-colors hover:bg-[#FB233B]/20 sm:px-4 sm:py-2"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.802.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.083c.822-.098 1.6-.314 2.292-.792 1.274-.87 2.05-2.05 2.248-3.57.08-.604.104-1.214.104-1.824V8.032c-.002-.258-.016-.515-.035-.77zm-4.703 8.675h-3.934v3.95H12.39v-3.95H8.47V11.84h3.92V7.885h2.968v3.954h3.934v2.96z" />
                  </svg>
                  Apple Music
                </a>
                <a
                  href={song.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-[#FF0000]/10 px-3 py-1.5 text-sm font-medium text-[#FF0000] transition-colors hover:bg-[#FF0000]/20 sm:px-4 sm:py-2"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube
                </a>
              </div>

              {song.videoLink && (
                <div className="relative w-full overflow-hidden rounded-lg">
                  <a
                    href={song.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block w-full"
                  >
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                      <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:p-4">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path d="M8 5.14v14l11-7-11-7z" fill="white" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <YouTubeThumbnail
                      videoUrl={song.videoLink}
                      alt={`${song.title} - Music Video`}
                    />
                  </a>
                </div>
              )}

              <div className="space-y-4 sm:space-y-6">
                {song.lyrics && (
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-base font-medium text-white sm:text-lg">
                      Lyrics
                    </h3>
                    <div className="scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 max-h-[30vh] overflow-y-auto rounded-lg bg-zinc-900/50 p-3 font-mono text-sm leading-relaxed tracking-wide text-zinc-300 sm:p-4">
                      <div className="whitespace-pre-wrap text-left">
                        {formatText(getLyrics())}
                      </div>
                    </div>
                  </div>
                )}

                {song.credits && (
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-base font-medium text-white sm:text-lg">
                      Credits
                    </h3>
                    <div className="scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 max-h-[20vh] overflow-y-auto rounded-lg bg-zinc-900/50 p-3 font-mono text-sm leading-relaxed text-zinc-400 sm:p-4">
                      <div className="whitespace-pre-wrap text-left">
                        {formatText(song.credits)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const CollectableGrid: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [products, setProducts] = useState<SanityProduct[]>([]);

  // Animation variants
  const albumVariants = {
    initial: { opacity: 0.95 },
    hover: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    initial: { opacity: 0, y: 10 },
    hover: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

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
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setSelectedSong(null);
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="bg-dark text-white">
        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12 md:grid-cols-3 lg:grid-cols-4">
            {songs.map((song, index) => (
              <motion.div
                key={index}
                initial="initial"
                whileHover="hover"
                onClick={() => openDrawer(song)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <motion.div variants={albumVariants}>
                    <BlurImage
                      src={song.artwork}
                      alt={song.title}
                      className="transition-all duration-300 group-hover:scale-105"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                  {/* Title overlay that appears on hover */}
                  <motion.div
                    className="absolute inset-x-0 bottom-0 p-4"
                    variants={titleVariants}
                  >
                    <h2 className="text-base font-medium text-white drop-shadow-md">
                      {song.title}
                    </h2>
                    <p className="text-xs text-white/80">{song.artist}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 flex flex-col items-stretch gap-12 md:flex-row">
            <div className="md:w-1/2">
              <PressPhotoCarousel />
            </div>
            <Separator
              orientation="vertical"
              className="mx-4 hidden md:block"
            />
            <div className="md:w-1/2">
              <AboutSection />
            </div>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <Card key={product._id}>
                  <CardHeader>
                    <CardTitle>{product.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.description && <p>{product.description}</p>}
                    {product.images?.[0]?.asset?.url && (
                      <div className="relative aspect-square overflow-hidden rounded-lg">
                        <BlurImage
                          src={product.images[0].asset.url}
                          alt={
                            product.images[0].asset.altText ?? "Product Image"
                          }
                          className="object-cover"
                        />
                      </div>
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

        <SongDrawer
          song={
            selectedSong ?? {
              title: "N/A",
              artist: "N/A",
              artwork: "/placeholder.svg",
              links: {
                spotify: "",
                appleMusic: "",
                youtube: "",
              },
            }
          }
          open={isOpen}
          onClose={closeDrawer}
        />

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
