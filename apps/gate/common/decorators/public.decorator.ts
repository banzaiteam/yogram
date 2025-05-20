import { SetMetadata } from '@nestjs/common';

export const Is_Public = 'Is_Public';

export const Public = () => SetMetadata(Is_Public, true);
