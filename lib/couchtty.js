var cleave = require('cleave'),
    debug = require('debug')('couchtty'),
    out = require('out'),
    nano = require('nano'),
    couch,
    commands = {
        create: function(name) {
            return _nanoWrap(couch.db.create, couch, name);
        },
        
        use: function(args) {
            couch.use.call(args);
        }
    };

// ## private functions

function _nanoWrap(targetCall, instance) {
    var args = Array.prototype.slice.call(arguments, 2);
    
    return function(callback) {
        function handleResponse(err, res, headers) {
            if (err) {
                out('!{red}' + err.toString());
            }
            else {
                out('!{check,green} !{}' + JSON.stringify(res));
            }
            
            callback();
        }

        debug('calling nano function with args: ', args);
        targetCall.apply(instance, args.concat(handleResponse));
    };
} // _nanoWrap

// ## exports

exports.connect = function(targetUrl, inputs, outputs) {
    debug('connecting to: ' + targetUrl);
    couch = nano(targetUrl);

    // start the repl
    repl = cleave.repl('couchtty>', inputs, outputs);
    
    // iterate through the commands and register
    Object.keys(commands).forEach(function(key) {
        repl.command(key, commands[key]);
    });
};

// expose the commands so they can be extended
exports.commands = commands;