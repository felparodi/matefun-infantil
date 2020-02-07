import { PIPE_TYPES, DIRECTION } from '../../constants/constants';
import { UnTypePipe } from './untypePipe';

export class EndPipe extends UnTypePipe {
    
    constructor() {
        super([DIRECTION.TOP], []);
    }

    toCode() {
        const arg = this.toCodeArg(this.getInDirections()[0]);
        return `${arg}`;
    }

    isDirectionDefined() {
        return true;
    }

    getType() {
        return PIPE_TYPES.END;
    }
}