import { Controller, Options, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class OptionsController {
    @Options('*')
    handleOptions(@Res() res: Response) {
        res.header(
            'Access-Control-Allow-Origin',
            'https://chaishots-cms-frontend.onrender.com',
        );
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header(
            'Access-Control-Allow-Methods',
            'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        );
        res.header(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization',
        );
        return res.sendStatus(204);
    }
}