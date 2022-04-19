var model = {
  gameObjects: [],

  score:-1,
  caracteretxt: "",
  ROWS: undefined,
  COLUMNS: undefined,
  multi: undefined,
  loser: undefined,

  penguinSkin: [
    {color : "./img/sprite0.png"},
    {color: "./img/sprite1.png"},
    {color: "./img/sprite2.png"},
    {color: "./img/sprite3.png"},
    {color: "./img/sprite4.png"},
    {color: "./img/sprite5.png"},
  ],
  
  deco: [
    {src : "./img/background.png"},
    {src : "./img/btn.png"},
    {src : ""},
  ],

  penguin: [],
  water: [],
  ice: [],

  map: MapLand,

  init: function() {
    this.COLUMNS = this.map.COLUMNS
    this.ROWS = this.map.ROWS
  },

  initPenguin: function() {
    this.penguin[0] = new Penguin(0, 4);
  },

  initWater: function(){
  this.water[0] = new Water(Math.floor(Math.random() * this.COLUMNS));
  model.increaseScore();
  },
  
  initIce: function(){
  this.ice[0] = new Ice(Math.floor(Math.random() * this.COLUMNS));
  },

  
  buildMap: function () {
    for (let row = 0; row < model.ROWS; row++) {
      for (let col = 0; col < model.COLUMNS; col++) {
        
        let currentTile = model.map.getTile(col, row);
        let tileName = model.map.getTileName(currentTile);
        
        let tmp;
        switch (tileName) {
          case "GROUND":
            tmp = new GameObject(col, row, currentTile, tileName);
            model.gameObjects.push(tmp);
            break;
          case "AIR":
            tmp = new GameObject(col, row, currentTile, tileName);
            model.gameObjects.push(tmp);
            break;
        }
      }
    }
  },

  getPenguin: function(){
    let penguinCopy = { ...this.penguin};
    return penguinCopy
  },

	update: function(){
    let p = model.getPenguin();
    for(let i=0; i<this.penguin.length; i++){
      if((view.inputKey[i].key == 'LEFT' && p[i].col == 0) || (view.inputKey[i].key == 'RIGHT' && p[i].col == model.COLUMNS - 1)){
        view.inputKey[i].key = 'WAIT';
		    this.penguin[i].updateDirection(view.inputKey[i].key)
      }
      else{
		    this.penguin[i].updateDirection(view.inputKey[i].key)
      }
    }
	},

  getWater: function(){
    let waterCopy = { ...this.water};
    return waterCopy
  },
  
  getIce: function(){
    let iceCopy = { ...this.ice};
    return iceCopy
  },

  getScore: function() {
    let score = this.score
    return score
  },

  increaseScore: function(){
    this.score++
  },

  getGameObjects: function(){
    return model.gameObjects
  },
  
  playGame: function(p){
    for(let i=0; i<this.penguin.length; i++){
      if(p[i].timeStuck == undefined){
        p[i].timeStuck = 20;
      }
      let oldcol = this.penguin[i].col;
      let oldrow = this.penguin[i].row;
      if(view.inputKey[i].key == "PUNCH" && p[i].attack != 1){
        octopus.readAttack(i);
      }
      p[i].timestuck++;
    }
  }
};

