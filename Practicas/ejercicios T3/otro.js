'use strict'

/*recibe un array de string y devuelve un array con las longitudes de cada string */
function maplengths(array) {
    var rdo = [];

    if (array instanceof Array) {
        for (let i of array) {
            if (typeof (i) == "string") {
                rdo.push(i.length);
            }
        }
    }

    return rdo;
}

function maplengths2(array) {
    var rdo = [];

    // array.forEach(i => rdo.push(i.length));
    rdo = array.map(i => i.length);

    return rdo;
}

/*otras soluciones
array.map(function(v){return v.length;})
array.map(function(v,i,a){return v.length;}) */



/*console.log(maplengths2([])); //[]
console.log(maplengths2(["a", "la","sol"])); //[1,2,3]*/

/*recibe un array y devuelve un array con la mitad inferior del array original*/
function filterInf(array) {
    var rdo = [];

    if (array instanceof Array) {
        rdo = array.slice(0, (array.length / 2));
    }

    return rdo;
}

function filterInf2(array) {
    return array.filter((v, i, a) => {
        return i < (array.length / 2);
    });
}
/*
console.log(filterInf2([])); //[]
console.log(filterInf2([1, 2, 3, 4])); //[1,2]*/

/*recibe un array y devuelve true si todos sus elementos son funciones */
function everyFunction(array) {
    var rdo = true;

    if (array instanceof Array) {
        for (let i of array) {
            if (typeof (i) != "function") {
                rdo = false;
            }
        }
    }

    return rdo;
}

function everyFunction2(array){
   // return array.every(n => typeof(n)=="function");

    //return array.every((v,i,a)=> typeof(v)=="function");
}
/*
var a="a";
console.log(everyFunction2([maplengths,filterInf,a])); //false
console.log(everyFunction2([maplengths,filterInf])); //true*/

/*recibe un array y devuelve true si algun elemento en undefined*/
function someUndefined(array) {
    var rdo = false;

    if (array instanceof Array) {
        for (let i of array) {
            if (typeof (i) == "undefined") {
                rdo = true;
            }
        }
    }

    return rdo;
}

function someUndefined2(array){
    return array.some(n=> typeof(n)=="undefined");
}
/*
var a;
var b=2;
console.log(someUndefined2([b]));//false
console.log(someUndefined2([a,b]));//true*/

/*devuelve la suma de los cuadrados*/
function reduceSquare(array) {
    var rdo = 0;

    if (array instanceof Array) {
        for (let i of array) {
            if (typeof (i) == "number") {
                //rdo += i*i;
                rdo += Math.pow(i, 2);
            }
        }
    }

    return rdo;
}

function reduceSquare2(array){
    //si no pones valor inicial, entonces el primer elemento se usa de acumulador para el siguiente elemento, y este no se procesa
    return array.reduce((ac,n)=>ac+Math.pow(n,2),0);
}

/*
console.log(reduceSquare2([2,3]));//13
console.log(reduceSquare2([]));//0*/