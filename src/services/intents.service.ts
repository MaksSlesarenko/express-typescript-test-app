import fetch from 'node-fetch';
import { IntentRequest, IntentResponse } from '../dtos/intents.dto';
import { NluBRequest, NluBResponse } from '../dtos/nlu.b.dto';
import { NluARequest, NluAResponse } from '../dtos/nlu.a.dto';
import { plainToClass } from 'class-transformer';
import HttpException from '../exceptions/HttpException';

export default class IntentsService {
  public async getIntents(request: IntentRequest): Promise<IntentResponse>|null {

    const nluAReq: NluARequest = plainToClass(NluARequest, request, { excludeExtraneousValues: true });
    let responseNluA: NluAResponse = null;

    try {
      responseNluA = await this.fetchNluA(nluAReq);
    } catch (e) {
      throw new HttpException(503, 'NluA is unavailable')
    }

    const nluBReq: NluBRequest = plainToClass(NluBRequest, request, { excludeExtraneousValues: true });
    let responseNluB: NluBResponse = null
    try {
      responseNluB = await this.fetchNluB(nluBReq);
    } catch (e) {
      throw new HttpException(503, 'NluB is unavailable')
    }

    const response: IntentResponse = plainToClass(IntentResponse, {
      ...responseNluA,
      ...responseNluB
    }, { excludeExtraneousValues: true });
    return response;
  }



  public async fetchNluA(req: NluARequest): Promise<NluAResponse> {
    return await fetch(
      process.env.NLU_A_ENDPOINT,
      {
        method: 'post',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json'}
      })
      .then(res => res.json())
      .then((res) => {
        return (res.json().body) as NluAResponse;
      });
  }

  public async fetchNluB(req: NluBRequest): Promise<NluBResponse> {
    return await fetch(
      process.env.NLU_B_ENDPOINT,
      {
        method: 'post',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json'}
      })
      .then(res => res.json())
      .then((res) => {
        return (res.json().body) as NluBResponse;
      });
  }
}
