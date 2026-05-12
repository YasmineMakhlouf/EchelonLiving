import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		// Handle both REST and GraphQL contexts
		let request;
		try {
			const gqlContext = GqlExecutionContext.create(context);
			request = gqlContext.getContext().req;
		} catch {
			request = context.switchToHttp().getRequest();
		}
		const authHeader = request?.headers?.authorization;
    
		if (!authHeader) {
			throw new UnauthorizedException('No authorization header');
		}
    
		// Extract Bearer token
		const token = authHeader.replace('Bearer ', '');
    
		if (!token) {
			throw new UnauthorizedException('No token provided');
		}
    
		try {
			// Verify JWT token
			const secret = process.env.JWT_SECRET || 'changeme';
			const payload = jwt.verify(token, secret) as any;
      
			// Attach user info to request
			request.user = {
				userId: payload.sub,
				email: payload.email,
				role: payload.role,
			};
      
			return true;
		} catch (error) {
			throw new UnauthorizedException('Invalid token');
		}
	}
}
