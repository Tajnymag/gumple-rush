var GumpleRush = GumpleRush || {};
var hrac = hrac || {};

GumpleRush.Gympl = function() {};
GumpleRush.Gympl.prototype = {

  preload: function() {
    this.time.advancedTiming = true;
    this.game.load.image("background", "assets/gumple/gymplik_one.png");
  },
  create: function() {

    this.game.add.sprite(0, 0, "background");

    this.mapa = this.game.add.tilemap("gymplik");
    this.game.stage.backgroundColor = "#0b7cb4";
    this.mapa.addTilesetImage("final_version", "textury");

    this.kolize = this.mapa.createLayer("kolize");
    this.mapa.setCollisionBetween(1, 100000, true, "kolize");
    this.game.world.setBounds(0, 0, 1200, 720);

    this.game.nastaveniKolize(this.kolize, [18, 44, 45, 48, 49, 52, 53], false, false, true, false);

    //stvoření hráče
    this.hrac = this.game.add.sprite(300, 600, "ruza");
    this.game.physics.arcade.enable(this.hrac);
    this.hrac.body.gravity.y = 1000;
    this.hrac.animations.add("beh", [2, 3], 5, true);
    this.hrac.animations.add("klid", [0, 4], 1, true);
    this.hrac.animations.add("skrceni", [4, 4], 1, true);
    this.hrac.body.drag.x = 5000;

    this.game.camera.follow(this.hrac, Phaser.Camera.FOLLOW_PLATFORMER);

    this.npc = this.game.add.group();
    this.veronika = this.add.sprite(400, 400, "veronika");
    this.game.physics.arcade.enable(this.veronika);
    this.veronika.animations.add("beh", [1, 2], 5, true);
    this.veronika.animations.play("beh");
    this.veronika.body.velocity.x = 30;
    this.veronika.body.bounce.x = 1;
    this.veronika.body.gravity.y = 1000;
    this.veronika.anchor.setTo(0.5, 0.5);

    this.vlasta = this.game.add.sprite(500, 600, "vlasta");
    this.game.physics.arcade.enable(this.vlasta);
    this.vlasta.body.gravity.y = 1000;
    this.vlasta.animations.add("beh", [0, 1], 5, true);
    this.vlasta.animations.play("beh");
    this.vlasta.body.velocity.x = 50;
    this.vlasta.body.bounce.x = 1;
    this.vlasta.anchor.setTo(0.5, 0.5);

    this.detektor1 = this.add.sprite(400, 603, "detektor");
    this.detektor1.alpha = 0; //ve finální verzi nastavit na 0
    this.game.physics.arcade.enable(this.detektor1);

    this.gaudeamus = this.game.add.audio("gaudeamus");
    this.gaudeamus.loop = true;
    this.gaudeamus.volume = 0.4;
    this.gaudeamus.play();

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
    };
    this.skok = this.game.add.audio("skok");
    this.skok.volume = 0.6;

    this.klavesaF = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
    this.klavesaF.onDown.add(this.celaObrazovka, this);

    stisk_a = false;
    stisk_b = false;
    stisk_l = false;
    stisk_p = false;

    if (!this.game.device.desktop) {
      this.game.input.onDown.add(this.celaObrazovkaMobil, this);
      this.game.nacteniGamepadu();
    }
  },
  celaObrazovkaMobil: function() {
    this.game.scale.startFullScreen(false);
  },
  celaObrazovka: function() {
    if (this.game.scale.isFullScreen) {
      this.game.scale.stopFullScreen();
    } else {
      this.game.scale.startFullScreen(false);
    }
  },
  update: function() {
    this.game.physics.arcade.collide(this.hrac, this.kolize);
    this.game.physics.arcade.collide(this.vlasta, this.kolize);
    this.game.physics.arcade.collide(this.veronika, this.kolize);

    if ((this.wasd.up.isDown || this.cursors.up.isDown || stisk_a) && this.hrac.body.blocked.down) {
      this.hrac.body.velocity.y = -350;
      this.skok.play();
    }
    if (this.cursors.right.isDown || this.wasd.right.isDown || stisk_p) {
      this.hrac.body.velocity.x = 300;
      this.hrac.animations.play("beh");
    } else if (this.cursors.left.isDown || this.wasd.left.isDown || stisk_l) {
      this.hrac.body.velocity.x = -300;
      this.hrac.animations.play("beh");
    } else if ((this.wasd.down.isDown || this.cursors.down.isDown || stisk_b) && this.hrac.body.blocked.down) {
      this.hrac.animations.play("skrceni");
    } else {
      this.hrac.animations.play("klid");
    }

    if (this.game.physics.arcade.overlap(this.hrac, this.detektor1) && (this.wasd.down.isDown || this.cursors.down.isDown || stisk_b)) {
      this.gaudeamus.stop();
      this.game.state.start("Honsey_Kong");
    }

    if (this.veronika.x >= 900) {
      this.veronika.body.velocity.x = -30;
      this.veronika.scale.x *= -1;
    } else if (this.veronika.body.blocked.left) {
      this.veronika.scale.x *= -1;
    }

    if (this.vlasta.body.blocked.left || this.vlasta.body.blocked.right) {
      this.vlasta.scale.x *= -1;
    }

    if (this.game.input.currentPointers == 0 && !this.game.input.activePointer.isMouse) {
      stisk_a = false;
      stisk_b = false;
      stisk_l = false;
      stisk_p = false;
    }
  },
  render: function() {
    this.game.debug.text(this.game.time.fps || 'neviem', 10, 10, "#1ec133", "Press Start 2P");
  }
};
