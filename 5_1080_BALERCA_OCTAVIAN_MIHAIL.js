var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.font = "30px Arial";
context.fillStyle = "yellow";
context.textAlign = "center";
context.fillText("Sageti, z, c - controale nava", canvas.width / 2, canvas.height / 2.2);
context.fillText("x - tragere", canvas.width / 2, canvas.height / 1.8);
context.fillText("P - pauza", canvas.width / 2, canvas.height / 1.5);
context.fillText("Scor: ", 55, 30);
context.fillText("0", 130, 30);
context.fillText("Vieti: 3", 55, 60);
var pause = true;

var player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: 15,
    a: 90 / 180 * Math.PI, // unghi 90 grade ca player-ul sa fie plasat in sus, + conversie in radians
    rotatie: 0,
    zburatsus: false,
    zburatjos: false,
    zburatstanga: false,
    zburatdreapta: false,
    zbor: {
        x: 0,
        y: 0
    },
    poateTrage: true,
    gloante: [],
    scor: 0,
    vieti: 3,
    regen: 0
}

//meteoriti
var meteoriti = [];
creareMeteoriti();

document.addEventListener("keydown", (e) => {
    e = e || window.event;
    switch (e.keyCode) {
        case 90: // z
            player.rotatie = 1080 / 180 * Math.PI / 144;
            break;
        case 37: //sageata stanga
            player.zburatstanga = true;
            break;
        case 38: // sageata sus
            player.zburatsus = true;
            break;
        case 39: // sageata dreapta
            player.zburatdreapta = true;
            break;
        case 40: // sageata jos
            player.zburatjos = true;
            break;
        case 67: // c
            player.rotatie = -1080 / 180 * Math.PI / 144;
            break;
        case 88: // x
            tragere();
            break;
    }
});

document.addEventListener("keyup", (e) => {
    e = e || window.event;
    switch (e.keyCode) {
        case 90: // z
            player.rotatie = 0;
            break;
        case 37: //sageata stanga
            player.zburatstanga = false;
            break;
        case 38: // sageata sus
            player.zburatsus = false;
            break;
        case 39: // sageata dreapta
            player.zburatdreapta = false;
            break;
        case 40: // sageata jos
            player.zburatjos = false;
            break;
        case 67: // c
            player.rotatie = 0;
            break;
        case 88: // x
            player.poateTrage = true;
            break;
    }
});

document.addEventListener("keydown", (e) => {
    e = e || window.event;
    if (e.keyCode === 80 && pause === false) {
        pause = true;
    }
    else
        pause = false;
});

setInterval(update, 50);

function tragere() {

    if (player.poateTrage && player.gloante.length < 3) {
        player.gloante.push({
            x: player.x + 4 / 3 * player.r * Math.cos(player.a),
            y: player.y - 4 / 3 * player.r * Math.sin(player.a),
            xv: 500 * Math.cos(player.a) / 30,
            yv: -500 * Math.sin(player.a) / 30,
        })
    }
    player.poateTrage = false;
}

function creareMeteoriti() {
    meteoriti = [];
    var x, y;
    for (var i = 0; i < 15; i++) {
        do {
            x = Math.floor(Math.random() * canvas.width);
            y = Math.floor(Math.random() * canvas.height);
        } while (distantaPlayerMeteorit(player.x, player.y, x, y) < 100 * 2 + player.r);
        meteoriti.push(meteorit(Math.floor(Math.random() * 4 + 1), x, y));
    }
}

function meteorit(hp, x, y) {
    var meteorit = {
        hp: hp,
        x: x,
        y: y,
        xv: Math.random() * 50 / 30 * (Math.random() < 0.5 ? 1 : -1),
        yv: Math.random() * 50 / 30 * (Math.random() < 0.5 ? 1 : -1),
        r: hp * 15,
    };
    return meteorit;
}

