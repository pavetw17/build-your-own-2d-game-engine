/*
 * File: MyGame.js 
 * This is the logic of our game. 
 * 
 * 设定：
 * 行驶速度：hero>RN>merchant.
 * 血量：hero>>RN>merchant(主角光环)
 * 先初设攻击为相同速度（发弹速度）、相同威力（击中后的减血值）
 * hero的发弹速度由玩家控制。
 * 
 * 两个viewport
 * 小的用来放大hero附近情况
 * 大的显示全局
 * 
 * 界面：
 * mygame为游戏主界面
 * 有一个初始界面start:介绍游戏背景及玩法，区别不同船只
 * 两个结束界面：die/win
 * die:可以restart游戏
 *win:获取称号
 *
 *一个界面最多5只商船和5只军舰吧，直接用10个对象，击沉设为null后，才能初始化
 *
 *以下代码来自10.1的MyGame.js
 *需要依照4.6添加音乐
 *
 *
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
  GameObject, TiledGameObject, Hero, Minion, Dye, Light, ture */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function NightMyGame() {
    this.kbg = "assets/bg.png";
    this.khero = "assets/hero.png";
    this.krn = "assets/rn.png";
   this.kmerchant = "assets/merchant.png"; 
 this.kbulletH = "assets/prop_bomb.png";
    this.kbulletE = "assets/prop_bomb.png";
    this.kRedHeard = "assets/red_heart.png"; 
    this.kExp = "assets/exp.png"; 
    this.kBound = "assets/bound.png"; 
    this.kHpBar = "assets/hpBar.png";
    this.kExpBar = "assets/expBar.png";
    this.kPropIncHP = "assets/wine.png";
    this.kPropIncHS = "assets/hat.png";
     this.kbullet = "assets/prop_bomb.png";
     this.kPropIncBLTS = "assets/bullet2.png";
     
     this.kCue = "assets/sounds/fire.mp3";
     
    // The camera to view the scene
    this.mCamera = null;
    
    //数值
    this.mHP= 0;
    this.mEXP = 0;
    this.Bflag = 0;
    this.bufftime = 0;
    this.FireCD = 0;
    this.mGlobalLightSet = null;

    this.mbg = null;

    this.mhero = null;  
    
     this.mBulletH = [];//hero
     this.mBulletE = [];//enemy
     
     this.mMerchant = [];
     this.Timermerchant = [];
    
     this.mRN = [];
     this.Timerrn = [];
     
     this.preTchRn = [];
     this.preTchMct = [];
     this.curTchRn = [];
     this.curTchMct = [];
     this.preHTchBlt = false;
     this.curHTchBlt = false;
     this.preRnTchBlt = false;
     this.curRnTchBlt= false;
     this.preMctTchBlt = false;
     this.curMctTchBlt = false;
     this.preHeroTchPrp = false;
     this.curHeroTchPrp = false;
    
        
    this.mRedHeard = null;  
    this.mExp = null;
    this.hpBound = null;
    this.expBound = null;
    this.hpBar = null;
    this.expBar = null;
    this.mTheLight = null;
    
    //道具
    this.mProps = [];
}
gEngine.Core.inheritPrototype(NightMyGame, Scene);

NightMyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kbg);
    gEngine.Textures.loadTexture(this.khero);
    gEngine.Textures.loadTexture(this.krn);
    gEngine.Textures.loadTexture(this.kmerchant);
    gEngine.Textures.loadTexture(this.kbulletE);
    gEngine.Textures.loadTexture(this.kbulletH);
    gEngine.Textures.loadTexture(this.kRedHeard);
    gEngine.Textures.loadTexture(this.kExp);
    gEngine.Textures.loadTexture(this.kBound);
    gEngine.Textures.loadTexture(this.kHpBar);
    gEngine.Textures.loadTexture(this.kExpBar);
    gEngine.Textures.loadTexture(this.kPropIncHP);
    gEngine.Textures.loadTexture(this.kPropIncHS);
    gEngine.Textures.loadTexture(this.kPropIncBLTS);
    
    gEngine.AudioClips.loadAudio(this.kCue);
    
};

