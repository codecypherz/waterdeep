package low.message;

import javax.annotation.Nullable;

import low.model.Game;

public class JoinGameResponse {

	private Result result;
	private Game game;

	public enum Result {
		ALREADY_JOINED,
		COLOR_TAKEN,
		GAME_FULL,
		NOT_FOUND,
		SUCCESS;
	}
	
	public JoinGameResponse(Result result) {
		this(result, null);
	}
	
	public JoinGameResponse(Result result, @Nullable Game game) {
		this.result = result;
		this.game = game;
	}
	
	public Result getResult() {
		return result;
	}
	
	public Game getGame() {
		return game;
	}
}
