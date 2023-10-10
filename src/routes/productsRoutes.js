import { Router } from "express";
import { productsModel } from "../dao/models/products.model.js";
import { productsManager } from "../dao/dataBase/productsManager.js";
const productManager = new productsManager();

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort:
        sort === "desc" ? { price: -1 } : sort === "asc" ? { price: 1 } : null,
    };

    const queryFilters = {};

    if (query) {
      queryFilters.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    const products = await productsModel.paginate(queryFilters, options);

    res.json({
      status: "success",
      payload: products,
    });
  } catch (error) {
    console.error("Error al obtener productos paginados:", error);
    res
      .status(500)
      .json({ status: "error", error: "Error al obtener productos paginados" });
  }
});

productsRouter.get("/:pId", async (req, res) => {
  const prodId = req.params.pId;
  const prods = await productManager.getProductById(prodId);
  if (prods === undefined) {
    return res.status(404).send("Id inexistente");
  }

  res.send(prods);
});

productsRouter.post("/", async (req, res) => {
  const newProduct = req.body;
  await productManager.addProduct(
    newProduct.title,
    newProduct.description,
    newProduct.price,
    newProduct.code,
    newProduct.stock
  );
  res.status(200).send("Producto Agregado correctamente");
});

productsRouter.put("/:pId", async (req, res) => {
  const idprod = req.params.pId;
  const { title, description, price, code, stock } = req.body;

  const productUpdated = await productManager.updateProduct(
    idprod,
    title,
    description,
    price,
    code,
    stock
  );

  if (productUpdated) {
    res.status(200).send("Producto actualizado exitosamente.");
  } else {
    res
      .status(404)
      .send("No se encontró ningún producto con el ID proporcionado.");
  }
});

productsRouter.delete("/:pId", async (req, res) => {
  const idProd = req.params.pId;
  const deleteProd = await productManager.deleteProduct(idProd);

  if (deleteProd.success) {
    res.status(200).send(deleteProd.message);
  } else {
    res.status(404).send(deleteProd.message);
  }
});

export default productsRouter;
