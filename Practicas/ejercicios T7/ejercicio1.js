let m = [
    ["Esto", "es", "una fila"],
    ["aquí", "va", "otra fila"],
    ["y", "aquí", "otra más"]
];

function insertmatrix(selector, matriz) {
    var nuevo="<table>";
    for (i = 0; i < matriz.length; i++) {
        nuevo += "<tr>";
        for (j = 0; j < matriz[i].length; j++) {
            nuevo += "<td>";
            nuevo += matriz[i][j];
            nuevo += "</td>";
        }
        nuevo += "</tr>";
        $(selector).append(nuevo);
    }
    nuevo+="</table>";
}

$(function(){
    insertmatrix("div",m);
});
   
