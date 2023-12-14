import { Module } from '@nestjs/common';
import { MesssagesWsService } from './messsages-ws.service';
import { MesssagesWsGateway } from './messsages-ws.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [MesssagesWsGateway, MesssagesWsService],
  imports: [AuthModule]
})
export class MesssagesWsModule {}
