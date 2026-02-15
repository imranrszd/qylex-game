const productService = require("../services/product.service");

exports.listProducts = async (req, res, next) => {
  try {
    const products = await productService.listProducts();
    res.json({ data: products });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
};
