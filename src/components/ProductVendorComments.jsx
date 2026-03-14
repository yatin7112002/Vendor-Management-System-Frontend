import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import VendorCommentBox from './VendorCommentBox';
import '../styles/ProductVendorComments.css';

function ProductVendorComments() {
  const [productId, setProductId] = useState('');
  const [productDetails, setProductDetails] = useState(null);
  const [shipCodes, setShipCodes] = useState([]);
  const [expandedShipCode, setExpandedShipCode] = useState(null);
  const [vendorCodesByShipCode, setVendorCodesByShipCode] = useState({});
  const [selectedVendorCode, setSelectedVendorCode] = useState({});
  
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [isLoadingShipCodes, setIsLoadingShipCodes] = useState(false);
  const [isLoadingVendorCodes, setIsLoadingVendorCodes] = useState({});
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!productId.trim()) {
      setError('Please enter a Product ID');
      return;
    }

    setIsLoadingProduct(true);
    setIsLoadingShipCodes(true);
    setError('');
    setSearched(true);
    setProductDetails(null);
    setShipCodes([]);
    setExpandedShipCode(null);
    setVendorCodesByShipCode({});

    try {
      // Fetch product details
      const details = await apiService.getProductDetails(productId);
      setProductDetails(details);

      // Fetch ship codes
      const codes = await apiService.getShipCodes(productId);
      setShipCodes(Array.isArray(codes) ? codes : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch product data');
      setProductDetails(null);
      setShipCodes([]);
    } finally {
      setIsLoadingProduct(false);
      setIsLoadingShipCodes(false);
    }
  };

  const handleShipCodeExpand = async (shipCode) => {
    if (expandedShipCode === shipCode) {
      setExpandedShipCode(null);
      return;
    }

    setExpandedShipCode(shipCode);
    
    // Fetch vendor codes if not already loaded
    if (!vendorCodesByShipCode[shipCode]) {
      setIsLoadingVendorCodes(prev => ({ ...prev, [shipCode]: true }));
      try {
        const codes = await apiService.getVendorCodesByShipCode(productId, shipCode);
        setVendorCodesByShipCode(prev => ({
          ...prev,
          [shipCode]: Array.isArray(codes) ? codes : []
        }));
      } catch (err) {
        console.error('Error fetching vendor codes:', err);
        setVendorCodesByShipCode(prev => ({
          ...prev,
          [shipCode]: []
        }));
      } finally {
        setIsLoadingVendorCodes(prev => ({ ...prev, [shipCode]: false }));
      }
    }
  };

  const handleVendorCodeSelect = (shipCode, vendorCode) => {
    setSelectedVendorCode(prev => ({
      ...prev,
      [shipCode]: vendorCode
    }));
  };

  const handleCommentAdded = () => {
    // Reset vendor code selection after comment is added
    setSelectedVendorCode(prev => ({
      ...prev,
      [expandedShipCode]: null
    }));
    // Optionally show a success message or refresh
  };

  const handleClearSearch = () => {
    setProductId('');
    setProductDetails(null);
    setShipCodes([]);
    setExpandedShipCode(null);
    setVendorCodesByShipCode({});
    setSelectedVendorCode({});
    setError('');
    setSearched(false);
  };

  return (
    <div className="product-vendor-comments-container">
      {/* Header */}
      <div className="header-section">
        <h1>Vendor Management System</h1>
      </div>

      {/* Search Box - Compact */}
      <form onSubmit={handleSearch} className="search-form-compact">
        <div className="input-group-compact">
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter Product ID (e.g., PROD-001)"
            className="product-id-input-compact"
            disabled={isLoadingProduct}
          />
          <button
            type="submit"
            disabled={isLoadingProduct || !productId.trim()}
            className="search-button-compact"
          >
            {isLoadingProduct ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && <div className="error-banner">{error}</div>}

      {/* Product Details - Compact */}
      {searched && productDetails && (
        <div className="product-details-section">
          <div className="product-details-row">
            <div className="detail-item">
              <label>Product Name:</label>
              <span>{productDetails.ProductName || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Category:</label>
              <span>{productDetails.Category || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Department:</label>
              <span>{productDetails.Department || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Type:</label>
              <span>{productDetails.ProductTypeName || 'N/A'}</span>
            </div>
          </div>
          <button className="clear-search-button" onClick={handleClearSearch}>
            Clear Search
          </button>
        </div>
      )}

      {/* Ship Codes as Expandable Cards */}
      {searched && shipCodes.length > 0 && (
        <div className="ship-codes-section">
          <h3>Ship Codes</h3>
          <div className="ship-codes-list">
            {shipCodes.map((shipCode) => (
              <div key={shipCode} className="ship-code-card">
                <div 
                  className={`ship-code-header ${expandedShipCode === shipCode ? 'expanded' : ''}`}
                  onClick={() => handleShipCodeExpand(shipCode)}
                >
                  <div className="ship-code-title">
                    <span className="ship-code-icon">
                      {expandedShipCode === shipCode ? '▼' : '▶'}
                    </span>
                    <span className="ship-code-name">{shipCode}</span>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedShipCode === shipCode && (
                  <div className="ship-code-content">
                    {isLoadingVendorCodes[shipCode] ? (
                      <p className="loading-text">Loading vendor codes...</p>
                    ) : (
                      <>
                        {/* Vendor Code Filter */}
                        <div className="vendor-code-filter">
                          <label>Select Vendor Code:</label>
                          <select
                            value={selectedVendorCode[shipCode] || ''}
                            onChange={(e) => handleVendorCodeSelect(shipCode, e.target.value)}
                            className="vendor-code-select"
                          >
                            <option value="">-- Choose a Vendor Code --</option>
                            {vendorCodesByShipCode[shipCode] && vendorCodesByShipCode[shipCode].length > 0 ? (
                              vendorCodesByShipCode[shipCode].map((vendorCode) => (
                                <option key={vendorCode} value={vendorCode}>
                                  {vendorCode}
                                </option>
                              ))
                            ) : (
                              <option disabled>No vendor codes available</option>
                            )}
                          </select>
                        </div>

                        {/* Comment Box for Selected Vendor Code */}
                        {selectedVendorCode[shipCode] && (
                          <div className="comment-section">
                            <VendorCommentBox
                              productId={productId}
                              shipCode={shipCode}
                              vendorCode={selectedVendorCode[shipCode]}
                              onCommentAdded={handleCommentAdded}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {searched && shipCodes.length === 0 && !error && (
        <div className="no-results-message">
          <p>No ship codes found for this Product ID.</p>
        </div>
      )}
    </div>
  );
}

export default ProductVendorComments;
