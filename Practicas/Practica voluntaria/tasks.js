'use strict'

let listaTareas = [{
        text: "Preparar práctica AW",
        tags: ["AW", "practica"]
    },
    {
        text: "Mirar fechas congreso",
        done: true,
        tags: []
    },
    {
        text: "Ir al supermercado",
        tags: ["personal"]
    },
    {
        text: "Mudanza",
        done: false,
        tags: ["personal"]
    }
];

function getToDoTasks(tasks) {
    return tasks.filter(k => !k.done).map(n => n.text);
}

//console.log(getToDoTasks(listaTareas));

function findByTag(tasks, tag) {
    return tasks.filter(n => n.tags.some(k => k == tag));
}

//console.log(findByTag(listaTareas,"personal"));

function findByTags(tasks, tags) {
    return tasks.reduce((ac,n)=>{
        if(tags.some(k=> n.tags.filter(j=> j==k).length >0))
            ac.push(n);
        return ac;
    },[]);
}

//console.log(findByTags(listaTareas,["personal", "practica"]));

function countDone(tasks){
    return tasks.filter(k => k.done).length;
}

//console.log(countDone(listaTareas));

function createTask(texto){
    var tags=texto.match(/@\w*/g).map(n=>n.replace(/@/, ""));
    var text= texto.replace(/@\w*/g, "").trim().replace("  "," ");



    return {"text":text, "tags":tags};
}

console.log(createTask("Ir al medico @personal @salud"));
console.log(createTask("@AW     @practica Preparar practica AW"));
console.log(createTask("Ir a @deporte entrenar"));