/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 3.0.0pr1
*/
YUI.add('dd-ddm', function(Y) {

    /**
     * Extends the dd-ddm-base Class to add support for the viewport shim to allow a draggable node to drag to be dragged over an iframe or any other node that traps mousemove events.
     * It is also required to have Drop Targets enabled, as the viewport shim will contain the shims for the Drop Targets.
     * @module dd
     * @submodule dd-ddm
     * @for DDM
     */
    Y.mix(Y.DD.DDM, {
        /**
        * @private
        * @property _pg
        * @description The shim placed over the screen to track the mousemove event.
        * @type {Node}
        */
        _pg: null,
        /**
        * @private
        * @property _debugShim
        * @description Set this to true to set the shims opacity to .5 for debugging it, default: false.
        * @type {Boolean}
        */
        _debugShim: false,
        _activateTargets: function() {},
        _deactivateTargets: function() {},
        _startDrag: function() {
            if (this.activeDrag.get('useShim')) {
                this._pg_activate();
                this._activateTargets();
            }
        },
        _endDrag: function() {
            this._pg_deactivate();
            this._deactivateTargets();
        },
        /**
        * @private
        * @method _pg_deactivate
        * @description Deactivates the shim
        */
        _pg_deactivate: function() {
            this._pg.setStyle('display', 'none');
        },
        /**
        * @private
        * @method _pg_activate
        * @description Activates the shim
        */
        _pg_activate: function() {
            this._pg_size();
            this._pg.setStyles({
                top: 0,
                left: 0,
                display: 'block',
                opacity: ((this._debugShim) ? '.5' : '0')
            });
        },
        /**
        * @private
        * @method _pg_size
        * @description Sizes the shim on: activatation, window:scroll, window:resize
        */
        _pg_size: function() {
            if (this.activeDrag) {
                var b = Y.Node.get('body'),
                h = b.get('docHeight'),
                w = b.get('docWidth');
                this._pg.setStyles({
                    height: h + 'px',
                    width: w + 'px'
                });
            }
        },
        /**
        * @private
        * @method _createPG
        * @description Creates the shim and adds it's listeners to it.
        */
        _createPG: function() {
            //var pg = Y.Node.create(['div']),
            var pg = Y.Node.create('<div></div>'),
            bd = Y.Node.get('body');
            pg.setStyles({
                top: '0',
                left: '0',
                position: 'absolute',
                zIndex: '9999',
                overflow: 'hidden',
                //opacity: '0',
                backgroundColor: 'red',
                display: 'none',
                height: '5px',
                width: '5px'
            });
            if (bd.get('firstChild')) {
                bd.insertBefore(pg, bd.get('firstChild'));
            } else {
                bd.appendChild(pg);
            }
            this._pg = pg;
            this._pg.on('mouseup', this._end, this, true);
            this._pg.on('mousemove', this._move, this, true);
            
            
            //TODO
            Y.Event.addListener(window, 'resize', this._pg_size, this, true);
            Y.Event.addListener(window, 'scroll', this._pg_size, this, true);
        }   
    }, true);

    Y.DD.DDM._createPG();    



}, '3.0.0pr1' ,{requires:['dd-ddm-base'], skinnable:false});
