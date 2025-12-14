import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import img from "../../../assets/Bazarigo-White.svg";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4  sm:gap-12 md:grid-cols-3 sm:grid-cols-2  lg:justify-items-center">
          <div className="space-y-4">
            <img src={img} className="h-10 w-auto" alt="logo" />
            <p className="text-gray-400 text-sm">
              Shop with confidence, pay with ease, <br />
              and enjoy fast delivery – only on Bazarigo.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/16BK5Q6WY5/"
                aria-label="Follow us on Facebook"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://www.instagram.com/bazarigo.online.shop?igsh=bzJxaXZvN3JyaDI1"
                aria-label="Follow us on Instagram"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/categories"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="/about#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact-us#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy-policy#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-conditions#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms And Conditions
                </a>
              </li>
              <li>
                <a
                  href="/seller-terms-conditions#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Seller Terms And Conditions
                </a>
              </li>
              <li>
                <a
                  href="/return-refund#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Return & Refund
                </a>
              </li>
              <li>
                <a
                  href="/data-deletion#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Data Deletion Request
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="mailto:bazarigo.official@gmail.com"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>
                    <Mail size={18} />
                  </span>
                  <span>bazarigo.official@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:01797-454-118"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>
                    <Phone size={18} />
                  </span>
                  <span>01797-454-118</span>
                </a>
              </li>
              <li>
                <a
                  href="https://goo.gl/maps/PR6qnAt9QkfsWGZcA"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>
                    <MapPin size={18} />
                  </span>
                  <span>
                    Plot #04, Road #02,
                    <br /> Mirpur-1, Dhaka, Bangladesh
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-8 border-gray-700" />
        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Bazarigo. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
