import { MessageSquare, Star } from "lucide-react";
import Rating from "react-rating";
import { Button } from "@/components/ui/button";
export default function SellerHeader({ setIsMessageOpen, seller }) {
  return (
    <div>
      <section className="bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <img
            src="https://placehold.co/200x200/ffffff/ff0055?text=Seller+Logo"
            alt="Seller Logo"
            className="rounded-full w-40 h-40 shadow-lg border-4 border-white object-cover"
          />
          <div className="flex-1 ">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 sm:text-left text-center">
              {seller}
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Rating
                emptySymbol={<Star size={18} className=" text-gray-300" />}
                fullSymbol={
                  <Star size={18} className="text-[#FFD700] fill-[#FFD700]" />
                }
                initialRating={4}
                readonly
              />

              <span className="text-sm text-white font-bold">
                (4.8/5 • 1.2k reviews)
              </span>
            </div>
            <div className="flex  gap-4">
              <Button
                className="
  bg-white text-[#FF0055] font-semibold 
  px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 
  text-sm sm:text-base md:text-lg 
  rounded-full 
  hover:bg-gray-100 transition-transform transform hover:scale-105
"
              >
                Follow
              </Button>

              <Button
                onClick={() => setIsMessageOpen(true)}
                className="bg-transparent border-2 border-white text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 
  text-sm sm:text-base md:text-lg  rounded-full hover:bg-white hover:text-[#FF0055] transition"
              >
                <MessageSquare className="inline w-5 h-5 mr-2" /> Message
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
