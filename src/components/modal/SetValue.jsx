import React, {useState} from 'react';
import { VALUES_TYPES } from '../../constants/constants';
import ValueInput from '../pipes/function-parts/ValueInput'
import classNames from 'classnames';
import { SketchPicker } from 'react-color';
import { Modal } from 'react-bootstrap';

import './SetValue.scss';

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

export const SetValue = (props) => {
    const { value, type} = props;
    const [temValue, setTempValue] = useState(value);
    const modalProps = {...props};
    delete(modalProps.value);
    delete(modalProps.type);
    delete(modalProps.onHide);
    return (
        <Modal {...modalProps} 
            className={classNames("SetValue", { color: type === VALUES_TYPES.COLOR })} 
            onHide={() => props.onHide(temValue)}>
            {type !== VALUES_TYPES.COLOR && <ValueInput value={value} type={type} onBlur={setTempValue}/> }
            {type === VALUES_TYPES.COLOR && 
                <SketchPicker disableAlpha={true} 
                    color={valueToColor(temValue)} 
                    onChange={(color) => setTempValue({color: `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`})}/>
            }
        </Modal>
    )
}


export default SetValue;