import { PIPE_TYPES, DIRECTION } from '../constants/constants';
import { FuncPipe } from './pipes/funcPipe';
import { EndPipe } from './pipes/endPipe';
import { ConstPipe } from './pipes/constPipe';
import { DummyPipe } from './pipes/dummyPipe'
import { VarPipe } from './pipes/varPipe'

export function createPipe(snapshot) {
    console.log('createPipe', snapshot);
    switch(snapshot.type) {
        case PIPE_TYPES.END:
            return new EndPipe();
        case PIPE_TYPES.DUMMY:
            return new DummyPipe(...snapshot.allDirections);
        case PIPE_TYPES.FUNCTION:
            return new FuncPipe(snapshot.name, snapshot.inTypes.list, snapshot.outType);
        case PIPE_TYPES.VARIABLE:
            return new VarPipe()
        case PIPE_TYPES.VALUE:
            return new ConstPipe(snapshot.value);
    }
}
/*
* Attr:
    maxY -> 
    maxX ->
    values -> 
*/
export class MatrixPipe {

    constructor(x, y) {
        this.maxX = x;
        this.maxY = y;
        this.funcName = 'func';
        this.clean();
    }

    getAllPipes() {
        const pipes = new Array();
        for(let i = 0; i < this.maxY; i++) {
            for(let j = 0; j < this.maxX; j++) {
                const pipe = this.value(j,i);
                if (pipe !== null && pipe !== undefined) {
                    pipes.push(pipe);
                }
            }
        }
        return pipes;
    }

    getEndPipes() {
        return this.getAllPipes()
            .filter(pipe => pipe.getType() === PIPE_TYPES.END);
    }

    clean() {
        this.values = new Array();
        for(let i = 0; i < this.maxX; i++) {
            const column = new Array();
            for(let j = 0; j < this.maxY; j++) {
                column.push(null);
            }
            this.values.push(column);
        }
    }

    value(x, y) {
        return this.values[x][y];
    }

    size() {
        return [this.maxX, this.maxY];
    }

    isValidRange(x, y) {
        return x < 0 || x >= this.maxX || y < 0 || y >= this.maxY
    }

    validateRange(x, y) {
        if (this.isValidRange(x,y)) {
            throw new Error("Out of range")
        }
    }
    validateAddPipe(x, y, p) {
        this.validateRange(x, y)
        //@TODO Ver que el tubo puede ser agregado
    }

    addPipe(x, y, p) {
        if (this.isValidRange(x,y)) { throw new Error("Exist pipe in this position") } 
        this.values[x][y] = p;
        p.setBoard(this);
        p.setPos(x, y);
    }

    removePipe(x, y) {
        //@TODO Remove to ends list in case to remove pipe is end pipe
        this.values[x][y] = null
    }

    process() {
        if (this.isFunction()) {
            return this.processFunction(this.funcName)
        } else {
            return this.processInstruction()
        }
    }

    processFunction(name) {
        const def = this.getFunctionDefinition(name)
        const code = this.getFunctionCode(name)
        return `${def}\n${code}`
    }

    processInstruction() {
        const ends = this.getEndPipes();
        const p = ends.length > 0 ? ends[0] : null;
        if (p === null) {
            throw 'Not Have valid init cell to process';
        }
        return p.toCode()
    }

    isFunction() {
        return this.getAllVars().length > 0
    }

    getFunctionDefinition(name) {
        console.log('Matrix.getFunctionDefinition')
        const varsPipes = this.getAllVars();
        const endPipe = this.getEndPipes();
        const varsType = varsPipes.reduce((prev, v, index, vars) => index > 0 ? `${prev} X R` :`R`, '');
        const endType = 'R';
        return `${name} :: ${varsType} -> ${endType}`;
    }

    getFunctionCode(name) {
        const varsPipes = this.getAllVars();
        const endPipe = this.getEndPipes();
        //Set Vars index
        varsPipes.forEach((pipe, index) => {
            pipe.setIndex(index);
        })
        const code = endPipe[0].toCode();
        return `${name}(${varsPipes.map(pipe => pipe.getName()).join(', ')}) = ${code}`
    }

    getAllVars() {
        return this.getAllPipes().filter(pipe => pipe.getType() === PIPE_TYPES.VARIABLE);
    }

    evaluateFunction() {
        const varsPipes = this.getAllVars();
        const varValueList = varsPipes.map((pipe) => pipe.value);
        return `${this.funcName}(${varValueList.join(', ')})`
    }

    hasErrors() {
       return this.getAllPipes()
            .map(pipe => pipe.getError())
            .filter(error => error !== null);
    }

    //@deprecate
    clone() {
        const m = new MatrixPipe(this.maxX, this.maxY);
        for(let x = 0; x < this.maxX; x++) {
            for(let y = 0; y < this.maxY; y++) {
                const pipe = this.value(x,y);
                if (pipe !== null) {
                    m.addPipe(x, y, pipe.clone());
                }
            }
        }
        return m;
    }

    snapshot() {
        const snap = Array(this.maxX).fill([]).map(() => Array(this.maxY));
        for(let x = 0; x < this.maxX; x++) {
            for(let y = 0; y < this.maxY; y++) {
                const pipe = this.value(x,y);
                if (pipe !== null) {
                    snap[x][y] = pipe.snapshot();
                }
            }
        }
        return snap;
    }

    setPipeValue(x, y, value) {
        if (this.isValidRange(x,y)) { throw new Error("Exist pipe in this position") } 
        const p = this.values[x][y];
        if (p !== null && p !== undefined) {
            const pipeType = p.getType();
            if (pipeType === PIPE_TYPES.VALUE || pipeType === PIPE_TYPES.VARIABLE) {
                p.value= value;
            }
        }
    }

    setResultValue(value) {
        const endPipe = this.getEndPipes()[0];
        endPipe.value= value;
    }

    validateMatrix() {

    }
}