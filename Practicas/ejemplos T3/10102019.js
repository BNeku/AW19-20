'use strict'

function factorial(n) {
    if (n <= 0) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

function aplicar_funciones(funs, z) {
    for (let i = 0; i < funs.length; i++) {
        console.log(
            `Aplicar función ${i} pasando ${z}: ${funs[i](z)}`
        );
    }
}

aplicar_funciones(
    [x => x - 3,
        x => Math.sqrt(x),
        factorial,
        x => Math.log(x)
    ], 2);
/*
function imprimirArgumentos(a1, a2, a3) {
    console.log(`a1: ${a1}`);
    console.log(`a2: ${a2}`);
    console.log(`a3: ${a3}`);
}
imprimirArgumentos("uno","foo");

function multiplicar(a, b = 1) {
    return a * b;
}
console.log(multiplicar(5)); // 5
console.log(multiplicar(5, undefined)); // 5

function imprimeArgumentos(a, b, c) {
    for (let i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
    }
}
imprimeArgumentos(1, 2, 3); // Imprime 1 2 3

//
// Función que busca el mínimo de un conjunto de valores
//
function minimo() {
    let min = arguments[0];
    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] < min) {
            min = arguments[i];
        }
    }
    return min;
}
console.log(minimo()); // undefined
console.log(minimo(1)); // 1
console.log(minimo(3, 4, 5)); // 3
console.log(minimo(9, 8, 7, 6, 5, 4, 3, 2, 1, 0)); // 0
*/
//IMPORTANTE
/*let x=[100,200,300]
x.prop=24;
for(let i IN x){
    console.log(i); // 0,1,2,prop
} 

for(let i OF x){
    console.log(i);//100,200,300
}*/