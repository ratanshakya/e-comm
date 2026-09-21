import { InteractiveCheckout, Product } from "@/components/ui/interactive-checkout"
import { Button } from "@/components/ui/button"

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

function InteractiveCheckoutDemo() {
    return <InteractiveCheckout products={defaultProducts} />
}

export default InteractiveCheckoutDemo;
export { InteractiveCheckoutDemo, defaultProducts }
