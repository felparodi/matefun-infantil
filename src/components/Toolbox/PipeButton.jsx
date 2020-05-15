import React from 'react';
import { Button } from 'react-bootstrap';
import Pipe from '../pipes/Pipe';

export const PipeButton = ({onDrop, pipe}) => (
    <Button className="PipeButton pipe-button" variant="outline-primary">
        <Pipe onDrop={onDrop} pipe={pipe} origin="toolbox"/>
    </Button>
)

export default PipeButton;