package low.message;

import low.model.Player;

public class PlayerLeftMessage extends Message {

	/**
	 * The player that left.
	 */
	private Player player;
	
	/**
	 * If the player that left was the moderator, this is the player chosen as
	 * the new moderator.
	 */
	private Player moderator;
	
	public PlayerLeftMessage(Player player, Player moderator) {
		super(Type.PLAYER_LEFT);
		this.player = player;
		this.moderator = moderator;
	}
	
	public Player getPlayer() {
		return player;
	}
	
	public Player getModerator() {
		return moderator;
	}
}
