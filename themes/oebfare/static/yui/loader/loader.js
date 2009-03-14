/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 3.0.0pr1
*/
/**
 * Loader dynamically loads script and css files.  It includes the dependency
 * info for the version of the library in use, and will automatically pull in
 * dependencies for the modules requested.  It supports rollup files and will
 * automatically use these when appropriate in order to minimize the number of
 * http connections required to load all of the dependencies.  It can load the
 * files from the Yahoo! CDN, and it can utilize the combo service provided on
 * this network to reduce the number of http connections required to download 
 * YUI files.
 *
 * @module yui
 * @submodule loader
 */

/**
 * Loader dynamically loads script and css files.  It includes the dependency
 * info for the version of the library in use, and will automatically pull in
 * dependencies for the modules requested.  It supports rollup files and will
 * automatically use these when appropriate in order to minimize the number of
 * http connections required to load all of the dependencies.  It can load the
 * files from the Yahoo! CDN, and it can utilize the combo service provided on
 * this network to reduce the number of http connections required to download 
 * YUI files.
 * @class Loader
 * @constructor
 * @param o an optional set of configuration options.  Valid options:
 * <ul>
 *  <li>base:
 *  The base dir</li>
 *  <li>secureBase:
 *  The secure base dir (not implemented)</li>
 *  <li>comboBase:
 *  The YUI combo service base dir. Ex: http://yui.yahooapis.com/combo?</li>
 *  <li>root:
 *  The root path to prepend to module names for the combo service. Ex: 2.5.2/build/</li>
 *  <li>filter:
 *  
 * A filter to apply to result urls.  This filter will modify the default
 * path for all modules.  The default path for the YUI library is the
 * minified version of the files (e.g., event-min.js).  The filter property
 * can be a predefined filter or a custom filter.  The valid predefined 
 * filters are:
 * <dl>
 *  <dt>DEBUG</dt>
 *  <dd>Selects the debug versions of the library (e.g., event-debug.js).
 *      This option will automatically include the logger widget</dd>
 *  <dt>RAW</dt>
 *  <dd>Selects the non-minified version of the library (e.g., event.js).</dd>
 * </dl>
 * You can also define a custom filter, which must be an object literal 
 * containing a search expression and a replace string:
 * <pre>
 *  myFilter: &#123; 
 *      'searchExp': "-min\\.js", 
 *      'replaceStr': "-debug.js"
 *  &#125;
 * </pre>
 *
 *  </li>
 *  <li>combine:
 *  Use the YUI combo service to reduce the number of http connections required to load your dependencies</li>
 *  <li>ignore:
 *  A list of modules that should never be dynamically loaded</li>
 *  <li>force:
 *  A list of modules that should always be loaded when required, even if already present on the page</li>
 *  <li>insertBefore:
 *  Node or id for a node that should be used as the insertion point for new nodes</li>
 *  <li>charset:
 *  charset for dynamic nodes</li>
 *  <li>timeout:
 *  number of milliseconds before a timeout occurs when dynamically loading nodes.  in not set, there is no timeout</li>
 *  <li>context:
 *  execution context for all callbacks</li>
 *  <li>onSuccess:
 *  callback for the 'success' event</li>
 *  <li>onFailure:
 *  callback for the 'failure' event</li>
 *  <li>onTimeout:
 *  callback for the 'timeout' event</li>
 *  <li>onProgress:
 *  callback executed each time a script or css file is loaded</li>
 *  <li>modules:
 *  A list of module definitions.  See Loader.addModule for the supported module metadata</li>
 * </ul>
 */

// @TODO backed out the custom event changes so that the event system
// isn't required in the seed build.  If needed, we may want to 
// add them back if the event system is detected.

/*
 * Executed when the loader successfully completes an insert operation
 * This can be subscribed to normally, or a listener can be passed
 * as an onSuccess config option.
 * @event success
 */

/*
 * Executed when the loader fails to complete an insert operation.
 * This can be subscribed to normally, or a listener can be passed
 * as an onFailure config option.
 *
 * @event failure
 */

/*
 * Executed when a Get operation times out.
 * This can be subscribed to normally, or a listener can be passed
 * as an onTimeout config option.
 *
 * @event timeout
 */

// http://yui.yahooapis.com/combo?2.5.2/build/yahoo/yahoo-min.js&2.5.2/build/dom/dom-min.js&2.5.2/build/event/event-min.js&2.5.2/build/autocomplete/autocomplete-min.js"

