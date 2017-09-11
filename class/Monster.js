function Monster(sprite, game){
  
    this.sprite = sprite;
    this.game = game;
    this.stats = {
        speed: Tools.randomBetween(30, 50),
        damage: 50,
        health: 50,
        attackRange: 50
    };
    this.initSprite();
    
}

Monster.monsterAtlas = {
        moveF01: 0,
        moveF02: 1,
        moveF03: 2,
        moveL01: 3,
        moveL02: 4,
        moveL03: 5,
        moveR01: 6,
        moveR02: 7,
        moveR03: 8,
        moveB01: 9,
        moveB02: 10,
        moveB03: 11
    };

Monster.prototype.initSprite = function(){
    
    this.sprite.fadeIn(this.game);
    this.sprite.initCustomPhysics(this.game);
    this.sprite.animations.add('moveFront', [0, 1, 2, 1]);
    this.sprite.animations.add('moveLeft', [3, 4, 5, 4]);
    this.sprite.animations.add('moveRight', [6, 7, 8, 7]);
    this.sprite.animations.add('moveBack', [9, 10, 11, 10]);
    
}
Monster.prototype.moveRight = function(){
    this.sprite.animations.play('moveRight', (0.2*this.stats.speed), false);
    this.sprite.body.velocity.x = this.stats.speed;
}

Monster.prototype.moveLeft = function(){
    this.sprite.animations.play('moveLeft', (0.2*this.stats.speed), false);
    this.sprite.body.velocity.x = -this.stats.speed;
}

Monster.prototype.attack = function(){
    this.stop();
}

Monster.prototype.stop = function(){
    this.sprite.frame = Monster.moveF02;
    this.sprite.body.velocity.x = 0;
}