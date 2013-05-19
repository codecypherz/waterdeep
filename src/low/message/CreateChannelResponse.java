package low.message;

public class CreateChannelResponse extends Message {

	private String token;
	
	public CreateChannelResponse(String token) {
		super(Type.CREATE_CHANNEL_RESPONSE);
		this.token = token;
	}
	
	public String getToken() {
		return token;
	}
}
