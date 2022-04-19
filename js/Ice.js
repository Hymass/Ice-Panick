class Ice extends GameObject{
    constructor(column){
        super(column, 0, 4, 'ICE')
        this.position = column
        this.time = 0;
        this.delay = 5;
        this.extend = 0;
    }


}