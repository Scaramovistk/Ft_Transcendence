export class Player {
    constructor(name, side, posY) {
        this.posY = posY;
        this.name = name;
        this.side = side;
        this.displayName = this.name.length < 10 ? this.name : this.name.slice(0, 9) + "...";
    }
    score = 0;
    inputUp = false;
    inputDown = false;
}