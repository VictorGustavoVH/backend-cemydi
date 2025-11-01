import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Conectado a la base de datos exitosamente');
    } catch (error) {
      this.logger.error('❌ Error al conectar con la base de datos:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('✅ Desconectado de la base de datos');
    } catch (error) {
      this.logger.error('❌ Error al desconectar de la base de datos:', error);
    }
  }
}
