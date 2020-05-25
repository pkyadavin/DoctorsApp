var azure = require('azure-storage');
var fs = require('fs');
var base64 = require('base64-js');
var Stream = require('stream');

//9
//NAME EMEA Blob settings
var accessKey = 'Gq8i6BGVMzqzwB/fL2gzUZq/DMtY6k0XrYVLEnnZ0vnxEkldw2U/useCPa3ho7ZN1fJHwRO0SKCpCAiMzaJMOw==';
var storageAccount = 'rl21';
var endpoint = 'https://rl21.blob.core.windows.net/';

//Prod Blob settings
// var accessKey = 'fgP60RS0MksqX8F1GHoqmnygsxABrmHtvl+MTubOyqX13TlMR7prXLl68vu5HJE1W4OSMX18rdq6wzgLXEOW8A==';
// var storageAccount = 'amerprodblob';
// var endpoint = 'https://amerprodblob.blob.core.windows.net/';

 
//create a blob service set explicit credentials
var blobService = azure.createBlobService(storageAccount, accessKey);
//var blobService = azure.createBlobService();

//Create a container
var createContainer = function (containername) {
    blobService.createContainerIfNotExists(containername, { publicAccessLevel: 'blob' }, function (error, result, response) {
        if (!error) {
        }
    });
}


//upload file from local
var uploadFile = function (containerName, file, callback) {
    blobService.createContainerIfNotExists(containerName.toLowerCase(), { publicAccessLevel: 'blob' }, function (error, result, response) {
        if (!error) {

            var time = Date.now || function () {
                return +new Date;
            };
            var filename = function () {
                var extension = file.originalname.split('.').pop();
                var name = file.originalname.split('.').slice(0, -1).join('.');
                return name + '-' + time() + '.' + extension;
            }
            blobService.createBlockBlobFromLocalFile(containerName.toLowerCase(), filename(), file.path, function (error, result, response) {
                if (!error) {
                    // file uploaded
                    callback(null, endpoint + result.container + '/' + result.name)
                }
                else {
                    callback(error, null)
                    
                }
            });
        }
    });
    
}

//upload file from local
var uploadFiles = function (containerName, Userfiles, callback) {
    blobService.createContainerIfNotExists(containerName.toLowerCase(), { publicAccessLevel: 'blob' }, function (error, result, response) {
        if (!error) {
            var errors = [];
            var files = []; 

            for(var i = 0; i < Userfiles.length;i++){
            var file = Userfiles[i];
            var time = Date.now || function () {
                return +new Date;
            };
            var filename = function () {
                var extension = file.originalname.split('.').pop();
                var name = file.originalname.split('.').slice(0, -1).join('.');
                return name + '-' + time() + '.' + extension;
            }
            blobService.createBlockBlobFromLocalFile(containerName.toLowerCase(), filename(), file.path, function (error, result, response) {
                console.log('1');
                if (!error) {            
                    files.push(endpoint + result.container + '/' + result.name);
                }
                else {
                    errors.push(error);
                }
                callback(errors, files)
            });
        }
        
        }
    });
    
}

//upload file from local
var uploadFileWithBase64 = function (containerName, file, base64String, callback) {

    //alert(base64String);

    blobService.createContainerIfNotExists(containerName.toLowerCase(), { publicAccessLevel: 'blob' }, function (error, result, response) {
        if (!error) {

            var time = Date.now || function () {
                return +new Date;
            };
            var filename = function () {
                var extension = "png";// file.originalname.split('.').pop();
                var name = "vikas";// file.originalname.split('.').slice(0, -1).join('.');
                return  time() + '.' + extension;
            }

            var data = base64.toByteArray(base64String),
                buffer = new Buffer(data),
                stream = new Stream();
            stream['_ended'] = false;
            stream['pause'] = function () {
                stream['_paused'] = true;
            };
            stream['resume'] = function () {
                if (stream['_paused'] && !stream['_ended']) {
                    stream.emit('data', buffer);
                    stream['_ended'] = true;
                    stream.emit('end');
                }
            }; 

            var fName = filename();
            blobService.createBlockBlobFromStream(containerName.toLowerCase(), fName, stream, data.length, function (error, result, response) {
                if (!error) {
                    // file uploaded
                    var fileDetail = { FileName: fName, FileURL: endpoint + result.container + '/' + result.name };
                    callback(null, fileDetail)
                }
                else {
                    callback(error, null)

                }
            });
        }
    });

}


var uploadFileFromStream = function (file)
{
    var myStream = fs.createReadStream(file.buffer);
    
    var dataLength = 0;
    createContainer('mycontainer');
    blobService.createBlockBlobFromStream(
        'mycontainer',
        'myblob',
        myStream,
        file.size,
        function (error, result, response) {
            if (error) {
                console.log("Couldn't upload stream");
                console.error(error);
            } else {
                console.log('Stream uploaded successfully');
            }
        });

}


exports.uploadFileWithBase64 = uploadFileWithBase64;
exports.uploadFile = uploadFile;
exports.uploadFiles = uploadFiles;
exports.uploadFileFromStream = uploadFileFromStream;
