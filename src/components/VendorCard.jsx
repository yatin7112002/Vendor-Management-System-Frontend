import VendorCommentBox from './VendorCommentBox';
import '../styles/VendorCard.css';

function VendorCard({ vendor, productId, onCommentAdded }) {
  return (
    <div className="vendor-card">
      <div className="vendor-header">
        <h3>{vendor.name}</h3>
        <span className="vendor-id">ID: {vendor.id}</span>
      </div>

      <div className="vendor-details">
        <div className="detail-row">
          <span className="label">Product Name:</span>
          <span className="value">{vendor.ProductName || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="label">Ship Code:</span>
          <span className="value">{vendor.ShipCode || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="label">Ship Name:</span>
          <span className="value">{vendor.ShipName || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="label">Vendor Code:</span>
          <span className="value">{vendor.VendorCode || 'N/A'}</span>
        </div>

        {/* New fields */}

        <div className="detail-row">
          <span className="label">Region Code:</span>
          <span className="value">{vendor.regionCode || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="label">Region Name:</span>
          <span className="value">{vendor.RegionName || 'N/A'}</span>
        </div>
      </div>

      <div className="vendor-comments-section">
        <h4>Comments</h4>
        <VendorCommentBox
          vendor={vendor}
          productId={productId}
          onCommentAdded={onCommentAdded}
        />
      </div>
    </div>
  );
}

export default VendorCard;
