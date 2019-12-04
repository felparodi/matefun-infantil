import React from 'react';
import { DIRECTION } from '../../constants/constants.js'

import Vertical from '../../svg/dummies/vertical.svg';
import Horizontal from '../../svg/dummies/horizontal.svg';
import TopRight from '../../svg/dummies/top-right.svg';
import TopLeft from '../../svg/dummies/top-left.svg';
import BottomLeft from '../../svg/dummies/bottom-left.svg';
import BottomRight from '../../svg/dummies/bottom-right.svg';

export class DummyPipe extends React.Component {

    render() {
        const { pipe } = this.props;
        if (pipe.getInDirections()[0]==DIRECTION.TOP && pipe.getOutDirections()[0]==DIRECTION.BOTTOM) {
            return (
                <Vertical width={this.props.size} height={this.props.size}></Vertical>
            )
        } else if (pipe.getInDirections()[0]==DIRECTION.TOP && pipe.getOutDirections()[0]==DIRECTION.RIGHT){
            return (
                <TopRight width={this.props.size} height={this.props.size}></TopRight>
            )
        } else if (pipe.getInDirections()[0]==DIRECTION.TOP && pipe.getOutDirections()[0]==DIRECTION.LEFT){
            return (
                <TopLeft width={this.props.size} height={this.props.size}></TopLeft>
            )
        } else if (pipe.getInDirections()[0]==DIRECTION.LEFT && pipe.getOutDirections()[0]==DIRECTION.RIGHT){
            return (
                <Horizontal width={this.props.size} height={this.props.size}></Horizontal>
            )
        } else if (pipe.getInDirections()[0]==DIRECTION.BOTTOM && pipe.getOutDirections()[0]==DIRECTION.LEFT){
            return (
                <BottomLeft width={this.props.size} height={this.props.size}></BottomLeft>
            )
        } else if (pipe.getInDirections()[0]==DIRECTION.BOTTOM && pipe.getOutDirections()[0]==DIRECTION.RIGHT){
            return (
                <BottomRight width={this.props.size} height={this.props.size}></BottomRight>
            )
        }
        return null;
    }
}

