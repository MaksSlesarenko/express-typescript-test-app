import { NextFunction, Request, Response } from 'express';
import { IntentRequest, IntentResponse } from '../dtos/intents.dto';
import IntentsService from '../services/intents.service';

export default class IndexController {
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  public getIntents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: IntentRequest = req.body;

      const service: IntentsService = new IntentsService();

      const response: IntentResponse = await service.getIntents(data);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
