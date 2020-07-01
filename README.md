# Matefun Infantil

### Heramientas
  * [JavaScript](https://www.javascript.com/): Lenguaje que utilizan la mayoría de los navegadores.
  * [Node.js](https://nodejs.org/): Usado para utilizar javascript del lado del servidor.
  * [NPM](https://www.npmjs.com/): Para manejar los paquetes que utiliza Node.js para sus procesos.
  * [Webpack](https://webpack.js.org/): Para levantar el servidor de desarrollo y crear el `war`.
  * [React.js](https://es.reactjs.org/): Usado para implementar la UI de la aplicación.
  * [Font Awesome](https://fontawesome.com/): Para utilizar sus Iconos en la aplicación.
  * [Babel.js](https://babeljs.io/): Para interpretar las distintas versiones y formas de Javascript.
  
#### Como instalar [Node.js](https://nodejs.org/es/download/) y NPM
  * [Ubuntu](https://nodejs.org/es/download/package-manager/#debian-and-ubuntu-based-linux-distributions-enterprise-linux-fedora-and-snap-packages): sudo apt install nodejs
  * [NVM](https://nodejs.org/es/download/package-manager/#nvm): nvm use 8

Las demás herramientas se encarga de instalar sus paquetes NPM

### Comandos
* `npm install`: Para instalar todas las dependencias.
* `npm start`: Para levantar el servidor de desarrollo en el puerto 8081 y consumiendo los servicios en el puerto 8080.
* `npm run stage`: Para levantar el servidor de desarrollo en el puerto 8081 y consumir los servicos en https://matefun.math.psico.edu.uy/.
* `npm run build`: Para generar el `war` en la carpeta `dist/`y este consume los servicios en el mismo servidor en el que fue levantado, además de correr sobre la sub dirección `/matefun-infantil/`.
