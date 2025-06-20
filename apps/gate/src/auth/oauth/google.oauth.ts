import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { GateService } from '../../../../../apps/libs/gateService';
import { lastValueFrom } from 'rxjs';
import { OauthUserCredentialsDto } from './dto/oauth-user-credentials.dto';
import { UsersService } from '../../users/users.service';
import { GoogleSignupDto } from '../../../../../apps/libs/Users/dto/user/google-signup.dto';
import { plainToInstance } from 'class-transformer';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { HttpUsersPath } from '../../../../../apps/libs/Users/constants/path.enum';
import { IOauth } from './interfaces/oauth.interface';
import { LoggedUserDto } from '../../../../../apps/libs/Users/dto/user/logged-user.dto';
import { HttpServices } from '../../../../../apps/gate/common/constants/http-services.enum';

@Injectable()
export class GoogleOauth implements IOauth {
  constructor(
    private readonly gateService: GateService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async getUserCredentials(code: string): Promise<OauthUserCredentialsDto> {
    const tokenResponse = await this.gateService.httpServicePost(
      'https://oauth2.googleapis.com/token',
      {
        code: code,
        client_id: this.configService.get('GOOGLE_CLIENT_ID'),
        client_secret: this.configService.get('GOOGLE_CLIENT_SECRET'),
        redirect_uri: this.configService.get('GOOGLE_REDIRECT_URI'),
        grant_type: 'authorization_code',
      },
      {},
    );
    const accessToken = tokenResponse.access_token;
    const userResponse = await lastValueFrom(
      this.httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
    const oauthUserCredentialsDto: OauthUserCredentialsDto = {
      providerId: userResponse.data.sub,
      email: userResponse.data.email,
      username: userResponse.data?.name,
    };
    return oauthUserCredentialsDto;
  }

  async performOAuth(code: string): Promise<LoggedUserDto> {
    const userCredentials = await this.getUserCredentials(code);
    const provider = await this.usersService.findProviderByProviderId(
      userCredentials.providerId,
    );
    const user = await this.usersService.findUserByCriteria({
      email: userCredentials.email,
    });

    if (!provider) {
      console.log('auth: no provider');
      let googleSignupDto: GoogleSignupDto;
      // If user not have FORM REGISTRATION we create new user, profile and provider. We take username and email from PROVIDER.
      // If user with this username already exists in db we concat username with random numbers,
      // if PROVIDER has not username we substr it from email by @ and concat with random numbers if needed.
      // Then we send forgot password email to user mail. If user try to login before creating password he will get exception about it.
      if (!user) {
        console.log('auth: no user');
        googleSignupDto = {
          providerId: userCredentials.providerId,
          username: userCredentials.username,
          email: userCredentials.email,
        };
        // If user already have FORM REGISTRATION but push GOOGLE SIGN, we merge user’s db data to provider
      } else {
        console.log('auth: user exists', user);
        googleSignupDto = {
          providerId: userCredentials.providerId,
          username: userCredentials.username,
          email: userCredentials.email,
          user: { id: user.id, email: user.email, username: user.username },
        };
      }
      const userResponse = await this.gateService.requestHttpServicePost(
        HttpServices.Users,
        HttpUsersPath.CreateWithGoogle,
        googleSignupDto,
        {},
      );
      if (userResponse.created) {
        await this.createPassword(userResponse.user.email);
      }
      return plainToInstance(LoggedUserDto, userResponse.user, {
        excludeExtraneousValues: true,
      });
      // If user push GOOGLE SIGN and already has PROVIDER - he will be logged in
    } else {
      if (provider) {
        console.log('auth: provider exists we login');
        return plainToInstance(LoggedUserDto, user);
      }
    }
  }

  async createPassword(email: string) {
    await this.authService.forgotPassword({ email });
  }
}
