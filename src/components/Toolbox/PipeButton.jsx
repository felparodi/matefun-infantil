import React from 'react';

import { Button } from 'react-bootstrap';
import Pipe from '../pipes/Pipe';

export const PipeButton = (props) => {
    const {onDrop, pipe} = props;
    return (
        <Button className="PipeButton pipe-button" 
            variant="outline-primary" 
            data-tip={props['data-tip']}
            data-for={props['data-for']} >
            <Pipe onDrop={onDrop} pipe={pipe} origin="toolbox"/>
        </Button>
    );
}

export default PipeButton;