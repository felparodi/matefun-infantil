import { PIPE_TYPES, DIRECTION, VALUES_TYPES } from '../../constants/constants';
import {pipeDirValueType, pipeTypeDefined, matchTypes, typeCompare} from '../helpers/type';
import { processNext } from '../helpers/pipe';
import { Pipe } from './pipe';

export class EndPipe extends Pipe {
    //Vars
    type // ValueType
    value //Value
    tempType //ValueType

    constructor(type) {
        super([DIRECTION.TOP], []);
        this.type = type || VALUES_TYPES.UNDEFINED;
        this.value = undefined;
        this.clean();
    }

    //Calcula los tipos y informacion del estado del funcion   
    calc(context, board, enterDir, path) {
        if (!context.isMark(this.getPos())) {
            super.calc(context, board);
            const next = processNext(this, board)(DIRECTION.TOP);
            //Manejo de errores
            if (next.error) { this.addError(next.error); return }
            if (!next.pipe || !next.connected) { this.addWarning("No esta conectado a nada"); return; }
            //Process Next
            const newPath = enterDir ? [...path, this] : [this];
            if(next.dir !== enterDir) next.pipe.calc(context, board, next.inDir, newPath);
            //Setea Valores
            const type = pipeDirValueType(next.pipe, next.inDir);
            if (matchTypes(this.tempType, type)) {
                this.tempType = typeCompare(this.tempType, type);
            } else { 
                this.addError('No machean tipos');
                return;
            }
            //Post Process
            if(!this.errors && !pipeDirValueType(this)) {
                context.unMark(this.getPos());
            }
        }
    }

    clean() {
        super.clean();
        this.tempType = this.type;
    }

    toCode(dir, board) {
        const arg = this.toCodeArg(DIRECTION.TOP, board);
        return `${arg[0]}`;
    }

    getType() {
        return PIPE_TYPES.END;
    }

    isInDir(dir) {
        return DIRECTION.TOP === dir;
    }

    getMateFunValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }

    getValueType() {
        return this.tempType;
    }

    setValueType(type) {
        this.type = type;
    }

    setMateFunValue(value) {
        this.value = value;
    }

    hasValueError() {
        if (Array.isArray(this.value)) {
            return !!this.value.find((value) => value.resultado.indexOf('OUTError') != -1)
        } else if(this.value) {
            return this.value.resultado.indexOf('OUTError') !== -1;
        }
    }

    getValueText() {
        if (Array.isArray(this.value)) {
            let messages = '';
            this.value.forEach((value) => {
                if(value.tipo === 'salida'
                    && value.resultado.indexOf('OUTError') === -1) {
                        messages += value.resultado.replace('OUT', '') + '\n';
                }
            })
            return messages;
        } if(this.value && this.value.tipo === 'salida') {
            return this.value.resultado.replace('OUT', '');
        }
        return '';
    }

    snapshot() {
        return {
            ...(super.snapshot()),
            dir: {
                top: this.getValueType()
            },
            value: this.getMateFunValue(),
            valueText: this.getValueText(),
            hasValueError: this.hasValueError(),
        }
    }
}