var octopus = {

  LOAD: 0,
  CHOSE_MODE: 1,
  CHOSE_CHARACTERE: 2,
  CHOSE_CHARACTERE_MULTI: 3,
  CHOSE_MAP: 4,
  BUILD_MAP: 5,
  PLAY: 6,
  OVER: 7,
  gameState: 0,
  
  fpsLimit: 15,
  previousDelta: null,


  init: function(scale) {
    model.init();
    view.init(model.COLUMNS, model.ROWS, scale);
    this.gameLoop();
  },

  handLoad: function(){
    octopus.gameState = octopus.CHOSE_MODE;
    octopus.gameLoop();
  },

  readAttack: function(nb){
    let p = model.getPenguin()
    for(let i=0; i<model.penguin.length; i++){
        let proche = Math.abs(p[i].col-p[nb].col)
        if((proche==1 || proche==0) && i != nb){
          p[i].attack = 1;
          p[i].timeStuck = 0;
          if(p[i].col >= p[nb].col){
            p[i].direction = 5
            p[nb].direction = 4
          }else{
            p[i].direction = 6
            p[nb].direction = 3
          }
        }
    }
  },

  PenguinTimeEvent: function(){
    p = model.getPenguin();
    for(let i=0; i<model.penguin.length; i++){
      if(p[i].timeStuck < p[i].delay){
        p[i].timeStuck++
      } else{
        p[i].attack = 0;
      }
    }
  },

  moveWater: function(w){
    for(let i=0; i<model.water.length; i++){
      if(w[i].time>w[i].delay){
        if(model.water[i] != undefined){
          if(w[i].extend > model.ROWS){
            w[i].extend = 1;
            w[i].time = 0;
            w[i].position = Math.floor(Math.random() * model.COLUMNS)
            w[i].delay = Math.floor(Math.random() * 10)+10
            model.increaseScore();
          }
          else{
            w[i].extend++;
          }
        }
      }
      w[i].time++;
    }
  },

  moveIce: function(w){
    for(let i=0; i<model.ice.length; i++){
      if(w[i].time>w[i].delay){
        if(model.ice[i] != undefined){
          if(w[i].extend > model.ROWS){
            w[i].extend = 0;
            w[i].time = 0;
            w[i].position = Math.floor(Math.random() * model.COLUMNS)
            w[i].delay = Math.floor(Math.random() * 10)+10
          }
          else{
            w[i].extend++;
          }
        }
      }
      w[i].time++;
    }
  },

  readCollisions: function(p, w){
    for(let j=0; j<model.penguin.length; j++){
      for(let i=0; i<model.water.length; i++){
        if(p[j].col == w[i].position && w[i].extend > 1){
          octopus.gameState = octopus.OVER;
          model.loser = p[j]
        }
      }
    }
  },
  
  readCollisionsIce: function(p, w){
    for(let j=0; j<model.penguin.length; j++){
      for(let i=0; i<model.ice.length; i++){
        if(p[j].col == w[i].position && w[i].extend == 3 ){
          octopus.gameState = octopus.OVER;
          model.loser = p[j]
        }
      }
    }
  },

  endScoreEffect: function(){
    if(octopus.gameState == octopus.OVER){
      if(model.multi==true){
        view.renderEndScoreMulti();    
        octopus.gameState = octopus.RESTART;
        octopus.gameLoop();
      }
      else{
        view.renderEndScore();    
        octopus.gameState = octopus.RESTART;
        octopus.gameLoop();
      }
    }
  },

  resetParty: function(){
    view.ctx.clearRect(0,0,view.canvas.width,view.canvas.height)
    model.water.splice(model.water, 1);
    model.penguin.splice(model.penguin, 1);
    octopus.fpsLimit = 15;
    octopus.gameState = 0;
    model.score = -1;
    octopus.init(64)
  },
  
  chooseClick: function(e){
    let sourisX = e.offsetX;
    let sourisY = e.offsetY;
    if(octopus.gameState==1){
      octopus.chooseClickMode(sourisX,sourisY);
    }
    else if(octopus.gameState==2){
      octopus.chooseClickColor(sourisX,sourisY);
      octopus.chooseClickStart(sourisX,sourisY);
    }
    else if(octopus.gameState==3){
      const pinguins = model.getPenguin()
      if(!pinguins[0].color) {
        octopus.chooseClickColor(sourisX,sourisY);
      } else if(!pinguins[1].color) {
      octopus.chooseClickColor2(sourisX,sourisY);
      octopus.chooseClickStart(sourisX,sourisY);
      }
      
    }
  },

  chooseClickColor: function(sourisX,sourisY){
    let p = model.getPenguin()

    if(sourisY > view.scale && sourisY < 2*view.scale){
      let couleur = (sourisX - sourisX % view.scale)/view.scale;
      if(couleur >= model.penguinSkin.length){
        
        view.canvas.addEventListener('click', octopus.chooseClick, {once: true} );
        p[0].color = 0;

      }
      else{
        view.canvas.addEventListener('click', octopus.chooseClick, {once: true} );
        p[0].color = couleur;
    
      }
    }
    else{
      p[0].color = 0;
      view.canvas.addEventListener('click', octopus.chooseClick, {once: true} );
    }
  },

  chooseClickColor2: function(sourisX,sourisY){
    let p = model.getPenguin()

    if(sourisY > view.scale && sourisY < 4*view.scale){
      let couleur = (sourisX - sourisX % view.scale)/view.scale;
      if(couleur >= model.penguinSkin.length){
        
        view.canvas.addEventListener('click', octopus.chooseClick, {once: true} );
        p[1].color = 0;
      }
      else{
        view.canvas.addEventListener('click', octopus.chooseClick, {once: true} );
        p[1].color = couleur;
  
      }
    }
    else{
      view.canvas.addEventListener('click', octopus.chooseClick, {once: true} );
    }
  },

  chooseClickMode: function(sourisX,sourisY){
    if(sourisY > 3*view.scale && sourisY < 4*view.scale){
      let  mode = sourisX
      if (mode<view.canvas.width/2){
        model.multi= false;
        model.COLUMNS = 11;
        view.init(model.COLUMNS, model.ROWS, view.scale)
        octopus.gameState = octopus.CHOSE_CHARACTERE;
        octopus.gameLoop();
      }
      else{
        model.multi=true;
        model.COLUMNS = 20;
        view.init(model.COLUMNS, model.ROWS, view.scale)
        model.penguin[1] = new Penguin(10, 4)
        octopus.gameState = octopus.CHOSE_CHARACTERE_MULTI;
        octopus.gameLoop();
    }
    }
    else{    
      view.canvas.addEventListener('click', octopus.chooseClick, {once: true} );
    }
      
  },

  chooseClickStart: function(sourisX,sourisY){
    octopus.gameState = octopus.BUILD_MAP;
    octopus.gameLoop();
  },
  
  scoreEvent: function(){
    if(model.score > 5) {
      octopus.moveIce(model.getIce());
      view.renderIce(model.getIce());
    }
    if(model.score == 10 && model.water[1] == undefined){
      model.water[1] = new Water(Math.floor(Math.random() * model.COLUMNS));
      octopus.fpsLimit = 20
    }
    if(model.score == 15 && model.ice[1] == undefined){
      model.ice[1] = new Ice(Math.floor(Math.random() * model.COLUMNS));
      octopus.fpsLimit = 30
    }
    if(model.score == 30){
      octopus.fpsLimit = 45
    }
    if(model.score == 50 && model.water[2] == undefined){
      model.water[2] = new Ice(Math.floor(Math.random() * model.COLUMNS));
    }
    //Permet de réduire la zone de jeux au bout de 15 points
    // if(model.score == 15 && model.COLUMNS>5){
    //   model.COLUMNS = 5
    //   view.init(model.COLUMNS, model.ROWS, view.scale)
    //   model.penguin[0].col = 2
    // }
  },

  gameLoop: function(currentDelta) {

    if(octopus.gameState == octopus.PLAY){
      window.requestAnimationFrame(octopus.gameLoop)
          // Le paramètre currentDelta correspond au temps écoulé en ms
      		// depuis le lancement de requestAnimationFrame
      		// Nous pouvons calculer le laps de temps écoulé depuis notre dernière loop (tjs en ms)
  		let delta = currentDelta - octopus.previousDelta
          // return si celui-ci est inférieur au laps de temps de notre fps
  		if (octopus.fpsLimit && delta < (1000 / octopus.fpsLimit)) {
          return
      }
    }
    
    switch (octopus.gameState) {
      case octopus.LOAD:
        view.loadImg();     
        model.initPenguin();
        break
      case octopus.CHOSE_MODE:
        view.renderChooseMode();
        break
      case octopus.CHOSE_CHARACTERE:
        view.canvas.addEventListener('click', octopus.chooseClick, {once: true} );
        view.renderCaractere();
        view.renderChooseCaractere();
      break
        case octopus.CHOSE_CHARACTERE_MULTI:
        view.canvas.addEventListener('click', octopus.chooseClick, {once: true} );
        view.renderCaractereMulti();
        view.renderChooseCaractereMulti();
      break
      case octopus.BUILD_MAP:
        model.buildMap();
        model.initWater();
        model.initIce();
		    view.initSprite()
        octopus.gameState = octopus.PLAY;
        octopus.gameLoop();
      break
      case octopus.PLAY:
        model.playGame(model.getPenguin());
        model.update()
        octopus.moveWater(model.getWater());
        octopus.readCollisions(model.getPenguin(), model.getWater());
        octopus.readCollisionsIce(model.getPenguin(), model.getIce());
        view.render(model.getGameObjects());
        octopus.scoreEvent();
        octopus.PenguinTimeEvent();
        view.stepWaterAnnim();
        view.renderWater(model.getWater());
        view.renderScore(model.getScore())
        view.renderPenguin(model.getPenguin());
      break
      case octopus.OVER:
        view.renderGameOver();
        view.canvas.addEventListener('click', octopus.endScoreEffect, {once: true} );
        break
      case octopus.RESTART:
        view.canvas.addEventListener('click', octopus.resetParty, {once: true} );
      break
    }
    octopus.previousDelta = currentDelta;
  },
};