YUI.add("loader", function(Y) {

var BASE = 'base', 
    CSS = 'css',
    JS = 'js',
    CSSRESET = 'cssreset',
    CSSFONTS = 'cssfonts',
    CSSGRIDS = 'cssgrids',
    CSSBASE = 'cssbase',
    CSS_AFTER = [CSSRESET, CSSFONTS, CSSGRIDS, 'cssreset-context', 'cssfonts-context', 'cssgrids-context'],
    YUI_CSS = ['reset', 'fonts', 'grids', 'base'],
    VERSION = '3.0.0pr1',
    ROOT = VERSION + '/build/',
    CONTEXT = '-context',
    META = {

    version: VERSION,

    root: ROOT,

    base: 'http://yui.yahooapis.com/' + ROOT,

    comboBase: 'http://yui.yahooapis.com/combo?',

    modules: {

       dom: {
            requires: ['event'],
            submodules: {
                'dom-base': {
                    requires: ['event']
                },
                'dom-style': {
                    requires: ['dom-base']

                },
                'dom-screen': {
                    requires: ['dom-base', 'dom-style']
                },
                selector: {
                    requires: ['dom-base']
                }
            }
        },

        node: {
            requires: ['dom'],
            submodules: {
                'node-base': {
                    requires: ['dom-base', 'selector']
                },
                'node-style': {
                    requires: ['dom-style', 'node-base']
                },
                'node-screen': {
                    requires: ['dom-screen', 'node-base']
                }
            }
        },

        anim: {
            requires: [BASE, 'node'],
            submodules: {
                'anim-base': {
                    requires: ['base', 'node-style']
                },
                'anim-color': {
                    requires: ['anim-base']
                },
                'anim-curve': {
                    requires: ['anim-xy']
                },
                'anim-easing': {
                },
                'anim-scroll': {
                    requires: ['anim-base']
                },
                'anim-xy': {
                    requires: ['anim-base', 'node-screen']
                },
                'anim-node-plugin': {
                     requires: ['node', 'anim-base']
                }
            }
        },

        attribute: { 
            requires: ['event']
        },

        base: {
            requires: ['attribute']
        },
        
        compat: { 
            requires: ['node']
        },
        
        cookie: { },

        // Note: CSS attributes are modified programmatically to reduce metadata size
        // cssbase: {
        //     after: CSS_AFTER
        // },

        // cssgrids: {
        //     requires: [CSSFONTS],
        //     optional: [CSSRESET]
        // },

        'dd':{
            submodules: {
                'dd-ddm-base': {
                    requires: ['node', BASE]
                }, 
                'dd-ddm':{
                    requires: ['dd-ddm-base']
                }, 
                'dd-ddm-drop':{
                    requires: ['dd-ddm']
                }, 
                'dd-drag':{
                    requires: ['dd-ddm-base']
                }, 
                'dd-drop':{
                    requires: ['dd-ddm-drop']
                }, 
                'dd-proxy':{
                    requires: ['dd-drag']
                }, 
                'dd-constrain':{
                    requires: ['dd-drag', 'dd-proxy']
                }, 
                'dd-plugin':{
                    requires: ['dd-drag'],
                    optional: ['dd-constrain', 'dd-proxy']
                },
                'dd-drop-plugin':{
                    requires: ['dd-drop']
                }
            }
        },

        dump: { },

        event: { 
            requires: ['oop']
        },

        get: { },
        
        io: { 
            requires: ['node']
        },

        json: {
            submodules: {
                'json-parse': {
                },

                'json-stringify': {
                }
            }
        },

        loader: { },
        
        oop: { 
            requires: ['yui-base']
        },

        queue: { },

        substitute: {
            optional: ['dump']
        },

        // Since YUI is required for everything else, it should not be specified as
        // a dependency.
        yui: {
            supersedes: ['yui-base', 'get', 'loader']
        },

        'yui-base': { }
    }
};

var _path = function(dir, file, type) {
    return dir + '/' + file + '-min.' + (type || CSS);
};

var _cssmeta = function() {
    var mods = META.modules;
    // modify the meta info for YUI CSS
    for (var i=0; i<YUI_CSS.length; i=i+1) {
        var bname = YUI_CSS[i],
            mname = CSS + bname;

        mods[mname] = {
            type: CSS,
            path: _path(mname, bname)
        };

        // define -context module
        var contextname = mname + CONTEXT;
        bname = bname + CONTEXT;

        mods[contextname] = {
            type: CSS,
            path: _path(mname, bname)
        };

        if (mname == CSSGRIDS) {
            mods[mname].requires = [CSSFONTS];
            mods[mname].optional = [CSSRESET];
            mods[contextname].requires = [CSSFONTS + CONTEXT];
            mods[contextname].optional = [CSSRESET + CONTEXT];
        } else if (mname == CSSBASE) {
            mods[mname].after = CSS_AFTER;
            mods[contextname].after = CSS_AFTER;
        }
    }
}();

Y.Env.meta = META;


    var L=Y.Lang, env=Y.Env,
        PROV = "_provides", SUPER = "_supersedes",
        REQ = "expanded";

    Y.Loader = function(o) {

        /**
         * Internal callback to handle multiple internal insert() calls
         * so that css is inserted prior to js
         * @property _internalCallback
         * @private
         */
        this._internalCallback = null;

        /**
         * Use the YUI environment listener to detect script load.  This
         * is only switched on for Safari 2.x and below.
         * @property _useYahooListener
         * @private
         */
        this._useYahooListener = false;

        /**
         * Callback that will be executed when the loader is finished
         * with an insert
         * @method onSuccess
         * @type function
         */
        this.onSuccess = null;

        /**
         * Callback that will be executed if there is a failure
         * @method onFailure
         * @type function
         */
        this.onFailure = null;

        /**
         * Callback executed each time a script or css file is loaded
         * @method onProgress
         * @type function
         */
        this.onProgress = null;

        /**
         * Callback that will be executed if a timeout occurs
         * @method onTimeout
         * @type function
         */
        this.onTimeout = null;

        /**
         * The execution context for all callbacks
         * @property context
         * @default {YUI} the YUI instance
         */
        this.context = Y;

        /**
         * Data that is passed to all callbacks
         * @property data
         */
        this.data = null;

        /**
         * Node reference or id where new nodes should be inserted before
         * @property insertBefore
         * @type string|HTMLElement
         */
        this.insertBefore = null;

        /**
         * The charset attribute for inserted nodes
         * @property charset
         * @type string
         * @default utf-8
         */
        this.charset = null;

        /**
         * The base directory.
         * @property base
         * @type string
         * @default http://yui.yahooapis.com/[YUI VERSION]/build/
         */
        this.base = Y.Env.meta.base;

        /**
         * Base path for the combo service
         * @property comboBase
         * @type string
         * @default http://yui.yahooapis.com/combo?
         */
        this.comboBase = Y.Env.meta.comboBase;

        /**
         * If configured, YUI JS resources will use the combo
         * handler
         * @property combine
         * @type boolean
         * @default true if a base dir isn't in the config
         */
        this.combine = (!(BASE in o));

        /**
         * Ignore modules registered on the YUI global
         * @property ignoreRegistered
         * @default false
         */
        this.ignoreRegistered = false;

        /**
         * Root path to prepend to module path for the combo
         * service
         * @property root
         * @type string
         * @default [YUI VERSION]/build/
         */
        this.root = Y.Env.meta.root;

        /**
         * Timeout value in milliseconds.  If set, this value will be used by
         * the get utility.  the timeout event will fire if
         * a timeout occurs.
         * @property timeout
         * @type int
         */
        this.timeout = 0;

        /**
         * A list of modules that should not be loaded, even if
         * they turn up in the dependency tree
         * @property ignore
         * @type string[]
         */
        this.ignore = null;

        /**
         * A list of modules that should always be loaded, even
         * if they have already been inserted into the page.
         * @property force
         * @type string[]
         */
        this.force = null;

        /**
         * Should we allow rollups
         * @property allowRollup
         * @type boolean
         * @default true
         */
        this.allowRollup = true;

        /**
         * A filter to apply to result urls.  This filter will modify the default
         * path for all modules.  The default path for the YUI library is the
         * minified version of the files (e.g., event-min.js).  The filter property
         * can be a predefined filter or a custom filter.  The valid predefined 
         * filters are:
         * <dl>
         *  <dt>DEBUG</dt>
         *  <dd>Selects the debug versions of the library (e.g., event-debug.js).
         *      This option will automatically include the logger widget</dd>
         *  <dt>RAW</dt>
         *  <dd>Selects the non-minified version of the library (e.g., event.js).</dd>
         * </dl>
         * You can also define a custom filter, which must be an object literal 
         * containing a search expression and a replace string:
         * <pre>
         *  myFilter: &#123; 
         *      'searchExp': "-min\\.js", 
         *      'replaceStr': "-debug.js"
         *  &#125;
         * </pre>
         * @property filter
         * @type string|{searchExp: string, replaceStr: string}
         */
        this.filter = null;

        /**
         * The list of requested modules
         * @property required
         * @type {string: boolean}
         */
        this.required = {};

        /**
         * The library metadata
         * @property moduleInfo
         */
        // this.moduleInfo = Y.merge(Y.Env.meta.moduleInfo);
        this.moduleInfo = {};
        
        var defaults = Y.Env.meta.modules;

        for (var i in defaults) {
            if (defaults.hasOwnProperty(i)) {
                this._internal = true;
                this.addModule(defaults[i], i);
                this._internal = false;
            }
        }

        /**
         * List of rollup files found in the library metadata
         * @property rollups
         */
        this.rollups = null;

        /**
         * Whether or not to load optional dependencies for 
         * the requested modules
         * @property loadOptional
         * @type boolean
         * @default false
         */
        this.loadOptional = false;

        /**
         * All of the derived dependencies in sorted order, which
         * will be populated when either calculate() or insert()
         * is called
         * @property sorted
         * @type string[]
         */
        this.sorted = [];

        /**
         * Set when beginning to compute the dependency tree. 
         * Composed of what YUI reports to be loaded combined
         * with what has been loaded by the tool
         * @propery loaded
         * @type {string: boolean}
         */
        this.loaded = {};

        /**
         * A list of modules to attach to the YUI instance when complete.
         * If not supplied, the sorted list of dependencies are applied.
         * @property attaching
         */
        this.attaching = null;

        /**
         * Flag to indicate the dependency tree needs to be recomputed
         * if insert is called again.
         * @property dirty
         * @type boolean
         * @default true
         */
        this.dirty = true;

        /**
         * List of modules inserted by the utility
         * @property inserted
         * @type {string: boolean}
         */
        this.inserted = {};

        this.skipped = {};

        // Y.on('yui:load', this.loadNext, this);

        this._config(o);

    };

    Y.Loader.prototype = {

        FILTERS: {
            RAW: { 
                'searchExp': "-min\\.js", 
                'replaceStr': ".js"
            },
            DEBUG: { 
                'searchExp': "-min\\.js", 
                'replaceStr': "-debug.js"
            }
        },

        _config: function(o) {

            // apply config values
            if (o) {
                for (var i in o) {
                    var val = o[i];
                    if (o.hasOwnProperty(i)) {
                        if (i == 'require') {
                            this.require(val);
                        // support the old callback syntax
                        // } else if (i.indexOf('on') === 0) {
                            // this.subscribe(i.substr(2).toLowerCase(), o[i], o.context || this);
                        } else if (i == 'modules') {
                            // add a hash of module definitions
                            for (var j in val) {
                                this.addModule(val[j], j);
                            }
                        } else {
                            this[i] = val;
                        }
                    }
                }
            }

            // fix filter
            var f = this.filter;

            if (L.isString(f)) {

                f = f.toUpperCase();

                this.filterName = f;

                // the logger must be available in order to use the debug
                // versions of the library
                // @TODO review when logreader is available
                // if (f === "DEBUG") {
                //     this.require("log");
                // }

                this.filter = this.FILTERS[f];
            }

        },

        /** Add a new module to the component metadata.         
         * <dl>
         *     <dt>name:</dt>       <dd>required, the component name</dd>
         *     <dt>type:</dt>       <dd>required, the component type (js or css)</dd>
         *     <dt>path:</dt>       <dd>required, the path to the script from "base"</dd>
         *     <dt>requires:</dt>   <dd>array of modules required by this component</dd>
         *     <dt>optional:</dt>   <dd>array of optional modules for this component</dd>
         *     <dt>supersedes:</dt> <dd>array of the modules this component replaces</dd>
         *     <dt>after:</dt>      <dd>array of modules the components which, if present, should be sorted above this one</dd>
         *     <dt>rollup:</dt>     <dd>the number of superseded modules required for automatic rollup</dd>
         *     <dt>fullpath:</dt>   <dd>If fullpath is specified, this is used instead of the configured base + path</dd>
         *     <dt>skinnable:</dt>  <dd>flag to determine if skin assets should automatically be pulled in</dd>
         *     <dt>submodules:</dt> <dd>a has of submodules</dd>
         * </dl>
         * @method addModule
         * @param o An object containing the module data
         * @param name the module name (optional), required if not in the module data
         * @return {boolean} true if the module was added, false if 
         * the object passed in did not provide all required attributes
         */
        addModule: function(o, name) {

            name = name || o.name;
            o.name = name;

            if (!o || !o.name) {
                return false;
            }

            if (!o.type) {
                o.type = JS;
            }

            if (!o.path && !o.fullpath) {
                // o.path = name + "/" + name + "-min." + o.type;
                o.path = _path(name, name, o.type);
            }

            o.ext = ('ext' in o) ? o.ext : (this._internal) ? false : true;
            o.requires = o.requires || [];


            // Handle submodule logic
            var subs = o.submodules;
            if (subs) {
                var sup = [], l=0;

                for (var i in subs) {
                    var s = subs[i];
                    s.path = _path(name, i, o.type);
                    this.addModule(s, i);
                    sup.push(i);
                    l++;
                }

                o.supersedes = sup;
                o.rollup = Math.min(l-1, 4);
            }

            this.moduleInfo[name] = o;
            this.dirty = true;

            return o;
        },

        /**
         * Add a requirement for one or more module
         * @method require
         * @param what {string[] | string*} the modules to load
         */
        require: function(what) {
            var a = (typeof what === "string") ? arguments : what;
            this.dirty = true;
            Y.mix(this.required, Y.Array.hash(a));
        },

        /**
         * Returns an object containing properties for all modules required
         * in order to load the requested module
         * @method getRequires
         * @param mod The module definition from moduleInfo
         */
        getRequires: function(mod) {

            if (!mod) {
                return [];
            }

            if (!this.dirty && mod.expanded) {
                return mod.expanded;
            }

            var i, d=[], r=mod.requires, o=mod.optional, 
                info=this.moduleInfo, m, j, add;

            for (i=0; i<r.length; i=i+1) {
                d.push(r[i]);
                m = this.getModule(r[i]);
                add = this.getRequires(m);
                for (j=0;j<add.length;j=j+1) {
                    d.push(add[j]);
                }
            }

            // get the requirements from superseded modules, if any
            r=mod.supersedes;
            if (r) {
                for (i=0; i<r.length; i=i+1) {
                    d.push(r[i]);
                    m = this.getModule(r[i]);
                    add = this.getRequires(m);
                    for (j=0;j<add.length;j=j+1) {
                        d.push(add[j]);
                    }
                }
            }

            if (o && this.loadOptional) {
                for (i=0; i<o.length; i=i+1) {
                    d.push(o[i]);
                    add = this.getRequires(info[o[i]]);
                    for (j=0;j<add.length;j=j+1) {
                        d.push(add[j]);
                    }
                }
            }

            mod.expanded = Y.Object.keys(Y.Array.hash(d));


            return mod.expanded;
        },


        /**
         * Returns an object literal of the modules the supplied module satisfies
         * @method getProvides
         * @param name{string} The name of the module
         * @param notMe {string} don't add this module name, only include superseded modules
         * @return what this module provides
         */
        getProvides: function(name, notMe) {
            var addMe = !(notMe), ckey = (addMe) ? PROV : SUPER,
                m = this.getModule(name), o = {};

            if (!m) {
                return o;
            }

            if (m[ckey]) {
                return m[ckey];
            }

            var s = m.supersedes, done={}, me = this;

            // use worker to break cycles
            var add = function(mm) {
                if (!done[mm]) {
                    done[mm] = true;
                    // we always want the return value normal behavior 
                    // (provides) for superseded modules.
                    Y.mix(o, me.getProvides(mm));
                } 
                
                // else {
                // }
            };

            // calculate superseded modules
            if (s) {
                for (var i=0; i<s.length; i=i+1) {
                    add(s[i]);
                }
            }

            // supersedes cache
            m[SUPER] = o;
            // provides cache
            m[PROV] = Y.merge(o);
            m[PROV][name] = true;


            return m[ckey];
        },


        /**
         * Calculates the dependency tree, the result is stored in the sorted 
         * property
         * @method calculate
         * @param o optional options object
         */
        calculate: function(o) {
            if (o || this.dirty) {
                this._config(o);
                this._setup();
                this._explode();
                if (this.allowRollup) {
                    this._rollup();
                }
                this._reduce();
                this._sort();


                this.dirty = false;
            }
        },

        /**
         * Investigates the current YUI configuration on the page.  By default,
         * modules already detected will not be loaded again unless a force
         * option is encountered.  Called by calculate()
         * @method _setup
         * @private
         */
        _setup: function() {

            var info = this.moduleInfo, name, i, j;

            var l = Y.merge(this.inserted); // shallow clone

            // available modules
            if (!this.ignoreRegistered) {
                Y.mix(l, YUI.Env.mods);
            }
            

            // add the ignore list to the list of loaded packages
            if (this.ignore) {
                // OU.appendArray(l, this.ignore);
                Y.mix(l, Y.Array.hash(this.ignore));
            }

            // expand the list to include superseded modules
            for (j in l) {
                if (l.hasOwnProperty(j)) {
                    Y.mix(l, this.getProvides(j));
                }
            }

            // remove modules on the force list from the loaded list
            if (this.force) {
                for (i=0; i<this.force.length; i=i+1) {
                    if (this.force[i] in l) {
                        delete l[this.force[i]];
                    }
                }
            }


            this.loaded = l;

        },
        

        /**
         * Inspects the required modules list looking for additional 
         * dependencies.  Expands the required list to include all 
         * required modules.  Called by calculate()
         * @method _explode
         * @private
         */
        _explode: function() {

            var r=this.required, i, mod;

            for (i in r) {
                if (r.hasOwnProperty(i)) {
                    mod = this.getModule(i);

                    var req = this.getRequires(mod);

                    if (req) {
                        Y.mix(r, Y.Array.hash(req));
                    }
                }
            }
        },

        getModule: function(name) {

            var m = this.moduleInfo[name];

            // create the default module
            // if (!m) {
                // m = this.addModule({ext: false}, name);
            // }

            return m;
        },

        /**
         * Look for rollup packages to determine if all of the modules a
         * rollup supersedes are required.  If so, include the rollup to
         * help reduce the total number of connections required.  Called
         * by calculate()
         * @method _rollup
         * @private
         */
        _rollup: function() {
            var i, j, m, s, rollups={}, r=this.required, roll,
                info = this.moduleInfo;

            // find and cache rollup modules
            if (this.dirty || !this.rollups) {
                for (i in info) {
                    if (info.hasOwnProperty(i)) {
                        m = this.getModule(i);
                        // if (m && m.rollup && m.supersedes) {
                        if (m && m.rollup) {
                            rollups[i] = m;
                        }
                    }
                }

                this.rollups = rollups;
            }

            // make as many passes as needed to pick up rollup rollups
            for (;;) {
                var rolled = false;

                // go through the rollup candidates
                for (i in rollups) { 

                    // there can be only one
                    if (!r[i] && !this.loaded[i]) {
                        m =this.getModule(i); s = m.supersedes ||[]; roll=false;

                        if (!m.rollup) {
                            continue;
                        }

                        var c=0;

                        // check the threshold
                        for (j=0;j<s.length;j=j+1) {

                            // if the superseded module is loaded, we can't load the rollup
                            // if (this.loaded[s[j]] && (!_Y.dupsAllowed[s[j]])) {
                            if (this.loaded[s[j]]) {
                                roll = false;
                                break;
                            // increment the counter if this module is required.  if we are
                            // beyond the rollup threshold, we will use the rollup module
                            } else if (r[s[j]]) {
                                c++;
                                roll = (c >= m.rollup);
                                if (roll) {
                                    break;
                                }
                            }
                        }

                        if (roll) {
                            // add the rollup
                            r[i] = true;
                            rolled = true;

                            // expand the rollup's dependencies
                            this.getRequires(m);
                        }
                    }
                }

                // if we made it here w/o rolling up something, we are done
                if (!rolled) {
                    break;
                }
            }
        },

        /**
         * Remove superceded modules and loaded modules.  Called by
         * calculate() after we have the mega list of all dependencies
         * @method _reduce
         * @private
         */
        _reduce: function() {

            var i, j, s, m, r=this.required;
            for (i in r) {

                // remove if already loaded
                if (i in this.loaded) { 
                    delete r[i];

                // remove anything this module supersedes
                } else {

                     m = this.getModule(i);
                     s = m && m.supersedes;
                     if (s) {
                         for (j=0; j<s.length; j=j+1) {
                             if (s[j] in r) {
                                 delete r[s[j]];
                             }
                         }
                     }
                }
            }
        },

        _attach: function() {

            // this is the full list of items the YUI needs attached,
            // which is needed if some dependencies are already on
            // the page without their dependencies.
            if (this.attaching) {
                Y._attach(this.attaching);
            } else {
                Y._attach(this.sorted);
            }

            this._pushEvents();

        },

        _onSuccess: function() {

            this._attach();

            for (var i in this.skipped) {
                delete this.inserted[i];
            }

            this.skipped = {};

            // this.fire('success', {
            //     data: this.data
            // });

            var f = this.onSuccess;
            if (f) {
                f.call(this.context, {
                    msg: 'success',
                    data: this.data,
                    success: true
                });
            }

        },

        _onFailure: function(msg) {
            this._attach();
            // this.fire('failure', {
            //     msg: 'operation failed: ' + msg,
            //     data: this.data
            // });

            var f = this.onFailure;
            if (f) {
                f.call(this.context, {
                    msg: 'failure: ' + msg,
                    data: this.data,
                    success: false
                });
            }
        },

        _onTimeout: function() {
            this._attach();

            // this.fire('timeout', {
            //     data: this.data
            // });

            var f = this.onTimeout;
            if (f) {
                f.call(this.context, {
                    msg: 'timeout',
                    data: this.data,
                    success: false
                });
            }
        },
        
        /**
         * Sorts the dependency tree.  The last step of calculate()
         * @method _sort
         * @private
         */
        _sort: function() {
            // create an indexed list
            var s=Y.Object.keys(this.required), info=this.moduleInfo, loaded=this.loaded,
                me = this;

            // returns true if b is not loaded, and is required
            // directly or by means of modules it supersedes.
            var requires = function(aa, bb) {

                var mm=info[aa];

                if (loaded[bb] || !mm) {
                    return false;
                }

                var ii, rr = mm.expanded, 
                    after = mm.after, other=info[bb];

                // check if this module requires the other directly
                if (rr && Y.Array.indexOf(rr, bb) > -1) {
                    return true;
                }

                // check if this module should be sorted after the other
                if (after && Y.Array.indexOf(after, bb) > -1) {
                    return true;
                }

                // check if this module requires one the other supersedes
                var ss=info[bb] && info[bb].supersedes;
                if (ss) {
                    for (ii=0; ii<ss.length; ii=ii+1) {
                        if (requires(aa, ss[ii])) {
                            return true;
                        }
                    }
                }

                // external css files should be sorted below yui css
                if (mm.ext && mm.type == CSS && (!other.ext)) {
                    return true;
                }

                return false;
            };

            // pointer to the first unsorted item
            var p=0; 

            // keep going until we make a pass without moving anything
            for (;;) {
               
                var l=s.length, a, b, j, k, moved=false;

                // start the loop after items that are already sorted
                for (j=p; j<l; j=j+1) {

                    // check the next module on the list to see if its
                    // dependencies have been met
                    a = s[j];

                    // check everything below current item and move if we
                    // find a requirement for the current item
                    for (k=j+1; k<l; k=k+1) {
                        if (requires(a, s[k])) {

                            // extract the dependency so we can move it up
                            b = s.splice(k, 1);

                            // insert the dependency above the item that 
                            // requires it
                            s.splice(j, 0, b[0]);

                            moved = true;
                            break;
                        }
                    }

                    // jump out of loop if we moved something
                    if (moved) {
                        break;
                    // this item is sorted, move our pointer and keep going
                    } else {
                        p = p + 1;
                    }
                }

                // when we make it here and moved is false, we are 
                // finished sorting
                if (!moved) {
                    break;
                }

            }

            this.sorted = s;
        },

        /**
         * inserts the requested modules and their dependencies.  
         * <code>type</code> can be "js" or "css".  Both script and 
         * css are inserted if type is not provided.
         * @method insert
         * @param o optional options object
         * @param type {string} the type of dependency to insert
         */
        insert: function(o, type) {


            // build the dependency list
            this.calculate(o);

            if (!type) {
                var self = this;
                this._internalCallback = function() {
                            self._internalCallback = null;
                            self.insert(null, JS);
                        };
                this.insert(null, CSS);
                return;
            }

            // set a flag to indicate the load has started
            this._loading = true;

            // flag to indicate we are done with the combo service
            // and any additional files will need to be loaded
            // individually
            this._combineComplete = false;

            // keep the loadType (js, css or undefined) cached
            this.loadType = type;

            // start the load
            this.loadNext();

        },

        /**
         * Executed every time a module is loaded, and if we are in a load
         * cycle, we attempt to load the next script.  Public so that it
         * is possible to call this if using a method other than
         * Y.register to determine when scripts are fully loaded
         * @method loadNext
         * @param mname {string} optional the name of the module that has
         * been loaded (which is usually why it is time to load the next
         * one)
         */
        loadNext: function(mname) {

            // It is possible that this function is executed due to something
            // else one the page loading a YUI module.  Only react when we
            // are actively loading something
            if (!this._loading) {
                return;
            }

            var s, len, i, m, url, self=this;

            // @TODO this will need to handle the two phase insert when
            // CSS support is added
            if (this.loadType !== CSS && this.combine && (!this._combineComplete)) {

                this._combining = []; 
                s=this.sorted;
                len=s.length;
                url=this.comboBase;

                for (i=0; i<len; i=i+1) {
                    m = this.getModule(s[i]);
// @TODO we can't combine CSS yet until we deliver files with absolute paths to the assets
                    // Do not try to combine non-yui JS
                    if (m.type == JS && !m.ext) {
                        url += this.root + m.path;
                        if (i < len-1) {
                            url += '&';
                        }

                        this._combining.push(s[i]);
                    }
                }

                if (this._combining.length) {


                    var callback=function(o) {
                        this._combineComplete = true;


                        var c=this._combining, len=c.length, i, m;
                        for (i=0; i<len; i=i+1) {
                            this.inserted[c[i]] = true;
                        }

                        this.loadNext(o.data);
                    };

                    // @TODO get rid of the redundant Get code
                    Y.Get.script(url, {
                        data: this._loading,
                        onSuccess: callback,
                        onFailure: this._onFailure,
                        onTimeout: this._onTimeout,
                        insertBefore: this.insertBefore,
                        charset: this.charset,
                        timeout: this.timeout,
                        context: self 
                    });

                    return;

                } else {
                    this._combineComplete = true;
                }
            }

            if (mname) {

                // if the module that was just loaded isn't what we were expecting,
                // continue to wait
                if (mname !== this._loading) {
                    return;
                }


                // The global handler that is called when each module is loaded
                // will pass that module name to this function.  Storing this
                // data to avoid loading the same module multiple times
                this.inserted[mname] = true;

                // this.fire('progress', {
                //     name: mname,
                //     data: this.data
                // });
                if (this.onProgress) {
                    this.onProgress.call(this.context, {
                            name: mname,
                            data: this.data
                        });
                }


            }

            s=this.sorted;
            len=s.length;

            for (i=0; i<len; i=i+1) {

                // this.inserted keeps track of what the loader has loaded.
                // move on if this item is done.
                if (s[i] in this.inserted) {
                    continue;
                }

                // Because rollups will cause multiple load notifications
                // from Y, loadNext may be called multiple times for
                // the same module when loading a rollup.  We can safely
                // skip the subsequent requests
                if (s[i] === this._loading) {
                    return;
                }

                // log("inserting " + s[i]);
                m = this.getModule(s[i]);

                if (!m) {

                    var msg = "Undefined module " + s[i] + " skipped";
                    this.inserted[s[i]] = true;
                    this.skipped[s[i]] = true;
                    continue;

                    // this.fire('failure', {
                        // msg: msg,
                        // data: this.data
                    // });
                }


                // The load type is stored to offer the possibility to load
                // the css separately from the script.
                if (!this.loadType || this.loadType === m.type) {
                    this._loading = s[i];

                    var fn=(m.type === CSS) ? Y.Get.css : Y.Get.script,
                        onsuccess=function(o) {
                            self.loadNext(o.data);
                        };
                        
                    url=m.fullpath || this._url(m.path, s[i]);
                    self=this; 

                    fn(url, {
                        data: s[i],
                        onSuccess: onsuccess,
                        insertBefore: this.insertBefore,
                        charset: this.charset,
                        onFailure: this._onFailure,
                        onTimeout: this._onTimeout,
                        timeout: this.timeout,
                        context: self 
                    });

                    return;
                }
            }

            // we are finished
            this._loading = null;

            // internal callback for loading css first
            if (this._internalCallback) {

                var f = this._internalCallback;
                this._internalCallback = null;
                f.call(this);

            // } else if (this.onSuccess) {
            } else {

                // call Y.use passing this instance. Y will use the sorted
                // dependency list.

                this._onSuccess();

            }

        },

        /**
         * In IE, the onAvailable/onDOMReady events need help when Event is
         * loaded dynamically
         * @method _pushEvents
         * @param {Function} optional function reference
         * @private
         */
        _pushEvents: function() {
            if (Y.Event) {
                Y.Event._load();
            }
        },

        /**
         * Generates the full url for a module
         * method _url
         * @param path {string} the path fragment
         * @return {string} the full url
         * @private
         */
        _url: function(path, name) {
            
            var u = (this.base || "") + path, 
                f = this.filter;

            if (f) {
                var useFilter = true;

                if (this.filterName == "DEBUG") {
                
                    var self = this, 
                        exc = self.logExclude,
                        inc = self.logInclude;
                    if (inc && !(name in inc)) {
                        useFilter = false;
                    } else if (exc && (name in exc)) {
                        useFilter = false;
                    }

                }
                
                if (useFilter) {
                    u = u.replace(new RegExp(f.searchExp), f.replaceStr);
                }
            }


            return u;
        }

    };

    // Y.augment(Y.Loader, Y.Event.Target);

}, "3.0.0pr1");
