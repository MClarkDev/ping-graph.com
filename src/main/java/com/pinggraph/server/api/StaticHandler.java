package com.pinggraph.server.api;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.AbstractHandler;
import org.eclipse.jetty.server.handler.ResourceHandler;

public class StaticHandler extends AbstractHandler {

	private ResourceHandler resources;

	public StaticHandler(Server server) throws Exception {

		resources = new ResourceHandler();
		resources.setServer(server);
		resources.setResourceBase("resources");
		resources.setRedirectWelcome(true);
		resources.setWelcomeFiles(new String[] { "index.html" });
		resources.start();
	}

	@Override
	public void handle(String target, Request baseRequest, HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {

		// change protocol if passed via proxy
		String proto = request.getHeader("X-Forwarded-Proto");
		if (proto != null) {
			baseRequest.getMetaData().getURI().setScheme(proto);
		}

		// call through to resources
		baseRequest.setHandled(false);
		resources.handle(target, baseRequest, request, response);
	}
}
