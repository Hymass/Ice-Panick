class Sprite{
	constructor(config){
		// Gestion du Sprite Man
		// taille du sprite source
		this.size = 256
		// position du sprite source
		this.sX = 0
		this.sY = 0
		// Tableau des Animations
		// WAIT, DOWN, UP, RIGHT, LEFT
		this.keyFrames = [[0],[0,1,2,3],[0,1,2,3],[0,1],[0,1],[0,1,2],[0,1,2]]

		// nombre de colonne dans le sprite
		this.numberOfFrames = 5
		this.speedAnim = 1/4
		this.currentFrame = 0

		this.scale = config.scale
		this.image = config.img
		this.ctx = config.ctx

		this.gameObject = config.gameObject
	}

	updateGameObject(obj){
		this.gameObject = obj
	}

	updateSpriteAnim(){
		// En fonction de la direction récupère la taille de l'animation
		this.numberOfFrames = this.keyFrames[ this.gameObject.direction].length
        // Détermine la colonne dans le sprite
		this.sX = Math.floor(this.currentFrame)%this.numberOfFrames*this.size
        // Détermine la ligne dans le sprite
		this.sY = this.gameObject.direction*this.size
		this.currentFrame+=1*this.speedAnim
    }

	render(){
		// Dessin du personnage
		view.ctx.save()
		view.ctx.drawImage(	this.image,
                            // Position Source  
							              this.sX, 
                            this.sY, 
                            256,
                            256,
                            this.gameObject.x*view.scale,
                            this.gameObject.y*view.scale,
							              view.scale,
                            view.scale
						)
		view.ctx.restore();
	}
}