'use strict'

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
    var tags=texto.match(/@\w*/g); 

    if(tags != null){
        tags = tags.map(n=>n.replace(/@/, ""));
    }
    var text= texto.replace(/@\w*/g, "").trim().replace("  "," ");

    return {"text":text, "tags":tags, "done":0};
}

module.exports ={
    getToDoTasks,
    findByTag,
    findByTags,
    countDone,
    createTask
}