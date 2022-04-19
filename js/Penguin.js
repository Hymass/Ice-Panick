class Penguin extends GameObject{
    constructor(column, row){
        super(column, row, 4, 'Me')
        this.color = undefined
        this.key = undefined
        this.attack = undefined
        this.timeStuck = undefined
        this.delay = 20
        
        this.col = column
        // Pour le déplacement on se déplace de 'pixels' en 'pixels'
        this.x = column
        this.y = model.ROWS-2
        // Vitesse de déplacement
        this.v = .25
    }
    
    v
    movingProgressRemaining = 0
    prop
    prop2

    
    WAIT = 0
    RIGHT = 1
    LEFT = 2
    PUNCHLEFT = 3
    PUNCHRIGHT = 4
    DAMAGELEFT = 5
    DAMAGERIGHT = 6
    
    direction = 0


    
    directionUpdate = {
      "LEFT": ["x", -1],
      "RIGHT": ["x", 1],
    }

    directionUpdateCase = {
      "LEFT": ["col", -1],
      "RIGHT": ["col", 1],
    }

    updateDirection(key) {
			// Si aucun déplacement n'est en cour et qu'une touche est enfoncée
		if (this.movingProgressRemaining === 0 && (key=='RIGHT' || key=='LEFT')) {
			// Détermine la direction 'WAIT' = 0, ...
			this.direction = this[key]
			// Détermine le nombre de déplacements pour arriver à la case suivante ici 10
      this.movingProgressRemaining = 1/this.v
			// On récupère sous la forme d'un tableau la direction et sa valeur
			this.prop = this.directionUpdate[key]
			this.prop2 = this.directionUpdateCase[key]
			const [property, change] = this.prop2
			this[property] += change
			// A la fin du déplacement et dans le cas ou aucune touche n'est enfoncée
    }
    else if(this.movingProgressRemaining===0 && key=='WAIT') {
			// À la fin du déplacement si aucune touche n'est enfoncée
			//this.direction = this[key]
			this.direction = 0
		}
    else if(this.timeStuck == 20){
      switch(key){
        case 'PUNCHLEFT':
          this.direction = 3;
          this.movingProgressRemaining = 1/this.v
          break;
        case 'PUNCHRIGHT':
          this.direction = 4;
          this.movingProgressRemaining = 1/this.v
          break;
        case 'DAMAGELEFT': 
          this.direction = 5;
          this.movingProgressRemaining = 1/this.v
          break;
        case 'DAMAGERIGHT': 
          this.direction = 6;
          this.movingProgressRemaining = 1/this.v
        break;
      }
    }
        this.updatePosition();
    }

    updatePosition(){
      if (this.movingProgressRemaining > 0) {

        this[this.prop[0]]+=this.prop[1]*this.v
        this.movingProgressRemaining -= 1
      } 
    }

}
