'use strict';

/*Escribir una función sequence que reciba un array de funciones [f_1, ..., f_n] y 
un elemento inicial x. La función debe aplicar f_1 a x, y pasar el resultado a f_2 que 
a su vez le pasará el resultado a f_3 y así sucesivamente. Se piden tres versiones diferentes de la función sequence:
Implementar la función sequence1 suponiendo que ninguna de las funciones del array recibido devuelve el valor undefined.
Implementar la función sequence2 para que, en el caso en que una función del array devolviera el valor undefined,
 la función sequence2 devuelva directamente undefined sin seguir ejecutando las funciones restantes.
Implementar la función sequence3 para que reciba un tercer parámetro opcional (right), cuyo valor por defecto será false.
 Si el parámetro right tiene el valor true, el recorrido del elemento por las funciones será en orden inverso: desde la 
 última función del array hasta la primera. Independientemente del recorrido, la función sequence3 se comportará como la función sequence2.
(NOTA: dentro de una función se puede comprobar que el último parámetro no está presente comparándolo con undefined). */

//version 1
function sequence1(funciones, x) {
    var rdo;
    if (funciones instanceof Array && funciones.length > 0) {
        for (let i = 0; i < funciones.length; i++) {
            rdo = funciones[i](x);
            x = rdo;
        }
    }

    return rdo;
}
var prob;
var fun = [dividir, multplicar];

function multplicar(x) {
    return x * x;
}

function dividir(x) {
    return x / 1;
}
let y = 2;
//console.log(sequence3(fun, y));

//version 2
function sequence2(funciones, x) {
    var rdo;
    if (funciones instanceof Array && funciones.length > 0) {
        for (let i = 0; i < funciones.length; i++) {
            if (typeof (funciones[i]) != "undefined" && typeof (funcion[i] == "function")) {
                rdo = funciones[i](x);
                x = rdo;
            } else {
                throw Error("undefined");
            }
        }
    }

    return rdo;
}

//version 3
function sequence3(funciones, x, right=true) {
    var rdo;

    if (funciones instanceof Array && funciones.length > 0) {
        if (right) {
            for (let i = 0; i < funciones.length; i++) {
                if (typeof (funciones[i]) != "undefined" && typeof (funciones[i]) == "function") {
                    rdo = funciones[i](x);
                    x = rdo;
                } else {
                    throw Error("undefined");
                }
            }
        } else {
            for (let i = funciones.length-1; i >=0 ; i--) {
                if (typeof (funciones[i]) != "undefined" && typeof (funciones[i]) == "function") {
                    rdo = funciones[i](x);
                    x = rdo;
                } else {
                    throw Error("undefined");
                }
            }
        }
    }
    

    return rdo;
}

console.log(sequence3(
    [x => x - 3,
        x => x*2,
        x => x+1
    ], 2, false));
 