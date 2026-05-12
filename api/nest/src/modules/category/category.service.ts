import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly repo: CategoryRepository) {}

  async list() {
    return this.repo.query('SELECT id, name, description FROM categories ORDER BY id');
  }

  async create(name: string, description: string) {
    const rows = await this.repo.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id, name, description',
      [name, description]
    );
    return rows[0];
  }

  async update(id: number, name: string, description: string) {
    const rows = await this.repo.query(
      'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING id, name, description',
      [name, description, id]
    );

    if (!rows[0]) {
      throw new NotFoundException('Category not found');
    }

    return rows[0];
  }

  async remove(id: number) {
    const rows = await this.repo.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
    if (!rows[0]) {
      throw new NotFoundException('Category not found');
    }
  }
}
