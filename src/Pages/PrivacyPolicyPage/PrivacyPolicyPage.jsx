import { Card } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-100  p-6">
      <h1 className="text-3xl font-bold text-[#FF0055] mb-6">Privacy Policy</h1>

      <Card className="p-6 bg-white  shadow-md space-y-6 rounded-md">
        {/* Introduction */}
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p className=" ">
            At <span className="font-bold">Bazarigo</span>, your privacy is our
            top priority. This Privacy Policy explains how we collect, use, and
            protect your personal information.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-xl font-semibold mb-2">
            2. Information We Collect
          </h2>
          <ul className="list-disc ml-6    space-y-1">
            <li>Personal details (name, email, phone, address).</li>
            <li>
              Payment information (processed securely via payment providers).
            </li>
            <li>Browsing and shopping activity on our platform.</li>
          </ul>
        </section>

        {/* How We Use Data */}
        <section>
          <h2 className="text-xl font-semibold mb-2">
            3. How We Use Your Data
          </h2>
          <p className="  ">
            We use your information to process orders, improve our services,
            personalize your shopping experience, and send updates about
            promotions.
          </p>
        </section>

        {/* Data Protection */}
        <section>
          <h2 className="text-xl font-semibold mb-2">4. Data Protection</h2>
          <p className="  ">
            We implement strong security measures to protect your personal data.
            However, please note that no system is 100% secure.
          </p>
        </section>

        {/* Sharing Policy */}
        <section>
          <h2 className="text-xl font-semibold mb-2">5. Sharing Policy</h2>
          <p className="  ">
            We do not sell or trade your personal data. Information may only be
            shared with trusted partners (e.g., delivery & payment providers).
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-xl font-semibold mb-2">6. Cookies</h2>
          <p className="  ">
            We use cookies to enhance your browsing experience. You can disable
            cookies in your browser settings, but some features may not work
            properly.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
          <p className="  ">
            For any privacy-related queries, please contact us at:
            <span className="block mt-2">📧 bazarigo.official@gmail.com</span>
            <span>📞 +880 1797-454-118</span>
          </p>
        </section>
      </Card>
    </div>
  );
}
