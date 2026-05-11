import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthPayload } from '../common/graphql.types';
import { AuthService } from '../modules/auth/auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload, { nullable: true })
  async login(@Args('email') email: string, @Args('password') password: string) {
    try {
      return this.authService.login(email, password);
    } catch (error) {
      console.error('Login mutation error:', error);
      throw error;
    }
  }

  @Mutation(() => AuthPayload)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('role', { nullable: true }) role: string = 'customer',
  ) {
    try {
      return this.authService.register({ email, password, role });
    } catch (error) {
      console.error('Register mutation error:', error);
      throw new Error(`Registration failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
