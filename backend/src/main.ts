import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('EcoConnect API')
    .setDescription(
      ' EcoConnect é uma plataforma online que conecta pessoas apaixonadas pelo meio ambiente e promove a conscientização ambiental de forma colaborativa. Nossa rede social oferece um espaço interativo para compartilhar informações, histórias inspiradoras, dicas práticas e projetos sustentáveis. Junte-se a uma comunidade engajada, conheça pessoas com interesses semelhantes e descubra maneiras de fazer a diferença para o nosso planeta. Seja parte do movimento e conecte-se com a sustentabilidade através do EcoConnect.',
    )
    .setVersion('1.0')
    .addTag('User')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
    },
  });

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  };
  app.enableCors(corsOptions);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
