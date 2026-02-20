const productService = require('../services/product.service');

exports.syncSupplierPrices = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const result = await productService.syncSupplierPrices(productId);

    return res.json({
      message: 'Supplier prices synced successfully',
      updated: result.updated,
      created: result.created
    });

  } catch (err) {
    console.error('Sync supplier error:', err);
    return res.status(500).json({
      error: err.message || 'Internal server error'
    });
  }
};