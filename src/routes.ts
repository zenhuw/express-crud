import { json } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { authRouter } from './controllers/auth.controller';
import { indexRouter } from './controllers/index.controller';
import { userRouter } from './controllers/users.controller';
import { authMiddleware } from './middlewares/auth.middleware';

export function initRoutes(app: any) {
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'REST API',
        version: '1.0.0',
        description: 'Example docs',
      },
    },
    apis: ['swagger.yml'],
  };

  const specs = swaggerJSDoc(swaggerOptions);

  app.use(json());
  app.use(authMiddleware);
  app.use('/api/', indexRouter);
  app.use('/api/users', userRouter);
  app.use('/api/auth', authRouter);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