NightMyGame.prototype.unloadScene = function () {
   gEngine.Textures.unloadTexture(this.kbg);
   gEngine.Textures.unloadTexture(this.khero);
    gEngine.Textures.unloadTexture(this.krn);
    gEngine.Textures.unloadTexture(this.kmerchant);
    gEngine.Textures.unloadTexture(this.kbulletE);
    gEngine.Textures.unloadTexture(this.kbulletH);
    gEngine.Textures.unloadTexture(this.kRedHeard);
    gEngine.Textures.unloadTexture(this.kExp);
    gEngine.Textures.unloadTexture(this.kBound);
    gEngine.Textures.unloadTexture(this.kHpBar);
    gEngine.Textures.unloadTexture(this.kExpBar);
    gEngine.Textures.unloadTexture(this.kPropIncBLTS);
    
    gEngine.AudioClips.unloadAudio(this.kCue);
  
};

NightMyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this._initializeLights();
    var v = gEngine.DefaultResources.getGlobalAmbientColor();
    v[0]=0.15;
    v[1]=0.15;
    v[2]=0.15;
    this.mHP=100;
    this.mEXP = 0;
  var i = 0;
     for(i = 0; i<=6;i++){
            this.Timermerchant[i] = 100;
        }
       var i = 0;
     for(i = 0; i<=6;i++){
            this.Timerrn[i] = 100;
        }
     for(i = 0; i <= 6; i++){
         this.preTchRn[i] = false;
     }
     for(i = 0; i <= 6; i++){
         this.preTchMct[i] = false;
     }
     this.mTheLight = new Light();

    this.mTheLight.setFar(20);
    this.mTheLight.setNear(10);
    this.mTheLight.setZPos(0);
    this.mTheLight.setXPos(0);
    this.mTheLight.setYPos(0);  // Position above LMinion
    this.mTheLight.setColor([1, 1, 0, 1]);
     
    this.mbg = new LightRenderable(this.kbg);
    this.mbg.getXform().setPosition(0, 0);
    this.mbg.getXform().setSize(100,50 );
    this.mbg.setElementPixelPositions(0, 512, 0,256);
     this.mbg.addLight(this.mTheLight);
     this.mhero = new NightHero(this.khero);  
     this.mhero.getRenderable().addLight(this.mTheLight);
    //RN一出场,出来1个
    //this.mrn1 = new RoyalNavy(this.krn, 55, 40*Math.random()-18); 
    //merchant一出场,出来1个
   // this.mmerchant1 = new Merchant(this.kmerchant);
   

    
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        100,                       // width of camera
        [0, 0, 1024, 512]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        
    this.mRedHeard = new LightRenderable(this.kRedHeard);
    this.mRedHeard.setColor([1, 1, 1, 0]);
    this.mRedHeard.getXform().setPosition(-45, -21.5);
    this.mRedHeard.getXform().setSize(2, 2);
    this.mRedHeard.setElementPixelPositions(0, 256, 0, 256);
    this.mRedHeard.addLight(this.mGlobalLightSet.getLightAt(0));
    
    this.mExp = new LightRenderable(this.kExp);
    this.mExp.setColor([1, 1, 1, 1]);
    this.mExp.getXform().setPosition(-30, -21.5);
    this.mExp.getXform().setSize(5, 3);
    this.mExp.setElementPixelPositions(0, 256, 0, 128);
    this.mExp.addLight(this.mGlobalLightSet.getLightAt(0));
    
    this.hpBound = new LightRenderable(this.kBound);
    this.hpBound.setColor([1, 1, 1, 1]);
    this.hpBound.getXform().setPosition(-38.5, -21.5);
    this.hpBound.getXform().setSize(10, 2);
    this.hpBound.setElementPixelPositions(0, 256, 0, 128);
    this.hpBound.addLight(this.mGlobalLightSet.getLightAt(0));
    
    this.expBound = new LightRenderable(this.kBound);
    this.expBound.setColor([1, 1, 1, 1]);
    this.expBound.getXform().setPosition(-22.5, -21.5);
    this.expBound.getXform().setSize(10, 2);
    this.expBound.setElementPixelPositions(0, 256, 0, 128);
    this.expBound.addLight(this.mGlobalLightSet.getLightAt(0));
    
    this.hpBar = new LightRenderable(this.kHpBar);
    this.hpBar.setColor([1, 0, 0, 0]);
    this.hpBar.getXform().setPosition(-38.5, -21.5);
    this.hpBar.getXform().setSize(10, 2); 
    this.hpBar.setElementPixelPositions(0, 256, 0, 128);
    this.hpBar.addLight(this.mGlobalLightSet.getLightAt(0));
    
    this.expBar = new LightRenderable(this.kExpBar);
    this.expBar.setColor([1, 1, 0, 0]);
    this.expBar.getXform().setPosition(-27.5, -21.5);
    this.expBar.getXform().setSize(10, 2);
    this.expBar.setElementPixelPositions(0, 256, 0, 128);
    this.expBar.addLight(this.mGlobalLightSet.getLightAt(0));
    
};


