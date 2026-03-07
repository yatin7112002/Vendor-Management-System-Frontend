import { useState } from 'react';
import '../styles/VendorCommentBox.css';

function VendorCommentBox({ vendor, productId, onCommentAdded }) {
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddComment = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey && comment.trim()) {
      e.preventDefault();
      await submitComment();
    }
  };

  const submitComment = async () => {
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { apiService } = await import('../services/api');
      const response = await apiService.addCommentToVendor(vendor.id, productId, {
        text: comment,
        timestamp: new Date().toISOString(),
      });

      setComment('');
      setSuccess('Comment added successfully!');
      
      // Call callback to refresh comments if needed
      if (onCommentAdded) {
        onCommentAdded(response);
      }

      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message || 'Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="comment-box">
      <div className="comment-input-container">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleAddComment}
          placeholder="Add a comment... (Press Enter to submit, Shift+Enter for new line)"
          disabled={isLoading}
          className="comment-textarea"
          rows="2"
        />
        <button
          onClick={submitComment}
          disabled={isLoading || !comment.trim()}
          className="comment-button"
        >
          {isLoading ? 'Saving...' : 'Add Comment'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
}

export default VendorCommentBox;
