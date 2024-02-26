import { AUTH_SERVICE_NAME, AuthServiceClient } from '@app/common';
import { UnauthorizedException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { app } from './app';
import { lastValueFrom } from 'rxjs';

export const authContext = async ({ req }) => {
  try {
    
    const client = app.get<ClientGrpc>(AUTH_SERVICE_NAME);
    const authService = client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);

    
    const res = await lastValueFrom(
      authService.authenticate({
        AUTH: req.headers?.auth,
      }),
    );

    const user = {...res, _id: res.id} 
 
    return {user};

  } catch (error) {
    throw new UnauthorizedException(error);
  }
};
