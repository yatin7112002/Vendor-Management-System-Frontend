import { useState } from 'react';
import VendorCommentBox from './VendorCommentBox';
import '../styles/VendorDetailsModal.css';

function VendorDetailsModal({ vendorData, productId, shipCode, vendorCode, onClose }) {
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  if (!vendorData) {
    return null;
  }

  return (
    <div className="vendor-modal-overlay" onClick={onClose}>
      <div className="vendor-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="vendor-modal-header">
          <h2>Vendor Details</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
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
            {isCommentOpen ? 'Hide Comments' : 'Show Comments'}
          </button>

          {isCommentOpen && (
            <div className="comments-container">
              <VendorCommentBox
                productId={productId}
                shipCode={shipCode}
                vendorCode={vendorCode}
                commentName='quality_issue'
                onCommentAdded={() => {
                  // Optional: refresh comments or show success message
                }}
              />
              <VendorCommentBox
                productId={productId}
                shipCode={shipCode}
                vendorCode={vendorCode}
                commentName='general'
                onCommentAdded={() => {
                  // Optional: refresh comments or show success message
                }}
              />
              <VendorCommentBox
                productId={productId}
                shipCode={shipCode}
                vendorCode={vendorCode}
                commentName='summer_season'
                onCommentAdded={() => {
                  // Optional: refresh comments or show success message
                }}
              />
              <VendorCommentBox
                productId={productId}
                shipCode={shipCode}
                vendorCode={vendorCode}
                commentName='winter_season'
                onCommentAdded={() => {
                  // Optional: refresh comments or show success message
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorDetailsModal;
