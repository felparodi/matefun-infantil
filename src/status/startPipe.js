import { Pipe, START } from './pipe';
import {TYPE_STRING, TYPE_NUMBER,TYPE_BOOLEAN} from './valPipe';
import { DummyPipe } from './dummyPipe';

export class StartPipe extends DummyPipe {
    constructor() {
        super();
    }

    toString() {
        const thisOutType = this.getOutType();
        if(thisOutType.indexOf(TYPE_STRING) === 0) return `s?`
        if(thisOutType.indexOf(TYPE_NUMBER) === 0) return `n?`
        if(thisOutType.indexOf(TYPE_BOOLEAN) === 0) return `b?`
        return `o?`;
    }

    getType() {
        return START;
    }
}