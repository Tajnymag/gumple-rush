var GumpleRush = GumpleRush || {};

GumpleRush.game = new Phaser.Game(720, 405, Phaser.AUTO, "", null, false, false);
GumpleRush.game.state.add("Boot", GumpleRush.Boot);
GumpleRush.game.state.add("Preload", GumpleRush.Preload);
GumpleRush.game.state.add("Menu", GumpleRush.Menu);
GumpleRush.game.state.add("Gympl", GumpleRush.Gympl);
GumpleRush.game.state.add("Honsey_Kong", GumpleRush.Honsey_Kong);

GumpleRush.game.state.start("Boot");
