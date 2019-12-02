import { Pipe, DUMMY } from './pipe';

export class DummyPipe extends Pipe {

    constructor() {
        super();
    }

    getOutType() {
        return this.inPipes.length > 0 ? this.inPipes[0].getOutType() : new Array();
    }

    getInType() {
        for(let i = 0; i < this.outPipes.length; i++) {
            if (this.outPipes[i].hasInType()) {
                return this.outPipes[i].getInType();
            }
        }
        return new Array();
    }

    hasOutType() {
        return this.getOutType().length > 0;
    }

    toString() {
        return this.toStringArg()
    }

    hasInType() {
        return this.getInType().length > 0;
    }

    joinIn(p) {
        if(this.inPipes.length > 0) throw new Error("Max IN Pipe")   
        super.joinIn(p)
    }

    getType() {
        return DUMMY;
    }
}