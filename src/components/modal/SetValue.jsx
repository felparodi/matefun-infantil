import React, {useState} from 'react';
import { VALUES_TYPES } from '../../constants/constants';
import ValueInput from '../pipes/function-parts/ValueInput'
import { Modal } from 'react-bootstrap';

import './SetValue.scss';

export const SetValue = (props) => {
    const { value, type} = props;
    const [temValue, setTempValue] = useState(value);
    const modalProps = {...props};
    delete(modalProps.value);
    delete(modalProps.type);
    delete(modalProps.onHide);
    debugger
    return (
        <Modal className="SetValue" {...modalProps} onHide={() => props.onHide(temValue)}>
            {type !== VALUES_TYPES.COLOR && <ValueInput value={value} type={type} onBlur={setTempValue}/> }
            {type === VALUES_TYPES.COLOR && <p>Penndig</p> }
        </Modal>
    )
}


export default SetValue;