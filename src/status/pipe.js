export const DUMMY = 'D'
export const FUNCTION = 'F';
export const VALUE = 'V';
export const END = 'E';
export const START = 'S';

export class Pipe {

    constructor() {
        this.inTypes = new Array();
        this.outTypes = new Array();
        this.inPipes = new Array();
        this.outPipes = new Array();
    }

    setInType(types) {
        this.inTypes = types;
        return this;
    }

    setOutType(types) {
        this.outTypes = types;
        return this;
    }

    getOutType() {
        return this.outTypes;
    }

    getInType() {
        return this.inTypes;
    }

    hasOutType() {
        return true;
    }

    hasInType() {
        return true;
    }
    
    matchToIn(p) {
        if (!this.hasInType() || !p.hasOutType()) return true;
        const thisInType = this.getInType()
        const otherOutType = p.getOutType();
        if (thisInType.length === otherOutType.length) {
           for (let i = 0; i < otherOutType.length; i++) {
              if (thisInType[i] !== otherOutType[i]) return false;
           }
           return true;
        }
        return false;
    }

    matchToOut(p) {
       return p.matchToIn(this)
    }

    toStringArg() {
        const arg = this.inPipes.map(p => p.toString())
        return arg.join(', ')
    }

    toString() {
        return `(???)`;
    }

    joinIn(p, dir) {
        if (this === p) throw new Error('Don\'t support cycles');
        if (!this.matchToIn(p)) throw new Error('Not match IN Out Type');
        this.inPipes.push(p)
    }

    joinOut(p) {
        p.joinIn(this);
    }

    getType() {
        return '?';
    }
}