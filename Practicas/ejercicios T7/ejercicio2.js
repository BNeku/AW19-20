let miFormulario = [{
        label: "Nombre",
        name: "nombre"
    },
    {
        label: "Apellidos",
        name: "apellidos"
    },
    {
        label: "Edad",
        name: "edad"
    }
];


function embedForm(selector, formulario) {
    var nuevo = "<form method=”POST” action=”procesarForm”>";

    for(i=0; i<formulario.length;i++){
        nuevo+= '<label for="#input0">'
        nuevo+=formulario[i].label;
        nuevo+='</label> <input type="text" name="'
        nuevo+=formulario[i].name;
        nuevo+='" id="#input0">';
    }

    nuevo+="<input type='submit' value=”Enviar”>"

    $(selector).append(nuevo);
}

$(function(){
    embedForm("body", miFormulario);
});