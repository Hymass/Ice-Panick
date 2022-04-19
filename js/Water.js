class Water extends GameObject{
    constructor(column){
        super(column, model.ROW, 3, 'WATER')
        this.position = column
        this.time = 0;
        this.delay = 5;
        this.extend = 1;
    }

}