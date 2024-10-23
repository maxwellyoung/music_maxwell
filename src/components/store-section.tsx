"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { products } from "~/lib/products";
import type { Product } from "~/lib/products";
import { Cart } from "~/components/Cart";

export const StoreSectionComponent: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
    setSelectedProduct(product);
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  if (!isMounted) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-light">Store</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-lg bg-gray-900 shadow-lg"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-xl font-light">{product.name}</h3>
                <p className="mb-4 text-red-500">${product.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full rounded-full bg-white px-4 py-2 text-black transition-colors duration-300 hover:bg-gray-200"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          className="fixed bottom-8 right-8 rounded-full bg-white p-4 text-black shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingBag size={24} />
          {cart.length > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {cart.length}
            </span>
          )}
        </motion.button>

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          removeFromCart={removeFromCart}
        />

        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="max-w-md rounded-lg bg-gray-900 p-8 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="mb-4 text-2xl font-light">
                  {selectedProduct.name} Added to Cart
                </h3>
                <p className="mb-6 text-gray-400">
                  Your item has been added to the cart successfully.
                </p>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="rounded-full bg-white px-6 py-2 text-black transition-colors duration-300 hover:bg-gray-200"
                >
                  Continue Shopping
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
