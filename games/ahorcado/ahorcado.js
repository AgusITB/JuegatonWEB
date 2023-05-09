

//string base con la palabra
//array de chars con la palabra dividida para hacer el display
//array de bools con la misma longitud
//al recibir la letra hace for para revisar si está
//si la encuentra pone el bool de la posicion a true para que se vea
//hace print del array de chars, con espacios vacios en las que no tienen el bool a true
//si el jugador pone una letra que ya tiene el bool en true, le avisa (no cuenta como fallo)





//get word from database
/*
SELECT *
FROM Ahorcado
ORDER BY random()
LIMIT 1;*/

var palabraCorrecta = "t";//obtenemos palabra aleatoria
var dividida = palabraCorrecta.split('');
var temp = "____________________________"
var len = 5;
fetch(`https://apipost.azurewebsites.net/ahorcado`)
    .then((response) => response.json())
    .then((json) => {
        (palabraCorrecta = json[0].palabra, dividida = palabraCorrecta.split(''), len = palabraCorrecta.length), console.log(palabraCorrecta);//de momento usamos solo una
        //(palabraCorrecta = json[Math.floor(Math.random() * 100)].palabra, dividida = palabraCorrecta.split(''), len = palabraCorrecta.length), console.log(palabraCorrecta);

    },)
    .catch((error) => console.log("fallo de conexion."));


//set in-game variables
var score = 0;
var intentos = 7;

var letrasUsadas = "";
var setImg = document.getElementById("imagenSop");
var img = document.createElement("img");
img.setAttribute("id", "horca");
img.style.height = '450px';
img.style.width = '450px';
//img.style.objectPosition = '15% 15%';
//img.style.objectPosition = '15% 15%';

//preparamos el escenario con la imagen y los mensajes base
img.src = "./../../ahorcado img/ahorcado1.jpg";
setImg.appendChild(img);
var setMes = document.getElementById("messageSop");
var setWor = document.getElementById("wordSop");

//preparamos la palabra vacía
var wor = document.createElement("p");
wor.setAttribute("id", "palabra");
wor.setAttribute("class", "ans")
for (let i = 0; i < 2; i++)
    wor.innerHTML += "|";
for (let i = 0; i < len; i++)
    wor.innerHTML += temp[i];
for (let i = 0; i < 2; i++)
    wor.innerHTML += "|";
setWor.appendChild(wor);

//preparamos el mensaje de bienvenida
var mes = document.createElement("p");
mes.setAttribute("id", "message")
mes.setAttribute("class", "messoge")
mes.innerHTML = "Bienvenido al ahorcado. Tienes 7 intentos";
setMes.appendChild(mes);

//en este boton hacemos que el jugador introduzca una letra
var letraBoton = document.getElementById("answerLetra");
letraBoton.addEventListener("click", function () {

    if (intentos > 0) {
        var temp = document.getElementById("letter").value;
        var letter = temp[0];//aquí nos aseguramos que solo entra un char

        //detecta si ya se ha introducido la letra
        for (let i = 0; i < letrasUsadas.length; i++) {
            if (letrasUsadas[i] == letter) {
                document.getElementById("message").innerHTML = "ya has usado esta letra, te quedan " + intentos + " intentos";
                return;
            }
        }
        //en caso contrario la añade a la lista de usadas
        letrasUsadas += letter;
        let flag = false;
        for (let i = 0; i < dividida.length; i++) {
            //mira si la letra está en la palabra y da puntación si la encuentra
            if (letter == dividida[i]) {
                document.getElementById("message").innerHTML = "has acertado, esta letra está en la palabra, te quedan " + intentos + " intentos";
                flag = true;
                score++;
            }
        }
        //si no encuentra la letra avisa y quita una vida
        if (!flag) {

            intentos--;
            let res = 8 - intentos;
            document.getElementById("horca").src = "./../../ahorcado img/ahorcado" + res + ".jpg";
            document.getElementById("message").innerHTML = "has fallado, esta letra no está en la palabra, te quedan " + intentos + " intentos";
        }
        let display = "";
        let flags = true;


        for (let i = 0; i < 2; i++)
            display += "|";
        for (let i = 0; i < dividida.length; i++) {
            //este for revisa si la letra ha sido descubierta y la imprime
            //si no está descubierta escribe un "_" en su lugar
            let flagm = false;
            for (let j = 0; j < letrasUsadas.length; j++) {
                if (letrasUsadas[j] == dividida[i]) {
                    flagm = true;
                }
            }
            if (flagm) {
                display += dividida[i];
            }
            else { display += "_"; flags = false }//además, si hay alguna letra no descubierta, bloquea el bool que termina la partida
        }
        for (let i = 0; i < 2; i++)
            display += "|";

        document.getElementById("palabra").innerHTML = display;

        //si no quedan letras por descubrir termina la partida
        if (flags) {
            document.getElementById("message").innerHTML = "has acertado, has completado la palabra";
            score += intentos;
            intentos = 0;
            //you won send data
            console.log(score);
        }
        //si no quedan intentos también termina la partida
        else if (intentos == 0) {
            document.getElementById("message").innerHTML = "has fallado, te has quedado sin intentos";
            intentos = 0;
            document.getElementById("palabra").innerHTML = "||" + palabraCorrecta + "||";
            //you lost send data
            console.log(score);
        }
    }
});


//este botón permite al jugador escribir toda la palabra
var palabraBoton = document.getElementById("answerPalabra");
palabraBoton.addEventListener("click", function () {
    if (intentos > 0) {
        var word = document.getElementById("word").value;

        //si el jugador acierta automaticamente gana y recibe puntos de bonus por cada letra sin descubrir
        if (word == palabraCorrecta) {
            document.getElementById("palabra").innerHTML = "||" + palabraCorrecta + "||";
            document.getElementById("message").innerHTML = "has acertado, la palabra es correcta";
            for (let i = 0; i < dividida.length; i++) {
                let flagm = false;
                for (let j = 0; j < letrasUsadas.length; j++) {
                    if (letrasUsadas[j] == dividida[i]) {
                        flagm = true;
                    }
                }
                if (!flagm) {
                    score += 5;
                }
                score += intentos;
                intentos = 0;
                //you won send data
            }
        }
        //si falla pierde la partida
        else {
            document.getElementById("palabra").innerHTML = "||" + palabraCorrecta + "||";
            document.getElementById("message").innerHTML = "has fallado, la palabra es incorrecta";
            document.getElementById("horca").src = "./../../ahorcado img/ahorcado8.jpg";
            intentos = 0;
            //you lost send data
        }
        score *= 10;
        //inflamos la score para que sea mas parecida a la del Wordle, maximo 420
        console.log(score);
    }
});
//Los dos botones dejan de funcionar cuando no quedan intentos
         