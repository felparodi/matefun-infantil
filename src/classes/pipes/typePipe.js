import { PIPE_TYPES, DIRECTION } from '../../constants/constants';
import { Pipe } from './pipe';


/*
* Pipe con Typos
* Attr
* - inTypes: List<String>
* - outType: List<String>
*/
export class TypePipe extends Pipe {
    
    constructor(inDir, outDir) {
        super(inDir, outDir)
    }

    setInTypes(inTypes) {
        this.inTypes = inTypes;
    }

    setOutTypes(outTypes) {
        this.outTypes = outTypes;
    }

    getOutTypes() {
       return this.outTypes ? this.outTypes : [];
    }

    getInTypes() {
        return this.inTypes ? this.inTypes : [];
    }

    getInType(direction) {
        const dirPos = this.getInDirections().indexOf(direction);
        return dirPos > -1 ? this.getInTypes()[dirPos] : null;
    }

    getOutType(direction) {
        const dirPos = this.getOutDirections().indexOf(direction);
        return dirPos > -1 ? this.getOutTypes()[dirPos] : null;
    }

}