# couchtty

A console application for interacting with CouchDB. While interacting with
CouchDB using `curl` is simple enough, sometimes it's nice to have an app
that makes it a little easier.

That's what `couchtty` is designed to do.


[![NPM](https://nodei.co/npm/couchtty.png)](https://nodei.co/npm/couchtty/)


## Getting Started

## Getting Started

### Connecting to a Couch Instance

Simply run `couchtty` and provide a url to your couchdb instance, e.g.:

  couchtty http://localhost:5984/

If you are going to want to perform administrative operations (creating databases, etc), then you will also need to provide admin credentials if your CouchDB instance is not in admin party mode:

  couchtty http://user:pass@localhost:5984/

All being well, you should see the CouchTTY prompt displayed:

  couchtty> {"couchdb":"Welcome","uuid":"79bcebff75a274b3b3c8711fb8a7826f","version":"1.5.0","vendor":{"version":"1.5.0","name":"The Apache Software Foundation"}}
  couchtty>

### Creating a Database

As I have connected as an admin user, then I have the ability to create new databases, so here goes:

  couchtty> create testdb

Which displays the following before providing me another couchtty prompt::

```
{"ok":true}
{"db_name":"testdb","doc_count":0,"doc_del_count":0,"update_seq":0,"purge_seq":0,"compact_running":false,"disk_size":79,"data_size":0,"instance_start_time":"1399870039904598","disk_format_version":6,"committed_update_seq":0}
```

This is because when a database is created, the `use` command is also executed, and this automatically changes context to our newly created database.

### Creating some test docs

Creating new documents is done through the `put` command, which is also aliased by the `insert` command.  Let's create a new test document now.  First we will create the doc by specifying a JSON fragment within the TTY:

  couchtty> put { "name": "Damon Oehlman", "country": "Australia" }

If successful, you should see output similar to the following:

```
{"ok":true,"id":"d566d964805846cab97b5310c7000667","rev":"1-d78e4c3f88d1770f2a2c39a05c3699ae"}
```
When creating CouchTTY though, I really didn't want to have to add every document by either typing or copying JSON fragments into the console.  So, you can also just specify a path to a JSON file and have that inserted instead, e.g.:

  couchtty> put examples/docs/1.json

If CouchTTY determines that this is a file, it will read the contents as JSON and insert it into the DB.  Running the above code from the forked git repo, should provide the following result:

```
{"ok":true,"id":"test1","rev":"1-6941063ef08bf3749a87f8672b01c0e0"}
```

Let's just check that we have two docs in our new db.  Let's run the `list` command and check:

  couchtty> list

Which yields the following output:

```
{"total_rows":2,"offset":0,"rows":[{"id":"d566d964805846cab97b5310c7000667","key":"d566d964805846cab97b5310c7000667","value":{"rev":"1-d78e4c3f88d1770f2a2c39a05c3699ae"}},{"id":"test1","key":"test1","value":{"rev":"1-6941063ef08bf3749a87f8672b01c0e0"}}]}
```

Great, 2 documents.  OK, let's remove the `test1` document in preparation for my next trick:

  couchtty> rm test1

Which should report the successful removal:

```
{"ok":true,"id":"test1","rev":"2-c938d631f10400229788ee139ce263f4"}
```

Right, done. Next lets have a look at how to put all JSON documents in a folder into the database.  If you have cloned the project from github and you are in the project directory (the previous put file example should have worked), then you should also be able to run the following:

  couchtty> put examples/docs

If it worked, then you will see the tty report 3 successful PUT operations:

```
{"ok":true,"id":"test1","rev":"3-c2d95820d791e00ccd82fd3577833725"}
{"ok":true,"id":"_design/example","rev":"1-230141dfa7e07c3dbfef0789bf11773a"}
{"ok":true,"id":"test2","rev":"1-5a0cbbc26fdd3a1503bded465de3ddf1
```


## CouchTTY Alternatives

You should definitely check out the following other interesting projects:

- [futoncli](https://github.com/dscape/futoncli)

## License(s)

### MIT

Copyright (c) 2014 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
