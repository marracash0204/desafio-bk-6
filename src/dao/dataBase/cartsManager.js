import { cartModel } from "../models/cart.model.js";

export class cartManager {
  async getAllCart() {
    const carts = await cartModel.find().populate("products.product").lean();
    return carts;
  }

  async addCart(cart) {
    const addCart = await cartModel.create(cart);
    const carts = await cartModel.findById(addCart._id);
    return carts;
  }

  async getCartById(id) {
    const cartsById = await cartModel
      .findById(id)
      .populate("products.product")
      .lean();

    return cartsById;
  }

  async updateCart(cartId, updatedCart) {
    try {
      const result = await cartModel.findByIdAndUpdate(
        cartId,
        { $set: { products: updatedCart.products } },
        { new: true }
      );

      if (!result) {
        throw new Error("Carrito no encontrado");
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const updatedCart = await cartModel.findOneAndUpdate(
        { _id: cartId, products: { $elemMatch: { product: productId } } },
        { $set: { "products.$.quantity": newQuantity } },
        { new: true }
      );

      if (!updatedCart) {
        throw new Error("Carrito o producto no encontrado");
      }

      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(
        cartId,
        { $pull: { products: { product: productId } } },
        { new: true }
      );

      if (!updatedCart) {
        throw new Error(
          "Carrito no encontrado o producto no existe en el carrito"
        );
      }

      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async clearCart(cartId) {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );

      if (!updatedCart) {
        throw new Error("Carrito no encontrado");
      }

      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const existingProduct = cart.products.find((product) =>
        product.product.equals(productId)
      );

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async createCart() {
    try {
      const newCart = await cartModel.create({
        products: [],
      });
      return newCart._id;
    } catch (error) {
      console.error("Error al crear un carrito:", error);
      throw error;
    }
  }
}
