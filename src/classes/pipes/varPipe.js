import { PIPE_TYPES, VALUES_TYPES } from '../../constants/constants';
import { UnTypePipe } from './untypePipe';

export class VarPipe extends UnTypePipe {

    constructor(outDirections) {
        super([], outDirections);
        this.value = undefined;
        this.setOutType(this.typeEval());
    }

    setOutType(types) {
        this.outTypes = types
    }

    getOutType(types) {
        return this.outTypes;
    }

    setValue(value) {
        this.getValue();
    }

    typeEval() {
        if (this.value === undefined) {
            return VALUES_TYPES.VAR
        }
        switch(typeof this.value) {
            case 'boolean': return [VALUES_TYPES.BOOLEAN];
            case 'number': return [VALUES_TYPES.NUMBER];
            case 'string': return [VALUES_TYPES.STRING];
            case 'function': return [VALUES_TYPES.FUNCTION];
            case 'object': {
                if (Array.isArray(this.value)) {
                    return [VALUES_TYPES.ARRAY];
                }
                return [VALUES_TYPES.OTHER];
            }
        }
    }

    toCode(direction, blockVar) {
        return `${blockVar.vars[this.index].name}`;
    }

    getType() {
        return PIPE_TYPES.VARIABLE;
    }
}