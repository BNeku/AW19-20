/*a) Escribir una función pluck(objects, fieldName) que devuelva la propiedad de nombre fieldName de cada
 uno de los objetos contenidos en el array objects de entrada. Se devolverá un array con los valores correspondientes 
 en el mismo orden de aparición que en el array de entrada. Se deberá contemplar el caso en el que alguno de los objetos 
 no contenga el atributo atributo dado.Si ninguno de los objetos contienen la propiedad dada, la función devolverá un array vacío. */

function pluck(objects, fieldName) {
    var rdo = [];

    if (objects instanceof Array) {
        for (let i = 0; i < objects.length; i++) {
            if (typeof (objects[i][fieldName]) != "undefined") {
                rdo.push(objects[i][fieldName]);
            }
        }
    } else {
        throw Error();
    }

    return rdo;
}
let personas = [{
        nombre: "Ricardo",
        edad: 63
    },
    {
        nombre: "Paco",
        edad: 55
    },
    {
        nombre: "Enrique",
        edad: 32
    },
    {
        nombre: "Adrián",
        edad: 34
    },
    {
        apellidos: "García",
        edad: 28
    },
];
/*
console.log(pluck(personas, "nombre"));
console.log(pluck(personas, "edad"));
console.log(pluck(personas, "email"));*/

/*Implementar una función partition(array, p) que devuelva un array con dos arrays. El primero 
contendrá los elementos x de array tales que p(x) devuelve true. Los restantes elementos se añadirán al segundo array.  */
function partition(array, p) {
    var rdo1 = [],
        rdo2 = [];
    var rdo = [];

    if (array instanceof Array && typeof (p) == "function") {
        for (let i = 0; i < array.length; i++) {
            if (p(array[i])) {
                rdo1.push(array[i]);
            } else {
                rdo2.push(array[i]);
            }
        }
        rdo.push(rdo1);
        rdo.push(rdo2);
    } else {
        throw Error();
    }

    return rdo;
}

//console.log(partition(personas, pers => pers.edad >= 60));

/*c)Implementar una función groupBy(array, f) que reciba un array, una función clasificadora f, y
reparta los elementos del array de entrada en distintos arrays, de modo que dos elementos pertenecerán al 
mismo array si la función clasificadora devuelve el mismo valor para ellos. Al final se obtendrá un objeto cuyas 
propiedades son los distintos valores que ha devuelto la función clasificadora, cada uno de ellos asociado a su array correspondiente. */

function groupBy(array, f) {
    var aux = {}

    if (array instanceof Array && typeof (f) == "function") {

        for (let i = 0; i < array.length; i++) {
            var j = f(array[i]);
            if (aux[j] == undefined) {
                aux[j] = new Array();
            }
            aux[j].push(array[i]);
        }
    } else {
        throw Error("No an array or function");
    }
    return aux;
}

var a = ["Mario", "Elvira", "María", "Estela", "Fernando"];

//console.log(groupBy(a,x => x[0]));

/*d) Escribir una función where(array, modelo) que reciba un array de objetos y un objeto modelo. 
La función ha de devolver aquellos objetos del array que contengan todas las propiedades contenidas 
en modelo con los mismos valores. */

function where(array, modelo) {
    var aux = [];

    if (array instanceof Array) {
        for (let i of array) {
            var result = true;
            for (var k in modelo) {
                if (modelo[k] != i[k]) {
                    result = false;
                }
            }
            if (result) {
                aux.push(i);
            }
        }
    }

    return aux;
}

console.log(where(personas, {edad: 55}));
console.log(where(personas, { nombre: "Adrián" }));
console.log(where(personas, { nombre: "Adrián", edad: 21 }));