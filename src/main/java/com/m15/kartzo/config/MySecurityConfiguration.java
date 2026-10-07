package com.m15.kartzo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class MySecurityConfiguration {

	@Bean
	PasswordEncoder encoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	SecurityFilterChain chain(HttpSecurity http) throws Exception {
		return http.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(
						req -> req.requestMatchers("/", "/register", "/otp", "/resend-otp", "/forgot-password","/reset-password")
								.permitAll()
								.requestMatchers("/images/**").permitAll()
								.requestMatchers("/api/v1/catalog/**").permitAll()
								.requestMatchers("/api/v1/me/**").hasAnyRole("USER", "ADMIN")
								.requestMatchers("/user/**").hasAnyRole("USER", "ADMIN").requestMatchers("/admin/**")
								.hasRole("ADMIN").anyRequest().authenticated())
				.exceptionHandling(ex -> ex.defaultAuthenticationEntryPointFor(
						new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
						new AntPathRequestMatcher("/api/v1/**")))
				.formLogin(form -> form.loginPage("/login").defaultSuccessUrl("/", true).permitAll())
				.logout(logout -> logout.logoutUrl("/logout").logoutSuccessUrl("/login?logout").permitAll()).build();
	}
}
