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
    if (typeof (request.body.gender) != "undefined" && user.gender != gender(request.body.gender)) {
        user.gender = gender(request.body.gender);
    }
    if (request.body.birthday != "" && user.birthDate != request.body.birthday) {
        user.birthDate = request.body.birthday;
    }

    return user;
}

function misAmigos(email, rdo) {
    var amigosUser=[];

    for(var i=0; i<rdo.length;i++){
        var x;
        if(rdo[i].emailAmigo1 == email){
            x = {email: rdo[i].emailAmigo2, amigos: rdo[i].amigos};
        }else{
            x = {email: rdo[i].emailAmigo1, amigos: rdo[i].amigos};
        }
        amigosUser.push(x);
    }

    if (amigosUser.length == 0) {
        return null;
    } else {
        var amigos = amigosUser.filter(n => n.amigos == 1);
        if (amigos.length == 0) {
            amigos = null;
        }
        var solicitudes = amigosUser.filter(n => n.amigos == 0);
        if (solicitudes.length == 0) {
            solicitudes = null;
        }
        return {
            solicitudes: solicitudes,
            amigos: amigos
        }
    }
}


function getUserFromRequestBody(request) {
    return {
        email: request.body.email,
        password: request.body.password
    };
}

module.exports = {
    createUserFromRequestBody,
    getUserFromRequestBody,
    modifyUserFromRequestBody,
    gender,
    misAmigos,

}