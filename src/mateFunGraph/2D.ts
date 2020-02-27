import * as functionPlot from 'function-plot';
import { Animation, Setting, toJSON, triggerDownload } from './helper';

export interface Bounding {
    width: any;
    height: any;
}

export class MateFunGraph2D {
    private target: string = '#graph2D-container';
    private bounding: Bounding;

    // Chart Instance
    private instance: any;

    // Settings
    public settings: Setting = {
        axis: true,
        grid: true,
        tip: true
    }

    private funciones= [];
    private id = 0;
    private valores = [];
    private conjunto= [];

    // Animation state
    public animation: Animation = {
        data: [],
        init: false,
        currentFrame: 0,
        fps: 10,
        playing: false,
        timeout: null,
        animationFrame: null,
        speedX: 10,
        boton: true,
        zoo: 2000
    };

    public constructor(target:string, bounding:Bounding) {
        this.target = target; 
        this.bounding = bounding;
        this.renderClean();
    }

    public easeInOutCubic = function(fps) {
        var t = fps < 6 ? 6 : fps;
        var k = t/60;
        var animation = k<.5 ? 60*(4*k*k*k) : 60*((k-1)*(2*k-2)*(2*k-2)+1);
        console.log(animation);
        return animation;
    }

    public setZoom = () => {
        this.animation.zoo = this.animation.zoo ;  
    }
    public multiGraf = () => { 
        this.animation.boton = !this.animation.boton;
    }

    private renderCanvas(canvas:any) {
        var shapesData = JSON.parse(canvas.resultado);
        var shapesDataNormalized = this.normalizeShapesData(shapesData);
        this.cleanPlot();
        this.instance = this.createPlotInstance(shapesDataNormalized);
    }

    private renderAnimation(canvas:any) {
        this.cleanPlot();                  
        var animationData = canvas.resultado.map((res:string) => JSON.parse(res));
        for (var frame of animationData) {
            this.animation.data.push(this.normalizeShapesData(frame));
        }
        this.runAnimation();
        this.animation.init = true;
    }

