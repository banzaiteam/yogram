import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseDeviceDto } from '../../dto/response-device.dto';

export function DevicesSwagger() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiResponse({
      status: 200,
      description: 'success',
      type: ResponseDeviceDto,
    }),
    ApiResponse({
      status: 404,
      description:
        'Session provider: user devices was not found / Session provider: device last activity was not found',
    }),
    ApiOperation({
      summary:
        'Return all user devices with last activity and current device property',
    }),
    HttpCode(HttpStatus.OK),
  );
}
