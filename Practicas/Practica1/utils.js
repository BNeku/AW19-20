'use strict'

function createUserFromRequestBody(request) {
    if(request.body.email == "" || request.body.password == "" || request.body.name == "" || request.body.birthday ==""){
        return false;
    }else{
        var gender = 'F'; //Default 0 is female.
        if (request.body.gender == 1) {
            gender = 'M';
        } else if (request.body.gender == 2) {
            gender = 'O';
        }
    
        var imageName = null;
    
        if (request.file) {
            imageName = request.file.filename;
        }
    
        var user = {
            email: request.body.email,
            password: request.body.password,
            name: request.body.name,
            gender: gender,
            birthday: request.body.birthday,
            photo: imageName
        };

        return user;
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
    getUserFromRequestBody
}