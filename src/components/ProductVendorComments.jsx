import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import VendorCard from './VendorCard';
import '../styles/ProductVendorComments.css';

function ProductVendorComments() {
  const [productId, setProductId] = useState('');
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [shipCodes, setShipCodes] = useState([]);
  const [selectedShipCodes, setSelectedShipCodes] = useState(new Set());
  const [vendorCodes, setVendorCodes] = useState([]);
  const [selectedVendorCodes, setSelectedVendorCodes] = useState(new Set());
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);

  // Load ship codes on component mount
  useEffect(() => {
    const loadShipCodes = async () => {
      try {
        setIsLoadingFilters(true);
        const data = await apiService.getShipCodes();
        setShipCodes(Array.isArray(data) ? data : data.shipCodes || []);
      } catch (err) {
        console.error('Error loading ship codes:', err);
      } finally {
        setIsLoadingFilters(false);
      }
    };

    loadShipCodes();
  }, []);

  // Load vendor codes when ship codes selection changes
  useEffect(() => {
    const loadVendorCodes = async () => {
      if (selectedShipCodes.size === 0) {
        setVendorCodes([]);
        setSelectedVendorCodes(new Set());
        return;
      }

      try {
        setIsLoadingFilters(true);
        const shipCodeArray = Array.from(selectedShipCodes);
        const allVendorCodes = new Set();

        for (const shipCode of shipCodeArray) {
          const data = await apiService.getVendorCodesByShipCode(shipCode);
          const codes = Array.isArray(data) ? data : data.vendorCodes || [];
          codes.forEach(code => allVendorCodes.add(code));
        }

        setVendorCodes(Array.from(allVendorCodes).sort());
        setSelectedVendorCodes(new Set());
      } catch (err) {
        console.error('Error loading vendor codes:', err);
      } finally {
        setIsLoadingFilters(false);
      }
    };

    loadVendorCodes();
  }, [selectedShipCodes]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!productId.trim()) {
      setError('Please enter a Product ID');
      return;
    }

    setIsLoading(true);
    setError('');
    setSearched(true);

    try {
      const data = await apiService.getVendorsByProductId(productId);
      setVendors(Array.isArray(data) ? data : data.vendors || []);

      if (!data || data.length === 0 || (data.vendors && data.vendors.length === 0)) {
        setError('No vendors found for this Product ID');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch vendors');
      setVendors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShipCodeToggle = (shipCode) => {
    const newSet = new Set(selectedShipCodes);
    if (newSet.has(shipCode)) {
      newSet.delete(shipCode);
    } else {
      newSet.add(shipCode);
    }
    setSelectedShipCodes(newSet);
  };

  const handleShipCodeSelectAll = (checked) => {
    if (checked) {
      setSelectedShipCodes(new Set(shipCodes.map(s => s.code || s)));
    } else {
      setSelectedShipCodes(new Set());
    }
  };

  const handleVendorCodeToggle = (vendorCode) => {
    const newSet = new Set(selectedVendorCodes);
    if (newSet.has(vendorCode)) {
      newSet.delete(vendorCode);
    } else {
      newSet.add(vendorCode);
    }
    setSelectedVendorCodes(newSet);
  };

  const handleVendorCodeSelectAll = (checked) => {
    if (checked) {
      setSelectedVendorCodes(new Set(vendorCodes));
    } else {
      setSelectedVendorCodes(new Set());
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    // If no filters are applied, show all vendors
    if (selectedShipCodes.size === 0 && selectedVendorCodes.size === 0) {
      return true;
    }

    // Check ship code filter
    if (selectedShipCodes.size > 0 && !selectedShipCodes.has(vendor.shipCode)) {
      return false;
    }

    // Check vendor code filter
    if (selectedVendorCodes.size > 0 && !selectedVendorCodes.has(vendor.vendorCode)) {
      return false;
    }

    return true;
  });

  const handleCommentAdded = (newComment) => {
    // You can use this to update UI if needed
    console.log('Comment added:', newComment);
  };

  return (
    <div className="product-vendor-comments-container">
      <div className="header-section">
        <h1>Vendor Management System</h1>
        <p>Search for vendors by Product ID and add comments</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="input-group">
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter Product ID (e.g., PROD-001)"
            className="product-id-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !productId.trim()}
            className="search-button"
          >
            {isLoading ? 'Searching...' : 'Search Vendors'}
          </button>
        </div>
      </form>

      {error && <div className="error-banner">{error}</div>}

      {searched && vendors.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h2>Found {vendors.length} Vendor(s)</h2>
            <button
              className="reset-button"
              onClick={() => {
                setProductId('');
                setVendors([]);
                setSearched(false);
                setError('');
                setSelectedShipCodes(new Set());
                setSelectedVendorCodes(new Set());
              }}
            >
              Clear Search
            </button>
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            <div className="filter-group">
              <h3>Filter by Ship Code</h3>
              {isLoadingFilters ? (
                <p className="filter-loading">Loading ship codes...</p>
              ) : shipCodes.length > 0 ? (
                <div className="filter-options">
                  <label className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedShipCodes.size === shipCodes.length}
                      onChange={(e) => handleShipCodeSelectAll(e.target.checked)}
                    />
                    <span>Select All</span>
                  </label>
                  {shipCodes.map((shipCode) => {
                    const code = shipCode.code || shipCode;
                    return (
                      <label key={code} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedShipCodes.has(code)}
                          onChange={() => handleShipCodeToggle(code)}
                        />
                        <span>{code}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="no-filters">No ship codes available</p>
              )}
            </div>

            {selectedShipCodes.size > 0 && (
              <div className="filter-group">
                <h3>Filter by Vendor Code</h3>
                {isLoadingFilters ? (
                  <p className="filter-loading">Loading vendor codes...</p>
                ) : vendorCodes.length > 0 ? (
                  <div className="filter-options">
                    <label className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedVendorCodes.size === vendorCodes.length}
                        onChange={(e) => handleVendorCodeSelectAll(e.target.checked)}
                      />
                      <span>Select All</span>
                    </label>
                    {vendorCodes.map((vendorCode) => (
                      <label key={vendorCode} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedVendorCodes.has(vendorCode)}
                          onChange={() => handleVendorCodeToggle(vendorCode)}
                        />
                        <span>{vendorCode}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="no-filters">No vendor codes available</p>
                )}
              </div>
            )}
          </div>

          {/* Results */}
          <div className="vendors-grid">
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  productId={productId}
                  onCommentAdded={handleCommentAdded}
                />
              ))
            ) : (
              <div className="no-results">
                <p>No vendors match the selected filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {searched && vendors.length === 0 && !error && (
        <div className="no-results">
          <p>No vendors found. Try a different Product ID.</p>
        </div>
      )}
    </div>
  );
}

export default ProductVendorComments;
