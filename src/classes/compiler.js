import { MatrixPipe } from './matrix';
import * as snapHelper from './helpers/snapshot';
import * as typeHelper from './helpers/type';
import { getMateFunType } from './helpers/type';

const DEFAULT_FUNCTION_NAME = 'func';

/*
*   @desc: 
*   @attr private Matrix matrix: 
*   @scope: public
*/
export class Compiler {

    constructor() {
        this.matrix = new MatrixPipe(5,5);
        this.lastEvalValue = { hasError: false, value: null, text: '', type: null };
    }

    newMatrix(x, y) {
        this.matrix = new MatrixPipe(x, y);
    }

    getMatrix() {
        return this.matrix;
    }

    addSnapPipeToMatrix(x, y, snapPipe) {
        const { matrix } = this;
        const pipe = snapHelper.createPipeToSnap(snapPipe, this.customFunctionsMap);
        if(pipe) {
            matrix.addPipe(x, y, pipe);
        }
    }

    loadSnapMatrix(snapMatrix) {
        this.newMatrix(snapMatrix.size.x, snapMatrix.size.y);
        const pipesBulk = snapMatrix.pipes.map((snapPipe) => ({
            pos: snapPipe.pos,
            pipe: snapHelper.createPipeToSnap(snapPipe, this.customFunctionsMap)
        })).filter((data) => data.pipe)
        this.matrix.addPipeBulk(pipesBulk);
    }

    /*
    *   @desc: Devuelve si la matriz contiene una funcion 
    *   @retrun: Boolean
    *   @scope: private
    */
    isFunction() {
        const { matrix } = this;
        return [...matrix.getAllVars(), ...matrix.getAllConditions()].length > 0;
    }


    /*
    *   @desc: Retorna si es una funcion lo que se proceso o un instrucion y el conteniod que la misma tiene para
    *       ejecutarse o guardares en un archivo Matefun para se usada en el futuro
    *   @attr String name: Nombre de la funcion en caso de que sea una lo que se cosntruye
    *   @return: ProcessInfo
    *   @scope: public
    */
    getFunctionDefinition(name=DEFAULT_FUNCTION_NAME) {
        const { matrix } = this;
        const varsPipes = matrix.getAllVars();
        const endPipe = matrix.getEndPipes()[0];
        return {
            body: this.getFunctionDefinitionWithName(name),
            ret: endPipe.getValueType(),
            attrs: varsPipes.map((varPipe) => varPipe.getValueType())
        };

    }

    /*
    *   @desc: Retorna el contenido de una una funcion que se puede guardar en un archivo de Matefun
    *   @attr String name: Nombre de la funcion que se construye
    *   @return: String
    *   @scope: private
    */
    getFunctionDefinitionWithName(name) {
        const sig = this.getFunctionSignature(name);
        const eq = this.getFunctionEquation(name);
        return `${sig}\n${eq}`;
    }

    /*
    *   @desc: Debuelve la instrucion que representa el arbol contenido en la matriz.
    *           Se asume que la raiz es el unico EndPipe en la misma
    *   @return: String
    *   @scope: private
    */
    processInstruction() {
        const { matrix } = this;
        const ends = matrix.getEndPipes();
        const p = ends.length > 0 ? ends[0] : null;
        if (p === null)  throw new Error('Not Have valid init cell to process');
        return p.toCode(null, matrix);
    }

    /*
    *   @desc: Retrona la definicion de la funcion que se utiliza en un archivo Matefun
    *   @attr String name: Nombre de la funcion a definir
    *   @return: String
    *   @scope: private
    */
    getFunctionSignature(name) {
        const { matrix } = this;
        const varsPipes = matrix.getAllVars();
        const endPipe = matrix.getEndPipes()[0];
        const varsType = varsPipes.reduce(
            (prev, v, index) => index > 0 ? `${prev} X ${getMateFunType(v.getValueType())}` :`${getMateFunType(v.getValueType())}`, ''
        );
        const endType = getMateFunType(endPipe.getValueType());
        return `${name} :: ${varsType} -> ${endType}`;
    }
    
    /*
    *   @desc: Retorna el codigo representa la implementacion de una funcion para un archivo de Matefun
    *   @attr String name: Nombre de la funcion que se desa implementar
    *   @return: String
    *   @scope: private
    */
    getFunctionEquation(name) {
        const { matrix } = this;
        const varsPipes = matrix.getAllVars();
        const endPipe = matrix.getEndPipes();
        const code = endPipe[0].toCode();
        return `${name}(${varsPipes.map(pipe => pipe.getName()).join(', ')}) = ${code}`
    }

    /*
    *   @desc: Retorna la instrucion de ejecucion de una funcion con los valores cargados en las variables
    *   @attr String name: Nombre de la funcion que se desea ejecutar
    *   @return: String
    *   @scope: public
    */
    evaluateFunction(name=DEFAULT_FUNCTION_NAME) {
        let command = "";
        const isFunction = this.isFunction();
        if(isFunction) {
            const { matrix } = this;
            const varsPipes = matrix.getAllVars();
            const varValueList = varsPipes.map((pipe) => pipe.getValueEval());
            command = `${name}(${varValueList.join(', ')})`;
        } else {
            command = this.processInstruction();
        }
        return { isFunction, command };
    }

     /*
    *   @desc: Retorna una estructura de Snapshot de la matriz para trabajar con ella 
    *       sin modificar la memoria de las misma
    *   @return: SnapMatrix
    *   @scope: public
    */
    snapshot() {
        const { matrix, lastEvalValue } = this;
        const errors = [];
        const warnings = [];

        if (matrix.getEndPipes().length !== 1) {
            errors.push('no-only-one-end-pipe');
        }

        const snap = matrix.snapshot();
        snap.forEach(column => column.forEach((snapPipe) => {
            if(snapPipe.errors) errors.push(...snapPipe.errors);
            if(snapPipe.warnings) warnings.push(...snapPipe.warnings);
        }));

        const vars = matrix.getAllVars();

        const canFuncEval = vars.reduce((hasValue, pipe) => hasValue && pipe.getValue() !== undefined && pipe.getValue() !== null, true);
        
        const hasGeneric = vars.reduce((hasG, pipe) => hasG || !typeHelper.isDefined(pipe.getValueType()), false);
        
        const endPipes = matrix.getEndPipes();
        const code =  endPipes[0] ? endPipes[0].toCode() : '';

        if(hasGeneric) {
            errors.push('has-generic');
        }

        if(code.indexOf('()') >= 0) {
            errors.push('incomplete');
        }
    
        const isFunction = this.isFunction();

        const canSaveFunction = vars.length > 0 && errors.length === 0;
        const canProcess = canFuncEval && errors.length === 0
        
        return { matrix:snap,  isFunction, canProcess, canSaveFunction, lastEvalValue };
    }

    setCustomFunctionsDefinition(customFunctions) {
        this.customFunctionsMap = customFunctions.reduce((map, cf) => {
            return map.set(cf.getName(), cf);
        }, new Map());
    }

    setMateFunValue(value) {
        const { matrix } = this
        matrix.setMateFunValue(value);
        const endPipe = matrix.getEndPipes()[0];
        this.lastEvalValue = {
            hasError: endPipe.hasValueError(),
            type: endPipe.getValueType(),
            text: endPipe.getValueText(),
            value: endPipe.getValue()
        }
    }

    cleanLastValue() {
        this.lastEvalValue = { hasError: false, value: null, text: '', type: null };
    }
}



export default Compiler;