/******** JQUERY ********/

// La siguiente línea indica al navegador que ejecute la función 
// inicializar()
// cuando se cargue el DOM de la página.
$(function() {
    function getTaskFromTexto(titulo, tag) {
        alert("JQuery");

        var tags = texto.match(/@\w*/g).map(n => n.replace(/@/, ""));
        var text = texto.replace(/@\w*/g, "").trim().replace("  ", " ");

        alert("dfdfdf");

        return { "text": text, "tags": tags };
    }

    function createTask(titulo, tag) {
        let newTaskText = titulo + " " + tag;
        alert(newTaskText);
        let newTask = getTaskFromTexto(newTaskText);
        alert(newTask);
    }

    $("#input_task_name").on("input", function() {
        // Obtenemos valor actual
        let valor = $(event.target).prop("value").trim();
        $("#new_task_name").text(valor);
    });

    $("#add_tag").on("click", function() {
        let taskName = $("#input_task_name").val();
        let newTagValue = $("#new_tag").val();

        getTaskFromTexto(taskName, newTagValue);

        var tag = '<div class="tag">';
        tag += newTagValue;
        tag += '</div>';
        $("#tags_container").append(tag);
    });
});




/******** END JQUERY ********/