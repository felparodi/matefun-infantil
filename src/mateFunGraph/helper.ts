export interface Animation {
	data?: any,
	init: boolean,
	currentFrame: number,
	fps: number,
	playing: boolean,
	timeout?: any,
	animationFrame?: any,
	speedX: number,
	boton: boolean,
	zoo: number,
}

export interface Setting {
	axis: boolean,
	grid: boolean,
	tip: boolean
}

export function toJSON(data: string) : string {
	console.log('data',data);
	const regexPts = /(?:\"pts\"\:\[(?:\((x),(y)\))+,?\])/g;
	var dataJSON = data.replace(regexPts, (match, x, y) => {
		return `"points": [[${x},${y}]]`
	})
	console.log('dataJSON', dataJSON);
	return dataJSON;
}

export function triggerDownload(imgURI: string) {
	var evt = new MouseEvent('click', {
		view: window,
		bubbles: false,
		cancelable: true
	});

	var a = document.createElement('a');
	a.setAttribute('download', 'Matefun_2D_plot.png');
	a.setAttribute('href', imgURI);
	a.setAttribute('target', '_blank');

	a.dispatchEvent(evt);
}