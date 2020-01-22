import { PIPE_TYPES } from '../../constants/constants';
import { UnTypePipe } from './untypePipe';

export class EndPipe extends UnTypePipe {
    
    constructor(inDirections) {
        super(inDirections);
    }

    toCode(blockVars) {
        debugger;
        const arg = this.toCodeArg(this.inDirections[0], blockVars);
        return `${arg}`;
    }

    isDirectionDefined() {
        return true;
    }

    getType() {
        return PIPE_TYPES.END;
    }
}