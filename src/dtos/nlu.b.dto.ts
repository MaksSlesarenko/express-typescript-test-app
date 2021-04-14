import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export enum NluBModel {
  modelA = "modelA",
  modelB = "modelB",
  modelC = "modelC",
}

export class NluBRequest {
  @Expose()
  @IsString()
  public utterance: string;

  @Expose()
  @IsEnum(NluBModel)
  public model: NluBModel
}

export class NluBResponse {
  @Expose()
  @IsString()
  public intent: string;

  @Expose()
  @IsString()
  public entity: string;

  @Expose()
  @IsNumber()
  public confidence: number;
}
