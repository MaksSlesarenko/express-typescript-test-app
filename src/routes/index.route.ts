import { Router } from 'express';
import IndexController from '../controllers/index.controller';
import validationMiddleware from '../middlewares/validation.middleware';
import { IntentRequest } from '../dtos/intents.dto';
import Route from './routes.interface';

class IndexRoute implements Route {
  public path = '/';
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.indexController.index);
    this.router.post(`${this.path}`, validationMiddleware(IntentRequest, 'body'), this.indexController.getIntents);
  }
}

export default IndexRoute;
