/**
 * CategoryService
 * Handles category-related business rules and validations.
 */
import CategoryRepository from "../repositories/CategoryRepository";
import { Category, ICategoryCreate, ICategoryUpdate } from "../types/category";
import { NotFoundError } from "../utils/errors";

class CategoryService {
  static async getAll(): Promise<Category[]> {
    return CategoryRepository.findAll();
  }

  static async getById(id: number): Promise<Category> {
    const category = await CategoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    return category;
  }

  static async create(categoryData: ICategoryCreate): Promise<Category> {
    return CategoryRepository.create(categoryData);
  }

  static async update(id: number, categoryData: ICategoryUpdate): Promise<Category> {
    const category = await CategoryRepository.update(id, categoryData);
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    return category;
  }

  static async remove(id: number): Promise<boolean> {
    const deleted = await CategoryRepository.remove(id);
    if (!deleted) {
      throw new NotFoundError("Category not found");
    }
    return deleted;
  }
}

export default CategoryService;

