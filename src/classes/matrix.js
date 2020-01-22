import { PIPE_TYPES } from '../constants/constants';

export class MatrixPipe {

    constructor(x, y) {
        this.maxX = x;
        this.maxY = y;
        this.vars = {};
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
        this.ends = new Array();
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
            return this.processFunction('func')
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
        return this.getAllPipes()
            .filter(pipe => pipe.getType() === PIPE_TYPES.VARIABLE).length > 0
    }

    getFunctionDefinition(name) {
        const varsPipes = this.getAllPipes().filter(pipe => pipe.getType() === PIPE_TYPES.VARIABLE);
        const endPipe = this.getEndPipes();
        const varsType = varsPipes.reduce((prev, v, index, vars) => index > 0 ? `${prev} X R` :`R`, '');
        const endType = 'R';
        return `${name} :: ${varsType} -> ${endType}`;
    }

    getFunctionCode(name) {
        const varsPipes = this.getAllPipes().filter(pipe => pipe.getType() === PIPE_TYPES.VARIABLE);
        const endPipe = this.getEndPipes();
        const functionDef = { name, vars:{} }
        const varNameList = [];
        varsPipes.forEach((pipe, index) => {
            pipe.index = index
            functionDef.vars[index] = { name: `x${index}`}
            varNameList.push(functionDef.vars[index].name)
        })
        console.log(functionDef)
        const code = endPipe[0].toCode(functionDef);
        return `${name}(${varNameList.join(', ')}) = ${code}`
    }

    evaluateFunction() {
        const name= 'func';

        const varsPipes = this.getAllPipes().filter(pipe => pipe.getType() === PIPE_TYPES.VARIABLE);
        const varValueList = [];
        varsPipes.forEach((pipe, index) => {
            varValueList.push(pipe.value)
        })
        return `${name}(${varValueList.join(', ')})`
    }

    hasErrors() {
       return this.getAllPipes()
            .map(pipe => pipe.getError())
            .filter(error => error !== null);
    }

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

    setPipeValue(x, y, value) {
        if (this.isValidRange(x,y)) { throw new Error("Exist pipe in this position") } 
        const p = this.values[x][y];
        if (p !== null && p !== undefined) {
            const pipeType = p.getType();
            if (pipeType === PIPE_TYPES.VALUE || pipeType === PIPE_TYPES.VARIABLE) {
                p.value= value;
                console.log(this.values[x][y]);
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