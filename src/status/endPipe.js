import { END } from './pipe';
import { DummyPipe } from './dummyPipe'

export class EndPipe extends DummyPipe {
    
    constructor(inDirections) {
        super(inDirections);
    }

    toString() {
        const arg = this.toStringArg();
        return `${arg}`;
    }

    getType() {
        return END;
    }
}