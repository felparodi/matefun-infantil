import React, {useState, useEffect} from 'react';
import Crallon from '../../../icons/crallon.svg';
import { VALUES_TYPES } from '../../../constants/constants';
import { colorByColorValue } from './ValueInfo';

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
    const [input, setInput] = useState(null);
    useEffect(() => {
        if(input) {
            input.focus();
        }
    })
    return <input className="value-input"
                ref={setInput}
                onChange={(e) => setValue(e.target.value)}
                value={temValue}
                onBlur={() => onBlur(temValue)} 
                type="number"/> 
}

export const ValueInputColor = ({value, onBlur}) => {
    const colorStyle = value ? colorByColorValue(value.color) : 'black';
    return (
        <div className="value-input color">
            <Crallon style={{fill: colorStyle}}/>
            <div className="color-options">
                <div className="option black" onClick={() => onBlur('Negro') }/>
                <div className="option red"  onClick={() => onBlur('Rojo') }/>
                <div className="option blue"  onClick={() => onBlur('Azul') }/>
                <div className="option green" onClick={() => onBlur('Verde') }/>
            </div>
        </div>
    );
}

export const ValueInputPoint = ({value, onBlur}) => {
    const [valueX, setValueX] = useState(value ? value.x ? value.x : 0 : 0);
    const [valueY, setValueY] = useState(value ? value.y ? value.y : 0 : 0);
    return (
        <div className="value-input point">
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
    return <input className="value-input"
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