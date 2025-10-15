import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import UseCart from "../../Utils/Hooks/UseCart";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import { Link } from "react-router";

export default function ThankYouPage() {
  const { cartItems } = UseCart();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-6 py-12">
      <div className="w-full max-w-3xl space-y-6">
        <div className="bg-white shadow rounded-2xl p-10 text-center">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800">
            Thank You for Your Order!
          </h1>
          <p className="mt-4 text-gray-600">
            Your order has been placed successfully. We’ll send you a
            confirmation email shortly.
          </p>
        </div>
        <OrderSummary items={cartItems} allowPromo={false} />
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-[#00C853] text-white px-8 py-3 rounded-full hover:bg-[#00B34A] transition">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/cart">
            <Button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-200 transition">
              View Cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
