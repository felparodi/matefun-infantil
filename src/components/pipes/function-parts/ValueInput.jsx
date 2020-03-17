import React, {useState} from 'react';
import { VALUES_TYPES } from '../../../constants/constants';

export function hasInputValue(type) {
    return type === VALUES_TYPES.NUMBER ||
        type === VALUES_TYPES.COLOR ||
        type === VALUES_TYPES.POINT;
}

export function castValue(value, type) {
    switch(type) {
        case VALUES_TYPES.NUMBER:
            return Number(value);
        case VALUES_TYPES.COLOR:
            return { color:value }
        case VALUES_TYPES.POINT:
            return { x:Number(value.x), y: Number(value.y) }
        default:
            return value;
    }
}

export const ValueInputNumber = ({value, onBlur}) => {
    const [temValue, setValue] = useState(value ? value : 0);
    return <input className="form-control"
                onChange={(e) => setValue(e.target.value)}
                value={temValue}
                onBlur={() => onBlur(temValue)} 
                type="number"/> 
}

export const ValueInputColor = ({value, onBlur}) => {
    const [temValue, setValue] = useState(value && value.color ? value.color : "Verde");
    return (
        <select value={temValue}
            className="form-control"
            onBlur={() => onBlur(temValue)} 
            onChange={(e) => setValue(e.target.value)} >
            <option value="Negro">Negro</option> 
            <option value="Rojo">Rojo</option> 
            <option value="Verde">Verde</option> 
            <option value="Azul">Azul</option> 
        </select>
    );
}

export const ValueInputPoint = ({value, onBlur}) => {
    const [valueX, setValueX] = useState(value ? value.x ? value.x : 0 : 0);
    const [valueY, setValueY] = useState(value ? value.y ? value.y : 0 : 0);
    return (
        <div className="form-control point">
            <input value={valueX} 
                onChange={(e) => setValueX(e.target.value)}
                onBlur={() => onBlur({ x:valueX,  y:valueY})}
                className="number" 
                type="number"/>
            <input  value={valueY} 
                onChange={(e) => setValueY(e.target.value)}
                onBlur={() => onBlur({ x:valueX,  y:valueY})}
                className="number"
                type="number"/>
        </div>
    );
}

export const ValueInputText = ({value, onBlur}) => {
    const [valueTemp, setValue] = useState(value);
    return <input className="form-control"
                value={valueTemp} 
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => onBlur(valueTemp)}
                type="text"/> 
}


export const ValueInput = ({value, type, onBlur}) => {
    const handlerBlur = (temValue) => {
        onBlur(castValue(temValue, type))
    }

    switch(type) {
        case VALUES_TYPES.NUMBER:
            return <ValueInputNumber value={value} onBlur={handlerBlur}/>;
        case VALUES_TYPES.COLOR:
            return <ValueInputColor value={value} onBlur={handlerBlur}/>;
        case VALUES_TYPES.POINT:
            return <ValueInputPoint value={value} onBlur={handlerBlur}/>;
        default:
            return <ValueInputText value={value} onBlur={handlerBlur}/>;
    }
}

export default ValueInput;