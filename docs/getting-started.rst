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

    couchtty> {"couchdb":"Welcome","version":"1.3.0","vendor":{"version":"0.4","name":"refuge"}}
    couchtty> 

The output shown above shows that I'm connected to a local `refuge`__ instance (Refuge is definitely worth a look, BTW) and it's running version 1.3.0 of CouchDB.  Time to do more interesting stuff.

__ http://refuge.io

Creating a Database
===================

As I have connected as an admin user, then I have the ability to create new databases, so here goes::

    couchtty> create testdb
    
Which displays the following before providing me another couchtty prompt::

    {"ok":true}
    {"db_name":"testdb","doc_count":0,"doc_del_count":0,"update_seq":0,"purge_seq":0,"compact_running":false,"disk_size":79,"data_size":0,"instance_start_time":"1326687120495961","disk_format_version":6,"committed_update_seq":0}

This is because when a database is created, the :ref:`command-use` command is also executed, and this automatically changes context to our newly created database.

Creating some test docs
=======================

Creating new documents is done through the :ref:`command-put` command, which is also aliased by the `insert` command.  Let's create a new test document now.  First we will create the doc by specifying a JSON fragment within the TTY::

    couchtty> put { "name": "Damon Oehlman", "country": "Australia" }

If successful, you should see output similar to the following::

    {"ok":true,"id":"7caf8c51a4ac20b9aa902e82ed000887","rev":"1-d78e4c3f88d1770f2a2c39a05c3699ae"}

When creating CouchTTY though, I really didn't want to have to add every document by either typing or copying JSON fragments into the console.  So, you can also just specify a path to a JSON file and have that inserted instead, e.g.::

    couchtty> put examples/docs/1.json

If CouchTTY determines that this is a file, it will read the contents as JSON and insert it into the DB.  Running the above code from the forked git repo, should provide the following result::

    {"ok":true,"id":"test1","rev":"1-6941063ef08bf3749a87f8672b01c0e0"}

Let's just check that we have two docs in our new db.  Let's run the :ref:`command-list` command and check::

    couchtty> list

Which yields the following output::

    {"total_rows":2,"offset":0,"rows":[{"id":"7caf8c51a4ac20b9aa902e82ed000887","key":"7caf8c51a4ac20b9aa902e82ed000887","value":{"rev":"1-d78e4c3f88d1770f2a2c39a05c3699ae"}},{"id":"test1","key":"test1","value":{"rev":"1-6941063ef08bf3749a87f8672b01c0e0"}}]}

Great, 2 documents.  OK, let's remove the `test1` document in preparation for my next trick::

    couchtty> rm test1

Which should report the successful removal::

    {"ok":true,"id":"test1","rev":"2-c938d631f10400229788ee139ce263f4"}
    
Right, done. Next lets have a look at how to put all JSON documents in a folder into the database.  If you have cloned the `project from github`__ and you are in the project directory (the previous put file example should have worked), then you should also be able to run the following::

    couchtty> put examples/docs

If it worked, then you will see the tty report two successful PUT operations::

    {"ok":true,"id":"test1","rev":"3-c2d95820d791e00ccd82fd3577833725"}
    {"ok":true,"id":"test2","rev":"1-5a0cbbc26fdd3a1503bded465de3ddf1"}

Pretty cool, huh? Anyway, that brings to a close this getting started tutorial - I'll hopefully be able to put together more information soon :)