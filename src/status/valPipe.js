import { Pipe, VALUE } from './pipe'

export const TYPE_BOOLEAN = 'BOOLEAN';
export const TYPE_STRING = 'STRING';
export const TYPE_NUMBER = 'NUMBER';
export const TYPE_ARRAY = 'ARRAY';
export const TYPE_OTHER = 'OTHER';


export class ValPipe extends Pipe {

    constructor(value) {
        super()
        this.value = value;
        this.setOutType(this.typeEval())
    }

    typeEval() {
        switch(typeof this.value) {
            case 'boolean': return [TYPE_BOOLEAN];
            case 'number': return [TYPE_NUMBER];
            case 'string': return [TYPE_STRING];
            default: return [TYPE_OTHER];
        }
    }

    toString() {
        const thisOutType = this.getOutType();
        if(thisOutType.indexOf(TYPE_STRING) === 0) return `"${this.value}"`;
        if(thisOutType.indexOf(TYPE_NUMBER) === 0) return `${this.value}`;
        if(thisOutType.indexOf(TYPE_BOOLEAN) === 0) return `${this.value}`;
        return `{${this.value}}`;
    }

    getType() {
        return VALUE;
    }
}