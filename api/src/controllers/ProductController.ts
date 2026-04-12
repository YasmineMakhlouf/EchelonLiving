import { Request, Response } from "express";
import ProductService from "../services/ProductService";
import ProductImageService from "../services/ProductImageService";
import CatalogEventsService from "../services/CatalogEventsService";

/**
 * ProductController
 * Manages product CRUD, product image uploads, and related catalog events.
 */
class ProductController {
  static async getAll(req: Request, res: Response): Promise<void> {
    // Query params are forwarded as optional filters/sort options.
    const products = await ProductService.getAll(req.query as Record<string, string | number | undefined>);

    res.json(products);
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const product = await ProductService.getById(id);
    res.json(product);
  }

  static async create(req: Request, res: Response): Promise<void> {
    const product = await ProductService.create(req.body);
    // Notify event subscribers to refresh cached catalog lists.
    CatalogEventsService.emit("products", "created");
    res.status(201).json(product);
  }

  static async update(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const product = await ProductService.update(id, req.body);
    CatalogEventsService.emit("products", "updated");
    res.json(product);
  }

  static async remove(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    await ProductService.remove(id);
    CatalogEventsService.emit("products", "deleted");
    res.status(204).send();
  }

  static async uploadImage(req: Request, res: Response): Promise<void> {
    const productId = Number(req.params.id);
    const file = req.file;

    if (!file) {
      res.status(400).json({ success: false, message: "Image file is required" });
      return;
    }

    // Persist relative upload path that can be served by the API static files setup.
    const imageUrl = `/uploads/products/${file.filename}`;
    const image = await ProductImageService.addImage(productId, imageUrl);
    CatalogEventsService.emit("products", "updated");
    res.status(201).json(image);
  }

  static async getImages(req: Request, res: Response): Promise<void> {
    const productId = Number(req.params.id);
    const images = await ProductImageService.getByProductId(productId);
    res.json(images);
  }
}

export default ProductController;

