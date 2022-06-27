import { GoogleLoginProvider, SocialAuthServiceConfig } from "angularx-social-login";
import { environment } from "src/environments/environment";

export const socialAuth = {
  provide: 'SocialAuthServiceConfig',
  useValue: {
    autoLogin: false,
    providers: [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(environment.googleClientId)
      },
    ],
    onError: (err: any) => console.error(err)
  } as SocialAuthServiceConfig,
}