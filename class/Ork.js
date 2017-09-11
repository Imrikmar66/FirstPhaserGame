function Ork(sprite, game){

    this.sprite = sprite;
    this.game = game;
    
    this.stats = {
        speed: 50,
        damage: 50,
        health: 50,
        attackRange: 30
    };
    
    this.initSprite();
    
}
Ork.prototype = Object.create(Monster.prototype);
Ork.constructor = Ork
