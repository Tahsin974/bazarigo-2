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
              The product is damaged, defective, or wrong at the time of
              delivery.
            </li>
            <li>The product is missing parts or accessories</li>
            <li>
              The product does not match the description or images shown on our
              website
            </li>
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
            <li>Products damaged due to customer misuse.</li>
            <li>Items without original packaging, tags, or accessories.</li>
            <li>Perishable goods such as food and beverages.</li>
            <li>
              Personal care items (underwear, cosmetics, grooming products) once
              opened.
            </li>
            <li>Customized or personalized products.</li>
          </ul>
        </section>

        {/* Return Process */}
        <section>
          <h2 className="text-xl font-semibold mb-2">4. Return Process</h2>
          <p className="mb-2">
            To initiate a return request, customers are required to submit the
            following details:
          </p>
          <ul className="list-disc ml-6 space-y-1 font-bold">
            <li>Order ID</li>
            <li>Product Name</li>
            <li>Reason for return</li>
            <li>
              Clear photos & an unboxing video (mandatory for damaged or
              defective items)
            </li>
          </ul>
          <p className="mt-2">
            All return requests will be reviewed by our team. Upon approval,
            customers will receive detailed instructions regarding the return
            shipping procedure.
          </p>
        </section>
        {/* Refund Process */}
        <section>
          <h2 className="text-xl font-semibold mb-2">5. Refund Process</h2>
          <p className="mb-2">
            Once we receive and inspect the returned item, you will be notified
            of the approval or rejection of your refund. If approved, refunds
            will be processed within <b>7 working days</b> using one of the
            following methods:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>
              <b>Mobile Banking:</b> bKash, Nagad, Rocket
            </li>
            <li>
              <b>Bank Transfer</b>
            </li>
          </ul>
          <p className="mt-2">
            For <b>Cash on Delivery (COD)</b> orders, refunds will be issued via{" "}
            <b>mobile banking or bank transfer</b>, as applicable. The refunded
            amount will be sent after successful inspection of the returned
            item.
          </p>
        </section>

        {/* Order Cancellation Policy */}
        <section>
          <h2 className="text-xl font-semibold mb-2">6. Order Cancellation</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>
              Orders can be canceled before dispatch by contacting customer
              support.
            </li>
            <li>Once the order is shipped, cancellation is not possible.</li>
          </ul>
        </section>

        {/* Non-Returnable Delivery Charges */}
        <section>
          <h2 className="text-xl font-semibold mb-2">
            7. Non-Returnable Delivery Charges
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>
              Shipping or delivery fees paid at the time of placing the order
              will not be refunded, even if the product is returned or the order
              is canceled after dispatch.
            </li>
            <li>
              In case of Cash on Delivery (COD) orders, if a customer refuses to
              accept the delivery, the delivery charge (if applicable) will
              still be considered non-returnable.
            </li>
            <li>
              If a refund is approved, the product price only will be refunded.
              Delivery, handling, or packaging charges will be excluded from the
              refund amount.
            </li>
            <li>
              Free delivery promotions apply only to successful deliveries. If
              an order is returned or canceled after dispatch, standard delivery
              charges may be deducted.
            </li>
          </ul>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
          <p>
            For return or refund inquiries, please contact us at:
            <span className="block mt-2">📧 info@bazarigo.com</span>
            <span>📞 +880 1797-454-118</span>
          </p>
        </section>
      </Card>
    </div>
  );
}
