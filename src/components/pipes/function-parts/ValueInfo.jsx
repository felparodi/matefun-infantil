import React , {useState}  from 'react';
import {VALUES_TYPES, } from '../../../constants/constants';
import TextIcon from './TextIcon';
import Crallon from '../../../icons/crallon.svg';

export function colorByColorValue(value) {
    switch(value) {
        case 'Negro':
            return 'black';
        case 'Azul':
            return 'blue';
        case 'Rojo':
            return 'red';
        case 'Verde':
            return 'green';
    }
}
//TODO Agrear Mas Variantes para COLOR u otros
//TODO dobleClick
const ValueInfo = ({onClick, onDoubleClick, text, type}) => {
    const [timer, setTimer] = useState(null);
    const handlerClick = (event) => {
        if(timer) return;
        console.log('handlerOnClick')
        if(onDoubleClick && onClick) {
            setTimer(setTimeout(() => {
                setTimer(null);
                onClick(event);
            }, 200));
        } else if(onClick) {
            onClick(event);
        }
    } 
    const handlerDoubleClick = (event) => {
        console.log('handlerDoubleClick')
        if (timer) {
            clearTimeout(timer);
            setTimer(null);
        }
        onDoubleClick && onDoubleClick(event)
    } 
    switch(type) {
        case VALUES_TYPES.COLOR:
            return <Crallon 
                onClick={handlerClick}
                onDoubleClick={handlerDoubleClick}
                style={{fill: colorByColorValue(text)}}/>;
        default:
            return <TextIcon 
                onClick={handlerClick} 
                onDoubleClick={handlerDoubleClick}
                text={text}/>;
    }
    
}

export default ValueInfo;