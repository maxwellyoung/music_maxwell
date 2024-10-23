import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Product } from "~/lib/products";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Product[];
  removeFromCart: (productId: number) => void;
}

export function Cart({ isOpen, onClose, cart, removeFromCart }: CartProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed inset-y-0 right-0 z-50 w-full bg-gray-900 p-6 shadow-lg sm:w-96"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-light">Your Cart</h3>
            <button onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-800 py-4"
                >
                  <div>
                    <h4 className="font-light">{item.name}</h4>
                    <p className="text-sm text-gray-400">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="mt-6">
                <p className="mb-4 text-xl font-light">
                  Total: $
                  {cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </p>
                <button className="w-full rounded-full bg-white px-4 py-2 text-black transition-colors duration-300 hover:bg-gray-200">
                  Checkout
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
