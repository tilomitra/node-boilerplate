Node Boilerplate
=================
node-boilerplate takes html-boilerplate, express, connect and Socket.IO and organizes them into a ready to use website project. Its a fast way to get working on your Node website without having to worry about the setup. It takes care of all the boring parts, like setting up your views, 404 page, 500 page, getting the modules organized, etc... 

Node Boilerplate has 4 goals:

1. To end the repetition involved with starting a new Node website project
2. To never install anything outside of the project directory (For easier production deployment)
3. To make it easy to install additional modules within the project directory
4. To enable easy upgrade or freezing of project dependencies  

Differences between this fork and the original
----------------------------------------------

Currently, the differences are:

* Uses [express3-handlebars](https://github.com/ericf/express3-handlebars) instead of jade
* Uses [Express v3.x](https://github.com/visionmedia/express/wiki/Migrating-from-2.x-to-3.x) as opposed to 2.x
* Uses [YUI](http://yuilibrary.com) instead of jQuery on the client


To run the boilerplate template app:

		node server.js

Go to http:/localhost:8000 and click on the send message link to see socket.io in action.


LICENSE
-------
This software is free to use under the Yahoo! Inc. BSD license. See the LICENSE file for license text and copyright information.
