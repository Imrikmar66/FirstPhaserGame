function Zombie(sprite, game){

    this.sprite = sprite;
    this.game = game;

    this.stats = {
        speed: 10,
        damage: 50,
        health: 50,
        attackRange: 30
    };

    this.initSprite();

}
Zombie.prototype = Object.create(Monster.prototype);
Zombie.constructor = Zombie
