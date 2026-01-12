import { Controller, Options, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthOptionsController {
    @Options('login')
    optionsLogin(@Res() res: Response) {
        const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3001';
        res.header(
            'Access-Control-Allow-Origin',
            corsOrigin,
        );
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header(
            'Access-Control-Allow-Methods',
            'POST, OPTIONS',
        );
        res.header(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization',
        );
        return res.sendStatus(204);
    }
}