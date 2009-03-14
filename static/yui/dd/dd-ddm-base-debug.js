/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 3.0.0pr1
*/
YUI.add('dd-ddm-base', function(Y) {

    /**
     * Provides the base Drag Drop Manger required for making a Node draggable.
     * @module dd
     * @submodule dd-ddm-base
     */     
     /**
     * Provides the base Drag Drop Manger required for making a Node draggable.
     * @class DDM
     * @extends Base
     * @constructor
     */
    
    var DDMBase = function() {
        //debugger;
        DDMBase.superclass.constructor.apply(this, arguments);
    };

    DDMBase.NAME = 'DragDropMgr';

    DDMBase.ATTRS = {
        /**
        * @attribute clickPixelThresh
        * @description The number of pixels to move to start a drag operation, default is 3.
        * @type Number
        */
        clickPixelThresh: {
            value: 3
        },
        /**
        * @attribute clickTimeThresh
        * @description The number of milliseconds a mousedown has to pass to start a drag operation, default is 1000.
        * @type Number
        */        
        clickTimeThresh: {
            value: 1000
        },
        /**
        * @attribute dragMode
        * @description This attribute only works if the dd-drop module is active. It will set the dragMode (point, intersect, strict) of all future Drag instances. 
        * @type String
        */        
        dragMode: {
            value: 'point',
            set: function(mode) {
                this._setDragMode(mode);
            }           
        }

    };

    Y.extend(DDMBase, Y.Base, {
        /**
        * @private
        * @method _setDragMode
        * @description Handler for dragMode attribute setter.
        * @param String/Number The Number value or the String for the DragMode to default all future drag instances to.
        * @return Number The Mode to be set
        */
        _setDragMode: function(mode) {
            if (mode === null) {
                mode = Y.DD.DDM.get('dragMode');
            }
            switch (mode) {
                case 1:
                case 'intersect':
                    return 1;
                case 2:
                case 'strict':
                    return 2;
                case 0:
                case 'point':
                    return 0;
            }
            return 0;       
        },
        /**
        * @property CSS_PREFIX
        * @description The PREFIX to attach to all DD CSS class names
        * @type {String}
        */
        CSS_PREFIX: 'yui-dd',
        _activateTargets: function() {},        
        /**
        * @private
        * @property _drags
        * @description Holder for all registered drag elements.
        * @type {Array}
        */
        _drags: [],
        /**
        * @property activeDrag
        * @description A reference to the currently active draggable object.
        * @type {Drag}
        */
        activeDrag: false,
        /**
        * @private
        * @method _regDrag
        * @description Adds a reference to the drag object to the DDM._drags array, called in the constructor of Drag.
        * @param {Drag} d The Drag object
        */
        _regDrag: function(d) {
            this._drags[this._drags.length] = d;
        },
        /**
        * @private
        * @method _unregDrag
        * @description Remove this drag object from the DDM._drags array.
        * @param {Drag} d The drag object.
        */
        _unregDrag: function(d) {
            var tmp = [];
            Y.each(this._drags, function(n, i) {
                if (n !== d) {
                    tmp[tmp.length] = n;
                }
            });
            this._drags = tmp;
        },
        /**
        * @private
        * @method _init
        * @description DDM's init method
        */
        initializer: function() {
            Y.Node.get('document').on('mousemove', this._move, this, true);
            Y.Node.get('document').on('mouseup', this._end, this, true);
            //Y.Event.Target.apply(this);
        },
        /**
        * @private
        * @method _start
        * @description Internal method used by Drag to signal the start of a drag operation
        * @param {Number} x The x position of the drag element
        * @param {Number} y The y position of the drag element
        * @param {Number} w The width of the drag element
        * @param {Number} h The height of the drag element
        */
        _start: function(x, y, w, h) {
            this._startDrag.apply(this, arguments);
        },
        /**
        * @private
        * @method _startDrag
        * @description Factory method to be overwritten by other DDM's
        * @param {Number} x The x position of the drag element
        * @param {Number} y The y position of the drag element
        * @param {Number} w The width of the drag element
        * @param {Number} h The height of the drag element
        */
        _startDrag: function() {},
        /**
        * @private
        * @method _endDrag
        * @description Factory method to be overwritten by other DDM's
        */
        _endDrag: function() {},
        _dropMove: function() {},
        /**
        * @private
        * @method _end
        * @description Internal method used by Drag to signal the end of a drag operation
        */
        _end: function() {
            //@TODO - Here we can get a (click - drag - click - release) interaction instead of a (mousedown - drag - mouseup - release) interaction
            //Add as a config option??
            if (this.activeDrag) {
                this._endDrag();
                this.activeDrag.end.call(this.activeDrag);
                this.activeDrag = null;
            }
        },
        /**
        * @method stopDrag
        * @description Method will forcefully stop a drag operation. For example calling this from inside an ESC keypress handler will stop this drag.
        * @return {Self}
        * @chainable
        */       
        stopDrag: function() {
            if (this.activeDrag) {
                this._end();
            }
            return this;
        },
        /**
        * @private
        * @method _move
        * @description Internal listener for the mousemove DOM event to pass to the Drag's move method.
        * @param {Event} ev The Dom mousemove Event
        */
        _move: function(ev) {
            if (this.activeDrag) {
                this.activeDrag._move.apply(this.activeDrag, arguments);
                this._dropMove();
            }
        },
        /**
        * @method setXY
        * @description A simple method to set the top and left position from offsets instead of page coordinates
        * @param {Object} node The node to set the position of 
        * @param {Array} xy The Array of left/top position to be set.
        */
        setXY: function(node, xy) {
            var t = parseInt(node.getStyle('top'), 10),
            l = parseInt(node.getStyle('left'), 10),
            pos = node.getStyle('position');

            if (pos === 'static') {
                node.setStyle('position', 'relative');
            }

            // in case of 'auto'
            if (isNaN(t)) { t = 0; }
            if (isNaN(l)) { l = 0; }
            
            node.setStyle('top', (xy[1] + t) + 'px');
            node.setStyle('left', (xy[0] + l) + 'px');
            
        },
        /**
        * //TODO Private, rename??...
        * @private
        * @method cssSizestoObject
        * @description Helper method to use to set the gutter from the attribute setter.
        * @param {String} gutter CSS style string for gutter: '5 0' (sets top and bottom to 5px, left and right to 0px), '1 2 3 4' (top 1px, right 2px, bottom 3px, left 4px)
        * @return {Object} The gutter Object Literal.
        */
        cssSizestoObject: function(gutter) {
            var p = gutter.split(' '),
            g = {
                top: 0,
                bottom: 0,
                right: 0,
                left: 0
            };
            if (p.length) {
                g.top = parseInt(p[0], 10);
                if (p[1]) {
                    g.right = parseInt(p[1], 10);
                } else {
                    g.right = g.top;
                }
                if (p[2]) {
                    g.bottom = parseInt(p[2], 10);
                } else {
                    g.bottom = g.top;
                }
                if (p[3]) {
                    g.left = parseInt(p[3], 10);
                } else if (p[1]) {
                    g.left = g.right;
                } else {
                    g.left = g.top;
                }
            }
            return g;
        },
        /**
        * @method getDrag
        * @description Get a valid Drag instance back from a Node or a selector string, false otherwise
        * @param {String/Object} node The Node instance or Selector string to check for a valid Drag Object
        * @return {Object}
        */
        getDrag: function(node) {
            var drag = false,
                n = Y.Node.get(node);
            if (n instanceof Y.Node) {
                Y.each(this._drags, function(v, k) {
                    if (n.compareTo(v.get('node'))) {
                        drag = v;
                    }
                });
            }
            return drag;
        }
    });

    Y.namespace('DD');
    Y.DD.DDM = new DDMBase();



}, '3.0.0pr1' ,{requires:['node', 'base'], skinnable:false});
