'use strict';

/*Escribir una función producto que reciba dos parámetros (llamados x e y) y devuelva su producto, teniendo en cuenta que tanto la x como la y pueden ser números o vectores (representados como arrays). La función se comportará del siguiente modo:
Si x e y son números, se calculará su producto.
Si x es un número e y es un vector (o viceversa), se calculará el vector que resulta de multiplicar todas los componentes de y por x.
Si x e y son vectores de la misma longitud, se calculará el producto escalar de ambos.
En cualquier otro caso, se lanzará una excepción
 */

function producto(x, y) {

    if (typeof (x) == "number" && typeof (y) == "number") {
        return x * y;
    }
    if (typeof (x) == "number" && y instanceof Array) {
        var suma = 0;
        for (let i = 0; i < y.length; i++) {
            suma += y[i];
        }
        return suma * x;
    }
    if (typeof (y) == "number" && x instanceof Array) {
        var suma = 0;
        for (let i = 0; i < x.length; i++) {
            suma += x[i];
        }
        return suma * y;
    }
    if (x instanceof Array && y instanceof Array) {
        var sumay = 0,
            sumax = 0;
        for (let i = 0; i < x.length; i++) {
            sumay += y[i];
            sumax += x[i];
        }
        return sumay * sumax;
    }

    throw Error();
}

let x = 3;
let y = 4;
let z = [1, 2];

console.log(producto(z, z));