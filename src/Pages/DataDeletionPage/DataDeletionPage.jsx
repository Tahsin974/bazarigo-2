import { Card } from "@/components/ui/card";

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-[#FF0055] mb-6">
        User Data Deletion Request
      </h1>

      <Card className="p-6 bg-white shadow-md space-y-6 rounded-md">
        {/* Introduction */}
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            We respect your privacy and your right to manage your personal data.
            This page explains how you can request deletion of your user data
            from <span className="font-bold">Bazarigo</span>.
          </p>
        </section>

        {/* Step 1 */}
        <section>
          <h2 className="text-xl font-semibold mb-2">2. Send an Email</h2>
          <p>Please send an email request to our official contact address:</p>
          <p className="font-bold mt-1">bazarigo.official@gmail.com</p>
        </section>

        {/* Step 2 */}
        <section>
          <h2 className="text-xl font-semibold mb-2">
            3. Use the Subject Line
          </h2>
          <p>
            The email subject must be:{" "}
            <span className="font-bold">Data Deletion Request</span>
          </p>
        </section>

        {/* Step 3 */}
        <section>
          <h2 className="text-xl font-semibold mb-2">4. Confirmation</h2>
          <p>
            Once we receive your request, our team will process it within 7
            days. You will be notified via email when your data has been
            successfully deleted.
          </p>
        </section>

        <section>
          <p>Thank you.</p>
        </section>
      </Card>
    </div>
  );
}
