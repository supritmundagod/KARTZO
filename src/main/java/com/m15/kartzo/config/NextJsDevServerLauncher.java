package com.m15.kartzo.config;

import java.io.File;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Starts {@code npm run <script>} in the {@code web/} folder after the API is ready.
 * <p>
 * Active only with Spring profile {@code dev} and {@code kartzo.storefront.enabled=true}.
 * Stops the Node process when the JVM shuts down so one process controls both tiers.
 */
@Component
@Profile("dev")
@ConditionalOnProperty(name = "kartzo.storefront.enabled", havingValue = "true")
public class NextJsDevServerLauncher implements ApplicationListener<ApplicationReadyEvent>, DisposableBean {

	private static final Logger log = LoggerFactory.getLogger(NextJsDevServerLauncher.class);

	@Value("${kartzo.storefront.npm-command:npm}")
	private String npmCommand;

	@Value("${kartzo.storefront.npm-script:dev}")
	private String npmScript;

	@Value("${kartzo.storefront.working-directory:web}")
	private String workingDirectory;

	private volatile Process process;

	@Override
	public void onApplicationEvent(ApplicationReadyEvent event) {
		Path base = Path.of(System.getProperty("user.dir", ".")).normalize();
		Path webDir = base.resolve(workingDirectory).normalize();
		if (!webDir.toFile().isDirectory()) {
			log.warn(
					"Kartzo storefront directory not found: {}. Set kartzo.storefront.working-directory. Skipping Next.js.",
					webDir.toAbsolutePath());
			return;
		}
		File pkg = webDir.resolve("package.json").toFile();
		if (!pkg.isFile()) {
			log.warn("No package.json in {}. Skipping Next.js.", webDir.toAbsolutePath());
			return;
		}

		try {
			ProcessBuilder pb = isWindows()
					? new ProcessBuilder("cmd.exe", "/c", npmCommand, "run", npmScript)
					: new ProcessBuilder(npmCommand, "run", npmScript);
			pb.directory(webDir.toFile());
			pb.redirectErrorStream(true);
			pb.inheritIO();

			log.info("Starting Next.js in {} ({} run {}) — http://localhost:3000", webDir.toAbsolutePath(), npmCommand,
					npmScript);
			process = pb.start();
			log.info("Next.js PID {} (stop Spring Boot to stop the storefront)", process.pid());
		} catch (Exception e) {
			log.error("Failed to start Next.js. Install Node.js LTS and run `npm install` in /web. Cause: {}",
					e.getMessage());
		}
	}

	private static boolean isWindows() {
		return System.getProperty("os.name", "").toLowerCase().contains("win");
	}

	@Override
	public void destroy() {
		Process p = process;
		if (p == null) {
			return;
		}
		log.info("Stopping Next.js dev server...");
		p.destroy();
		try {
			if (!p.waitFor(8, TimeUnit.SECONDS)) {
				p.destroyForcibly();
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			p.destroyForcibly();
		}
		process = null;
	}
}
