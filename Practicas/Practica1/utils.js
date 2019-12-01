'use strict'

function createUserFromRequestBody(body) {
    var gender = 0; //Default 0 is female.

    if (body.gender === "masculino") {
        gender = 1;
    } else if (body.gender === "otro") {
        gender = 2;
    }

    return {
        email: body.email,
        password: body.password,
        name: body.name,
        gender: gender,
        birthday: body.birthday,
        photo: null
    };
}

module.exports = {
    createUserFromRequestBody
}