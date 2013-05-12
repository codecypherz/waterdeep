package low.message;

public class JoinGameResponse {

	private Result result;

	public enum Result {
		COLOR_TAKEN,
		SUCCESS;
	}
	
	public JoinGameResponse(Result result) {
		this.result = result;
	}
	
	public Result getResult() {
		return result;
	}
}
