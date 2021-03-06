//    Copyright 2017 XieJinChi ChenYiXiu
// 
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
// 
//        http://www.apache.org/licenses/LICENSE-2.0
// 
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

'use strict'  // Operate in Strict mode such that variables must be declared before used!
let Say = {
    'assets/skin/Ali.png' : 'This is my place', 
    'assets/skin/Asuka.png' : 'Are you idiot?',
    'assets/skin/Baka.png' : 'Nani?',
    'assets/skin/BigFundamental.png' : 'The future is yours',
    'assets/skin/BillRazer.png' : 'I come, I see, I conquer',
    'assets/skin/Captain.png' : 'That you must stay who you are',
    'assets/skin/Corgi.png': 'wow wow wow',
    'assets/skin/Darkelf.png' : 'The dark is here',
    'assets/skin/DarthVader.png' : 'I am your father' ,
    'assets/skin/Dave.png' : 'Bababa,Bananaaaaaaah!' ,
    'assets/skin/EVA01.png' : 'I am hungry',
    'assets/skin/Gian.png' : 'Are you trying to embarrasse me Panghu?' ,
    'assets/skin/Kanna.png' : 'Magiyabakune',
    'assets/skin/KingArthur.png' : 'Ex...Calibur',
    'assets/skin/LanceBean.png' : 'Let us move on',
    'assets/skin/LittleBug.png' : 'With great power comes great responsibility',
    'assets/skin/Mamba.png' : 'Have ever seen the scene of Los Angeles at 4am?',
    'assets/skin/Mario.png' : 'But my Princess is in another castle',
    'assets/skin/McPig.png' : 'Oink...' ,
    'assets/skin/Mega.png' : 'baa...',
    'assets/skin/Pikachu.png' : 'Piiiiikachuuuuuu!',
    'assets/skin/PokeBall.png' : '......(I can not speak)',
    'assets/skin/Ram.png' : '864,still being a fool?',
    'assets/skin/Rei.png' : 'At this moment I do not know what expression to use',
    'assets/skin/Snorlax.png' : 'Zzzzz...',
    'assets/skin/Squirtle.png' : 'Jenijeni',
    'assets/skin/TheAnswer.png' : 'I do not wanna be Micheal Jordan',
    'assets/skin/Tony.png' : 'I am the Iron Man',
    'assets/skin/Umaru.jpg' : 'I play to win',
    'assets/skin/McGoat.png' : 'Baa..Baabaa' 
}





function EndScene(result,lose,isPlayer1Win,player1Character,player2Character) {

    
    this.mCamera = null
    this.mMsg = null
    this.mResult = result
    this.mMsgWin = null
    this.mMsg1 = null
    this.mMsg2 = null

    this.mIsRestart = false
    this.mLose = lose
    this.mIsPlayer1Win = isPlayer1Win

    this.mPlayer1Character = player1Character
    this.mPlayer2Character = player2Character
    
    this.mSay = null
    this.mWhoWinMsg = null
}
gEngine.Core.inheritPrototype(EndScene, Scene)

EndScene.prototype.initialize = function () {
    // gEngine.DefaultResources.setGlobalAmbientColor([1, 1, 1, 1])
    // gEngine.ResourceMap.store('Save', [0,0,0,0])
    // Step A: set up the cameras
    document.getElementById('game-contain').style.border='20px groove #666666'
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        1000,                        // width of camera
        [0, 0, 1000, 500],         // viewport (orgX, orgY, width, height)
        2
    )
    this.mCamera.setBackgroundColor([0.9, 0.9, 0.9, 1])

    this.mMsg = new SpriteRenderable(this.mResult)

  
    this.mMsg.setColor([1, 1, 1, 0])
    this.mMsg.getXform().setPosition(-220, 50)
    this.mMsg.getXform().setSize(200,200)
    this.mMsg.draw(this.mCamera)

    this.mMsg1 = new FontRenderable('Reselect ')
    this.mMsg1.getXform().setPosition(0, 55)
    this.mMsg1.setTextHeight(50)

    this.mMsg2 = new FontRenderable('Restart')
    this.mMsg2.getXform().setPosition(0, 20)
    this.mMsg2.setTextHeight(40)


    // console.log(Say[this.mResult]);
    this.mSay = new FontRenderable(Say[this.mResult])
    this.mSay.getXform().setPosition(-250,-150)
    this.mSay.setTextHeight(20)

    this.mMsg3 = new FontRenderable('<PRESS: SPACE BAR  CONTROL:ARROW KEY> ')
    this.mMsg3.getXform().setPosition(26, -20)
    this.mMsg3.setTextHeight(20)

    if(this.mIsPlayer1Win === true){
        this.mWhoWinMsg =new FontRenderable('Player1 Wins')
    }else{
        this.mWhoWinMsg =new FontRenderable('Player2 Wins')
    }

    this.mWhoWinMsg.getXform().setPosition(-300,170)
    this.mWhoWinMsg.setTextHeight(30)
    
    
  
    
    
}

EndScene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]) // clear to light gray
    
    this.mCamera.setupViewProjection()
    
    
    
  
    this.mMsg.draw(this.mCamera)
    this.mMsg1.draw(this.mCamera)
    this.mMsg2.draw(this.mCamera)
    this.mSay.draw(this.mCamera)
    this.mWhoWinMsg.draw(this.mCamera)
    this.mMsg3.draw(this.mCamera)
    
    
    
    
   
}
EndScene.prototype.update = function () {
    
    // select which character to work with
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
        gEngine.GameLoop.stop()
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up)){
        this.mIsRestart = (!this.mIsRestart)
    }
        
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Down))
        this.mIsRestart = (!this.mIsRestart)

    if(this.mIsRestart === true){
        this.mMsg2.setTextHeight(50)
        this.mMsg1.setTextHeight(40)
    }else{
        this.mMsg1.setTextHeight(50)
        this.mMsg2.setTextHeight(40)
    }
    
    
    
    
}

EndScene.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.mResult)
}

EndScene.prototype.unloadScene = function() {
    
    gEngine.Textures.unloadTexture(this.mResult)
    let next = null
    if(this.mIsRestart === true){
        if(this.mIsPlayer1Win === true){
            next = new StartGame(this.mPlayer1Character,this.mPlayer2Character,this.mResult,this.mLose)
        }else{
            next = new StartGame(this.mPlayer1Character,this.mPlayer2Character,this.mLose,this.mResult)
        }
    }else{
        next = new Player1ChooseCharacter()
    }
    
    gEngine.Core.startScene(next)
}