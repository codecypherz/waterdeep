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
 * Responsible for sending messages to players.
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
		String clientId = clientIdProvider.get();
		for (Player player : game.getPlayers()) {
			if (!clientId.equals(player.getClientId())) {
				send(player, message);
			}
		}
	}
	
	/**
	 * Sends a message to the given player.
	 * @param player
	 * @param message
	 */
	private void send(Player player, Message message) {
		String clientId = player.getClientId();
		Gson gson = new Gson();
		String messageString = gson.toJson(message);
		ChannelMessage channelMessage = new ChannelMessage(clientId, messageString);
		channelService.sendMessage(channelMessage);
	}
}
