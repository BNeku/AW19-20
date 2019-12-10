'use strict'

function createUserFromRequestBody(request) {
    if (request.body.email == "" || request.body.password == "" || request.body.name == "" || request.body.birthday == "") {
        return false;
    } else {


        var imageName = null;

        if (request.file) {
            imageName = request.file.filename;
        }

        var user = {
            email: request.body.email,
            password: request.body.password,
            name: request.body.name,
            gender: gender(request.body.gender),
            birthday: request.body.birthday,
            photo: imageName
        };

        return user;
    }
}

function gender(n) {

    switch (n) {
        case "0":
            return 'F';
            break;
        case "1":
            return 'M';
            break;
        case "2":
            return 'O';
            break;
        default:
            break;
    }
}

function modifyUserFromRequestBody(request, data) {
    var user = data;

    if (request.body.password != "" && user.password != request.body.password) {
        user.password = request.body.password;
    }

    if (request.body.name != "" && user.name != request.body.name) {
        user.name = request.body.name;
    }
    if (typeof(request.body.gender) != "undefined" && user.gender != gender(request.body.gender)) {
        user.gender = gender(request.body.gender);
    }
    if (request.body.birthday != "" && user.birthDate != request.body.birthday) {
        user.birthDate = request.body.birthday;
    }

    return user;
}

function misAmigos(email, rdo) {
    var solicitudes = [];
    var amigos = [];
    for (var i = 0; i < rdo.length; i++) {

        if (rdo[i].solicitado == email && rdo[i].amigos == 0) { //es una solicitud
            solicitudes.push({
                email: rdo[i].solicitante
            });
        } else {
            if (rdo[i].amigos == 1) {
                if (rdo[i].solicitado == email) {
                    amigos.push({
                        email: rdo[i].solicitante
                    });
                } else {
                    amigos.push({
                        email: rdo[i].solicitado
                    });
                }
            }
        }
    }

    if (amigos.length == 0) {
        amigos = null;
    }
    if (solicitudes.length == 0) {
        solicitudes = null;
    }
    return {
        solicitudes: solicitudes,
        amigos: amigos
    }

}


function getUserFromRequestBody(request) {
    return {
        email: request.body.email,
        password: request.body.password
    };
}

function montarAmigosAdivinados(nombres, adivinados) {
    var final = [];

    for (var i = 0; i < nombres.length; i++) {
        var adivinar = -1;
        for (var j = 0; j < adivinados.length; j++) {
            if (nombres.email == adivinados.email) {
                adivinar = adivinados.adivinado;
            }
        }

        final.push({ email: nombres[i].email, name: nombres[i].name, adivinado: adivinar });
    }

    return final;
}

module.exports = {
    createUserFromRequestBody,
    getUserFromRequestBody,
    modifyUserFromRequestBody,
    gender,
    misAmigos,
    montarAmigosAdivinados
}