    public render(canvas:any) {
        console.log('Graph2D util render', canvas);
        const { target, bounding } = this;
        if (this.animation.init) {
            this.stopAnimation();
        }
        switch(canvas.tipo) { 
            case 'graph': {
                console.log(canvas.resultado)
                // var jsonCanvas = JSON.parse(JSONRepair(canvas.resultado));
                var jsonCanvas = JSON.parse(canvas.resultado);
                var conjs = this.obtenerConjunto(jsonCanvas.funs[0]);
                var d = conjs + "}"; //Leo
                var obj = JSON.parse(d);

                //Para las funciones 
                if (obj.conj.sets.fdom == "function(x)") {
                    var nom = jsonCanvas.funs[0].dom;
                    var elemento1 = this.recursionfuncion(jsonCanvas.funs[0].sets, nom);
                    var funcionString = '';
                    funcionString ="var "+nom+" = function(x){\nreturn "+elemento1+"}\n"

                    funcionString += 'return ' + nom + '(x);\n'
                    
                    for (var funs of jsonCanvas.funs) {
                        funcionString = 'var ' + funs.fun + ' = function('+funs.args+'){\n return ' + this.generarExpresion(funs.bdy) + '}\n' + funcionString;
                    }
                    funcionString = '(x)=>{\n' + funcionString + '}';
                    obj.conj.sets.fdom = eval(funcionString);
                }

                if (obj.conj.sets.fcod == "function(x)") {
                   
                    var nom = jsonCanvas.funs[0].cod;
                    var elemento2 = this.recursionfuncionCod(jsonCanvas.funs[0].sets, nom);
                    console.log(elemento2)

                    obj.conj.sets.fcod = function (x) { return (eval(elemento2)) }

                    var funcionString = '';
                    funcionString ="var "+nom+" = function(x){\nreturn "+elemento2+"}\n"

                    funcionString += 'return ' + nom + '(x);\n'
                    
                    for (var funs of jsonCanvas.funs) {
                        funcionString = 'var ' + funs.fun + ' = function('+funs.args+'){\n return ' + this.generarExpresion(funs.bdy) + '}\n' + funcionString;
                    }
                    funcionString = '(x)=>{\n' + funcionString + '}';

                    obj.conj.sets.fdom = eval(funcionString);
                }

                var funcionGenerada = this.generarFuncion(jsonCanvas);

                //para Enumerados
                if (obj.conj.dom == 'Numer') {
                    var j = 0;
                    for (var f of obj.conj.sets.fdom) {
                        var expresionDom = new RegExp('( '+f+' )', 'g'); 
                        funcionGenerada = funcionGenerada.replace(expresionDom, j.toString()); 
                        j += 1;
                    }
                }

                if (obj.conj.cod == 'Numer') {
                    var j2 = 0;
                    for (var f2 of obj.conj.sets.fcod) {
                        var expresionCod = new RegExp(f2, 'g'); 
                        funcionGenerada = funcionGenerada.replace(expresionCod, j2.toString()); 
                        j2 += 1;
                    }
                }

                if (obj.conj.baseDom == 'R'){
                    obj.conj.baseCod = 'R';
                    if (obj.conj.cod != 'Func'){
                        obj.conj.cod = 'R';
                        obj.conj.fcod = 'R'; 
                    }
                }

                let fun = eval(funcionGenerada);
                var colores = ['violet', 'red', 'blue', 'orange', 'green','black']
                var num = this.getRandomArbitrary(0, 5);
                var color = colores[num];

                var tipoGraf;
                if (obj.conj.baseDom != 'R'){
                    tipoGraf = 'scatter';
                } else {
                    tipoGraf = 'polyline';
                }
                if (this.animation.boton && obj.conj.cod != 'Numer' && obj.conj.dom != 'Numer') {
                    if(this.conjunto.length == 1 && (this.conjunto[0].cod == 'Numer' || this.conjunto[0].dom == 'Numer')){
                        this.conjunto = [];
                        this.conjunto.push(obj.conj);
                        this.id = 0;
                        this.funciones = [];
                        if(obj.conj.baseDom == 'R'){
                            this.valores = [];
                            var funcionGenerada2 = this.generarFuncionDisc(jsonCanvas);
                            
                            var funcionesVer2019 =  this.createListFunction(jsonCanvas);
                            var listValores = [];
                            for (var k of this.valores){
                                listValores.push(parseInt(k))
                            }   
                            for (var i of this.valores){
                                for(var t of this.valores){
                                    var aux = parseInt(t);
                                    var aux2 = parseInt(i);
                                    var mul = aux * aux2;
                                    listValores.push(mul)
                                }
                            }
                            for (i = -999; i < 1000; i++) {                                      
                                listValores.push(i)
                            }
                            let sinRepetidos = listValores.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);

                            for (var fun2 of funcionesVer2019){
                                let fun3 = eval(fun2);
                                var insertar = false;
                                var punto1 = [];

                                if (sinRepetidos.length) {
                                    for (var p of sinRepetidos){
                                        var pn= parseInt(p) - 0.001
                                        var pp= parseInt(p) + 0.001
                                        insertar = (((fun3(pp) != undefined) ) || ((fun3(pn) != undefined)) || insertar)
                                        if((fun3(pp) != undefined)){
                                            punto1.push(pp);
                                        }else if ((fun3(pn) != undefined)){
                                            punto1.push(p);
                                        }
                                    }
                                } else {
                                    insertar = true;
                                }
                                if (insertar) {
                                    console.log("A")
                                    this.funciones.push({
                                        id: 0,
                                        sampler: 'builtIn',
                                        fn: function(scope) {
                                            return fun3(scope.x)
                                        },
                                        graphType: tipoGraf,
                                        point:punto1[0],
                                        color: color,
                                        
                                    });
                                }
                            } 
                        } else {
                            console.log("B")
                            this.funciones.push({
                                id: this.funciones.length,
                                sampler: 'builtIn',
                                fn: function(scope) {
                                    return fun(scope.x)
                                },
                                graphType: tipoGraf,
                                color: color
                            })
                        } 
                             
                    } else {
                        if(this.conjunto.length == 1){
                            this.id = 1;
                      
                            this.conjunto.unshift({radio: 2, dom:this.conjunto[0].baseDom, cod:this.conjunto[0].baseCod, baseCod:this.conjunto[0].baseCod, baseDom:this.conjunto[0].baseDom, sets:{fdom:this.conjunto[0].baseDom,fcod:this.conjunto[0].baseCod}});
                            this.funciones[0].id = this.id;
                            
                        }
                        if (this.conjunto.length != 0){ 
                            if (obj.conj.baseDom == 'R'){
                                this.conjunto[0].baseDom = 'R';
                                this.conjunto[0].dom = 'R';
                                this.conjunto[0].sets.fdom = 'R';
                            }
                            if (obj.conj.baseCod == 'R'){
                                this.conjunto[0].baseCod = 'R';
                                this.conjunto[0].cod = 'R';
                                this.conjunto[0].sets.fcod = 'R';
                            }
                        }    
                        this.conjunto.push(obj.conj);
                        var identificador=0;
                            if (this.conjunto.length > 1){
                                identificador=this.conjunto.length - 2 + this.id;
                            }
                        if(obj.conj.baseDom == 'R'){
                           this.valores = [];
                           var funcionGenerada2 = this.generarFuncionDisc(jsonCanvas);

                           var funcionesVer2019 =  this.createListFunction(jsonCanvas);
                           var listValores = [];
                           for (var k of this.valores){
                              listValores.push(parseInt(k))
                           }   
                           for (var i of this.valores){
                              for(var t of this.valores){
                                 var aux = parseInt(t);
                                 var aux2 = parseInt(i);
                                 var mul = aux * aux2;
                                 listValores.push(mul)
                               }
                            }
                            for (i = -999; i < 1000; i++) {                                      
                                listValores.push(i)
                            }
                            let sinRepetidos = listValores.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);
                            for (var fun2 of funcionesVer2019){
                                let fun3 = eval(fun2);
                                var insertar = false;
                                var punto1 = [];

                                if (sinRepetidos.length){
                                    for (var p of sinRepetidos){
                                        var pn= parseInt(p) - 0.001
                                        var pp= parseInt(p) + 0.001
                                        insertar = (((fun3(pp) != undefined) ) || ((fun3(pn) != undefined)) || insertar)
                                        if((fun3(pp) != undefined)){
                                            punto1.push(pp);
                                        }else if ((fun3(pn) != undefined)){
                                            punto1.push(p);
                                        }
                                    }
                                } else {
                                    insertar = true;
                                }
                                if (insertar){
                                    console.log(fun3)
                                    this.funciones.push({
                                        id: identificador,
                                        sampler: 'builtIn',
                                        fn: function(scope) {
                                        return fun3(scope.x)
                                        },
                                        graphType: tipoGraf,
                                        point:punto1[0],
                                        color: color,
                                       
                                    });
                                }
                            } 
                        } else {
                            console.log("D")
                            this.funciones.push({
                                id: identificador,
                                sampler: 'builtIn',
                                fn: function(scope) {
                                return fun(scope.x)
                                },
                                graphType: tipoGraf,
                                color: color
                            });
                        }
                        
                    }        
                } else { 
                    this.conjunto = [];
                    this.conjunto.push(obj.conj);
                    this.id = 0;
                    this.funciones = [];

                    if (obj.conj.baseDom == 'R') {
                        this.valores = [];
                        var funcionGenerada2 = this.generarFuncionDisc(jsonCanvas);
                        var funcionesVer2019 =  this.createListFunction(jsonCanvas);
                        var listValores = [];

                        for (var k of this.valores) {
                           listValores.push(parseInt(k))
                        }

                        for (var i of this.valores) {
                           for(var t of this.valores){
                              var aux = parseInt(t);
                              var aux2 = parseInt(i);
                              var mul = aux * aux2;
                              listValores.push(mul)
                            }
                        }

                        for (i = -999; i < 1000; i++) {                                      
                            listValores.push(i)
                        }
                        
                        let sinRepetidos = listValores.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);

                        for (var fun2 of funcionesVer2019) {
                            let fun3 = eval(fun2);
                            var insertar = false;
                            var punto1 = [];

                            if (sinRepetidos.length) {
                                for (var p of sinRepetidos) {
                                    var pn= parseInt(p) - 0.001
                                    var pp= parseInt(p) + 0.001
                                    insertar = (((fun3(pp) != undefined) ) || ((fun3(pn) != undefined)) || insertar)
                                    if ((fun3(pp) != undefined)) {
                                        punto1.push(pp);
                                    } else if ((fun3(pn) != undefined)) {
                                        punto1.push(p);
                                    }
                                }
                            } else {
                                insertar = true;
                            }

                            if (insertar) {
                                this.funciones.push({
                                    id: 0,
                                    sampler: 'builtIn',
                                    fn: function(scope) {
                                    return fun3(scope.x)
                                    },
                                    graphType: tipoGraf,
                                    point:punto1[0],
                                    color: color,
                                });
                            }
                        } 
                    } else {
                        this.funciones.push({
                            id: this.funciones.length,
                            sampler: 'builtIn',
                            fn: function(scope) {
                            return fun(scope.x)
                            },
                            graphType: tipoGraf,
                            color: color
                        });

                    }
                }
                this.instance = this.createGraficPloteInstace(this.conjunto, this.funciones, this.animation);
                break; 
            }
            case 'canvas': {
                this.renderCanvas(canvas);
                break; 
            }
            case 'animacion': {
                this.renderAnimation(canvas);
                break; 
            }
        }
    }

    public renderClean() {
        const { bounding } = this;
        if (!this.instance) {
            this.instance = functionPlot({
                target: this.target,
                width: bounding.width,
                height: bounding.height,
                grid: this.settings.grid,
                axis:  this.settings.axis,
                xAxis: {
                    scale: 'linear',
                    domain: {
                        initial: [-10, 10],
                        type: 'discrete'
                    }
                },
                data: []
            })
        }
    }

    public setBounding(bounding:Bounding) {
        const { instance } = this;
        this.bounding = bounding;
        if (bounding.width > 0 && instance) {
            instance.options.width = bounding.width;
            instance.options.height = bounding.height;
            instance.build();
        }
    }

    private createGraficPloteInstace = (conjunto, funciones, animation) => {
        const { bounding, target, settings } = this;
        return functionPlot({
            target: '#graph2D-container',
            grid: settings.grid,
            axis:  settings.axis,
            width: bounding.width,
            height: bounding.height,
            tip: { 
                color: 'green'
            },
            xAxis: {
                scale: 'linear',
                domain: { 
                    initial: [-4, 4],
                    type: 'discrete' 
                },
                yAxis: { domain: [-4, 4] }
            },
            conj: this.conjunto,
            data: this.funciones,
            zoom: animation ? animation.zoo : undefined,
            plugins: [
                functionPlot.plugins.zoomBox()
            ]
        })

    }

    private createPlotInstance = (data) => {
        const { bounding, settings, target } = this;
        return functionPlot({
            target: target,
            grid: settings.grid,
            axis:  settings.axis,
            width: bounding.width,
            height: bounding.height,
            xAxis: {
                label: 'x - axis',
                scale: 'linear',
                domain: {
                    initial: [-10, 10],
                    type: 'discrete'
                }
            },
            data: data,
            plugins: [
                functionPlot.plugins.zoomBox()
            ]
        });
    }

    /**
     * @name updateFrame
     * @desc update data for Function Plot and redraw the graph
     */
    public updateFrame = function() {
        var $this = this;
        var $data = $this.animation.data[$this.animation.currentFrame];
        if ($this.instance) {
            $this.instance.options.data = $data;
            $this.instance.draw();
        } else {
            $this.instance = this.createPlotInstance($data);
        }
        // Update Frame
        $this.animation.timeout = setTimeout(function() {
            $this.animation.currentFrame = ($this.animation.currentFrame + 1) % $this.animation.data.length;
            $this.animation.animationFrame = requestAnimationFrame($this.updateFrame.bind($this));
        }, 1000/ this.easeInOutCubic($this.animation.fps));
    }

    /**
     * @name runAnimation
     * @desc Run Shapes Animation
     */
    public runAnimation = function() {
        if (this.animation.playing) return;
        var $this = this;
        $this.animation.playing = true;
        $this.updateFrame();
    }

    /**
     * @name pauseAnimation
     * @desc Pause Shapes Animation
     */
    public pauseAnimation = function() {
        var $this = this;
        cancelAnimationFrame($this.animation.animationFrame);
        clearTimeout($this.animation.timeout);
        $this.animation.timeout = null;
        $this.animation.playing = false;
    }

    /**
     * @name stopAnimation
     * @desc Stop Shapes Animation
     */
    public stopAnimation = function() {
        var $this = this;
        $this.pauseAnimation();
        $this.animation.data = [];
        $this.animation.currentFrame = 0;
        $this.animation.init = false;
        this.instance.removeAllGraphs();
    }

    /**
     * @name decreaseSpeed
     * @desc Decrease Speed Animation
     */
    public decreaseSpeed = function() {
        var decrease = false;
        if (this.animation.fps > 6) {
            decrease = true;
        }
        if (decrease) {
            if (this.animation.fps > 10) {
                this.animation.fps -= 1;
                this.animation.speedX = this.animation.fps / 10;
            } else {
                this.animation.fps -= 1;
                this.animation.speedX = this.animation.fps / 10;
            }
            this.pauseAnimation();
            this.runAnimation();
        }
    }
    
    /**
     * @name restoreSpeed
     * @desc Increase Speed Animation
     */
    public restoreSpeed = function() {
        this.animation.fps = 10;
        this.animation.speedX = 1;
        this.pauseAnimation();
        this.runAnimation();
    }

    /**
     * @name increaseSpeed
     * @desc Increase Speed Animation
     */
    public increaseSpeed = function() {
        var increase = false;
        if (this.animation.fps < 60) {
            increase = true;
        }
        if (increase) {
            if (this.animation.fps >= 10) {
                this.animation.fps += 1;
                this.animation.speedX = this.animation.fps / 10;
            } else {
                this.animation.fps += 1;
                this.animation.speedX = this.animation.fps / 10;
            }
            this.pauseAnimation();
            this.runAnimation();
        }
    }


    /**
     * @name toggleGrid
     * @desc Show and Hide Grid
     */
    public toggleGrid = function () {
        this.instance.toggleGrid();
        this.settings.grid = !this.settings.grid;
    }

    /**
     * @name toggleAxis
     * @desc Show and Hide Axis
     */
    public toggleAxis = function () {
        this.instance.toggleAxis();
        this.settings.axis = !this.settings.axis;
    }

    /**
     * @name toggleTip
     * @desc Show and Hide Tip
     */
    public toggleTip = function () {
        this.instance.toggleTip();
        this.settings.tip = !this.settings.tip;
    }

    /**
     * @name zoomOut
     * @desc Zoom Out Button Control
     */
    public zoomOut = function () {
        this.instance.zoomOut();
    }
    /**
     * @name zoomIn
     * @desc Zoom In Button Control 
     */
    public zoomIn = function () {
        this.instance.zoomIn();
    }
    /**
     * @name recenterPlot
     * @desc center the plot and it returns to the initial state.
     */
    public recenterPlot = function () {
        this.instance.recenter();
    }
    /**
     * @name cleanPlot
     * @desc remove all the graph from the instance.
     */
    public cleanPlot = function () {
        if (this.animation.playing) {
            this.stopAnimation();
        } else {
            this.funciones = [];
            this.conjunto = [];
            this.id = 0;
            this.instance.removeAllGraphs();
        }
    }

    /**
     * @name exportPlot
     * @desc Download Plot as an SVG image.
     */
    //Ver bien
    public exportPlot = function() {
        // Objects
        var svg = document.querySelector(`${this.target} svg`);
        var canvas = document.createElement("canvas");

        // Set dimensions of the image
        var svgSize = svg.getBoundingClientRect();
        canvas.width = svgSize.width;
        canvas.height = svgSize.height;

        // Convert SVG DOM structure to xml
        var ctx = canvas.getContext('2d');
        var data = new XMLSerializer().serializeToString(svg);

        // URL Object used to parse, construct, normalise, and encode URLs.
        var DOMURL = window.URL || (<any>window).webkitURL || window;

        var img = new Image();
        var svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
        var url = DOMURL.createObjectURL(svgBlob);

        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            DOMURL.revokeObjectURL(url);

            var imgURI = canvas
                .toDataURL('image/png')
                .replace('image/png', 'image/octet-stream');

            triggerDownload(imgURI);
        };
        img.src = url;
    }


    /**
     * @name normalizeRectData
     * @desc Normalize Rectangle data for Function Plot Library 
     * @param {Object} rectData Data of Rectangle to be normalized
     * @returns {Object}
     */
    public normalizeRectData = function ($rectData) {
        var $rectNormalized:any = {};
        var $shape:any = {};
        $shape.w = $rectData.w;
        $shape.h = $rectData.h;
        $shape.x = $rectData.x;
        $shape.y = $rectData.y;
        $rectData.color && ($shape.fill = $rectData.color);
        $rectData.rot !== 'undefined' && ($shape.rotation = $rectData.rot);

        $rectNormalized.shape = $shape;
        $rectNormalized.graphType = 'shape';
        $rectNormalized.shapeType = 'rect';
    
        return $rectNormalized;
    }
    /**
     * @name normalizeCircleData
     * @desc Normalize Circle data for Function Plot Library 
     * @param {Object} circleData Data of Circle to be normalized
     * @returns {Object}
     */
    public normalizeCircleData = function ($circleData) {
        var $circleNormalized:any = {};
        var $shape:any = {};
        $shape.r = $circleData.r;
        $shape.x = $circleData.x;
        $shape.y = $circleData.y;
        $circleData.color && ($shape.fill = $circleData.color);
        $circleData.rot !== 'undefined' && ($shape.rotation = $circleData.rot);

        $circleNormalized.shape = $shape;
        $circleNormalized.graphType = 'shape';
        $circleNormalized.shapeType = 'circle';
    
        return $circleNormalized;
    }
    /**
     * @name normalizeTextData
     * @desc Normalize Text data for Function Plot Library 
     * @param {Object} textData Data of Text to be normalized
     * @returns {Object}
     */
    public normalizeTextData = function ($textData) {
        var $textNormalized:any = {};
        var $shape:any = {};
        $shape.text = $textData.text;
        $shape.size = $textData.size;
        $shape.x = $textData.x;
        $shape.y = $textData.y;
        $textData.color && ($shape.fill = $textData.color);
        $textData.rot !== 'undefined' && ($shape.rotation = $textData.rot);

        $textNormalized.shape = $shape;
        $textNormalized.graphType = 'shape';
        $textNormalized.shapeType = 'text';
    
        return $textNormalized;
    }
    /**
     * @name normalizeLineData
     * @desc Normalize Line data for Function Plot Library 
     * @param {Object} lineData Data of Line to be normalized
     * @returns {Object}
     */
    public normalizeLineData = function ($lineData) {
        var $lineNormalized:any = {};
        var $points = []
        for (var p of $lineData.pts) {
            $points.push([p[0],p[1]]);
        }
        $lineNormalized.points = $points;
        $lineNormalized.stroke = $lineData.color;
        $lineNormalized.rotation = $lineData.rot;
        $lineNormalized.fnType = 'points';
        $lineNormalized.polylineType = 'line';
        $lineNormalized.graphType = 'polyline';
    
        return $lineNormalized;
    }
    /**
     * @name normalizePolygonData
     * @desc Normalize Polygon data for Function Plot Library 
     * @param {Object} textData Data of Polygon to be normalized
     * @returns {Object}
     */
    public normalizePolygonData = function ($polygonData) {
        var $polygonNormalized:any = {};
        var $points = []
        for (var p of $polygonData.pts) {
            $points.push([p[0],p[1]]);
        }
        $polygonNormalized.points = $points;
        $polygonNormalized.fill = $polygonData.color;
        $polygonNormalized.rotation = $polygonData.rot;
        $polygonNormalized.fnType = 'points';
        $polygonNormalized.polylineType = 'polygon';
        $polygonNormalized.graphType = 'polyline';
    
        return $polygonNormalized;
    }

    /**
     * @name normalizeShapesData
     * @desc Normalize Shapes data for Function Plot Library 
     * @param {Array} shapesData Data of Shapes to be normalized 
     * @returns {Array}
     */
    public normalizeShapesData = function (shapesData) {
        var normalized:Array<Object> = [];
        for (var shape of shapesData) {
            switch(shape.kind) { 
                case 'rect': { 
                    normalized.push(this.normalizeRectData(shape)); 
                    break; 
                } 
                case 'circle': { 
                    normalized.push(this.normalizeCircleData(shape)); 
                    break; 
                } 
                case 'text': { 
                    normalized.push(this.normalizeTextData(shape)); 
                    break; 
                }
                case 'line': { 
                    normalized.push(this.normalizeLineData(shape)); 
                    break; 
                }
                case 'poly': { 
                    normalized.push(this.normalizePolygonData(shape)); 
                    break; 
                } 
            } 
        }
        return normalized;
    }

    getRandomArbitrary = function (min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    generarFuncion = function (graph) {
        var funcionString = '';
        var grafica;
        for (var fun of graph.funs) {
            funcionString = 'var ' + fun.fun + ' = function(' + fun.args.join() + '){\n return ' + this.generarExpresion(fun.bdy) + '}\n' + funcionString;

            if (fun.fun == graph.graph) {
                funcionString += 'return ' + fun.fun + '(' + fun.args.join() + ');\n'
                grafica = fun;
            }
        }
        funcionString = '(' + grafica.args.join() + ')=>{\n' + funcionString + '}';

        return funcionString;
    }

    generarExpresion = function (exp) {
        var expresion = '';
        if (exp.kind == 'cnd') {
            expresion = ' (' + this.generarExpresion(exp.cond) + '?' + this.generarExpresion(exp.exp1) + ':' + this.generarExpresion(exp.exp2) + ') ';
        } else if (exp.kind == 'bop') {
            if (exp.op == '==') {
                expresion = ' Math.abs((' + this.generarExpresion(exp.exp1) + ') - (' + this.generarExpresion(exp.exp2) + ')) == 0 ';
            } else if (exp.op == '/=') {
                expresion = ' Math.abs((' + this.generarExpresion(exp.exp1) + ') - (' + this.generarExpresion(exp.exp2) + ')) != 0';
            } else if (exp.op == '^') {
                expresion = ' Math.pow(' + this.generarExpresion(exp.exp1) + ',' + this.generarExpresion(exp.exp2) + ') ';
            } else {
                expresion = ' (' + this.generarExpresion(exp.exp1) + ')' + exp.op + '(' + this.generarExpresion(exp.exp2) + ') ';
            }
        } else if (exp.kind == 'uop') {
            expresion = ' ' + exp.op + ' ' + this.generarExpresion(exp.exp) + ' ';
        } else if (exp.kind == 'app') {
			
			if (exp.fun == 'cos') {
				exp.fun = 'Math.cos'
			} else if (exp.fun == 'sin') {
				exp.fun = 'Math.sin'
			} else if (exp.fun == 'round') {
				exp.fun = 'Math.round'
			}else if (exp.fun == 'sqrt'){
                exp.fun = 'Math.sqrt'
            }
			expresion = ' ' + exp.fun + '(' + exp.args.map(e => this.generarExpresion(e)).join() + ') ';
            

        } else if (exp.kind == 'tup') {
            expresion = ' (' + exp.exps.map(e => this.generarExpresion(e)).join() + ') ';
        } else if (exp.kind == 'lit') {
            expresion = ' ' + exp.val + ' ';
        } else if (exp.kind == 'var') {
            expresion = ' ' + exp.var + ' ';
        } else {
            expresion = ' undefined ';
        }

        return expresion;
    }



    // nueva
    createListFunction = function (graph) {
        var funcionString = '';
        var grafica;
        var funciones = [];
        var j = 0;
        while (graph.funs[j].fun != graph.graph) {
            j += 1;
        }

        var fun1 = graph.funs[j];
        var arrayFunction = [];
        var nameFun = [];
        nameFun.push(fun1.fun);
        funciones = this.armarFuncion(fun1.bdy,graph,nameFun);
        for (var funs of funciones){
            for (var fun of graph.funs){
                if (fun.fun != fun1.fun){
                    funcionString = 'var ' + fun.fun + ' = function(' + fun.args.join() + '){\n return ' + this.generarExpresion(fun.bdy) + '}\n' + funcionString;
                }
            }

            funcionString = 'var ' + fun1.fun + ' = function(' + fun1.args.join() + '){\n return ' + funs + '}\n' + funcionString;
            funcionString += ';return ' + fun1.fun + '(' + fun1.args.join() + ');\n'
            grafica = fun1;
            funcionString = '(' + grafica.args.join() + ')=>{\n' + funcionString + '}';
            
            arrayFunction.push(funcionString);   
            var funcionString = '';
        }
        return arrayFunction;
    }

    armarFuncion = function (exp,graph,nameFun){
        var lisArm = this.generateFunctionAndExp(exp,graph,nameFun);
        var lisFun = [];
        for(var lis of lisArm){
            var aux = '';
            if(lis[0] == 'N'){
                aux = lis[1];
            }else{
                aux = '('+lis[0]+' ? '+lis[1]+' : undefined )';
            }
            lisFun.push(aux);
        }
        return lisFun
    }


    generateFunctionAndExp = function (exp,graph,namefun6) {
        var myList = [];
        // devuelvo lista con tupla (cond,funcion)
        if (exp.kind == 'cnd') {
            var lisA = this.generateFunctionAndExp(exp.exp1,graph,namefun6);
            var lisB = this.generateFunctionAndExp(exp.exp2,graph,namefun6);
            var cond = this.createListExp(exp.cond);
            var g = this.createListExp(exp.cond);
            
            var cond2 = g.splice(1);
            var union = g[0]


            for (var a of cond2) {
                union = '('+union+' && '+a+')';
            }
            for (var fun1 of lisA) {
                var aux121 = [];
                if (fun1[0] == 'N') {
                    if (cond.length == 0) {
                        aux121[0]='N';
                    }else{
                        aux121[0]=union;
                    }
                }else{ 
                    aux121[0]= '('+fun1[0]+' && '+union+ ')';
                }
                aux121[1] = fun1[1];
                myList.push(aux121);
            }
            for (var fun2 of lisB) {
                if (cond.length != 0) {
                    for (var condi of cond) {
                        var aux123 = [];
                        aux123[1]=fun2[1];
                        if (fun2[0] == 'N') {
                            aux123[0]='!('+condi+')';
                        } else {
                            aux123[0] = '('+fun2[0]+' && !('+condi+'))';
                        }
                        myList.push(aux123);
                    }
                } else {
                    myList.push(fun2);
                }
            }
        } else if (exp.kind == 'bop') {
            if (exp.op == '^') {
                var lisA1 = this.generateFunctionAndExp(exp.exp1,graph,namefun6);
                var lisB1 = this.generateFunctionAndExp(exp.exp2,graph,namefun6);
                var aux1 = [];
                for (var f1 of lisA1){
                    for (var f2 of lisB1){
                        var aux11 = 'Math.pow('+f1[1]+' , '+f2[1]+')';
                        var aux21;
                        if ((f2[0] == 'N') && (f1[0] == 'N')){
                            aux21 = 'N'
                        }else if(f2[0] == 'N'){
                            aux21=f1[0]
                        }else if(f1[0] == 'N'){
                            aux21=f2[0]
                        }else{
                            aux21= '('+f1[0]+' && '+f2[0]+')';
                        }
                        aux1[0]= aux21;
                        aux1[1] = aux11;
                        myList.push(aux1);
                    }
                }
            } else {
                var lisA2 = this.generateFunctionAndExp(exp.exp1,graph,namefun6);
                var lisB2 = this.generateFunctionAndExp(exp.exp2,graph,namefun6);
                var aux2 = [];
                for (var f1 of lisA2){
                    for (var f2 of lisB2){
                        var aux12 = '(('+f1[1]+')'+exp.op+'('+f2[1]+'))';
                        var aux22
                        if ((f2[0] == 'N') && (f1[0] == 'N')) {
                            aux22 = 'N'
                        } else if (f2[0] == 'N') {
                            aux22 =f1[0]
                        } else if (f1[0] == 'N') {
                            aux22 =f2[0]
                        } else { 
                            aux22= '('+f1[0]+' && '+f2[0]+')';
                        }
                        aux2[0]= aux22;
                        aux2[1] = aux12;
                        myList.push(aux2);
                    }
                }
            }
        } else if (exp.kind == 'uop') {
            var lisA3 = this.generateFunctionAndExp(exp.exp,graph,namefun6);
            var aux3 = [];
            for (var f1 of lisA3) {
                var aux13 = ' '+exp.op+' '+f1[1]+' ';               
                aux3[0]= f1[0];
                aux3[1] = aux13;
                myList.push(aux3);
            }
        } else if (exp.kind == 'app') {       
            if ((exp.fun == 'Math.cos') || (exp.fun == 'cos')) {
                var aux4 = [];
                var aux14 = 'Math.cos('+ exp.args.map(e => this.generarExpresion(e)).join() +')';
                var aux24 = 'N'
                aux4[0]= aux24;
                aux4[1] = aux14;
                myList.push(aux4);           
            } else if ((exp.fun == 'Math.sin') || (exp.fun == 'sin')) {
                var aux5 = [];
                var aux15 = 'Math.sin('+ exp.args.map(e => this.generarExpresion(e)).join() +')';
                var aux25 = 'N'
                aux5[0]= aux25;
                aux5[1] = aux15;
                myList.push(aux5);
            } else if ((exp.fun == 'Math.round') || (exp.fun == 'round')) {
                var aux6 = [];
                var aux16 = 'Math.round('+ exp.args.map(e => this.generarExpresion(e)).join() +')';
                var aux26 = 'N'
                aux6[0]= aux26;
                aux6[1] = aux16;
                myList.push(aux6);
            } else if ((exp.fun == 'Math.sqrt') || (exp.fun == 'sqrt')) {
                var aux7 = [];
                var aux17 = 'Math.sqrt('+ exp.args.map(e => this.generarExpresion(e)).join() +')';
                var aux27 = 'N'
                aux7[0]= aux27;
                aux7[1] = aux17;
                myList.push(aux7);
            /*
            } else if (exp.args[0].kind == 'app') {
                var aux101 = [];
                var aux1101 = exp.fun+'('+ exp.args.map(e => this.generarExpresion(e)).join() +')';
                var aux2101 = 'N'
                aux101[0]= aux2101;
                aux101[1] = aux1101;
                myList.push(aux101);
            } else if(((exp.args[0].kind == 'cnd' || exp.args[0].kind == 'bop') && (exp.args[0].exp1.kind == 'app' || exp.args[0].exp2.kind == 'app' )) || (exp.args[0].kind == 'uop' && exp.args[0].exp.kind == 'app') ){
                var aux102 = [];
                var aux1102 = exp.fun+'('+ exp.args.map(e => this.generarExpresion(e)).join() +')';
                var aux2102 = 'N'
                aux102[0]= aux2102;
                aux102[1] = aux1102;
                myList.push(aux102);
            */
            } else if(JSON.stringify(exp.args[0]).indexOf("app") != -1) { 
                console.log("Entro");
                exp.args[0] = this.recorrerArgumentos(exp.args[0]);
                var aux102 = [];
                var aux1102 = exp.fun+'('+ exp.args.map(e => this.generarExpresion(e)).join() +')';
                var aux2102 = 'N'
                aux102[0]= aux2102;
                aux102[1] = aux1102;
                myList.push(aux102);        
            } else { 
                var nomFun = exp.fun+exp.args.map(e => this.generarExpresion(e)).join()
                if (!namefun6.includes(nomFun)) {
                    var ListnameFNew = namefun6;
                    ListnameFNew.push(nomFun);

                    for (var fun5 of graph.funs) {
                        if (fun5.fun == exp.fun) {
                            myList = this.generateFunctionAndExp(fun5.bdy,graph,ListnameFNew);
                            for(var iter of myList){
                                iter[1] = iter[1].replace(/x/g,exp.args.map(e => this.generarExpresion(e)).join())
                            }
                        }
                    }
                } else {
                    var aux76 = [];
                    aux76[0] = 'N';
                    aux76[1] = exp.fun + '(' + exp.args.map(e => this.generarExpresion(e)).join() + ')';
                    myList.push(aux76);
                }
            }
            
        } else if (exp.kind == 'tup') {
            var lisA7 = this.generateFunctionAndExp(exp.exps,graph,namefun6);
            for (var f of lisA7){
                var aux65 = [];
                aux65[1] = '('+f[1]+')';
                aux65[0] = f[0];
                myList.push(aux65);
            }
        //Es esto o las combinaciones
        // expresion = ' (' + exp.exps.map(e => this.generarExpresion(e)).join() + ') ';
        } else if (exp.kind == 'lit') {
            var aux8 = [];
            aux8[0] = 'N';
            aux8[1] = ' ' + exp.val + ' ';
            myList.push(aux8);
        } else if (exp.kind == 'var') {

            var aux9 = [];
            aux9[0] = 'N';
            aux9[1] = ' ' + exp.var + ' ';
            myList.push(aux9);
        } else {
            var aux54 = [];
            aux54[0]= 'N';
            aux54[1]='undefined';
            myList.push(aux54);
        }

        return myList;
    }

    recorrerArgumentos = function(argumento) {
        if (argumento.kind == 'app') {
            if ((argumento.fun == 'Math.cos') || (argumento.fun == 'cos')) {
                argumento.fun = 'Math.cos';
            } else if((argumento.fun == 'Math.sin') || (argumento.fun == 'sin')) {
                argumento.fun = 'Math.sin';
            } else if((argumento.fun == 'Math.round') || (argumento.fun == 'round')) {
                argumento.fun = 'Math.round';
            } else if((argumento.fun == 'Math.sqrt') || (argumento.fun == 'sqrt')) {
                argumento.fun = 'Math.sqrt';
            }
        } else if(argumento.kind == 'cnd') {
            this.recorrerArgumentos(argumento.exp1)
            this.recorrerArgumentos(argumento.exp2)
        } else if(argumento.kind == 'bop') {
            this.recorrerArgumentos(argumento.exp1)
            this.recorrerArgumentos(argumento.exp2)
        } else if(argumento.kind == 'uop') {
            this.recorrerArgumentos(argumento.exp1)
        }
        return argumento;
    }

    createListExp = function (exp) {
        var expresion = '';
        var funcione = [];
        if (exp.kind == 'cnd') {
                funcione = this.createListExp(exp.cond);
        } else if (exp.kind == 'bop') {
            if (exp.op == '==') {
                expresion = ' Math.abs((' + this.createListExp(exp.exp1)[0] + ') - (' + this.createListExp(exp.exp2)[0] + ')) == 0 ';
                if (exp.exp1.kind == 'lit') {
                    this.valores.push(exp.exp1.val)
                }
                if (exp.exp2.kind == 'lit') {
                    this.valores.push(exp.exp2.val)
                }
                funcione.push(expresion)

            } else if (exp.op == '/=') {
                expresion = ' Math.abs((' + this.createListExp(exp.exp1) + ') - (' + this.createListExp(exp.exp2) + ')) != 0';
                funcione.push(expresion)

            } else if (exp.op == '^') {
                expresion = ' Math.pow(' + this.createListExp(exp.exp1) + ',' + this.createListExp(exp.exp2) + ') ';
                funcione.push(expresion)

            } else if (exp.op == '&&') {
                for (var atr of this.createListExp(exp.exp1)){
                    funcione.push(atr)
                }
                for (var atr2 of this.createListExp(exp.exp2)){
                    funcione.push(atr2)
                }
            }else if (exp.op == 'or'){
                funcione.push('!'+this.createListExp(exp.exp1))
                funcione.push('!'+this.createListExp(exp.exp2))
            }else{
                var lis1 = this.createListExp(exp.exp1)
                var lis2 = this.createListExp(exp.exp2)
                for(var expes1 of lis1){
                    for (var expes2 of lis2){
                        expresion = ' ((' + expes1 + ')' + exp.op + '(' + expes2 + ') )';
                        funcione.push(expresion)
                    }
                }
            }
        } else if (exp.kind == 'uop') {
            expresion = ' ' + exp.op + ' ' + this.createListExp(exp.exp) + ' ';
            funcione.push(expresion)

        } else if (exp.kind == 'app') {

            if (exp.fun == 'Math.cos') {
                exp.fun = 'Math.cos'
                expresion = ' ' + exp.fun + '(' + exp.args.map(e => this.generarExpresion(e)).join() + ') ';
                funcione.push(expresion)

            } else if (exp.fun == 'Math.sin') {
                exp.fun = 'Math.sin'
                expresion = ' ' + exp.fun + '(' + exp.args.map(e => this.generarExpresion(e)).join() + ') ';
                funcione.push(expresion)

            } else if (exp.fun == 'Math.round') {
                exp.fun = 'Math.round'
                expresion = ' ' + exp.fun + '(' + exp.args.map(e => this.generarExpresion(e)).join() + ') ';
                funcione.push(expresion)

            } else if (exp.fun == 'Math.sqrt') {
                exp.fun = 'Math.sqrt'
                expresion = ' ' + exp.fun + '(' + exp.args.map(e => this.generarExpresion(e)).join() + ') ';
                funcione.push(expresion)

            }else{
                expresion = ' ' + exp.fun + '(' + exp.args.map(e => this.generarExpresion(e)).join() + ') ';
                funcione.push(expresion)
            }

        } else if (exp.kind == 'tup') {
            expresion = ' (' + exp.exps.map(e => this.generarExpresion(e)).join() + ') ';
            funcione.push(expresion)

        } else if (exp.kind == 'lit') {
            expresion = ' ' + exp.val + ' ';
            this.valores.push(exp.val)
            funcione.push(expresion)

        } else if (exp.kind == 'var') {

            expresion = ' ' + exp.var + ' ';
            funcione.push(expresion)

        } else {
            expresion = 'undefined ';
            funcione.push(expresion)

        }
        return funcione;
    }
    ///////////////////// fin de nuevo

     // Prueba 2019
     generarFuncionDisc = function (graph) {
        var funcionString = '';
        var grafica;
        var arrayFunction = [];
        var fun = graph.funs[0];
        var ListnameF = [];
        ListnameF.push(fun.fun);
        var funciones = this.generarExpresionDisc(fun.bdy,graph,ListnameF)
        for (var funs of funciones){
            funcionString = 'var ' + fun.fun + ' = function(' + fun.args.join() + '){\n return ' + funs + '}\n' + funcionString;

            if (fun.fun == graph.graph) {
                funcionString += ';return ' + fun.fun + '(' + fun.args.join() + ');\n'
                grafica = fun;
            }
            funcionString = '(' + grafica.args.join() + ')=>{\n' + funcionString + '}';
            arrayFunction.push(funcionString);
            var funcionString = '';
        }


        var arrayFunction1 = [arrayFunction[0]]
        return arrayFunction;
    }

    generarExpresionDisc = function (exp,grap,ListnameF) {
        var expresion = '';
        var funcione = [];
        if (exp.kind == 'cnd') {
            var con1 = this.generarExpresionDisc(exp.cond,grap,ListnameF);
            var con11 = '';
            
            for (var condi of con1){
                if (con11 == ''){
                    con11 = condi;
                }else{
                    con11 = '('+con11 +' && '+ condi +')';
                }
                
            }
            for (var funs of this.generarExpresionDisc(exp.exp1,grap,ListnameF)){ 
                funcione.push('('+con11+' ? '+ funs +' : undefined)');      
            }
            for (var funs2 of this.generarExpresionDisc(exp.exp2,grap,ListnameF)){ 
                for (var condi2 of con1){
                    funcione.push('(!('+condi2+') ? '+ funs2 +' : undefined)');

                }   
            }
        } else if (exp.kind == 'bop') {
            if (exp.op == '==') {
                expresion = ' Math.abs((' + this.generarExpresionDisc(exp.exp1,grap,ListnameF) + ') - (' + this.generarExpresionDisc(exp.exp2,grap,ListnameF) + ')) == 0 ';
                if (exp.exp1.kind == 'lit') {
                    this.valores.push(exp.exp1.val)
                }
                if (exp.exp2.kind == 'lit') {
                    this.valores.push(exp.exp2.val)
                }
                funcione.push(expresion)

            } else if (exp.op == '/=') {
                expresion = ' Math.abs((' + this.generarExpresionDisc(exp.exp1,grap,ListnameF) + ') - (' + this.generarExpresionDisc(exp.exp2,grap,ListnameF) + ')) != 0';
                funcione.push(expresion)

            } else if (exp.op == '^') {
                expresion = ' Math.pow(' + this.generarExpresionDisc(exp.exp1,grap,ListnameF) + ',' + this.generarExpresionDisc(exp.exp2,grap,ListnameF) + ') ';
                funcione.push(expresion)

            } else if (exp.op == '&&') {
                for (var atr of this.generarExpresionDisc(exp.exp1,grap,ListnameF)){
                    funcione.push(atr)
                }
                for (var atr2 of this.generarExpresionDisc(exp.exp2,grap,ListnameF)){
                    funcione.push(atr2)
                }
            } else if (exp.op == 'or') {
                funcione.push('!'+this.generarExpresionDisc(exp.exp1,grap,ListnameF))
                funcione.push('!'+this.generarExpresionDisc(exp.exp2,grap,ListnameF))
            } else {
                var lis1 = this.generarExpresionDisc(exp.exp1,grap,ListnameF)
                var lis2 = this.generarExpresionDisc(exp.exp2,grap,ListnameF)
                for(var expes1 of lis1){
                    for (var expes2 of lis2){
                        expresion = ' ((' + expes1 + ')' + exp.op + '(' + expes2 + ') )';
                        funcione.push(expresion)
                    }
                }
            }
        } else if (exp.kind == 'uop') {
            expresion = ' ' + exp.op + ' ' + this.generarExpresionDisc(exp.exp,grap,ListnameF) + ' ';
            funcione.push(expresion)

        } else if (exp.kind == 'app') {

			if (exp.fun == 'Math.cos') {
                exp.fun = 'Math.cos'
                expresion = ' ' + exp.fun + '(' + exp.args.map(e => this.generarExpresionDisc(e,grap,ListnameF)).join() + ') ';
                funcione.push(expresion)

			} else if (exp.fun == 'Math.sin') {
                exp.fun = 'Math.sin'
                expresion = ' ' + exp.fun + '(' + exp.args.map(e => this.generarExpresionDisc(e,grap,ListnameF)).join() + ') ';
                funcione.push(expresion)

			} else if (exp.fun == 'Math.round') {
                exp.fun = 'Math.round'
                expresion = ' ' + exp.fun + '(' + exp.args.map(e => this.generarExpresionDisc(e,grap,ListnameF)).join() + ') ';
                funcione.push(expresion)

            } else if (exp.fun == 'Math.sqrt') {
                exp.fun = 'Math.sqrt'
                expresion = ' ' + exp.fun + '(' + exp.args.map(e => this.generarExpresionDisc(e,grap,ListnameF)).join() + ') ';
                funcione.push(expresion)
    
            } else {

                if (!ListnameF.includes(exp.fun)) {
                    var ListnameFNew = ListnameF;
                    ListnameFNew.push(exp.fun);
                    for (var fun5 of grap.funs){
                        if(fun5.fun == exp.fun){
                            var funresul = this.generarExpresionDisc(fun5.bdy,grap,ListnameFNew);
                            for (var subfunciones of funresul){
                                funcione.push(subfunciones);
                            }
                        }
                    }
                } else {
                    funcione.push(exp.fun);
                }
                
            }

        } else if (exp.kind == 'tup') {
            expresion = ' (' + exp.exps.map(e => this.generarExpresionDisc(e,grap,ListnameF)).join() + ') ';
            funcione.push(expresion)

        } else if (exp.kind == 'lit') {
            expresion = ' ' + exp.val + ' ';
            this.valores.push(exp.val)
            funcione.push(expresion)

        } else if (exp.kind == 'var') {

            expresion = ' ' + exp.var + ' ';
            funcione.push(expresion)

        } else {
            expresion = ' undefined ';
            funcione.push(expresion)

        }
        return funcione;
    }

    obtenerConjunto = function (grf) {

        var setf = '\"sets\": {';
        var dominio = '{\"conj\": {';
        if (grf.dom == 'R') {
            dominio += "\"radio\": 0.3, \"baseDom\": \"R\", \"dom\": \"R\"";
            setf += "\"fdom\": \"R\",";
        } else if (grf.dom == 'Z') {
            dominio += "\"radio\": 2, \"baseDom\": \"Z\", \"dom\": \"Z\"";
            setf += "\"fdom\": \"Z\",";
        /* } else if (grf.dom == 'N') {
            dominio += "\"radio\":2, \"baseDom\": \"N\", \"dom\": \"N\"";
            setf += "\"fdom\": \"N\",";
        */
        } else {
            var nom = grf.dom;
            if (Array.isArray(grf.sets[0][nom])) {
                var arreglo = grf.sets[0][nom];
                var arreglo2 = [];
                for (var item of arreglo) {
                    arreglo2.push("\"" + item + "\"");
                }
                dominio += "\"radio\":2, \"baseDom\": \"N\", \"dom\": \"Numer\"";
                setf += "\"fdom\": [" + arreglo2 + "], ";
            } else {

                dominio += this.recursivoDom(grf.sets, nom);
                setf += "\"fdom\":\"function(x)\",";
            }
        }
        dominio += ", ";
        if (grf.cod == 'R') {
            dominio += "\"baseCod\": \"R\", \"cod\": \"R\" ,";
            setf += "\"fcod\": \"R\"";
        } else if (grf.cod == 'Z') {
            dominio += "\"baseCod\": \"Z\", \"cod\": \"Z\" ,";
            setf += "\"fcod\": \"Z\"";
        /* } else if (grf.cod == 'N') {
            dominio += "\"baseCod\": \"N\", \"cod\": \"N\" ,";
            setf += "\"fcod\": \"N\"";
        */
        } else {
            var nom1 = grf.cod;

            if (Array.isArray(grf.sets[0][nom1])) {
                var arreglo3 = grf.sets[0][nom1];
                var arreglo4 = [];
                for (var item of arreglo3) {
                    arreglo4.push("\"" + item + "\"");
                }
                dominio += "\"baseCod\": \"N\", \"cod\": \"Numer\" ,";
                setf += '\"fcod\":[' + arreglo4 + ']';
            } else {
                dominio += this.recursivoCod(grf.sets, nom1);
                setf += "\"fcod\": \"function(x)\"";
            }

        }
        return dominio + setf + "}}";
    }





    recursionfuncion = function (func, nombre) {
        var fun = func[0][nombre].set;
        var resul = "";
        if (fun == 'R' || fun == 'Z' || fun == 'N') {
            resul += this.generarF(func[0][nombre].cond);
        } else {
            resul += this.generarF(func[0][nombre].cond) + " && " + this.recursionfuncion(func, fun);
        }
        return resul;
    }


    recursionfuncionCod = function (func, nombre) {
        //ACA CAMBIE
        var fun = func[0][nombre].set;
        var resul = "";
        if (fun == 'R' || fun == 'Z' || fun == 'N') {
            //ACA TAMBIEN
            resul += this.generarF(func[0][nombre].cond);
        } else {
            //ACA TAMBIEN
            resul += this.generarF(func[0][nombre].cond) + " && " + this.recursionfuncionCod(func, fun);
        }
        return resul;
    }

    recursivoDom = function (sets, nom) {
        var domin = "";
        if (sets[0][nom].set == 'R') {
            domin += "\"radio\": 0.3, \"baseDom\": \"R\", \"dom\": \"Func\"";
        } else if (sets[0][nom].set == 'Z') {
            domin += "\"radio\": 2, \"baseDom\": \"Z\", \"dom\": \"Func\"";
        } else if (sets[0][nom].set == 'N') {
            domin += "\"radio\": 2, \"baseDom\": \"N\", \"dom\": \"Func\"";
        } else {
            var nombre = sets[0][nom].set;
            domin = this.recursivoDom(sets, nombre);
        }
        return domin;
    }

    recursivoCod = function (sets, nom) {
        var coodo = "";
        if (sets[0][nom].set == 'R') {
            coodo += "\"baseCod\": \"R\", \"cod\": \"Func\",";
        } else if (sets[0][nom].set == 'Z') {
            coodo += "\"baseCod\": \"Z\", \"cod\": \"Func\",";
        } else if (sets[0][nom].set == 'N') {
            coodo += "\"baseCod\": \"N\", \"cod\": \"Func\",";
        } else {
            var nombre = sets[0][nom].set;
            coodo += this.recursivoDom(sets, nombre);
        }
        return coodo;
    }

    generarF = function (exp) {
        var expresion = '';
        if (exp.kind == 'cond') {
            expresion = ' (' + this.generarF(exp.cond) + '?' + this.generarF(exp.exp1) + ':' + this.generarF(exp.exp2) + ') ';
        } else if (exp.kind == 'bop') {
            if (exp.op == '==') {
                expresion = ' Math.abs((' + this.generarF(exp.exp1) + ') - (' + this.generarF(exp.exp2) + ')) == 0 ';
            } else if (exp.op == '/=') {
                expresion = ' Math.abs((' + this.generarF(exp.exp1) + ') - (' + this.generarF(exp.exp2) + ')) != 0 ';
            } else if (exp.op == '^') {
                expresion = ' Math.pow(' + this.generarF(exp.exp1) + ',' + this.generarF(exp.exp2) + ') ';
            } else {
                expresion = ' (' + this.generarF(exp.exp1) + ')' + exp.op + '(' + this.generarF(exp.exp2) + ') ';
            }
        } else if (exp.kind == 'uop') {
            expresion = ' ' + exp.op + ' ' + this.generarF(exp.exp) + ' ';
        } else if (exp.kind == 'app') {
            if (exp.fun == 'cos') {
                exp.fun = 'Math.cos'
            } else if (exp.fun == 'sin') {
                exp.fun = 'Math.sin'
            } else if (exp.fun == 'round') {
                exp.fun = 'Math.round'
            }else if (exp.fun == 'sqrt'){
                exp.fun = 'Math.sqrt'
            }
            expresion = ' ' + exp.fun + '(' + exp.args.map(e => this.generarF(e)).join() + ') ';
        } else if (exp.kind == 'tup') {
            expresion = ' (' + exp.exps.map(e => this.generarF(e)).join() + ') ';
        } else if (exp.kind == 'lit') {
            expresion = ' ' + exp.val + ' ';
        } else if (exp.kind == 'var') {
            expresion = ' ' + exp.var + ' ';
        } else {
            expresion = ' undefined ';
        }
        return expresion;
    }

    generarFun = function (graph) {
        var funcionString = '';
        var grafica;
        for (var fun of graph.funs) {
            funcionString = 'var ' + fun.fun + ' = function(' + fun.args.join() + '){\n return ' + this.generarF(fun.bdy) + '}\n' + funcionString;

            if (fun.fun == graph.graph) {
                funcionString += 'return ' + fun.fun + '(' + fun.args.join() + ');\n'
                grafica = fun;
            }
        }
        funcionString = '(' + grafica.args.join() + ')=>{\n' + funcionString + '}';
        return funcionString;
    }
}

