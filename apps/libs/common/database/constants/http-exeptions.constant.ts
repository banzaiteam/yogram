import {HttpStatus} from '@nestjs/common';

export const HTTP_ERROR = {
    NOT_FOUND: {
        status: HttpStatus.NOT_FOUND,
        error: 'Not Found',
    },
    BAD_REQUEST: {
        status: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
    },
    CONFLICT: {
        status: HttpStatus.BAD_REQUEST,
        error: 'Bad Request'
    },
    PAYLOAD_TOO_LARGE: {
        status: HttpStatus.PAYLOAD_TOO_LARGE,
        error: 'Payload too large'
    },
    UNSUPPORTED_MEDIA_TYPE: {
        status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        error: 'unsupported media type'
    }

} as const satisfies Record<string, IHttpError>

interface IHttpError {
    status: HttpStatus,
    error: string
}

export type HttpError = (typeof HTTP_ERROR)[keyof typeof HTTP_ERROR];