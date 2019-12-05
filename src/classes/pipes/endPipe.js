import { PIPE_TYPES } from '../../constants/constants';
import { UnTypePipe } from './untypePipe';

export class EndPipe extends UnTypePipe {
    
    constructor(inDirections) {
        super(inDirections);
    }

    getInDirections() {
        return this.inDirections;
    }

    getOutDirections() {
        return this.outDirections;
    }

    toCode() {
        const arg = this.toCodeArg();
        return `${arg}`;
    }

    isDirectionDefined() {
        return true;
    }

    getType() {
        return PIPE_TYPES.END;
    }
}