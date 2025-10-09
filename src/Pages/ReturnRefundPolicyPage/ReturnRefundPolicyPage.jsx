import { Card } from "@/components/ui/card";

export default function ReturnRefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-[#FF0055] mb-6">
        Return & Refund Policy
      </h1>

      <Card className="p-6 bg-white shadow-md space-y-6 rounded-md">
        {/* Introduction */}
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            At <span className="font-bold">Bazarigo</span>, we strive to ensure
            that our customers are completely satisfied with their purchases.
            This Return & Refund Policy outlines the conditions under which
            returns and refunds are accepted.
          </p>
        </section>

        {/* Return Eligibility */}
        <section>
          <h2 className="text-xl font-semibold mb-2">2. Return Eligibility</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Items must be returned within 7 days of delivery.</li>
            <li>
              Products must be unused, undamaged, and in their original
              packaging.
            </li>
            <li>
              Proof of purchase (invoice or order confirmation) is required.
            </li>
          </ul>
        </section>

        {/* Non-Returnable Items */}
        <section>
          <h2 className="text-xl font-semibold mb-2">
            3. Non-Returnable Items
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Perishable goods such as food and beverages.</li>
            <li>Personal care products and hygiene items.</li>
            <li>Customized or personalized products.</li>
          </ul>
        </section>

        {/* Refund Process */}
        <section>
          <h2 className="text-xl font-semibold mb-2">4. Refund Process</h2>
          <p>
            Once your return is received and inspected, we will notify you of
            the approval or rejection of your refund. If approved, refunds will
            be processed to your original payment method within 7–10 business
            days.
          </p>
        </section>

        {/* Exchange Policy */}
        <section>
          <h2 className="text-xl font-semibold mb-2">5. Exchange Policy</h2>
          <p>
            We only replace items if they are defective or damaged. If you need
            to exchange it for the same item, please contact our support team.
          </p>
        </section>

        {/* Shipping Costs */}
        <section>
          <h2 className="text-xl font-semibold mb-2">6. Shipping Costs</h2>
          <p>
            Customers are responsible for paying their own shipping costs for
            returning items. Shipping costs are non-refundable.
          </p>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
          <p>
            For return or refund inquiries, please contact us at:
            <span className="block mt-2">📧 bazarigo.official@gmail.com</span>
            <span>📞 +880 1797-454-118</span>
          </p>
        </section>
      </Card>
    </div>
  );
}
