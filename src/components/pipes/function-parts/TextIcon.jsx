import React, { useState } from 'react';

const fontSize = (text) => {
    if(text.length < 3) {
        return '20px';
    } else if ( text.length <5) {
        return '15px';
    } else if ( text.length < 8) {
        return '10px';
    } else {
        return '8px';
    }
}

const textPrint = (text) => {
    return text.length < 8 ? text : `${text.substr(0, 6)}...`;
}

const TextIcon = ({text, onClick, onDoubleClick}) => {
    const [timer, setTimer] = useState(null);
    const handlerClick = (event) => {
        if(timer) return;
        console.log('handlerOnClick')
        if(onDoubleClick && onClick) {
            setTimer(setTimeout(() => {
                setTimer(null);
                onClick(event);
            }, 300));
        } else if(onClick) {
            onClick(event);
        }
    } 
    const handlerDobublClick = (event) => {
        console.log('handlerDobublClick')
        if(timer) {
            clearTimeout(timer);
            setTimer(null);
        }
        onDoubleClick && onDoubleClick(event)
    } 
    return (
        <text x="50%" y="45%" 
            dominantBaseline="central" 
            textAnchor="middle" 
            onClick={handlerClick}
            onDoubleClick={handlerDobublClick}
            fontSize={fontSize(text)} 
            fill='white'>
            { textPrint(text) }
        </text>
    );
};

export default TextIcon