import { PIPE_TYPES, DIRECTION, VALUES_TYPES, MATEFUN_TYPE } from '../constants/constants';

import { isMarked, sortPipe } from './pipes/pipe';
import { Context } from './context';

function getMateFunType(v) {
    const type = v.getValueType();
    switch (type) {
        case VALUES_TYPES.NUMBER:
            return MATEFUN_TYPE.NUMBER;
        case VALUES_TYPES.FIGURE:
            return MATEFUN_TYPE.FIGURE;
        case VALUES_TYPES.POINT:
            return MATEFUN_TYPE.POINT;
        case VALUES_TYPES.COLOR:
            return MATEFUN_TYPE.COLOR;
        default:
            return "?";
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
            const column = new Array(this.maxY);
            this.values.push(column);
        }
    }

    value(x, y) {
        if (this.isValidRange(x,y)) { throw new Error("Exist pipe in this position")} 
        return this.values[x][y];
    }

    size() {
        return [this.maxX, this.maxY];
    }

    isValidRange(x, y) {
        return x < 0 || x >= this.maxX || y < 0 || y >= this.maxY
    }

    addPipe(x, y, p) {
        if (this.isValidRange(x,y)) { throw new Error("Exist pipe in this position") }
        this.values[x][y] = p;
        p.setBoard(this);
        p.setPos(x, y);
        this.updateMatrix();
    }

    updateMatrix() {
        this.getAllPipes().forEach(p => p.clean());
        const context = new Context(this.maxX, this.maxY);
        this.getAllPipes().sort(sortPipe).forEach(p => p.calc(context, this));
        //this.getAllPipes().filter((p) => !isMarked(context, p)).forEach((p) => p.addWarning('No procesado'))
    }

    removePipe(x, y) {
        delete this.values[x][y];
        this.updateMatrix();
    }

    process() {
        if (this.isFunction()) {
            return { isFunction: true, body:this.processFunction(this.funcName) };
        } else {
            return { isFunction: false, body:this.processInstruction() };
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
        if (p === null)  throw new Error('Not Have valid init cell to process');
        return p.toCode(null, this);
    }

    isFunction() {
        return [...this.getAllVars(), ...this.getAllConditions()].length > 0;
    }

    getAllConditions() {
        return this.getAllPipes().filter((pipe) => pipe.getType() === PIPE_TYPES.CONDITION);
    }

    getFunctionDefinition(name) {
        console.log('Matrix.getFunctionDefinition')
        const varsPipes = this.getAllVars();
        const endPipe = this.getEndPipes()[0];
        const varsType = varsPipes.reduce(
            (prev, v, index) => index > 0 ? `${prev} X ${getMateFunType(v)}` :`${getMateFunType(v)}`, ''
        );
        const endType = getMateFunType(endPipe);
        return `${name} :: ${varsType} -> ${endType}`;
    }

    getFunctionCode(name) {
        const varsPipes = this.getAllVars();
        const endPipe = this.getEndPipes();
        const code = endPipe[0].toCode();
        return `${name}(${varsPipes.map(pipe => pipe.getName()).join(', ')}) = ${code}`
    }

    getAllVars() {
        return this.getAllPipes().filter(pipe => pipe.getType() === PIPE_TYPES.VARIABLE);
    }

    evaluateFunction() {
        if(this.isFunction()) {
            const varsPipes = this.getAllVars();
            const varValueList = varsPipes.map((pipe) => pipe.getValueEval());
            return `${this.funcName}(${varValueList.join(', ')})`
        }
        return this.processInstruction();
    }

    snapshot() {
        let canProcess =  this.getEndPipes().length === 1;
        const snap = Array(this.maxX).fill([]).map(() => Array(this.maxY));
        for(let x = 0; x < this.maxX; x++) {
            for(let y = 0; y < this.maxY; y++) {
                const pipe = this.value(x,y);
                if (pipe) {
                    snap[x][y] = pipe.snapshot();
                    canProcess = canProcess && !snap[x][y].errors
                }
            }
        }
        const canFuncEval = this.getAllVars().reduce((hasValue, pipe) => hasValue && pipe.getValue() !== undefined && pipe.getValue() !== null, true);
        const isFunction = this.isFunction();
        canProcess = canProcess && (!isFunction || canFuncEval);
        console.log( { board:snap,  isFunction, canProcess });
        return { board:snap,  isFunction, canProcess };
    }

    setPipeValue(x, y, value) {
        const p = this.value(x, y);
        if (p !== null && p !== undefined && p.setValue) {
            p.setValue(value);
            this.updateMatrix();
        } else {
            throw new Error("No se le puede asiganr valor a el pipe")
        }
    }

    moverPipe(x, y, pos) {
        const pipe = this.value(pos.x, pos.y);
        delete this.values[pos.x][pos.y];
        this.addPipe(x, y, pipe);
    }

    setMateFunValue(value) {
        const endPipe = this.getEndPipes()[0];
        endPipe.setMateFunValue(value);
    }
}