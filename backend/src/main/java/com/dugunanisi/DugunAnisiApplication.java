package com.dugunanisi;

import com.dugunanisi.config.EnvFileLoader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DugunAnisiApplication {

	public static void main(String[] args) {
		EnvFileLoader.loadIfPresent();
		SpringApplication.run(DugunAnisiApplication.class, args);
	}

}
