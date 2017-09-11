Phaser.Sprite.prototype.fadeIn = function(game){
    this.alpha = 0;
    var tween = game.add.tween(this);
    tween.to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None);
    tween.start();
}

Phaser.Sprite.prototype.initCustomPhysics = function(game){
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
}
