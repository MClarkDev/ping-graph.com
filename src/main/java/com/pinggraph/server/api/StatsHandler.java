package com.pinggraph.server.api;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.handler.AbstractHandler;

import com.pinggraph.core.StatsCollector;

public class StatsHandler extends AbstractHandler {

	private final StatsCollector stats;

	public StatsHandler() {

		stats = StatsCollector.getInstance();
	}

	@Override
	public void handle(String target, Request baseRequest, HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {

		// set response handled
		baseRequest.setHandled(true);
		response.setStatus(HttpServletResponse.SC_OK);

		// dump statistics to stream
		response.getOutputStream().println(stats.dumpJSON().toString());
	}
}
