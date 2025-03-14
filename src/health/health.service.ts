import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
