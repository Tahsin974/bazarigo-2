import { useState } from "react";
import { RatingStars } from "./RatingStars";
// CustomerReviews.jsx content will be placed here
export default function CustomerReviews({ reviews = [] }) {
  const [allReviews, setAllReviews] = useState(reviews);
  const [newReview, setNewReview] = useState({
    name: "",
    comment: "",
    rating: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment || newReview.rating === 0) return;
    setAllReviews([
      { ...newReview, date: new Date().toISOString() },
      ...allReviews,
    ]);
    setNewReview({ name: "", comment: "", rating: 0 });
  };

  return (
    <section className="container mx-auto px-6 py-12 border-t border-gray-300">
      <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
      <form
        onSubmit={handleSubmit}
        className="mb-8 p-6 bg-gray-50 rounded-lg  space-y-4 shadow-md"
      >
        <input
          type="text"
          placeholder="Your Name"
          value={newReview.name}
          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
          className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055] transition-all duration-300 focus:shadow-lg focus:scale-[1.02]"
        />
        <textarea
          placeholder="Write your review..."
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055] transition-all duration-300 focus:shadow-lg focus:scale-[1.02]"
        />
        <div className="flex items-center gap-2">
          <span className="font-medium">Your Rating:</span>
          <RatingStars
            rating={newReview.rating}
            onRate={(val) => setNewReview({ ...newReview, rating: val })}
          />
        </div>
        <button
          type="submit"
          className="bg-[#FF0055] text-white px-6 py-3 rounded-lg shadow hover:bg-[#e6004e]"
        >
          Submit Review
        </button>
      </form>

      {allReviews.length > 0 ? (
        <div className="space-y-6">
          {allReviews.map((review, i) => (
            <div key={i} className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{review.name}</span>
                <RatingStars rating={review.rating} />
              </div>
              <p className="text-gray-700 text-sm mb-1">{review.comment}</p>
              {review.date && (
                <span className="text-xs text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      )}
    </section>
  );
}
