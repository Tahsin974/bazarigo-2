import Swal from "sweetalert2";
import img1 from "../../assets/Instruction/Instraction 1.png";
import img2 from "../../assets/Instruction/Instraction 2.JPG";
import img3 from "../../assets/Instruction/Instraction 3.png";
import img4 from "../../assets/Instruction/Instraction 4.png";
import useAxiosSecure from "../../Utils/Hooks/useAxiosSecure";

export default function InstructionPage() {
  const axiosSecure = useAxiosSecure();
  const handleDownload = async () => {
    try {
      const response = await axiosSecure.get("/api/download-excel", {
        responseType: "blob", // Important: tells axios to handle binary data
      });

      // Create a link element and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Products.xlsx"); // Filename
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.message || "Something Went Wrong!!",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
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
                      *বিভাগ, উপবিভাগ ও উপবিভাগের আইটেম (Category, Subcategory &
                      Subcategory Item):*
                    </span>{" "}
                    সঠিক বিভাগ, উপবিভাগ এবং উপবিভাগের আইটেম নির্বাচন করুন।
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-[#FF0055] pl-4">
              ধাপ ২ ও ৩: পণ্যের বিস্তারিত বিবরণ ও ব্যাজ নির্বাচন
            </h2>

            <div className="md:flex md:space-x-6">
              <div className="md:w-1/2 mb-4 md:mb-0">
                <img
                  src={img2}
                  alt="পণ্যের বিস্তারিত বিবরণ ও ব্যাজ নির্বাচন"
                  className="rounded-lg w-full h-auto object-cover border border-gray-200"
                />
              </div>
              <div className="md:w-1/2 space-y-6">
                <div className="p-4 bg-[#f4f4f5] rounded-lg border border-gray-200">
                  <h3 className="text-xl font-medium mb-2 text-[#FF0055]">
                    ২. পণ্যের বিস্তারিত বিবরণ (Description)
                  </h3>
                  <div className="p-4 bg-[#f4f4f5] rounded-lg border border-gray-200">
                    <p className="text-gray-700">
                      পণ্যের কার্যকারিতা, বৈশিষ্ট্য এবং অন্যান্য প্রয়োজনীয়
                      তথ্য বিস্তারিতভাবে{" "}
                      <span className="font-bold">Description</span> বক্সে
                      লিখুন।
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      এখানে টেক্সট ফরম্যাটিং (Bold, Italic, Underline), তালিকা
                      (List), ফন্ট সাইজ ও রং ইত্যাদি যোগ করতে পারবেন।
                    </p>
                  </div>
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
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-[#FF0055] pl-4">
              ধাপ ৪ ও ৫: ছবি/ভিডিও আপলোড ও ভেরিয়েন্ট যোগ
            </h2>
            <div className="md:flex md:space-x-6">
              <div className="md:w-1/2 mb-4 md:mb-0">
                <img
                  src={img3}
                  alt="ছবি/ভিডিও আপলোড এবং ব্যাজ বিভাগ"
                  className="rounded-lg w-full h-auto object-cover border border-gray-200"
                />
                <img
                  src={img4}
                  alt="ছবি/ভিডিও আপলোড এবং ব্যাজ বিভাগ"
                  className="rounded-lg w-full h-auto object-cover border border-gray-200"
                />
              </div>
              <div className="md:w-1/2 space-y-16">
                <div className="p-4 bg-[#f4f4f5] rounded-lg border border-gray-200">
                  <h3 className="text-xl font-medium mb-2 text-[#FF0055]">
                    ৪. ছবি/ভিডিও আপলোড (Upload Image/Video)
                  </h3>
                  <p className="text-gray-700">
                    পণ্যের জন্য একটি আকর্ষণীয় ছবি/ভিডিও আপলোড করুন।
                  </p>
                  <ul className="text-sm text-gray-600 list-disc pl-5 mt-2">
                    <li>
                      *পদ্ধতি:* আপলোড এরিয়াতে ক্লিক করুন অথবা টেনে এনে ছবি/ভিডিও
                      ছাড়ুন।
                    </li>
                    <li>*ফরম্যাট:* PNG বা JPG ফরম্যাটের ছবি/MP4 ফরম্যাটের ভিডিও ব্যবহার করুন।</li>
                    <li>*সীমা:* প্রতি ছবির জন্য সর্বোচ্চ ১ মেগাবাইট।</li>
                  </ul>
                </div>

                <div className="p-4 bg-[#f4f4f5] rounded-lg border border-gray-200">
                  <h3 className="text-xl font-medium mb-2 text-[#FF0055]">
                    ৫. ভেরিয়েন্ট যোগ করা (Add Variants)
                  </h3>
                  <p className="text-gray-700">
                    পণ্যের বিভিন্ন প্রকারভেদ (যেমন: আকার, রং, উপাদান) যোগ করুন।
                  </p>
                  <ul className="text-sm text-gray-700 list-disc pl-5">
                    <li>
                      <span className="font-bold">ভেরিয়েন্ট তথ্য:</span> আকার
                      (Size), রং (Color), উপাদান (Material) এর জন্য প্রযোজ্য
                      মানগুলি লিখুন।
                    </li>
                    <li>
                      <span className="font-bold">মূল্য ও স্টক:</span> প্রতিটি
                      ভেরিয়েন্টের জন্য আলাদাভাবে নিয়মিত মূল্য, বিক্রয় মূল্য
                      এবং স্টক সংখ্যা উল্লেখ করুন।
                    </li>
                    <li>
                      <span className="font-bold">সংরক্ষণ:</span> সমস্ত তথ্য
                      পূরণ করার পর 'Add Variant' বোতামে ক্লিক করুন।
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-white border border-gray-300 rounded-md text-sm text-gray-600">
                    <p>
                      <span className="font-bold text-[#FF0055]">
                        বিশেষ দ্রষ্টব্য:
                      </span>{" "}
                      যদি পণ্যের কোনো ভেরিয়েন্ট না থাকে, তবে এই অংশটি খালি
                      রাখুন।
                    </p>
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
              <button className="px-6 py-3 bg-[#e92323] text-white font-semibold rounded-lg  transition duration-150">
                বন্ধ করুন (Close)
              </button>
              <button className="px-6 py-3 bg-[#00B34A] text-white font-semibold rounded-lg  transition duration-150">
                তৈরি করুন (Create)
              </button>
            </div>
          </section>
          <section className="text-center pt-4 border-t border-gray-200">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              বাল্ক আপলোডের জন্য টেম্পলেট ডাউনলোড করুন
            </p>
            <div className="space-x-4 flex justify-center">
              <a onClick={handleDownload}>
                <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg  transition duration-150">
                  ডাউনলোড
                </button>
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
