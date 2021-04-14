import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class NluARequest {
  @Expose()
  @IsString()
  public text: string;

  @Expose()
  @IsString()
  public model: string;
}

export class NluAResponse {
  @Expose()
  @IsString({ each: true })
  public intents: string[];

  @Expose()
  @IsString({ each: true })
  public entities: string[];
}
