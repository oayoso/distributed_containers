import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { EncryptionService } from '../service/encryption.service';
  
@Injectable()
export class HeaderAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        let response = true;
        const request = context.switchToHttp().getRequest();
        const apiToken = request.headers['x-api-token'];
        const apiIv = request.headers['x-api-iv'];
    
        if (!apiToken || !apiIv) {
            throw new UnauthorizedException('Los headers: x-api-token y x-api-iv obligatorio');
        }

        if (apiIv.length !== 32) {
            throw new UnauthorizedException('IV inválido: debe tener exactamente 32 caracteres hexadecimales');
        }

        try {
            EncryptionService.decrypt(apiToken, apiIv)
        } catch (error){
            throw new UnauthorizedException('x-api-token y/o x-api-iv invalidos');
        }
    
        return response;
    }
}