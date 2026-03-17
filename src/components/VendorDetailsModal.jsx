import { useState, useEffect } from "react";
// import VendorCommentBox from "./VendorCommentBox";
import "../styles/VendorDetailsModal.css";

function VendorDetailsModal({
  vendorData,
  productId,
  shipCode,
  vendorCode,
  onClose,
}) {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [qualityIssueComment, setQualityIssueComment] = useState("");
  const [generalComment, setGeneralComment] = useState("");
  const [summerSeasonComment, setSummerSeasonComment] = useState("");
  const [winterSeasonComment, setWinterSeasonComment] = useState("");

  useEffect(() => {
    const fetchExistingComments = async () => {
      try {
        // Fetch existing comments for this vendor (if needed)
        const existingComments = await apiService.getCommentsByVendorId(
          vendorData.VendorCode,
          vendorData.ShipCode,
          vendorData.ProductCode
        );

        // Set the fetched comments to their respective state variables
        setQualityIssueComment(existingComments.qualityIssueComment || "");
        setGeneralComment(existingComments.generalComment || "");
        setSummerSeasonComment(existingComments.summerSeasonComment || "");
        setWinterSeasonComment(existingComments.winterSeasonComment || "");
      } catch (err) {
        setError(err.message || "Failed to fetch existing comments");
      }
    };

    if (vendorData) {
      fetchExistingComments();
    }
  }, [vendorData, productId]);

  if (!vendorData) {
    return null;
  }
  const submitComment = async () => {
    // if (!comment.trim()) {
    //   setError("Comment cannot be empty");
    //   return;
    // }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiService.addCommentToVendor(
        vendorData,
        {
            qualityIssueComment,
            generalComment,
            summerSeasonComment,
            winterSeasonComment,
            timestamp: new Date().toISOString()
        }
      );

      setComment("");
      setSuccess("Comment added successfully!");

      // Call callback to refresh UI
      if (onCommentAdded) {
        onCommentAdded(response);
      }

      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.message || "Failed to add comment");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="vendor-modal-overlay" onClick={onClose}>
      <div
        className="vendor-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="vendor-modal-header">
          <h2>Vendor Details</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Vendor Data Grid - Horizontal Layout */}
        <div className="vendor-details-grid">
          <div className="detail-row">
            <div className="detail-cell">
              <label>Product Code:</label>
              <span>{vendorData.ProductCode}</span>
            </div>
            <div className="detail-cell">
              <label>Product Name:</label>
              <span>{vendorData.ProductName}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-cell">
              <label>Ship Code:</label>
              <span>{vendorData.ShipCode}</span>
            </div>
            <div className="detail-cell">
              <label>Ship Name:</label>
              <span>{vendorData.ShipName}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-cell">
              <label>Vendor Code:</label>
              <span>{vendorData.VendorCode}</span>
            </div>
            <div className="detail-cell">
              <label>Vendor Name:</label>
              <span>{vendorData.VendorName}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-cell">
              <label>Region Code:</label>
              <span>{vendorData.RegionCode}</span>
            </div>
            <div className="detail-cell">
              <label>Region Name:</label>
              <span>{vendorData.RegionName}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="vendor-modal-comments">
          <button
            className="toggle-comments-btn"
            onClick={() => setIsCommentOpen(!isCommentOpen)}
          >
            {isCommentOpen ? "Hide Comments" : "Show Comments"}
          </button>

          {isCommentOpen && (
            <div className="comments-container">
              <textarea
                value={qualityIssueComment}
                onChange={(e) => setQualityIssueComment(e.target.value)}
                placeholder="Quality Issue Comment..."
                disabled={isLoading}
                className="comment-textarea"
              />
              <textarea
                value={generalComment}
                onChange={(e) => setGeneralComment(e.target.value)}
                placeholder="General Comment..."
                disabled={isLoading}
                className="comment-textarea"
              />
              <textarea
                value={summerSeasonComment}
                onChange={(e) => setSummerSeasonComment(e.target.value)}
                placeholder="Summer Season Comment..."
                disabled={isLoading}
                className="comment-textarea"
              />
              <textarea
                value={winterSeasonComment}
                onChange={(e) => setWinterSeasonComment(e.target.value)}
                placeholder="Winter Season Comment..."
                disabled={isLoading}
                className="comment-textarea"
              />
              <button
                onClick={submitComment}
                disabled={isLoading}
                className="comment-button"
              >
                {isLoading ? "Saving..." : "Submit Comment"}
              </button>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorDetailsModal;
