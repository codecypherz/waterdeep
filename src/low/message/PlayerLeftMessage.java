package low.message;

import low.model.Player;

public class PlayerLeftMessage extends Message {

private Player player;
	
	public PlayerLeftMessage(Player player) {
		super(Type.PLAYER_LEFT);
		this.player = player;
	}
	
	public Player getPlayer() {
		return player;
	}
}
