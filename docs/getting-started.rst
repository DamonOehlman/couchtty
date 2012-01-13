===============
Getting Started
===============

Installing CouchTTY
===================

If you are using `NPM`__ CouchTTY can be installed using the following command::

    (sudo) npm install -g couchtty

This will install CouchTTY globally on the system and will provide you access to the ``couchtty`` command.

__ http://npmjs.org/

Connecting to a Couch Instance
==============================

Simply run ``couchtty`` and provide a url to your couchdb instance, e.g.::

    couchtty http://localhost:5984/
    
If you are going to want to perform administrative operations (creating databases, etc), then you will also need to provide admin credentials if your CouchDB instance is not in admin party mode::

    couchtty http://user:pass@localhost:5984/

All being well, you should see the CouchTTY prompt displayed::

    couchtty>

