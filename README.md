Node Boilerplate
=================
node-boilerplate takes html-boilerplate, express, connect and Socket.IO and organizes them into a ready to use website project. Its a fast way to get working on your Node website without having to worry about the setup. It takes care of all the boring parts, like setting up your views, 404 page, 500 page, getting the modules organized, etc... 

Node Boilerplate has 4 goals:

1. To end the repetition involved with starting a new Node website project
2. To never install anything outside of the project directory (For easier production deployment)
3. To make it easy to install additional modules within the project directory
4. To enable easy upgrade or freezing of project dependencies  

Differences between this fork and the [original](https://github.com/robrighter/node-boilerplate)
----------------------------------------------

Currently, the differences are:

* Uses [Express 3.x](https://github.com/visionmedia/express/wiki/Migrating-from-2.x-to-3.x) as opposed to 2.x
* Uses Handlebars [(express3-handlebars)](https://github.com/ericf/express3-handlebars) instead of Jade
* Uses [YUI](http://yuilibrary.com) instead of jQuery on the client (although you can change this in 2 lines of code)
* Uses [express-state](https://github.com/yahoo/express-state) to expose data from the server to the client. 

To run the boilerplate template app:

```shell
    $ git clone github.com/tilomitra/node-boilerplate/ <your-app-folder-name>
    $ npm install
    $ npm start
```

Go to [http://localhost:8000](http://localhost:8000) and click on the send message link to see socket.io in action.

### But I don't need socket.io!

If you don't need Socket.io, then just get rid of the socket.io calls from `server.js`, remove the client-side code in `script.js`, and the socket.io client-side library that exists in `layouts/main.handlebars`.

### Want to use jQuery or another front-end library?

Just go into `main.handlebars` and add the library that you want. Then, you can modify `script.js` with your custom JavaScript code. 

LICENSE
-------
This software is free to use under the Yahoo! Inc. BSD license. See the LICENSE file for license text and copyright information.
