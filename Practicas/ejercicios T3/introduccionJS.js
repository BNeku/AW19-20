'use strict';
//ejercicio 1
console.log("Hola mundo");

//ejercicio 2
var alumno = {
    nombre: "Juan",
    apellidos: "González",
    notas: [8, 8, 2, 4],
    dni: "4098976",
    edad: '18'
};

console.log(alumno);
/*
no lleva :, sino un =
cada campo se separa con , no con ;
el ultimo campo no lleva ,
cada campo va seguido por : no por =
*/

//ejercicio 3
function mayor(x, y, z) {
    var big;

    if (x >= y && x >= z) {
        big = x;
    } else if (y >= x && y >= x) {
        big = y;
    } else {
        big = z;
    }
    return `El numero mas grande de ${x},${y},${z} es ${big}`;
}

//ejercicio 4
function par(x) {
    var divisor = 2;
    if (x % 2 == 0) {
        return `Si es divisible entre ${divisor}`;
    } else {
        return `No es divisible entre ${divisor}`;
    }
}

//ejercicio 5
function contarA(x) {
    var y = 0;

    for (let i = 0; i < x.length; i++) {
        if (x[i] == 'a' || x[i] == 'A') {
            y++;
        }
    }

    return `Hay ${y} a's`
}

//ejercicio 6
function numPalabras(y) {
    var palabras = y.split(" ");
    var suma = 0;

    if (palabras.length == 1 && palabras[0] == "") {
        return "La frase está vacía";
    } else {
        for (let x of palabras) {
            suma++;
        }
        return `En la frase ${y} hay ${suma} palabra/s`;
    }
}

//ejercicio 7

function division(x, y) {
    try {
        var rdo = x / y;
        if (y == 0) {
            throw new Error("Intento de division por cero");
        }
    } catch (e) {
        console.log(e.message);
    }

    return rdo;
}

//ejercicio 8
function unde(x) {
    var undef;

    if (typeof (x) == "undefined") {
        undef = true;
    } else {
        undef = false;
    }

    return undef;
}

//ejercicio 9
function tipo(x) {
    return typeof (x);
}

//ejercicio 10
function isArray(x) {
    if (x instanceof Array) {
        return true;
    } else {
        return false;
    }
}

//ejercicio 11
function primitiveOrObject(x){

    if( x instanceof Object){
        return "Object";
    }else{
        return `Primitive - ${typeof(x)}`
    }
}

//ejercicio 12
function propi(x){
    var num=Object.keys(x);
    console.log(`Numero de propiedades ${num.length}`);
    
    for(let i=0; i<num.length;i++){
        console.log(`${num[i]}: ${x[num[i]]}`);
    }
}

//ejercicio 13
function createObject(prop){
    let x={};

    for(let i=0; i<prop.length;i++){
        x[prop[i]]=" ";
    }

    return x;
}

//ejercicio 14
function createObjectWithValues(prop, values){
    let x={};

    for(let i=0; i<prop.length;i++){
        x[prop[i]]=values[i];
    }

    return x;
}