package com.pinggraph;

import com.pinggraph.core.ServerLoader;

public class Launcher {

	// The instance of the running application.
	private static ServerLoader pingServer;

	/**
	 * This method should serve as the main entry point for the application when
	 * being started by any means, it should catch and properly log any fatal
	 * exceptions which might arise at any time in the applications life before it
	 * is properly terminated.
	 *
	 * @param args Any arguments passed to the application from the command line.
	 */
	public static void main(String[] args) {

		// Print startup message
		System.out.println("");
		System.out.println("Starting...");
		System.out.println("");

		try {

			// Instantiate the loader
			pingServer = new ServerLoader(args);

			// Launch the system
			pingServer.launch();

		} catch (Exception e) {

			// Log launch exception and quit
			e.printStackTrace(System.err);
			Launcher.invokeSystemShutdown(1);

		} catch (NoClassDefFoundError e) {

			// Log error and quit on launch dependency failure
			System.out.println("Missing required libraries. Exiting.");
			System.err.println("Missing required libraries. Exiting.");
			e.printStackTrace(System.err);
			Launcher.invokeSystemShutdown(1);
		}
	}

	/**
	 * This method may be called by any class, at any time, to request that the
	 * application be terminated with the given exit code.
	 *
	 * @param exitCode The exit code to be returned to the operating system.
	 */
	public static void invokeSystemShutdown(final int exitCode) {

		// Attempt a graceful shutdown the server
		pingServer.stop();

		// Run this in a dedicated thread so the call returns
		new Thread(new Runnable() {

			public void run() {

				// Exit the JVM with a given status code
				System.exit(exitCode);
			}
		}).start();
	}
}
