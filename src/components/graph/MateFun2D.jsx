import React from 'react';
import { MateFunGraph2D }from '../../mateFunGraph/2D';
import './MateFun2D.scss';

export class MateFun2D extends React.Component {

    constructor(props) {
        super(props);
        this.graphDiv = React.createRef();
        this.matFun = null;
        this.toggleGrid = this.toggleGrid.bind(this);
        this.toggleAxis = this.toggleAxis.bind(this);
        this.toggleTip = this.toggleTip.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
        this.zoomIn = this.zoomIn.bind(this);
        this.recenterPlot = this.recenterPlot.bind(this);
        this.exportPlot = this.exportPlot.bind(this)
    }

    componentDidMount() {
        //To run after Render div container an run css sheets
        setTimeout(() => {
            const { value } = this.props;
            const { current } = this.graphDiv;
            const containerId = current.id
            const bounding = current.getBoundingClientRect();
            this.matFun = new MateFunGraph2D(`#${containerId}`,bounding);
            if (value) {
                this.matFun.render(value);
            }
        })
    }

    componentDidUpdate(prevProps) {
        if(prevProps.value !== this.props.value) {
            this.matFun.render(this.props.value);
        }
    }

    toggleGrid() {
        this.matFun.toggleGrid();
    }

    toggleAxis() {
        this.matFun.toggleAxis()
    }

    toggleTip() {
        this.matFun.toggleTip()
    }

    zoomOut() {
        this.matFun.zoomOut();
    }

    zoomIn() {
        this.matFun.zoomIn();
    }

    recenterPlot() {
        this.matFun.recenterPlot();
    }

    exportPlot() {
        this.matFun.exportPlot();
    }

    render() {
        return (
            <div className='MateFun2D'>
                <div className='buttons'>
                    <button onClick={this.toggleGrid}>toggleGrid</button>
                    <button onClick={this.toggleAxis}>toggleAxis</button>
                    <button onClick={this.toggleTip}>toggleTip</button>
                    <button onClick={this.zoomOut}>zoomOut</button>
                    <button onClick={this.zoomIn}>zoomIn</button>
                    <button onClick={this.recenterPlot}>recenterPlot</button>
                    <button onClick={this.exportPlot}>exportPlot</button>
                </div>
                <div ref={this.graphDiv} id="graph-container" className='graphic'>
                </div>
            </div>
        )
    }
}

export default MateFun2D;