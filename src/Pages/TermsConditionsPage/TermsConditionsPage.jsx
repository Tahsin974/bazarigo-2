import { Card } from "@/components/ui/card";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-100  p-6">
      <h1 className="text-3xl font-bold text-[#FF0055] mb-6">
        Terms & Conditions
      </h1>

      <Card className="p-6 bg-white     shadow-md space-y-6">
        {/* Introduction */}
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p className="   ">
            Welcome to <span className="font-bold">Bazarigo</span>. By accessing
            our website and using our services, you agree to abide by the
            following terms and conditions. Please read them carefully before
            making any purchases.
          </p>
        </section>

        {/* User Responsibilities */}
        <section>
          <h2 className="text-xl font-semibold mb-2">
            2. User Responsibilities
          </h2>
          <ul className="list-disc ml-6     space-y-1">
            <li>You must provide accurate personal and payment information.</li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account.
            </li>
            <li>
              Any misuse of our platform will result in account suspension.
            </li>
          </ul>
        </section>

        {/* Payments */}
        <section>
          <h2 className="text-xl font-semibold mb-2">3. Payments</h2>
          <p className="   ">
            All transactions must be completed using authorized payment methods.
            We reserve the right to cancel any order if fraudulent activity is
            suspected.
          </p>
        </section>

        {/* Returns & Refunds */}
        <section>
          <h2 className="text-xl font-semibold mb-2">4. Returns & Refunds</h2>
          <p className="   ">
            Returns and refunds are subject to our{" "}
            <span className="font-bold">Return & Refund Policy</span>. Products
            must be returned within 7 days of delivery in their original
            condition.
          </p>
        </section>

        {/* Privacy Policy */}
        <section>
          <h2 className="text-xl font-semibold mb-2">5. Privacy Policy</h2>
          <p className="   ">
            We value your privacy and ensure that your personal data is
            protected. Please refer to our Privacy Policy for detailed
            information on data collection and usage.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
          <p className="   ">
            If you have any questions regarding these Terms & Conditions, please
            contact us at:
            <span className="block mt-2">📧 info@bazarigo.com</span>
            <span>📞 +880 1797-454-118</span>
          </p>
        </section>
      </Card>
    </div>
  );
}
