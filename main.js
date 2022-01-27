let config = {
    type:Phaser.AUTO,
    
    scale:{
      mode:Phaser.Scale.FIT,
        width : 1000,
        height :600,
    },
    
    backgroundColor : 0xffff11,
  
       physics:{
           default:'arcade',
           arcade:{
               gravity:
               {y:1000},
               debug:false
           }


       },
       scene : {
        preload:preload,
        create : create,
        update : update,
       },
       
   };
   let game = new Phaser.Game(config);
   let player_config = {
    player_speed : 180,
    player_jumpspeed : -650,
}

   function preload(){
    this.load.image("ground","Assets/topground.png");
    this.load.image("sky","Assets/background.png");
    this.load.spritesheet("dude","Assets/dude.png",{frameWidth:32,frameHeight:48});
    this.load.image("apple","Assets/apple.png");
    }

    function create(){
        W = game.config.width;
        H = game.config.height;
        
        //add tilesprites
        let ground = this.add.tileSprite(0,H-128,W,128,'ground');
        ground.setOrigin(0,0);
        
        //try to create a background
        let background = this.add.sprite(0,0,'sky');
        background.setOrigin(0,0);
        background.displayWidth = W;
        background.displayHeight = H;
        background.depth = -2;
    
    //create rays on the top of the background
    let rays = [];
    
    for(let i=-10;i<=10;i++){
        let ray = this.add.sprite(W/2,H-100,'ray');
        ray.displayHeight = 1.2*H;
        ray.setOrigin(0.5,1);
        ray.alpha = 0.05;
        ray.angle = i*10;
        ray.depth = -1;
        rays.push(ray);
    }
      //tween
      this.tweens.add({
        targets: rays,
        props:{
            angle:{
                value : "+=30"
            },
        },
        duration : 8000,
        repeat : -1
    });

        this.player = this.physics.add.sprite(100,100,'dude',4);
        //adding bounce to player

        this.player.setBounce(0.5);
        console.log(this.player);
        this.physics.add.existing(ground,true);//static=true
  //willnot let player go outof the bounds
        this.player.setCollideWorldBounds(true);

         //player animation and movement controls
               
    this.anims.create({
        key : 'left',
        frames: this.anims.generateFrameNumbers('dude',{start:0,end:3}),
        frameRate : 10,
        repeat : -1
    });
    this.anims.create({
        key : 'center',
        frames: [{key:'dude',frame:4}],
        frameRate : 10,
    });
    this.anims.create({
        key : 'right',
        frames: this.anims.generateFrameNumbers('dude',{start:5,end:8}),
        frameRate : 10,
        repeat : -1
    });
    // keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
    
//adding fruits:(physical object{physicas applied})
         let fruits=this.physics.add.group({
         key:"apple",
         repeat:9,
         setScale:{x:0.3,y:0.3},
         setXY:{x:10,y:0,stepX:100}

         })

             
    //create more platforms
    let platforms = this.physics.add.staticGroup();
    platforms.create(500,350,'ground').setScale(2,0.5).refreshBody();
    platforms.create(700,200,'ground').setScale(2,0.5).refreshBody();
    platforms.create(100,200,'ground').setScale(2,0.5).refreshBody();
    platforms.add(ground);
    this.physics.add.overlap(this.player,fruits,eatFruit,null,this);

         //setting bounce on fruits
        fruits.children.iterate(function (f){
f.setBounce(Phaser.Math.FloatBetween(0.2,0.6));
        })

           //adding a collision detection between player and ground
           this.physics.add.collider(platforms,this.player);
         this.physics.add.collider(platforms,fruits);

           //create cameras
    this.cameras.main.setBounds(0,0,W,H);
    this.physics.world.setBounds(0,0,W,H);
    
    this.cameras.main.startFollow(this.player,true,true);
    this.cameras.main.setZoom(1.5);
    }

    function eatFruit(player,fruit){
        fruit.disableBody(true,true);
    }

    function update(){
    
        if(this.cursors.left.isDown){
            this.player.setVelocityX(-player_config.player_speed);
           this.player.anims.play('left',true);
        }
        else if(this.cursors.right.isDown){
            this.player.setVelocityX(player_config.player_speed);
            this.player.anims.play('right',true);
        }
        else{
            this.player.setVelocityX(0);
         this.player.anims.play('center');
        }
        
        //add jumping ability , stop the player when in air
        if(this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(player_config.player_jumpspeed);
        }
    }