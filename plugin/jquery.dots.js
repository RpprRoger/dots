/*
 *  Project: clearInput
 *  Description:
 *  Author:
 *  License:
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "dots",
        fullName = "plugin_" + pluginName,
        defaults = {
            char: '.',
            count: 3,
            speed: 500,
            start: true
        };

    function Plugin( element, options ) {
        this.options = $.extend({}, defaults, options);

        this.element = $(element);

        this.init();

        return this;
    }

    Plugin.prototype = {

        next: (function() {
            var current = 0;
            return function() {
                return current >= this.options.count ? ((current = 0) || current) : ++current;
            };
        })(),
        init: function() {
            this.dots = $('<span>').appendTo( this.element );
            this.options.start && this.start();
        },
        start: function() {
            var self = this;

            function set() {
                return setTimeout(function() {
                    self.dots.text( self.charLen( self.next() ) );
                    self.timeout = set();
                }, self.options.speed);
            }

            return set();
        },
        stop: function() {
            if( this.timeout ) {
                this.dots.empty();
                clearTimeout( this.timeout );
            }
        },
        charLen: function( len ) {
            return $.map(new Array( len ), $.proxy(function() {
                return this.options.char;
            }, this)).join('');
        },
        applyOpts: function( options ) {
            if( options === false ) {
                this.stop();
            } else if( options === true ) {
                this.start();
            } else {
                $.extend(this.options, options);
            }
        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, fullName) ) {
                $.data(this, fullName, new Plugin( this, options ));
            } else {
                $.data(this, fullName).applyOpts( options );
            }
        });
    };

})( jQuery, window, document );