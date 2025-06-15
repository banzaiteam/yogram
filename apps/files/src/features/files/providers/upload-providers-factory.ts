import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AwsService } from './aws/aws.service';
import { GoogleService } from './google/google.service';

enum UploadProvider {
  Aws = 'aws',
  Google = 'google',
}

@Injectable({ scope: Scope.REQUEST })
export class UploadProvidersFactory {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly awsService: AwsService,
    private readonly googleService: GoogleService,
  ) {}
  async getUploadService() {
    // let provider: UploadProvider = this.request.query
    //   .provider as UploadProvider;
    // if (!provider) {
    //   provider = UploadProvider.Aws;
    // }
    const provider: UploadProvider = UploadProvider.Aws as UploadProvider;
    switch (provider) {
      case UploadProvider.Aws:
        return this.awsService;
      case UploadProvider.Google:
        return this.googleService;
      default:
        throw new BadRequestException('not correct file uploader service');
    }
  }
}
