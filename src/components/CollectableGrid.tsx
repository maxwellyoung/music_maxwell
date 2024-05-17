"use client";
import React, { useState } from "react";
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
import songs from "./songsData";

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
};

const CollectableGrid: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedLyricSong, setSelectedLyricSong] = useState<string | null>(
    null,
  );

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
    <div className="min-h-screen bg-dark text-white">
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
              className="cursor-pointer"
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
                              onValueChange={setSelectedLyricSong}
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
                        <div className="bg-background max-h-48 overflow-y-auto">
                          {selectedLyricSong &&
                            selectedSong.lyrics[selectedLyricSong]
                              ?.split("\n")
                              .map((line, index) => <p key={index}>{line}</p>)}
                        </div>
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="credits">
                  <AccordionTrigger>Credits</AccordionTrigger>
                  <AccordionContent className="max-h-48 overflow-y-auto">
                    <div className="bg-background max-h-48 overflow-y-auto">
                      {selectedSong?.credits
                        ?.split("\n")
                        .map((line, index) => <p key={index}>{line}</p>)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="mt-4">
                <p className="text-gray-400">Available on:</p>
                <div className="flex space-x-2">
                  <a
                    href={selectedSong?.links.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Spotify
                  </a>
                  <a
                    href={selectedSong?.links.appleMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Apple Music
                  </a>
                  <a
                    href={selectedSong?.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
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
              className="mt-4 text-red-500 hover:underline"
            >
              Close
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <footer className="bg-dark py-4 text-center text-secondary">
        <div className="container mx-auto">
          <a
            href="https://open.spotify.com/artist/5HONdRTLNvBjlD2LirKp0q"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 text-primary hover:underline"
          >
            Spotify
          </a>
          <a
            href="https://music.apple.com/us/artist/maxwell-young/1113632139"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 text-primary hover:underline"
          >
            Apple Music
          </a>
          <a
            href="https://soundcloud.com/maxwell_young"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 text-primary hover:underline"
          >
            SoundCloud
          </a>
          <a
            href="https://www.youtube.com/@maxwell_young"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 text-primary hover:underline"
          >
            YouTube
          </a>
          <a
            href="https://x.com/internetmaxwell"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 text-primary hover:underline"
          >
            Twitter
          </a>
          <a
            href="https://www.maxwellyoung.info/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-primary hover:underline"
          >
            maxwellyoung.info
          </a>
        </div>
      </footer>
    </div>
  );
};

export default CollectableGrid;
