package com.pinggraph.core;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.HandlerCollection;
import org.eclipse.jetty.websocket.server.WebSocketHandler;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

import com.pinggraph.server.api.PingHandler;
import com.pinggraph.server.api.StaticHandler;
import com.pinggraph.server.api.StatsHandler;

/**
 * This class should handle the processing of the command line arguments passed
 * on startup in addition to the setup of the main Jetty API server and it's
 * associated handlers.
 *
 * @author Matthew R. Clark, 2020
 *
 */
public class ServerLoader {

	// The port for the API server to bind to.
	private int serverPort = 8080;

	// The instance of the running Jetty server and it's handlers.
	private Server server;
	private HandlerCollection handlers;

	/**
	 * Initialize the server loader by processing the command line arguments
	 * supplied by the user.
	 *
	 * @param args
	 */
	public ServerLoader(String[] args) {

		parseLaunchArgs(args);
	}

	/**
	 * Main entry point to start the server; jetty will be initialized followed by
	 * each handler. Once initialized the server will be started and ready to server
	 * requests.
	 *
	 * @throws Exception
	 */
	public void launch() throws Exception {

		initJetty();

		initStatsHandler();

		initApiHandler();

		initResourceHandler();

		startServer();
	}

	/**
	 * Loop and parse each provided argument.
	 *
	 * @param args
	 */
	private void parseLaunchArgs(String[] args) {

		// Do nothing if null arguments
		if (args == null) {

			return;
		}

		// Loop all arguments
		for (int x = 0; x < args.length; x++) {

			switch (args[x]) {

			case "--port":
				serverPort = Integer.parseInt(args[++x]);
				break;

			default:
				System.err.println("Unknown argument [ " + args[x] + " ]");
				System.exit(1);
				break;
			}
		}
	}

	/**
	 * Initialize the Jetty server.
	 */
	private void initJetty() {

		// initialize handler collection
		handlers = new HandlerCollection();

		// initialize API server
		server = new Server(serverPort);
		server.setHandler(handlers);
	}

	/**
	 * Initialize the statistics end-point.
	 */
	private void initStatsHandler() {

		// setup statistics handler
		ContextHandler statsHandler = new ContextHandler();
		handlers.addHandler(statsHandler);
		statsHandler.setContextPath("/stats");
		statsHandler.setHandler(new StatsHandler());
	}

	/**
	 * Initialize the main API handler.
	 */
	private void initApiHandler() {

		// setup API handler
		ContextHandler pingHandler = new ContextHandler();
		handlers.addHandler(pingHandler);
		pingHandler.setContextPath("/ping");
		pingHandler.setHandler(new WebSocketHandler() {

			@Override
			public void configure(WebSocketServletFactory factory) {
				factory.register(PingHandler.class);
			}
		});
	}

	/**
	 * Initialize the resource handler.
	 */
	private void initResourceHandler() throws Exception {

		// Instantiate the static resource handler and add it to the collection
		ContextHandler apiHandler = new ContextHandler();
		apiHandler.setHandler(new StaticHandler(server));
		apiHandler.setContextPath("/");
		handlers.addHandler(apiHandler);
	}

	/**
	 * Start the Jetty server.
	 *
	 * @throws Exception
	 */
	private boolean startServer() {

		try {

			// start server
			server.start();
			return true;
		} catch (Exception e) {

			System.err.println("Failed to start server.");
			e.printStackTrace(System.err);
			return false;
		}
	}

	/**
	 * Stop the Jetty server.
	 *
	 * @throws Exception
	 */
	public boolean stop() {

		try {

			// stop server
			server.stop();
			return true;
		} catch (Exception e) {

			System.err.println("Failed to stop server.");
			e.printStackTrace(System.err);
			return false;
		}
	}
}
