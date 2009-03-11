/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 3.0.0pr1
*/
YUI.add('dd-drop-plugin', function(Y) {

       /**
        * This is a simple Drop plugin that can be attached to a Node via the plug method.
        * @module dd-plugin
        * @submodule dd-drop-plugin
        */
       /**
        * This is a simple Drop plugin that can be attached to a Node via the plug method.
        * @class DropPlugin
        * @extends Drop
        * @constructor
        */

        Y.Plugin = Y.Plugin || {};

        var Drop = function(config) {
            config.node = config.owner;
            Drop.superclass.constructor.apply(this, arguments);
        };
        
        /**
        * @property NAME
        * @description dd-drop-plugin
        * @type {String}
        */
        Drop.NAME = "dd-drop-plugin";
        /**
        * @property NS
        * @description The Drop instance will be placed on the Node instance under the drop namespace. It can be accessed via Node.drop;
        * @type {String}
        */
        Drop.NS = "drop";


        Y.extend(Drop, Y.DD.Drop);
        Y.Plugin.Drop = Drop;



}, '3.0.0pr1' ,{requires:['dd-drop'], skinnable:false});