function distantaPlayerMeteorit(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function update() {
    if (pause === false) {
        //background
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = "30px Arial";
        context.fillStyle = "yellow";
        context.textAlign = "center";
        context.fillText("Scor: ", 55, 30);
        context.fillText(player.scor, 130, 30);
        context.fillText("Vieti: " + player.vieti, 55, 60);
        //navigat
        if (player.zburatsus) {
            player.zbor.x = player.zbor.x + 5 * Math.cos(player.a) / 30;
            player.zbor.y = player.zbor.y - 5 * Math.sin(player.a) / 30;
        } else if (player.zburatjos) {
            player.zbor.x = player.zbor.x - 5 * Math.cos(player.a) / 30;
            player.zbor.y = player.zbor.y + 5 * Math.sin(player.a) / 30;
        } else if (player.zburatstanga) {
            player.zbor.x = player.zbor.x - 5 * Math.sin(player.a) / 30;
            player.zbor.y = player.zbor.y - 5 * Math.cos(player.a) / 30;
        } else if (player.zburatdreapta) {
            player.zbor.x = player.zbor.x + 5 * Math.sin(player.a) / 30;
            player.zbor.y = player.zbor.y + 5 * Math.cos(player.a) / 30;
        }
        else {
            player.zbor.x = player.zbor.x - player.zbor.x / 30;
            player.zbor.y = player.zbor.y - player.zbor.y / 30;
        }

        //player
        context.strokeStyle = "white";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(
            player.x + 4 / 3 * player.r * Math.cos(player.a),
            player.y - 4 / 3 * player.r * Math.sin(player.a)
        ); //varful
        context.lineTo(
            player.x - player.r * (2 / 3 * Math.cos(player.a) + Math.sin(player.a)),
            player.y + player.r * (2 / 3 * Math.sin(player.a) - Math.cos(player.a))
        ); //stanga jos
        context.lineTo(
            player.x - player.r * (2 / 3 * Math.cos(player.a) - Math.sin(player.a)),
            player.y + player.r * (2 / 3 * Math.sin(player.a) + Math.cos(player.a))
        ); //dreapta jos
        context.closePath();
        context.stroke();

        //gloante
        for (var i = 0; i < player.gloante.length; i++) {
            context.fillStyle = "white";
            context.beginPath();
            context.arc(player.gloante[i].x, player.gloante[i].y, 2, 0, Math.PI * 2, false);
            context.fill();
        }

        //coliziune glont meteorit
        var ax, ay, ar, lx, ly;
        for (var i = meteoriti.length - 1; i >= 0; i--) {
            ax = meteoriti[i].x;
            ay = meteoriti[i].y;
            ar = meteoriti[i].r;

            for (var j = player.gloante.length - 1; j >= 0; j--) {
                lx = player.gloante[j].x;
                ly = player.gloante[j].y;
                if (distantaPlayerMeteorit(ax, ay, lx, ly) < ar) {
                    player.gloante.splice(j, 1);
                    player.scor = player.scor + 100;
                    if (player.vieti < 3)
                        player.regen++;
                    if (player.regen === 5) {
                        if (player.vieti < 3)
                            player.vieti++;
                        player.regen = 0;
                    }
                    if (meteoriti[i].hp === 4) {
                        meteoriti.push(meteorit(3, meteoriti[i].x, meteoriti[i].y));
                    }
                    else if (meteoriti[i].hp === 3) {
                        meteoriti.push(meteorit(2, meteoriti[i].x, meteoriti[i].y));
                    }
                    else if (meteoriti[i].hp === 2) {
                        meteoriti.push(meteorit(1, meteoriti[i].x, meteoriti[i].y));
                    }
                    meteoriti.splice(i, 1);

                    if (meteoriti.length < 15) {
                        do {
                            x = Math.floor(Math.random() * canvas.width);
                            y = Math.floor(Math.random() * canvas.height);
                        } while (distantaPlayerMeteorit(player.x, player.y, x, y) < 100 * 2 + player.r);
                        meteoriti.push(meteorit(Math.floor(Math.random() * 4 + 1), x, y));
                    }
                    break;
                }
            }
        }

        //meteoriti
        context.strokeStyle = "white";
        context.lineWidth = 2;
        var hp, x, y, r;
        for (var i = 0; i < meteoriti.length; i++) {
            hp = meteoriti[i].hp;
            x = meteoriti[i].x;
            y = meteoriti[i].y;
            r = meteoriti[i].r;

            context.beginPath();
            context.arc(x, y, r, 0, 2 * Math.PI, false);
            context.lineWidth = 2;
            switch (meteoriti[i].hp) {
                case 4:
                    context.strokeStyle = 'green';
                    break;
                case 3:
                    context.strokeStyle = 'yellow';
                    break;
                case 2:
                    context.strokeStyle = 'orange';
                    break;
                case 1:
                    context.strokeStyle = 'red';
                    break;
            }
            context.stroke();
            context.font = r + 'px Arial';
            context.fillStyle = 'white';
            context.fillText(hp, x, y);
        }

        //verificare atingere
        for (var i = 0; i < meteoriti.length; i++) {
            if (distantaPlayerMeteorit(player.x, player.y, meteoriti[i].x, meteoriti[i].y) < player.r + meteoriti[i].r) {
                player.x = (canvas.width) / 2;
                player.y = (canvas.height) / 2;
                player.zbor.x = 0;
                player.zbor.y = 0;
                creareMeteoriti();
                player.vieti--;
                if (player.vieti === 0) {
                    context.font = "30px Arial";
                    context.fillStyle = "yellow";
                    context.textAlign = "center";
                    context.fillText("Game Over", canvas.width / 2, canvas.height / 1.8);
                    context.fillText("Scor:" + player.scor, canvas.width / 2, canvas.height / 2.2);
                    player.scor = 0;
                    player.vieti = 3;
                    player.regen = 0;
                    pause = true;
                }
            }
        }

        //rotire player
        player.a = player.a + player.rotatie;

        //miscare player
        player.x = player.x + player.zbor.x;
        player.y = player.y + player.zbor.y;

        //margine ecran
        if (player.x < 0 - player.r)
            player.x = canvas.width + player.r;
        else
            if (player.x > canvas.width + player.r)
                player.x = 0 - player.r;

        if (player.y < 0 - player.r)
            player.y = canvas.height + player.r;
        else
            if (player.y > canvas.height + player.r)
                player.y = 0 - player.r;


        //deplasare gloante
        for (var i = 0; i < player.gloante.length; i++) {
            player.gloante[i].x = player.gloante[i].x + player.gloante[i].xv;
            player.gloante[i].y = player.gloante[i].y + player.gloante[i].yv;

            if (player.gloante[i].x < 0 || player.gloante[i].x > canvas.width || player.gloante[i].y < 0 || player.gloante[i].y > canvas.height)
                player.gloante.splice(i, 1);
        }


        //miscare meteoriti
        for (var i = 0; i < meteoriti.length; i++) {
            meteoriti[i].x = meteoriti[i].x + meteoriti[i].xv;
            meteoriti[i].y = meteoriti[i].y + meteoriti[i].yv;

            if (meteoriti[i].x < 0 - meteoriti[i].r) {
                meteoriti[i].x = canvas.width + meteoriti[i].r;
            }

            if (meteoriti[i].x > canvas.width + meteoriti[i].r) {
                meteoriti[i].x = 0 - meteoriti[i].r;
            }

            if (meteoriti[i].y < 0 - meteoriti[i].r) {
                meteoriti[i].y = canvas.height + meteoriti[i].r;
            }

            if (meteoriti[i].y > canvas.height + meteoriti[i].r) {
                meteoriti[i].y = 0 - meteoriti[i].r;
            }
        }
    }
}