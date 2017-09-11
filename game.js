var game  = new Phaser.Game(960, 640, Phaser.CANVAS, "gameContainer");
game.GAME_CONFIG = {
    width : 960,
    height: 640,
    gravity : 500,
    spawnTime : 500,
    map:{
      height: 600,
      width: 1500
    },
    ground: {
        width: 1500,
        height: 250
    },
    characterSprite: {
        width: 32,
        height: 32
    }
};

var mainState = {

    preload: function(){

        game.stage.backgroundColor = '#83DDF8';
        //Map assets
        game.load.image('ground', 'assets/ground.png');
        game.load.image('grass', 'assets/grass.png');

        //Particles
        game.load.image('', 'assets/particles/bladeRun.png');

        //Characters assets
        game.load.atlas('warrior', 'assets/characters/actions/Thief.png', 'assets/atlas/warrior.json');
        game.load.atlas('Ork', 'assets/enemies/Ork.png', 'assets/atlas/warrior.json');
        game.load.atlas('Momy', 'assets/enemies/Momy.png', 'assets/atlas/warrior.json');
        game.load.atlas('Skeleton', 'assets/enemies/Skeleton.png', 'assets/atlas/warrior.json');
        game.load.atlas('Zombie', 'assets/enemies/Zombie.png', 'assets/atlas/warrior.json');
        game.load.atlas('Death', 'assets/enemies/Death.png', 'assets/atlas/warrior.json');

        //Skills assets
        game.load.image('bladeRun', 'assets/spell/bladeRun.png');
        game.load.image('spellButton1', 'assets/spell/button/wing.png');

    },

    create: function(){

        //Init physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = game.GAME_CONFIG.gravity;

        //Adding map element
        game.groundY = game.GAME_CONFIG.height - (game.GAME_CONFIG.ground.height/2);
        game.world.setBounds(0, 0, game.GAME_CONFIG.map.width, game.groundY);

        this.ground = this.game.add.tileSprite(0, game.groundY, game.GAME_CONFIG.ground.width, game.GAME_CONFIG.ground.height, 'ground');
        game.physics.enable(this.ground, Phaser.Physics.ARCADE);
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;

        this.grass = this.game.add.tileSprite(0, (game.groundY - game.cache.getImage('grass').height), game.GAME_CONFIG.ground.width, game.cache.getImage('grass').height, 'grass');

        //Adding Hero
        game.groundLimit = game.groundY - game.GAME_CONFIG.characterSprite.height;
        var heroSprite = this.game.add.sprite(game.world.centerX, game.groundLimit, 'warrior');
        this.hero = new Hero(heroSprite, game);

        //Declare cursors and keyboard
        this.cursors = game.input.keyboard.createCursorKeys();
        this.cursors.jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.cursors.attack = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.spellButton1 = game.add.sprite(0.3*game.GAME_CONFIG.width, game.GAME_CONFIG.height-100, 'spellButton1');
        this.spellButton1.fixedToCamera = true;
        //Start enabling input+drag
        this.spellButton1.inputEnabled = true;
        this.spellButton1.input.enableDrag();
        this.spellButton1.events.onDragStart.add(this.startDrag, this);
        this.spellButton1.events.onDragStop.add(this.stopDrag, this);

        //Attach event
        //this.cursors.jump.onDown.add(this.hero['bladeRun'], this.hero);


        //Adding Ennemy
        var groups = game.add.physicsGroup();
        this.enemies = new CustomGroup(groups, game);
        this.enemies.generateEnemies();

        //new Timer for Enemy Waves
        this.updateElapsed = 0;

        //Camera follow
        game.camera.follow(this.hero.sprite, Phaser.Camera.FOLLOW_PLATFORMER);

    },

    update: function(){

        //Comand gestion
        if(this.cursors.left.isDown){
            this.hero.moveLeft();
        }
        else if(this.cursors.right.isDown){
            this.hero.moveRight();
        }
        else if(this.cursors.up.isDown){
            this.hero.moveBack();
        }
        else if(this.cursors.down.isDown){
            this.hero.moveFront();
        }
        else{
            this.hero.stop();
        }

        if(this.cursors.attack.isDown){
            this.hero.attack();
        }
        if(this.cursors.up.isDown || this.cursors.jump.isDown){
            this.hero.jump();
        }

        //Waves generations
        this.updateElapsed ++;
        if(this.updateElapsed == game.GAME_CONFIG.spawnTime){
            this.updateElapsed = 0;
            this.enemies.generateEnemies();
        }

        //Order enemies
        this.enemies.moveAndAttack(this.hero);

        //Manage collision
        game.physics.arcade.overlap(this.hero.sprite, this.enemies.group, this.collisionHandler, null, this);

    },

    collisionHandler : function(hero, enemy){
        if(this.hero.skills.bladeRun.active){
            enemy.kill();
        }
    },

    startDrag : function(){
        this.spellButton1.startDragPosition = {x: 0, y: 0};
        this.spellButton1.startDragPosition.x = this.spellButton1.cameraOffset.x;
        this.spellButton1.startDragPosition.y = this.spellButton1.cameraOffset.y;
        this.hero.skills.bladeRun.marker = game.add.sprite(this.hero.sprite.position.x + this.hero.sprite.width/2, this.hero.sprite.position.y, 'bladeRun');
        this.hero.skills.bladeRun.marker.scale.x = 0;
        var _this = this;
        this.hero.skills.bladeRun.dragInterval = setInterval(function(){
            var toRight = true;
            _this.hero.skills.bladeRun.marker.position.x = _this.hero.sprite.position.x + _this.hero.sprite.width/2;
            if(_this.spellButton1.cameraOffset.x > _this.spellButton1.startDragPosition.x){
                _this.hero.skills.bladeRun.marker.scale.x = 1;
                if(_this.hero.sprite.body.velocity.x == 0){
                    _this.hero.sprite.frame = _this.hero.heroAtlas.moveR03;
                }
            }else{
                _this.hero.skills.bladeRun.marker.scale.x = -1;
                if(_this.hero.sprite.body.velocity.x == 0){
                    _this.hero.sprite.frame = _this.hero.heroAtlas.moveL03;
                }
            }
        }, 50);
    },
    stopDrag : function(){

        game.camera.follow(null);
        clearInterval(this.hero.skills.bladeRun.dragInterval);
        this.hero.skills.bladeRun.marker.kill();
        var direction = this.spellButton1.cameraOffset.x - this.spellButton1.startDragPosition.x;
        var tweenSpellButton1 = game.add.tween(this.spellButton1.cameraOffset).to({ x: this.spellButton1.startDragPosition.x, y: this.spellButton1.startDragPosition.y}, 50);
        tweenSpellButton1.start();
        var _this = this;
        this.hero.bladeRun(direction, function(posX){
            var cameraFollow = game.add.tween(game.camera).to({x: posX- (game.camera.width / 2)}, 500);
            cameraFollow.onComplete.add(function(){
                game.camera.follow(_this.hero.sprite, Phaser.Camera.FOLLOW_PLATFORMER);
            }, this);
            cameraFollow.start();
        });
    }

};

game.state.add('main', mainState);
game.state.start('main');
