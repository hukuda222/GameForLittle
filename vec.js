class Vec{
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        return new Vec(this.x + v.x, this.y + v.y);
    }
    mul(x, y) {
        if(y === 0 || y===undefined) y = x;
        return new Vec(this.x * x, this.y * y);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    cross(v) {
        return this.x * v.y - v.x * this.y;
    }
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}
