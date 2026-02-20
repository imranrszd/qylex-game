const axios = require('axios');

exports.fetchProductVariations = async (provider, providerProductId) => {

  if (provider === 'moogold') {

    const response = await axios.get(
      `https://api.moogold.com/product/${providerProductId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MOOGOLD_API_KEY}`
        }
      }
    );

    // Adapt this to supplier response structure
    return response.data.variations.map(v => ({
      variation_id: v.variation_id,
      price: parseFloat(v.price),
      name: v.name,
      amount: v.diamond_amount
    }));
  }

  throw new Error('Unsupported supplier');
};