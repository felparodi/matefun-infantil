import React, {useState, useEffect} from 'react';
import { SketchPicker } from 'react-color';

import './SpecificColorInput.scss';

function valueToColor(value) {
    if(value) {
        switch(value.color) {
            case 'Rojo':
                return 'rgb(255,0,0)';
            case 'Verde':
                return 'rgb(0,255,0)';
            case 'Azul': 
                return 'rgb(0,0, 255)';
            case 'Negro': 
                return 'rgb(0,0,0)';
            default:
                return value.color;
        }
    } else {
        return 'rgb(0,0,0)';
    }
}

const defaultColors = [
    '#D0021B', '#F5A623', '#F8E71C', '#8B572A', 
    '#7ED321', '#417505', '#BD10E0', '#9013FE', 
    '#4A90E2', '#50E3C2', '#B8E986', '#000000', 
    '#9B9B9B', '#FFFFFF']

export const SpecificColorInput  = ({onBlur, value}) => {
    const [tempValue, setTempValue] = useState(value);
    useEffect(() => { setTempValue(value); }, [value]);
    return (
        <div className="SpecificColorInput">
            <SketchPicker disableAlpha={true} 
                onChangeComplete={(color) => onBlur({color: `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`})}
                color={valueToColor(tempValue)} 
                presetColors={defaultColors}
                onChange={(color) => setTempValue({color: `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`}) }/>
        </div>
    );
}

export default SpecificColorInput;