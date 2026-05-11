import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(private readonly repo: AuthRepository, private readonly jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const match = await bcrypt.compare(password, user.password_hash || '');
    if (!match) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
  }

  async register(payload: any) {
    const existing = await this.repo.findByEmail(payload.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashed = await bcrypt.hash(payload.password, SALT_ROUNDS);
    const user = await this.repo.createUser({
      name: payload.name || null,
      email: payload.email,
      password_hash: hashed,
      role: payload.role || 'customer',
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return { ...user, token };
  }
}
