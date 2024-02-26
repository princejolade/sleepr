import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '../types';

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
  private authService: AuthServiceClient;

  constructor(@Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
   
    const jwt = context.switchToHttp().getRequest().cookies?.AUTH;


    if (!jwt) {
      return false;
    }

    return this.authService
      .authenticate({
        AUTH: jwt,
      })
      .pipe(
        tap((response) => {
          context.switchToHttp().getRequest().user = {
            ...response,
            _id: response.id,
          };
        }),
        map(() => true),
        catchError(() => of(false)),
      );
  }
}
