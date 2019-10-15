function incrementar(x) {
    return x + 1;
}

function duplicar(x) {
    return 2 * x;
}

function cuadrado(y) {
    return y * y;
}

function factorial(n) {
    if (n <= 0) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

let i = incrementar; //NO PONER PARENTESIS DE LLAMADA
//console.log(i(5));

function aplicar_funciones(funs, z) {
    for (let i = 0; i < funs.length; i++) {
        console.log(
            `Aplicar función ${i} pasando ${z}: ${funs[i](z)}`
        );
    }
}

console.log(aplicar_funciones([incrementar,duplicar,cuadrado,factorial], 5));