import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly repo: CategoryRepository) {}

  async list() {
    return this.repo.query('SELECT id, name FROM categories ORDER BY id');
  }
}
