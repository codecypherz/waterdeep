package low.message;

import low.model.Player;

public class PlayerJoinedMessage extends Message {

	private Player player;
	
	public PlayerJoinedMessage(Player player) {
		super(Type.PLAYER_JOINED);
		this.player = player;
	}
	
	public Player getPlayer() {
		return player;
	}
}
