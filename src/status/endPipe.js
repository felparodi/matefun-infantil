import { END } from './pipe';
import { DummyPipe } from './dummyPipe'

export class EndPipe extends DummyPipe {
    
    constructor() {
        super();
    }

    toString() {
        const arg = this.toStringArg();
        return `${arg} : <${this.getOutType().join(',')}>`;
    }

    getType() {
        return END;
    }
}