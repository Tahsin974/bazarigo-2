import { Button } from "@/components/ui/button";

export default function CallToActionSection() {
  return (
    <section className="relative w-full py-24 bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] overflow-hidden">
      <div className="relative z-10 text-center max-w-2xl mx-auto xl:px-6 lg:px-6  px-4 text-white">
        <h2 className="text-4xl md:text-5xl font-bold">
          Join Our Community Today
        </h2>
        <p className="mt-4 text-lg">
          Sign up for our exclusive newsletter and get 15% off your first
          purchase, plus early access to new products and sales.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 bg-white"
            aria-label="Email for newsletter signup"
          />
          <Button className="bg-white text-[#FF0055] font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors transform hover:scale-105">
            Sign Up
          </Button>
        </div>
      </div>
    </section>
  );
}
