import { Star } from "lucide-react";
import Rating from "react-rating";
import { Card } from "@/components/ui/card";
export default function ReviewsSection() {
  return (
    <section className="bg-gray-100 py-16 px-2 md:px-12">
      <div className="max-w-5xl mx-auto">
        <h2 className="sm:text-3xl text-2xl md:text-4xl  text-center text-gray-800  mb-10">
          Customer Reviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((r) => (
            <Card key={r} className="p-6 rounded-2xl shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={`https://placehold.co/50x50/FF0055/ffffff?text=U${r}`}
                  className="rounded-full"
                  alt="User Avatar"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">User {r}</h3>
                  <div className="flex gap-1">
                    <Rating
                      emptySymbol={
                        <Star size={18} className=" text-gray-300" />
                      }
                      fullSymbol={
                        <Star
                          size={18}
                          className="text-[#FFD700] fill-[#FFD700]"
                        />
                      }
                      initialRating={4}
                      readonly
                    />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Absolutely loved the quality and packaging. Will definitely buy
                again!
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
