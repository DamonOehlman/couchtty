var out = require('out');

function _add(replimate, source, target, continuous, callback) {
    if (typeof continuous == 'function') {
        callback = continuous;
        continuous = false;
    }
    
    var opts = {
        action: 'replicate', 
        source: source,
        target: target,
        continuous: continuous ? true : false
    };
    
    replimate(exports.server, opts, function(err, monitor) {
        if (err) {
            out('!{red}Could not create replication rule: ' + err);
            console.log(err);
        }
        else {
            out('!{green}replication rule created: ' + monitor.docUrl);
        }
        
        callback();
    });
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
                out('{0} ==> {1}', doc.source, doc.target);
            });
        }
        
        callback();
    });
};

exports.server = '';

exports.replication = function(text) {
    var replimate = require('replimate'),
        commands = text.split(/\s/),
        args = [replimate].concat(commands.slice(1));
    
    return function(done) {
        switch (commands[0]) {
            case 'add': {
                _add.apply(null, args.concat(done));
                break;
            }
            
            case 'list': 
            default: {
                _list(replimate, done);
            }
        }
    };
};