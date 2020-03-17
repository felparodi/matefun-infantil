import React from 'react';
import classNames from 'classnames';
import { VALUES_TYPES } from '../../constants/constants';
import { MateFunGraph2D } from '../../mateFunGraph/2D';
import Grid from '../../icons/grid.svg';
import Axis from '../../icons/axis.svg';
import SpeedMore from '../../icons/speedMore.svg';
import SpeedLest from '../../icons/speedLest.svg';
import SpeedNormal from '../../icons/speedNormal.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faArrowsAlt, faSearchMinus, faSearchPlus, faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
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
        this.exportPlot = this.exportPlot.bind(this);
        this.pause = this.pause.bind(this);
        this.play = this.play.bind(this);
        this.moreSpeed = this.moreSpeed.bind(this)
        this.lestSpeed = this.lestSpeed.bind(this);
        this.normalSpeed = this.normalSpeed.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.state = {
            toggleGrid: true,
            toggleAxis: false,
            play: true
        }

    }

    handleResize() {
        const { current } = this.graphDiv;
        const bounding = current.getBoundingClientRect();
        this.matFun.setBounding(bounding);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        if(this.matFun) {
            this.matFun.cleanPlot();
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
        //To run after Render div container an run css sheets
        setTimeout(() => {
            const { value } = this.props;
            const { current } = this.graphDiv;
            const containerId = current.id
            const bounding = current.getBoundingClientRect();
            this.matFun = new MateFunGraph2D(`#${containerId}`,bounding);
            this.matFun.toggleAxis();
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
        const {toggleGrid} = this.state;
        this.setState({ toggleGrid: !toggleGrid });
        setTimeout(() => this.matFun.toggleGrid());
    }

    toggleAxis() {
        //this.matFun.toggleAxis()
        const {toggleAxis} = this.state;
        this.setState({ toggleAxis: !toggleAxis });
        setTimeout(() => this.matFun.toggleAxis());
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

    pause() {
        this.setState({ play: false });
        setTimeout(() => this.matFun.pauseAnimation());
    }

    play() {
        this.setState({ play: true });
        setTimeout(() => this.matFun.runAnimation());
    }

    normalSpeed() {
        this.matFun.restoreSpeed();
    }

    moreSpeed() {
        this.matFun.increaseSpeed()
    }

    lestSpeed() {
        this.matFun.decreaseSpeed();
    }

    render() {
        const {type} = this.props;
        const {toggleAxis, toggleGrid, play} = this.state;
        const animation = type === VALUES_TYPES.list(VALUES_TYPES.FIGURE);
        return (
            <div className='MateFun2D'>
                <div className='buttons'>
                    <button className={classNames({'inactive': !toggleGrid})} onClick={this.toggleGrid}><Grid/></button>
                    <button className={classNames({'inactive': !toggleAxis})} onClick={this.toggleAxis}><Axis/></button>
                    <button onClick={this.zoomIn}><FontAwesomeIcon icon={faSearchPlus}/></button>
                    <button onClick={this.zoomOut}><FontAwesomeIcon icon={faSearchMinus}/></button>
                    <button onClick={this.recenterPlot}><FontAwesomeIcon icon={faArrowsAlt}/></button>
                    {
                        animation && (play ? 
                        <button onClick={this.pause}><FontAwesomeIcon icon={faPause}/></button> :
                        <button onClick={this.play}><FontAwesomeIcon icon={faPlay}/></button> )
                    }
                    { animation && <button disabled={!play} className={classNames({'inactive': !play})} onClick={this.moreSpeed}><SpeedMore/></button> }
                    { animation && <button disabled={!play} className={classNames({'inactive': !play})} onClick={this.normalSpeed}><SpeedNormal/></button> }
                    { animation && <button disabled={!play} className={classNames({'inactive': !play})} onClick={this.lestSpeed}><SpeedLest/></button> }
                    <button onClick={this.exportPlot}><FontAwesomeIcon icon={faDownload}/></button>
                </div>
                <div className='graphic'>
                    <div ref={this.graphDiv} id="graph-container">
                    </div>
                </div>
            </div>
        )
    }
}

export default MateFun2D;