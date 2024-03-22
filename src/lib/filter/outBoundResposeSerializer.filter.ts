// mqtt의 reponse 메세지를 나타내는 부분
import { Serializer, OutgoingResponse } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

export class OutboundResponseSerializer implements Serializer {
  private readonly logger = new Logger('OutboundResponseIdentitySerializer');

  serialize(value: any): OutgoingResponse {
    this.logger.debug(
      `-->> Serializing outbound response: \n${JSON.stringify(value)}`,
    );
    // this.logger.log(
    //   `-->> Serializing outbound response: \n${JSON.stringify(value)}`,
    // );
    return value.data;
  }
}
