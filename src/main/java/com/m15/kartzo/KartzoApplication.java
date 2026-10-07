package com.m15.kartzo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class KartzoApplication {

	public static void main(String[] args) {
		SpringApplication.run(KartzoApplication.class, args);
	}

}