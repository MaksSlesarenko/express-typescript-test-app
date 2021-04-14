import { IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class IntentRequest {
  @Expose()
  @IsString()
  public text: string;

  @Expose()
  @IsString()
  public model: string;

  @Expose()
  @IsString()
  public utterance: string;
}

export class IntentResponse {
  @Expose()
  @IsString({ each: true })
  public intents: string[];

  @Expose()
  @IsString({ each: true })
  public entities: string[];

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
