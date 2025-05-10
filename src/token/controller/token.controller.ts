import { Controller, Post } from '@nestjs/common';
import { EncryptionService } from '../../common/service/encryption.service';

@Controller('token')
export class TokenController {
    @Post('generate')
    async generate() {
        const payload = {
            date: new Date()
        }
        const { encrypted, iv }: any = EncryptionService.encrypt(payload);
        return { encrypted, iv };
    }
}
