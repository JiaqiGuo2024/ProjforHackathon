import React, { useState } from 'react';
import ReactStars from 'react-stars';
import { Star, MessageSquare, User } from 'lucide-react';
import { EmployerReview } from '../types/jobs';
import { useJobStore } from '../store/jobStore';
import { useUserStore } from '../store/userStore';
import { nanoid } from 'nanoid';

interface EmployerRatingProps {
  jobId: string;
}

export const EmployerRating: React.FC<EmployerRatingProps> = ({ jobId }) => {
  const { user } = useUserStore();
  const { getJobReviews, getAverageRating, addReview, saveToStorage } = useJobStore();
  
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const reviews = getJobReviews(jobId);
  const averageRating = getAverageRating(jobId);
  const userReview = reviews.find(r => r.reviewer === user?.id);

  const handleSubmitReview = () => {
    if (!user || newRating === 0) return;

    const review: EmployerReview = {
      id: nanoid(),
      job_id: jobId,
      reviewer: user.id,
      score: newRating,
      comment: newComment.trim(),
      anonymous: isAnonymous,
      created_at: new Date().toISOString()
    };

    addReview(review);
    saveToStorage();
    
    setNewRating(0);
    setNewComment('');
    setIsAnonymous(false);
    setShowForm(false);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.score as keyof typeof distribution]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Overall Rating */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
          </div>
          
          {averageRating > 0 && (
            <>
              <div className="flex items-center justify-center mb-2">
                <ReactStars
                  count={5}
                  value={averageRating}
                  size={24}
                  color2="#fbbf24"
                  edit={false}
                />
              </div>
              <p className="text-gray-600">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </>
          )}
        </div>

        {/* Rating Distribution */}
        {reviews.length > 0 && (
          <div className="mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-8">{star}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${reviews.length > 0 ? (distribution[star as keyof typeof distribution] / reviews.length) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {distribution[star as keyof typeof distribution]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Rating */}
      {user && !userReview && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              <Star className="h-5 w-5" />
              <span>Rate this employer</span>
            </button>
          ) : (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Rate this employer</h4>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Your rating:</span>
                <ReactStars
                  count={5}
                  value={newRating}
                  onChange={setNewRating}
                  size={24}
                  color2="#fbbf24"
                />
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience working with this employer (optional)..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Submit anonymously</span>
              </label>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSubmitReview}
                  disabled={newRating === 0}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User's Review */}
      {userReview && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-sm font-medium text-blue-900">Your review:</span>
            <ReactStars
              count={5}
              value={userReview.score}
              size={20}
              color2="#fbbf24"
              edit={false}
            />
          </div>
          {userReview.comment && (
            <p className="text-sm text-blue-800">{userReview.comment}</p>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Reviews</h4>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No reviews yet</p>
            <p className="text-sm mt-1">Be the first to review this employer!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews
              .filter(review => review.comment.trim().length > 0)
              .map(review => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium text-gray-900">
                          {review.anonymous ? 'Anonymous' : 'Reviewer'}
                        </span>
                        <ReactStars
                          count={5}
                          value={review.score}
                          size={16}
                          color2="#fbbf24"
                          edit={false}
                        />
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};