'use strict'

let personas = [{
        nombre: "Ricardo",
        edad: 45
    },
    {
        nombre: "Julia",
        edad: 24
    },
    {
        nombre: "Ashley",
        edad: 28
    }
];
/*
personas.forEach(p => {
    console.log("Hola, me llamo " + p.nombre +
        " y tengo " + p.edad + " años");
});*/
/*
personas.forEach((v, i, a) => {
    console.log("Hola,me llamo " + v.nombre +
        " y tengo " + v.edad + " años" +
        " y soy el " + i + " de un array de " +
        a.length + " elementos");
});*/
var a = [1, 3, 5, 2, 4];
let dobles = a.map(n => n * 2);
console.log(dobles); // → [2, 6, 10, 4, 8]