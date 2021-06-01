package uwl.senate.coc.configurations;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;

@Configuration
public class Oauth2LoginConfig {

//    @Bean
//    public ClientRegistrationRepository clientRegistrationRepository() {
//        return new InMemoryClientRegistrationRepository(this.uwlaxClientRegistration());
//    }
//
//    private ClientRegistration uwlaxClientRegistration() {
//        return ClientRegistration.withRegistrationId("uwlax")
//            .clientId("google-client-id")
//            .clientSecret("google-client-secret")
//            .clientAuthenticationMethod(ClientAuthenticationMethod.BASIC)
//            .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
//            .redirectUriTemplate("{baseUrl}/login/oauth2/code/{registrationId}")
//            .scope("openid", "profile", "email", "address", "phone")
//            .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
//            .tokenUri("https://www.googleapis.com/oauth2/v4/token")
//            .userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
//            .userNameAttributeName(IdTokenClaimNames.SUB)
//            .jwkSetUri("https://www.googleapis.com/oauth2/v3/certs")
//            .clientName("uwlax")
//            .build();
//    }
	
	
	@Bean
	public ClientRegistrationRepository clientRegistrationRepository() {
		List<ClientRegistration> registrations = new ArrayList<>();
		registrations.add(githubClientRegistration());
		return new InMemoryClientRegistrationRepository(registrations);
	}

	private ClientRegistration githubClientRegistration() {
		return ClientRegistration
				.withRegistrationId("github")
                .clientId("github-client-id")
				.clientSecret("github-client-secret")
				.clientAuthenticationMethod(ClientAuthenticationMethod.BASIC)
				.authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
				.redirectUriTemplate("{baseUrl}/login/oauth2/code/{registrationId}")
				.authorizationUri("https://github.com/login/oauth/authorize")
				.tokenUri("https://github.com/login/oauth/access_token")
                .userInfoUri("https://api.github.com/user")
				.clientName("GitHub").build();
	}
}