import { LoggedUserDto } from 'apps/libs/Users/dto/user/logged-user.dto';
import { OauthUserCredentialsDto } from '../dto/oauth-user-credentials.dto';

export interface IOauth {
  getUserCredentials(code: string): Promise<OauthUserCredentialsDto>;
  performOAuth(code: string): Promise<LoggedUserDto>;
}
