var cleave = require('cleave'),
    debug = require('debug')('couchtty'),
    out = require('out'),
    nano = require('nano'),
    reTrailingSlash = /\/$/,
    couch,
    db,
    commands = {
        create: function(name) {
            return _nanoWrap(couch.db.create, couch, name);
        },
        
        info: function() {
            return db ? _nanoWrap(db.info, db) : _nanoWrap(couch.relax, couch, { db: '' });
        },
        
        use: function(name) {
            db = name ? couch.use(name) : null;
            
            return commands.info();
        },

        list: function() {
            return db ? _nanoWrap(db.list, db) : _nanoWrap(couch.db.list, couch);
        },
        
        get: function(id) {
            return db ? _nanoWrap(db.get, db, id) : _nanoWrap(couch.db.get, couch, id);
        }
    };

// ## private functions

function _error(text) {
    out('!{2718,bold} !{red}' + text);
    return false;
}

function _nanoWrap(targetCall, instance) {
    var args = Array.prototype.slice.call(arguments, 2);
    
    return function(callback) {
        function handleResponse(err, res, headers) {
            if (err) {
                out('!{2718,bold} !{red}' + err.toString());
            }
            else {
                out('!{check,green} !{grey}' + JSON.stringify(res));
            }
            
            callback();
        }

        debug('calling nano function with args: ', args);
        targetCall.apply(instance, args.concat(handleResponse));
    };
} // _nanoWrap

// ## exports

exports.connect = function(targetUrl, inputs, outputs) {
    // strip the trailing slash
    targetUrl = targetUrl.replace(reTrailingSlash, '');
    
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