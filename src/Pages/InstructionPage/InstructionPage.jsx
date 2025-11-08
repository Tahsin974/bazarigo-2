import img1 from "../../assets/Instruction/instruction1.JPG";
import img2 from "../../assets/Instruction/instruction2.JPG";
export default function InstructionPage() {
  return (
    <div className="p-4 md:p-8 bg-[#f7f7f7] font-sans">
      <div className="container mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
        <header className="p-6 bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white">
          <h1 className="text-3xl font-bold mb-1">
            নতুন পণ্য যোগ করার নির্দেশিকা
          </h1>
          <p className="text-sm opacity-90">
            সহজে আপনার নতুন পণ্য তালিকাভুক্ত করার জন্য ধাপে ধাপে নির্দেশাবলী।
          </p>
        </header>

        <main className="p-6 space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-[#FF0055] pl-4">
              ধাপ ১: মৌলিক তথ্য পূরণ
            </h2>
            <div className="md:flex md:space-x-6">
              <div className="md:w-1/2 mb-4 md:mb-0">
                <img
                  src={img1}
                  alt="পণ্যের মৌলিক তথ্যের ফর্ম"
                  className="rounded-lg w-full h-auto object-cover border border-gray-200"
                />
              </div>
              <div className="md:w-1/2">
                <ul className="space-y-3 text-gray-700 list-disc pl-5">
                  <li>
                    <span className="font-bold">
                      *পণ্যের নাম (Product Name):*
                    </span>{" "}
                    পণ্যের সম্পূর্ণ নাম লিখুন।
                  </li>
                  <li>
                    <span className="font-bold">*ব্র্যান্ড (Brand):*</span>{" "}
                    পণ্যের ব্র্যান্ডের নাম উল্লেখ করুন।
                  </li>
                  <li>
                    <span className="font-bold">
                      *নিয়মিত মূল্য (Regular Price):*
                    </span>{" "}
                    পণ্যের আসল/এমআরপি মূল্য (৳-এ) লিখুন।
                  </li>
                  <li>
                    <span className="font-bold">
                      *বিক্রয় মূল্য (Sale Price):*
                    </span>{" "}
                    যে মূল্যে পণ্যটি বিক্রি করতে চান (৳-এ) তা লিখুন।
                  </li>
                  <li>
                    <span className="font-bold">*ছাড় (Discount %):*</span>{" "}
                    শতাংশে কত ছাড় দেওয়া হচ্ছে, তা লিখুন।
                  </li>
                  <li>
                    <span className="font-bold">*রেটিং (Rating 0-5):*</span>{" "}
                    পণ্যের প্রাথমিক রেটিং দিন।
                  </li>
                  <li>
                    <span className="font-bold">
                      *বিভাগ ও উপবিভাগ (Category & Subcategory):*
                    </span>{" "}
                    সঠিক বিভাগ এবং উপবিভাগ নির্বাচন করুন।
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-[#FF0055] pl-4">
              ধাপ ২: পণ্যের বিস্তারিত বিবরণ
            </h2>
            <div className="p-4 bg-[#f4f4f5] rounded-lg border border-gray-200">
              <p className="text-gray-700">
                পণ্যের কার্যকারিতা, বৈশিষ্ট্য এবং অন্যান্য প্রয়োজনীয় তথ্য
                বিস্তারিতভাবে <span className="font-bold">Description</span>{" "}
                বক্সে লিখুন।
              </p>
              <p className="mt-2 text-sm text-gray-600">
                এখানে টেক্সট ফরম্যাটিং (Bold, Italic, Underline), তালিকা (List),
                ফন্ট সাইজ ও রং ইত্যাদি যোগ করতে পারবেন।
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-[#FF0055] pl-4">
              ধাপ ৩ ও ৪: ছবি আপলোড ও ব্যাজ নির্বাচন
            </h2>
            <div className="md:flex md:space-x-6">
              <div className="md:w-1/2 mb-4 md:mb-0">
                <img
                  src={img2}
                  alt="ছবি আপলোড এবং ব্যাজ বিভাগ"
                  className="rounded-lg w-full h-auto object-cover border border-gray-200"
                />
              </div>
              <div className="md:w-1/2 space-y-6">
                <div className="p-4 bg-[#f4f4f5] rounded-lg border border-gray-200">
                  <h3 className="text-xl font-medium mb-2 text-[#FF0055]">
                    ৩. ছবি আপলোড (Upload Image)
                  </h3>
                  <p className="text-gray-700">
                    পণ্যের জন্য একটি আকর্ষণীয় ছবি আপলোড করুন।
                  </p>
                  <ul className="text-sm text-gray-600 list-disc pl-5 mt-2">
                    <li>
                      *পদ্ধতি:* আপলোড এরিয়াতে ক্লিক করুন অথবা টেনে এনে ছবি
                      ছাড়ুন।
                    </li>
                    <li>*ফরম্যাট:* PNG বা JPG ফরম্যাটের ছবি ব্যবহার করুন।</li>
                    <li>*সীমা:* প্রতি ছবির জন্য সর্বোচ্চ ১ মেগাবাইট।</li>
                  </ul>
                </div>

                <div className="p-4 bg-[#f4f4f5] rounded-lg border border-gray-200">
                  <h3 className="text-xl font-medium mb-2 text-[#FF0055]">
                    ৪. ব্যাজ নির্বাচন (Badges)
                  </h3>
                  <p className="text-gray-700">
                    পণ্যের গুরুত্ব অনুযায়ী এক বা একাধিক ব্যাজ নির্বাচন করুন।
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-2">
                    <span>
                      <span className="font-semibold">☐ Best Seller</span>{" "}
                      (সবচেয়ে বেশি বিক্রীত)
                    </span>
                    <span>
                      <span className="font-semibold">☐ Hot</span> (জনপ্রিয়তা)
                    </span>
                    <span>
                      <span className="font-semibold">☐ Trending</span>{" "}
                      (ট্রেন্ডিং)
                    </span>
                    <span>
                      <span className="font-semibold">☐ Limited Stock</span>{" "}
                      (সীমিত স্টক)
                    </span>
                    <span>
                      <span className="font-semibold">☐ Flash Sale</span>{" "}
                      (ফ্ল্যাশ সেল)
                    </span>
                    <span>
                      <span className="font-semibold">☑ New</span> (নতুন পণ্য)
                    </span>
                    <span>
                      <span className="font-semibold">☐ Exclusive</span>{" "}
                      (একচেটিয়া)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="text-center pt-4 border-t border-gray-200">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              সব তথ্য সঠিকভাবে পূরণ করার পর:
            </p>
            <div className="space-x-4">
              <button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg  transition duration-150">
                বন্ধ করুন (Close)
              </button>
              <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg  transition duration-150">
                তৈরি করুন (Create)
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
