import { productsModel } from "../models/products.model.js";

export class productsManager {
  async getAllproduct() {
    const products = await productsModel.find().lean();
    return products;
  }

  async getPaginatedProducts(page, limit) {
    try {
      const options = {
        page,
        limit,
        lean: true,
      };

      const result = await productsModel.paginate({}, options);
      return result;
    } catch (error) {
      console.log("Error al obtener productos paginados:", error);
      throw error;
    }
  }

  async addProduct(title, description, price, code, stock) {
    const addproduct = await productsModel.create({
      title,
      description,
      price,
      code,
      stock,
    });
    return addproduct._id;
  }

  async getProductById(id) {
    const productsById = await productsModel.findById(id).lean();
    return productsById;
  }

  async updateProduct(id, nTitle, nDescription, nPrice, nCode, nStock) {
    try {
      const product = await productsModel.findById(id);

      if (!product) {
        return false;
      }

      product.price = nPrice;
      product.description = nDescription;
      product.title = nTitle;
      product.code = nCode;
      product.stock = nStock;

      await product.save();

      return true;
    } catch (error) {
      console.log("Error al actualizar el producto:", error);
      return false;
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await productsModel.findByIdAndRemove(id);

      if (!deletedProduct) {
        return { success: false, message: "Id inexistente" };
      }

      return { success: true, message: "Producto eliminado correctamente" };
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return { success: false, message: "No se pudo eliminar el producto" };
    }
  }
}
