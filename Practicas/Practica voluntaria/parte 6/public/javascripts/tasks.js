/******** JQUERY ********/

// La siguiente línea indica al navegador que ejecute la función 
// inicializar()
// cuando se cargue el DOM de la página.
$(function() {
    function isEmpty(str) {
        return (!str || 0 === str.length);
    }

    function getNewTaskData() {
        let taskName = $("#input_task_name").val();
        let newTagValue = $("#new_tag").val();

        var newTaskHidden = $("#new_hidden_task").val();
        var newValue = "";
        if (isEmpty(newTaskHidden)) {
            newValue = taskName;
        } else {
            newValue = newTaskHidden;
        }

        if (!isEmpty(newTagValue)) {
            newValue += " @" + newTagValue;
        }

        return newValue;
    }

    function createTask(texto) {
        var tags = texto.match(/@\w*/g);

        if (tags != null) {
            tags = tags.map(n => n.replace(/@/, ""));
        }
        var text = texto.replace(/@\w*/g, "").trim().replace("  ", " ");

        return { "text": text, "tags": tags, "done": 0 };
    }

    $("#input_task_name").on("input", function() {
        // Obtenemos valor actual
        let newTaskName = $(event.target).prop("value").trim();
        $("#new_task_name").text(newTaskName);

        let currentTask = getNewTaskData();
        let currentTaskData = createTask(currentTask);

        var newTaskHidden = $("#new_hidden_task").val();
        let newTaskHiddenData = createTask(newTaskHidden);

        var newValue = newTaskName;

        if (newTaskHiddenData.tags != null) {
            var tagsData = newTaskHiddenData.tags.map(n => "@" + n);
            newValue += " " + tagsData;
        }

        $("#new_hidden_task").prop("value", newValue);

    });

    $("#add_tag").on("click", function() {
        let newTagValue = $("#new_tag").val();
        let newValue = getNewTaskData();

        $("#new_hidden_task").prop("value", newValue);

        var tag = '<div class="tag">';
        tag += newTagValue;
        tag += '</div>';
        $("#tags_container").append(tag);
    });

    $('#newTask').submit(function(e) {
        let taskName = $("#input_task_name").val();

        if (isEmpty(taskName)) {
            alert("El nombre de la tarea no puede estar vacío.");
            e.preventDefault(); // Cancel the submit
            return;
        }
    });
});




/******** END JQUERY ********/