"use client";

import { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "~/hooks/useMediaQuery";
import { NavigationTrigger } from "./NavigationTrigger";
import { NavigationOverlay } from "./NavigationOverlay";
import { NavigationMobile } from "./NavigationMobile";
import { NavigationSignature } from "./NavigationSignature";

export function NavigationRoot() {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerOpacity, setTriggerOpacity] = useState(1);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // At top of page, full opacity
    if (currentScrollY < 50) {
      setTriggerOpacity(1);
    }
    // Scrolling down, fade to 60%
    else if (currentScrollY > lastScrollY) {
      setTriggerOpacity(0.6);
    }
    // Scrolling up, return to full opacity
    else {
      setTriggerOpacity(1);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleClose = () => setIsOpen(false);
  const handleOpenChange = (open: boolean) => setIsOpen(open);

  return (
    <>
      {/* Minimal signature at top */}
      <NavigationSignature />

      {/* Floating trigger */}
      <NavigationTrigger
        onClick={handleToggle}
        isOpen={isOpen}
        opacity={isOpen ? 1 : triggerOpacity}
      />

      {/* Desktop overlay or Mobile drawer */}
      {isMobile ? (
        <NavigationMobile isOpen={isOpen} onOpenChange={handleOpenChange} />
      ) : (
        <NavigationOverlay isOpen={isOpen} onClose={handleClose} />
      )}
    </>
  );
}
