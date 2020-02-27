export class  Color {
    public color: string;

    constructor(color:string) {
        this.color = color;
    }
}

export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y:number) {
        this.x = x;
        this.y = y;
    }
}

export type Value = string | number | boolean | Color | Point | undefined
