package low.message;

import low.model.Player;

public class PlayerJoinedMessage {

	private Player player;
	
	public PlayerJoinedMessage(Player player) {
		this.player = player;
	}
	
	public Player getPlayer() {
		return player;
	}
}