NightMyGame.prototype.drawCamera = function (camera) {
    // Step A: set up the View Projection matrix
    camera.setupViewProjection();
    // Step B: Now draws each primitive

    this.mbg.draw(camera);
    
    for(i = 0; i < this.mProps.length; i++){
          if(this.mProps[i] !== undefined)
          { this.mProps[i].draw(camera);}
    }
    
   this.mhero.draw(camera);
    
      var i;  
    for(i = 0; i<this.mBulletE.length;i++){
       if(this.mBulletE[i] !== undefined)
       {this.mBulletE[i].draw(camera);}
    }
      var i;  
    for(i = 0; i<this.mBulletH.length;i++){
       if(this.mBulletH[i] !== undefined)
       {this.mBulletH[i].draw(camera);}
    }
      
    for(i = 0; i < this.mMerchant.length; i++){
        this.mMerchant[i].draw(camera);
    }
    
        for(i = 0; i < this.mRN.length; i++){
        this.mRN[i].draw(camera);
    }
    
    this.mRedHeard.draw(camera);
    this.mExp.draw(camera);
    this.hpBound.draw(camera);
    this.expBound.draw(camera);
    
    this.hpBar.getXform().setSize(10 * this.mhero.getHP() / 100, 2);
    this.hpBar.getXform().setPosition(-38.5 - 5 + this.mhero.getHP() / 20, -21.5);
    this.hpBar.draw(camera);
    
    this.expBar.getXform().setSize(10 * this.mhero.getEXP() / 500, 2);
    this.expBar.getXform().setPosition(-27.5 + this.mhero.getEXP() / 100, -21.5);
    this.expBar.draw(camera);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
NightMyGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.drawCamera(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
NightMyGame.prototype.update = function () {
    this.FireCD--;
   if(this.mhero !== null){this.mhero.update(this.mBulletH,this.Bflag,this.FireCD,this.mTheLight);}
 if(this.FireCD <= 0)
       {
           this.FireCD = 10;
       }
   
     var i = 0;
    for(i = 0; i<this.mBulletH.length;i++){
      {  
          this.mBulletH[i].update();
            if(this.mBulletH[i].getXform().getXPos() > 50 
                || this.mBulletH[i].getXform().getYPos() > 25
                ||this.mBulletH[i].getXform().getXPos() < -50 
                || this.mBulletH[i].getXform().getYPos() < -25){
                var t = this.mBulletH[0];
                this.mBulletH[0] = this.mBulletH[i];
                this.mBulletH[i] = t;
                this.mBulletH.shift();
        }
      }
    }
    for(i = 0; i<this.mBulletE.length;i++){
      {  this.mBulletE[i].update();
            if(this.mBulletE[i].getXform().getXPos() > 50 
                || this.mBulletE[i].getXform().getYPos() > 25
                ||this.mBulletE[i].getXform().getXPos() < -50 
                || this.mBulletE[i].getXform().getYPos() < -25){
                var t = this.mBulletE[0];
                this.mBulletE[0] = this.mBulletE[i];
                this.mBulletE[i] = t;
                this.mBulletE.shift();
        }
      }
    }
    
        if(Math.random()>0.99){
            var mrn = new NightRoyalNavy(this.krn, 55, 40*Math.random()-18);
             mrn.getRenderable().addLight(this.mTheLight);
            if(this.mRN.length <=5)
            this.mRN.push(mrn);
    }
    
    for(i = 0; i < this.mRN.length; i++){
          var randomx = (Math.random()-0.5)*50;
            var randomy = (Math.random()-0.5)*50;
        this.Timerrn[i]=this.mRN[i].update(this.mhero,this.Timerrn[i],this.mBulletE,this.mTheLight);
       this.mRN[i].rotateObjPointTo([this.mhero.getXform().getXPos()+randomx,this.mhero.getXform().getYPos()+randomy], 0.01);
        GameObject.prototype.update.call(this.mRN[i]);
    
        if(this.mRN[i].getXform().getXPos() <  -50){
                var t = this.mRN[0];
                this.mRN[0] = this.mRN[i];
                this.mRN[i] = t;
                this.mRN.shift();
        }
    }
    
    
      if(Math.random()>0.99){
            var merchant = new NightMerchant(this.kmerchant);
             merchant.getRenderable().addLight(this.mTheLight);
            if(this.mMerchant.length <=6)
            this.mMerchant.push(merchant);
    }
    
    for(i = 0; i < this.mMerchant.length; i++){
        this.Timermerchant[i]=this.mMerchant[i].update(this.Timermerchant[i],this.mBulletE,this.mTheLight);
            if(this.mMerchant[i].getXform().getXPos() <  -50){
                var t = this.mMerchant[0];
                this.mMerchant[0] = this.mMerchant[i];
                this.mMerchant[i] = t;
                this.mMerchant.shift();
        }
    }
    
    /*
     * next check whether hero touch enemy
     */
    var hTchBlt = [];
    for(i = 0; i < this.mBulletE.length; i++){
        this.curHTchBlt = this.mBulletE[i].pixelTouches(this.mhero, hTchBlt);
        if(!this.preHTchBlt && this.curHTchBlt){
                var t = this.mBulletE[0];
                this.mBulletE[0] = this.mBulletE[i];
                this.mBulletE[i] = t;
                this.mBulletE.shift();
            this.mhero.decHP(3);
        }
        this.preHTchBlt = false;
    }
    
    var hTchRn = [];
    for(i = 0; i < this.mRN.length; i++){
        this.curTchRn[i] = this.mRN[i].pixelTouches(this.mhero, hTchRn);
        if(!this.preTchRn[i] && this.curTchRn[i]){
            this.mhero.decHP(8);
            this.mRN[i].decHP(5);
            if(this.mRN[i].getHP() <= 0){
                var t = this.mRN[0];
                this.mRN[0] = this.mRN[i];
                this.mRN[i] = t;
                this.mRN.shift();
                
                this.mhero.incExp(20);
            }
        }
        this.preTchRn[i] = this.curTchRn[i];
    }
    var hTchMct = [];
    for(i = 0; i < this.mMerchant.length; i++){
        this.curTchMct[i] = this.mMerchant[i].pixelTouches(this.mhero, hTchMct);
        if(!this.preTchMct[i] && this.curTchMct[i]){
            this.mhero.decHP(6);
            this.mMerchant[i].decHP(5);
            if(this.mMerchant[i].getHP() <= 0){
                var t = this.mMerchant[0];
                this.mMerchant[0] = this.mMerchant[i];
                this.mMerchant[i] = t;
                this.mMerchant.shift();
                
                this.mhero.incExp(12);
            }
        }
        this.preTchMct[i] = this.curTchMct[i];
    }

    // enemy is attacked by bulllets
    var rnTchBlt = [];
    var j = 0;
    for(i = 0; i < this.mRN.length; i++){
        for(j = 0; j < this.mBulletH.length; j++){
            this.curRnTchBlt = this.mRN[i].pixelTouches(this.mBulletH[j], rnTchBlt);
            if(!this.preRnTchBlt && this.curRnTchBlt){
                var t = this.mBulletH[0];
                this.mBulletH[0] = this.mBulletH[j];
                this.mBulletH[j] = t;
                this.mBulletH.shift();
                
                this.mRN[i].decHP(2);
                if(this.mRN[i].getHP() <= 0){
                    var r = this.mRN[0];
                this.mRN[0] = this.mRN[i];
                this.mRN[i] = r;
                this.mRN.shift();
                
                this.mhero.incExp(15);
                }
            }
            this.preRnTchBlt = false;
        }
    }
    
    var mctTchBlt = [];
    for(i = 0; i < this.mMerchant.length; i++){
        for(j = 0; j < this.mBulletH.length; j++){
             if(this.mMerchant[i]!==undefined &&this.mBulletH[j]!==undefined )
            this.curMctTchBlt = this.mMerchant[i].pixelTouches(this.mBulletH[j], mctTchBlt);
            if(!this.preMctTchBlt && this.curMctTchBlt){
                var t = this.mBulletH[0];
                this.mBulletH[0] = this.mBulletH[j];
                this.mBulletH[j] = t;
                this.mBulletH.shift();
                
                this.mMerchant[i].decHP(2);
                if(this.mMerchant[i].getHP() <= 0){
                    var r = this.mMerchant[0];
                    this.mMerchant[0] = this.mMerchant[i];
                    this.mMerchant[i] = r;
                    this.mMerchant.shift();
                    
                    this.mhero.incExp(12);
                }
            }
            this.preMctTchBlt = false;
        }
    }
    
    //道具
    var temp = Math.random();
    if(temp>0.995 && this.mProps.length<=5 ){
        if(temp>0.995 && temp<0.997){
       var prop = new PropsIncHP(this.mhero);//0是增血
       prop.getRenderable().addLight(this.mTheLight);
            this.mProps.push(prop);
            
            }
           if(temp>0.997 && temp<0.999){   
            var prop = new PropsIncHeroS(this.mhero);//1是增速
            prop.getRenderable().addLight(this.mTheLight);
            this.mProps.push(prop);} 
        if(temp>0.999 && temp<=1.0){   
            var prop = new PropsIncBulletS(this.mhero);
            prop.getRenderable().addLight(this.mTheLight);
            this.mProps.push(prop);} 
    }
    
     
    var TouchPos=[];
    var prop;
    for(i = 0; i < this.mProps.length; i++){
        if(this.mProps[i] !== undefined){
            this.curHeroTchPrp = this.mProps[i].pixelTouches(this.mhero, TouchPos);
            if( this.curHeroTchPrp){            
                prop=this.mProps[i];
                  var type= prop.getType();
               if(type===0)
                  {if(this.mhero.getHP() <=95)                
                    {this.mhero.incHP(7); 
                    prop.setExist(false);}}
                if(type===1)
                  {if(this.mhero.getSpeed()<=0.5)                
                    {this.mhero.incSpeed(0.05); 
                    prop.setExist(false);}}
             if(type===2)
                  { if(this.Bflag !== 1){
                        this.Bflag = 1;
                        this.bufftime = 250;
                        prop.setExist(false);
                }}
            }
        }
        }
          
          this.bufftime--;
   if(this.bufftime <= 0)
   {
       this.Bflag = 0;
   }
    
      for(var i = 0;i <this.mProps.length;i++)
    {
        var prop=this.mProps[i];
        prop.update(this.mhero);
        var propexist= prop.getExist();
        if(propexist === false){
             var r = this.mProps[0];
                this.mProps[0] = this.mProps[i];
                this.mProps[i] = r;
                this.mProps.shift();     
        }
        }
        
   
    
      for(var i = 0;i <this.mProps.length;i++)
    {
        var prop=this.mProps[i];
        prop.update(this.mhero);
        var propexist= prop.getExist();
        //var propexist=this.mProps[i].getExist(); 
        if(propexist === false){
             var r = this.mProps[0];
                this.mProps[0] = this.mProps[i];
                this.mProps[i] = r;
                this.mProps.shift();     
        }
        }
    

this.mTheLight.set2DPosition(this.mhero.getXform().getPosition());
};
