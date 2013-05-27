package low.service;

import low.annotation.ClientId;
import low.message.Message;
import low.model.Game;
import low.model.Player;

import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Provider;

/**
 * Responsible for sending/receiving messages to players.
 */
public class MessageService {

	private final ChannelService channelService;
	private final @ClientId Provider<String> clientIdProvider;
	
	@Inject
	public MessageService(
			ChannelService channelService,
			@ClientId Provider<String> clientIdProvider) {
		this.channelService = channelService;
		this.clientIdProvider = clientIdProvider;
	}
	
	/**
	 * Broadcasts a message to all the players in the game except for self.
	 * @param game The game to which to broadcast.
	 * @param message The message to send to all but the self player.
	 */
	public void broadcast(Game game, Message message) {
		broadcast(game, message, false);
	}
	
	/**
	 * Broadcasts a message to all the players in the game.
	 * @param game The game to which to broadcast.
	 * @param message The message to send.
	 * @param includeSelf True if the message should be sent to this client's player.
	 */
	public void broadcast(Game game, Message message, boolean includeSelf) {
		String clientId = clientIdProvider.get();
		for (Player player : game.getPlayers()) {
			boolean isSelf = clientId.equals(player.getClientId());
			if (!isSelf || includeSelf) {
				send(player, message);
			}
		}
	}
	
	/**
	 * Sends a message to the given player.
	 * @param player
	 * @param message
	 */
	public void send(Player player, Message message) {
		send(player.getClientId(), message);
	}

	/**
	 * Sends a message to the client identified by the client ID.
	 * @param clientId
	 * @param message
	 */
	public void send(String clientId, Message message) {
		Gson gson = new Gson();
		String messageString = gson.toJson(message);
		ChannelMessage channelMessage = new ChannelMessage(clientId, messageString);
		channelService.sendMessage(channelMessage);
	}
}
