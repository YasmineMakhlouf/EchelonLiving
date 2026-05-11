import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async list() {
    return this.repo.query('SELECT id, email, role FROM users ORDER BY id DESC LIMIT 100');
  }

  async getById(id: number) {
    const rows = await this.repo.query('SELECT id, email, role FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  }
}
