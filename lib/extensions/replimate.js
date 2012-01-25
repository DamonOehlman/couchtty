var out = require('out');

function _add(from, to, continous, callback) {
    if (typeof continuous == 'function') {
        callback = continuous;
        continuous = false;
    }
    
    console.log(arguments);
};

function _list(replimate, callback) {
    replimate(exports.server, function(err, docs) {
        if (err) {
            out('!{red}' + err);
        }
        else if (Array.isArray(docs) && (docs.length == 0)) {
            out('!{gray}No replication rules');
        }
        else {
            (docs || []).forEach(function(doc) {
                out('{0}', doc);
            });
        }
        
        callback();
    });
};

exports.server = '';

exports.replication = function(command) {
    var replimate = require('replimate'),
        args = [replimate].concat(Array.prototype.slice.call(arguments, 1));
    
    return function(done) {
        switch (command) {
            case 'add': {
                _add.apply(null, args.concat(done));
                break;
            }
            
            case 'list': 
            default: {
                _list.apply(null, args.concat(done));
            }
        }
    };
};