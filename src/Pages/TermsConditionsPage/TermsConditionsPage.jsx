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
        {/* Delivery Charges */}
        <section>
          <h2 className="text-xl font-semibold mb-2">
            6. Delivery Charge Policy
          </h2>
          <p>
            Delivery charges are calculated based on{" "}
            <span className="font-bold">
              location, product weight, and order value
            </span>
            . Charges are automatically applied at checkout.
          </p>

          <div className="my-4">
            <h2 className="text-xl font-semibold mb-2">
              💰 Base Delivery Charges
            </h2>
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">Zone</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Charge (From)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      Inside Area
                    </td>
                    <td className="border border-gray-300 px-4 py-2">৳70</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      Near Area
                    </td>
                    <td className="border border-gray-300 px-4 py-2">৳100</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      Outside Area
                    </td>
                    <td className="border border-gray-300 px-4 py-2">৳120</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      Remote Area
                    </td>
                    <td className="border border-gray-300 px-4 py-2">৳200</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-2">
              ⚖️ Weight-Based Charge
            </h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>Above 2 kg: ৳10 per additional kg</li>
            </ul>
            <p className="mt-2 font-medium">Example:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>3 kg = ৳10 extra</li>
              <li>5 kg = ৳30 extra</li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold mb-2">
            💵 Cash on Delivery (COD)
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>1% COD charge will be applicable</li>
          </ul>

          <h2 className="text-xl font-semibold mt-4 mb-2">🎁 Free Delivery</h2>
          <p>
            Free delivery applies if the order value meets the minimum free
            delivery amount (if applicable).
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
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
