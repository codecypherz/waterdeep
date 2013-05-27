
goog.provide('low.ui.game.Players');

goog.require('goog.array');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventType');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('low');
goog.require('low.service.Game');
goog.require('low.ui');
goog.require('low.ui.game.Player');
goog.require('low.ui.game.PlayerTab');
goog.require('low.ui.game.soy');



/**
 * This component shows all the information about all the players.
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.game.Players = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.game.Players');

  var gameService = low.service.Game.getInstance();
  var game = gameService.getCurrentGame();

  /** @private {!Array.<!low.ui.game.PlayerTab>} */
  this.tabs_ = [];

  /** @private {!Object.<!low.ui.game.Player>} */
  this.tabIdToPlayer_ = {};

  goog.array.forEach(game.getPlayers(), function(player) {

    // Create the tab and component for the player.
    var playerTab = new low.ui.game.PlayerTab(player);
    this.addChild(playerTab);
    var playerComponent = new low.ui.game.Player(player);
    this.addChild(playerTab);

    // Keep track of the tab and player components.
    this.tabs_.push(playerTab);
    this.tabIdToPlayer_[goog.getUid(playerTab)] = playerComponent;

  }, this);
};
goog.inherits(low.ui.game.Players, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
low.ui.game.Players.Id_ = {
  TAB_CONTAINER: low.getUniqueId('tab-container'),
  PLAYER_CONTAINER: low.getUniqueId('player-container')
};


/**
 * @enum {string}
 * @private
 */
low.ui.game.Players.Css_ = {
  SELECTED: goog.getCssName('player-selected')
};


/** @override */
low.ui.game.Players.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      low.ui.game.soy.PLAYERS, {
        ids: this.makeIds(low.ui.game.Players.Id_)
      }));

  var tabContainer = low.ui.getElementByFragment(
      this, low.ui.game.Players.Id_.TAB_CONTAINER);
  var playerContainer = low.ui.getElementByFragment(
      this, low.ui.game.Players.Id_.PLAYER_CONTAINER);

  // TODO Render players in turn order.
  goog.array.forEach(this.tabs_, function(tab) {
    tab.render(tabContainer);
    var playerComponent = this.tabIdToPlayer_[goog.getUid(tab)];
    playerComponent.render(playerContainer);
  }, this);
};


/** @override */
low.ui.game.Players.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  goog.array.forEach(this.tabs_, function(tab) {
    this.getHandler().listen(tab.getElement(),
        goog.events.EventType.CLICK,
        goog.bind(this.select_, this, tab));
  }, this);

  // Select the first tab.
  this.select_(this.tabs_[0]);
};


/**
 * Selects the given tab.
 * @param {!low.ui.game.PlayerTab} tabToSelect
 * @private
 */
low.ui.game.Players.prototype.select_ = function(tabToSelect) {
  var selectedPlayer = tabToSelect.getPlayer();
  goog.log.info(this.logger, 'Selecting ' + selectedPlayer.getName());

  goog.array.forEach(this.tabs_, function(tab) {

    // Update the tab CSS.
    var selected = tab == tabToSelect;
    goog.dom.classlist.enable(
        tab.getElement(),
        low.ui.game.Players.Css_.SELECTED,
        selected);

    // Update the player component visibility.
    var playerComponent = this.tabIdToPlayer_[goog.getUid(tab)];
    goog.style.setElementShown(playerComponent.getElement(), selected);

  }, this);
};
