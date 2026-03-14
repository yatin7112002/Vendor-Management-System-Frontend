// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiService = {
  // Fetch product details by Product ID
  getProductDetails: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/product-details?productId=${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  },

  // Fetch vendors by Product ID
  getVendorsByProductId: async (productId) => {
    try {
      console.log("I am here");
      const response = await fetch(`${API_BASE_URL}/vendors?productId=${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vendors');
      }
      // console.log("The data is:", response.json());
      return await response.json();
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  },

  // Fetch all distimct ship codes for a Product ID
  getShipCodes: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ship-codes?productId=${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ship codes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ship codes:', error);
      throw error;
    }
  },

  // Fetch vendor codes by ship code
  getVendorCodesByShipCode: async (productId, shipCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vendor-codes?productId=${productId}&shipCode=${shipCode}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vendor codes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching vendor codes:', error);
      throw error;
    }
  },

  // Add comment to vendor
  addCommentToVendor: async (vendorId, productId, commentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendorId,
          productId,
          ...commentData,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save comment');
      }
      return await response.json();
    } catch (error) {
      console.error('Error saving comment:', error);
      throw error;
    }
  },

  // Fetch comments for a vendor (optional - for loading existing comments)
  getCommentsByVendorId: async (vendorId, productId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/comments?vendorId=${vendorId}&productId=${productId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },
};
