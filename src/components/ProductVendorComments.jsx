import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import VendorDetailsModal from './VendorDetailsModal';
import '../styles/ProductVendorComments.css';

function ProductVendorComments() {
  const [productId, setProductId] = useState('');
  const [productDetails, setProductDetails] = useState(null);
  const [allVendorData, setAllVendorData] = useState([]);
  const [shipCodes, setShipCodes] = useState([]);
  const [expandedShipCode, setExpandedShipCode] = useState(null);
  const [vendorCodesByShipCode, setVendorCodesByShipCode] = useState({});
  const [selectedVendorCode, setSelectedVendorCode] = useState({});
  const [selectedVendorData, setSelectedVendorData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
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
    setAllVendorData([]);

    try {
      // Fetch product details
      const details = await apiService.getProductDetails(productId);
      setProductDetails(details);

      // Fetch all vendor data
      const vendorData = await apiService.getVendorDataByProductId(productId);
      setAllVendorData(Array.isArray(vendorData) ? vendorData : []);

      // Extract unique ship codes
      const codes = new Set();
      if (Array.isArray(vendorData)) {
        vendorData.forEach(item => {
          if (item.ShipCode) codes.add(item.ShipCode);
        });
      }
      setShipCodes(Array.from(codes).sort());
    } catch (err) {
      setError(err.message || 'Failed to fetch product data');
      setProductDetails(null);
      setShipCodes([]);
      setAllVendorData([]);
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
    
    // Filter vendor codes for this ship code from allVendorData
    if (!vendorCodesByShipCode[shipCode]) {
      setIsLoadingVendorCodes(prev => ({ ...prev, [shipCode]: true }));
      try {
        // Get unique vendor codes for this ship code
        const vendorCodesForShip = new Set();
        allVendorData.forEach(item => {
          if (item.ShipCode === shipCode && item.VendorCode) {
            vendorCodesForShip.add(item.VendorCode);
          }
        });
        
        setVendorCodesByShipCode(prev => ({
          ...prev,
          [shipCode]: Array.from(vendorCodesForShip).sort()
        }));
      } catch (err) {
        console.error('Error processing vendor codes:', err);
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
    // Find the vendor data matching this ship code and vendor code
    const vendorData = allVendorData.find(
      item => item.ShipCode === shipCode && item.VendorCode === vendorCode
    );
    
    setSelectedVendorCode(prev => ({
      ...prev,
      [shipCode]: vendorCode
    }));
    
    if (vendorData) {
      setSelectedVendorData(vendorData);
      setShowModal(true);
    }
  };

  const handleClearSearch = () => {
    setProductId('');
    setProductDetails(null);
    setShipCodes([]);
    setExpandedShipCode(null);
    setVendorCodesByShipCode({});
    setSelectedVendorCode({});
    setSelectedVendorData(null);
    setShowModal(false);
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

      {/* Product Details - Horizontal Layout */}
      {searched && productDetails && (
        <div className="product-details-section">
          <div className="product-details-grid">
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
              <label>Sub Category:</label>
              <span>{productDetails.SubCategory || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Type:</label>
              <span>{productDetails.ProductTypeName || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Status:</label>
              <span className={`status-badge ${productDetails.Status ? 'active' : 'inactive'}`}>
                {productDetails.Status ? 'Active' : 'Inactive'}
              </span>
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
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vendor Details Modal */}
      {showModal && selectedVendorData && (
        <VendorDetailsModal
          vendorData={selectedVendorData}
          productId={productId}
          shipCode={selectedVendorData.ShipCode}
          vendorCode={selectedVendorData.VendorCode}
          onClose={() => setShowModal(false)}
        />
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
