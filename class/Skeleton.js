function Skeleton(sprite, game){

    this.sprite = sprite;
    this.game = game;
    
    this.stats = {
        speed: Tools.randomBetween(10, 30),
        damage: 40,
        health: 50,
        attackRange: 30
    };
    
    this.initSprite();
    
}
Skeleton.prototype = Object.create(Monster.prototype);
Skeleton.constructor = Skeleton;
