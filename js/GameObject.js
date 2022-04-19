class GameObject{
    constructor(column, row, id, name){
        this.col = column
        this.row = row
        this.id = id
        this.name = name
        this.visible = true
    }

    getName(){
        return this.name
    }
}