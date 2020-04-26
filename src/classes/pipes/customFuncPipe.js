import { PIPE_TYPES } from '../../constants/constants';

import { FuncPipe } from './funcPipe';


/*
*   @desc: 
*   @attr private String body: "JSON de como se costruyo la tuberia"
*/
export class CustomFuncPipe extends FuncPipe {

    /*
    *   @desc: Constructor
    *   @attr String name:
    *   @attr Array<ValueType> inTypes:
    *   @attr ValueType outType:
    *   @attr String body:
    *   @scope: public
    */
    constructor(name, inTypes, outType, body="{}") {
       super(name, inTypes, outType);
       this.body = body;
    } 

    /*
    *   @desc: Devuelve el PipeType que representa a la CustomFuncPipe
    *   @return: PipeValue
    *   @scope: public
    *   @override
    */
    getType() {
        return PIPE_TYPES.CUSTOM;
    }

    snapshot() {
        return {
            ...super.snapshot(),
            body: this.body
        }
    }
}