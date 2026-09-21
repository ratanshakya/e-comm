"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingCart, X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";

interface Product {
    id: string;
    name: string;
    hindiName?: string;
    price: number;
    category: string;
    image: string;
    color: string;
}

interface CartItem extends Product {
    quantity: number;
}

interface InteractiveCheckoutProps {
    products?: Product[];
}

const defaultProducts: Product[] = [
    {
        id: "1",
        name: "Royal Zardozi Velvet Poshak",
        hindiName: "शाही ज़ारदोज़ी मखमली पोशाक",
        price: 1499,
        category: "Festive Poshak",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80",
        color: "Crimson & Gold",
    },
    {
        id: "2",
        name: "24K Gold Kundan Mukut & Bansuri",
        hindiName: "24K स्वर्ण कुंदन मोर मुकुट",
        price: 899,
        category: "Crown & Shringar",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
        color: "Pure 24K Gold",
    },
    {
        id: "3",
        name: "Handcrafted Swarna Singhasan",
        hindiName: "हस्तनिर्मित काष्ठ स्वर्ण सिंहासन",
        price: 2199,
        category: "Singhasan & Jhula",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
        color: "Antique Brass Carved",
    },
];

function InteractiveCheckout({
    products = defaultProducts,
}: InteractiveCheckoutProps) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (product: Product) => {
        setCart((currentCart) => {
            const existingItem = currentCart.find(
                (item) => item.id === product.id
            );
            if (existingItem) {
                return currentCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...currentCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((currentCart) =>
            currentCart.filter((item) => item.id !== productId)
        );
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart((currentCart) =>
            currentCart.map((item) => {
                if (item.id === productId) {
                    const newQuantity = item.quantity + delta;
                    return newQuantity > 0
                        ? { ...item, quantity: newQuantity }
                        : item;
                }
                return item;
            })
        );
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3">
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                                "group",
                                "p-4 rounded-xl",
                                "bg-white dark:bg-zinc-900",
                                "border border-zinc-200 dark:border-zinc-800",
                                "hover:border-zinc-300 dark:hover:border-zinc-700",
                                "transition-all duration-200"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            "relative w-14 h-14 rounded-lg overflow-hidden shrink-0",
                                            "bg-zinc-100 dark:bg-zinc-800",
                                            "transition-colors duration-200",
                                            "group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                                        )}
                                    >
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                {product.name}
                                            </h3>
                                            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                                {product.category}
                                            </span>
                                        </div>
                                        {product.hindiName && (
                                            <p className="text-xs text-neutral-500 font-medium mt-0.5">
                                                {product.hindiName}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                                            <span className="font-bold text-black dark:text-white">₹{product.price.toLocaleString('en-IN')}</span>
                                            <span>•</span>
                                            <span>{product.color}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => addToCart(product)}
                                    className="gap-1.5 cursor-pointer bg-black text-white hover:bg-neutral-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add to Bag
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                        "w-full md:w-80 flex flex-col",
                        "p-4 rounded-xl",
                        "bg-white dark:bg-zinc-900",
                        "border border-zinc-200 dark:border-zinc-800",
                        "sticky top-24",
                        "max-h-[32rem]"
                    )}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <ShoppingCart className="w-4 h-4 text-zinc-500" />
                        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            Your Bag ({totalItems})
                        </h2>
                    </div>

                    <motion.div
                        className={cn(
                            "flex-1 overflow-y-auto",
                            "min-h-0",
                            "-mx-4 px-4",
                            "space-y-3"
                        )}
                    >
                        <AnimatePresence initial={false} mode="popLayout">
                            {cart.length === 0 ? (
                                <p className="text-xs text-neutral-400 text-center py-8">
                                    Your bag is empty. Add sacred items to continue.
                                </p>
                            ) : (
                                cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.96 }}
                                        transition={{
                                            opacity: { duration: 0.2 },
                                            layout: { duration: 0.2 },
                                        }}
                                        className={cn(
                                            "flex items-center gap-3",
                                            "p-2.5 rounded-lg",
                                            "bg-zinc-50 dark:bg-zinc-800/50",
                                            "mb-3"
                                        )}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                                    {item.name}
                                                </span>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() =>
                                                        removeFromCart(item.id)
                                                    }
                                                    className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                                                >
                                                    <X className="w-3 h-3 text-zinc-400" />
                                                </motion.button>
                                            </div>
                                            <div className="flex items-center justify-between mt-1.5">
                                                <div className="flex items-center gap-1">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                -1
                                                            )
                                                        }
                                                        className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </motion.button>
                                                    <motion.span
                                                        layout
                                                        className="text-xs font-bold text-zinc-800 dark:text-zinc-200 w-4 text-center"
                                                    >
                                                        {item.quantity}
                                                    </motion.span>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                1
                                                            )
                                                        }
                                                        className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </motion.button>
                                                </div>
                                                <motion.span
                                                    layout
                                                    className="text-xs font-bold text-black dark:text-zinc-100"
                                                >
                                                    ₹
                                                    {(
                                                        item.price * item.quantity
                                                    ).toLocaleString('en-IN')}
                                                </motion.span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </motion.div>
                    <motion.div
                        layout
                        className={cn(
                            "pt-3 mt-3",
                            "border-t border-zinc-200 dark:border-zinc-800",
                            "bg-white dark:bg-zinc-900"
                        )}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                Total Amount
                            </span>
                            <motion.span
                                layout
                                className="text-base font-extrabold text-black dark:text-zinc-100 flex items-center"
                            >
                                <span>₹</span>
                                <NumberFlow value={totalPrice} />
                            </motion.span>
                        </div>
                        <Button size="sm" className="w-full gap-2 cursor-pointer bg-black text-white hover:bg-neutral-800 font-bold uppercase tracking-wider text-xs py-2.5">
                            <CreditCard className="w-4 h-4" />
                            Proceed to Checkout
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export { InteractiveCheckout, defaultProducts, type Product }
