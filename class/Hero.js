function Hero(sprite, game){
    
    this.heroAtlas = {
        Swidth : 32,
        Sheight : 32,
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
        moveB03: 11,
        attackL01: 12,
        attackL02: 13,
        attackL03: 14,
        attackR01: 15,
        attackR02: 16,
        attackR03: 17
    };
    this.stats = {
        speed: 60,
        damage: 50,
        health: 50
    };
    
    this.skills = {
        bladeRun : {
            finalPos : 0,
            range : 150,
            marker : false,
            dragInterval : false,
            active : false
        }
    }
    
    this.currentDirection = 'left';
    this.game = game;   
    this.sprite = sprite;

    this.initSprite();
    
}

Hero.prototype.initSprite = function(){
    
    this.sprite.scale.setTo(1, 1);
    this.sprite.frameName = this.heroAtlas;
    this.sprite.animations.add('moveFront', [0, 1, 2, 1]);
    this.sprite.animations.add('moveLeft', [3, 4, 5, 4]);
    this.sprite.animations.add('moveRight', [6, 7, 8, 7]);
    this.sprite.animations.add('moveBack', [9, 10, 11, 10]);
    this.sprite.animations.add('attackLeft', [12, 13, 14, 12]);
    this.sprite.animations.add('attackRight', [15, 16, 17, 15]);
    this.sprite.initCustomPhysics(this.game);
    
}

Hero.prototype.moveRight = function(){

    if(this.sprite.body.blocked.down){
        this.currentDirection = 'right';
        this.sprite.animations.play('moveRight', (0.2*this.stats.speed), false);
        this.sprite.body.velocity.x = this.stats.speed;
    }
}

Hero.prototype.moveLeft = function(){
    if(this.sprite.body.blocked.down){
        this.currentDirection = 'left';
        this.sprite.animations.play('moveLeft', (0.2*this.stats.speed), false);
        this.sprite.body.velocity.x = -this.stats.speed;
    }
}

Hero.prototype.moveFront = function(){
    this.sprite.frame = this.heroAtlas.moveF02;
    this.sprite.body.velocity.x = 0;
}

Hero.prototype.moveBack = function(){
    this.sprite.frame = this.heroAtlas.moveB02;
    this.sprite.body.velocity.x = 0;
}

Hero.prototype.jump = function(){
    if(this.sprite.body.blocked.down){
        this.sprite.body.velocity.y = -200;
    }
    if(this.sprite.body.velocity.x > 0){
        this.sprite.frame = this.heroAtlas.moveR03;
    }
    else if(this.sprite.body.velocity.x < 0){
        this.sprite.frame = this.heroAtlas.moveL03;
    }
}

Hero.prototype.attack = function(){
    if(this.currentDirection == 'left'){
        this.sprite.animations.play('attackLeft', (0.2*this.stats.speed), false);
    }
    else{
        this.sprite.animations.play('attackRight', (0.2*this.stats.speed), false);
    }
}

Hero.prototype.stop = function(){
    if(this.sprite.body.blocked.down){
        this.sprite.body.velocity.x = 0;
    }
}

Hero.prototype.bladeRun = function(direction, callback){
    
    var direction = direction/Math.abs(direction); 
    var _this = this;
    
    if(direction > 0){
        this.skills.bladeRun.finalPos = this.sprite.position.x + this.skills.bladeRun.range;
        if(this.skills.bladeRun.finalPos > this.game.world.bounds.width){
            this.skills.bladeRun.finalPos = this.game.world.bounds.width - this.sprite._frame.width;
        }
    }
    else{
        this.skills.bladeRun.finalPos = this.sprite.position.x - this.skills.bladeRun.range;
        if(this.skills.bladeRun.finalPos < 0){
            this.skills.bladeRun.finalPos = 0 + this.sprite._frame.width;
        }
    }
    this.skills.bladeRun.active = true;
    
    var bladeRunInterval = setInterval(function(){
        if(_this.sprite.position.x < _this.skills.bladeRun.finalPos && _this.skills.bladeRun.active && direction > 0){
            _this.sprite.frame = _this.heroAtlas.moveR03;
            _this.sprite.body.velocity.x = 3000;
        }
        else if(_this.sprite.position.x > _this.skills.bladeRun.finalPos && _this.skills.bladeRun.active && direction < 0){
            _this.sprite.body.velocity.x = -3000;
            _this.sprite.frame = _this.heroAtlas.moveL03;
        }
        else{
            var tempFinalPos = _this.skills.bladeRun.finalPos;
            _this.skills.bladeRun.finalPos = 0;
            _this.skills.bladeRun.active = false;
            clearInterval(bladeRunInterval);
            callback(tempFinalPos);
        }
    }, 50);
         
 }

