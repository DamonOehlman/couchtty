.. _commands-basic:

==============
Basic Commands
==============

This section of the docs lists basic commands for working with CouchTTY.

.. _command-use:

``use``
=======

The ``use`` command works to select a Couch database as the current operation context, e.g.::

    couchtty> use testdb

When initially writing CouchTTY, working the ``use`` command felt a lot like navigating through directories on the file system (just only one level deep), so this has also been aliased to the ``cd`` command.  The following is equivalent to the previous example::

    couchtty> cd testdb

To return the scope back to the server, from a specific database you can simply call use / cd and specify no database or ``..``::

    couchtty> cd ..

``info``
========

The ``info`` command provides some information on the currently selected context.  By default, this command is called after a :ref:`command-use` operation is completed to provide you feedback on a change in context.

Running the command manually though is very simple::

    couchtty> info

When run on the server context, the information like the following will be returned::

   {"couchdb":"Welcome","version":"1.3.0","vendor":{"version":"0.4","name":"refuge"}}

In a database context, something like the following example should be expected::

    {"db_name":"testdb","doc_count":2,"doc_del_count":0,"update_seq":2,"purge_seq":0,"compact_running":false,"disk_size":4188,"data_size":382,"instance_start_time":"1326520328179080","disk_format_version":6,"committed_update_seq":2}

In both cases, this is simply the JSON that is returned from CouchDB through the REST interface.

.. _command-list:

``list``
========

To be completed.