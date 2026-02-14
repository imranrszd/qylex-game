const productService = require("../services/product.service")

async function createProduct(req,res,next) {
  try {
    const created = await productService.createProduct(req.body);
    return res.status(201).json({ data: created});
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ message: err.message})
    }
    next(err)
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;

    const updated = await productService.updateProduct(id, req.body);

    return res.status(200).json({ data: updated });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    next(err);
  }
}

async function disableProduct(req, res, next) {
  try {
    const { id } = req.params;

    const updated = await productService.updateProduct(id, {
      is_active: false,
    });

    return res.status(200).json({
      message: "Product disabled successfully",
      data: updated,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    await productService.deleteProduct(id);

    return res.status(200).json({
      message: "Product deleted permanently",
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    next(err);
  }
}

async function enableProduct(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await productService.enableProduct(id);

    return res.status(200).json({
      message: "Product enabled successfully",
      data: updated,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    next(err);
  }
}

async function listAllProductsAdmin(req, res, next) {
  try {
    const rows = await productService.listAllProducts();
    return res.status(200).json({ data: rows });
  } catch (err) {
    next(err);
  }
}


module.exports = { createProduct, updateProduct, disableProduct, deleteProduct, enableProduct, listAllProductsAdmin }