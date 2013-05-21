package low.provider;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Nullable;
import javax.servlet.http.HttpServletRequest;

import low.message.CreateChannelResponse;
import low.message.CreateGameRequest;
import low.message.JoinGameRequest;
import low.message.JoinGameResponse;
import low.message.LeaveGameRequest;
import low.message.Message;
import low.message.PlayerJoinedMessage;
import low.message.RawMessage;
import low.message.Type;

import com.google.common.collect.Maps;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.servlet.RequestScoped;

@RequestScoped
public class RequestMessageProvider implements Provider<Message> {

	private static final Logger logger = Logger.getLogger(RequestMessageProvider.class.getName());
	
	// Register message deserializers.
	private static final Map<Type, Class<? extends Message>> TYPE_TO_CLASS = Maps.newHashMap();
	static {
		TYPE_TO_CLASS.put(Type.CREATE_CHANNEL_RESPONSE, CreateChannelResponse.class);
		TYPE_TO_CLASS.put(Type.CREATE_GAME_REQUEST, CreateGameRequest.class);
		TYPE_TO_CLASS.put(Type.JOIN_GAME_REQUEST, JoinGameRequest.class);
		TYPE_TO_CLASS.put(Type.JOIN_GAME_RESPONSE, JoinGameResponse.class);
		TYPE_TO_CLASS.put(Type.LEAVE_GAME_REQUEST, LeaveGameRequest.class);
		TYPE_TO_CLASS.put(Type.PLAYER_JOINED, PlayerJoinedMessage.class);
	}
	
	private final Provider<HttpServletRequest> requestProvider;
	
	private Message message;
	private boolean parsed;
	
	@Inject
	public RequestMessageProvider(Provider<HttpServletRequest> requestProvider) {
		this.requestProvider = requestProvider;
		this.message = null;
		this.parsed = false;
	}
	
	@Nullable
	public Message get() {
		
		if (parsed) {
			return message;
		}
		
		String rawJson = getRawJson();
		if (rawJson != null) {
			
			// Make the first parse pass extract the type so the full contents
			// can be deserialized by GSON in the next pass.
			Gson gson = new Gson();
			RawMessage rawMessage = gson.fromJson(rawJson, RawMessage.class);
			Type type = Type.valueOf(rawMessage.getType().toUpperCase());
			logger.info("Parsed this message type from the request: " + type);
			
			message = gson.fromJson(rawJson, TYPE_TO_CLASS.get(type));
		}
		
		parsed = true;
		return message;
	}
	
	/**
	 * @return The raw JSON string from the request.
	 */
	@Nullable
	private String getRawJson() {
		HttpServletRequest req = requestProvider.get();
		BufferedReader reader = null;
		try {
			
			reader = req.getReader();
			StringBuilder sb = new StringBuilder();
			String line = reader.readLine();
			while (line != null) {
				sb.append(line + "\n");
				line = reader.readLine();
			}
			return sb.toString();
			
		} catch (IOException e) {
			logger.log(Level.SEVERE, "Failed to parse the JSON: ", e);
			return null;
		} finally {
			if (reader != null) {
				try {
					reader.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
}
