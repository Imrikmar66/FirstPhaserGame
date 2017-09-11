function Momy(sprite, game){

    this.sprite = sprite;
    this.game = game;
    
    this.stats = {
        speed: 20,
        damage: 50,
        health: 50,
        attackRange: 30
    };
    
    this.initSprite();
    
}
Momy.prototype = Object.create(Monster.prototype);
Momy.constructor = Momy
