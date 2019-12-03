import { END } from './pipe';
import { DummyPipe } from './dummyPipe'

export class EndPipe extends DummyPipe {
    
    constructor(inDirection) {
        super([inDirection]);
    }

    toString() {
        const arg = this.toStringArg();
        return `${arg}`;
    }

    getType() {
        return END;
    }
}