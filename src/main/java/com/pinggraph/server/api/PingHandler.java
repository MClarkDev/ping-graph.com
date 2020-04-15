package com.pinggraph.server.api;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;

import com.pinggraph.core.StatsCollector;

@WebSocket
public class PingHandler {

	@OnWebSocketClose
	public void onClose(int statusCode, String reason) {
		StatsCollector.getInstance().incrementCounter("clr");
	}

	@OnWebSocketError
	public void onError(Throwable t) {
		StatsCollector.getInstance().incrementCounter("err");
		System.out.println("Error: " + t.getMessage());
	}

	@OnWebSocketConnect
	public void onConnect(Session session) {
		StatsCollector.getInstance().incrementCounter("new");
		System.out.println("Connect: " + session.getRemoteAddress().getAddress());
	}

	@OnWebSocketMessage
	public void onMessage(Session session, String text) {
		StatsCollector.getInstance().incrementCounter("msg");
		try {
			session.getRemote().sendString("pong");
		} catch (Exception e) {
		}
	}
}
