import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-[#FF0055] mb-6">About Us</h1>

      <Card className="p-6 bg-white shadow-md space-y-6 rounded-md">
        <section>
          <h2 className="text-2xl font-semibold mb-2">Who We Are</h2>
          <p className="text-gray-700">
            Welcome to{" "}
            <span className="font-semibold text-[#FF0055]">Bazarigo</span> —
            your trusted online shopping destination. We are dedicated to
            providing high-quality products, seamless shopping experiences, and
            excellent customer support. Our mission is to make online shopping
            easy, affordable, and enjoyable for everyone.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
          <p className="text-gray-700">
            Our goal is to connect customers with quality products from reliable
            sellers. We work tirelessly to ensure a smooth buying process, quick
            delivery, and exceptional service. Whether you're buying for
            yourself or for your business, Bazarigo is here to serve your needs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Why Choose Us</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Wide range of authentic products</li>
            <li>Fast and secure delivery</li>
            <li>Easy return and refund policies</li>
            <li>Dedicated customer service</li>
            <li>Affordable prices and great deals</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <p className="text-gray-700">
            Have any questions or feedback? We’d love to hear from you! You can
            reach us through the following channels:
          </p>
          <ul className="mt-3 space-y-2 text-gray-700">
            <li>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:bazarigo.official@gmail.com"
                className="text-[#FF0055] underline"
              >
                bazarigo.official@gmail.com
              </a>
            </li>
            <li>
              <strong>Phone:</strong>{" "}
              <a href="tel:+8801797454118" className="text-[#FF0055] underline">
                +880 1797-454-118
              </a>
            </li>
            <li>
              <strong>Address:</strong> Plot #04, Road #02, Mirpur-1, Dhaka,
              Bangladesh
            </li>
          </ul>
        </section>
      </Card>
    </div>
  );
}
