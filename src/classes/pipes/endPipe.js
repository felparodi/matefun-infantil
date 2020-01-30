import { PIPE_TYPES, DIRECTION } from '../../constants/constants';
import { UnTypePipe } from './untypePipe';

export class EndPipe extends UnTypePipe {
    
    constructor() {
        super([DIRECTION.TOP], []);
    }

    toCode(blockVars) {
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