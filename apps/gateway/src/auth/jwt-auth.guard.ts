import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvalidTokenException } from './errors/InvalidTokenException';
import { TokenExpiredExcetion } from './errors/TokenExpiredException';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    request['user'] = user;
    return result;
  }

  handleRequest(err: any, user: any, info: any) {
    if (info?.name === 'TokenExpiredError') {
      throw new TokenExpiredExcetion();
    }

    if (info?.name === 'JsonWebTokenError') {
      throw new InvalidTokenException();
    }

    if (err || !user) {
      throw new InvalidTokenException();
    }

    return user;
  }
}
