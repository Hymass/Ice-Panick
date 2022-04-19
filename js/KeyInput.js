class KeyInput{
    constructor(){
        this.key='WAIT'
    }
    init() {
        document.addEventListener("keydown", ev => {
            switch(ev.code){
                case "ArrowLeft": //LEFT
                if(model.penguin[0].timeStuck >= 10) view.inputKey[0].key ='LEFT'
                break;
                case "ArrowRight": //RIGHT
                if(model.penguin[0].timeStuck >= 10) view.inputKey[0].key ='RIGHT'
                break;
                case "ArrowUp": //RIGHT
                if(model.penguin[1] != null && model.penguin[1].timeStuck == 20){
                  view.inputKey[0].key ='PUNCH'
                  view.inputKey[1].key ='DAMAGE'
                }
                break;
                case "KeyA": //LEFT
                if(model.penguin[1] != null && model.penguin[1].timeStuck >= 10) {
                    view.inputKey[1].key ='LEFT'
                }
                break;
                case "KeyD": //RIGHT
                if(model.penguin[1] != null && model.penguin[1].timeStuck >= 10) {
                    view.inputKey[1].key ='RIGHT'
                }
                break;
                case "KeyW": //RIGHT
                if(model.penguin[1] != null && model.penguin[0].timeStuck == 20) {
                    view.inputKey[1].key ='PUNCH'
                    view.inputKey[0].key ='DAMAGE'
                }
                break;
            }
        })

        document.addEventListener("keyup", ev => {
            this.key = 'WAIT'
        })
    }

    get dir() {
        return this.key
    }
}


