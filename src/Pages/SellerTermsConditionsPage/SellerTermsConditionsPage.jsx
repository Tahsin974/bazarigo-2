import { Card } from "@/components/ui/card";

export default function SellerTermsConditionsPage() {
  return (
    <div>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-[#FF0055] mb-6">
          Seller Terms & Conditions
        </h1>

        <Card className="p-6 bg-white shadow-md space-y-6">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p>
              Welcome to <span className="font-bold">Bazarigo</span>. By
              registering as a seller on our platform, you agree to comply with
              these terms and conditions. These terms govern your access and use
              of our seller services.
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-xl font-semibold mb-2">
              2. Account Registration
            </h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                Sellers must provide accurate personal and business information.
              </li>
              <li>
                Each seller is allowed only one account unless authorized
                otherwise.
              </li>
              <li>
                Account security, including passwords and login credentials, is
                the responsibility of the seller.
              </li>
            </ul>
          </section>

          {/* Product Listings */}
          <section>
            <h2 className="text-xl font-semibold mb-2">3. Product Listings</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                All products must be described accurately with correct images,
                pricing, and specifications.
              </li>
              <li>
                Prohibited items, including illegal, counterfeit, or restricted
                goods, are strictly forbidden.
              </li>
              <li>
                Bazarigo reserves the right to remove any product that violates
                our policies or laws.
              </li>
            </ul>
          </section>

          {/* Order Fulfillment */}
          <section>
            <h2 className="text-xl font-semibold mb-2">4. Order Fulfillment</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                Sellers must process orders promptly and provide tracking
                information when applicable.
              </li>
              <li>
                Delays or failures in fulfilling orders may lead to penalties or
                account suspension.
              </li>
              <li>
                Refunds and returns must be handled according to Bazarigo’s
                policies.
              </li>
            </ul>
          </section>

          {/* Fees & Payments */}
          <section>
            <h2 className="text-xl font-semibold mb-2">5. Fees & Payments</h2>
            <p>
              Sellers are subject to any fees, commissions, or charges as
              outlined in the seller agreement. Payments will be issued after
              order confirmation, deduction of fees, and verification.
            </p>
          </section>

          {/* Commission Structure */}
          {/* <section>
            <h2 className="text-xl font-semibold mb-2">
              6. Commission Structure
            </h2>
            <p>
              Bazarigo charges a commission on every product sold through the
              platform. Commission rates vary by product category and may be
              updated periodically. The current standard commission rates are as
              follows:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>
                <span className="font-semibold">Electronics:</span> 5% per sale
              </li>
              <li>
                <span className="font-semibold">Fashion & Apparel:</span> 10%
                per sale
              </li>
              <li>
                <span className="font-semibold">Home & Kitchen:</span> 8% per
                sale
              </li>
              <li>
                <span className="font-semibold">Beauty & Health:</span> 12% per
                sale
              </li>
              <li>
                <span className="font-semibold">Groceries:</span> 6% per sale
              </li>
              <li>
                <span className="font-semibold">Accessories & Jewelry:</span>{" "}
                15% per sale
              </li>
              <li>
                <span className="font-semibold">Sports & Outdoor:</span> 7% per
                sale
              </li>
            </ul>
            <p className="mt-2">
              Bazarigo reserves the right to modify commission rates with prior
              notice. Any new commission rates will apply to all future sales.
            </p>
          </section> */}
          <section>
            <h2 className="text-xl font-semibold mb-2">
              6. Commission Structure
            </h2>
            <p>
              Bazarigo charges a commission on every product sold through the
              platform. Commission rates vary by product category and are
              designed to balance profitability for sellers and the platform.
            </p>

            {/* Commission Rates Table */}
            <div className="overflow-x-auto mt-2">
              <table className="table text-center">
                <thead className="bg-gray-100 text-black">
                  <tr>
                    <th className="px-4 py-2 border">Category</th>
                    <th className="px-4 py-2 border">Commission Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2 border">Fashions</td>
                    <td className="px-4 py-2 border">10%</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 border">Electronics</td>
                    <td className="px-4 py-2 border">5%</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 border">Health & Beauty</td>
                    <td className="px-4 py-2 border">12%</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 border">Sports</td>
                    <td className="px-4 py-2 border">8%</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 border">Groceries</td>
                    <td className="px-4 py-2 border">3%</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 border">Home & Living</td>
                    <td className="px-4 py-2 border">7%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Seller Benefits & Rewards */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">
                Seller Benefits & Rewards
              </h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  New Seller Bonus: Enjoy 2% reduced commission for your first 3
                  months.
                </li>
                <li>
                  High Performance Reward: Sellers with monthly sales above
                  500,000 BDT get 1% commission rebate.
                </li>
                <li>
                  Promotional Support: Bazarigo promotes top sellers in
                  marketing campaigns.
                </li>
                <li>
                  Logistics Assistance: Certain logistic and return support
                  included in commission.
                </li>
              </ul>
            </div>

            {/* Motivational Message */}
            <div className="mt-4 bg-gray-50 p-4 rounded border-l-4 border-[#FF0055]">
              <p className="italic">
                We value every seller as part of the Bazarigo family. Together,
                let's create an ecosystem of trust, transparency, and mutual
                success. Join us today and grow your business with confidence.
              </p>
            </div>
          </section>

          {/* Shipping & Delivery */}
          <section>
            <h2 className="text-xl font-semibold mb-2">
              7. Shipping & Delivery
            </h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                Sellers are responsible for ensuring timely and secure delivery
                of products.
              </li>
              <li>
                Shipping methods must comply with local laws and platform
                requirements.
              </li>
              <li>
                Delays or damages in shipping must be reported and resolved
                promptly.
              </li>
            </ul>
          </section>

          {/* Returns & Refunds */}
          <section>
            <h2 className="text-xl font-semibold mb-2">8. Returns & Refunds</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                All returns must comply with Bazarigo’s Return & Refund Policy.
              </li>
              <li>
                Sellers must process approved refunds within the stipulated
                timeframe.
              </li>
              <li>
                Non-compliance may result in penalties or account suspension.
              </li>
            </ul>
          </section>

          {/* Performance & Compliance */}
          <section>
            <h2 className="text-xl font-semibold mb-2">
              9. Performance & Compliance
            </h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                Sellers must maintain high service quality, fast response times,
                and customer satisfaction.
              </li>
              <li>
                Failure to meet performance metrics may lead to warnings,
                account suspension, or removal.
              </li>
              <li>
                Sellers must comply with all local laws, taxes, and platform
                regulations.
              </li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-xl font-semibold mb-2">10. Termination</h2>
            <p>
              Bazarigo reserves the right to suspend or terminate seller
              accounts for violations of these terms, fraudulent activity, or
              breach of policies.
            </p>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-xl font-semibold mb-2">11. Liability</h2>
            <p>
              Bazarigo is not liable for losses or damages incurred due to
              product issues, shipping delays, or disputes between sellers and
              buyers. Sellers are fully responsible for their listings and
              fulfillment obligations.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
            <p>
              For questions regarding these Seller Terms & Conditions:
              <span className="block mt-2">📧 bazarigo.official@gmail.com</span>
              <span className="block">📞 +880 1797-454-118</span>
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}
