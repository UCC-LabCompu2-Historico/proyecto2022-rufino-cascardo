function initCanvas() {
    /**
     * Se usa para poner imagenes
     * @param   backgroundImage imagen de fondo
     * @param   naveImage   imagen de la nave
     * @param   enemiespic1 foto del enemigo 1
     * @param   enemiespic2 foto del enemigo 2
     */
    var ctx = document.getElementById('my_canvas').getContext('2d');
    var backgroundImage = new Image();
    var naveImage = new Image();
    var enemiespic1 = new Image();
    var enemiespic2 = new Image();

    backgroundImage.src = "images/background-pic.jpg";
    naveImage.src = "images/spaceship-pic.png";

    enemiespic1.src = "images/enemigo1.png";
    enemiespic2.src = "images/enemigo2.png";

    /**
     * @param   cW  indica el ancho del canvas
     * @param   cH  indica el alto del canvas
     */
    var cW = ctx.canvas.width;
    var cH = ctx.canvas.height;

    /**
     * Se usa para poner a los enemigos en una posición determinada a la hora de iniciar el juego
     * @param options   es para cambiar la posición de los enemigos
     * @returns {{image: (*|HTMLImageElement), w: string, x: string, h: string, y: string, id: string}}
     */
    var enemyTemplate = function (options) {
        return {
            id: options.id || '',
            x: options.x || '',
            y: options.y || '',
            w: options.w || '',
            h: options.h || '',
            image: options.image || enemiespic1
        }
    }

    /**
     * Posición de los enemigos al empezar el juego
     * @type {{image: (*|HTMLImageElement), w: string, x: string, h: string, y: string, id: string}[]}
     */
    var enemies = [
        new enemyTemplate({id: "enemigo 1", x: 100, y: -20, w: 50, h: 30}),
        new enemyTemplate({id: "enemigo 2", x: 225, y: -20, w: 50, h: 30}),
        new enemyTemplate({id: "enemigo 3", x: 350, y: -20, w: 80, h: 30}),
        new enemyTemplate({id: "enemigo 4", x: 100, y: -70, w: 80, h: 30}),
        new enemyTemplate({id: "enemigo 5", x: 225, y: -70, w: 50, h: 30}),
        new enemyTemplate({id: "enemigo 6", x: 350, y: -70, w: 50, h: 30}),
        new enemyTemplate({id: "enemigo 7", x: 475, y: -70, w: 50, h: 30}),
        new enemyTemplate({id: "enemigo 8", x: 600, y: -70, w: 80, h: 30}),
        new enemyTemplate({id: "enemigo 9", x: 475, y: -20, w: 50, h: 30}),
        new enemyTemplate({id: "enemigo 10", x: 600, y: -20, w: 50, h: 30}),


        new enemyTemplate({id: "enemigo 11", x: 100, y: -220, w: 50, h: 30, image: enemiespic2}),
        new enemyTemplate({id: "enemigo 12", x: 225, y: -220, w: 50, h: 30, image: enemiespic2}),
        new enemyTemplate({id: "enemigo 13", x: 350, y: -220, w: 80, h: 50, image: enemiespic2}),
        new enemyTemplate({id: "enemigo 14", x: 100, y: -270, w: 80, h: 50, image: enemiespic2}),
        new enemyTemplate({id: "enemigo 15", x: 225, y: -270, w: 50, h: 30, image: enemiespic2}),
        new enemyTemplate({id: "enemigo 16", x: 350, y: -270, w: 50, h: 30, image: enemiespic2}),
        new enemyTemplate({id: "enemigo 17", x: 475, y: -270, w: 50, h: 30, image: enemiespic2}),
        new enemyTemplate({id: "enemigo 18", x: 600, y: -270, w: 80, h: 50, image: enemiespic2}),
        new enemyTemplate({id: "enemigo 19", x: 475, y: -200, w: 50, h: 30, image: enemiespic2}),
        new enemyTemplate({id: "enemigo 20", x: 600, y: -200, w: 50, h: 30, image: enemiespic2}),
    ];

    /**
     * Se usa para mostrar a los enemigos
     * @param enemyList es una variable para mostrar a los enemigos
     */
    var renderEnemies = function (enemyList) {

        for (var i = 0; i < enemyList.length; i++) {
            var enemy = enemyList[i];
            ctx.drawImage(enemy.image, enemy.x, enemy.y += .5, enemy.w, enemy.h);
            launcher.hitDetectLowerLevel(enemy);
        }
    }

    /**
     * Es para localizar la nave
     * @constructor se usa para crear las funcionalidades de la nave
     */
    function Launcher() {
        this.y = 500,
            this.x = cW * .5 - 25,
            this.w = 100,
            this.h = 100,
            this.direccion,
            this.bg = "white",
            this.misiles = [];

        /**
         * Es para mostrar un mensaje cuando se pierde el juego y que fuente y tamaño tiene la letra
         * @type {{over: boolean, fillStyle: string, message: string, font: string}}    muestra un mensaje cuando perdes
         */
        this.gameStatus = {
            over: false,
            message: "",
            fillStyle: 'red',
            font: 'italic bold 36px Arial, sans-serif',
        }

        /**
         * Sirve para determinar cuanto se mueve la nave
         * @direccion   muestra cuantos pixeles se mueve la nave
         * @misiles     para modificar el comportamiento de los misiles
         */
        this.render = function () {
            if (this.direccion === 'left') {
                this.x -= 5;
            } else if (this.direccion === 'right') {
                this.x += 5;
            } else if (this.direccion === 'downArrow') {
                this.y += 5;
            } else if (this.direccion === 'upArrow') {
                this.y -= 5;
            }
            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 10, 10);
            ctx.drawImage(naveImage, this.x, this.y, 100, 90);

            for (var i = 0; i < this.misiles.length; i++) {
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y -= 5, m.w, m.h);
                this.hitDetect(m, i);
                if (m.y <= 0) {
                    this.misiles.splice(i, 1);
                }
            }

            /**
             * Muestra un texto cuando se gana el juego
             */
            if (enemies.length === 0) {
                clearInterval(animateInterval);
                ctx.fillStyle = 'yellow';
                ctx.font = this.gameStatus.font;
                ctx.fillText('GANASTE!', cW * .5 - 80, 50);
            }
        }

        /**
         * Detecta cuando un proyectil choca con un enemigo y muestra un mensaje diciendo el numero del enemigo que fue destruido
         * @param m misil
         * @param mi parametro
         */
        this.hitDetect = function (m, mi) {
            for (var i = 0; i < enemies.length; i++) {
                var e = enemies[i];

                if (m.x <= e.x + e.w && m.x + m.w >= e.x &&
                    m.y >= e.y && m.y <= e.y + e.h) {
                    enemies.splice(i, 1);
                    document.querySelector('.barra').innerHTML = "Destruiste al " + e.id;
                }
            }
        }

        /**
         * Detecta cuando los enemigos llegan abajo y muestra un mensaje cuando esto pasa
         * @param enemy enemigo
         */
        this.hitDetectLowerLevel = function (enemy) {
            if (enemy.y > 550) {
                this.gameStatus.over = true;
                this.gameStatus.message = 'Los enemigos pasaron';
            }

            /**
             * Detecta cuando la nave choca contra un enemigo y muestra un mensaje
             */
            if ((enemy.y < this.y + 25 && enemy.y > this.y - 25) &&
                (enemy.x < this.x + 45 && enemy.x > this.x - 45)) {
                this.gameStatus.over = true;
                this.gameStatus.message = 'Perdiste';
            }
            if (this.gameStatus.over === true) {
                clearInterval(animateInterval);
                ctx.fillStyle = this.gameStatus.fillStyle;
                ctx.font = this.gameStatus.font;

                ctx.fillText(this.gameStatus.message, cW * .5 - 80, 50);
            }
        }
    }


    /**
     * Es para mostrar la imagen de la nave y el fondo del canvas
     * @type {Launcher} lanza las imagenes
     */
    var launcher = new Launcher();

    function animate() {
        ctx.clearRect(0, 0, cW, cH);
        launcher.render();
        renderEnemies(enemies);
    }

    /**
     * Es para enlazar las teclas de las flechas
     */
    var animateInterval = setInterval(animate, 6);

    var left_btn = document.getElementById('left_btn');
    var right_btn = document.getElementById('right_btn');
    var fire_btn = document.getElementById('fire_btn');

    /**
     * Detecta cuando determinada tecla es presionada y soltada para asi ejecutar y dejar de ejecutar una accion,
     en este caso, para mover la nave
     */
    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 37) {
            launcher.direccion = 'left';
            if (launcher.x > cW * 2 - 130) {
                launcher.x += 0;
                launcher.direccion = '';
            }
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.keyCode === 37) {
            launcher.x += 0;
            launcher.direccion = '';
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 39) {
            launcher.direccion = 'right';
            if (launcher.x > cW - 110) {
                launcher.x -= 0;
                launcher.direccion = '';
            }
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.keyCode === 39) {
            launcher.x -= 0;
            launcher.direccion = '';
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 38) {
            launcher.direccion = 'upArrow';
            if (launcher.y < cH * .2 - 80) {
                launcher.y += 0;
                launcher.direccion = '';
            }
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.keyCode === 38) {
            launcher.y -= 0;
            launcher.direccion = '';
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 40) {
            launcher.direccion = 'downArrow';
            if (launcher.y > cH - 110) {
                launcher.y -= 0;
                launcher.direccion = '';
            }
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.keyCode === 40) {
            launcher.y += 0;
            launcher.direccion = '';
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 80) {
            location.reload();
        }
    });

    left_btn.addEventListener('mousedown', function (event) {
        launcher.direccion = 'left';
    });

    left_btn.addEventListener('mouseup', function (event) {
        launcher.direccion = '';
    });

    right_btn.addEventListener('mousedown', function (event) {
        launcher.direccion = 'right';
    });

    right_btn.addEventListener('mouseup', function (event) {
        launcher.direccion = '';
    });

    /**
     * Es lo mismo que lo anterior, solo que para disparar
     */
    fire_btn.addEventListener('mousedown', function (event) {
        launcher.misiles.push({
            x: launcher.x + launcher.w * .5,
            y: launcher.y,
            w: 3,
            h: 10,
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 32) {
            launcher.misiles.push({
                x: launcher.x + launcher.w * .5,
                y: launcher.y,
                w: 3,
                h: 10,
            });
        }
    });
}

window.addEventListener('load', function (event) {
    initCanvas();
});

/**
 * Es para los sonidos de disparos
 */
function cargar() {
    const sonidos = document.getElementById('sonidos');
    document.addEventListener('keydown', function (evento) {
        if (evento.keyCode == 32) {
            sonidos.innerHTML = '<audio src="audio/laser.mp3" autoplay></audio>';
        }
    })
}
