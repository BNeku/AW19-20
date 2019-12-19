/******** JQUERY ********/

// La siguiente línea indica al navegador que ejecute la función 
// inicializar()
// cuando se cargue el DOM de la página.
$(function() {
    function isEmpty(str) {
        return (!str || 0 === str.length);
    }

    $("#input_task_name").on("input", function() {
        // Obtenemos valor actual
        let valor = $(event.target).prop("value").trim();
        $("#new_task_name").text(valor);
    });

    $("#add_tag").on("click", function() {
        let taskName = $("#input_task_name").val();
        let newTagValue = $("#new_tag").val();

        var newTaskHidden = $("#new_hidden_task").val();
        var newValue = "";
        if (isEmpty(newTaskHidden)) {
            newValue = taskName + " @" + newTagValue;
        } else {
            newValue = newTaskHidden + " @" + newTagValue;
        }

        alert(newValue);
        $("#new_hidden_task").prop("value", newValue);

        var tag = '<div class="tag">';
        tag += newTagValue;
        tag += '</div>';
        $("#tags_container").append(tag);
    });
});




/******** END JQUERY ********/