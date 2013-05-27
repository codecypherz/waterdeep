package low.message;

import low.model.Game;

public class StartGameNotification extends Message {

	private Game game;
	
	public StartGameNotification(Game game) {
		super(Type.START_GAME_NOTIFICATION);
		this.game = game;
	}
	
	public Game getGame() {
		return this.game;
	}
}
