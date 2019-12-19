import { PIPE_TYPES, VALUES_TYPES } from '../../constants/constants';
import { Pipe } from './pipe';

export class VarPipe extends Pipe {

    constructor(value, outDirections) {
        super([], outDirections);
        this.value = value;
        this.setOutType(this.typeEval());
    }

    setOutType(types) {
        this.outTypes = types
    }

    getOutType(types) {
        return this.outTypes;
    }

    typeEval() {
        if (this.value === null) {
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

    toCode(direction) {
        const thisOutType = this.getOutType();
        if(thisOutType.indexOf(VALUES_TYPES.STRING) === 0) return `"${this.value}"`;
        if(thisOutType.indexOf(VALUES_TYPES.NUMBER) === 0) return `${this.value}`;
        if(thisOutType.indexOf(VALUES_TYPES.BOOLEAN) === 0) return `${this.value}`;
        if(thisOutType.indexOf(VALUES_TYPES.ARRAY) === 0) return `[${this.value}]`;
        return `{${this.value}}`;
    }

    getType() {
        return PIPE_TYPES.VARIABLE;
    }
}