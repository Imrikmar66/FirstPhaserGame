function CustomGroup(group, game){
    
    this.group = group;
    this.game = game;
    this.stats = {
        groupSize : 6
    };
    this.children = [];
    this.enemiesSet = ['Ork','Momy','Skeleton','Death','Zombie']
}

CustomGroup.prototype.generateEnemies = function(){
    
    for (var i=this.group.countLiving(); i<this.stats.groupSize; i++){
        var type = this.enemiesSet[Tools.randomBetween(0, this.enemiesSet.length)];
        var sprite;
        var enemy;
        
        switch(type){
            case ('Ork') :
                sprite = this.group.create(Tools.randomBetween(0, this.game.world.bounds.bottomRight.x), this.game.groundLimit, 'Ork');
                enemy = new Ork(sprite, this.game);
                break;
            case ('Momy') :
                sprite = this.group.create(Tools.randomBetween(0, this.game.world.bounds.bottomRight.x), this.game.groundLimit, 'Momy');
                enemy = new Momy(sprite, this.game);
                break;
            case ('Skeleton') :
                sprite = this.group.create(Tools.randomBetween(0, this.game.world.bounds.bottomRight.x), this.game.groundLimit, 'Skeleton');
                enemy = new Skeleton(sprite, this.game);
                break;
            case ('Death') :
                sprite = this.group.create(Tools.randomBetween(0, this.game.world.bounds.bottomRight.x), this.game.groundLimit, 'Death');
                enemy = new Death(sprite, this.game);
                break;
            case ('Zombie') :
                sprite = this.group.create(Tools.randomBetween(0, this.game.world.bounds.bottomRight.x), this.game.groundLimit, 'Zombie');
                enemy = new Zombie(sprite, this.game);
                break;
        }
        this.children.push(enemy);
    }
}
CustomGroup.prototype.moveAndAttack = function(target){
   
    for(var i in this.children){
        var child = this.children[i];
        
        if(child.stats.attackRange > Math.abs(child.sprite.position.x - target.sprite.position.x)){
            child.attack(target);
        }
        else if(child.sprite.position.x < target.sprite.position.x){
            child.moveRight();
        }
        else{
            child.moveLeft();
        }
    }
    
}
