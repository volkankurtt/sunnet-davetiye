package com.dugunanisi.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

/**
 * Loads backend/.env into system properties so {@code mvnw spring-boot:run} picks up
 * the same values as the working template without requiring a global shell export.
 */
public final class EnvFileLoader {

	private EnvFileLoader() {
	}

	public static void loadIfPresent() {
		Path file = Path.of(".env");
		if (!Files.isRegularFile(file)) {
			file = Path.of("backend", ".env");
		}
		if (!Files.isRegularFile(file)) {
			return;
		}
		try {
			List<String> lines = Files.readAllLines(file, StandardCharsets.UTF_8);
			for (String raw : lines) {
				String line = raw.trim();
				if (line.isEmpty() || line.startsWith("#")) {
					continue;
				}
				if (line.startsWith("export ")) {
					line = line.substring(7).trim();
				}
				int eq = line.indexOf('=');
				if (eq <= 0) {
					continue;
				}
				String key = line.substring(0, eq).trim();
				String value = unquote(line.substring(eq + 1).trim());
				if (key.isEmpty() || System.getenv(key) != null) {
					continue;
				}
				if (System.getProperty(key) == null) {
					System.setProperty(key, value);
				}
			}
		}
		catch (IOException ignored) {
			// Fall through to normal Spring environment resolution.
		}
	}

	private static String unquote(String value) {
		if (value.length() >= 2) {
			char first = value.charAt(0);
			char last = value.charAt(value.length() - 1);
			if ((first == '"' && last == '"') || (first == '\'' && last == '\'')) {
				return value.substring(1, value.length() - 1);
			}
		}
		return value;
	}
}