var view = {
  canvas: undefined,
  ctx: undefined,
  scale: undefined,
  output: undefined,
  background: undefined,
  penguinColor: undefined,
  groundColor: undefined,
  inputKey: [],
  img: [],
  sprites: [],
  deco: [],
  imgW: undefined,
  imgI: undefined,
  imgB: undefined,
  waterAnnim: 0,


  init: function(cols, rows, scale){
    this.canvas = document.querySelector('canvas');
    this.canvas.addEventListener('click', octopus.chooseClick, {once: true} );
    this.ctx = this.canvas.getContext("2d");
		this.ctx.imageSmoothingEnabled = false;
    this.canvas.width = cols * scale;
    this.canvas.height = rows * scale;
    this.scale = scale;
    this.output = document.querySelector("p");
    this.key = [];

    for(let i=0; i<=model.penguin.length; i++){
      view.inputKey[i] = new KeyInput()
      view.inputKey[i].init()
    }
  },

  initSprite: function(){
    let p = model.getPenguin();
    for(let i=0; i<model.penguin.length; i++){
      view.sprites[i] = new Sprite({gameObject: p[i], scale: p[0].scale, img: this.img[p[i].color], ctx: view.ctx})
    }
  },

  stepWaterAnnim: function(){
    if(this.waterAnnim == 6){
      this.waterAnnim = 0
    }
    else{
      this.waterAnnim++
    }
  },



  render(sprites){
    
    this.ctx.drawImage(view.deco[0], 0, 0, this.canvas.width, this.canvas.height);


    let grounds = sprites.filter(wall=> wall.name==='GROUND')
		grounds.forEach(ground => {
			this.ctx.save()
      this.ctx.drawImage(view.imgB,0,0,64,64,ground.col*this.scale,ground.row*this.scale,this.scale,this.scale);
      this.ctx.restore()		
		});	

  },
  
  renderPenguin: function(p){
    for(let i=0; i<model.penguin.length; i++){
			view.sprites[i].updateGameObject(p[i])
			view.sprites[i].updateSpriteAnim()
			view.sprites[i].render()
    }
  },
  


  renderCaractere: function(){
    this.ctx.clearRect(0,0,view.canvas.width,view.canvas.height)
    this.ctx.save();
    this.caracteretxt = "Choisissez un personnage :"
    this.ctx.font="20px 'Press Start 2P'"
    this.ctx.fillStyle =  "red";
    this.ctx.fillText(this.caracteretxt, this.scale/2, this.scale)
    this.ctx.restore()
  },

    renderChooseCaractere: function(){
    this.ctx.save();
    this.ctx.drawImage(view.deco[0], 0, 0, this.canvas.width, this.canvas.height);
    for(let i=0; i<model.penguinSkin.length; i++){
      this.ctx.drawImage(view.img[i],0,0,256,256,i*this.scale, this.scale, this.scale, this.scale);
      this.ctx.restore()
    }
  },


  renderCaractereMulti: function(){
    this.ctx.clearRect(0,0,view.canvas.width,view.canvas.height)
    this.ctx.save();
    this.caracteretxt = "selectionner vos deux personnages :"
    this.ctx.font="16px 'Press Start 2P'"
    this.ctx.fillStyle =  "red";
    this.ctx.fillText(this.caracteretxt, this.scale/2, this.scale)
    this.ctx.restore()
  },

    renderChooseCaractereMulti: function(){
      this.ctx.save();
      this.ctx.drawImage(view.deco[0], 0, 0, this.canvas.width, this.canvas.height);
      for(let i=0; i<model.penguinSkin.length; i++){
      this.ctx.fillStyle =  model.penguinSkin[i].color;
      this.ctx.drawImage(view.img[i],0,0,256,256,i*this.scale, this.scale, this.scale, this.scale);
      this.ctx.restore()
    }
  },
  
  renderChooseMode: function(){
    this.ctx.save();
      this.ctx.drawImage(view.deco[0], 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(view.deco[1], 0, this.scale*3, view.canvas.width/2, this.scale);
      this.ctx.drawImage(view.deco[1], this.scale*5.5, this.scale*3, view.canvas.width/2, this.scale);
      this.ctx.font="20px 'Press Start 2P'"

      this.ctx.fillStyle = "white"
      this.ctx.fillText("solo", this.scale*2, this.scale*3.75)
      this.ctx.fillStyle = "white"
      this.ctx.fillText("multijoueur", this.scale*6.5, this.scale*3.75)


      this.ctx.restore()
  },
  
  renderScore: function(score){
    if(score<10) score = "0"+score
    this.ctx.save();
    this.ctx.font=this.scale/2 +"px 'Press Start 2P'"
    this.ctx.fillStyle = "white";
    this.ctx.fillText(score, this.scale/2, this.scale)
    this.ctx.restore()
  },

  renderGameOver: function(){
    this.ctx.save();
    this.msg = "Game Over"
    this.ctx.textAlign = 'center';
    this.ctx.font=model.COLUMNS*5 +"px 'Press Start 2P'"
    this.ctx.fillStyle =  "dark";
    this.ctx.fillText(this.msg, this.canvas.width/2, this.scale*3)
    this.ctx.restore()
  },
  renderEndScore: function(){
    this.ctx.save();
    this.ctx.drawImage(view.deco[0], 0, 0, this.canvas.width, this.canvas.height);
    this.msg = "votre score est de: " + model.score;
    this.ctx.font='12' +"px 'Press Start 2P'"
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle =  "red";
    this.ctx.fillText(this.msg, this.canvas.width/2, this.scale*3)

    this.ctx.fillText("click to restart a game", this.canvas.width/2, this.scale*4)
    
    this.ctx.restore();

  },

  renderEndScoreMulti: function(){
    this.ctx.save();
    this.ctx.fillStyle = "orange"
    this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
    this.msg = "joueur qui a perdu: " + model.loser.color;
    this.ctx.font='12' +"px 'Press Start 2P'"
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle =  "red";
    this.ctx.fillText(this.msg, this.canvas.width/2, this.scale*3)

    this.ctx.fillText("click to restart a game", this.canvas.width/2, this.scale*4)
    
    this.ctx.restore();

  },
  
  renderWater: function(w){
    for (let j=0; j<model.water.length; j++){
      this.ctx.save();
      this.ctx.fillStyle =  "green";
      for(let i=1; i<=w[j].extend; i++){this.ctx.drawImage(view.imgW,64*view.waterAnnim,0,64,64,w[j].position*this.scale, (model.ROWS-i)*this.scale, this.scale, this.scale);
      }
    this.ctx.restore()
    }

  },
  
  renderIce: function(w){
    for (let i=0; i<model.ice.length; i++){
    this.ctx.save();
    this.ctx.drawImage(this.imgI,0,0,64,64,w[i].position*this.scale, w[i].extend*this.scale, this.scale, this.scale);
    this.ctx.restore()
    }
  },
  
  loadImg: function () {
    for(i=model.penguinSkin.length-1; i>=0; i--){
      this.img[i] = new Image();
      this.img[i].src = './img/sprite'+i+'.png';
    }
    for(i=model.deco.length-1; i>=0; i--){
      this.deco[i] = new Image();
      this.deco[i].src = model.deco[i].src;
    }
    this.imgW = new Image();
    this.imgW.src = './img/water.png';
    this.imgI = new Image();
    this.imgI.src = './img/ice.png';
    this.imgB = new Image();
    this.imgB.src = './img/bottom.png';
    this.deco[0].addEventListener('load', octopus.handLoad)
    this.deco[1].addEventListener('load', octopus.handLoad)
  },
  
}

octopus.init(64);
