var async = require('async'),
    cleave = require('cleave'),
    debug = require('debug')('couchtty'),
    exec = require('child_process').exec,
    out = require('out'),
    path = require('path'),
    fs = require('fs'),
    nano = require('nano'),
    ERROR_NODB = 'No database selected, run "use %dbname%" to specify the db',
    reTrailingSlash = /\/$/,
    couch,
    db,
    commands = {
        '#': _comment,
        
        info: _info,
        list: _list,
        use: _use,
        
        // get, put and delete
        get: _get,
        put: _put,
        'delete': _delete,
        
        // admin ops
        create: _create,
        
        // tty helpers
        install: _install
    },
    moduleCommands = {
        replimate: require('./extensions/replimate')
    },
    help = {
        info: 'Returns JSON information for the currently selected context (db / server)'
    },
    aliases = {
        list: ['ls'],
        use: ['cd'],
        put: ['insert'],
        'delete': ['rm']
    };
    
// ## command functions

function _comment() {
}

function _install(module) {
    return function(done) {
        exec('npm install ' + module, function(err, output) {
            out(output);
            done();
        });
    };
}

function _info() {
    return db ? _nanoWrap(db.info, db) : _nanoWrap(couch.relax, couch, { db: '' });
}

function _list() {
    return db ? _nanoWrap(db.list, db) : _nanoWrap(couch.db.list, couch);
}

function _use(name) {
    if ((!name) || (name === '..')) {
        db = null;
    }
    else if (name === '.') {
        // do nothing, db stays the same
    }
    else {
        db = couch.use(name);
    }
    
    return _info();
}

function _get(id) {
    return db ? _nanoWrap(db.get, db, id) : _nanoWrap(couch.db.get, couch, id);
}

function _put(contents) {
    if (! db) {
        return _error(ERROR_NODB);
    }
    
    return function(callback) {
        fs.stat(contents, function(err, stats) {
            // if we received an error, then try inserting as a raw json snippet
            if (err) {
                debug('inserting doc, contents not a file, attempting JSON parse');
                try {
                    db.insert(JSON.parse(contents), _handleResponse(callback));
                }
                catch (e) {
                    callback(e);
                }
            }
            else {
                if (stats.isDirectory()) {
                    fs.readdir(contents, function(err, files) {
                        async.forEach(
                            files || [],
                            function(file, itemCallback) {
                                _insertFromFile(path.join(contents, file), itemCallback);
                            },
                            callback
                        );
                    });
                }
                else {
                    _insertFromFile(contents, callback);
                }
            }
        });
    };
}

function _delete(id) {
    if (db) {
        return function(callback) {
            db.get(id, function(err, doc) {
                if (err) {
                    callback(err);
                }
                else {
                    db.destroy(id, doc._rev, _handleResponse(callback));
                }
            });
        };
    }
    else {
        return _nanoWrap(couch.db.destroy, couch, id);
    }
}

function _create(name) {
    return function(callback) {
        couch.db.create(name, _handleResponse(function() {
            _use(name)(callback);
        }));
    };
}

// ## private functions

function _handleResponse(callback) {
    return function(err, res, headers) {
        if (err) {
            out('!{2718,bold} !{red}' + err.toString());
        }
        else {
            out('!{grey}' + JSON.stringify(res));
        }
    
        callback();
    };
}

function _insertFromFile(filename, callback) {
    debug('inserting doc from file: ' + filename);
    fs.readFile(filename, 'utf8', function(err, data) {
        if (! err) {
            try {
                db.insert(JSON.parse(data), _handleResponse(callback));
            }
            catch (e) {
                callback(e);
            }
        }
        else {
            callback(err);
        }
    });
} // _insertFromFile

function _error(text) {
    out('!{2718,bold} !{red}' + text);
    return false;
}

function _nanoWrap(targetCall, instance) {
    var args = Array.prototype.slice.call(arguments, 2);
    
    return function(callback) {
        debug('calling nano function with args: ', args);
        targetCall.apply(instance, args.concat(_handleResponse(callback)));
    };
} // _nanoWrap

// ## exports

exports.connect = function(targetUrl, inputs, outputs) {
    // strip the trailing slash
    targetUrl = (targetUrl || 'http://localhost:5984').replace(reTrailingSlash, '');
    
    // TODO: check for a db attached to the url, if provided, then queue up a use command
    
    debug('connecting to: ' + targetUrl);
    couch = nano(targetUrl);

    // start the repl
    repl = cleave.repl('couchtty>', inputs, outputs);
    
    // iterate through the commands and register
    Object.keys(commands).forEach(function(key) {
        repl.command(key, commands[key], help[key]);
    });
    
    // register the aliases
    Object.keys(aliases).forEach(function(key) {
        repl.alias(key, aliases[key]);
    });

    exec('npm --parseable=true list', function(err, output) {
        // parse the output looking for supported modules
        output.split('\n').map(path.basename).forEach(function(moduleName) {
            var extensionModule = moduleCommands[moduleName] || {};
            
            // iterate through the commands and register
            Object.keys(extensionModule).forEach(function(key) {
                if (typeof extensionModule[key] == 'function') {
                    repl.command(key, extensionModule[key], help[key]);
                }
            });
            
            extensionModule.server = targetUrl;

            // remove teh module commands so they don't get readded
            delete moduleCommands[moduleName];
        });
    });

    // run the info command
    repl.run('info');
};

// expose the commands so they can be extended
exports.commands = commands;