import { PIPE_TYPES, DIRECTION, VALUES_TYPES, MATEFUN_TYPE } from '../constants/constants';
import { invertDirection, directionMove } from './helpers/direction';
import { getMateFunType, pipeDirValueType, matchPipeTypeDir } from './helpers/type';
import { sortPipe } from './helpers/pipe';
import { DummyPipe } from './pipes/dummyPipe';
import { Context } from './context';
import {BFS} from './BFSMatrix';

export function equlasPos(p1, p2) {
    return (!p1 && !p2) || (p1 && p2 && p1.x === p2.x && p1.y === p2.y);
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
        this.isWorking = false;
        this.clean();
    }

    startWork() {
        this.isWorking = true;
    }

    endWork() {
        this.isWorking = false;
        this.getAllPipes()
            .filter(p => p.endWork )
            .forEach(p => p.endWork());
    }

    getArroundPos(pos) {
        const {x, y} = pos;
        const arround = []
        if(x-1 >= 0) arround.push({x:x-1, y, dir:DIRECTION.TOP});
        if(y-1 >= 0) arround.push({x, y:y-1, dir:DIRECTION.LEFT});
        if(x+1 < this.maxX) arround.push({x:x+1, y, dir:DIRECTION.BOTTOM});
        if(y+1 < this.maxY) arround.push({x, y:y+1, dir:DIRECTION.RIGHT});
        return arround;
    }

    getArroundPipe(pos) {
        const arround = this.getArroundPos(pos).map((arr) => {
            const {x, y} = arr;
            return { dir: arr.dir, p: this.value(x,y) };
        })
        return arround.filter(a => a.p);
    }

    addDummyWorkingPipe(pos) {
        const arrounds = this.getArroundPipe(pos);
        const dir = [];
        arrounds.forEach(arr => {
            const pipe = arr.p;
            const invD = invertDirection(arr.dir);
            if(pipe.getType() === PIPE_TYPES.DUMMY && pipe.isWorking) {
                pipe.addDir(invD);
                dir.push(arr.dir);
            } else if(pipe.hasDirection(invD)) {
                dir.push(arr.dir);
                pipe.startWork && pipe.startWork();
            }
        })
        const newDummy =  new DummyPipe(...dir);
        newDummy.startWork();
        this.addPipeSpeed(pos, newDummy);
    }

    addWorkPipe(pos) {
        const {x, y} = pos;
        if (!this.isWorking) { throw new Error("La matrix no esta en porces de agrera working Pipe") }
        if (this.isValidRange(x,y)) { throw new Error("Exist pipe in this position") }
        const act = this.value(x, y)
        if(act && act.getType() !== PIPE_TYPES.DUMMY) return;
        this.addDummyWorkingPipe(pos);
        this.updateMatrix();
    }

    cratedJoinPipe(toCreate, end) {
        if(toCreate) {
            toCreate.forEach((pos, index, arr) => {
                if(index < arr.length-1) {
                    const pipe = this.value(pos.x, pos.y);
                    const next = arr[index+1];
                    if(pipe) {
                        pipe.addDir(next.dir);
                    } else {
                        const invDir = invertDirection(pos.dir);
                        this.addPipeSpeed(pos, new DummyPipe(invDir, next.dir));
                    }
                }
            })
            const endInDir = invertDirection(toCreate[toCreate.length-1].dir);
            const endOutDir =  invertDirection(end.dir);
            this.addPipeSpeed(end, new DummyPipe(endInDir, endOutDir));
        }
    }

    join(j1, j2) {
        if(equlasPos(j1, j2)) return;
        const pipe1 = this.value(j1.x, j1.y);
        const pipe2 = this.value(j2.x, j2.y);
        //Validar tipos
        if(matchPipeTypeDir(pipe1, j1.dir, pipe2, j2.dir)) {
            const start = { ...directionMove(j1, j1.dir), dir:j1.dir };
            const end = { ...directionMove(j2, j2.dir), dir:j2.dir };
            const toCreate = new BFS(start, end, this).procces();
            this.cratedJoinPipe(toCreate, end);
            this.getEndPipes().forEach(p => p.setMateFunValue(null));
            this.updateMatrix()
        } else {
            throw new Error('No mapena tipos lo que se quiere unir');
        }
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

    addPipeBulck(pipeBulck) {
        pipeBulck.forEach(info => {
            this.addPipeSpeed(info.pos, info.pipe);
        })
        this.updateMatrix();
    }

    //No valida ni actualiza la matirz
    addPipeSpeed(pos, pipe) {
        const {x, y} = pos;
        this.values[x][y] = pipe;
        pipe.setBoard(this);
        pipe.setPos(x, y);
    }

    addPipe(x, y, pipe) {
        if (this.isValidRange(x,y)) { throw new Error("Exist pipe in this position") }
        this.addPipeSpeed({x, y}, pipe)
        this.getEndPipes().forEach(p => p.setMateFunValue(null));
        this.updateMatrix();
    }

    updateMatrix() {
        this.getAllPipes().forEach(p => p.clean());
        const context = new Context(this.maxX, this.maxY);
        this.getAllPipes().sort(sortPipe).forEach(p => p.calc(context, this));
    }

    removePipe(x, y) {
        delete this.values[x][y];
        this.getEndPipes().forEach(p => p.setMateFunValue(null));
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
            (prev, v, index) => index > 0 ? `${prev} X ${getMateFunType(v.getValueType())}` :`${getMateFunType(v.getValueType())}`, ''
        );
        const endType = getMateFunType(endPipe.getValueType());
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
        return { board:snap,  isFunction, canProcess, isWorking: this.isWorking };
    }

    setPipeValue(x, y, value) {
        const p = this.value(x, y);
        if (p !== null && p !== undefined && p.setValue) {
            p.setValue(value);
            this.getEndPipes().forEach(p => p.setMateFunValue(null));
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