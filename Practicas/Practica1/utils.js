'use strict'

function createUserFromRequestBody(request) {
    var gender = 0; //Default 0 is female.

    if (request.body.gender === "masculino") {
        gender = 1;
    } else if (request.body.gender === "otro") {
        gender = 2;
    }

    var imageName = null;

    if (request.file) {
        imageName = request.file.filename;
    }

    return {
        email: request.body.email,
        password: request.body.password,
        name: request.body.name,
        gender: gender,
        birthday: request.body.birthday,
        photo: imageName
    };
}

function getUserFromRequestBody(request) {
    return {
        email: request.body.email,
        password: request.body.password
    };
}

module.exports = {
    createUserFromRequestBody,
    getUserFromRequestBody
}