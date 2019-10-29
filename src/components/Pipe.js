import React from 'react';
import { DragSource } from 'react-dnd';
import Cross from '../svg/cross.svg';
import Vertical from '../svg/dummies/vertical.svg';
import Horizontal from '../svg/dummies/horizontal.svg';
import TopRight from '../svg/dummies/top-right.svg';
import TopLeft from '../svg/dummies/top-left.svg';
import BottomLeft from '../svg/dummies/bottom-left.svg';
import BottomRight from '../svg/dummies/bottom-right.svg';


class Pipe extends React.Component {

    render() {
        const { type, connectDragSource } = this.props;
        if (type=="cross"){
            return connectDragSource(
                <div>
                    <Cross width={this.props.size} height={this.props.size}></Cross>
                </div>  
            )
        } else if (type=="vertical"){
            return connectDragSource(
                <div>
                    <Vertical width={this.props.size} height={this.props.size}></Vertical>
                </div>
            )
        } else if (type=="horizontal"){
            return connectDragSource(
                <div>
                    <Horizontal width={this.props.size} height={this.props.size}></Horizontal>
                </div>
            )
        } else if (type=="top-right"){
            return connectDragSource(
                <div>
                    <TopRight width={this.props.size} height={this.props.size}></TopRight>
                </div>
            )
        } else if (type=="top-left"){
            return connectDragSource(
                <div>
                    <TopLeft width={this.props.size} height={this.props.size}></TopLeft>
                </div>
            )
        } else if (type=="bottom-left"){
            return connectDragSource(
                <div>
                    <BottomLeft width={this.props.size} height={this.props.size}></BottomLeft>
                </div>
            )
        } else if (type=="bottom-right"){
            return connectDragSource(
                <div>
                    <BottomRight width={this.props.size} height={this.props.size}></BottomRight>
                </div>
            )
        }
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource()
    };
}

const cardSource = {
    beginDrag(props, monitor, component) {
        const item = { type: props.type };
        return item;
    }
};

export default DragSource("SOURCE", cardSource, collect)(Pipe);

