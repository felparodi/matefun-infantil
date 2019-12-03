import { DummyPipe } from './dummyPipe'
import { PIPE_TYPES } from '../constants/constants';

export class EndPipe extends DummyPipe {
    
    constructor(inDirection) {
        super([inDirection]);
    }

    toString() {
        const arg = this.toStringArg();
        return `${arg}`;
    }

    getType() {
        return PIPE_TYPES.END;
    }
}