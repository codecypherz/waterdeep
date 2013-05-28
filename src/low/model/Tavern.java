package low.model;

/**
 * Represents the resources in a player's tavern such as gold, fighters, etc.
 */
public class Tavern {
	
	private int gold;
	
	public Tavern() {
		gold = 0;
	}
	
	public int getGold() {
		return gold;
	}
	public void setGold(int gold) {
		this.gold = gold;
	}
}
