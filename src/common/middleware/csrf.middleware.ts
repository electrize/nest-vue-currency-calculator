import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {
  csrfSync,
  CsrfSynchronisedProtection,
  CsrfTokenGenerator,
} from 'csrf-sync';

@Injectable()
export class CSRFMiddleware implements NestMiddleware {
  private csrfSynchronisedProtection: CsrfSynchronisedProtection;
  private generateToken: CsrfTokenGenerator;

  constructor() {
    const { csrfSynchronisedProtection, generateToken } = csrfSync({
      getTokenFromRequest: (req) => {
        return req.headers['_csrf'] as string;
      },
      ignoredMethods: [],
    });

    this.csrfSynchronisedProtection = csrfSynchronisedProtection;
    this.generateToken = generateToken;
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/api/csrf-token') {
      return res.json(this.generateToken(req));
    }
    return this.csrfSynchronisedProtection(req, res, next);
  }
}
