import request from 'supertest';
import App from '../app';
import IndexRoute from '../routes/index.route';
import { IntentRequest, IntentResponse } from '../dtos/intents.dto';
import IntentsService from '../services/intents.service';
import { NluAResponse } from '../dtos/nlu.a.dto';
import { NluBResponse } from '../dtos/nlu.b.dto';
import { plainToClass } from 'class-transformer';

const text = 'test text';
const model = 'test model';
const utterance = 'test utterance';
const intents: string[] = ['test intents'];
const entities: string[] = ['test entities'];
const intent = 'test intent';
const entity = 'test entity';
const confidence = 123;

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

afterEach(() => {
  jest.clearAllMocks();
})

describe('Testing Index', () => {
  it('response should be ok', async () => {
    const reqData: IntentRequest = {
      text,
      model,
      utterance
    };

    const resData: IntentResponse = {
      intents,
      entities,
      intent,
      entity,
      confidence
    };

    const spyA = jest.spyOn(IntentsService.prototype, 'fetchNluA')
      .mockImplementation(async () => plainToClass(NluAResponse, { intents, entities }));

    const spyB = jest.spyOn(IntentsService.prototype, 'fetchNluB')
      .mockImplementation(async () => plainToClass(NluBResponse, { entity, intent, confidence}));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    return request(app.getServer())
      .post('/')
      .send(reqData)
      .expect(200, resData).then(() => {
        expect(spyA).toBeCalledTimes(1);
        expect(spyA).toBeCalledWith({ text, model });

        expect(spyB).toBeCalledTimes(1);
        expect(spyB).toBeCalledWith({ utterance, model });
      });
  });

  it('nlu a fails', async () => {
    const reqData: IntentRequest = {
      text,
      model,
      utterance
    };

    const spyA = jest.spyOn(IntentsService.prototype, 'fetchNluA')
      .mockImplementation(() => Promise.reject('error'));

    jest.spyOn(IntentsService.prototype, 'fetchNluB')
      .mockImplementation(async () => plainToClass(NluBResponse, { entity, intent, confidence}));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    return request(app.getServer())
      .post('/')
      .send(reqData)
      .expect(503, { message: 'NluA is unavailable' }).then(() => {
        expect(spyA).toBeCalledTimes(1);
        expect(spyA).toBeCalledWith({ text, model });
      });
  });

  it('nlu b fails', async () => {
    const reqData: IntentRequest = {
      text,
      model,
      utterance
    };

    const spyA = jest.spyOn(IntentsService.prototype, 'fetchNluA')
      .mockImplementation(async () => plainToClass(NluAResponse, { intents, entities }));

    const spyB = jest.spyOn(IntentsService.prototype, 'fetchNluB')
      .mockImplementation(() => Promise.reject('error'));

    const indexRoute = new IndexRoute();
    const app = new App([indexRoute]);

    return request(app.getServer())
      .post('/')
      .send(reqData)
      .expect(503, { message: 'NluB is unavailable' }).then(() => {
        expect(spyA).toBeCalledTimes(1);
        expect(spyA).toBeCalledWith({ text, model });

        expect(spyB).toBeCalledTimes(1);
        expect(spyB).toBeCalledWith({ utterance, model });
      });
  });
});
