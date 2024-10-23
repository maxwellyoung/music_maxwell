"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Rnd } from 'react-rnd'

interface Image {
  id: string
  src: string
  alt: string
  initialX: number
  initialY: number
  initialWidth: number
  initialHeight: number
  initialRotation: number
}

const images: Image[] = [
  { id: '1', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5435%202-6hEWiwJ4DzO8FEmQOsxjwhWlh4SNni.jpeg', alt: 'Man in suit in basement', initialX: 50, initialY: 50, initialWidth: 300, initialHeight: 400, initialRotation: 0 },
  { id: '2', src: '/placeholder.svg?height=300&width=400', alt: 'Modernist building', initialX: 400, initialY: 100, initialWidth: 400, initialHeight: 300, initialRotation: 5 },
  { id: '3', src: '/placeholder.svg?height=200&width=200', alt: 'Circular structure', initialX: 200, initialY: 300, initialWidth: 200, initialHeight: 200, initialRotation: -10 },
  { id: '4', src: '/placeholder.svg?height=100&width=200', alt: 'CO letters', initialX: 600, initialY: 400, initialWidth: 200, initialHeight: 100, initialRotation: 15 },
  { id: '5', src: '/placeholder.svg?height=150&width=250', alt: 'ORSO text', initialX: 100, initialY: 500, initialWidth: 250, initialHeight: 150, initialRotation: -5 },
]

export function AdvancedImageCollageComponent() {
  const [zIndexes, setZIndexes] = useState<{ [key: string]: number }>(
    Object.fromEntries(images.map((img, index) => [img.id, index + 1]))
  )
  const maxZIndexRef = useRef(images.length)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const bringToFront = (id: string) => {
    setZIndexes(prev => {
      maxZIndexRef.current += 1
      return { ...prev, [id]: maxZIndexRef.current }
    })
    setSelectedImage(id)
  }

  const resetPositions = () => {
    setZIndexes(Object.fromEntries(images.map((img, index) => [img.id, index + 1])))
    maxZIndexRef.current = images.length
    setSelectedImage(null)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        resetPositions()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      {images.map((image) => (
        <Rnd
          key={image.id}
          default={{
            x: image.initialX,
            y: image.initialY,
            width: image.initialWidth,
            height: image.initialHeight,
          }}
          style={{ zIndex: zIndexes[image.id] }}
          onDragStart={() => bringToFront(image.id)}
          onResizeStart={() => bringToFront(image.id)}
          bounds="parent"
          enableResizing={{
            top: true, right: true, bottom: true, left: true,
            topRight: true, topLeft: true, bottomRight: true, bottomLeft: true
          }}
        >
          <motion.div
            className="w-full h-full relative group"
            initial={{ rotate: image.initialRotation }}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover shadow-lg"
            />
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200"
            />
            {selectedImage === image.id && (
              <motion.div
                className="absolute -top-3 -left-3 w-6 h-6 bg-blue-500 rounded-full cursor-move"
                drag
                dragConstraints={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
                dragElastic={0.1}
                dragMomentum={false}
                onDrag={(_, info) => {
                  const rotationElement = info.point.x / 2
                  const parentElement = info.point.y / 2
                  const rotation = rotationElement + parentElement
                  const motionDiv = document.getElementById(`motion-div-${image.id}`)
                  if (motionDiv) {
                    motionDiv.style.transform = `rotate(${rotation}deg)`
                  }
                }}
              />
            )}
            <motion.div id={`motion-div-${image.id}`} className="w-full h-full" />
          </motion.div>
        </Rnd>
      ))}
    </div>
  )
}