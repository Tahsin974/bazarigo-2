import { Button } from "@/components/ui/button";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-[#FF0055] mb-6">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white     p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
          <form className="space-y-4">
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2  focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
              type="text"
              placeholder="Your Name"
              required
            />
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2  focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
              type="email"
              placeholder="Your Email"
              required
            />
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2  focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
              placeholder="Your Message"
              rows={5}
              required
            />
            <Button
              type="submit"
              className="  bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] w-full px-3 py-2 inline-flex items-center gap-2   text-white  border-none  rounded shadow sm:text-base text-xs btn"
            >
              Send Message
            </Button>
          </form>
        </div>

        {/* Contact Info + Map */}
        <div className="space-y-4">
          <div className="bg-white     p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Our Information</h2>
            <p>
              <strong>Email:</strong> bazarigo.official@gmail.com
            </p>
            <p>
              <strong>Phone:</strong> +880 1797-454-118
            </p>
            <p>
              <strong>Address:</strong> Plot #04, Road #02, Mirpur-1, Dhaka,
              Bangladesh
            </p>
          </div>

          <div className="rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.845625437685!2d90.3913!3d23.7509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b894cf0c6b6d%3A0xf1b8b1e3fdf3d9d7!2sDhaka!5e0!3m2!1sen!2sbd!4v1234567890"
              width="100%"
              height="250"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
