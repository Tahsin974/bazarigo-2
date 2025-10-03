import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
export default function ProductCard({ item }) {
  const safe = (value, fallback = "") =>
    value !== undefined && value !== null ? value : fallback;

  return (
    <div>
      <motion.div whileHover={{ scale: 1.03 }}>
        <Card className="rounded-2xl shadow-md bg-white hover:shadow-lg transition">
          <CardContent className="p-4">
            <div className="w-full h-40 overflow-hidden rounded-lg">
              <img
                src={safe(
                  item.img,
                  "https://placehold.co/400x400/ddd/777?text=No+Image"
                )}
                alt={safe(item.name, "Product")}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="mt-4 font-semibold">{safe(item.name, "Unnamed")}</h3>
            <p className="text-[#FF0055] font-bold">{safe(item.price, "—")}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
