/**
 * AXMenu v1.0 - jQuery menu plugin.
 * Copyright (c) 2013 ActiveAxon.
 * http://www.activeaxon.com
 * info@activeaxon.com
 */
;
(function($, window, document, undefined) {


    // Create the defaults once
    var pluginName = "AXMenu",
            defaults = {
        showArrowIcon: true,
        firstLevelArrowIcon: '<i class="icon-chevron-down"></i>',
        menuArrowIcon: '<i class="icon-caret-up icon-arrow-menu"></i>',
        subMenuArrowIcon: '<i class="icon-chevron-right icon-arrow-submenu"></i>',
        activeLinkClass: 'activelink'
    };

    // The actual plugin constructor
    function AXMenu(element, options) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;
        this.$el = $(element);

        this.init();
        this.$timeoutRef = new Array();

    }

    AXMenu.prototype = {
        init: function() {

            this.currentPageLink = window.location.href;
            this.pageName = getPageName(this.currentPageLink);
            this.addFirstLevelArrowIcon(this.$el, this.options);

            this.startEventListener(this.$el, this.options);
            //add the arrow between the menubox
            this.addArrowIcon(this.$el, this.options);
            this.addSubArrowIcon(this.$el, this.options);
            this.setSelectedElementLink(this.$el);

        },
        startEventListener: function(el, options) {

            var $that = this;

            var currentUrl = window.location.href;

            /*
             For every subli element attach mouse enter event
             */
            el.find('li').mouseenter(function() {

                var $ul = $(this).find('ul:first').first(),
                        $li = $(this).first(),
                        $ulNext;

                //this is used for handling menu icon
                $ulNext = $ul.next() ? $ul.next().first() : false;

                // attach unique id for each UL element
                var $subMenuid;
                if (!$ul.data('zeina-id')) {
                    $ul.data('zeina-id', getUID());
                }
                $subMenuid = $ul.data('zeina-id');

                /* Clear timeouts & events & z-index */
                window.clearTimeout($that.$timeoutRef[ $subMenuid ])
                $li.unbind('mouseleave');

                el.find('ul').css('z-index', 1);

                // if its has sub-menu
                if ($ul[0] && $ul[0].nodeName.toLowerCase() === 'ul') {

                    /* Show Menu & Arrow */
                    $ul.addClass('show-sub-menu');
                    $ul.css('z-index', 2);
                    if ($ulNext) {
                        $ulNext.addClass('show-sub-menu');
                    }

                    /* Handle Mouse Leave Action */
                    $li.mouseleave(function() {

                        $ul.removeClass('show-sub-menu')
                        if ($ulNext[0] && $ulNext[0].nodeName.toLowerCase() === 'i') {
                            $ulNext.removeClass('show-sub-menu');
                        }
                    });

                }
            });
        },
        /**
         *  Add icon for 1st level menus.
         *
         * @param el
         * @param options
         */
        addArrowIcon: function(el, options) {
            var $opt = this.options;
            if (options['showArrowIcon'] === true) {
                el.find('>li').each(function() {
                    $(this).find('ul:first').each(function() {
                        $(this).parent().append($opt['menuArrowIcon']);
                    });
                });
            }
        },
        /**
         *  Add icon for 1st level menus.
         *
         * @param el
         * @param options
         */
        addSubArrowIcon: function(el, options) {

            var $opt = this.options,
                    $that = this;
            if (options['showArrowIcon'] === true) {

                el.find('ul a').each(function() {

                    //cache element
                    var $this = $(this);

                    //set selected link
                    //$that.setSelectedElementLink( $this  );

                    if ($this.next()[0] && $this.next()[0].nodeName.toLowerCase() === 'ul') {
                        $this.append($opt['subMenuArrowIcon']);
                    }
                });
            }
        },
        /**
         *  Add first level icon
         *
         * @param el
         * @param options
         */
        addFirstLevelArrowIcon: function(el, options) {

            var $opt = this.options,
                    $that = this;
            if (options['showArrowIcon'] === true) {

                el.find('>li>a').each(function() {

                    //cache element
                    var $this = $(this);

                    //set selected link
                    //$that.setSelectedElementLink( $this  );

                    if ($this.next()[0] && $this.next()[0].nodeName.toLowerCase() === 'ul') {
                        $this.find('span.label-nav').append($opt['firstLevelArrowIcon']);
                    }

                });

            }
        },
        /**
         * Set selected element.
         *
         * @param el
         * @param options
         */
        setSelectedElementLink: function(el) {

            var $opt = this.options, link, linkRegex, $this, $that = this;
            ;
            var found = false;
            $(el).find('a').each(function() {

                $this = $(this);
                link = $this.attr('href');
                //linkRegex = new RegExp( escapeRegExp(link) );

                if ($.trim(link) != '' && $that.pageName == getPageName(link)) {
                    found = true;
                    $this.addClass($that.options['activeLinkClass']);
                    /* Set selected links ( parents links ) */
                    $this.parentsUntil(el).each(function() {
                        $(this).find('>a').addClass($that.options['activeLinkClass']);
                    });
                }

            });


        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new AXMenu(this, options));
            }
        });
    };




    /**
     * This function is used for return unique string using for tracking element timeouts.
     * @returns {string}
     */
    var i = 0;
    function getUID() {
        return 'U' + (++i);
    }

    /**
     * getPageName
     *
     * @returns {string}
     */
    function getPageName(link) {
        var segments = link.split("/");
        return segments[ segments.length - 1 ];
    }

})(jQuery, window, document);
(function($) {
    $.fn.visible = function(partial) {

        var $t = $(this),
                $w = $(window),
                viewTop = $w.scrollTop(),
                viewBottom = viewTop + $w.height(),
                _top = $t.offset().top,
                _bottom = _top + $t.height(),
                compareTop = partial === true ? _bottom : _top,
                compareBottom = partial === true ? _top : _bottom;

        return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

    };

})(jQuery);

$(window).scroll(function(event) {
    $(".social-media-icon").each(function(i, el) {
        var el = $(el);
        setTimeout(function() {
            if (el.visible(true)) {
                el.addClass('bounceIn');
            }
        }, (i + 1) * 100);

    });
});
/**
 * Zeina Animation Engine
 * ActiveAxon 2013(c)
 */
function zEng() {
    var delay, speed;
    $('.animated').each(function() {
        var el = $(this);
        //console.log( elements[i] , i );
        if (el.visible(true)) {

            if (el.data('animtype') == 'animate-progress') {

                el.css('opacity', 1);
                el.css('visibility', 'visible');
                el.find('.team-member-progress-bar').css('width', el.data('progress-to'));
                el.find('.team-member-progress-bar-value').html(el.data('progress-to'));
                return;
            }

            delay = el.data('animdelay');
            if (!delay) {
                delay = 0;
            }

            el.css('-webkit-animation-delay', delay);
            el.css('-moz-animation-delay', delay);
            el.css('-o-animation-delay', delay);
            el.css('animation-delay', delay);

            speed = el.data('animspeed');

            if (!speed) {
                speed = 0.5;
            }

            el.css('-webkit-animation-duration', speed);
            el.css('-moz-animation-duration', speed);
            el.css('-o-animation-duration', speed);
            el.css('animation-duration', speed);


            el.addClass(el.data('animtype') ? el.data('animtype') : 'animate-opacity');
            el.addClass('animatedVisi');
            //que.push(this);
        }
        else if (el.data('animrepeat') == '1') {
            el.removeClass(el.data('animtype'));
            el.removeClass('animatedVisi');
        }
    });
}

$(window).ready(zEng);
$(window).load(zEng);


$(window).scroll(function(event) {
    zEng();
});

/*
 * Viewport - jQuery selectors for finding elements in viewport
 *
 * Copyright (c) 2008-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *  http://www.appelsiini.net/projects/viewport
 *
 */
(function($) {



    /**
     * Copyright 2012, Digital Fusion
     * Licensed under the MIT license.
     * http://teamdf.com/jquery-plugins/license/
     *
     * @author Sam Sehnert
     * @desc A small plugin that checks whether elements are within
     *     the user visible viewport of a web browser.
     *     only accounts for vertical position, not horizontal.
     */

    $.fn.visible = function(partial) {

        var $t = $(this),
                $w = $(window),
                viewTop = $w.scrollTop(),
                viewBottom = viewTop + $w.height(),
                _top = $t.offset().top,
                _bottom = _top + $t.height(),
                compareTop = partial === true ? _bottom : _top,
                compareBottom = partial === true ? _top : _bottom;

        return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

    };




})(jQuery);/* HTML 5 Element Fix */
document.createElement('header');
document.createElement('nav');
document.createElement('section');
document.createElement('article');
document.createElement('aside');
document.createElement('footer');


/* Object create for IE8 */
if (!Object.create) {
    Object.create = (function() {
        function F() {
        }

        return function(o) {
            if (arguments.length != 1) {
                throw new Error('Object.create implementation only accepts one parameter.');
            }
            F.prototype = o
            return new F()
        }
    })()
}
/*
 * jQuery.appear
 * https://github.com/bas2k/jquery.appear/
 * http://code.google.com/p/jquery-appear/
 *
 * Copyright (c) 2009 Michael Hixson
 * Copyright (c) 2012 Alexander Brovikov
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 */
(function($) {
    $.fn.appear = function(fn, options) {

        var settings = $.extend({
            //arbitrary data to pass to fn
            data: undefined,
            //call fn only on the first appear?
            one: true,
            // X & Y accuracy
            accX: 0,
            accY: 0

        }, options);

        return this.each(function() {

            var t = $(this);

            //whether the element is currently visible
            t.appeared = false;

            if (!fn) {

                //trigger the custom event
                t.trigger('appear', settings.data);
                return;
            }

            var w = $(window);

            //fires the appear event when appropriate
            var check = function() {

                //is the element hidden?
                if (!t.is(':visible')) {

                    //it became hidden
                    t.appeared = false;
                    return;
                }

                //is the element inside the visible window?
                var a = w.scrollLeft();
                var b = w.scrollTop();
                var o = t.offset();
                var x = o.left;
                var y = o.top;

                var ax = settings.accX;
                var ay = settings.accY;
                var th = t.height();
                var wh = w.height();
                var tw = t.width();
                var ww = w.width();

                if (y + th + ay >= b &&
                        y <= b + wh + ay &&
                        x + tw + ax >= a &&
                        x <= a + ww + ax) {

                    //trigger the custom event
                    if (!t.appeared)
                        t.trigger('appear', settings.data);

                } else {

                    //it scrolled out of view
                    t.appeared = false;
                }
            };

            //create a modified fn with some additional logic
            var modifiedFn = function() {

                //mark the element as visible
                t.appeared = true;

                //is this supposed to happen only once?
                if (settings.one) {

                    //remove the check
                    w.unbind('scroll', check);
                    var i = $.inArray(check, $.fn.appear.checks);
                    if (i >= 0)
                        $.fn.appear.checks.splice(i, 1);
                }

                //trigger the original fn
                fn.apply(this, arguments);
            };

            //bind the modified fn to the element
            if (settings.one)
                t.one('appear', settings.data, modifiedFn);
            else
                t.bind('appear', settings.data, modifiedFn);

            //check whenever the window scrolls
            w.scroll(check);

            //check whenever the dom changes
            $.fn.appear.checks.push(check);

            //check now
            (check)();
        });
    };

    //keep a queue of appearance checks
    $.extend($.fn.appear, {
        checks: [],
        timeout: null,
        //process the queue
        checkAll: function() {
            var length = $.fn.appear.checks.length;
            if (length > 0)
                while (length--)
                    ($.fn.appear.checks[length])();
        },
        //check the queue asynchronously
        run: function() {
            if ($.fn.appear.timeout)
                clearTimeout($.fn.appear.timeout);
            $.fn.appear.timeout = setTimeout($.fn.appear.checkAll, 20);
        }
    });

    //run checks when these methods are called
    $.each(['append', 'prepend', 'after', 'before', 'attr',
        'removeAttr', 'addClass', 'removeClass', 'toggleClass',
        'remove', 'css', 'show', 'hide'], function(i, n) {
        var old = $.fn[n];
        if (old) {
            $.fn[n] = function() {
                var r = old.apply(this, arguments);
                $.fn.appear.run();
                return r;
            }
        }
    });

})(jQuery);
/**
 * jQuery BASE64 functions
 *
 * 	<code>
 * 		Encodes the given data with base64.
 * 		String jQuery.base64Encode ( String str )
 *		<br />
 * 		Decodes a base64 encoded data.
 * 		String jQuery.base64Decode ( String str )
 * 	</code>
 *
 * Encodes and Decodes the given data in base64.
 * This encoding is designed to make binary data survive transport through transport layers that are not 8-bit clean, such as mail bodies.
 * Base64-encoded data takes about 33% more space than the original data.
 * This javascript code is used to encode / decode data using base64 (this encoding is designed to make binary data survive transport through transport layers that are not 8-bit clean). Script is fully compatible with UTF-8 encoding. You can use base64 encoded data as simple encryption mechanism.
 * If you plan using UTF-8 encoding in your project don't forget to set the page encoding to UTF-8 (Content-Type meta tag).
 * This function orginally get from the WebToolkit and rewrite for using as the jQuery plugin.
 *
 * Example
 * 	Code
 * 		<code>
 * 			jQuery.base64Encode("I'm Persian.");
 * 		</code>
 * 	Result
 * 		<code>
 * 			"SSdtIFBlcnNpYW4u"
 * 		</code>
 * 	Code
 * 		<code>
 * 			jQuery.base64Decode("SSdtIFBlcnNpYW4u");
 * 		</code>
 * 	Result
 * 		<code>
 * 			"I'm Persian."
 * 		</code>
 *
 * @alias Muhammad Hussein Fattahizadeh < muhammad [AT] semnanweb [DOT] com >
 * @link http://www.semnanweb.com/jquery-plugin/base64.html
 * @see http://www.webtoolkit.info/
 * @license http://www.gnu.org/licenses/gpl.html [GNU General Public License]
 * @param {jQuery} {base64Encode:function(input))
 * @param {jQuery} {base64Decode:function(input))
 * @return string
 */

(function(jQuery) {

    var keyString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var uTF8Encode = function(string) {
        string = string.replace(/\x0d\x0a/g, "\x0a");
        var output = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                output += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128);
            } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128);
            }
        }
        return output;
    };

    var uTF8Decode = function(input) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < input.length) {
            c = input.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = input.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = input.charCodeAt(i + 1);
                c3 = input.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }

    jQuery.extend({
        base64Encode: function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = uTF8Encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output + keyString.charAt(enc1) + keyString.charAt(enc2) + keyString.charAt(enc3) + keyString.charAt(enc4);
            }
            return output;
        },
        base64Decode: function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = keyString.indexOf(input.charAt(i++));
                enc2 = keyString.indexOf(input.charAt(i++));
                enc3 = keyString.indexOf(input.charAt(i++));
                enc4 = keyString.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = uTF8Decode(output);
            return output;
        }
    });
})(jQuery);

/*
 *	jQuery carouFredSel 6.2.1
 *	Demo's and documentation:
 *	caroufredsel.dev7studios.com
 *
 *	Copyright (c) 2013 Fred Heusschen
 *	www.frebsite.nl
 *
 *	Dual licensed under the MIT and GPL licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 */


(function($) {
    function sc_setScroll(a, b, c) {
        return"transition" == c.transition && "swing" == b && (b = "ease"), {anims: [], duration: a, orgDuration: a, easing: b, startTime: getTime()}
    }
    function sc_startScroll(a, b) {
        for (var c = 0, d = a.anims.length; d > c; c++) {
            var e = a.anims[c];
            e && e[0][b.transition](e[1], a.duration, a.easing, e[2])
        }
    }
    function sc_stopScroll(a, b) {
        is_boolean(b) || (b = !0), is_object(a.pre) && sc_stopScroll(a.pre, b);
        for (var c = 0, d = a.anims.length; d > c; c++) {
            var e = a.anims[c];
            e[0].stop(!0), b && (e[0].css(e[1]), is_function(e[2]) && e[2]())
        }
        is_object(a.post) && sc_stopScroll(a.post, b)
    }
    function sc_afterScroll(a, b, c) {
        switch (b && b.remove(), c.fx) {
            case"fade":
            case"crossfade":
            case"cover-fade":
            case"uncover-fade":
                a.css("opacity", 1), a.css("filter", "")
        }
    }
    function sc_fireCallbacks(a, b, c, d, e) {
        if (b[c] && b[c].call(a, d), e[c].length)
            for (var f = 0, g = e[c].length; g > f; f++)
                e[c][f].call(a, d);
        return[]
    }
    function sc_fireQueue(a, b, c) {
        return b.length && (a.trigger(cf_e(b[0][0], c), b[0][1]), b.shift()), b
    }
    function sc_hideHiddenItems(a) {
        a.each(function() {
            var a = $(this);
            a.data("_cfs_isHidden", a.is(":hidden")).hide()
        })
    }
    function sc_showHiddenItems(a) {
        a && a.each(function() {
            var a = $(this);
            a.data("_cfs_isHidden") || a.show()
        })
    }
    function sc_clearTimers(a) {
        return a.auto && clearTimeout(a.auto), a.progress && clearInterval(a.progress), a
    }
    function sc_mapCallbackArguments(a, b, c, d, e, f, g) {
        return{width: g.width, height: g.height, items: {old: a, skipped: b, visible: c}, scroll: {items: d, direction: e, duration: f}}
    }
    function sc_getDuration(a, b, c, d) {
        var e = a.duration;
        return"none" == a.fx ? 0 : ("auto" == e ? e = b.scroll.duration / b.scroll.items * c : 10 > e && (e = d / e), 1 > e ? 0 : ("fade" == a.fx && (e /= 2), Math.round(e)))
    }
    function nv_showNavi(a, b, c) {
        var d = is_number(a.items.minimum) ? a.items.minimum : a.items.visible + 1;
        if ("show" == b || "hide" == b)
            var e = b;
        else if (d > b) {
            debug(c, "Not enough items (" + b + " total, " + d + " needed): Hiding navigation.");
            var e = "hide"
        } else
            var e = "show";
        var f = "show" == e ? "removeClass" : "addClass", g = cf_c("hidden", c);
        a.auto.button && a.auto.button[e]()[f](g), a.prev.button && a.prev.button[e]()[f](g), a.next.button && a.next.button[e]()[f](g), a.pagination.container && a.pagination.container[e]()[f](g)
    }
    function nv_enableNavi(a, b, c) {
        if (!a.circular && !a.infinite) {
            var d = "removeClass" == b || "addClass" == b ? b : !1, e = cf_c("disabled", c);
            if (a.auto.button && d && a.auto.button[d](e), a.prev.button) {
                var f = d || 0 == b ? "addClass" : "removeClass";
                a.prev.button[f](e)
            }
            if (a.next.button) {
                var f = d || b == a.items.visible ? "addClass" : "removeClass";
                a.next.button[f](e)
            }
        }
    }
    function go_getObject(a, b) {
        return is_function(b) ? b = b.call(a) : is_undefined(b) && (b = {}), b
    }
    function go_getItemsObject(a, b) {
        return b = go_getObject(a, b), is_number(b) ? b = {visible: b} : "variable" == b ? b = {visible: b, width: b, height: b} : is_object(b) || (b = {}), b
    }
    function go_getScrollObject(a, b) {
        return b = go_getObject(a, b), is_number(b) ? b = 50 >= b ? {items: b} : {duration: b} : is_string(b) ? b = {easing: b} : is_object(b) || (b = {}), b
    }
    function go_getNaviObject(a, b) {
        if (b = go_getObject(a, b), is_string(b)) {
            var c = cf_getKeyCode(b);
            b = -1 == c ? $(b) : c
        }
        return b
    }
    function go_getAutoObject(a, b) {
        return b = go_getNaviObject(a, b), is_jquery(b) ? b = {button: b} : is_boolean(b) ? b = {play: b} : is_number(b) && (b = {timeoutDuration: b}), b.progress && (is_string(b.progress) || is_jquery(b.progress)) && (b.progress = {bar: b.progress}), b
    }
    function go_complementAutoObject(a, b) {
        return is_function(b.button) && (b.button = b.button.call(a)), is_string(b.button) && (b.button = $(b.button)), is_boolean(b.play) || (b.play = !0), is_number(b.delay) || (b.delay = 0), is_undefined(b.pauseOnEvent) && (b.pauseOnEvent = !0), is_boolean(b.pauseOnResize) || (b.pauseOnResize = !0), is_number(b.timeoutDuration) || (b.timeoutDuration = 10 > b.duration ? 2500 : 5 * b.duration), b.progress && (is_function(b.progress.bar) && (b.progress.bar = b.progress.bar.call(a)), is_string(b.progress.bar) && (b.progress.bar = $(b.progress.bar)), b.progress.bar ? (is_function(b.progress.updater) || (b.progress.updater = $.fn.carouFredSel.progressbarUpdater), is_number(b.progress.interval) || (b.progress.interval = 50)) : b.progress = !1), b
    }
    function go_getPrevNextObject(a, b) {
        return b = go_getNaviObject(a, b), is_jquery(b) ? b = {button: b} : is_number(b) && (b = {key: b}), b
    }
    function go_complementPrevNextObject(a, b) {
        return is_function(b.button) && (b.button = b.button.call(a)), is_string(b.button) && (b.button = $(b.button)), is_string(b.key) && (b.key = cf_getKeyCode(b.key)), b
    }
    function go_getPaginationObject(a, b) {
        return b = go_getNaviObject(a, b), is_jquery(b) ? b = {container: b} : is_boolean(b) && (b = {keys: b}), b
    }
    function go_complementPaginationObject(a, b) {
        return is_function(b.container) && (b.container = b.container.call(a)), is_string(b.container) && (b.container = $(b.container)), is_number(b.items) || (b.items = !1), is_boolean(b.keys) || (b.keys = !1), is_function(b.anchorBuilder) || is_false(b.anchorBuilder) || (b.anchorBuilder = $.fn.carouFredSel.pageAnchorBuilder), is_number(b.deviation) || (b.deviation = 0), b
    }
    function go_getSwipeObject(a, b) {
        return is_function(b) && (b = b.call(a)), is_undefined(b) && (b = {onTouch: !1}), is_true(b) ? b = {onTouch: b} : is_number(b) && (b = {items: b}), b
    }
    function go_complementSwipeObject(a, b) {
        return is_boolean(b.onTouch) || (b.onTouch = !0), is_boolean(b.onMouse) || (b.onMouse = !1), is_object(b.options) || (b.options = {}), is_boolean(b.options.triggerOnTouchEnd) || (b.options.triggerOnTouchEnd = !1), b
    }
    function go_getMousewheelObject(a, b) {
        return is_function(b) && (b = b.call(a)), is_true(b) ? b = {} : is_number(b) ? b = {items: b} : is_undefined(b) && (b = !1), b
    }
    function go_complementMousewheelObject(a, b) {
        return b
    }
    function gn_getItemIndex(a, b, c, d, e) {
        if (is_string(a) && (a = $(a, e)), is_object(a) && (a = $(a, e)), is_jquery(a) ? (a = e.children().index(a), is_boolean(c) || (c = !1)) : is_boolean(c) || (c = !0), is_number(a) || (a = 0), is_number(b) || (b = 0), c && (a += d.first), a += b, d.total > 0) {
            for (; a >= d.total; )
                a -= d.total;
            for (; 0 > a; )
                a += d.total
        }
        return a
    }
    function gn_getVisibleItemsPrev(a, b, c) {
        for (var d = 0, e = 0, f = c; f >= 0; f--) {
            var g = a.eq(f);
            if (d += g.is(":visible") ? g[b.d.outerWidth](!0) : 0, d > b.maxDimension)
                return e;
            0 == f && (f = a.length), e++
        }
    }
    function gn_getVisibleItemsPrevFilter(a, b, c) {
        return gn_getItemsPrevFilter(a, b.items.filter, b.items.visibleConf.org, c)
    }
    function gn_getScrollItemsPrevFilter(a, b, c, d) {
        return gn_getItemsPrevFilter(a, b.items.filter, d, c)
    }
    function gn_getItemsPrevFilter(a, b, c, d) {
        for (var e = 0, f = 0, g = d, h = a.length; g >= 0; g--) {
            if (f++, f == h)
                return f;
            var i = a.eq(g);
            if (i.is(b) && (e++, e == c))
                return f;
            0 == g && (g = h)
        }
    }
    function gn_getVisibleOrg(a, b) {
        return b.items.visibleConf.org || a.children().slice(0, b.items.visible).filter(b.items.filter).length
    }
    function gn_getVisibleItemsNext(a, b, c) {
        for (var d = 0, e = 0, f = c, g = a.length - 1; g >= f; f++) {
            var h = a.eq(f);
            if (d += h.is(":visible") ? h[b.d.outerWidth](!0) : 0, d > b.maxDimension)
                return e;
            if (e++, e == g + 1)
                return e;
            f == g && (f = -1)
        }
    }
    function gn_getVisibleItemsNextTestCircular(a, b, c, d) {
        var e = gn_getVisibleItemsNext(a, b, c);
        return b.circular || c + e > d && (e = d - c), e
    }
    function gn_getVisibleItemsNextFilter(a, b, c) {
        return gn_getItemsNextFilter(a, b.items.filter, b.items.visibleConf.org, c, b.circular)
    }
    function gn_getScrollItemsNextFilter(a, b, c, d) {
        return gn_getItemsNextFilter(a, b.items.filter, d + 1, c, b.circular) - 1
    }
    function gn_getItemsNextFilter(a, b, c, d) {
        for (var f = 0, g = 0, h = d, i = a.length - 1; i >= h; h++) {
            if (g++, g >= i)
                return g;
            var j = a.eq(h);
            if (j.is(b) && (f++, f == c))
                return g;
            h == i && (h = -1)
        }
    }
    function gi_getCurrentItems(a, b) {
        return a.slice(0, b.items.visible)
    }
    function gi_getOldItemsPrev(a, b, c) {
        return a.slice(c, b.items.visibleConf.old + c)
    }
    function gi_getNewItemsPrev(a, b) {
        return a.slice(0, b.items.visible)
    }
    function gi_getOldItemsNext(a, b) {
        return a.slice(0, b.items.visibleConf.old)
    }
    function gi_getNewItemsNext(a, b, c) {
        return a.slice(c, b.items.visible + c)
    }
    function sz_storeMargin(a, b, c) {
        b.usePadding && (is_string(c) || (c = "_cfs_origCssMargin"), a.each(function() {
            var a = $(this), d = parseInt(a.css(b.d.marginRight), 10);
            is_number(d) || (d = 0), a.data(c, d)
        }))
    }
    function sz_resetMargin(a, b, c) {
        if (b.usePadding) {
            var d = is_boolean(c) ? c : !1;
            is_number(c) || (c = 0), sz_storeMargin(a, b, "_cfs_tempCssMargin"), a.each(function() {
                var a = $(this);
                a.css(b.d.marginRight, d ? a.data("_cfs_tempCssMargin") : c + a.data("_cfs_origCssMargin"))
            })
        }
    }
    function sz_storeOrigCss(a) {
        a.each(function() {
            var a = $(this);
            a.data("_cfs_origCss", a.attr("style") || "")
        })
    }
    function sz_restoreOrigCss(a) {
        a.each(function() {
            var a = $(this);
            a.attr("style", a.data("_cfs_origCss") || "")
        })
    }
    function sz_setResponsiveSizes(a, b) {
        var d = (a.items.visible, a.items[a.d.width]), e = a[a.d.height], f = is_percentage(e);
        b.each(function() {
            var b = $(this), c = d - ms_getPaddingBorderMargin(b, a, "Width");
            b[a.d.width](c), f && b[a.d.height](ms_getPercentage(c, e))
        })
    }
    function sz_setSizes(a, b) {
        var c = a.parent(), d = a.children(), e = gi_getCurrentItems(d, b), f = cf_mapWrapperSizes(ms_getSizes(e, b, !0), b, !1);
        if (c.css(f), b.usePadding) {
            var g = b.padding, h = g[b.d[1]];
            b.align && 0 > h && (h = 0);
            var i = e.last();
            i.css(b.d.marginRight, i.data("_cfs_origCssMargin") + h), a.css(b.d.top, g[b.d[0]]), a.css(b.d.left, g[b.d[3]])
        }
        return a.css(b.d.width, f[b.d.width] + 2 * ms_getTotalSize(d, b, "width")), a.css(b.d.height, ms_getLargestSize(d, b, "height")), f
    }
    function ms_getSizes(a, b, c) {
        return[ms_getTotalSize(a, b, "width", c), ms_getLargestSize(a, b, "height", c)]
    }
    function ms_getLargestSize(a, b, c, d) {
        return is_boolean(d) || (d = !1), is_number(b[b.d[c]]) && d ? b[b.d[c]] : is_number(b.items[b.d[c]]) ? b.items[b.d[c]] : (c = c.toLowerCase().indexOf("width") > -1 ? "outerWidth" : "outerHeight", ms_getTrueLargestSize(a, b, c))
    }
    function ms_getTrueLargestSize(a, b, c) {
        for (var d = 0, e = 0, f = a.length; f > e; e++) {
            var g = a.eq(e), h = g.is(":visible") ? g[b.d[c]](!0) : 0;
            h > d && (d = h)
        }
        return d
    }
    function ms_getTotalSize(a, b, c, d) {
        if (is_boolean(d) || (d = !1), is_number(b[b.d[c]]) && d)
            return b[b.d[c]];
        if (is_number(b.items[b.d[c]]))
            return b.items[b.d[c]] * a.length;
        for (var e = c.toLowerCase().indexOf("width") > -1 ? "outerWidth" : "outerHeight", f = 0, g = 0, h = a.length; h > g; g++) {
            var i = a.eq(g);
            f += i.is(":visible") ? i[b.d[e]](!0) : 0
        }
        return f
    }
    function ms_getParentSize(a, b, c) {
        var d = a.is(":visible");
        d && a.hide();
        var e = a.parent()[b.d[c]]();
        return d && a.show(), e
    }
    function ms_getMaxDimension(a, b) {
        return is_number(a[a.d.width]) ? a[a.d.width] : b
    }
    function ms_hasVariableSizes(a, b, c) {
        for (var d = !1, e = !1, f = 0, g = a.length; g > f; f++) {
            var h = a.eq(f), i = h.is(":visible") ? h[b.d[c]](!0) : 0;
            d === !1 ? d = i : d != i && (e = !0), 0 == d && (e = !0)
        }
        return e
    }
    function ms_getPaddingBorderMargin(a, b, c) {
        return a[b.d["outer" + c]](!0) - a[b.d[c.toLowerCase()]]()
    }
    function ms_getPercentage(a, b) {
        if (is_percentage(b)) {
            if (b = parseInt(b.slice(0, -1), 10), !is_number(b))
                return a;
            a *= b / 100
        }
        return a
    }
    function cf_e(a, b, c, d, e) {
        return is_boolean(c) || (c = !0), is_boolean(d) || (d = !0), is_boolean(e) || (e = !1), c && (a = b.events.prefix + a), d && (a = a + "." + b.events.namespace), d && e && (a += b.serialNumber), a
    }
    function cf_c(a, b) {
        return is_string(b.classnames[a]) ? b.classnames[a] : a
    }
    function cf_mapWrapperSizes(a, b, c) {
        is_boolean(c) || (c = !0);
        var d = b.usePadding && c ? b.padding : [0, 0, 0, 0], e = {};
        return e[b.d.width] = a[0] + d[1] + d[3], e[b.d.height] = a[1] + d[0] + d[2], e
    }
    function cf_sortParams(a, b) {
        for (var c = [], d = 0, e = a.length; e > d; d++)
            for (var f = 0, g = b.length; g > f; f++)
                if (b[f].indexOf(typeof a[d]) > -1 && is_undefined(c[f])) {
                    c[f] = a[d];
                    break
                }
        return c
    }
    function cf_getPadding(a) {
        if (is_undefined(a))
            return[0, 0, 0, 0];
        if (is_number(a))
            return[a, a, a, a];
        if (is_string(a) && (a = a.split("px").join("").split("em").join("").split(" ")), !is_array(a))
            return[0, 0, 0, 0];
        for (var b = 0; 4 > b; b++)
            a[b] = parseInt(a[b], 10);
        switch (a.length) {
            case 0:
                return[0, 0, 0, 0];
            case 1:
                return[a[0], a[0], a[0], a[0]];
            case 2:
                return[a[0], a[1], a[0], a[1]];
            case 3:
                return[a[0], a[1], a[2], a[1]];
            default:
                return[a[0], a[1], a[2], a[3]]
        }
    }
    function cf_getAlignPadding(a, b) {
        var c = is_number(b[b.d.width]) ? Math.ceil(b[b.d.width] - ms_getTotalSize(a, b, "width")) : 0;
        switch (b.align) {
            case"left":
                return[0, c];
            case"right":
                return[c, 0];
            case"center":
            default:
                return[Math.ceil(c / 2), Math.floor(c / 2)]
        }
    }
    function cf_getDimensions(a) {
        for (var b = [["width", "innerWidth", "outerWidth", "height", "innerHeight", "outerHeight", "left", "top", "marginRight", 0, 1, 2, 3], ["height", "innerHeight", "outerHeight", "width", "innerWidth", "outerWidth", "top", "left", "marginBottom", 3, 2, 1, 0]], c = b[0].length, d = "right" == a.direction || "left" == a.direction ? 0 : 1, e = {}, f = 0; c > f; f++)
            e[b[0][f]] = b[d][f];
        return e
    }
    function cf_getAdjust(a, b, c, d) {
        var e = a;
        if (is_function(c))
            e = c.call(d, e);
        else if (is_string(c)) {
            var f = c.split("+"), g = c.split("-");
            if (g.length > f.length)
                var h = !0, i = g[0], j = g[1];
            else
                var h = !1, i = f[0], j = f[1];
            switch (i) {
                case"even":
                    e = 1 == a % 2 ? a - 1 : a;
                    break;
                case"odd":
                    e = 0 == a % 2 ? a - 1 : a;
                    break;
                default:
                    e = a
            }
            j = parseInt(j, 10), is_number(j) && (h && (j = -j), e += j)
        }
        return(!is_number(e) || 1 > e) && (e = 1), e
    }
    function cf_getItemsAdjust(a, b, c, d) {
        return cf_getItemAdjustMinMax(cf_getAdjust(a, b, c, d), b.items.visibleConf)
    }
    function cf_getItemAdjustMinMax(a, b) {
        return is_number(b.min) && b.min > a && (a = b.min), is_number(b.max) && a > b.max && (a = b.max), 1 > a && (a = 1), a
    }
    function cf_getSynchArr(a) {
        is_array(a) || (a = [[a]]), is_array(a[0]) || (a = [a]);
        for (var b = 0, c = a.length; c > b; b++)
            is_string(a[b][0]) && (a[b][0] = $(a[b][0])), is_boolean(a[b][1]) || (a[b][1] = !0), is_boolean(a[b][2]) || (a[b][2] = !0), is_number(a[b][3]) || (a[b][3] = 0);
        return a
    }
    function cf_getKeyCode(a) {
        return"right" == a ? 39 : "left" == a ? 37 : "up" == a ? 38 : "down" == a ? 40 : -1
    }
    function cf_setCookie(a, b, c) {
        if (a) {
            var d = b.triggerHandler(cf_e("currentPosition", c));
            $.fn.carouFredSel.cookie.set(a, d)
        }
    }
    function cf_getCookie(a) {
        var b = $.fn.carouFredSel.cookie.get(a);
        return"" == b ? 0 : b
    }
    function in_mapCss(a, b) {
        for (var c = {}, d = 0, e = b.length; e > d; d++)
            c[b[d]] = a.css(b[d]);
        return c
    }
    function in_complementItems(a, b, c, d) {
        return is_object(a.visibleConf) || (a.visibleConf = {}), is_object(a.sizesConf) || (a.sizesConf = {}), 0 == a.start && is_number(d) && (a.start = d), is_object(a.visible) ? (a.visibleConf.min = a.visible.min, a.visibleConf.max = a.visible.max, a.visible = !1) : is_string(a.visible) ? ("variable" == a.visible ? a.visibleConf.variable = !0 : a.visibleConf.adjust = a.visible, a.visible = !1) : is_function(a.visible) && (a.visibleConf.adjust = a.visible, a.visible = !1), is_string(a.filter) || (a.filter = c.filter(":hidden").length > 0 ? ":visible" : "*"), a[b.d.width] || (b.responsive ? (debug(!0, "Set a " + b.d.width + " for the items!"), a[b.d.width] = ms_getTrueLargestSize(c, b, "outerWidth")) : a[b.d.width] = ms_hasVariableSizes(c, b, "outerWidth") ? "variable" : c[b.d.outerWidth](!0)), a[b.d.height] || (a[b.d.height] = ms_hasVariableSizes(c, b, "outerHeight") ? "variable" : c[b.d.outerHeight](!0)), a.sizesConf.width = a.width, a.sizesConf.height = a.height, a
    }
    function in_complementVisibleItems(a, b) {
        return"variable" == a.items[a.d.width] && (a.items.visibleConf.variable = !0), a.items.visibleConf.variable || (is_number(a[a.d.width]) ? a.items.visible = Math.floor(a[a.d.width] / a.items[a.d.width]) : (a.items.visible = Math.floor(b / a.items[a.d.width]), a[a.d.width] = a.items.visible * a.items[a.d.width], a.items.visibleConf.adjust || (a.align = !1)), ("Infinity" == a.items.visible || 1 > a.items.visible) && (debug(!0, 'Not a valid number of visible items: Set to "variable".'), a.items.visibleConf.variable = !0)), a
    }
    function in_complementPrimarySize(a, b, c) {
        return"auto" == a && (a = ms_getTrueLargestSize(c, b, "outerWidth")), a
    }
    function in_complementSecondarySize(a, b, c) {
        return"auto" == a && (a = ms_getTrueLargestSize(c, b, "outerHeight")), a || (a = b.items[b.d.height]), a
    }
    function in_getAlignPadding(a, b) {
        var c = cf_getAlignPadding(gi_getCurrentItems(b, a), a);
        return a.padding[a.d[1]] = c[1], a.padding[a.d[3]] = c[0], a
    }
    function in_getResponsiveValues(a, b) {
        var d = cf_getItemAdjustMinMax(Math.ceil(a[a.d.width] / a.items[a.d.width]), a.items.visibleConf);
        d > b.length && (d = b.length);
        var e = Math.floor(a[a.d.width] / d);
        return a.items.visible = d, a.items[a.d.width] = e, a[a.d.width] = d * e, a
    }
    function bt_pauseOnHoverConfig(a) {
        if (is_string(a))
            var b = a.indexOf("immediate") > -1 ? !0 : !1, c = a.indexOf("resume") > -1 ? !0 : !1;
        else
            var b = c = !1;
        return[b, c]
    }
    function bt_mousesheelNumber(a) {
        return is_number(a) ? a : null
    }
    function is_null(a) {
        return null === a
    }
    function is_undefined(a) {
        return is_null(a) || a === void 0 || "" === a || "undefined" === a
    }
    function is_array(a) {
        return a instanceof Array
    }
    function is_jquery(a) {
        return a instanceof jQuery
    }
    function is_object(a) {
        return(a instanceof Object || "object" == typeof a) && !is_null(a) && !is_jquery(a) && !is_array(a) && !is_function(a)
    }
    function is_number(a) {
        return(a instanceof Number || "number" == typeof a) && !isNaN(a)
    }
    function is_string(a) {
        return(a instanceof String || "string" == typeof a) && !is_undefined(a) && !is_true(a) && !is_false(a)
    }
    function is_function(a) {
        return a instanceof Function || "function" == typeof a
    }
    function is_boolean(a) {
        return a instanceof Boolean || "boolean" == typeof a || is_true(a) || is_false(a)
    }
    function is_true(a) {
        return a === !0 || "true" === a
    }
    function is_false(a) {
        return a === !1 || "false" === a
    }
    function is_percentage(a) {
        return is_string(a) && "%" == a.slice(-1)
    }
    function getTime() {
        return(new Date).getTime()
    }
    function deprecated(a, b) {
        debug(!0, a + " is DEPRECATED, support for it will be removed. Use " + b + " instead.")
    }
    function debug(a, b) {
        if (!is_undefined(window.console) && !is_undefined(window.console.log)) {
            if (is_object(a)) {
                var c = " (" + a.selector + ")";
                a = a.debug
            } else
                var c = "";
            if (!a)
                return!1;
            b = is_string(b) ? "carouFredSel" + c + ": " + b : ["carouFredSel" + c + ":", b], window.console.log(b)
        }
        return!1
    }
    $.fn.carouFredSel || ($.fn.caroufredsel = $.fn.carouFredSel = function(options, configs) {
        if (0 == this.length)
            return debug(!0, 'No element found for "' + this.selector + '".'), this;
        if (this.length > 1)
            return this.each(function() {
                $(this).carouFredSel(options, configs)
            });
        var $cfs = this, $tt0 = this[0], starting_position = !1;
        $cfs.data("_cfs_isCarousel") && (starting_position = $cfs.triggerHandler("_cfs_triggerEvent", "currentPosition"), $cfs.trigger("_cfs_triggerEvent", ["destroy", !0]));
        var FN = {};
        FN._init = function(a, b, c) {
            a = go_getObject($tt0, a), a.items = go_getItemsObject($tt0, a.items), a.scroll = go_getScrollObject($tt0, a.scroll), a.auto = go_getAutoObject($tt0, a.auto), a.prev = go_getPrevNextObject($tt0, a.prev), a.next = go_getPrevNextObject($tt0, a.next), a.pagination = go_getPaginationObject($tt0, a.pagination), a.swipe = go_getSwipeObject($tt0, a.swipe), a.mousewheel = go_getMousewheelObject($tt0, a.mousewheel), b && (opts_orig = $.extend(!0, {}, $.fn.carouFredSel.defaults, a)), opts = $.extend(!0, {}, $.fn.carouFredSel.defaults, a), opts.d = cf_getDimensions(opts), crsl.direction = "up" == opts.direction || "left" == opts.direction ? "next" : "prev";
            var d = $cfs.children(), e = ms_getParentSize($wrp, opts, "width");
            if (is_true(opts.cookie) && (opts.cookie = "caroufredsel_cookie_" + conf.serialNumber), opts.maxDimension = ms_getMaxDimension(opts, e), opts.items = in_complementItems(opts.items, opts, d, c), opts[opts.d.width] = in_complementPrimarySize(opts[opts.d.width], opts, d), opts[opts.d.height] = in_complementSecondarySize(opts[opts.d.height], opts, d), opts.responsive && (is_percentage(opts[opts.d.width]) || (opts[opts.d.width] = "100%")), is_percentage(opts[opts.d.width]) && (crsl.upDateOnWindowResize = !0, crsl.primarySizePercentage = opts[opts.d.width], opts[opts.d.width] = ms_getPercentage(e, crsl.primarySizePercentage), opts.items.visible || (opts.items.visibleConf.variable = !0)), opts.responsive ? (opts.usePadding = !1, opts.padding = [0, 0, 0, 0], opts.align = !1, opts.items.visibleConf.variable = !1) : (opts.items.visible || (opts = in_complementVisibleItems(opts, e)), opts[opts.d.width] || (!opts.items.visibleConf.variable && is_number(opts.items[opts.d.width]) && "*" == opts.items.filter ? (opts[opts.d.width] = opts.items.visible * opts.items[opts.d.width], opts.align = !1) : opts[opts.d.width] = "variable"), is_undefined(opts.align) && (opts.align = is_number(opts[opts.d.width]) ? "center" : !1), opts.items.visibleConf.variable && (opts.items.visible = gn_getVisibleItemsNext(d, opts, 0))), "*" == opts.items.filter || opts.items.visibleConf.variable || (opts.items.visibleConf.org = opts.items.visible, opts.items.visible = gn_getVisibleItemsNextFilter(d, opts, 0)), opts.items.visible = cf_getItemsAdjust(opts.items.visible, opts, opts.items.visibleConf.adjust, $tt0), opts.items.visibleConf.old = opts.items.visible, opts.responsive)
                opts.items.visibleConf.min || (opts.items.visibleConf.min = opts.items.visible), opts.items.visibleConf.max || (opts.items.visibleConf.max = opts.items.visible), opts = in_getResponsiveValues(opts, d, e);
            else
                switch (opts.padding = cf_getPadding(opts.padding), "top" == opts.align ? opts.align = "left" : "bottom" == opts.align && (opts.align = "right"), opts.align) {
                    case"center":
                    case"left":
                    case"right":
                        "variable" != opts[opts.d.width] && (opts = in_getAlignPadding(opts, d), opts.usePadding = !0);
                        break;
                    default:
                        opts.align = !1, opts.usePadding = 0 == opts.padding[0] && 0 == opts.padding[1] && 0 == opts.padding[2] && 0 == opts.padding[3] ? !1 : !0
                }
            is_number(opts.scroll.duration) || (opts.scroll.duration = 500), is_undefined(opts.scroll.items) && (opts.scroll.items = opts.responsive || opts.items.visibleConf.variable || "*" != opts.items.filter ? "visible" : opts.items.visible), opts.auto = $.extend(!0, {}, opts.scroll, opts.auto), opts.prev = $.extend(!0, {}, opts.scroll, opts.prev), opts.next = $.extend(!0, {}, opts.scroll, opts.next), opts.pagination = $.extend(!0, {}, opts.scroll, opts.pagination), opts.auto = go_complementAutoObject($tt0, opts.auto), opts.prev = go_complementPrevNextObject($tt0, opts.prev), opts.next = go_complementPrevNextObject($tt0, opts.next), opts.pagination = go_complementPaginationObject($tt0, opts.pagination), opts.swipe = go_complementSwipeObject($tt0, opts.swipe), opts.mousewheel = go_complementMousewheelObject($tt0, opts.mousewheel), opts.synchronise && (opts.synchronise = cf_getSynchArr(opts.synchronise)), opts.auto.onPauseStart && (opts.auto.onTimeoutStart = opts.auto.onPauseStart, deprecated("auto.onPauseStart", "auto.onTimeoutStart")), opts.auto.onPausePause && (opts.auto.onTimeoutPause = opts.auto.onPausePause, deprecated("auto.onPausePause", "auto.onTimeoutPause")), opts.auto.onPauseEnd && (opts.auto.onTimeoutEnd = opts.auto.onPauseEnd, deprecated("auto.onPauseEnd", "auto.onTimeoutEnd")), opts.auto.pauseDuration && (opts.auto.timeoutDuration = opts.auto.pauseDuration, deprecated("auto.pauseDuration", "auto.timeoutDuration"))
        }, FN._build = function() {
            $cfs.data("_cfs_isCarousel", !0);
            var a = $cfs.children(), b = in_mapCss($cfs, ["textAlign", "float", "position", "top", "right", "bottom", "left", "zIndex", "width", "height", "marginTop", "marginRight", "marginBottom", "marginLeft"]), c = "relative";
            switch (b.position) {
                case"absolute":
                case"fixed":
                    c = b.position
            }
            "parent" == conf.wrapper ? sz_storeOrigCss($wrp) : $wrp.css(b), $wrp.css({overflow: "hidden", position: c}), sz_storeOrigCss($cfs), $cfs.data("_cfs_origCssZindex", b.zIndex), $cfs.css({textAlign: "left", "float": "none", position: "absolute", top: 0, right: "auto", bottom: "auto", left: 0, marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0}), sz_storeMargin(a, opts), sz_storeOrigCss(a), opts.responsive && sz_setResponsiveSizes(opts, a)
        }, FN._bind_events = function() {
            FN._unbind_events(), $cfs.bind(cf_e("stop", conf), function(a, b) {
                return a.stopPropagation(), crsl.isStopped || opts.auto.button && opts.auto.button.addClass(cf_c("stopped", conf)), crsl.isStopped = !0, opts.auto.play && (opts.auto.play = !1, $cfs.trigger(cf_e("pause", conf), b)), !0
            }), $cfs.bind(cf_e("finish", conf), function(a) {
                return a.stopPropagation(), crsl.isScrolling && sc_stopScroll(scrl), !0
            }), $cfs.bind(cf_e("pause", conf), function(a, b, c) {
                if (a.stopPropagation(), tmrs = sc_clearTimers(tmrs), b && crsl.isScrolling) {
                    scrl.isStopped = !0;
                    var d = getTime() - scrl.startTime;
                    scrl.duration -= d, scrl.pre && (scrl.pre.duration -= d), scrl.post && (scrl.post.duration -= d), sc_stopScroll(scrl, !1)
                }
                if (crsl.isPaused || crsl.isScrolling || c && (tmrs.timePassed += getTime() - tmrs.startTime), crsl.isPaused || opts.auto.button && opts.auto.button.addClass(cf_c("paused", conf)), crsl.isPaused = !0, opts.auto.onTimeoutPause) {
                    var e = opts.auto.timeoutDuration - tmrs.timePassed, f = 100 - Math.ceil(100 * e / opts.auto.timeoutDuration);
                    opts.auto.onTimeoutPause.call($tt0, f, e)
                }
                return!0
            }), $cfs.bind(cf_e("play", conf), function(a, b, c, d) {
                a.stopPropagation(), tmrs = sc_clearTimers(tmrs);
                var e = [b, c, d], f = ["string", "number", "boolean"], g = cf_sortParams(e, f);
                if (b = g[0], c = g[1], d = g[2], "prev" != b && "next" != b && (b = crsl.direction), is_number(c) || (c = 0), is_boolean(d) || (d = !1), d && (crsl.isStopped = !1, opts.auto.play = !0), !opts.auto.play)
                    return a.stopImmediatePropagation(), debug(conf, "Carousel stopped: Not scrolling.");
                crsl.isPaused && opts.auto.button && (opts.auto.button.removeClass(cf_c("stopped", conf)), opts.auto.button.removeClass(cf_c("paused", conf))), crsl.isPaused = !1, tmrs.startTime = getTime();
                var h = opts.auto.timeoutDuration + c;
                return dur2 = h - tmrs.timePassed, perc = 100 - Math.ceil(100 * dur2 / h), opts.auto.progress && (tmrs.progress = setInterval(function() {
                    var a = getTime() - tmrs.startTime + tmrs.timePassed, b = Math.ceil(100 * a / h);
                    opts.auto.progress.updater.call(opts.auto.progress.bar[0], b)
                }, opts.auto.progress.interval)), tmrs.auto = setTimeout(function() {
                    opts.auto.progress && opts.auto.progress.updater.call(opts.auto.progress.bar[0], 100), opts.auto.onTimeoutEnd && opts.auto.onTimeoutEnd.call($tt0, perc, dur2), crsl.isScrolling ? $cfs.trigger(cf_e("play", conf), b) : $cfs.trigger(cf_e(b, conf), opts.auto)
                }, dur2), opts.auto.onTimeoutStart && opts.auto.onTimeoutStart.call($tt0, perc, dur2), !0
            }), $cfs.bind(cf_e("resume", conf), function(a) {
                return a.stopPropagation(), scrl.isStopped ? (scrl.isStopped = !1, crsl.isPaused = !1, crsl.isScrolling = !0, scrl.startTime = getTime(), sc_startScroll(scrl, conf)) : $cfs.trigger(cf_e("play", conf)), !0
            }), $cfs.bind(cf_e("prev", conf) + " " + cf_e("next", conf), function(a, b, c, d, e) {
                if (a.stopPropagation(), crsl.isStopped || $cfs.is(":hidden"))
                    return a.stopImmediatePropagation(), debug(conf, "Carousel stopped or hidden: Not scrolling.");
                var f = is_number(opts.items.minimum) ? opts.items.minimum : opts.items.visible + 1;
                if (f > itms.total)
                    return a.stopImmediatePropagation(), debug(conf, "Not enough items (" + itms.total + " total, " + f + " needed): Not scrolling.");
                var g = [b, c, d, e], h = ["object", "number/string", "function", "boolean"], i = cf_sortParams(g, h);
                b = i[0], c = i[1], d = i[2], e = i[3];
                var j = a.type.slice(conf.events.prefix.length);
                if (is_object(b) || (b = {}), is_function(d) && (b.onAfter = d), is_boolean(e) && (b.queue = e), b = $.extend(!0, {}, opts[j], b), b.conditions && !b.conditions.call($tt0, j))
                    return a.stopImmediatePropagation(), debug(conf, 'Callback "conditions" returned false.');
                if (!is_number(c)) {
                    if ("*" != opts.items.filter)
                        c = "visible";
                    else
                        for (var k = [c, b.items, opts[j].items], i = 0, l = k.length; l > i; i++)
                            if (is_number(k[i]) || "page" == k[i] || "visible" == k[i]) {
                                c = k[i];
                                break
                            }
                    switch (c) {
                        case"page":
                            return a.stopImmediatePropagation(), $cfs.triggerHandler(cf_e(j + "Page", conf), [b, d]);
                        case"visible":
                            opts.items.visibleConf.variable || "*" != opts.items.filter || (c = opts.items.visible)
                    }
                }
                if (scrl.isStopped)
                    return $cfs.trigger(cf_e("resume", conf)), $cfs.trigger(cf_e("queue", conf), [j, [b, c, d]]), a.stopImmediatePropagation(), debug(conf, "Carousel resumed scrolling.");
                if (b.duration > 0 && crsl.isScrolling)
                    return b.queue && ("last" == b.queue && (queu = []), ("first" != b.queue || 0 == queu.length) && $cfs.trigger(cf_e("queue", conf), [j, [b, c, d]])), a.stopImmediatePropagation(), debug(conf, "Carousel currently scrolling.");
                if (tmrs.timePassed = 0, $cfs.trigger(cf_e("slide_" + j, conf), [b, c]), opts.synchronise)
                    for (var m = opts.synchronise, n = [b, c], o = 0, l = m.length; l > o; o++) {
                        var p = j;
                        m[o][2] || (p = "prev" == p ? "next" : "prev"), m[o][1] || (n[0] = m[o][0].triggerHandler("_cfs_triggerEvent", ["configuration", p])), n[1] = c + m[o][3], m[o][0].trigger("_cfs_triggerEvent", ["slide_" + p, n])
                    }
                return!0
            }), $cfs.bind(cf_e("slide_prev", conf), function(a, b, c) {
                a.stopPropagation();
                var d = $cfs.children();
                if (!opts.circular && 0 == itms.first)
                    return opts.infinite && $cfs.trigger(cf_e("next", conf), itms.total - 1), a.stopImmediatePropagation();
                if (sz_resetMargin(d, opts), !is_number(c)) {
                    if (opts.items.visibleConf.variable)
                        c = gn_getVisibleItemsPrev(d, opts, itms.total - 1);
                    else if ("*" != opts.items.filter) {
                        var e = is_number(b.items) ? b.items : gn_getVisibleOrg($cfs, opts);
                        c = gn_getScrollItemsPrevFilter(d, opts, itms.total - 1, e)
                    } else
                        c = opts.items.visible;
                    c = cf_getAdjust(c, opts, b.items, $tt0)
                }
                if (opts.circular || itms.total - c < itms.first && (c = itms.total - itms.first), opts.items.visibleConf.old = opts.items.visible, opts.items.visibleConf.variable) {
                    var f = cf_getItemsAdjust(gn_getVisibleItemsNext(d, opts, itms.total - c), opts, opts.items.visibleConf.adjust, $tt0);
                    f >= opts.items.visible + c && itms.total > c && (c++, f = cf_getItemsAdjust(gn_getVisibleItemsNext(d, opts, itms.total - c), opts, opts.items.visibleConf.adjust, $tt0)), opts.items.visible = f
                } else if ("*" != opts.items.filter) {
                    var f = gn_getVisibleItemsNextFilter(d, opts, itms.total - c);
                    opts.items.visible = cf_getItemsAdjust(f, opts, opts.items.visibleConf.adjust, $tt0)
                }
                if (sz_resetMargin(d, opts, !0), 0 == c)
                    return a.stopImmediatePropagation(), debug(conf, "0 items to scroll: Not scrolling.");
                for (debug(conf, "Scrolling " + c + " items backward."), itms.first += c; itms.first >= itms.total; )
                    itms.first -= itms.total;
                opts.circular || (0 == itms.first && b.onEnd && b.onEnd.call($tt0, "prev"), opts.infinite || nv_enableNavi(opts, itms.first, conf)), $cfs.children().slice(itms.total - c, itms.total).prependTo($cfs), itms.total < opts.items.visible + c && $cfs.children().slice(0, opts.items.visible + c - itms.total).clone(!0).appendTo($cfs);
                var d = $cfs.children(), g = gi_getOldItemsPrev(d, opts, c), h = gi_getNewItemsPrev(d, opts), i = d.eq(c - 1), j = g.last(), k = h.last();
                sz_resetMargin(d, opts);
                var l = 0, m = 0;
                if (opts.align) {
                    var n = cf_getAlignPadding(h, opts);
                    l = n[0], m = n[1]
                }
                var o = 0 > l ? opts.padding[opts.d[3]] : 0, p = !1, q = $();
                if (c > opts.items.visible && (q = d.slice(opts.items.visibleConf.old, c), "directscroll" == b.fx)) {
                    var r = opts.items[opts.d.width];
                    p = q, i = k, sc_hideHiddenItems(p), opts.items[opts.d.width] = "variable"
                }
                var s = !1, t = ms_getTotalSize(d.slice(0, c), opts, "width"), u = cf_mapWrapperSizes(ms_getSizes(h, opts, !0), opts, !opts.usePadding), v = 0, w = {}, x = {}, y = {}, z = {}, A = {}, B = {}, C = {}, D = sc_getDuration(b, opts, c, t);
                switch (b.fx) {
                    case"cover":
                    case"cover-fade":
                        v = ms_getTotalSize(d.slice(0, opts.items.visible), opts, "width")
                }
                p && (opts.items[opts.d.width] = r), sz_resetMargin(d, opts, !0), m >= 0 && sz_resetMargin(j, opts, opts.padding[opts.d[1]]), l >= 0 && sz_resetMargin(i, opts, opts.padding[opts.d[3]]), opts.align && (opts.padding[opts.d[1]] = m, opts.padding[opts.d[3]] = l), B[opts.d.left] = -(t - o), C[opts.d.left] = -(v - o), x[opts.d.left] = u[opts.d.width];
                var E = function() {
                }, F = function() {
                }, G = function() {
                }, H = function() {
                }, I = function() {
                }, J = function() {
                }, K = function() {
                }, L = function() {
                }, M = function() {
                }, N = function() {
                }, O = function() {
                };
                switch (b.fx) {
                    case"crossfade":
                    case"cover":
                    case"cover-fade":
                    case"uncover":
                    case"uncover-fade":
                        s = $cfs.clone(!0).appendTo($wrp)
                }
                switch (b.fx) {
                    case"crossfade":
                    case"uncover":
                    case"uncover-fade":
                        s.children().slice(0, c).remove(), s.children().slice(opts.items.visibleConf.old).remove();
                        break;
                    case"cover":
                    case"cover-fade":
                        s.children().slice(opts.items.visible).remove(), s.css(C)
                }
                if ($cfs.css(B), scrl = sc_setScroll(D, b.easing, conf), w[opts.d.left] = opts.usePadding ? opts.padding[opts.d[3]] : 0, ("variable" == opts[opts.d.width] || "variable" == opts[opts.d.height]) && (E = function() {
                    $wrp.css(u)
                }, F = function() {
                    scrl.anims.push([$wrp, u])
                }), opts.usePadding) {
                    switch (k.not(i).length && (y[opts.d.marginRight] = i.data("_cfs_origCssMargin"), 0 > l ? i.css(y) : (K = function() {
                            i.css(y)
                        }, L = function() {
                            scrl.anims.push([i, y])
                        })), b.fx){case"cover":
                        case"cover-fade":
                            s.children().eq(c - 1).css(y)
                    }
                    k.not(j).length && (z[opts.d.marginRight] = j.data("_cfs_origCssMargin"), G = function() {
                        j.css(z)
                    }, H = function() {
                        scrl.anims.push([j, z])
                    }), m >= 0 && (A[opts.d.marginRight] = k.data("_cfs_origCssMargin") + opts.padding[opts.d[1]], I = function() {
                        k.css(A)
                    }, J = function() {
                        scrl.anims.push([k, A])
                    })
                }
                O = function() {
                    $cfs.css(w)
                };
                var P = opts.items.visible + c - itms.total;
                N = function() {
                    if (P > 0 && ($cfs.children().slice(itms.total).remove(), g = $($cfs.children().slice(itms.total - (opts.items.visible - P)).get().concat($cfs.children().slice(0, P).get()))), sc_showHiddenItems(p), opts.usePadding) {
                        var a = $cfs.children().eq(opts.items.visible + c - 1);
                        a.css(opts.d.marginRight, a.data("_cfs_origCssMargin"))
                    }
                };
                var Q = sc_mapCallbackArguments(g, q, h, c, "prev", D, u);
                switch (M = function() {
                        sc_afterScroll($cfs, s, b), crsl.isScrolling = !1, clbk.onAfter = sc_fireCallbacks($tt0, b, "onAfter", Q, clbk), queu = sc_fireQueue($cfs, queu, conf), crsl.isPaused || $cfs.trigger(cf_e("play", conf))
                    }, crsl.isScrolling = !0, tmrs = sc_clearTimers(tmrs), clbk.onBefore = sc_fireCallbacks($tt0, b, "onBefore", Q, clbk), b.fx){case"none":
                        $cfs.css(w), E(), G(), I(), K(), O(), N(), M();
                        break;
                    case"fade":
                        scrl.anims.push([$cfs, {opacity: 0}, function() {
                                E(), G(), I(), K(), O(), N(), scrl = sc_setScroll(D, b.easing, conf), scrl.anims.push([$cfs, {opacity: 1}, M]), sc_startScroll(scrl, conf)
                            }]);
                        break;
                    case"crossfade":
                        $cfs.css({opacity: 0}), scrl.anims.push([s, {opacity: 0}]), scrl.anims.push([$cfs, {opacity: 1}, M]), F(), G(), I(), K(), O(), N();
                        break;
                    case"cover":
                        scrl.anims.push([s, w, function() {
                                G(), I(), K(), O(), N(), M()
                            }]), F();
                        break;
                    case"cover-fade":
                        scrl.anims.push([$cfs, {opacity: 0}]), scrl.anims.push([s, w, function() {
                                G(), I(), K(), O(), N(), M()
                            }]), F();
                        break;
                    case"uncover":
                        scrl.anims.push([s, x, M]), F(), G(), I(), K(), O(), N();
                        break;
                    case"uncover-fade":
                        $cfs.css({opacity: 0}), scrl.anims.push([$cfs, {opacity: 1}]), scrl.anims.push([s, x, M]), F(), G(), I(), K(), O(), N();
                        break;
                    default:
                        scrl.anims.push([$cfs, w, function() {
                                N(), M()
                            }]), F(), H(), J(), L()
                }
                return sc_startScroll(scrl, conf), cf_setCookie(opts.cookie, $cfs, conf), $cfs.trigger(cf_e("updatePageStatus", conf), [!1, u]), !0
            }), $cfs.bind(cf_e("slide_next", conf), function(a, b, c) {
                a.stopPropagation();
                var d = $cfs.children();
                if (!opts.circular && itms.first == opts.items.visible)
                    return opts.infinite && $cfs.trigger(cf_e("prev", conf), itms.total - 1), a.stopImmediatePropagation();
                if (sz_resetMargin(d, opts), !is_number(c)) {
                    if ("*" != opts.items.filter) {
                        var e = is_number(b.items) ? b.items : gn_getVisibleOrg($cfs, opts);
                        c = gn_getScrollItemsNextFilter(d, opts, 0, e)
                    } else
                        c = opts.items.visible;
                    c = cf_getAdjust(c, opts, b.items, $tt0)
                }
                var f = 0 == itms.first ? itms.total : itms.first;
                if (!opts.circular) {
                    if (opts.items.visibleConf.variable)
                        var g = gn_getVisibleItemsNext(d, opts, c), e = gn_getVisibleItemsPrev(d, opts, f - 1);
                    else
                        var g = opts.items.visible, e = opts.items.visible;
                    c + g > f && (c = f - e)
                }
                if (opts.items.visibleConf.old = opts.items.visible, opts.items.visibleConf.variable) {
                    for (var g = cf_getItemsAdjust(gn_getVisibleItemsNextTestCircular(d, opts, c, f), opts, opts.items.visibleConf.adjust, $tt0); opts.items.visible - c >= g && itms.total > c; )
                        c++, g = cf_getItemsAdjust(gn_getVisibleItemsNextTestCircular(d, opts, c, f), opts, opts.items.visibleConf.adjust, $tt0);
                    opts.items.visible = g
                } else if ("*" != opts.items.filter) {
                    var g = gn_getVisibleItemsNextFilter(d, opts, c);
                    opts.items.visible = cf_getItemsAdjust(g, opts, opts.items.visibleConf.adjust, $tt0)
                }
                if (sz_resetMargin(d, opts, !0), 0 == c)
                    return a.stopImmediatePropagation(), debug(conf, "0 items to scroll: Not scrolling.");
                for (debug(conf, "Scrolling " + c + " items forward."), itms.first -= c; 0 > itms.first; )
                    itms.first += itms.total;
                opts.circular || (itms.first == opts.items.visible && b.onEnd && b.onEnd.call($tt0, "next"), opts.infinite || nv_enableNavi(opts, itms.first, conf)), itms.total < opts.items.visible + c && $cfs.children().slice(0, opts.items.visible + c - itms.total).clone(!0).appendTo($cfs);
                var d = $cfs.children(), h = gi_getOldItemsNext(d, opts), i = gi_getNewItemsNext(d, opts, c), j = d.eq(c - 1), k = h.last(), l = i.last();
                sz_resetMargin(d, opts);
                var m = 0, n = 0;
                if (opts.align) {
                    var o = cf_getAlignPadding(i, opts);
                    m = o[0], n = o[1]
                }
                var p = !1, q = $();
                if (c > opts.items.visibleConf.old && (q = d.slice(opts.items.visibleConf.old, c), "directscroll" == b.fx)) {
                    var r = opts.items[opts.d.width];
                    p = q, j = k, sc_hideHiddenItems(p), opts.items[opts.d.width] = "variable"
                }
                var s = !1, t = ms_getTotalSize(d.slice(0, c), opts, "width"), u = cf_mapWrapperSizes(ms_getSizes(i, opts, !0), opts, !opts.usePadding), v = 0, w = {}, x = {}, y = {}, z = {}, A = {}, B = sc_getDuration(b, opts, c, t);
                switch (b.fx) {
                    case"uncover":
                    case"uncover-fade":
                        v = ms_getTotalSize(d.slice(0, opts.items.visibleConf.old), opts, "width")
                }
                p && (opts.items[opts.d.width] = r), opts.align && 0 > opts.padding[opts.d[1]] && (opts.padding[opts.d[1]] = 0), sz_resetMargin(d, opts, !0), sz_resetMargin(k, opts, opts.padding[opts.d[1]]), opts.align && (opts.padding[opts.d[1]] = n, opts.padding[opts.d[3]] = m), A[opts.d.left] = opts.usePadding ? opts.padding[opts.d[3]] : 0;
                var C = function() {
                }, D = function() {
                }, E = function() {
                }, F = function() {
                }, G = function() {
                }, H = function() {
                }, I = function() {
                }, J = function() {
                }, K = function() {
                };
                switch (b.fx) {
                    case"crossfade":
                    case"cover":
                    case"cover-fade":
                    case"uncover":
                    case"uncover-fade":
                        s = $cfs.clone(!0).appendTo($wrp), s.children().slice(opts.items.visibleConf.old).remove()
                }
                switch (b.fx) {
                    case"crossfade":
                    case"cover":
                    case"cover-fade":
                        $cfs.css("zIndex", 1), s.css("zIndex", 0)
                }
                if (scrl = sc_setScroll(B, b.easing, conf), w[opts.d.left] = -t, x[opts.d.left] = -v, 0 > m && (w[opts.d.left] += m), ("variable" == opts[opts.d.width] || "variable" == opts[opts.d.height]) && (C = function() {
                    $wrp.css(u)
                }, D = function() {
                    scrl.anims.push([$wrp, u])
                }), opts.usePadding) {
                    var L = l.data("_cfs_origCssMargin");
                    n >= 0 && (L += opts.padding[opts.d[1]]), l.css(opts.d.marginRight, L), j.not(k).length && (z[opts.d.marginRight] = k.data("_cfs_origCssMargin")), E = function() {
                        k.css(z)
                    }, F = function() {
                        scrl.anims.push([k, z])
                    };
                    var M = j.data("_cfs_origCssMargin");
                    m > 0 && (M += opts.padding[opts.d[3]]), y[opts.d.marginRight] = M, G = function() {
                        j.css(y)
                    }, H = function() {
                        scrl.anims.push([j, y])
                    }
                }
                K = function() {
                    $cfs.css(A)
                };
                var N = opts.items.visible + c - itms.total;
                J = function() {
                    N > 0 && $cfs.children().slice(itms.total).remove();
                    var a = $cfs.children().slice(0, c).appendTo($cfs).last();
                    if (N > 0 && (i = gi_getCurrentItems(d, opts)), sc_showHiddenItems(p), opts.usePadding) {
                        if (itms.total < opts.items.visible + c) {
                            var b = $cfs.children().eq(opts.items.visible - 1);
                            b.css(opts.d.marginRight, b.data("_cfs_origCssMargin") + opts.padding[opts.d[1]])
                        }
                        a.css(opts.d.marginRight, a.data("_cfs_origCssMargin"))
                    }
                };
                var O = sc_mapCallbackArguments(h, q, i, c, "next", B, u);
                switch (I = function() {
                        $cfs.css("zIndex", $cfs.data("_cfs_origCssZindex")), sc_afterScroll($cfs, s, b), crsl.isScrolling = !1, clbk.onAfter = sc_fireCallbacks($tt0, b, "onAfter", O, clbk), queu = sc_fireQueue($cfs, queu, conf), crsl.isPaused || $cfs.trigger(cf_e("play", conf))
                    }, crsl.isScrolling = !0, tmrs = sc_clearTimers(tmrs), clbk.onBefore = sc_fireCallbacks($tt0, b, "onBefore", O, clbk), b.fx){case"none":
                        $cfs.css(w), C(), E(), G(), K(), J(), I();
                        break;
                    case"fade":
                        scrl.anims.push([$cfs, {opacity: 0}, function() {
                                C(), E(), G(), K(), J(), scrl = sc_setScroll(B, b.easing, conf), scrl.anims.push([$cfs, {opacity: 1}, I]), sc_startScroll(scrl, conf)
                            }]);
                        break;
                    case"crossfade":
                        $cfs.css({opacity: 0}), scrl.anims.push([s, {opacity: 0}]), scrl.anims.push([$cfs, {opacity: 1}, I]), D(), E(), G(), K(), J();
                        break;
                    case"cover":
                        $cfs.css(opts.d.left, $wrp[opts.d.width]()), scrl.anims.push([$cfs, A, I]), D(), E(), G(), J();
                        break;
                    case"cover-fade":
                        $cfs.css(opts.d.left, $wrp[opts.d.width]()), scrl.anims.push([s, {opacity: 0}]), scrl.anims.push([$cfs, A, I]), D(), E(), G(), J();
                        break;
                    case"uncover":
                        scrl.anims.push([s, x, I]), D(), E(), G(), K(), J();
                        break;
                    case"uncover-fade":
                        $cfs.css({opacity: 0}), scrl.anims.push([$cfs, {opacity: 1}]), scrl.anims.push([s, x, I]), D(), E(), G(), K(), J();
                        break;
                    default:
                        scrl.anims.push([$cfs, w, function() {
                                K(), J(), I()
                            }]), D(), F(), H()
                }
                return sc_startScroll(scrl, conf), cf_setCookie(opts.cookie, $cfs, conf), $cfs.trigger(cf_e("updatePageStatus", conf), [!1, u]), !0
            }), $cfs.bind(cf_e("slideTo", conf), function(a, b, c, d, e, f, g) {
                a.stopPropagation();
                var h = [b, c, d, e, f, g], i = ["string/number/object", "number", "boolean", "object", "string", "function"], j = cf_sortParams(h, i);
                return e = j[3], f = j[4], g = j[5], b = gn_getItemIndex(j[0], j[1], j[2], itms, $cfs), 0 == b ? !1 : (is_object(e) || (e = !1), "prev" != f && "next" != f && (f = opts.circular ? itms.total / 2 >= b ? "next" : "prev" : 0 == itms.first || itms.first > b ? "next" : "prev"), "prev" == f && (b = itms.total - b), $cfs.trigger(cf_e(f, conf), [e, b, g]), !0)
            }), $cfs.bind(cf_e("prevPage", conf), function(a, b, c) {
                a.stopPropagation();
                var d = $cfs.triggerHandler(cf_e("currentPage", conf));
                return $cfs.triggerHandler(cf_e("slideToPage", conf), [d - 1, b, "prev", c])
            }), $cfs.bind(cf_e("nextPage", conf), function(a, b, c) {
                a.stopPropagation();
                var d = $cfs.triggerHandler(cf_e("currentPage", conf));
                return $cfs.triggerHandler(cf_e("slideToPage", conf), [d + 1, b, "next", c])
            }), $cfs.bind(cf_e("slideToPage", conf), function(a, b, c, d, e) {
                a.stopPropagation(), is_number(b) || (b = $cfs.triggerHandler(cf_e("currentPage", conf)));
                var f = opts.pagination.items || opts.items.visible, g = Math.ceil(itms.total / f) - 1;
                return 0 > b && (b = g), b > g && (b = 0), $cfs.triggerHandler(cf_e("slideTo", conf), [b * f, 0, !0, c, d, e])
            }), $cfs.bind(cf_e("jumpToStart", conf), function(a, b) {
                if (a.stopPropagation(), b = b ? gn_getItemIndex(b, 0, !0, itms, $cfs) : 0, b += itms.first, 0 != b) {
                    if (itms.total > 0)
                        for (; b > itms.total; )
                            b -= itms.total;
                    $cfs.prepend($cfs.children().slice(b, itms.total))
                }
                return!0
            }), $cfs.bind(cf_e("synchronise", conf), function(a, b) {
                if (a.stopPropagation(), b)
                    b = cf_getSynchArr(b);
                else {
                    if (!opts.synchronise)
                        return debug(conf, "No carousel to synchronise.");
                    b = opts.synchronise
                }
                for (var c = $cfs.triggerHandler(cf_e("currentPosition", conf)), d = !0, e = 0, f = b.length; f > e; e++)
                    b[e][0].triggerHandler(cf_e("slideTo", conf), [c, b[e][3], !0]) || (d = !1);
                return d
            }), $cfs.bind(cf_e("queue", conf), function(a, b, c) {
                return a.stopPropagation(), is_function(b) ? b.call($tt0, queu) : is_array(b) ? queu = b : is_undefined(b) || queu.push([b, c]), queu
            }), $cfs.bind(cf_e("insertItem", conf), function(a, b, c, d, e) {
                a.stopPropagation();
                var f = [b, c, d, e], g = ["string/object", "string/number/object", "boolean", "number"], h = cf_sortParams(f, g);
                if (b = h[0], c = h[1], d = h[2], e = h[3], is_object(b) && !is_jquery(b) ? b = $(b) : is_string(b) && (b = $(b)), !is_jquery(b) || 0 == b.length)
                    return debug(conf, "Not a valid object.");
                is_undefined(c) && (c = "end"), sz_storeMargin(b, opts), sz_storeOrigCss(b);
                var i = c, j = "before";
                "end" == c ? d ? (0 == itms.first ? (c = itms.total - 1, j = "after") : (c = itms.first, itms.first += b.length), 0 > c && (c = 0)) : (c = itms.total - 1, j = "after") : c = gn_getItemIndex(c, e, d, itms, $cfs);
                var k = $cfs.children().eq(c);
                return k.length ? k[j](b) : (debug(conf, "Correct insert-position not found! Appending item to the end."), $cfs.append(b)), "end" == i || d || itms.first > c && (itms.first += b.length), itms.total = $cfs.children().length, itms.first >= itms.total && (itms.first -= itms.total), $cfs.trigger(cf_e("updateSizes", conf)), $cfs.trigger(cf_e("linkAnchors", conf)), !0
            }), $cfs.bind(cf_e("removeItem", conf), function(a, b, c, d) {
                a.stopPropagation();
                var e = [b, c, d], f = ["string/number/object", "boolean", "number"], g = cf_sortParams(e, f);
                if (b = g[0], c = g[1], d = g[2], b instanceof $ && b.length > 1)
                    return i = $(), b.each(function() {
                        var e = $cfs.trigger(cf_e("removeItem", conf), [$(this), c, d]);
                        e && (i = i.add(e))
                    }), i;
                if (is_undefined(b) || "end" == b)
                    i = $cfs.children().last();
                else {
                    b = gn_getItemIndex(b, d, c, itms, $cfs);
                    var i = $cfs.children().eq(b);
                    i.length && itms.first > b && (itms.first -= i.length)
                }
                return i && i.length && (i.detach(), itms.total = $cfs.children().length, $cfs.trigger(cf_e("updateSizes", conf))), i
            }), $cfs.bind(cf_e("onBefore", conf) + " " + cf_e("onAfter", conf), function(a, b) {
                a.stopPropagation();
                var c = a.type.slice(conf.events.prefix.length);
                return is_array(b) && (clbk[c] = b), is_function(b) && clbk[c].push(b), clbk[c]
            }), $cfs.bind(cf_e("currentPosition", conf), function(a, b) {
                if (a.stopPropagation(), 0 == itms.first)
                    var c = 0;
                else
                    var c = itms.total - itms.first;
                return is_function(b) && b.call($tt0, c), c
            }), $cfs.bind(cf_e("currentPage", conf), function(a, b) {
                a.stopPropagation();
                var e, c = opts.pagination.items || opts.items.visible, d = Math.ceil(itms.total / c - 1);
                return e = 0 == itms.first ? 0 : itms.first < itms.total % c ? 0 : itms.first != c || opts.circular ? Math.round((itms.total - itms.first) / c) : d, 0 > e && (e = 0), e > d && (e = d), is_function(b) && b.call($tt0, e), e
            }), $cfs.bind(cf_e("currentVisible", conf), function(a, b) {
                a.stopPropagation();
                var c = gi_getCurrentItems($cfs.children(), opts);
                return is_function(b) && b.call($tt0, c), c
            }), $cfs.bind(cf_e("slice", conf), function(a, b, c, d) {
                if (a.stopPropagation(), 0 == itms.total)
                    return!1;
                var e = [b, c, d], f = ["number", "number", "function"], g = cf_sortParams(e, f);
                if (b = is_number(g[0]) ? g[0] : 0, c = is_number(g[1]) ? g[1] : itms.total, d = g[2], b += itms.first, c += itms.first, items.total > 0) {
                    for (; b > itms.total; )
                        b -= itms.total;
                    for (; c > itms.total; )
                        c -= itms.total;
                    for (; 0 > b; )
                        b += itms.total;
                    for (; 0 > c; )
                        c += itms.total
                }
                var i, h = $cfs.children();
                return i = c > b ? h.slice(b, c) : $(h.slice(b, itms.total).get().concat(h.slice(0, c).get())), is_function(d) && d.call($tt0, i), i
            }), $cfs.bind(cf_e("isPaused", conf) + " " + cf_e("isStopped", conf) + " " + cf_e("isScrolling", conf), function(a, b) {
                a.stopPropagation();
                var c = a.type.slice(conf.events.prefix.length), d = crsl[c];
                return is_function(b) && b.call($tt0, d), d
            }), $cfs.bind(cf_e("configuration", conf), function(e, a, b, c) {
                e.stopPropagation();
                var reInit = !1;
                if (is_function(a))
                    a.call($tt0, opts);
                else if (is_object(a))
                    opts_orig = $.extend(!0, {}, opts_orig, a), b !== !1 ? reInit = !0 : opts = $.extend(!0, {}, opts, a);
                else if (!is_undefined(a))
                    if (is_function(b)) {
                        var val = eval("opts." + a);
                        is_undefined(val) && (val = ""), b.call($tt0, val)
                    } else {
                        if (is_undefined(b))
                            return eval("opts." + a);
                        "boolean" != typeof c && (c = !0), eval("opts_orig." + a + " = b"), c !== !1 ? reInit = !0 : eval("opts." + a + " = b")
                    }
                if (reInit) {
                    sz_resetMargin($cfs.children(), opts), FN._init(opts_orig), FN._bind_buttons();
                    var sz = sz_setSizes($cfs, opts);
                    $cfs.trigger(cf_e("updatePageStatus", conf), [!0, sz])
                }
                return opts
            }), $cfs.bind(cf_e("linkAnchors", conf), function(a, b, c) {
                return a.stopPropagation(), is_undefined(b) ? b = $("body") : is_string(b) && (b = $(b)), is_jquery(b) && 0 != b.length ? (is_string(c) || (c = "a.caroufredsel"), b.find(c).each(function() {
                    var a = this.hash || "";
                    a.length > 0 && -1 != $cfs.children().index($(a)) && $(this).unbind("click").click(function(b) {
                        b.preventDefault(), $cfs.trigger(cf_e("slideTo", conf), a)
                    })
                }), !0) : debug(conf, "Not a valid object.")
            }), $cfs.bind(cf_e("updatePageStatus", conf), function(a, b) {
                if (a.stopPropagation(), opts.pagination.container) {
                    var d = opts.pagination.items || opts.items.visible, e = Math.ceil(itms.total / d);
                    b && (opts.pagination.anchorBuilder && (opts.pagination.container.children().remove(), opts.pagination.container.each(function() {
                        for (var a = 0; e > a; a++) {
                            var b = $cfs.children().eq(gn_getItemIndex(a * d, 0, !0, itms, $cfs));
                            $(this).append(opts.pagination.anchorBuilder.call(b[0], a + 1))
                        }
                    })), opts.pagination.container.each(function() {
                        $(this).children().unbind(opts.pagination.event).each(function(a) {
                            $(this).bind(opts.pagination.event, function(b) {
                                b.preventDefault(), $cfs.trigger(cf_e("slideTo", conf), [a * d, -opts.pagination.deviation, !0, opts.pagination])
                            })
                        })
                    }));
                    var f = $cfs.triggerHandler(cf_e("currentPage", conf)) + opts.pagination.deviation;
                    return f >= e && (f = 0), 0 > f && (f = e - 1), opts.pagination.container.each(function() {
                        $(this).children().removeClass(cf_c("selected", conf)).eq(f).addClass(cf_c("selected", conf))
                    }), !0
                }
            }), $cfs.bind(cf_e("updateSizes", conf), function() {
                var b = opts.items.visible, c = $cfs.children(), d = ms_getParentSize($wrp, opts, "width");
                if (itms.total = c.length, crsl.primarySizePercentage ? (opts.maxDimension = d, opts[opts.d.width] = ms_getPercentage(d, crsl.primarySizePercentage)) : opts.maxDimension = ms_getMaxDimension(opts, d), opts.responsive ? (opts.items.width = opts.items.sizesConf.width, opts.items.height = opts.items.sizesConf.height, opts = in_getResponsiveValues(opts, c, d), b = opts.items.visible, sz_setResponsiveSizes(opts, c)) : opts.items.visibleConf.variable ? b = gn_getVisibleItemsNext(c, opts, 0) : "*" != opts.items.filter && (b = gn_getVisibleItemsNextFilter(c, opts, 0)), !opts.circular && 0 != itms.first && b > itms.first) {
                    if (opts.items.visibleConf.variable)
                        var e = gn_getVisibleItemsPrev(c, opts, itms.first) - itms.first;
                    else if ("*" != opts.items.filter)
                        var e = gn_getVisibleItemsPrevFilter(c, opts, itms.first) - itms.first;
                    else
                        var e = opts.items.visible - itms.first;
                    debug(conf, "Preventing non-circular: sliding " + e + " items backward."), $cfs.trigger(cf_e("prev", conf), e)
                }
                opts.items.visible = cf_getItemsAdjust(b, opts, opts.items.visibleConf.adjust, $tt0), opts.items.visibleConf.old = opts.items.visible, opts = in_getAlignPadding(opts, c);
                var f = sz_setSizes($cfs, opts);
                return $cfs.trigger(cf_e("updatePageStatus", conf), [!0, f]), nv_showNavi(opts, itms.total, conf), nv_enableNavi(opts, itms.first, conf), f
            }), $cfs.bind(cf_e("destroy", conf), function(a, b) {
                return a.stopPropagation(), tmrs = sc_clearTimers(tmrs), $cfs.data("_cfs_isCarousel", !1), $cfs.trigger(cf_e("finish", conf)), b && $cfs.trigger(cf_e("jumpToStart", conf)), sz_restoreOrigCss($cfs.children()), sz_restoreOrigCss($cfs), FN._unbind_events(), FN._unbind_buttons(), "parent" == conf.wrapper ? sz_restoreOrigCss($wrp) : $wrp.replaceWith($cfs), !0
            }), $cfs.bind(cf_e("debug", conf), function() {
                return debug(conf, "Carousel width: " + opts.width), debug(conf, "Carousel height: " + opts.height), debug(conf, "Item widths: " + opts.items.width), debug(conf, "Item heights: " + opts.items.height), debug(conf, "Number of items visible: " + opts.items.visible), opts.auto.play && debug(conf, "Number of items scrolled automatically: " + opts.auto.items), opts.prev.button && debug(conf, "Number of items scrolled backward: " + opts.prev.items), opts.next.button && debug(conf, "Number of items scrolled forward: " + opts.next.items), conf.debug
            }), $cfs.bind("_cfs_triggerEvent", function(a, b, c) {
                return a.stopPropagation(), $cfs.triggerHandler(cf_e(b, conf), c)
            })
        }, FN._unbind_events = function() {
            $cfs.unbind(cf_e("", conf)), $cfs.unbind(cf_e("", conf, !1)), $cfs.unbind("_cfs_triggerEvent")
        }, FN._bind_buttons = function() {
            if (FN._unbind_buttons(), nv_showNavi(opts, itms.total, conf), nv_enableNavi(opts, itms.first, conf), opts.auto.pauseOnHover) {
                var a = bt_pauseOnHoverConfig(opts.auto.pauseOnHover);
                $wrp.bind(cf_e("mouseenter", conf, !1), function() {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function() {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if (opts.auto.button && opts.auto.button.bind(cf_e(opts.auto.event, conf, !1), function(a) {
                a.preventDefault();
                var b = !1, c = null;
                crsl.isPaused ? b = "play" : opts.auto.pauseOnEvent && (b = "pause", c = bt_pauseOnHoverConfig(opts.auto.pauseOnEvent)), b && $cfs.trigger(cf_e(b, conf), c)
            }), opts.prev.button && (opts.prev.button.bind(cf_e(opts.prev.event, conf, !1), function(a) {
                a.preventDefault(), $cfs.trigger(cf_e("prev", conf))
            }), opts.prev.pauseOnHover)) {
                var a = bt_pauseOnHoverConfig(opts.prev.pauseOnHover);
                opts.prev.button.bind(cf_e("mouseenter", conf, !1), function() {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function() {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if (opts.next.button && (opts.next.button.bind(cf_e(opts.next.event, conf, !1), function(a) {
                a.preventDefault(), $cfs.trigger(cf_e("next", conf))
            }), opts.next.pauseOnHover)) {
                var a = bt_pauseOnHoverConfig(opts.next.pauseOnHover);
                opts.next.button.bind(cf_e("mouseenter", conf, !1), function() {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function() {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if (opts.pagination.container && opts.pagination.pauseOnHover) {
                var a = bt_pauseOnHoverConfig(opts.pagination.pauseOnHover);
                opts.pagination.container.bind(cf_e("mouseenter", conf, !1), function() {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function() {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if ((opts.prev.key || opts.next.key) && $(document).bind(cf_e("keyup", conf, !1, !0, !0), function(a) {
                var b = a.keyCode;
                b == opts.next.key && (a.preventDefault(), $cfs.trigger(cf_e("next", conf))), b == opts.prev.key && (a.preventDefault(), $cfs.trigger(cf_e("prev", conf)))
            }), opts.pagination.keys && $(document).bind(cf_e("keyup", conf, !1, !0, !0), function(a) {
                var b = a.keyCode;
                b >= 49 && 58 > b && (b = (b - 49) * opts.items.visible, itms.total >= b && (a.preventDefault(), $cfs.trigger(cf_e("slideTo", conf), [b, 0, !0, opts.pagination])))
            }), $.fn.swipe) {
                var b = "ontouchstart"in window;
                if (b && opts.swipe.onTouch || !b && opts.swipe.onMouse) {
                    var c = $.extend(!0, {}, opts.prev, opts.swipe), d = $.extend(!0, {}, opts.next, opts.swipe), e = function() {
                        $cfs.trigger(cf_e("prev", conf), [c])
                    }, f = function() {
                        $cfs.trigger(cf_e("next", conf), [d])
                    };
                    switch (opts.direction) {
                        case"up":
                        case"down":
                            opts.swipe.options.swipeUp = f, opts.swipe.options.swipeDown = e;
                            break;
                        default:
                            opts.swipe.options.swipeLeft = f, opts.swipe.options.swipeRight = e
                    }
                    crsl.swipe && $cfs.swipe("destroy"), $wrp.swipe(opts.swipe.options), $wrp.css("cursor", "move"), crsl.swipe = !0
                }
            }
            if ($.fn.mousewheel && opts.mousewheel) {
                var g = $.extend(!0, {}, opts.prev, opts.mousewheel), h = $.extend(!0, {}, opts.next, opts.mousewheel);
                crsl.mousewheel && $wrp.unbind(cf_e("mousewheel", conf, !1)), $wrp.bind(cf_e("mousewheel", conf, !1), function(a, b) {
                    a.preventDefault(), b > 0 ? $cfs.trigger(cf_e("prev", conf), [g]) : $cfs.trigger(cf_e("next", conf), [h])
                }), crsl.mousewheel = !0
            }
            if (opts.auto.play && $cfs.trigger(cf_e("play", conf), opts.auto.delay), crsl.upDateOnWindowResize) {
                var i = function() {
                    $cfs.trigger(cf_e("finish", conf)), opts.auto.pauseOnResize && !crsl.isPaused && $cfs.trigger(cf_e("play", conf)), sz_resetMargin($cfs.children(), opts), $cfs.trigger(cf_e("updateSizes", conf))
                }, j = $(window), k = null;
                if ($.debounce && "debounce" == conf.onWindowResize)
                    k = $.debounce(200, i);
                else if ($.throttle && "throttle" == conf.onWindowResize)
                    k = $.throttle(300, i);
                else {
                    var l = 0, m = 0;
                    k = function() {
                        var a = j.width(), b = j.height();
                        (a != l || b != m) && (i(), l = a, m = b)
                    }
                }
                j.bind(cf_e("resize", conf, !1, !0, !0), k)
            }
        }, FN._unbind_buttons = function() {
            var b = (cf_e("", conf), cf_e("", conf, !1));
            ns3 = cf_e("", conf, !1, !0, !0), $(document).unbind(ns3), $(window).unbind(ns3), $wrp.unbind(b), opts.auto.button && opts.auto.button.unbind(b), opts.prev.button && opts.prev.button.unbind(b), opts.next.button && opts.next.button.unbind(b), opts.pagination.container && (opts.pagination.container.unbind(b), opts.pagination.anchorBuilder && opts.pagination.container.children().remove()), crsl.swipe && ($cfs.swipe("destroy"), $wrp.css("cursor", "default"), crsl.swipe = !1), crsl.mousewheel && (crsl.mousewheel = !1), nv_showNavi(opts, "hide", conf), nv_enableNavi(opts, "removeClass", conf)
        }, is_boolean(configs) && (configs = {debug: configs});
        var crsl = {direction: "next", isPaused: !0, isScrolling: !1, isStopped: !1, mousewheel: !1, swipe: !1}, itms = {total: $cfs.children().length, first: 0}, tmrs = {auto: null, progress: null, startTime: getTime(), timePassed: 0}, scrl = {isStopped: !1, duration: 0, startTime: 0, easing: "", anims: []}, clbk = {onBefore: [], onAfter: []}, queu = [], conf = $.extend(!0, {}, $.fn.carouFredSel.configs, configs), opts = {}, opts_orig = $.extend(!0, {}, options), $wrp = "parent" == conf.wrapper ? $cfs.parent() : $cfs.wrap("<" + conf.wrapper.element + ' class="' + conf.wrapper.classname + '" />').parent();
        if (conf.selector = $cfs.selector, conf.serialNumber = $.fn.carouFredSel.serialNumber++, conf.transition = conf.transition && $.fn.transition ? "transition" : "animate", FN._init(opts_orig, !0, starting_position), FN._build(), FN._bind_events(), FN._bind_buttons(), is_array(opts.items.start))
            var start_arr = opts.items.start;
        else {
            var start_arr = [];
            0 != opts.items.start && start_arr.push(opts.items.start)
        }
        if (opts.cookie && start_arr.unshift(parseInt(cf_getCookie(opts.cookie), 10)), start_arr.length > 0)
            for (var a = 0, l = start_arr.length; l > a; a++) {
                var s = start_arr[a];
                if (0 != s) {
                    if (s === !0) {
                        if (s = window.location.hash, 1 > s.length)
                            continue
                    } else
                        "random" === s && (s = Math.floor(Math.random() * itms.total));
                    if ($cfs.triggerHandler(cf_e("slideTo", conf), [s, 0, !0, {fx: "none"}]))
                        break
                }
            }
        var siz = sz_setSizes($cfs, opts), itm = gi_getCurrentItems($cfs.children(), opts);
        return opts.onCreate && opts.onCreate.call($tt0, {width: siz.width, height: siz.height, items: itm}), $cfs.trigger(cf_e("updatePageStatus", conf), [!0, siz]), $cfs.trigger(cf_e("linkAnchors", conf)), conf.debug && $cfs.trigger(cf_e("debug", conf)), $cfs
    }, $.fn.carouFredSel.serialNumber = 1, $.fn.carouFredSel.defaults = {synchronise: !1, infinite: !0, circular: !0, responsive: !1, direction: "left", items: {start: 0}, scroll: {easing: "swing", duration: 500, pauseOnHover: !1, event: "click", queue: !1}}, $.fn.carouFredSel.configs = {debug: !1, transition: !1, onWindowResize: "throttle", events: {prefix: "", namespace: "cfs"}, wrapper: {element: "div", classname: "caroufredsel_wrapper"}, classnames: {}}, $.fn.carouFredSel.pageAnchorBuilder = function(a) {
        return'<a href="#"><span>' + a + "</span></a>"
    }, $.fn.carouFredSel.progressbarUpdater = function(a) {
        $(this).css("width", a + "%")
    }, $.fn.carouFredSel.cookie = {get: function(a) {
            a += "=";
            for (var b = document.cookie.split(";"), c = 0, d = b.length; d > c; c++) {
                for (var e = b[c]; " " == e.charAt(0); )
                    e = e.slice(1);
                if (0 == e.indexOf(a))
                    return e.slice(a.length)
            }
            return 0
        }, set: function(a, b, c) {
            var d = "";
            if (c) {
                var e = new Date;
                e.setTime(e.getTime() + 1e3 * 60 * 60 * 24 * c), d = "; expires=" + e.toGMTString()
            }
            document.cookie = a + "=" + b + d + "; path=/"
        }, remove: function(a) {
            $.fn.carouFredSel.cookie.set(a, "", -1)
        }}, $.extend($.easing, {quadratic: function(a) {
            var b = a * a;
            return a * (-b * a + 4 * b - 6 * a + 4)
        }, cubic: function(a) {
            return a * (4 * a * a - 9 * a + 6)
        }, elastic: function(a) {
            var b = a * a;
            return a * (33 * b * b - 106 * b * a + 126 * b - 67 * a + 15)
        }}))
})(jQuery);/*
 * jQuery Cycle2; v20130525
 * http://jquery.malsup.com/cycle2/
 * Copyright (c) 2013 M. Alsup; Dual licensed: MIT/GPL
 */
(function(e) {
    "use strict";
    function t(e) {
        return(e || "").toLowerCase()
    }
    var i = "20130409";
    e.fn.cycle = function(i) {
        var n;
        return 0 !== this.length || e.isReady ? this.each(function() {
            var n, s, o, c, r = e(this), l = e.fn.cycle.log;
            if (!r.data("cycle.opts")) {
                (r.data("cycle-log") === !1 || i && i.log === !1 || s && s.log === !1) && (l = e.noop), l("--c2 init--"), n = r.data();
                for (var a in n)
                    n.hasOwnProperty(a) && /^cycle[A-Z]+/.test(a) && (c = n[a], o = a.match(/^cycle(.*)/)[1].replace(/^[A-Z]/, t), l(o + ":", c, "(" + typeof c + ")"), n[o] = c);
                s = e.extend({}, e.fn.cycle.defaults, n, i || {}), s.timeoutId = 0, s.paused = s.paused || !1, s.container = r, s._maxZ = s.maxZ, s.API = e.extend({_container: r}, e.fn.cycle.API), s.API.log = l, s.API.trigger = function(e, t) {
                    return s.container.trigger(e, t), s.API
                }, r.data("cycle.opts", s), r.data("cycle.API", s.API), s.API.trigger("cycle-bootstrap", [s, s.API]), s.API.addInitialSlides(), s.API.preInitSlideshow(), s.slides.length && s.API.initSlideshow()
            }
        }) : (n = {s: this.selector, c: this.context}, e.fn.cycle.log("requeuing slideshow (dom not ready)"), e(function() {
            e(n.s, n.c).cycle(i)
        }), this)
    }, e.fn.cycle.API = {opts: function() {
            return this._container.data("cycle.opts")
        }, addInitialSlides: function() {
            var t = this.opts(), i = t.slides;
            t.slideCount = 0, t.slides = e(), i = i.jquery ? i : t.container.find(i), t.random && i.sort(function() {
                return Math.random() - .5
            }), t.API.add(i)
        }, preInitSlideshow: function() {
            var t = this.opts();
            t.API.trigger("cycle-pre-initialize", [t]);
            var i = e.fn.cycle.transitions[t.fx];
            i && e.isFunction(i.preInit) && i.preInit(t), t._preInitialized = !0
        }, postInitSlideshow: function() {
            var t = this.opts();
            t.API.trigger("cycle-post-initialize", [t]);
            var i = e.fn.cycle.transitions[t.fx];
            i && e.isFunction(i.postInit) && i.postInit(t)
        }, initSlideshow: function() {
            var t, i = this.opts(), n = i.container;
            i.API.calcFirstSlide(), "static" == i.container.css("position") && i.container.css("position", "relative"), e(i.slides[i.currSlide]).css("opacity", 1).show(), i.API.stackSlides(i.slides[i.currSlide], i.slides[i.nextSlide], !i.reverse), i.pauseOnHover && (i.pauseOnHover !== !0 && (n = e(i.pauseOnHover)), n.hover(function() {
                i.API.pause(!0)
            }, function() {
                i.API.resume(!0)
            })), i.timeout && (t = i.API.getSlideOpts(i.nextSlide), i.API.queueTransition(t, t.timeout + i.delay)), i._initialized = !0, i.API.updateView(!0), i.API.trigger("cycle-initialized", [i]), i.API.postInitSlideshow()
        }, pause: function(t) {
            var i = this.opts(), n = i.API.getSlideOpts(), s = i.hoverPaused || i.paused;
            t ? i.hoverPaused = !0 : i.paused = !0, s || (i.container.addClass("cycle-paused"), i.API.trigger("cycle-paused", [i]).log("cycle-paused"), n.timeout && (clearTimeout(i.timeoutId), i.timeoutId = 0, i._remainingTimeout -= e.now() - i._lastQueue, (0 > i._remainingTimeout || isNaN(i._remainingTimeout)) && (i._remainingTimeout = void 0)))
        }, resume: function(e) {
            var t = this.opts(), i = !t.hoverPaused && !t.paused;
            e ? t.hoverPaused = !1 : t.paused = !1, i || (t.container.removeClass("cycle-paused"), t.API.queueTransition(t.API.getSlideOpts(), t._remainingTimeout), t.API.trigger("cycle-resumed", [t, t._remainingTimeout]).log("cycle-resumed"))
        }, add: function(t, i) {
            var n, s = this.opts(), o = s.slideCount, c = !1;
            "string" == e.type(t) && (t = e.trim(t)), e(t).each(function() {
                var t, n = e(this);
                i ? s.container.prepend(n) : s.container.append(n), s.slideCount++, t = s.API.buildSlideOpts(n), s.slides = i ? e(n).add(s.slides) : s.slides.add(n), s.API.initSlide(t, n, --s._maxZ), n.data("cycle.opts", t), s.API.trigger("cycle-slide-added", [s, t, n])
            }), s.API.updateView(!0), c = s._preInitialized && 2 > o && s.slideCount >= 1, c && (s._initialized ? s.timeout && (n = s.slides.length, s.nextSlide = s.reverse ? n - 1 : 1, s.timeoutId || s.API.queueTransition(s)) : s.API.initSlideshow())
        }, calcFirstSlide: function() {
            var e, t = this.opts();
            e = parseInt(t.startingSlide || 0, 10), (e >= t.slides.length || 0 > e) && (e = 0), t.currSlide = e, t.reverse ? (t.nextSlide = e - 1, 0 > t.nextSlide && (t.nextSlide = t.slides.length - 1)) : (t.nextSlide = e + 1, t.nextSlide == t.slides.length && (t.nextSlide = 0))
        }, calcNextSlide: function() {
            var e, t = this.opts();
            t.reverse ? (e = 0 > t.nextSlide - 1, t.nextSlide = e ? t.slideCount - 1 : t.nextSlide - 1, t.currSlide = e ? 0 : t.nextSlide + 1) : (e = t.nextSlide + 1 == t.slides.length, t.nextSlide = e ? 0 : t.nextSlide + 1, t.currSlide = e ? t.slides.length - 1 : t.nextSlide - 1)
        }, calcTx: function(t, i) {
            var n, s = t;
            return i && s.manualFx && (n = e.fn.cycle.transitions[s.manualFx]), n || (n = e.fn.cycle.transitions[s.fx]), n || (n = e.fn.cycle.transitions.fade, s.API.log('Transition "' + s.fx + '" not found.  Using fade.')), n
        }, prepareTx: function(e, t) {
            var i, n, s, o, c, r = this.opts();
            return 2 > r.slideCount ? (r.timeoutId = 0, void 0) : (!e || r.busy && !r.manualTrump || (r.API.stopTransition(), r.busy = !1, clearTimeout(r.timeoutId), r.timeoutId = 0), r.busy || (0 !== r.timeoutId || e) && (n = r.slides[r.currSlide], s = r.slides[r.nextSlide], o = r.API.getSlideOpts(r.nextSlide), c = r.API.calcTx(o, e), r._tx = c, e && void 0 !== o.manualSpeed && (o.speed = o.manualSpeed), r.nextSlide != r.currSlide && (e || !r.paused && !r.hoverPaused && r.timeout) ? (r.API.trigger("cycle-before", [o, n, s, t]), c.before && c.before(o, n, s, t), i = function() {
                r.busy = !1, r.container.data("cycle.opts") && (c.after && c.after(o, n, s, t), r.API.trigger("cycle-after", [o, n, s, t]), r.API.queueTransition(o), r.API.updateView(!0))
            }, r.busy = !0, c.transition ? c.transition(o, n, s, t, i) : r.API.doTransition(o, n, s, t, i), r.API.calcNextSlide(), r.API.updateView()) : r.API.queueTransition(o)), void 0)
        }, doTransition: function(t, i, n, s, o) {
            var c = t, r = e(i), l = e(n), a = function() {
                l.animate(c.animIn || {opacity: 1}, c.speed, c.easeIn || c.easing, o)
            };
            l.css(c.cssBefore || {}), r.animate(c.animOut || {}, c.speed, c.easeOut || c.easing, function() {
                r.css(c.cssAfter || {}), c.sync || a()
            }), c.sync && a()
        }, queueTransition: function(t, i) {
            var n = this.opts(), s = void 0 !== i ? i : t.timeout;
            return 0 === n.nextSlide && 0 === --n.loop ? (n.API.log("terminating; loop=0"), n.timeout = 0, s ? setTimeout(function() {
                n.API.trigger("cycle-finished", [n])
            }, s) : n.API.trigger("cycle-finished", [n]), n.nextSlide = n.currSlide, void 0) : (s && (n._lastQueue = e.now(), void 0 === i && (n._remainingTimeout = t.timeout), n.paused || n.hoverPaused || (n.timeoutId = setTimeout(function() {
                n.API.prepareTx(!1, !n.reverse)
            }, s))), void 0)
        }, stopTransition: function() {
            var e = this.opts();
            e.slides.filter(":animated").length && (e.slides.stop(!1, !0), e.API.trigger("cycle-transition-stopped", [e])), e._tx && e._tx.stopTransition && e._tx.stopTransition(e)
        }, advanceSlide: function(e) {
            var t = this.opts();
            return clearTimeout(t.timeoutId), t.timeoutId = 0, t.nextSlide = t.currSlide + e, 0 > t.nextSlide ? t.nextSlide = t.slides.length - 1 : t.nextSlide >= t.slides.length && (t.nextSlide = 0), t.API.prepareTx(!0, e >= 0), !1
        }, buildSlideOpts: function(i) {
            var n, s, o = this.opts(), c = i.data() || {};
            for (var r in c)
                c.hasOwnProperty(r) && /^cycle[A-Z]+/.test(r) && (n = c[r], s = r.match(/^cycle(.*)/)[1].replace(/^[A-Z]/, t), o.API.log("[" + (o.slideCount - 1) + "]", s + ":", n, "(" + typeof n + ")"), c[s] = n);
            c = e.extend({}, e.fn.cycle.defaults, o, c), c.slideNum = o.slideCount;
            try {
                delete c.API, delete c.slideCount, delete c.currSlide, delete c.nextSlide, delete c.slides
            } catch (l) {
            }
            return c
        }, getSlideOpts: function(t) {
            var i = this.opts();
            void 0 === t && (t = i.currSlide);
            var n = i.slides[t], s = e(n).data("cycle.opts");
            return e.extend({}, i, s)
        }, initSlide: function(t, i, n) {
            var s = this.opts();
            i.css(t.slideCss || {}), n > 0 && i.css("zIndex", n), isNaN(t.speed) && (t.speed = e.fx.speeds[t.speed] || e.fx.speeds._default), t.sync || (t.speed = t.speed / 2), i.addClass(s.slideClass)
        }, updateView: function(e) {
            var t = this.opts();
            if (t._initialized) {
                var i = t.API.getSlideOpts(), n = t.slides[t.currSlide];
                !e && (t.API.trigger("cycle-update-view-before", [t, i, n]), 0 > t.updateView) || (t.slideActiveClass && t.slides.removeClass(t.slideActiveClass).eq(t.currSlide).addClass(t.slideActiveClass), e && t.hideNonActive && t.slides.filter(":not(." + t.slideActiveClass + ")").hide(), t.API.trigger("cycle-update-view", [t, i, n, e]), t.API.trigger("cycle-update-view-after", [t, i, n]))
            }
        }, getComponent: function(t) {
            var i = this.opts(), n = i[t];
            return"string" == typeof n ? /^\s*[\>|\+|~]/.test(n) ? i.container.find(n) : e(n) : n.jquery ? n : e(n)
        }, stackSlides: function(t, i, n) {
            var s = this.opts();
            t || (t = s.slides[s.currSlide], i = s.slides[s.nextSlide], n = !s.reverse), e(t).css("zIndex", s.maxZ);
            var o, c = s.maxZ - 2, r = s.slideCount;
            if (n) {
                for (o = s.currSlide + 1; r > o; o++)
                    e(s.slides[o]).css("zIndex", c--);
                for (o = 0; s.currSlide > o; o++)
                    e(s.slides[o]).css("zIndex", c--)
            } else {
                for (o = s.currSlide - 1; o >= 0; o--)
                    e(s.slides[o]).css("zIndex", c--);
                for (o = r - 1; o > s.currSlide; o--)
                    e(s.slides[o]).css("zIndex", c--)
            }
            e(i).css("zIndex", s.maxZ - 1)
        }, getSlideIndex: function(e) {
            return this.opts().slides.index(e)
        }}, e.fn.cycle.log = function() {
        window.console && console.log && console.log("[cycle2] " + Array.prototype.join.call(arguments, " "))
    }, e.fn.cycle.version = function() {
        return"Cycle2: " + i
    }, e.fn.cycle.transitions = {custom: {}, none: {before: function(e, t, i, n) {
                e.API.stackSlides(i, t, n), e.cssBefore = {opacity: 1, display: "block"}
            }}, fade: {before: function(t, i, n, s) {
                var o = t.API.getSlideOpts(t.nextSlide).slideCss || {};
                t.API.stackSlides(i, n, s), t.cssBefore = e.extend(o, {opacity: 0, display: "block"}), t.animIn = {opacity: 1}, t.animOut = {opacity: 0}
            }}, fadeout: {before: function(t, i, n, s) {
                var o = t.API.getSlideOpts(t.nextSlide).slideCss || {};
                t.API.stackSlides(i, n, s), t.cssBefore = e.extend(o, {opacity: 1, display: "block"}), t.animOut = {opacity: 0}
            }}, scrollHorz: {before: function(e, t, i, n) {
                e.API.stackSlides(t, i, n);
                var s = e.container.css("overflow", "hidden").width();
                e.cssBefore = {left: n ? s : -s, top: 0, opacity: 1, display: "block"}, e.cssAfter = {zIndex: e._maxZ - 2, left: 0}, e.animIn = {left: 0}, e.animOut = {left: n ? -s : s}
            }}}, e.fn.cycle.defaults = {allowWrap: !0, autoSelector: ".cycle-slideshow[data-cycle-auto-init!=false]", delay: 0, easing: null, fx: "fade", hideNonActive: !0, loop: 0, manualFx: void 0, manualSpeed: void 0, manualTrump: !0, maxZ: 100, pauseOnHover: !1, reverse: !1, slideActiveClass: "cycle-slide-active", slideClass: "cycle-slide", slideCss: {position: "absolute", top: 0, left: 0}, slides: "> img", speed: 500, startingSlide: 0, sync: !0, timeout: 4e3, updateView: -1}, e(document).ready(function() {
        e(e.fn.cycle.defaults.autoSelector).cycle()
    })
})(jQuery), function(e) {
    "use strict";
    function t(t, n) {
        var s, o, c, r = n.autoHeight;
        if ("container" == r)
            o = e(n.slides[n.currSlide]).outerHeight(), n.container.height(o);
        else if (n._autoHeightRatio)
            n.container.height(n.container.width() / n._autoHeightRatio);
        else if ("calc" === r || "number" == e.type(r) && r >= 0) {
            if (c = "calc" === r ? i(t, n) : r >= n.slides.length ? 0 : r, c == n._sentinelIndex)
                return;
            n._sentinelIndex = c, n._sentinel && n._sentinel.remove(), s = e(n.slides[c].cloneNode(!0)), s.removeAttr("id name rel").find("[id],[name],[rel]").removeAttr("id name rel"), s.css({position: "static", visibility: "hidden", display: "block"}).prependTo(n.container).addClass("cycle-sentinel cycle-slide").removeClass("cycle-slide-active"), s.find("*").css("visibility", "hidden"), n._sentinel = s
        }
    }
    function i(t, i) {
        var n = 0, s = -1;
        return i.slides.each(function(t) {
            var i = e(this).height();
            i > s && (s = i, n = t)
        }), n
    }
    function n(t, i, n, s) {
        var o = e(s).outerHeight(), c = i.sync ? i.speed / 2 : i.speed;
        i.container.animate({height: o}, c)
    }
    function s(i, o) {
        o._autoHeightOnResize && (e(window).off("resize orientationchange", o._autoHeightOnResize), o._autoHeightOnResize = null), o.container.off("cycle-slide-added cycle-slide-removed", t), o.container.off("cycle-destroyed", s), o.container.off("cycle-before", n), o._sentinel && (o._sentinel.remove(), o._sentinel = null)
    }
    e.extend(e.fn.cycle.defaults, {autoHeight: 0}), e(document).on("cycle-initialized", function(i, o) {
        function c() {
            t(i, o)
        }
        var r, l = o.autoHeight, a = e.type(l), d = null;
        ("string" === a || "number" === a) && (o.container.on("cycle-slide-added cycle-slide-removed", t), o.container.on("cycle-destroyed", s), "container" == l ? o.container.on("cycle-before", n) : "string" === a && /\d+\:\d+/.test(l) && (r = l.match(/(\d+)\:(\d+)/), r = r[1] / r[2], o._autoHeightRatio = r), "number" !== a && (o._autoHeightOnResize = function() {
            clearTimeout(d), d = setTimeout(c, 50)
        }, e(window).on("resize orientationchange", o._autoHeightOnResize)), setTimeout(c, 30))
    })
}(jQuery), function(e) {
    "use strict";
    e.extend(e.fn.cycle.defaults, {caption: "> .cycle-caption", captionTemplate: "{{slideNum}} / {{slideCount}}", overlay: "> .cycle-overlay", overlayTemplate: "<div>{{title}}</div><div>{{desc}}</div>", captionModule: "caption"}), e(document).on("cycle-update-view", function(t, i, n, s) {
        "caption" === i.captionModule && e.each(["caption", "overlay"], function() {
            var e = this, t = n[e + "Template"], o = i.API.getComponent(e);
            o.length && t ? (o.html(i.API.tmpl(t, n, i, s)), o.show()) : o.hide()
        })
    }), e(document).on("cycle-destroyed", function(t, i) {
        var n;
        e.each(["caption", "overlay"], function() {
            var e = this, t = i[e + "Template"];
            i[e] && t && (n = i.API.getComponent("caption"), n.empty())
        })
    })
}(jQuery), function(e) {
    "use strict";
    var t = e.fn.cycle;
    e.fn.cycle = function(i) {
        var n, s, o, c = e.makeArray(arguments);
        return"number" == e.type(i) ? this.cycle("goto", i) : "string" == e.type(i) ? this.each(function() {
            var r;
            return n = i, o = e(this).data("cycle.opts"), void 0 === o ? (t.log('slideshow must be initialized before sending commands; "' + n + '" ignored'), void 0) : (n = "goto" == n ? "jump" : n, s = o.API[n], e.isFunction(s) ? (r = e.makeArray(c), r.shift(), s.apply(o.API, r)) : (t.log("unknown command: ", n), void 0))
        }) : t.apply(this, arguments)
    }, e.extend(e.fn.cycle, t), e.extend(t.API, {next: function() {
            var e = this.opts();
            if (!e.busy || e.manualTrump) {
                var t = e.reverse ? -1 : 1;
                e.allowWrap === !1 && e.currSlide + t >= e.slideCount || (e.API.advanceSlide(t), e.API.trigger("cycle-next", [e]).log("cycle-next"))
            }
        }, prev: function() {
            var e = this.opts();
            if (!e.busy || e.manualTrump) {
                var t = e.reverse ? 1 : -1;
                e.allowWrap === !1 && 0 > e.currSlide + t || (e.API.advanceSlide(t), e.API.trigger("cycle-prev", [e]).log("cycle-prev"))
            }
        }, destroy: function() {
            this.stop();
            var t = this.opts(), i = e.isFunction(e._data) ? e._data : e.noop;
            clearTimeout(t.timeoutId), t.timeoutId = 0, t.API.stop(), t.API.trigger("cycle-destroyed", [t]).log("cycle-destroyed"), t.container.removeData(), i(t.container[0], "parsedAttrs", !1), t.retainStylesOnDestroy || (t.container.removeAttr("style"), t.slides.removeAttr("style"), t.slides.removeClass("cycle-slide-active")), t.slides.each(function() {
                e(this).removeData(), i(this, "parsedAttrs", !1)
            })
        }, jump: function(e) {
            var t, i = this.opts();
            if (!i.busy || i.manualTrump) {
                var n = parseInt(e, 10);
                if (isNaN(n) || 0 > n || n >= i.slides.length)
                    return i.API.log("goto: invalid slide index: " + n), void 0;
                if (n == i.currSlide)
                    return i.API.log("goto: skipping, already on slide", n), void 0;
                i.nextSlide = n, clearTimeout(i.timeoutId), i.timeoutId = 0, i.API.log("goto: ", n, " (zero-index)"), t = i.currSlide < i.nextSlide, i.API.prepareTx(!0, t)
            }
        }, stop: function() {
            var t = this.opts(), i = t.container;
            clearTimeout(t.timeoutId), t.timeoutId = 0, t.API.stopTransition(), t.pauseOnHover && (t.pauseOnHover !== !0 && (i = e(t.pauseOnHover)), i.off("mouseenter mouseleave")), t.API.trigger("cycle-stopped", [t]).log("cycle-stopped")
        }, reinit: function() {
            var e = this.opts();
            e.API.destroy(), e.container.cycle()
        }, remove: function(t) {
            for (var i, n, s = this.opts(), o = [], c = 1, r = 0; s.slides.length > r; r++)
                i = s.slides[r], r == t ? n = i : (o.push(i), e(i).data("cycle.opts").slideNum = c, c++);
            n && (s.slides = e(o), s.slideCount--, e(n).remove(), t == s.currSlide && s.API.advanceSlide(1), s.API.trigger("cycle-slide-removed", [s, t, n]).log("cycle-slide-removed"), s.API.updateView())
        }}), e(document).on("click.cycle", "[data-cycle-cmd]", function(t) {
        t.preventDefault();
        var i = e(this), n = i.data("cycle-cmd"), s = i.data("cycle-context") || ".cycle-slideshow";
        e(s).cycle(n, i.data("cycle-arg"))
    })
}(jQuery), function(e) {
    "use strict";
    function t(t, i) {
        var n;
        return t._hashFence ? (t._hashFence = !1, void 0) : (n = window.location.hash.substring(1), t.slides.each(function(s) {
            return e(this).data("cycle-hash") == n ? (i === !0 ? t.startingSlide = s : (t.nextSlide = s, t.API.prepareTx(!0, !1)), !1) : void 0
        }), void 0)
    }
    e(document).on("cycle-pre-initialize", function(i, n) {
        t(n, !0), n._onHashChange = function() {
            t(n, !1)
        }, e(window).on("hashchange", n._onHashChange)
    }), e(document).on("cycle-update-view", function(e, t, i) {
        i.hash && (t._hashFence = !0, window.location.hash = i.hash)
    }), e(document).on("cycle-destroyed", function(t, i) {
        i._onHashChange && e(window).off("hashchange", i._onHashChange)
    })
}(jQuery), function(e) {
    "use strict";
    e.extend(e.fn.cycle.defaults, {loader: !1}), e(document).on("cycle-bootstrap", function(t, i) {
        function n(t, n) {
            function o(t) {
                var o;
                "wait" == i.loader ? (r.push(t), 0 === a && (r.sort(c), s.apply(i.API, [r, n]), i.container.removeClass("cycle-loading"))) : (o = e(i.slides[i.currSlide]), s.apply(i.API, [t, n]), o.show(), i.container.removeClass("cycle-loading"))
            }
            function c(e, t) {
                return e.data("index") - t.data("index")
            }
            var r = [];
            if ("string" == e.type(t))
                t = e.trim(t);
            else if ("array" === e.type(t))
                for (var l = 0; t.length > l; l++)
                    t[l] = e(t[l])[0];
            t = e(t);
            var a = t.length;
            a && (t.hide().appendTo("body").each(function(t) {
                function c() {
                    0 === --l && (--a, o(d))
                }
                var l = 0, d = e(this), u = d.is("img") ? d : d.find("img");
                return d.data("index", t), u = u.filter(":not(.cycle-loader-ignore)").filter(':not([src=""])'), u.length ? (l = u.length, u.each(function() {
                    this.complete ? c() : e(this).load(function() {
                        c()
                    }).error(function() {
                        0 === --l && (i.API.log("slide skipped; img not loaded:", this.src), 0 === --a && "wait" == i.loader && s.apply(i.API, [r, n]))
                    })
                }), void 0) : (--a, r.push(d), void 0)
            }), a && i.container.addClass("cycle-loading"))
        }
        var s;
        i.loader && (s = i.API.add, i.API.add = n)
    })
}(jQuery), function(e) {
    "use strict";
    function t(t, i, n) {
        var s, o = t.API.getComponent("pager");
        o.each(function() {
            var o = e(this);
            if (i.pagerTemplate) {
                var c = t.API.tmpl(i.pagerTemplate, i, t, n[0]);
                s = e(c).appendTo(o)
            } else
                s = o.children().eq(t.slideCount - 1);
            s.on(t.pagerEvent, function(e) {
                e.preventDefault(), t.API.page(o, e.currentTarget)
            })
        })
    }
    function i(e, t) {
        var i = this.opts();
        if (!i.busy || i.manualTrump) {
            var n = e.children().index(t), s = n, o = s > i.currSlide;
            i.currSlide != s && (i.nextSlide = s, i.API.prepareTx(!0, o), i.API.trigger("cycle-pager-activated", [i, e, t]))
        }
    }
    e.extend(e.fn.cycle.defaults, {pager: "> .cycle-pager", pagerActiveClass: "cycle-pager-active", pagerEvent: "click.cycle", pagerTemplate: "<span>&bull;</span>"}), e(document).on("cycle-bootstrap", function(e, i, n) {
        n.buildPagerLink = t
    }), e(document).on("cycle-slide-added", function(e, t, n, s) {
        t.pager && (t.API.buildPagerLink(t, n, s), t.API.page = i)
    }), e(document).on("cycle-slide-removed", function(t, i, n) {
        if (i.pager) {
            var s = i.API.getComponent("pager");
            s.each(function() {
                var t = e(this);
                e(t.children()[n]).remove()
            })
        }
    }), e(document).on("cycle-update-view", function(t, i) {
        var n;
        i.pager && (n = i.API.getComponent("pager"), n.each(function() {
            e(this).children().removeClass(i.pagerActiveClass).eq(i.currSlide).addClass(i.pagerActiveClass)
        }))
    }), e(document).on("cycle-destroyed", function(e, t) {
        var i = t.API.getComponent("pager");
        i && (i.children().off(t.pagerEvent), t.pagerTemplate && i.empty())
    })
}(jQuery), function(e) {
    "use strict";
    e.extend(e.fn.cycle.defaults, {next: "> .cycle-next", nextEvent: "click.cycle", disabledClass: "disabled", prev: "> .cycle-prev", prevEvent: "click.cycle", swipe: !1}), e(document).on("cycle-initialized", function(e, t) {
        if (t.API.getComponent("next").on(t.nextEvent, function(e) {
            e.preventDefault(), t.API.next()
        }), t.API.getComponent("prev").on(t.prevEvent, function(e) {
            e.preventDefault(), t.API.prev()
        }), t.swipe) {
            var i = t.swipeVert ? "swipeUp.cycle" : "swipeLeft.cycle swipeleft.cycle", n = t.swipeVert ? "swipeDown.cycle" : "swipeRight.cycle swiperight.cycle";
            t.container.on(i, function() {
                t.API.next()
            }), t.container.on(n, function() {
                t.API.prev()
            })
        }
    }), e(document).on("cycle-update-view", function(e, t) {
        if (!t.allowWrap) {
            var i = t.disabledClass, n = t.API.getComponent("next"), s = t.API.getComponent("prev"), o = t._prevBoundry || 0, c = t._nextBoundry || t.slideCount - 1;
            t.currSlide == c ? n.addClass(i).prop("disabled", !0) : n.removeClass(i).prop("disabled", !1), t.currSlide === o ? s.addClass(i).prop("disabled", !0) : s.removeClass(i).prop("disabled", !1)
        }
    }), e(document).on("cycle-destroyed", function(e, t) {
        t.API.getComponent("prev").off(t.nextEvent), t.API.getComponent("next").off(t.prevEvent), t.container.off("swipeleft.cycle swiperight.cycle swipeLeft.cycle swipeRight.cycle swipeUp.cycle swipeDown.cycle")
    })
}(jQuery), function(e) {
    "use strict";
    e.extend(e.fn.cycle.defaults, {progressive: !1}), e(document).on("cycle-pre-initialize", function(t, i) {
        if (i.progressive) {
            var n, s, o = i.API, c = o.next, r = o.prev, l = o.prepareTx, a = e.type(i.progressive);
            if ("array" == a)
                n = i.progressive;
            else if (e.isFunction(i.progressive))
                n = i.progressive(i);
            else if ("string" == a) {
                if (s = e(i.progressive), n = e.trim(s.html()), !n)
                    return;
                if (/^(\[)/.test(n))
                    try {
                        n = e.parseJSON(n)
                    } catch (d) {
                        return o.log("error parsing progressive slides", d), void 0
                    }
                else
                    n = n.split(RegExp(s.data("cycle-split") || "\n")), n[n.length - 1] || n.pop()
            }
            l && (o.prepareTx = function(e, t) {
                var s, o;
                return e || 0 === n.length ? (l.apply(i.API, [e, t]), void 0) : (t && i.currSlide == i.slideCount - 1 ? (o = n[0], n = n.slice(1), i.container.one("cycle-slide-added", function(e, t) {
                    setTimeout(function() {
                        t.API.advanceSlide(1)
                    }, 50)
                }), i.API.add(o)) : t || 0 !== i.currSlide ? l.apply(i.API, [e, t]) : (s = n.length - 1, o = n[s], n = n.slice(0, s), i.container.one("cycle-slide-added", function(e, t) {
                    setTimeout(function() {
                        t.currSlide = 1, t.API.advanceSlide(-1)
                    }, 50)
                }), i.API.add(o, !0)), void 0)
            }), c && (o.next = function() {
                var e = this.opts();
                if (n.length && e.currSlide == e.slideCount - 1) {
                    var t = n[0];
                    n = n.slice(1), e.container.one("cycle-slide-added", function(e, t) {
                        c.apply(t.API), t.container.removeClass("cycle-loading")
                    }), e.container.addClass("cycle-loading"), e.API.add(t)
                } else
                    c.apply(e.API)
            }), r && (o.prev = function() {
                var e = this.opts();
                if (n.length && 0 === e.currSlide) {
                    var t = n.length - 1, i = n[t];
                    n = n.slice(0, t), e.container.one("cycle-slide-added", function(e, t) {
                        t.currSlide = 1, t.API.advanceSlide(-1), t.container.removeClass("cycle-loading")
                    }), e.container.addClass("cycle-loading"), e.API.add(i, !0)
                } else
                    r.apply(e.API)
            })
        }
    })
}(jQuery), function(e) {
    "use strict";
    e.extend(e.fn.cycle.defaults, {tmplRegex: "{{((.)?.*?)}}"}), e.extend(e.fn.cycle.API, {tmpl: function(t, i) {
            var n = RegExp(i.tmplRegex || e.fn.cycle.defaults.tmplRegex, "g"), s = e.makeArray(arguments);
            return s.shift(), t.replace(n, function(t, i) {
                var n, o, c, r, l = i.split(".");
                for (n = 0; s.length > n; n++)
                    if (c = s[n]) {
                        if (l.length > 1)
                            for (r = c, o = 0; l.length > o; o++)
                                c = r, r = r[l[o]] || i;
                        else
                            r = c[i];
                        if (e.isFunction(r))
                            return r.apply(c, s);
                        if (void 0 !== r && null !== r && r != i)
                            return r
                    }
                return i
            })
        }})
}(jQuery);/*! carousel transition plugin for Cycle2;  version: 20130528 */
(function($) {
    "use strict";

    $(document).on('cycle-bootstrap', function(e, opts, API) {
        if (opts.fx !== 'carousel')
            return;

        API.getSlideIndex = function(el) {
            var slides = this.opts()._carouselWrap.children();
            var i = slides.index(el);
            return i % slides.length;
        };

        // override default 'next' function
        API.next = function() {
            var count = opts.reverse ? -1 : 1;
            if (opts.allowWrap === false && (opts.currSlide + count) > opts.slideCount - opts.carouselVisible)
                return;
            opts.API.advanceSlide(count);
            opts.API.trigger('cycle-next', [opts]).log('cycle-next');
        };

    });


    $.fn.cycle.transitions.carousel = {
        // transition API impl
        preInit: function(opts) {
            opts.hideNonActive = false;

            opts.container.on('cycle-destroyed', $.proxy(this.onDestroy, opts.API));
            // override default API implementation
            opts.API.stopTransition = this.stopTransition;

            // issue #10
            for (var i = 0; i < opts.startingSlide; i++) {
                opts.container.append(opts.slides[0]);
            }
        },
        // transition API impl
        postInit: function(opts) {
            var i, j, slide, pagerCutoffIndex, wrap;
            var vert = opts.carouselVertical;
            if (opts.carouselVisible && opts.carouselVisible > opts.slideCount)
                opts.carouselVisible = opts.slideCount - 1;
            var visCount = opts.carouselVisible || opts.slides.length;
            var slideCSS = {display: vert ? 'block' : 'inline-block', position: 'static'};

            // required styles
            opts.container.css({position: 'relative', overflow: 'hidden'});
            opts.slides.css(slideCSS);

            opts._currSlide = opts.currSlide;

            // wrap slides in a div; this div is what is animated
            wrap = $('<div class="cycle-carousel-wrap"></div>')
                    .prependTo(opts.container)
                    .css({margin: 0, padding: 0, top: 0, left: 0, position: 'absolute'})
                    .append(opts.slides);

            opts._carouselWrap = wrap;

            if (!vert)
                wrap.css('white-space', 'nowrap');

            if (opts.allowWrap !== false) {
                // prepend and append extra slides so we don't see any empty space when we
                // near the end of the carousel.  for fluid containers, add even more clones
                // so there is plenty to fill the screen
                // @todo: optimzie this based on slide sizes

                for (j = 0; j < (opts.carouselVisible === undefined ? 2 : 1); j++) {
                    for (i = 0; i < opts.slideCount; i++) {
                        wrap.append(opts.slides[i].cloneNode(true));
                    }
                    i = opts.slideCount;
                    while (i--) { // #160, #209
                        wrap.prepend(opts.slides[i].cloneNode(true));
                    }
                }

                wrap.find('.cycle-slide-active').removeClass('cycle-slide-active');
                opts.slides.eq(opts.startingSlide).addClass('cycle-slide-active');
            }

            if (opts.pager && opts.allowWrap === false) {
                // hide "extra" pagers
                pagerCutoffIndex = opts.slideCount - visCount;
                $(opts.pager).children().filter(':gt(' + pagerCutoffIndex + ')').hide();
            }

            opts._nextBoundry = opts.slideCount - opts.carouselVisible;

            this.prepareDimensions(opts);
        },
        prepareDimensions: function(opts) {
            var dim, offset, pagerCutoffIndex, tmp;
            var vert = opts.carouselVertical;
            var visCount = opts.carouselVisible || opts.slides.length;

            if (opts.carouselFluid && opts.carouselVisible) {
                if (!opts._carouselResizeThrottle) {
                    // fluid container AND fluid slides; slides need to be resized to fit container
                    this.fluidSlides(opts);
                }
            }
            else if (opts.carouselVisible && opts.carouselSlideDimension) {
                dim = visCount * opts.carouselSlideDimension;
                opts.container[ vert ? 'height' : 'width' ](dim);
            }
            else if (opts.carouselVisible) {
                dim = visCount * $(opts.slides[0])[vert ? 'outerHeight' : 'outerWidth'](true);
                opts.container[ vert ? 'height' : 'width' ](dim);
            }
            // else {
            //     // fluid; don't size the container
            // }

            offset = (opts.carouselOffset || 0);
            if (opts.allowWrap !== false) {
                if (opts.carouselSlideDimension) {
                    offset -= ((opts.slideCount + opts.currSlide) * opts.carouselSlideDimension);
                }
                else {
                    // calculate offset based on actual slide dimensions
                    tmp = opts._carouselWrap.children();
                    for (var j = 0; j < (opts.slideCount + opts.currSlide); j++) {
                        offset -= $(tmp[j])[vert ? 'outerHeight' : 'outerWidth'](true);
                    }
                }
            }

            opts._carouselWrap.css(vert ? 'top' : 'left', offset);
        },
        fluidSlides: function(opts) {
            var timeout;
            var slide = opts.slides.eq(0);
            var adjustment = slide.outerWidth() - slide.width();
            var prepareDimensions = this.prepareDimensions;

            // throttle resize event
            $(window).on('resize', resizeThrottle);

            opts._carouselResizeThrottle = resizeThrottle;
            onResize();

            function resizeThrottle() {
                clearTimeout(timeout);
                timeout = setTimeout(onResize, 20);
            }

            function onResize() {
                opts._carouselWrap.stop(false, true);
                var slideWidth = opts.container.width() / opts.carouselVisible;
                slideWidth = Math.ceil(slideWidth - adjustment);
                opts._carouselWrap.children().width(slideWidth);
                if (opts._sentinel)
                    opts._sentinel.width(slideWidth);
                prepareDimensions(opts);
            }
        },
        // transition API impl
        transition: function(opts, curr, next, fwd, callback) {
            var moveBy, props = {};
            var hops = opts.nextSlide - opts.currSlide;
            var vert = opts.carouselVertical;
            var speed = opts.speed;

            // handle all the edge cases for wrapping & non-wrapping
            if (opts.allowWrap === false) {
                fwd = hops > 0;
                var currSlide = opts._currSlide;
                var maxCurr = opts.slideCount - opts.carouselVisible;
                if (hops > 0 && opts.nextSlide > maxCurr && currSlide == maxCurr) {
                    hops = 0;
                }
                else if (hops > 0 && opts.nextSlide > maxCurr) {
                    hops = opts.nextSlide - currSlide - (opts.nextSlide - maxCurr);
                }
                else if (hops < 0 && opts.currSlide > maxCurr && opts.nextSlide > maxCurr) {
                    hops = 0;
                }
                else if (hops < 0 && opts.currSlide > maxCurr) {
                    hops += opts.currSlide - maxCurr;
                }
                else
                    currSlide = opts.currSlide;

                moveBy = this.getScroll(opts, vert, currSlide, hops);
                opts.API.opts()._currSlide = opts.nextSlide > maxCurr ? maxCurr : opts.nextSlide;
            }
            else {
                if (fwd && opts.nextSlide === 0) {
                    // moving from last slide to first
                    moveBy = this.getDim(opts, opts.currSlide, vert);
                    callback = this.genCallback(opts, fwd, vert, callback);
                }
                else if (!fwd && opts.nextSlide == opts.slideCount - 1) {
                    // moving from first slide to last
                    moveBy = this.getDim(opts, opts.currSlide, vert);
                    callback = this.genCallback(opts, fwd, vert, callback);
                }
                else {
                    moveBy = this.getScroll(opts, vert, opts.currSlide, hops);
                }
            }

            props[ vert ? 'top' : 'left' ] = fwd ? ("-=" + moveBy) : ("+=" + moveBy);

            // throttleSpeed means to scroll slides at a constant rate, rather than
            // a constant speed
            if (opts.throttleSpeed)
                speed = (moveBy / $(opts.slides[0])[vert ? 'height' : 'width']()) * opts.speed;

            opts._carouselWrap.animate(props, speed, opts.easing, callback);
        },
        getDim: function(opts, index, vert) {
            var slide = $(opts.slides[index]);
            return slide[ vert ? 'outerHeight' : 'outerWidth'](true);
        },
        getScroll: function(opts, vert, currSlide, hops) {
            var i, moveBy = 0;

            if (hops > 0) {
                for (i = currSlide; i < currSlide + hops; i++)
                    moveBy += this.getDim(opts, i, vert);
            }
            else {
                for (i = currSlide; i > currSlide + hops; i--)
                    moveBy += this.getDim(opts, i, vert);
            }
            return moveBy;
        },
        genCallback: function(opts, fwd, vert, callback) {
            // returns callback fn that resets the left/top wrap position to the "real" slides
            return function() {
                var pos = $(opts.slides[opts.nextSlide]).position();
                var offset = 0 - pos[vert ? 'top' : 'left'] + (opts.carouselOffset || 0);
                opts._carouselWrap.css(opts.carouselVertical ? 'top' : 'left', offset);
                callback();
            };
        },
        // core API override
        stopTransition: function() {
            var opts = this.opts();
            opts.slides.stop(false, true);
            opts._carouselWrap.stop(false, true);
        },
        // core API supplement
        onDestroy: function(e) {
            var opts = this.opts();
            if (opts._carouselResizeThrottle)
                $(window).off('resize', opts._carouselResizeThrottle);
            opts.slides.prependTo(opts.container);
            opts._carouselWrap.remove();
        }
    };

})(jQuery);
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend(jQuery.easing,
        {
            def: 'easeOutQuad',
            swing: function(x, t, b, c, d) {
                //alert(jQuery.easing.default);
                return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
            },
            easeInQuad: function(x, t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            easeOutQuad: function(x, t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOutQuad: function(x, t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            },
            easeInCubic: function(x, t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOutCubic: function(x, t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOutCubic: function(x, t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            },
            easeInQuart: function(x, t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOutQuart: function(x, t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOutQuart: function(x, t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            },
            easeInQuint: function(x, t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOutQuint: function(x, t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOutQuint: function(x, t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            },
            easeInSine: function(x, t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOutSine: function(x, t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOutSine: function(x, t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            },
            easeInExpo: function(x, t, b, c, d) {
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOutExpo: function(x, t, b, c, d) {
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOutExpo: function(x, t, b, c, d) {
                if (t == 0)
                    return b;
                if (t == d)
                    return b + c;
                if ((t /= d / 2) < 1)
                    return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            },
            easeInCirc: function(x, t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOutCirc: function(x, t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOutCirc: function(x, t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            },
            easeInElastic: function(x, t, b, c, d) {
                var s = 1.70158;
                var p = 0;
                var a = c;
                if (t == 0)
                    return b;
                if ((t /= d) == 1)
                    return b + c;
                if (!p)
                    p = d * .3;
                if (a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                }
                else
                    var s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOutElastic: function(x, t, b, c, d) {
                var s = 1.70158;
                var p = 0;
                var a = c;
                if (t == 0)
                    return b;
                if ((t /= d) == 1)
                    return b + c;
                if (!p)
                    p = d * .3;
                if (a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                }
                else
                    var s = p / (2 * Math.PI) * Math.asin(c / a);
                return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
            },
            easeInOutElastic: function(x, t, b, c, d) {
                var s = 1.70158;
                var p = 0;
                var a = c;
                if (t == 0)
                    return b;
                if ((t /= d / 2) == 2)
                    return b + c;
                if (!p)
                    p = d * (.3 * 1.5);
                if (a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                }
                else
                    var s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1)
                    return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            },
            easeInBack: function(x, t, b, c, d, s) {
                if (s == undefined)
                    s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOutBack: function(x, t, b, c, d, s) {
                if (s == undefined)
                    s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOutBack: function(x, t, b, c, d, s) {
                if (s == undefined)
                    s = 1.70158;
                if ((t /= d / 2) < 1)
                    return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            },
            easeInBounce: function(x, t, b, c, d) {
                return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
            },
            easeOutBounce: function(x, t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOutBounce: function(x, t, b, c, d) {
                if (t < d / 2)
                    return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
                return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        });

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 *//*
  * jQuery EasyTabs plugin 3.2.0
  *
  * Copyright (c) 2010-2011 Steve Schwartz (JangoSteve)
  *
  * Dual licensed under the MIT and GPL licenses:
  *   http://www.opensource.org/licenses/mit-license.php
  *   http://www.gnu.org/licenses/gpl.html
  *
  * Date: Thu May 09 17:30:00 2013 -0500
  */
(function($) {

    $.easytabs = function(container, options) {

        // Attach to plugin anything that should be available via
        // the $container.data('easytabs') object
        var plugin = this,
                $container = $(container),
                defaults = {
            animate: true,
            panelActiveClass: "active",
            tabActiveClass: "active",
            defaultTab: "li:first-child",
            animationSpeed: "normal",
            tabs: "> ul > li",
            updateHash: true,
            cycle: false,
            collapsible: false,
            collapsedClass: "collapsed",
            collapsedByDefault: true,
            uiTabs: false,
            transitionIn: 'fadeIn',
            transitionOut: 'fadeOut',
            transitionInEasing: 'swing',
            transitionOutEasing: 'swing',
            transitionCollapse: 'slideUp',
            transitionUncollapse: 'slideDown',
            transitionCollapseEasing: 'swing',
            transitionUncollapseEasing: 'swing',
            containerClass: "",
            tabsClass: "",
            tabClass: "",
            panelClass: "",
            cache: true,
            event: 'click',
            panelContext: $container
        },
        // Internal instance variables
        // (not available via easytabs object)
        $defaultTab,
                $defaultTabLink,
                transitions,
                lastHash,
                skipUpdateToHash,
                animationSpeeds = {
            fast: 200,
            normal: 400,
            slow: 600
        },
        // Shorthand variable so that we don't need to call
        // plugin.settings throughout the plugin code
        settings;

        // =============================================================
        // Functions available via easytabs object
        // =============================================================

        plugin.init = function() {

            plugin.settings = settings = $.extend({}, defaults, options);
            settings.bind_str = settings.event + ".easytabs";

            // Add jQuery UI's crazy class names to markup,
            // so that markup will match theme CSS
            if (settings.uiTabs) {
                settings.tabActiveClass = 'ui-tabs-selected';
                settings.containerClass = 'ui-tabs ui-widget ui-widget-content ui-corner-all';
                settings.tabsClass = 'ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all';
                settings.tabClass = 'ui-state-default ui-corner-top';
                settings.panelClass = 'ui-tabs-panel ui-widget-content ui-corner-bottom';
            }

            // If collapsible is true and defaultTab specified, assume user wants defaultTab showing (not collapsed)
            if (settings.collapsible && options.defaultTab !== undefined && options.collpasedByDefault === undefined) {
                settings.collapsedByDefault = false;
            }

            // Convert 'normal', 'fast', and 'slow' animation speed settings to their respective speed in milliseconds
            if (typeof(settings.animationSpeed) === 'string') {
                settings.animationSpeed = animationSpeeds[settings.animationSpeed];
            }

            $('a.anchor').remove().prependTo('body');

            // Store easytabs object on container so we can easily set
            // properties throughout
            $container.data('easytabs', {});

            plugin.setTransitions();

            plugin.getTabs();

            addClasses();

            setDefaultTab();

            bindToTabClicks();

            initHashChange();

            initCycle();

            // Append data-easytabs HTML attribute to make easy to query for
            // easytabs instances via CSS pseudo-selector
            $container.attr('data-easytabs', true);
        };

        // Set transitions for switching between tabs based on options.
        // Could be used to update transitions if settings are changes.
        plugin.setTransitions = function() {
            transitions = (settings.animate) ? {
                show: settings.transitionIn,
                hide: settings.transitionOut,
                speed: settings.animationSpeed,
                collapse: settings.transitionCollapse,
                uncollapse: settings.transitionUncollapse,
                halfSpeed: settings.animationSpeed / 2
            } :
                    {
                        show: "show",
                        hide: "hide",
                        speed: 0,
                        collapse: "hide",
                        uncollapse: "show",
                        halfSpeed: 0
                    };
        };

        // Find and instantiate tabs and panels.
        // Could be used to reset tab and panel collection if markup is
        // modified.
        plugin.getTabs = function() {
            var $matchingPanel;

            // Find the initial set of elements matching the setting.tabs
            // CSS selector within the container
            plugin.tabs = $container.find(settings.tabs),
                    // Instantiate panels as empty jquery object
                    plugin.panels = $(),
                    plugin.tabs.each(function() {
                var $tab = $(this),
                        $a = $tab.children('a'),
                        // targetId is the ID of the panel, which is either the
                        // `href` attribute for non-ajax tabs, or in the
                        // `data-target` attribute for ajax tabs since the `href` is
                        // the ajax URL
                        targetId = $tab.children('a').data('target');

                $tab.data('easytabs', {});

                // If the tab has a `data-target` attribute, and is thus an ajax tab
                if (targetId !== undefined && targetId !== null) {
                    $tab.data('easytabs').ajax = $a.attr('href');
                } else {
                    targetId = $a.attr('href');
                }
                targetId = targetId.match(/#([^\?]+)/)[1];

                $matchingPanel = settings.panelContext.find("#" + targetId);

                // If tab has a matching panel, add it to panels
                if ($matchingPanel.length) {

                    // Store panel height before hiding
                    $matchingPanel.data('easytabs', {
                        position: $matchingPanel.css('position'),
                        visibility: $matchingPanel.css('visibility')
                    });

                    // Don't hide panel if it's active (allows `getTabs` to be called manually to re-instantiate tab collection)
                    $matchingPanel.not(settings.panelActiveClass).hide();

                    plugin.panels = plugin.panels.add($matchingPanel);

                    $tab.data('easytabs').panel = $matchingPanel;

                    // Otherwise, remove tab from tabs collection
                } else {
                    plugin.tabs = plugin.tabs.not($tab);
                    if ('console' in window) {
                        console.warn('Warning: tab without matching panel for selector \'#' + targetId + '\' removed from set');
                    }
                }
            });
        };

        // Select tab and fire callback
        plugin.selectTab = function($clicked, callback) {
            var url = window.location,
                    hash = url.hash.match(/^[^\?]*/)[0],
                    $targetPanel = $clicked.parent().data('easytabs').panel,
                    ajaxUrl = $clicked.parent().data('easytabs').ajax;

            // Tab is collapsible and active => toggle collapsed state
            if (settings.collapsible && !skipUpdateToHash && ($clicked.hasClass(settings.tabActiveClass) || $clicked.hasClass(settings.collapsedClass))) {
                plugin.toggleTabCollapse($clicked, $targetPanel, ajaxUrl, callback);

                // Tab is not active and panel is not active => select tab
            } else if (!$clicked.hasClass(settings.tabActiveClass) || !$targetPanel.hasClass(settings.panelActiveClass)) {
                activateTab($clicked, $targetPanel, ajaxUrl, callback);

                // Cache is disabled => reload (e.g reload an ajax tab).
            } else if (!settings.cache) {
                activateTab($clicked, $targetPanel, ajaxUrl, callback);
            }

        };

        // Toggle tab collapsed state and fire callback
        plugin.toggleTabCollapse = function($clicked, $targetPanel, ajaxUrl, callback) {
            plugin.panels.stop(true, true);

            if (fire($container, "easytabs:before", [$clicked, $targetPanel, settings])) {
                plugin.tabs.filter("." + settings.tabActiveClass).removeClass(settings.tabActiveClass).children().removeClass(settings.tabActiveClass);

                // If panel is collapsed, uncollapse it
                if ($clicked.hasClass(settings.collapsedClass)) {

                    // If ajax panel and not already cached
                    if (ajaxUrl && (!settings.cache || !$clicked.parent().data('easytabs').cached)) {
                        $container.trigger('easytabs:ajax:beforeSend', [$clicked, $targetPanel]);

                        $targetPanel.load(ajaxUrl, function(response, status, xhr) {
                            $clicked.parent().data('easytabs').cached = true;
                            $container.trigger('easytabs:ajax:complete', [$clicked, $targetPanel, response, status, xhr]);
                        });
                    }

                    // Update CSS classes of tab and panel
                    $clicked.parent()
                            .removeClass(settings.collapsedClass)
                            .addClass(settings.tabActiveClass)
                            .children()
                            .removeClass(settings.collapsedClass)
                            .addClass(settings.tabActiveClass);

                    $targetPanel
                            .addClass(settings.panelActiveClass)
                            [transitions.uncollapse](transitions.speed, settings.transitionUncollapseEasing, function() {
                        $container.trigger('easytabs:midTransition', [$clicked, $targetPanel, settings]);
                        if (typeof callback == 'function')
                            callback();
                    });

                    // Otherwise, collapse it
                } else {

                    // Update CSS classes of tab and panel
                    $clicked.addClass(settings.collapsedClass)
                            .parent()
                            .addClass(settings.collapsedClass);

                    $targetPanel
                            .removeClass(settings.panelActiveClass)
                            [transitions.collapse](transitions.speed, settings.transitionCollapseEasing, function() {
                        $container.trigger("easytabs:midTransition", [$clicked, $targetPanel, settings]);
                        if (typeof callback == 'function')
                            callback();
                    });
                }
            }
        };


        // Find tab with target panel matching value
        plugin.matchTab = function(hash) {
            return plugin.tabs.find("[href='" + hash + "'],[data-target='" + hash + "']").first();
        };

        // Find panel with `id` matching value
        plugin.matchInPanel = function(hash) {
            return (hash && plugin.validId(hash) ? plugin.panels.filter(':has(' + hash + ')').first() : []);
        };

        // Make sure hash is a valid id value (admittedly strict in that HTML5 allows almost anything without a space)
        // but jQuery has issues with such id values anyway, so we can afford to be strict here.
        plugin.validId = function(id) {
            return id.substr(1).match(/^[A-Za-z]+[A-Za-z0-9\-_:\.].$/);
        };

        // Select matching tab when URL hash changes
        plugin.selectTabFromHashChange = function() {
            var hash = window.location.hash.match(/^[^\?]*/)[0],
                    $tab = plugin.matchTab(hash),
                    $panel;

            if (settings.updateHash) {

                // If hash directly matches tab
                if ($tab.length) {
                    skipUpdateToHash = true;
                    plugin.selectTab($tab);

                } else {
                    $panel = plugin.matchInPanel(hash);

                    // If panel contains element matching hash
                    if ($panel.length) {
                        hash = '#' + $panel.attr('id');
                        $tab = plugin.matchTab(hash);
                        skipUpdateToHash = true;
                        plugin.selectTab($tab);

                        // If default tab is not active...
                    } else if (!$defaultTab.hasClass(settings.tabActiveClass) && !settings.cycle) {

                        // ...and hash is blank or matches a parent of the tab container or
                        // if the last tab (before the hash updated) was one of the other tabs in this container.
                        if (hash === '' || plugin.matchTab(lastHash).length || $container.closest(hash).length) {
                            skipUpdateToHash = true;
                            plugin.selectTab($defaultTabLink);
                        }
                    }
                }
            }
        };

        // Cycle through tabs
        plugin.cycleTabs = function(tabNumber) {
            if (settings.cycle) {
                tabNumber = tabNumber % plugin.tabs.length;
                $tab = $(plugin.tabs[tabNumber]).children("a").first();
                skipUpdateToHash = true;
                plugin.selectTab($tab, function() {
                    setTimeout(function() {
                        plugin.cycleTabs(tabNumber + 1);
                    }, settings.cycle);
                });
            }
        };

        // Convenient public methods
        plugin.publicMethods = {
            select: function(tabSelector) {
                var $tab;

                // Find tab container that matches selector (like 'li#tab-one' which contains tab link)
                if (($tab = plugin.tabs.filter(tabSelector)).length === 0) {

                    // Find direct tab link that matches href (like 'a[href="#panel-1"]')
                    if (($tab = plugin.tabs.find("a[href='" + tabSelector + "']")).length === 0) {

                        // Find direct tab link that matches selector (like 'a#tab-1')
                        if (($tab = plugin.tabs.find("a" + tabSelector)).length === 0) {

                            // Find direct tab link that matches data-target (lik 'a[data-target="#panel-1"]')
                            if (($tab = plugin.tabs.find("[data-target='" + tabSelector + "']")).length === 0) {

                                // Find direct tab link that ends in the matching href (like 'a[href$="#panel-1"]', which would also match http://example.com/currentpage/#panel-1)
                                if (($tab = plugin.tabs.find("a[href$='" + tabSelector + "']")).length === 0) {

                                    $.error('Tab \'' + tabSelector + '\' does not exist in tab set');
                                }
                            }
                        }
                    }
                } else {
                    // Select the child tab link, since the first option finds the tab container (like <li>)
                    $tab = $tab.children("a").first();
                }
                plugin.selectTab($tab);
            }
        };

        // =============================================================
        // Private functions
        // =============================================================

        // Triggers an event on an element and returns the event result
        var fire = function(obj, name, data) {
            var event = $.Event(name);
            obj.trigger(event, data);
            return event.result !== false;
        }

        // Add CSS classes to markup (if specified), called by init
        var addClasses = function() {
            $container.addClass(settings.containerClass);
            plugin.tabs.parent().addClass(settings.tabsClass);
            plugin.tabs.addClass(settings.tabClass);
            plugin.panels.addClass(settings.panelClass);
        };

        // Set the default tab, whether from hash (bookmarked) or option,
        // called by init
        var setDefaultTab = function() {
            var hash = window.location.hash.match(/^[^\?]*/)[0],
                    $selectedTab = plugin.matchTab(hash).parent(),
                    $panel;

            // If hash directly matches one of the tabs, active on page-load
            if ($selectedTab.length === 1) {
                $defaultTab = $selectedTab;
                settings.cycle = false;

            } else {
                $panel = plugin.matchInPanel(hash);

                // If one of the panels contains the element matching the hash,
                // make it active on page-load
                if ($panel.length) {
                    hash = '#' + $panel.attr('id');
                    $defaultTab = plugin.matchTab(hash).parent();

                    // Otherwise, make the default tab the one that's active on page-load
                } else {
                    $defaultTab = plugin.tabs.parent().find(settings.defaultTab);
                    if ($defaultTab.length === 0) {
                        $.error("The specified default tab ('" + settings.defaultTab + "') could not be found in the tab set ('" + settings.tabs + "') out of " + plugin.tabs.length + " tabs.");
                    }
                }
            }

            $defaultTabLink = $defaultTab.children("a").first();

            activateDefaultTab($selectedTab);
        };

        // Activate defaultTab (or collapse by default), called by setDefaultTab
        var activateDefaultTab = function($selectedTab) {
            var defaultPanel,
                    defaultAjaxUrl;

            if (settings.collapsible && $selectedTab.length === 0 && settings.collapsedByDefault) {
                $defaultTab
                        .addClass(settings.collapsedClass)
                        .children()
                        .addClass(settings.collapsedClass);

            } else {

                defaultPanel = $($defaultTab.data('easytabs').panel);
                defaultAjaxUrl = $defaultTab.data('easytabs').ajax;

                if (defaultAjaxUrl && (!settings.cache || !$defaultTab.data('easytabs').cached)) {
                    $container.trigger('easytabs:ajax:beforeSend', [$defaultTabLink, defaultPanel]);
                    defaultPanel.load(defaultAjaxUrl, function(response, status, xhr) {
                        $defaultTab.data('easytabs').cached = true;
                        $container.trigger('easytabs:ajax:complete', [$defaultTabLink, defaultPanel, response, status, xhr]);
                    });
                }

                $defaultTab.data('easytabs').panel
                        .show()
                        .addClass(settings.panelActiveClass);

                $defaultTab
                        .addClass(settings.tabActiveClass)
                        .children()
                        .addClass(settings.tabActiveClass);
            }

            // Fire event when the plugin is initialised
            $container.trigger("easytabs:initialised", [$defaultTabLink, defaultPanel]);
        };

        // Bind tab-select funtionality to namespaced click event, called by
        // init
        var bindToTabClicks = function() {
            plugin.tabs.children("a").bind(settings.bind_str, function(e) {

                // Stop cycling when a tab is clicked
                settings.cycle = false;

                // Hash will be updated when tab is clicked,
                // don't cause tab to re-select when hash-change event is fired
                skipUpdateToHash = false;

                // Select the panel for the clicked tab
                plugin.selectTab($(this));

                // Don't follow the link to the anchor
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
            });
        };

        // Activate a given tab/panel, called from plugin.selectTab:
        //
        //   * fire `easytabs:before` hook
        //   * get ajax if new tab is an uncached ajax tab
        //   * animate out previously-active panel
        //   * fire `easytabs:midTransition` hook
        //   * update URL hash
        //   * animate in newly-active panel
        //   * update CSS classes for inactive and active tabs/panels
        //
        // TODO: This could probably be broken out into many more modular
        // functions
        var activateTab = function($clicked, $targetPanel, ajaxUrl, callback) {
            plugin.panels.stop(true, true);

            if (fire($container, "easytabs:before", [$clicked, $targetPanel, settings])) {
                var $visiblePanel = plugin.panels.filter(":visible"),
                        $panelContainer = $targetPanel.parent(),
                        targetHeight,
                        visibleHeight,
                        heightDifference,
                        showPanel,
                        hash = window.location.hash.match(/^[^\?]*/)[0];

                if (settings.animate) {
                    targetHeight = getHeightForHidden($targetPanel);
                    visibleHeight = $visiblePanel.length ? setAndReturnHeight($visiblePanel) : 0;
                    heightDifference = targetHeight - visibleHeight;
                }

                // Set lastHash to help indicate if defaultTab should be
                // activated across multiple tab instances.
                lastHash = hash;

                // TODO: Move this function elsewhere
                showPanel = function() {
                    // At this point, the previous panel is hidden, and the new one will be selected
                    $container.trigger("easytabs:midTransition", [$clicked, $targetPanel, settings]);

                    // Gracefully animate between panels of differing heights, start height change animation *after* panel change if panel needs to contract,
                    // so that there is no chance of making the visible panel overflowing the height of the target panel
                    if (settings.animate && settings.transitionIn == 'fadeIn') {
                        if (heightDifference < 0)
                            $panelContainer.animate({
                                height: $panelContainer.height() + heightDifference
                            }, transitions.halfSpeed).css({'min-height': ''});
                    }

                    if (settings.updateHash && !skipUpdateToHash) {
                        //window.location = url.toString().replace((url.pathname + hash), (url.pathname + $clicked.attr("href")));
                        // Not sure why this behaves so differently, but it's more straight forward and seems to have less side-effects
                        window.location.hash = '#' + $targetPanel.attr('id');
                    } else {
                        skipUpdateToHash = false;
                    }

                    $targetPanel
                            [transitions.show](transitions.speed, settings.transitionInEasing, function() {
                        $panelContainer.css({height: '', 'min-height': ''}); // After the transition, unset the height
                        $container.trigger("easytabs:after", [$clicked, $targetPanel, settings]);
                        // callback only gets called if selectTab actually does something, since it's inside the if block
                        if (typeof callback == 'function') {
                            callback();
                        }
                    });
                };

                if (ajaxUrl && (!settings.cache || !$clicked.parent().data('easytabs').cached)) {
                    $container.trigger('easytabs:ajax:beforeSend', [$clicked, $targetPanel]);
                    $targetPanel.load(ajaxUrl, function(response, status, xhr) {
                        $clicked.parent().data('easytabs').cached = true;
                        $container.trigger('easytabs:ajax:complete', [$clicked, $targetPanel, response, status, xhr]);
                    });
                }

                // Gracefully animate between panels of differing heights, start height change animation *before* panel change if panel needs to expand,
                // so that there is no chance of making the target panel overflowing the height of the visible panel
                if (settings.animate && settings.transitionOut == 'fadeOut') {
                    if (heightDifference > 0) {
                        $panelContainer.animate({
                            height: ($panelContainer.height() + heightDifference)
                        }, transitions.halfSpeed);
                    } else {
                        // Prevent height jumping before height transition is triggered at midTransition
                        $panelContainer.css({'min-height': $panelContainer.height()});
                    }
                }

                // Change the active tab *first* to provide immediate feedback when the user clicks
                plugin.tabs.filter("." + settings.tabActiveClass).removeClass(settings.tabActiveClass).children().removeClass(settings.tabActiveClass);
                plugin.tabs.filter("." + settings.collapsedClass).removeClass(settings.collapsedClass).children().removeClass(settings.collapsedClass);
                $clicked.parent().addClass(settings.tabActiveClass).children().addClass(settings.tabActiveClass);

                plugin.panels.filter("." + settings.panelActiveClass).removeClass(settings.panelActiveClass);
                $targetPanel.addClass(settings.panelActiveClass);

                if ($visiblePanel.length) {
                    $visiblePanel
                            [transitions.hide](transitions.speed, settings.transitionOutEasing, showPanel);
                } else {
                    $targetPanel
                            [transitions.uncollapse](transitions.speed, settings.transitionUncollapseEasing, showPanel);
                }
            }
        };

        // Get heights of panels to enable animation between panels of
        // differing heights, called by activateTab
        var getHeightForHidden = function($targetPanel) {

            if ($targetPanel.data('easytabs') && $targetPanel.data('easytabs').lastHeight) {
                return $targetPanel.data('easytabs').lastHeight;
            }

            // this is the only property easytabs changes, so we need to grab its value on each tab change
            var display = $targetPanel.css('display'),
                    outerCloak,
                    height;

            // Workaround with wrapping height, because firefox returns wrong
            // height if element itself has absolute positioning.
            // but try/catch block needed for IE7 and IE8 because they throw
            // an "Unspecified error" when trying to create an element
            // with the css position set.
            try {
                outerCloak = $('<div></div>', {'position': 'absolute', 'visibility': 'hidden', 'overflow': 'hidden'});
            } catch (e) {
                outerCloak = $('<div></div>', {'visibility': 'hidden', 'overflow': 'hidden'});
            }
            height = $targetPanel
                    .wrap(outerCloak)
                    .css({'position': 'relative', 'visibility': 'hidden', 'display': 'block'})
                    .outerHeight();

            $targetPanel.unwrap();

            // Return element to previous state
            $targetPanel.css({
                position: $targetPanel.data('easytabs').position,
                visibility: $targetPanel.data('easytabs').visibility,
                display: display
            });

            // Cache height
            $targetPanel.data('easytabs').lastHeight = height;

            return height;
        };

        // Since the height of the visible panel may have been manipulated due to interaction,
        // we want to re-cache the visible height on each tab change, called
        // by activateTab
        var setAndReturnHeight = function($visiblePanel) {
            var height = $visiblePanel.outerHeight();

            if ($visiblePanel.data('easytabs')) {
                $visiblePanel.data('easytabs').lastHeight = height;
            } else {
                $visiblePanel.data('easytabs', {lastHeight: height});
            }
            return height;
        };

        // Setup hash-change callback for forward- and back-button
        // functionality, called by init
        var initHashChange = function() {

            // enabling back-button with jquery.hashchange plugin
            // http://benalman.com/projects/jquery-hashchange-plugin/
            if (typeof $(window).hashchange === 'function') {
                $(window).hashchange(function() {
                    plugin.selectTabFromHashChange();
                });
            } else if ($.address && typeof $.address.change === 'function') { // back-button with jquery.address plugin http://www.asual.com/jquery/address/docs/
                $.address.change(function() {
                    plugin.selectTabFromHashChange();
                });
            }
        };

        // Begin cycling if set in options, called by init
        var initCycle = function() {
            var tabNumber;
            if (settings.cycle) {
                tabNumber = plugin.tabs.index($defaultTab);
                setTimeout(function() {
                    plugin.cycleTabs(tabNumber + 1);
                }, settings.cycle);
            }
        };


        plugin.init();

    };

    $.fn.easytabs = function(options) {
        var args = arguments;

        return this.each(function() {
            var $this = $(this),
                    plugin = $this.data('easytabs');

            // Initialization was called with $(el).easytabs( { options } );
            if (undefined === plugin) {
                plugin = new $.easytabs(this, options);
                $this.data('easytabs', plugin);
            }

            // User called public method
            if (typeof plugin != 'undefined' && plugin.publicMethods[options]) {
                return plugin.publicMethods[options](Array.prototype.slice.call(args, 1));
            }
        });
    };

})(jQuery);
(function(window, $, undefined) {

    /*
     * smartresize: debounced resize event for jQuery
     *
     * latest version and complete README available on Github:
     * https://github.com/louisremi/jquery.smartresize.js
     *
     * Copyright 2011 @louis_remi
     * Licensed under the MIT license.
     */

    var $event = $.event, resizeTimeout;

    $event.special.smartresize = {
        setup: function() {
            $(this).bind("resize", $event.special.smartresize.handler);
        },
        teardown: function() {
            $(this).unbind("resize", $event.special.smartresize.handler);
        },
        handler: function(event, execAsap) {
            // Save the context
            var context = this,
                    args = arguments;

            // set correct event type
            event.type = "smartresize";

            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(function() {
                jQuery.event.handle.apply(context, args);
            }, execAsap === "execAsap" ? 0 : 100);
        }
    };

    $.fn.smartresize = function(fn) {
        return fn ? this.bind("smartresize", fn) : this.trigger("smartresize", ["execAsap"]);
    };

    $.Slideshow = function(options, element) {

        this.$el = $(element);

        /***** images ****/

        // list of image items
        this.$list = this.$el.find('ul.ei-slider-large');
        // image items
        this.$imgItems = this.$list.children('li');
        // total number of items
        this.itemsCount = this.$imgItems.length;
        // images
        this.$images = this.$imgItems.find('img:first');

        /***** thumbs ****/

        // thumbs wrapper
        this.$sliderthumbs = this.$el.find('ul.ei-slider-thumbs').hide();
        // slider elements
        this.$sliderElems = this.$sliderthumbs.children('li');
        // sliding div
        this.$sliderElem = this.$sliderthumbs.children('li.ei-slider-element');
        // thumbs
        this.$thumbs = this.$sliderElems.not('.ei-slider-element');

        // initialize slideshow
        this._init(options);

    };

    $.Slideshow.defaults = {
        // animation types:
        // "sides" : new slides will slide in from left / right
        // "center": new slides will appear in the center
        animation: 'sides', // sides || center
        // if true the slider will automatically slide, and it will only stop if the user clicks on a thumb
        autoplay: false,
        // interval for the slideshow
        slideshow_interval: 3000,
        // speed for the sliding animation
        speed: 800,
        // easing for the sliding animation
        easing: '',
        // percentage of speed for the titles animation. Speed will be speed * titlesFactor
        titlesFactor: 0.60,
        // titles animation speed
        titlespeed: 800,
        // titles animation easing
        titleeasing: '',
        // maximum width for the thumbs in pixels
        thumbMaxWidth: 150
    };

    $.Slideshow.prototype = {
        _init: function(options) {

            this.options = $.extend(true, {}, $.Slideshow.defaults, options);

            // set the opacity of the title elements and the image items
            this.$imgItems.css('opacity', 0);
            this.$imgItems.find('div.ei-title > *').css('opacity', 0);

            // index of current visible slider
            this.current = 0;

            var _self = this;

            // preload images
            // add loading status
            this.$loading = $('<div class="ei-slider-loading">Loading</div>').prependTo(_self.$el);

            $.when(this._preloadImages()).done(function() {

                // hide loading status
                _self.$loading.hide();

                // calculate size and position for each image
                _self._setImagesSize();

                // configure thumbs container
                _self._initThumbs();

                // show first
                _self.$imgItems.eq(_self.current).css({
                    'opacity': 1,
                    'z-index': 10
                }).show().find('div.ei-title > *').css('opacity', 1);

                // if autoplay is true
                if (_self.options.autoplay) {

                    _self._startSlideshow();

                }

                // initialize the events
                _self._initEvents();

            });

        },
        _preloadImages: function() {

            // preloads all the large images

            var _self = this,
                    loaded = 0;

            return $.Deferred(
                    function(dfd) {

                        _self.$images.each(function(i) {

                            $('<img/>').load(function() {

                                if (++loaded === _self.itemsCount) {

                                    dfd.resolve();

                                }

                            }).attr('src', $(this).attr('src'));

                        });

                    }

            ).promise();

        },
        _setImagesSize: function() {

            // save ei-slider's width
            this.elWidth = this.$el.width();

            var _self = this;

            this.$images.each(function(i) {

                var $img = $(this);
                imgDim = _self._getImageDim($img.attr('src'));

                $img.css({
                    width: imgDim.width,
                    height: imgDim.height,
                    marginLeft: imgDim.left,
                    marginTop: imgDim.top
                });

            });

        },
        _getImageDim: function(src) {

            var $img = new Image();

            $img.src = src;

            var c_w = this.elWidth,
                    c_h = this.$el.height(),
                    r_w = c_h / c_w,
                    i_w = $img.width,
                    i_h = $img.height,
                    r_i = i_h / i_w,
                    new_w, new_h, new_left, new_top;

            if (r_w > r_i) {

                new_h = c_h;
                new_w = c_h / r_i;

            }
            else {

                new_h = c_w * r_i;
                new_w = c_w;

            }

            return {
                width: new_w,
                height: new_h,
                left: (c_w - new_w) / 2,
                top: (c_h - new_h) / 2
            };

        },
        _initThumbs: function() {

            // set the max-width of the slider elements to the one set in the plugin's options
            // also, the width of each slider element will be 100% / total number of elements
            this.$sliderElems.css({
                'max-width': this.options.thumbMaxWidth + 'px',
                'width': 100 / this.itemsCount + '%'
            });

            // set the max-width of the slider and show it
            this.$sliderthumbs.css('max-width', this.options.thumbMaxWidth * this.itemsCount + 'px').show();

        },
        _startSlideshow: function() {

            var _self = this;

            this.slideshow = setTimeout(function() {

                var pos;

                (_self.current === _self.itemsCount - 1) ? pos = 0 : pos = _self.current + 1;

                _self._slideTo(pos);

                if (_self.options.autoplay) {

                    _self._startSlideshow();

                }

            }, this.options.slideshow_interval);

        },
        // shows the clicked thumb's slide
        _slideTo: function(pos) {

            // return if clicking the same element or if currently animating
            if (pos === this.current || this.isAnimating)
                return false;

            this.isAnimating = true;

            var $currentSlide = this.$imgItems.eq(this.current),
                    $nextSlide = this.$imgItems.eq(pos),
                    _self = this,
                    preCSS = {zIndex: 10},
            animCSS = {opacity: 1};

            // new slide will slide in from left or right side
            if (this.options.animation === 'sides') {

                preCSS.left = (pos > this.current) ? -1 * this.elWidth : this.elWidth;
                animCSS.left = 0;

            }

            // titles animation
            $nextSlide.find('div.ei-title > h2')
                    .css('margin-left', 50 + 'px')
                    .stop()
                    .delay(this.options.speed * this.options.titlesFactor)
                    .animate({marginLeft: 0 + 'px', opacity: 1}, this.options.titlespeed, this.options.titleeasing)
                    .end()
                    .find('div.ei-title > h3')
                    .css('margin-left', -50 + 'px')
                    .stop()
                    .delay(this.options.speed * this.options.titlesFactor)
                    .animate({marginLeft: 0 + 'px', opacity: 1}, this.options.titlespeed, this.options.titleeasing)

            $.when(
                    // fade out current titles
                    $currentSlide.css('z-index', 1).find('div.ei-title > *').stop().fadeOut(this.options.speed / 2, function() {
                // reset style
                $(this).show().css('opacity', 0);
            }),
                    // animate next slide in
                    $nextSlide.css(preCSS).stop().animate(animCSS, this.options.speed, this.options.easing),
                    // "sliding div" moves to new position
                    this.$sliderElem.stop().animate({
                left: this.$thumbs.eq(pos).position().left
            }, this.options.speed)

                    ).done(function() {

                // reset values
                $currentSlide.css('opacity', 0).find('div.ei-title > *').css('opacity', 0);
                _self.current = pos;
                _self.isAnimating = false;

            });

        },
        _initEvents: function() {

            var _self = this;

            // window resize
            $(window).on('smartresize.eislideshow', function(event) {

                // resize the images
                _self._setImagesSize();

                // reset position of thumbs sliding div
                _self.$sliderElem.css('left', _self.$thumbs.eq(_self.current).position().left);

            });

            // click the thumbs
            this.$thumbs.on('click.eislideshow', function(event) {

                if (_self.options.autoplay) {

                    clearTimeout(_self.slideshow);
                    _self.options.autoplay = false;

                }

                var $thumb = $(this),
                        idx = $thumb.index() - 1; // exclude sliding div

                _self._slideTo(idx);

                return false;

            });

        }
    };

    var logError = function(message) {

        if (this.console) {

            console.error(message);

        }

    };

    $.fn.eislideshow = function(options) {

        if (typeof options === 'string') {

            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function() {

                var instance = $.data(this, 'eislideshow');

                if (!instance) {
                    logError("cannot call methods on eislideshow prior to initialization; " +
                            "attempted to call method '" + options + "'");
                    return;
                }

                if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                    logError("no such method '" + options + "' for eislideshow instance");
                    return;
                }

                instance[ options ].apply(instance, args);

            });

        }
        else {

            this.each(function() {

                var instance = $.data(this, 'eislideshow');
                if (!instance) {
                    $.data(this, 'eislideshow', new $.Slideshow(options, this));
                }

            });

        }

        return this;

    };

})(window, jQuery);/*jshint undef: true */
/*global jQuery: true */

/*
 --------------------------------
 Infinite Scroll
 --------------------------------
 + https://github.com/paulirish/infinite-scroll
 + version 2.0b2.120519
 + Copyright 2011/12 Paul Irish & Luke Shumard
 + Licensed under the MIT license
 
 + Documentation: http://infinite-scroll.com/
 */

(function(window, $, undefined) {
    "use strict";

    $.infinitescroll = function infscr(options, callback, element) {
        this.element = $(element);

        // Flag the object in the event of a failed creation
        if (!this._create(options, callback)) {
            this.failed = true;
        }
    };

    $.infinitescroll.defaults = {
        loading: {
            finished: undefined,
            finishedMsg: "<em>Congratulations, you've reached the end of the internet.</em>",
            img: "data:image/gif;base64,R0lGODlh3AATAPQeAPDy+MnQ6LW/4N3h8MzT6rjC4sTM5r/I5NHX7N7j8c7U6tvg8OLl8uXo9Ojr9b3G5MfP6Ovu9tPZ7PT1+vX2+tbb7vf4+8/W69jd7rC73vn5/O/x+K243ai02////wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQECgD/ACwAAAAA3AATAAAF/6AnjmRpnmiqrmzrvnAsz3Rt33iu73zv/8CgcEj0BAScpHLJbDqf0Kh0Sq1ar9isdioItAKGw+MAKYMFhbF63CW438f0mg1R2O8EuXj/aOPtaHx7fn96goR4hmuId4qDdX95c4+RBIGCB4yAjpmQhZN0YGYGXitdZBIVGAsLoq4BBKQDswm1CQRkcG6ytrYKubq8vbfAcMK9v7q7EMO1ycrHvsW6zcTKsczNz8HZw9vG3cjTsMIYqQkCLBwHCgsMDQ4RDAYIqfYSFxDxEfz88/X38Onr16+Bp4ADCco7eC8hQYMAEe57yNCew4IVBU7EGNDiRn8Z831cGLHhSIgdFf9chIeBg7oA7gjaWUWTVQAGE3LqBDCTlc9WOHfm7PkTqNCh54rePDqB6M+lR536hCpUqs2gVZM+xbrTqtGoWqdy1emValeXKzggYBBB5y1acFNZmEvXAoN2cGfJrTv3bl69Ffj2xZt3L1+/fw3XRVw4sGDGcR0fJhxZsF3KtBTThZxZ8mLMgC3fRatCbYMNFCzwLEqLgE4NsDWs/tvqdezZf13Hvk2A9Szdu2X3pg18N+68xXn7rh1c+PLksI/Dhe6cuO3ow3NfV92bdArTqC2Ebd3A8vjf5QWfH6Bg7Nz17c2fj69+fnq+8N2Lty+fuP78/eV2X13neIcCeBRwxorbZrA1ANoCDGrgoG8RTshahQ9iSKEEzUmYIYfNWViUhheCGJyIP5E4oom7WWjgCeBFAJNv1DVV01MAdJhhjdkplWNzO/5oXI846njjVEIqR2OS2B1pE5PVscajkxhMycqLJghQSwT40PgfAl4GqNSXYdZXJn5gSkmmmmJu1aZYb14V51do+pTOCmA40AqVCIhG5IJ9PvYnhIFOxmdqhpaI6GeHCtpooisuutmg+Eg62KOMKuqoTaXgicQWoIYq6qiklmoqFV0UoeqqrLbq6quwxirrrLTWauutJ4QAACH5BAUKABwALAcABADOAAsAAAX/IPd0D2dyRCoUp/k8gpHOKtseR9yiSmGbuBykler9XLAhkbDavXTL5k2oqFqNOxzUZPU5YYZd1XsD72rZpBjbeh52mSNnMSC8lwblKZGwi+0QfIJ8CncnCoCDgoVnBHmKfByGJimPkIwtiAeBkH6ZHJaKmCeVnKKTHIihg5KNq4uoqmEtcRUtEREMBggtEr4QDrjCuRC8h7/BwxENeicSF8DKy82pyNLMOxzWygzFmdvD2L3P0dze4+Xh1Arkyepi7dfFvvTtLQkZBC0T/FX3CRgCMOBHsJ+EHYQY7OinAGECgQsB+Lu3AOK+CewcWjwxQeJBihtNGHSoQOE+iQ3//4XkwBBhRZMcUS6YSXOAwIL8PGqEaSJCiYt9SNoCmnJPAgUVLChdaoFBURN8MAzl2PQphwQLfDFd6lTowglHve6rKpbjhK7/pG5VinZP1qkiz1rl4+tr2LRwWU64cFEihwEtZgbgR1UiHaMVvxpOSwBA37kzGz9e8G+B5MIEKLutOGEsAH2ATQwYfTmuX8aETWdGPZmiZcccNSzeTCA1Sw0bdiitC7LBWgu8jQr8HRzqgpK6gX88QbrB14z/kF+ELpwB8eVQj/JkqdylAudji/+ts3039vEEfK8Vz2dlvxZKG0CmbkKDBvllRd6fCzDvBLKBDSCeffhRJEFebFk1k/Mv9jVIoIJZSeBggwUaNeB+Qk34IE0cXlihcfRxkOAJFFhwGmKlmWDiakZhUJtnLBpnWWcnKaAZcxI0piFGGLBm1mc90kajSCveeBVWKeYEoU2wqeaQi0PetoE+rr14EpVC7oAbAUHqhYExbn2XHHsVqbcVew9tx8+XJKk5AZsqqdlddGpqAKdbAYBn1pcczmSTdWvdmZ17c1b3FZ99vnTdCRFM8OEcAhLwm1NdXnWcBBSMRWmfkWZqVlsmLIiAp/o1gGV2vpS4lalGYsUOqXrddcKCmK61aZ8SjEpUpVFVoCpTj4r661Km7kBHjrDyc1RAIQAAIfkEBQoAGwAsBwAEAM4ACwAABf/gtmUCd4goQQgFKj6PYKi0yrrbc8i4ohQt12EHcal+MNSQiCP8gigdz7iCioaCIvUmZLp8QBzW0EN2vSlCuDtFKaq4RyHzQLEKZNdiQDhRDVooCwkbfm59EAmKi4SGIm+AjIsKjhsqB4mSjT2IOIOUnICeCaB/mZKFNTSRmqVpmJqklSqskq6PfYYCDwYHDC4REQwGCBLGxxIQDsHMwhAIX8bKzcENgSLGF9PU1j3Sy9zX2NrgzQziChLk1BHWxcjf7N046tvN82715czn9Pryz6Ilc4ACj4EBOCZM8KEnAYYADBRKnACAYUMFv1wotIhCEcaJCisqwJFgAUSQGyX/kCSVUUTIdKMwJlyo0oXHlhskwrTJciZHEXsgaqS4s6PJiCAr1uzYU8kBBSgnWFqpoMJMUjGtDmUwkmfVmVypakWhEKvXsS4nhLW5wNjVroJIoc05wSzTr0PtiigpYe4EC2vj4iWrFu5euWIMRBhacaVJhYQBEFjA9jHjyQ0xEABwGceGAZYjY0YBOrRLCxUp29QM+bRkx5s7ZyYgVbTqwwti2ybJ+vLtDYpycyZbYOlptxdx0kV+V7lC5iJAyyRrwYKxAdiz82ng0/jnAdMJFz0cPi104Ec1Vj9/M6F173vKL/feXv156dw11tlqeMMnv4V5Ap53GmjQQH97nFfg+IFiucfgRX5Z8KAgbUlQ4IULIlghhhdOSB6AgX0IVn8eReghen3NRIBsRgnH4l4LuEidZBjwRpt6NM5WGwoW0KSjCwX6yJSMab2GwwAPDXfaBCtWpluRTQqC5JM5oUZAjUNS+VeOLWpJEQ7VYQANW0INJSZVDFSnZphjSikfmzE5N4EEbQI1QJmnWXCmHulRp2edwDXF43txukenJwvI9xyg9Q26Z3MzGUcBYFEChZh6DVTq34AU8Iflh51Sd+CnKFYQ6mmZkhqfBKfSxZWqA9DZanWjxmhrWwi0qtCrt/43K6WqVjjpmhIqgEGvculaGKklKstAACEAACH5BAUKABwALAcABADOAAsAAAX/ICdyQmaMYyAUqPgIBiHPxNpy79kqRXH8wAPsRmDdXpAWgWdEIYm2llCHqjVHU+jjJkwqBTecwItShMXkEfNWSh8e1NGAcLgpDGlRgk7EJ/6Ae3VKfoF/fDuFhohVeDeCfXkcCQqDVQcQhn+VNDOYmpSWaoqBlUSfmowjEA+iEAEGDRGztAwGCDcXEA60tXEiCrq8vREMEBLIyRLCxMWSHMzExnbRvQ2Sy7vN0zvVtNfU2tLY3rPgLdnDvca4VQS/Cpk3ABwSLQkYAQwT/P309vcI7OvXr94jBQMJ/nskkGA/BQBRLNDncAIAiDcG6LsxAWOLiQzmeURBKWSLCQbv/1F0eDGinJUKR47YY1IEgQASKk7Yc7ACRwZm7mHweRJoz59BJUogisKCUaFMR0x4SlJBVBFTk8pZivTR0K73rN5wqlXEAq5Fy3IYgHbEzQ0nLy4QSoCjXLoom96VOJEeCosK5n4kkFfqXjl94wa+l1gvAcGICbewAOAxY8l/Ky/QhAGz4cUkGxu2HNozhwMGBnCUqUdBg9UuW9eUynqSwLHIBujePef1ZGQZXcM+OFuEBeBhi3OYgLyqcuaxbT9vLkf4SeqyWxSQpKGB2gQpm1KdWbu72rPRzR9Ne2Nu9Kzr/1Jqj0yD/fvqP4aXOt5sW/5qsXXVcv1Nsp8IBUAmgswGF3llGgeU1YVXXKTN1FlhWFXW3gIE+DVChApysACHHo7Q4A35lLichh+ROBmLKAzgYmYEYDAhCgxKGOOMn4WR4kkDaoBBOxJtdNKQxFmg5JIWIBnQc07GaORfUY4AEkdV6jHlCEISSZ5yTXpp1pbGZbkWmcuZmQCaE6iJ0FhjMaDjTMsgZaNEHFRAQVp3bqXnZED1qYcECOz5V6BhSWCoVJQIKuKQi2KFKEkEFAqoAo7uYSmO3jk61wUUMKmknJ4SGimBmAa0qVQBhAAAIfkEBQoAGwAsBwAEAM4ACwAABf/gJm5FmRlEqhJC+bywgK5pO4rHI0D3pii22+Mg6/0Ej96weCMAk7cDkXf7lZTTnrMl7eaYoy10JN0ZFdco0XAuvKI6qkgVFJXYNwjkIBcNBgR8TQoGfRsJCRuCYYQQiI+ICosiCoGOkIiKfSl8mJkHZ4U9kZMbKaI3pKGXmJKrngmug4WwkhA0lrCBWgYFCCMQFwoQDRHGxwwGCBLMzRLEx8iGzMMO0cYNeCMKzBDW19lnF9DXDIY/48Xg093f0Q3s1dcR8OLe8+Y91OTv5wrj7o7B+7VNQqABIoRVCMBggsOHE36kSoCBIcSH3EbFangxogJYFi8CkJhqQciLJEf/LDDJEeJIBT0GsOwYUYJGBS0fjpQAMidGmyVP6sx4Y6VQhzs9VUwkwqaCCh0tmKoFtSMDmBOf9phg4SrVrROuasRQAaxXpVUhdsU6IsECZlvX3kwLUWzRt0BHOLTbNlbZG3vZinArge5Dvn7wbqtQkSYAAgtKmnSsYKVKo2AfW048uaPmG386i4Q8EQMBAIAnfB7xBxBqvapJ9zX9WgRS2YMpnvYMGdPK3aMjt/3dUcNI4blpj7iwkMFWDXDvSmgAlijrt9RTR78+PS6z1uAJZIe93Q8g5zcsWCi/4Y+C8bah5zUv3vv89uft30QP23punGCx5954oBBwnwYaNCDY/wYrsYeggnM9B2Fpf8GG2CEUVWhbWAtGouEGDy7Y4IEJVrbSiXghqGKIo7z1IVcXIkKWWR361QOLWWnIhwERpLaaCCee5iMBGJQmJGyPFTnbkfHVZGRtIGrg5HALEJAZbu39BuUEUmq1JJQIPtZilY5hGeSWsSk52G9XqsmgljdIcABytq13HyIM6RcUA+r1qZ4EBF3WHWB29tBgAzRhEGhig8KmqKFv8SeCeo+mgsF7YFXa1qWSbkDpom/mqR1PmHCqJ3fwNRVXjC7S6CZhFVCQ2lWvZiirhQq42SACt25IK2hv8TprriUV1usGgeka7LFcNmCldMLi6qZMgFLgpw16Cipb7bC1knXsBiEAACH5BAUKABsALAcABADOAAsAAAX/4FZsJPkUmUGsLCEUTywXglFuSg7fW1xAvNWLF6sFFcPb42C8EZCj24EJdCp2yoegWsolS0Uu6fmamg8n8YYcLU2bXSiRaXMGvqV6/KAeJAh8VgZqCX+BexCFioWAYgqNi4qAR4ORhRuHY408jAeUhAmYYiuVlpiflqGZa5CWkzc5fKmbbhIpsAoQDRG8vQwQCBLCwxK6vb5qwhfGxxENahvCEA7NzskSy7vNzzzK09W/PNHF1NvX2dXcN8K55cfh69Luveol3vO8zwi4Yhj+AQwmCBw4IYclDAAJDlQggVOChAoLKkgFkSCAHDwWLKhIEOONARsDKryogFPIiAUb/95gJNIiw4wnI778GFPhzBKFOAq8qLJEhQpiNArjMcHCmlTCUDIouTKBhApELSxFWiGiVKY4E2CAekPgUphDu0742nRrVLJZnyrFSqKQ2ohoSYAMW6IoDpNJ4bLdILTnAj8KUF7UeENjAKuDyxIgOuGiOI0EBBMgLNew5AUrDTMGsFixwBIaNCQuAXJB57qNJ2OWm2Aj4skwCQCIyNkhhtMkdsIuodE0AN4LJDRgfLPtn5YDLdBlraAByuUbBgxQwICxMOnYpVOPej074OFdlfc0TqC62OIbcppHjV4o+LrieWhfT8JC/I/T6W8oCl29vQ0XjLdBaA3s1RcPBO7lFvpX8BVoG4O5jTXRQRDuJ6FDTzEWF1/BCZhgbyAKE9qICYLloQYOFtahVRsWYlZ4KQJHlwHS/IYaZ6sZd9tmu5HQm2xi1UaTbzxYwJk/wBF5g5EEYOBZeEfGZmNdFyFZmZIR4jikbLThlh5kUUVJGmRT7sekkziRWUIACABk3T4qCsedgO4xhgGcY7q5pHJ4klBBTQRJ0CeHcoYHHUh6wgfdn9uJdSdMiebGJ0zUPTcoS286FCkrZxnYoYYKWLkBowhQoBeaOlZAgVhLidrXqg2GiqpQpZ4apwSwRtjqrB3muoF9BboaXKmshlqWqsWiGt2wphJkQbAU5hoCACH5BAUKABsALAcABADOAAsAAAX/oGFw2WZuT5oZROsSQnGaKjRvilI893MItlNOJ5v5gDcFrHhKIWcEYu/xFEqNv6B1N62aclysF7fsZYe5aOx2yL5aAUGSaT1oTYMBwQ5VGCAJgYIJCnx1gIOBhXdwiIl7d0p2iYGQUAQBjoOFSQR/lIQHnZ+Ue6OagqYzSqSJi5eTpTxGcjcSChANEbu8DBAIEsHBChe5vL13G7fFuscRDcnKuM3H0La3EA7Oz8kKEsXazr7Cw9/Gztar5uHHvte47MjktznZ2w0G1+D3BgirAqJmJMAQgMGEgwgn5Ei0gKDBhBMALGRYEOJBb5QcWlQo4cbAihZz3GgIMqFEBSM1/4ZEOWPAgpIIJXYU+PIhRG8ja1qU6VHlzZknJNQ6UanCjQkWCIGSUGEjAwVLjc44+DTqUQtPPS5gejUrTa5TJ3g9sWCr1BNUWZI161StiQUDmLYdGfesibQ3XMq1OPYthrwuA2yU2LBs2cBHIypYQPPlYAKFD5cVvNPtW8eVGbdcQADATsiNO4cFAPkvHpedPzc8kUcPgNGgZ5RNDZG05reoE9s2vSEP79MEGiQGy1qP8LA4ZcdtsJE48ONoLTBtTV0B9LsTnPceoIDBDQvS7W7vfjVY3q3eZ4A339J4eaAmKqU/sV58HvJh2RcnIBsDUw0ABqhBA5aV5V9XUFGiHfVeAiWwoFgJJrIXRH1tEMiDFV4oHoAEGlaWhgIGSGBO2nFomYY3mKjVglidaNYJGJDkWW2xxTfbjCbVaOGNqoX2GloR8ZeTaECS9pthRGJH2g0b3Agbk6hNANtteHD2GJUucfajCQBy5OOTQ25ZgUPvaVVQmbKh9510/qQpwXx3SQdfk8tZJOd5b6JJFplT3ZnmmX3qd5l1eg5q00HrtUkUn0AKaiGjClSAgKLYZcgWXwocGRcCFGCKwSB6ceqphwmYRUFYT/1WKlOdUpipmxW0mlCqHjYkAaeoZlqrqZ4qd+upQKaapn/AmgAegZ8KUtYtFAQQAgAh+QQFCgAbACwHAAQAzgALAAAF/+C2PUcmiCiZGUTrEkKBis8jQEquKwU5HyXIbEPgyX7BYa5wTNmEMwWsSXsqFbEh8DYs9mrgGjdK6GkPY5GOeU6ryz7UFopSQEzygOGhJBjoIgMDBAcBM0V/CYqLCQqFOwobiYyKjn2TlI6GKC2YjJZknouaZAcQlJUHl6eooJwKooobqoewrJSEmyKdt59NhRKFMxLEEA4RyMkMEAjDEhfGycqAG8TQx9IRDRDE3d3R2ctD1RLg0ttKEnbY5wZD3+zJ6M7X2RHi9Oby7u/r9g38UFjTh2xZJBEBMDAboogAgwkQI07IMUORwocSJwCgWDFBAIwZOaJIsOBjRogKJP8wTODw5ESVHVtm3AhzpEeQElOuNDlTZ0ycEUWKWFASqEahGwYUPbnxoAgEdlYSqDBkgoUNClAlIHbSAoOsqCRQnQHxq1axVb06FWFxLIqyaze0Tft1JVqyE+pWXMD1pF6bYl3+HTqAWNW8cRUFzmih0ZAAB2oGKukSAAGGRHWJgLiR6AylBLpuHKKUMlMCngMpDSAa9QIUggZVVvDaJobLeC3XZpvgNgCmtPcuwP3WgmXSq4do0DC6o2/guzcseECtUoO0hmcsGKDgOt7ssBd07wqesAIGZC1YIBa7PQHvb1+SFo+++HrJSQfB33xfav3i5eX3Hnb4CTJgegEq8tH/YQEOcIJzbm2G2EoYRLgBXFpVmFYDcREV4HIcnmUhiGBRouEMJGJGzHIspqgdXxK0yCKHRNXoIX4uorCdTyjkyNtdPWrA4Up82EbAbzMRxxZRR54WXVLDIRmRcag5d2R6ugl3ZXzNhTecchpMhIGVAKAYpgJjjsSklBEd99maZoo535ZvdamjBEpusJyctg3h4X8XqodBMx0tiNeg/oGJaKGABpogS40KSqiaEgBqlQWLUtqoVQnytekEjzo0hHqhRorppOZt2p923M2AAV+oBtpAnnPNoB6HaU6mAAIU+IXmi3j2mtFXuUoHKwXpzVrsjcgGOauKEjQrwq157hitGq2NoWmjh7z6Wmxb0m5w66+2VRAuXN/yFUAIACH5BAUKABsALAcABADOAAsAAAX/4CZuRiaM45MZqBgIRbs9AqTcuFLE7VHLOh7KB5ERdjJaEaU4ClO/lgKWjKKcMiJQ8KgumcieVdQMD8cbBeuAkkC6LYLhOxoQ2PF5Ys9PKPBMen17f0CCg4VSh32JV4t8jSNqEIOEgJKPlkYBlJWRInKdiJdkmQlvKAsLBxdABA4RsbIMBggtEhcQsLKxDBC2TAS6vLENdJLDxMZAubu8vjIbzcQRtMzJz79S08oQEt/guNiyy7fcvMbh4OezdAvGrakLAQwyABsELQkY9BP+//ckyPDD4J9BfAMh1GsBoImMeQUN+lMgUJ9CiRMa5msxoB9Gh/o8GmxYMZXIgxtR/yQ46S/gQAURR0pDwYDfywoyLPip5AdnCwsMFPBU4BPFhKBDi444quCmDKZOfwZ9KEGpCKgcN1jdALSpPqIYsabS+nSqvqplvYqQYAeDPgwKwjaMtiDl0oaqUAyo+3TuWwUAMPpVCfee0cEjVBGQq2ABx7oTWmQk4FglZMGN9fGVDMCuiH2AOVOu/PmyxM630gwM0CCn6q8LjVJ8GXvpa5Uwn95OTC/nNxkda1/dLSK475IjCD6dHbK1ZOa4hXP9DXs5chJ00UpVm5xo2qRpoxptwF2E4/IbJpB/SDz9+q9b1aNfQH08+p4a8uvX8B53fLP+ycAfemjsRUBgp1H20K+BghHgVgt1GXZXZpZ5lt4ECjxYR4ScUWiShEtZqBiIInRGWnERNnjiBglw+JyGnxUmGowsyiiZg189lNtPGACjV2+S9UjbU0JWF6SPvEk3QZEqsZYTk3UAaRSUnznJI5LmESCdBVSyaOWUWLK4I5gDUYVeV1T9l+FZClCAUVA09uSmRHBCKAECFEhW51ht6rnmWBXkaR+NjuHpJ40D3DmnQXt2F+ihZxlqVKOfQRACACH5BAUKABwALAcABADOAAsAAAX/ICdyUCkUo/g8mUG8MCGkKgspeC6j6XEIEBpBUeCNfECaglBcOVfJFK7YQwZHQ6JRZBUqTrSuVEuD3nI45pYjFuWKvjjSkCoRaBUMWxkwBGgJCXspQ36Bh4EEB0oKhoiBgyNLjo8Ki4QElIiWfJqHnISNEI+Ql5J9o6SgkqKkgqYihamPkW6oNBgSfiMMDQkGCBLCwxIQDhHIyQwQCGMKxsnKVyPCF9DREQ3MxMPX0cu4wt7J2uHWx9jlKd3o39MiuefYEcvNkuLt5O8c1ePI2tyELXGQwoGDAQf+iEC2xByDCRAjTlAgIUWCBRgCPJQ4AQBFXAs0coT40WLIjRxL/47AcHLkxIomRXL0CHPERZkpa4q4iVKiyp0tR/7kwHMkTUBBJR5dOCEBAVcKKtCAyOHpowXCpk7goABqBZdcvWploACpBKkpIJI1q5OD2rIWE0R1uTZu1LFwbWL9OlKuWb4c6+o9i3dEgw0RCGDUG9KlRw56gDY2qmCByZBaASi+TACA0TucAaTteCcy0ZuOK3N2vJlx58+LRQyY3Xm0ZsgjZg+oPQLi7dUcNXi0LOJw1pgNtB7XG6CBy+U75SYfPTSQAgZTNUDnQHt67wnbZyvwLgKiMN3oCZB3C76tdewpLFgIP2C88rbi4Y+QT3+8S5USMICZXWj1pkEDeUU3lOYGB3alSoEiMIjgX4WlgNF2EibIwQIXauWXSRg2SAOHIU5IIIMoZkhhWiJaiFVbKo6AQEgQXrTAazO1JhkBrBG3Y2Y6EsUhaGn95hprSN0oWpFE7rhkeaQBchGOEWnwEmc0uKWZj0LeuNV3W4Y2lZHFlQCSRjTIl8uZ+kG5HU/3sRlnTG2ytyadytnD3HrmuRcSn+0h1dycexIK1KCjYaCnjCCVqOFFJTZ5GkUUjESWaUIKU2lgCmAKKQIUjHapXRKE+t2og1VgankNYnohqKJ2CmKplso6GKz7WYCgqxeuyoF8u9IQAgA7",
            msg: null,
            msgText: "<em>Loading the next set of posts...</em>",
            selector: null,
            speed: 'fast',
            start: undefined
        },
        state: {
            isDuringAjax: false,
            isInvalidPage: false,
            isDestroyed: false,
            isDone: false, // For when it goes all the way through the archive.
            isPaused: false,
            isBeyondMaxPage: false,
            currPage: 1
        },
        debug: false,
        behavior: undefined,
        binder: $(window), // used to cache the selector
        nextSelector: "div.navigation a:first",
        navSelector: "div.navigation",
        contentSelector: null, // rename to pageFragment
        extraScrollPx: 150,
        itemSelector: "div.post",
        animate: false,
        pathParse: undefined,
        dataType: 'html',
        appendCallback: true,
        bufferPx: 40,
        errorCallback: function() {
        },
        infid: 0, //Instance ID
        pixelsFromNavToBottom: undefined,
        path: undefined, // Either parts of a URL as an array (e.g. ["/page/", "/"] or a function that takes in the page number and returns a URL
        prefill: false, // When the document is smaller than the window, load data until the document is larger or links are exhausted
        maxPage: undefined // to manually control maximum page (when maxPage is undefined, maximum page limitation is not work)
    };

    $.infinitescroll.prototype = {
        /*	
         ----------------------------
         Private methods
         ----------------------------
         */

        // Bind or unbind from scroll
        _binding: function infscr_binding(binding) {

            var instance = this,
                    opts = instance.options;

            opts.v = '2.0b2.120520';

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_binding_' + opts.behavior] !== undefined) {
                this['_binding_' + opts.behavior].call(this);
                return;
            }

            if (binding !== 'bind' && binding !== 'unbind') {
                this._debug('Binding value  ' + binding + ' not valid');
                return false;
            }

            if (binding === 'unbind') {
                (this.options.binder).unbind('smartscroll.infscr.' + instance.options.infid);
            } else {
                (this.options.binder)[binding]('smartscroll.infscr.' + instance.options.infid, function() {
                    instance.scroll();
                });
            }

            this._debug('Binding', binding);
        },
        // Fundamental aspects of the plugin are initialized
        _create: function infscr_create(options, callback) {

            // Add custom options to defaults
            var opts = $.extend(true, {}, $.infinitescroll.defaults, options);
            this.options = opts;
            var $window = $(window);
            var instance = this;

            // Validate selectors
            if (!instance._validate(options)) {
                return false;
            }

            // Validate page fragment path
            var path = $(opts.nextSelector).attr('href');

            if (path === false) {

                this._debug('Navigation selector not found');
                return false;
            }

            // Set the path to be a relative URL from root.
            opts.path = opts.path || this._determinepath(path);

            // contentSelector is 'page fragment' option for .load() / .ajax() calls
            opts.contentSelector = opts.contentSelector || this.element;

            // loading.selector - if we want to place the load message in a specific selector, defaulted to the contentSelector
            opts.loading.selector = opts.loading.selector || opts.contentSelector;

            // Define loading.msg
            opts.loading.msg = opts.loading.msg || $('<div id="infscr-loading"><img alt="Loading..." src="' + opts.loading.img + '" /><div>' + opts.loading.msgText + '</div></div>');

            // Preload loading.img
            (new Image()).src = opts.loading.img;

            // distance from nav links to bottom
            // computed as: height of the document + top offset of container - top offset of nav link
            if (opts.pixelsFromNavToBottom === undefined) {
                opts.pixelsFromNavToBottom = $(document).height() - $(opts.navSelector).offset().top;
                this._debug("pixelsFromNavToBottom: " + opts.pixelsFromNavToBottom);
            }

            var self = this;

            // determine loading.start actions
            opts.loading.start = opts.loading.start || function() {
                $(opts.navSelector).hide();
                opts.loading.msg
                        .appendTo(opts.loading.selector)
                        .fadeIn(opts.loading.speed, $.proxy(function() {
                    this.beginAjax(opts);
                }, self));
            };

            // determine loading.finished actions
            opts.loading.finished = opts.loading.finished || function() {
                if (!opts.state.isBeyondMaxPage)
                    opts.loading.msg.fadeOut(opts.loading.speed);
            };

            // callback loading
            opts.callback = function(instance, data, url) {
                if (!!opts.behavior && instance['_callback_' + opts.behavior] !== undefined) {
                    instance['_callback_' + opts.behavior].call($(opts.contentSelector)[0], data, url);
                }

                if (callback) {
                    callback.call($(opts.contentSelector)[0], data, opts, url);
                }

                if (opts.prefill) {
                    $window.bind("resize.infinite-scroll", instance._prefill);
                }
            };

            if (options.debug) {
                // Tell IE9 to use its built-in console
                if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log === "object") {
                    ["log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd"]
                            .forEach(function(method) {
                        console[method] = this.call(console[method], console);
                    }, Function.prototype.bind);
                }
            }

            this._setup();

            // Setups the prefill method for use
            if (opts.prefill) {
                this._prefill();
            }

            // Return true to indicate successful creation
            return true;
        },
        _prefill: function infscr_prefill() {
            var instance = this;
            var $window = $(window);

            function needsPrefill() {
                return (instance.options.contentSelector.height() <= $window.height());
            }

            this._prefill = function() {
                if (needsPrefill()) {
                    instance.scroll();
                }

                $window.bind("resize.infinite-scroll", function() {
                    if (needsPrefill()) {
                        $window.unbind("resize.infinite-scroll");
                        instance.scroll();
                    }
                });
            };

            // Call self after setting up the new function
            this._prefill();
        },
        // Console log wrapper
        _debug: function infscr_debug() {
            if (true !== this.options.debug) {
                return;
            }

            if (typeof console !== 'undefined' && typeof console.log === 'function') {
                // Modern browsers
                // Single argument, which is a string
                if ((Array.prototype.slice.call(arguments)).length === 1 && typeof Array.prototype.slice.call(arguments)[0] === 'string') {
                    console.log((Array.prototype.slice.call(arguments)).toString());
                } else {
                    console.log(Array.prototype.slice.call(arguments));
                }
            } else if (!Function.prototype.bind && typeof console !== 'undefined' && typeof console.log === 'object') {
                // IE8
                Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
            }
        },
        // find the number to increment in the path.
        _determinepath: function infscr_determinepath(path) {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_determinepath_' + opts.behavior] !== undefined) {
                return this['_determinepath_' + opts.behavior].call(this, path);
            }

            if (!!opts.pathParse) {

                this._debug('pathParse manual');
                return opts.pathParse(path, this.options.state.currPage + 1);

            } else if (path.match(/^(.*?)\b2\b(.*?$)/)) {
                path = path.match(/^(.*?)\b2\b(.*?$)/).slice(1);

                // if there is any 2 in the url at all.    
            } else if (path.match(/^(.*?)2(.*?$)/)) {

                // page= is used in django:
                // http://www.infinite-scroll.com/changelog/comment-page-1/#comment-127
                if (path.match(/^(.*?page=)2(\/.*|$)/)) {
                    path = path.match(/^(.*?page=)2(\/.*|$)/).slice(1);
                    return path;
                }

                path = path.match(/^(.*?)2(.*?$)/).slice(1);

            } else {

                // page= is used in drupal too but second page is page=1 not page=2:
                // thx Jerod Fritz, vladikoff
                if (path.match(/^(.*?page=)1(\/.*|$)/)) {
                    path = path.match(/^(.*?page=)1(\/.*|$)/).slice(1);
                    return path;
                } else {
                    this._debug('Sorry, we couldn\'t parse your Next (Previous Posts) URL. Verify your the css selector points to the correct A tag. If you still get this error: yell, scream, and kindly ask for help at infinite-scroll.com.');
                    // Get rid of isInvalidPage to allow permalink to state
                    opts.state.isInvalidPage = true;  //prevent it from running on this page.
                }
            }
            this._debug('determinePath', path);
            return path;

        },
        // Custom error
        _error: function infscr_error(xhr) {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_error_' + opts.behavior] !== undefined) {
                this['_error_' + opts.behavior].call(this, xhr);
                return;
            }

            if (xhr !== 'destroy' && xhr !== 'end') {
                xhr = 'unknown';
            }

            this._debug('Error', xhr);

            if (xhr === 'end' || opts.state.isBeyondMaxPage) {
                this._showdonemsg();
            }

            opts.state.isDone = true;
            opts.state.currPage = 1; // if you need to go back to this instance
            opts.state.isPaused = false;
            opts.state.isBeyondMaxPage = false;
            this._binding('unbind');

        },
        // Load Callback
        _loadcallback: function infscr_loadcallback(box, data, url) {
            var opts = this.options,
                    callback = this.options.callback, // GLOBAL OBJECT FOR CALLBACK
                    result = (opts.state.isDone) ? 'done' : (!opts.appendCallback) ? 'no-append' : 'append',
                    frag;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_loadcallback_' + opts.behavior] !== undefined) {
                this['_loadcallback_' + opts.behavior].call(this, box, data);
                return;
            }

            switch (result) {
                case 'done':
                    this._showdonemsg();
                    return false;

                case 'no-append':
                    if (opts.dataType === 'html') {
                        data = '<div>' + data + '</div>';
                        data = $(data).find(opts.itemSelector);
                    }
                    break;

                case 'append':
                    var children = box.children();
                    // if it didn't return anything
                    if (children.length === 0) {
                        return this._error('end');
                    }

                    // use a documentFragment because it works when content is going into a table or UL
                    frag = document.createDocumentFragment();
                    while (box[0].firstChild) {
                        frag.appendChild(box[0].firstChild);
                    }

                    this._debug('contentSelector', $(opts.contentSelector)[0]);
                    $(opts.contentSelector)[0].appendChild(frag);
                    // previously, we would pass in the new DOM element as context for the callback
                    // however we're now using a documentfragment, which doesn't have parents or children,
                    // so the context is the contentContainer guy, and we pass in an array
                    // of the elements collected as the first argument.

                    data = children.get();
                    break;
            }

            // loadingEnd function
            opts.loading.finished.call($(opts.contentSelector)[0], opts);

            // smooth scroll to ease in the new content
            if (opts.animate) {
                var scrollTo = $(window).scrollTop() + $(opts.loading.msg).height() + opts.extraScrollPx + 'px';
                $('html,body').animate({scrollTop: scrollTo}, 800, function() {
                    opts.state.isDuringAjax = false;
                });
            }

            if (!opts.animate) {
                // once the call is done, we can allow it again.
                opts.state.isDuringAjax = false;
            }

            callback(this, data, url);

            if (opts.prefill) {
                this._prefill();
            }
        },
        _nearbottom: function infscr_nearbottom() {

            var opts = this.options,
                    pixelsFromWindowBottomToBottom = 0 + $(document).height() - (opts.binder.scrollTop()) - $(window).height();

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_nearbottom_' + opts.behavior] !== undefined) {
                return this['_nearbottom_' + opts.behavior].call(this);
            }

            this._debug('math:', pixelsFromWindowBottomToBottom, opts.pixelsFromNavToBottom);

            // if distance remaining in the scroll (including buffer) is less than the orignal nav to bottom....
            return (pixelsFromWindowBottomToBottom - opts.bufferPx < opts.pixelsFromNavToBottom);

        },
        // Pause / temporarily disable plugin from firing
        _pausing: function infscr_pausing(pause) {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_pausing_' + opts.behavior] !== undefined) {
                this['_pausing_' + opts.behavior].call(this, pause);
                return;
            }

            // If pause is not 'pause' or 'resume', toggle it's value
            if (pause !== 'pause' && pause !== 'resume' && pause !== null) {
                this._debug('Invalid argument. Toggling pause value instead');
            }

            pause = (pause && (pause === 'pause' || pause === 'resume')) ? pause : 'toggle';

            switch (pause) {
                case 'pause':
                    opts.state.isPaused = true;
                    break;

                case 'resume':
                    opts.state.isPaused = false;
                    break;

                case 'toggle':
                    opts.state.isPaused = !opts.state.isPaused;
                    break;
            }

            this._debug('Paused', opts.state.isPaused);
            return false;

        },
        // Behavior is determined
        // If the behavior option is undefined, it will set to default and bind to scroll
        _setup: function infscr_setup() {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_setup_' + opts.behavior] !== undefined) {
                this['_setup_' + opts.behavior].call(this);
                return;
            }

            this._binding('bind');

            return false;

        },
        // Show done message
        _showdonemsg: function infscr_showdonemsg() {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_showdonemsg_' + opts.behavior] !== undefined) {
                this['_showdonemsg_' + opts.behavior].call(this);
                return;
            }

            opts.loading.msg
                    .find('img')
                    .hide()
                    .parent()
                    .find('div').html(opts.loading.finishedMsg).animate({opacity: 1}, 2000, function() {
                $(this).parent().fadeOut(opts.loading.speed);
            });

            // user provided callback when done    
            opts.errorCallback.call($(opts.contentSelector)[0], 'done');
        },
        // grab each selector option and see if any fail
        _validate: function infscr_validate(opts) {
            for (var key in opts) {
                if (key.indexOf && key.indexOf('Selector') > -1 && $(opts[key]).length === 0) {
                    this._debug('Your ' + key + ' found no elements.');
                    return false;
                }
            }

            return true;
        },
        /*	
         ----------------------------
         Public methods
         ----------------------------
         */

        // Bind to scroll
        bind: function infscr_bind() {
            this._binding('bind');
        },
        // Destroy current instance of plugin
        destroy: function infscr_destroy() {
            this.options.state.isDestroyed = true;
            this.options.loading.finished();
            return this._error('destroy');
        },
        // Set pause value to false
        pause: function infscr_pause() {
            this._pausing('pause');
        },
        // Set pause value to false
        resume: function infscr_resume() {
            this._pausing('resume');
        },
        beginAjax: function infscr_ajax(opts) {
            var instance = this,
                    path = opts.path,
                    box, desturl, method, condition;

            // increment the URL bit. e.g. /page/3/
            opts.state.currPage++;

            // Manually control maximum page 
            if (opts.maxPage != undefined && opts.state.currPage > opts.maxPage) {
                opts.state.isBeyondMaxPage = true;
                this.destroy();
                return;
            }

            // if we're dealing with a table we can't use DIVs
            box = $(opts.contentSelector).is('table, tbody') ? $('<tbody/>') : $('<div/>');

            desturl = (typeof path === 'function') ? path(opts.state.currPage) : path.join(opts.state.currPage);
            instance._debug('heading into ajax', desturl);

            method = (opts.dataType === 'html' || opts.dataType === 'json') ? opts.dataType : 'html+callback';
            if (opts.appendCallback && opts.dataType === 'html') {
                method += '+callback';
            }

            switch (method) {
                case 'html+callback':
                    instance._debug('Using HTML via .load() method');
                    box.load(desturl + ' ' + opts.itemSelector, undefined, function infscr_ajax_callback(responseText) {
                        instance._loadcallback(box, responseText, desturl);
                    });

                    break;

                case 'html':
                    instance._debug('Using ' + (method.toUpperCase()) + ' via $.ajax() method');
                    $.ajax({
                        // params
                        url: desturl,
                        dataType: opts.dataType,
                        complete: function infscr_ajax_callback(jqXHR, textStatus) {
                            condition = (typeof (jqXHR.isResolved) !== 'undefined') ? (jqXHR.isResolved()) : (textStatus === "success" || textStatus === "notmodified");
                            if (condition) {
                                instance._loadcallback(box, jqXHR.responseText, desturl);
                            } else {
                                instance._error('end');
                            }
                        }
                    });

                    break;
                case 'json':
                    instance._debug('Using ' + (method.toUpperCase()) + ' via $.ajax() method');
                    $.ajax({
                        dataType: 'json',
                        type: 'GET',
                        url: desturl,
                        success: function(data, textStatus, jqXHR) {
                            condition = (typeof (jqXHR.isResolved) !== 'undefined') ? (jqXHR.isResolved()) : (textStatus === "success" || textStatus === "notmodified");
                            if (opts.appendCallback) {
                                // if appendCallback is true, you must defined template in options.
                                // note that data passed into _loadcallback is already an html (after processed in opts.template(data)).
                                if (opts.template !== undefined) {
                                    var theData = opts.template(data);
                                    box.append(theData);
                                    if (condition) {
                                        instance._loadcallback(box, theData);
                                    } else {
                                        instance._error('end');
                                    }
                                } else {
                                    instance._debug("template must be defined.");
                                    instance._error('end');
                                }
                            } else {
                                // if appendCallback is false, we will pass in the JSON object. you should handle it yourself in your callback.
                                if (condition) {
                                    instance._loadcallback(box, data, desturl);
                                } else {
                                    instance._error('end');
                                }
                            }
                        },
                        error: function() {
                            instance._debug("JSON ajax request failed.");
                            instance._error('end');
                        }
                    });

                    break;
            }
        },
        // Retrieve next set of content items
        retrieve: function infscr_retrieve(pageNum) {
            pageNum = pageNum || null;

            var instance = this,
                    opts = instance.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['retrieve_' + opts.behavior] !== undefined) {
                this['retrieve_' + opts.behavior].call(this, pageNum);
                return;
            }

            // for manual triggers, if destroyed, get out of here
            if (opts.state.isDestroyed) {
                this._debug('Instance is destroyed');
                return false;
            }

            // we dont want to fire the ajax multiple times
            opts.state.isDuringAjax = true;

            opts.loading.start.call($(opts.contentSelector)[0], opts);
        },
        // Check to see next page is needed
        scroll: function infscr_scroll() {

            var opts = this.options,
                    state = opts.state;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['scroll_' + opts.behavior] !== undefined) {
                this['scroll_' + opts.behavior].call(this);
                return;
            }

            if (state.isDuringAjax || state.isInvalidPage || state.isDone || state.isDestroyed || state.isPaused) {
                return;
            }

            if (!this._nearbottom()) {
                return;
            }

            this.retrieve();

        },
        // Toggle pause value
        toggle: function infscr_toggle() {
            this._pausing();
        },
        // Unbind from scroll
        unbind: function infscr_unbind() {
            this._binding('unbind');
        },
        // update options
        update: function infscr_options(key) {
            if ($.isPlainObject(key)) {
                this.options = $.extend(true, this.options, key);
            }
        }
    };


    /*	
     ----------------------------
     Infinite Scroll function
     ----------------------------
     
     Borrowed logic from the following...
     
     jQuery UI
     - https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
     
     jCarousel
     - https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js
     
     Masonry
     - https://github.com/desandro/masonry/blob/master/jquery.masonry.js		
     
     */

    $.fn.infinitescroll = function infscr_init(options, callback) {


        var thisCall = typeof options;

        switch (thisCall) {

            // method 
            case 'string':
                var args = Array.prototype.slice.call(arguments, 1);

                this.each(function() {
                    var instance = $.data(this, 'infinitescroll');

                    if (!instance) {
                        // not setup yet
                        // return $.error('Method ' + options + ' cannot be called until Infinite Scroll is setup');
                        return false;
                    }

                    if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                        // return $.error('No such method ' + options + ' for Infinite Scroll');
                        return false;
                    }

                    // no errors!
                    instance[options].apply(instance, args);
                });

                break;

                // creation 
            case 'object':

                this.each(function() {

                    var instance = $.data(this, 'infinitescroll');

                    if (instance) {

                        // update options of current instance
                        instance.update(options);

                    } else {

                        // initialize new instance
                        instance = new $.infinitescroll(options, callback, this);

                        // don't attach if instantiation failed
                        if (!instance.failed) {
                            $.data(this, 'infinitescroll', instance);
                        }

                    }

                });

                break;

        }

        return this;
    };



    /* 
     * smartscroll: debounced scroll event for jQuery *
     * https://github.com/lukeshumard/smartscroll
     * Based on smartresize by @louis_remi: https://github.com/lrbabe/jquery.smartresize.js *
     * Copyright 2011 Louis-Remi & Luke Shumard * Licensed under the MIT license. *
     */

    var event = $.event,
            scrollTimeout;

    event.special.smartscroll = {
        setup: function() {
            $(this).bind("scroll", event.special.smartscroll.handler);
        },
        teardown: function() {
            $(this).unbind("scroll", event.special.smartscroll.handler);
        },
        handler: function(event, execAsap) {
            // Save the context
            var context = this,
                    args = arguments;

            // set correct event type
            event.type = "smartscroll";

            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(function() {
                $(context).trigger('smartscroll', args);
            }, execAsap === "execAsap" ? 0 : 100);
        }
    };

    $.fn.smartscroll = function(fn) {
        return fn ? this.bind("smartscroll", fn) : this.trigger("smartscroll", ["execAsap"]);
    };


})(window, jQuery);
/**
 * Isotope v1.5.25
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time purchase of a commercial license
 * http://isotope.metafizzy.co/docs/license.html
 *
 * Non-commercial use is licensed under the MIT License
 *
 * Copyright 2013 Metafizzy
 */

/*jshint asi: true, browser: true, curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: false */

(function(window, $, undefined) {

    'use strict';

    // get global vars
    var document = window.document;
    var Modernizr = window.Modernizr;

    // helper function
    var capitalize = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // ========================= getStyleProperty by kangax ===============================
    // http://perfectionkills.com/feature-testing-css-properties/

    var prefixes = 'Moz Webkit O Ms'.split(' ');

    var getStyleProperty = function(propName) {
        var style = document.documentElement.style,
                prefixed;

        // test standard property first
        if (typeof style[propName] === 'string') {
            return propName;
        }

        // capitalize
        propName = capitalize(propName);

        // test vendor specific properties
        for (var i = 0, len = prefixes.length; i < len; i++) {
            prefixed = prefixes[i] + propName;
            if (typeof style[ prefixed ] === 'string') {
                return prefixed;
            }
        }
    };

    var transformProp = getStyleProperty('transform'),
            transitionProp = getStyleProperty('transitionProperty');


    // ========================= miniModernizr ===============================
    // <3<3<3 and thanks to Faruk and Paul for doing the heavy lifting

    /*!
     * Modernizr v1.6ish: miniModernizr for Isotope
     * http://www.modernizr.com
     *
     * Developed by:
     * - Faruk Ates  http://farukat.es/
     * - Paul Irish  http://paulirish.com/
     *
     * Copyright (c) 2009-2010
     * Dual-licensed under the BSD or MIT licenses.
     * http://www.modernizr.com/license/
     */

    /*
     * This version whittles down the script just to check support for
     * CSS transitions, transforms, and 3D transforms.
     */

    var tests = {
        csstransforms: function() {
            return !!transformProp;
        },
        csstransforms3d: function() {
            var test = !!getStyleProperty('perspective');
            // double check for Chrome's false positive
            if (test) {

                var vendorCSSPrefixes = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),
                        mediaQuery = '@media (' + vendorCSSPrefixes.join('transform-3d),(') + 'modernizr)',
                        $style = $('<style>' + mediaQuery + '{#modernizr{height:3px}}' + '</style>')
                        .appendTo('head'),
                        $div = $('<div id="modernizr" />').appendTo('html');

                test = $div.height() === 3;

                $div.remove();
                $style.remove();
            }
            return test;
        },
        csstransitions: function() {
            return !!transitionProp;
        }
    };

    var testName;

    if (Modernizr) {
        // if there's a previous Modernzir, check if there are necessary tests
        for (testName in tests) {
            if (!Modernizr.hasOwnProperty(testName)) {
                // if test hasn't been run, use addTest to run it
                Modernizr.addTest(testName, tests[ testName ]);
            }
        }
    } else {
        // or create new mini Modernizr that just has the 3 tests
        Modernizr = window.Modernizr = {
            _version: '1.6ish: miniModernizr for Isotope'
        };

        var classes = ' ';
        var result;

        // Run through tests
        for (testName in tests) {
            result = tests[ testName ]();
            Modernizr[ testName ] = result;
            classes += ' ' + (result ? '' : 'no-') + testName;
        }

        // Add the new classes to the <html> element.
        $('html').addClass(classes);
    }


    // ========================= isoTransform ===============================

    /**
     *  provides hooks for .css({ scale: value, translate: [x, y] })
     *  Progressively enhanced CSS transforms
     *  Uses hardware accelerated 3D transforms for Safari
     *  or falls back to 2D transforms.
     */

    if (Modernizr.csstransforms) {

        // i.e. transformFnNotations.scale(0.5) >> 'scale3d( 0.5, 0.5, 1)'
        var transformFnNotations = Modernizr.csstransforms3d ?
                {// 3D transform functions
                    translate: function(position) {

                        return 'translate3d(' + position[0] + 'px, ' + position[1] + 'px, 0) ';
                    },
                    scale: function(scale) {
                        return 'scale3d(' + scale + ', ' + scale + ', 1) ';
                    }
                } : {// 2D transform functions
            translate: function(position) {

                return 'translate(' + position[0] + 'px, ' + position[1] + 'px) ';
            },
            scale: function(scale) {
                return 'scale(' + scale + ') ';
            }
        }
        ;

        var setIsoTransform = function(elem, name, value) {
            // unpack current transform data
            var data = $.data(elem, 'isoTransform') || {},
                    newData = {},
                    fnName,
                    transformObj = {},
                    transformValue;

            // i.e. newData.scale = 0.5
            newData[ name ] = value;
            // extend new value over current data
            $.extend(data, newData);

            for (fnName in data) {
                transformValue = data[ fnName ];
                transformObj[ fnName ] = transformFnNotations[ fnName ](transformValue);
            }

            // get proper order
            // ideally, we could loop through this give an array, but since we only have
            // a couple transforms we're keeping track of, we'll do it like so
            var translateFn = transformObj.translate || '',
                    scaleFn = transformObj.scale || '',
                    // sorting so translate always comes first
                    valueFns = translateFn + scaleFn;

            // set data back in elem
            $.data(elem, 'isoTransform', data);

            // set name to vendor specific property
            elem.style[ transformProp ] = valueFns;
        };

        // ==================== scale ===================

        $.cssNumber.scale = true;

        $.cssHooks.scale = {
            set: function(elem, value) {
                // uncomment this bit if you want to properly parse strings
                // if ( typeof value === 'string' ) {
                //   value = parseFloat( value );
                // }
                setIsoTransform(elem, 'scale', value);
            },
            get: function(elem, computed) {
                var transform = $.data(elem, 'isoTransform');
                return transform && transform.scale ? transform.scale : 1;
            }
        };

        $.fx.step.scale = function(fx) {
            $.cssHooks.scale.set(fx.elem, fx.now + fx.unit);
        };


        // ==================== translate ===================

        $.cssNumber.translate = true;

        $.cssHooks.translate = {
            set: function(elem, value) {

                // uncomment this bit if you want to properly parse strings
                // if ( typeof value === 'string' ) {
                //   value = value.split(' ');
                // }
                //
                // var i, val;
                // for ( i = 0; i < 2; i++ ) {
                //   val = value[i];
                //   if ( typeof val === 'string' ) {
                //     val = parseInt( val );
                //   }
                // }

                setIsoTransform(elem, 'translate', value);
            },
            get: function(elem, computed) {
                var transform = $.data(elem, 'isoTransform');
                return transform && transform.translate ? transform.translate : [0, 0];
            }
        };

    }

    // ========================= get transition-end event ===============================
    var transitionEndEvent, transitionDurProp;

    if (Modernizr.csstransitions) {
        transitionEndEvent = {
            WebkitTransitionProperty: 'webkitTransitionEnd', // webkit
            MozTransitionProperty: 'transitionend',
            OTransitionProperty: 'oTransitionEnd otransitionend',
            transitionProperty: 'transitionend'
        }[ transitionProp ];

        transitionDurProp = getStyleProperty('transitionDuration');
    }

    // ========================= smartresize ===============================

    /*
     * smartresize: debounced resize event for jQuery
     *
     * latest version and complete README available on Github:
     * https://github.com/louisremi/jquery.smartresize.js
     *
     * Copyright 2011 @louis_remi
     * Licensed under the MIT license.
     */

    var $event = $.event,
            dispatchMethod = $.event.handle ? 'handle' : 'dispatch',
            resizeTimeout;

    $event.special.smartresize = {
        setup: function() {
            $(this).bind("resize", $event.special.smartresize.handler);
        },
        teardown: function() {
            $(this).unbind("resize", $event.special.smartresize.handler);
        },
        handler: function(event, execAsap) {
            // Save the context
            var context = this,
                    args = arguments;

            // set correct event type
            event.type = "smartresize";

            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(function() {
                $event[ dispatchMethod ].apply(context, args);
            }, execAsap === "execAsap" ? 0 : 100);
        }
    };

    $.fn.smartresize = function(fn) {
        return fn ? this.bind("smartresize", fn) : this.trigger("smartresize", ["execAsap"]);
    };



// ========================= Isotope ===============================


    // our "Widget" object constructor
    $.Isotope = function(options, element, callback) {
        this.element = $(element);

        this._create(options);
        this._init(callback);
    };

    // styles of container element we want to keep track of
    var isoContainerStyles = ['width', 'height'];

    var $window = $(window);

    $.Isotope.settings = {
        resizable: true,
        layoutMode: 'masonry',
        containerClass: 'isotope',
        itemClass: 'isotope-item',
        hiddenClass: 'isotope-hidden',
        hiddenStyle: {opacity: 0, scale: 0.001},
        visibleStyle: {opacity: 1, scale: 1},
        containerStyle: {
            position: 'relative',
            overflow: 'hidden'
        },
        animationEngine: 'best-available',
        animationOptions: {
            queue: false,
            duration: 800
        },
        sortBy: 'original-order',
        sortAscending: true,
        resizesContainer: true,
        transformsEnabled: true,
        itemPositionDataEnabled: false
    };

    $.Isotope.prototype = {
        // sets up widget
        _create: function(options) {

            this.options = $.extend({}, $.Isotope.settings, options);

            this.styleQueue = [];
            this.elemCount = 0;

            // get original styles in case we re-apply them in .destroy()
            var elemStyle = this.element[0].style;
            this.originalStyle = {};
            // keep track of container styles
            var containerStyles = isoContainerStyles.slice(0);
            for (var prop in this.options.containerStyle) {
                containerStyles.push(prop);
            }
            for (var i = 0, len = containerStyles.length; i < len; i++) {
                prop = containerStyles[i];
                this.originalStyle[ prop ] = elemStyle[ prop ] || '';
            }
            // apply container style from options
            this.element.css(this.options.containerStyle);

            this._updateAnimationEngine();
            this._updateUsingTransforms();

            // sorting
            var originalOrderSorter = {
                'original-order': function($elem, instance) {
                    instance.elemCount++;
                    return instance.elemCount;
                },
                random: function() {
                    return Math.random();
                }
            };

            this.options.getSortData = $.extend(this.options.getSortData, originalOrderSorter);

            // need to get atoms
            this.reloadItems();

            // get top left position of where the bricks should be
            this.offset = {
                left: parseInt((this.element.css('padding-left') || 0), 10),
                top: parseInt((this.element.css('padding-top') || 0), 10)
            };

            // add isotope class first time around
            var instance = this;
            setTimeout(function() {
                instance.element.addClass(instance.options.containerClass);
            }, 0);

            // bind resize method
            if (this.options.resizable) {
                $window.bind('smartresize.isotope', function() {
                    instance.resize();
                });
            }

            // dismiss all click events from hidden events
            this.element.delegate('.' + this.options.hiddenClass, 'click', function() {
                return false;
            });

        },
        _getAtoms: function($elems) {
            var selector = this.options.itemSelector,
                    // filter & find
                    $atoms = selector ? $elems.filter(selector).add($elems.find(selector)) : $elems,
                    // base style for atoms
                    atomStyle = {position: 'absolute'};

            // filter out text nodes
            $atoms = $atoms.filter(function(i, atom) {
                return atom.nodeType === 1;
            });

            if (this.usingTransforms) {
                atomStyle.left = 0;
                atomStyle.top = 0;
            }

            $atoms.css(atomStyle).addClass(this.options.itemClass);

            this.updateSortData($atoms, true);

            return $atoms;
        },
        // _init fires when your instance is first created
        // (from the constructor above), and when you
        // attempt to initialize the widget again (by the bridge)
        // after it has already been initialized.
        _init: function(callback) {

            this.$filteredAtoms = this._filter(this.$allAtoms);
            this._sort();
            this.reLayout(callback);

        },
        option: function(opts) {
            // change options AFTER initialization:
            // signature: $('#foo').bar({ cool:false });
            if ($.isPlainObject(opts)) {
                this.options = $.extend(true, this.options, opts);

                // trigger _updateOptionName if it exists
                var updateOptionFn;
                for (var optionName in opts) {
                    updateOptionFn = '_update' + capitalize(optionName);
                    if (this[ updateOptionFn ]) {
                        this[ updateOptionFn ]();
                    }
                }
            }
        },
        // ====================== updaters ====================== //
        // kind of like setters

        _updateAnimationEngine: function() {
            var animationEngine = this.options.animationEngine.toLowerCase().replace(/[ _\-]/g, '');
            var isUsingJQueryAnimation;
            // set applyStyleFnName
            switch (animationEngine) {
                case 'css' :
                case 'none' :
                    isUsingJQueryAnimation = false;
                    break;
                case 'jquery' :
                    isUsingJQueryAnimation = true;
                    break;
                default : // best available
                    isUsingJQueryAnimation = !Modernizr.csstransitions;
            }
            this.isUsingJQueryAnimation = isUsingJQueryAnimation;
            this._updateUsingTransforms();
        },
        _updateTransformsEnabled: function() {
            this._updateUsingTransforms();
        },
        _updateUsingTransforms: function() {
            var usingTransforms = this.usingTransforms = this.options.transformsEnabled &&
                    Modernizr.csstransforms && Modernizr.csstransitions && !this.isUsingJQueryAnimation;

            // prevent scales when transforms are disabled
            if (!usingTransforms) {
                delete this.options.hiddenStyle.scale;
                delete this.options.visibleStyle.scale;
            }

            this.getPositionStyles = usingTransforms ? this._translate : this._positionAbs;
        },
        // ====================== Filtering ======================

        _filter: function($atoms) {
            var filter = this.options.filter === '' ? '*' : this.options.filter;

            if (!filter) {
                return $atoms;
            }

            var hiddenClass = this.options.hiddenClass,
                    hiddenSelector = '.' + hiddenClass,
                    $hiddenAtoms = $atoms.filter(hiddenSelector),
                    $atomsToShow = $hiddenAtoms;

            if (filter !== '*') {
                $atomsToShow = $hiddenAtoms.filter(filter);
                var $atomsToHide = $atoms.not(hiddenSelector).not(filter).addClass(hiddenClass);
                this.styleQueue.push({$el: $atomsToHide, style: this.options.hiddenStyle});
            }

            this.styleQueue.push({$el: $atomsToShow, style: this.options.visibleStyle});
            $atomsToShow.removeClass(hiddenClass);

            return $atoms.filter(filter);
        },
        // ====================== Sorting ======================

        updateSortData: function($atoms, isIncrementingElemCount) {
            var instance = this,
                    getSortData = this.options.getSortData,
                    $this, sortData;
            $atoms.each(function() {
                $this = $(this);
                sortData = {};
                // get value for sort data based on fn( $elem ) passed in
                for (var key in getSortData) {
                    if (!isIncrementingElemCount && key === 'original-order') {
                        // keep original order original
                        sortData[ key ] = $.data(this, 'isotope-sort-data')[ key ];
                    } else {
                        sortData[ key ] = getSortData[ key ]($this, instance);
                    }
                }
                // apply sort data to element
                $.data(this, 'isotope-sort-data', sortData);
            });
        },
        // used on all the filtered atoms
        _sort: function() {

            var sortBy = this.options.sortBy,
                    getSorter = this._getSorter,
                    sortDir = this.options.sortAscending ? 1 : -1,
                    sortFn = function(alpha, beta) {
                var a = getSorter(alpha, sortBy),
                        b = getSorter(beta, sortBy);
                // fall back to original order if data matches
                if (a === b && sortBy !== 'original-order') {
                    a = getSorter(alpha, 'original-order');
                    b = getSorter(beta, 'original-order');
                }
                return ((a > b) ? 1 : (a < b) ? -1 : 0) * sortDir;
            };

            this.$filteredAtoms.sort(sortFn);
        },
        _getSorter: function(elem, sortBy) {
            return $.data(elem, 'isotope-sort-data')[ sortBy ];
        },
        // ====================== Layout Helpers ======================

        _translate: function(x, y) {
            return {translate: [x, y]};
        },
        _positionAbs: function(x, y) {
            return {left: x, top: y};
        },
        _pushPosition: function($elem, x, y) {
            x = Math.round(x + this.offset.left);
            y = Math.round(y + this.offset.top);
            var position = this.getPositionStyles(x, y);
            this.styleQueue.push({$el: $elem, style: position});
            if (this.options.itemPositionDataEnabled) {
                $elem.data('isotope-item-position', {x: x, y: y});
            }
        },
        // ====================== General Layout ======================

        // used on collection of atoms (should be filtered, and sorted before )
        // accepts atoms-to-be-laid-out to start with
        layout: function($elems, callback) {

            var layoutMode = this.options.layoutMode;

            // layout logic
            this[ '_' + layoutMode + 'Layout' ]($elems);

            // set the size of the container
            if (this.options.resizesContainer) {
                var containerStyle = this[ '_' + layoutMode + 'GetContainerSize' ]();
                this.styleQueue.push({$el: this.element, style: containerStyle});
            }

            this._processStyleQueue($elems, callback);

            this.isLaidOut = true;
        },
        _processStyleQueue: function($elems, callback) {
            // are we animating the layout arrangement?
            // use plugin-ish syntax for css or animate
            var styleFn = !this.isLaidOut ? 'css' : (
                    this.isUsingJQueryAnimation ? 'animate' : 'css'
                    ),
                    animOpts = this.options.animationOptions,
                    onLayout = this.options.onLayout,
                    objStyleFn, processor,
                    triggerCallbackNow, callbackFn;

            // default styleQueue processor, may be overwritten down below
            processor = function(i, obj) {
                obj.$el[ styleFn ](obj.style, animOpts);
            };

            if (this._isInserting && this.isUsingJQueryAnimation) {
                // if using styleQueue to insert items
                processor = function(i, obj) {
                    // only animate if it not being inserted
                    objStyleFn = obj.$el.hasClass('no-transition') ? 'css' : styleFn;
                    obj.$el[ objStyleFn ](obj.style, animOpts);
                };

            } else if (callback || onLayout || animOpts.complete) {
                // has callback
                var isCallbackTriggered = false,
                        // array of possible callbacks to trigger
                        callbacks = [callback, onLayout, animOpts.complete],
                        instance = this;
                triggerCallbackNow = true;
                // trigger callback only once
                callbackFn = function() {
                    if (isCallbackTriggered) {
                        return;
                    }
                    var hollaback;
                    for (var i = 0, len = callbacks.length; i < len; i++) {
                        hollaback = callbacks[i];
                        if (typeof hollaback === 'function') {
                            hollaback.call(instance.element, $elems, instance);
                        }
                    }
                    isCallbackTriggered = true;
                };

                if (this.isUsingJQueryAnimation && styleFn === 'animate') {
                    // add callback to animation options
                    animOpts.complete = callbackFn;
                    triggerCallbackNow = false;

                } else if (Modernizr.csstransitions) {
                    // detect if first item has transition
                    var i = 0,
                            firstItem = this.styleQueue[0],
                            testElem = firstItem && firstItem.$el,
                            styleObj;
                    // get first non-empty jQ object
                    while (!testElem || !testElem.length) {
                        styleObj = this.styleQueue[ i++ ];
                        // HACK: sometimes styleQueue[i] is undefined
                        if (!styleObj) {
                            return;
                        }
                        testElem = styleObj.$el;
                    }
                    // get transition duration of the first element in that object
                    // yeah, this is inexact
                    var duration = parseFloat(getComputedStyle(testElem[0])[ transitionDurProp ]);
                    if (duration > 0) {
                        processor = function(i, obj) {
                            obj.$el[ styleFn ](obj.style, animOpts)
                                    // trigger callback at transition end
                                    .one(transitionEndEvent, callbackFn);
                        };
                        triggerCallbackNow = false;
                    }
                }
            }

            // process styleQueue
            $.each(this.styleQueue, processor);

            if (triggerCallbackNow) {
                callbackFn();
            }

            // clear out queue for next time
            this.styleQueue = [];
        },
        resize: function() {
            if (this[ '_' + this.options.layoutMode + 'ResizeChanged' ]()) {
                this.reLayout();
            }
        },
        reLayout: function(callback) {

            this[ '_' + this.options.layoutMode + 'Reset' ]();
            this.layout(this.$filteredAtoms, callback);

        },
        // ====================== Convenience methods ======================

        // ====================== Adding items ======================

        // adds a jQuery object of items to a isotope container
        addItems: function($content, callback) {
            var $newAtoms = this._getAtoms($content);
            // add new atoms to atoms pools
            this.$allAtoms = this.$allAtoms.add($newAtoms);

            if (callback) {
                callback($newAtoms);
            }
        },
        // convienence method for adding elements properly to any layout
        // positions items, hides them, then animates them back in <--- very sezzy
        insert: function($content, callback) {
            // position items
            this.element.append($content);

            var instance = this;
            this.addItems($content, function($newAtoms) {
                var $newFilteredAtoms = instance._filter($newAtoms);
                instance._addHideAppended($newFilteredAtoms);
                instance._sort();
                instance.reLayout();
                instance._revealAppended($newFilteredAtoms, callback);
            });

        },
        // convienence method for working with Infinite Scroll
        appended: function($content, callback) {
            var instance = this;
            this.addItems($content, function($newAtoms) {
                instance._addHideAppended($newAtoms);
                instance.layout($newAtoms);
                instance._revealAppended($newAtoms, callback);
            });
        },
        // adds new atoms, then hides them before positioning
        _addHideAppended: function($newAtoms) {
            this.$filteredAtoms = this.$filteredAtoms.add($newAtoms);
            $newAtoms.addClass('no-transition');

            this._isInserting = true;

            // apply hidden styles
            this.styleQueue.push({$el: $newAtoms, style: this.options.hiddenStyle});
        },
        // sets visible style on new atoms
        _revealAppended: function($newAtoms, callback) {
            var instance = this;
            // apply visible style after a sec
            setTimeout(function() {
                // enable animation
                $newAtoms.removeClass('no-transition');
                // reveal newly inserted filtered elements
                instance.styleQueue.push({$el: $newAtoms, style: instance.options.visibleStyle});
                instance._isInserting = false;
                instance._processStyleQueue($newAtoms, callback);
            }, 10);
        },
        // gathers all atoms
        reloadItems: function() {
            this.$allAtoms = this._getAtoms(this.element.children());
        },
        // removes elements from Isotope widget
        remove: function($content, callback) {
            // remove elements immediately from Isotope instance
            this.$allAtoms = this.$allAtoms.not($content);
            this.$filteredAtoms = this.$filteredAtoms.not($content);
            // remove() as a callback, for after transition / animation
            var instance = this;
            var removeContent = function() {
                $content.remove();
                if (callback) {
                    callback.call(instance.element);
                }
            };

            if ($content.filter(':not(.' + this.options.hiddenClass + ')').length) {
                // if any non-hidden content needs to be removed
                this.styleQueue.push({$el: $content, style: this.options.hiddenStyle});
                this._sort();
                this.reLayout(removeContent);
            } else {
                // remove it now
                removeContent();
            }

        },
        shuffle: function(callback) {
            this.updateSortData(this.$allAtoms);
            this.options.sortBy = 'random';
            this._sort();
            this.reLayout(callback);
        },
        // destroys widget, returns elements and container back (close) to original style
        destroy: function() {

            var usingTransforms = this.usingTransforms;
            var options = this.options;

            this.$allAtoms
                    .removeClass(options.hiddenClass + ' ' + options.itemClass)
                    .each(function() {
                var style = this.style;
                style.position = '';
                style.top = '';
                style.left = '';
                style.opacity = '';
                if (usingTransforms) {
                    style[ transformProp ] = '';
                }
            });

            // re-apply saved container styles
            var elemStyle = this.element[0].style;
            for (var prop in this.originalStyle) {
                elemStyle[ prop ] = this.originalStyle[ prop ];
            }

            this.element
                    .unbind('.isotope')
                    .undelegate('.' + options.hiddenClass, 'click')
                    .removeClass(options.containerClass)
                    .removeData('isotope');

            $window.unbind('.isotope');

        },
        // ====================== LAYOUTS ======================

        // calculates number of rows or columns
        // requires columnWidth or rowHeight to be set on namespaced object
        // i.e. this.masonry.columnWidth = 200
        _getSegments: function(isRows) {
            var namespace = this.options.layoutMode,
                    measure = isRows ? 'rowHeight' : 'columnWidth',
                    size = isRows ? 'height' : 'width',
                    segmentsName = isRows ? 'rows' : 'cols',
                    containerSize = this.element[ size ](),
                    segments,
                    // i.e. options.masonry && options.masonry.columnWidth
                    segmentSize = this.options[ namespace ] && this.options[ namespace ][ measure ] ||
                    // or use the size of the first item, i.e. outerWidth
                    this.$filteredAtoms[ 'outer' + capitalize(size) ](true) ||
                    // if there's no items, use size of container
                    containerSize;

            segments = Math.floor(containerSize / segmentSize);
            segments = Math.max(segments, 1);

            // i.e. this.masonry.cols = ....
            this[ namespace ][ segmentsName ] = segments;
            // i.e. this.masonry.columnWidth = ...
            this[ namespace ][ measure ] = segmentSize;

        },
        _checkIfSegmentsChanged: function(isRows) {
            var namespace = this.options.layoutMode,
                    segmentsName = isRows ? 'rows' : 'cols',
                    prevSegments = this[ namespace ][ segmentsName ];
            // update cols/rows
            this._getSegments(isRows);
            // return if updated cols/rows is not equal to previous
            return (this[ namespace ][ segmentsName ] !== prevSegments);
        },
        // ====================== Masonry ======================

        _masonryReset: function() {
            // layout-specific props
            this.masonry = {};
            // FIXME shouldn't have to call this again
            this._getSegments();
            var i = this.masonry.cols;
            this.masonry.colYs = [];
            while (i--) {
                this.masonry.colYs.push(0);
            }
        },
        _masonryLayout: function($elems) {
            var instance = this,
                    props = instance.masonry;
            $elems.each(function() {
                var $this = $(this),
                        //how many columns does this brick span
                        colSpan = Math.ceil($this.outerWidth(true) / props.columnWidth);
                colSpan = Math.min(colSpan, props.cols);

                if (colSpan === 1) {
                    // if brick spans only one column, just like singleMode
                    instance._masonryPlaceBrick($this, props.colYs);
                } else {
                    // brick spans more than one column
                    // how many different places could this brick fit horizontally
                    var groupCount = props.cols + 1 - colSpan,
                            groupY = [],
                            groupColY,
                            i;

                    // for each group potential horizontal position
                    for (i = 0; i < groupCount; i++) {
                        // make an array of colY values for that one group
                        groupColY = props.colYs.slice(i, i + colSpan);
                        // and get the max value of the array
                        groupY[i] = Math.max.apply(Math, groupColY);
                    }

                    instance._masonryPlaceBrick($this, groupY);
                }
            });
        },
        // worker method that places brick in the columnSet
        //   with the the minY
        _masonryPlaceBrick: function($brick, setY) {
            // get the minimum Y value from the columns
            var minimumY = Math.min.apply(Math, setY),
                    shortCol = 0;

            // Find index of short column, the first from the left
            for (var i = 0, len = setY.length; i < len; i++) {
                if (setY[i] === minimumY) {
                    shortCol = i;
                    break;
                }
            }

            // position the brick
            var x = this.masonry.columnWidth * shortCol,
                    y = minimumY;
            this._pushPosition($brick, x, y);

            // apply setHeight to necessary columns
            var setHeight = minimumY + $brick.outerHeight(true),
                    setSpan = this.masonry.cols + 1 - len;
            for (i = 0; i < setSpan; i++) {
                this.masonry.colYs[ shortCol + i ] = setHeight;
            }

        },
        _masonryGetContainerSize: function() {
            var containerHeight = Math.max.apply(Math, this.masonry.colYs);
            return {height: containerHeight};
        },
        _masonryResizeChanged: function() {
            return this._checkIfSegmentsChanged();
        },
        // ====================== fitRows ======================

        _fitRowsReset: function() {
            this.fitRows = {
                x: 0,
                y: 0,
                height: 0
            };
        },
        _fitRowsLayout: function($elems) {
            var instance = this,
                    containerWidth = this.element.width(),
                    props = this.fitRows;

            $elems.each(function() {
                var $this = $(this),
                        atomW = $this.outerWidth(true),
                        atomH = $this.outerHeight(true);

                if (props.x !== 0 && atomW + props.x > containerWidth) {
                    // if this element cannot fit in the current row
                    props.x = 0;
                    props.y = props.height;
                }

                // position the atom
                instance._pushPosition($this, props.x, props.y);

                props.height = Math.max(props.y + atomH, props.height);
                props.x += atomW;

            });
        },
        _fitRowsGetContainerSize: function() {
            return {height: this.fitRows.height};
        },
        _fitRowsResizeChanged: function() {
            return true;
        },
        // ====================== cellsByRow ======================

        _cellsByRowReset: function() {
            this.cellsByRow = {
                index: 0
            };
            // get this.cellsByRow.columnWidth
            this._getSegments();
            // get this.cellsByRow.rowHeight
            this._getSegments(true);
        },
        _cellsByRowLayout: function($elems) {
            var instance = this,
                    props = this.cellsByRow;
            $elems.each(function() {
                var $this = $(this),
                        col = props.index % props.cols,
                        row = Math.floor(props.index / props.cols),
                        x = (col + 0.5) * props.columnWidth - $this.outerWidth(true) / 2,
                        y = (row + 0.5) * props.rowHeight - $this.outerHeight(true) / 2;
                instance._pushPosition($this, x, y);
                props.index++;
            });
        },
        _cellsByRowGetContainerSize: function() {
            return {height: Math.ceil(this.$filteredAtoms.length / this.cellsByRow.cols) * this.cellsByRow.rowHeight + this.offset.top};
        },
        _cellsByRowResizeChanged: function() {
            return this._checkIfSegmentsChanged();
        },
        // ====================== straightDown ======================

        _straightDownReset: function() {
            this.straightDown = {
                y: 0
            };
        },
        _straightDownLayout: function($elems) {
            var instance = this;
            $elems.each(function(i) {
                var $this = $(this);
                instance._pushPosition($this, 0, instance.straightDown.y);
                instance.straightDown.y += $this.outerHeight(true);
            });
        },
        _straightDownGetContainerSize: function() {
            return {height: this.straightDown.y};
        },
        _straightDownResizeChanged: function() {
            return true;
        },
        // ====================== masonryHorizontal ======================

        _masonryHorizontalReset: function() {
            // layout-specific props
            this.masonryHorizontal = {};
            // FIXME shouldn't have to call this again
            this._getSegments(true);
            var i = this.masonryHorizontal.rows;
            this.masonryHorizontal.rowXs = [];
            while (i--) {
                this.masonryHorizontal.rowXs.push(0);
            }
        },
        _masonryHorizontalLayout: function($elems) {
            var instance = this,
                    props = instance.masonryHorizontal;
            $elems.each(function() {
                var $this = $(this),
                        //how many rows does this brick span
                        rowSpan = Math.ceil($this.outerHeight(true) / props.rowHeight);
                rowSpan = Math.min(rowSpan, props.rows);

                if (rowSpan === 1) {
                    // if brick spans only one column, just like singleMode
                    instance._masonryHorizontalPlaceBrick($this, props.rowXs);
                } else {
                    // brick spans more than one row
                    // how many different places could this brick fit horizontally
                    var groupCount = props.rows + 1 - rowSpan,
                            groupX = [],
                            groupRowX, i;

                    // for each group potential horizontal position
                    for (i = 0; i < groupCount; i++) {
                        // make an array of colY values for that one group
                        groupRowX = props.rowXs.slice(i, i + rowSpan);
                        // and get the max value of the array
                        groupX[i] = Math.max.apply(Math, groupRowX);
                    }

                    instance._masonryHorizontalPlaceBrick($this, groupX);
                }
            });
        },
        _masonryHorizontalPlaceBrick: function($brick, setX) {
            // get the minimum Y value from the columns
            var minimumX = Math.min.apply(Math, setX),
                    smallRow = 0;
            // Find index of smallest row, the first from the top
            for (var i = 0, len = setX.length; i < len; i++) {
                if (setX[i] === minimumX) {
                    smallRow = i;
                    break;
                }
            }

            // position the brick
            var x = minimumX,
                    y = this.masonryHorizontal.rowHeight * smallRow;
            this._pushPosition($brick, x, y);

            // apply setHeight to necessary columns
            var setWidth = minimumX + $brick.outerWidth(true),
                    setSpan = this.masonryHorizontal.rows + 1 - len;
            for (i = 0; i < setSpan; i++) {
                this.masonryHorizontal.rowXs[ smallRow + i ] = setWidth;
            }
        },
        _masonryHorizontalGetContainerSize: function() {
            var containerWidth = Math.max.apply(Math, this.masonryHorizontal.rowXs);
            return {width: containerWidth};
        },
        _masonryHorizontalResizeChanged: function() {
            return this._checkIfSegmentsChanged(true);
        },
        // ====================== fitColumns ======================

        _fitColumnsReset: function() {
            this.fitColumns = {
                x: 0,
                y: 0,
                width: 0
            };
        },
        _fitColumnsLayout: function($elems) {
            var instance = this,
                    containerHeight = this.element.height(),
                    props = this.fitColumns;
            $elems.each(function() {
                var $this = $(this),
                        atomW = $this.outerWidth(true),
                        atomH = $this.outerHeight(true);

                if (props.y !== 0 && atomH + props.y > containerHeight) {
                    // if this element cannot fit in the current column
                    props.x = props.width;
                    props.y = 0;
                }

                // position the atom
                instance._pushPosition($this, props.x, props.y);

                props.width = Math.max(props.x + atomW, props.width);
                props.y += atomH;

            });
        },
        _fitColumnsGetContainerSize: function() {
            return {width: this.fitColumns.width};
        },
        _fitColumnsResizeChanged: function() {
            return true;
        },
        // ====================== cellsByColumn ======================

        _cellsByColumnReset: function() {
            this.cellsByColumn = {
                index: 0
            };
            // get this.cellsByColumn.columnWidth
            this._getSegments();
            // get this.cellsByColumn.rowHeight
            this._getSegments(true);
        },
        _cellsByColumnLayout: function($elems) {
            var instance = this,
                    props = this.cellsByColumn;
            $elems.each(function() {
                var $this = $(this),
                        col = Math.floor(props.index / props.rows),
                        row = props.index % props.rows,
                        x = (col + 0.5) * props.columnWidth - $this.outerWidth(true) / 2,
                        y = (row + 0.5) * props.rowHeight - $this.outerHeight(true) / 2;
                instance._pushPosition($this, x, y);
                props.index++;
            });
        },
        _cellsByColumnGetContainerSize: function() {
            return {width: Math.ceil(this.$filteredAtoms.length / this.cellsByColumn.rows) * this.cellsByColumn.columnWidth};
        },
        _cellsByColumnResizeChanged: function() {
            return this._checkIfSegmentsChanged(true);
        },
        // ====================== straightAcross ======================

        _straightAcrossReset: function() {
            this.straightAcross = {
                x: 0
            };
        },
        _straightAcrossLayout: function($elems) {
            var instance = this;
            $elems.each(function(i) {
                var $this = $(this);
                instance._pushPosition($this, instance.straightAcross.x, 0);
                instance.straightAcross.x += $this.outerWidth(true);
            });
        },
        _straightAcrossGetContainerSize: function() {
            return {width: this.straightAcross.x};
        },
        _straightAcrossResizeChanged: function() {
            return true;
        }

    };


    // ======================= imagesLoaded Plugin ===============================
    /*!
     * jQuery imagesLoaded plugin v1.1.0
     * http://github.com/desandro/imagesloaded
     *
     * MIT License. by Paul Irish et al.
     */


    // $('#my-container').imagesLoaded(myFunction)
    // or
    // $('img').imagesLoaded(myFunction)

    // execute a callback when all images have loaded.
    // needed because .load() doesn't work on cached images

    // callback function gets image collection as argument
    //  `this` is the container

    $.fn.imagesLoaded = function(callback) {
        var $this = this,
                $images = $this.find('img').add($this.filter('img')),
                len = $images.length,
                blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
                loaded = [];

        function triggerCallback() {
            callback.call($this, $images);
        }

        function imgLoaded(event) {
            var img = event.target;
            if (img.src !== blank && $.inArray(img, loaded) === -1) {
                loaded.push(img);
                if (--len <= 0) {
                    setTimeout(triggerCallback);
                    $images.unbind('.imagesLoaded', imgLoaded);
                }
            }
        }

        // if no images, trigger immediately
        if (!len) {
            triggerCallback();
        }

        $images.bind('load.imagesLoaded error.imagesLoaded', imgLoaded).each(function() {
            // cached images don't fire load sometimes, so we reset src.
            var src = this.src;
            // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
            // data uri bypasses webkit log warning (thx doug jones)
            this.src = blank;
            this.src = src;
        });

        return $this;
    };


    // helper function for logging errors
    // $.error breaks jQuery chaining
    var logError = function(message) {
        if (window.console) {
            window.console.error(message);
        }
    };

    // =======================  Plugin bridge  ===============================
    // leverages data method to either create or return $.Isotope constructor
    // A bit from jQuery UI
    //   https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
    // A bit from jcarousel
    //   https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

    $.fn.isotope = function(options, callback) {
        if (typeof options === 'string') {
            // call method
            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function() {
                var instance = $.data(this, 'isotope');
                if (!instance) {
                    logError("cannot call methods on isotope prior to initialization; " +
                            "attempted to call method '" + options + "'");
                    return;
                }
                if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                    logError("no such method '" + options + "' for isotope instance");
                    return;
                }
                // apply method
                instance[ options ].apply(instance, args);
            });
        } else {
            this.each(function() {
                var instance = $.data(this, 'isotope');
                if (instance) {
                    // apply options & init
                    instance.option(options);
                    instance._init(callback);
                } else {
                    // initialize new instance
                    $.data(this, 'isotope', new $.Isotope(options, this, callback));
                }
            });
        }
        // return jQuery object
        // so plugin methods do not have to
        return this;
    };

// Modified Isotope methods for gutters in masonry
    $.Isotope.prototype._getMasonryGutterColumns = function() {
        var gutter = this.options.masonry && this.options.masonry.gutterWidth || 0;
        var containerWidth = this.element.width();

        this.masonry.columnWidth = this.options.masonry && this.options.masonry.columnWidth ||
                // Or use the size of the first item
                this.$filteredAtoms.outerWidth(true) ||
                // If there's no items, use size of container
                containerWidth;

        this.masonry.columnWidth += gutter;

        this.masonry.cols = Math.floor((containerWidth + gutter) / this.masonry.columnWidth);
        this.masonry.cols = Math.max(this.masonry.cols, 1);

    };

    $.Isotope.prototype._masonryReset = function() {
        // Layout-specific props
        this.masonry = {};
        // FIXME shouldn't have to call this again
        this._getMasonryGutterColumns();
        var i = this.masonry.cols;
        this.masonry.colYs = [];
        while (i--) {
            this.masonry.colYs.push(0);
        }

    };

    $.Isotope.prototype._masonryResizeChanged = function() {
        var prevSegments = this.masonry.cols;
        // Update cols/rows
        this._getMasonryGutterColumns();
        // Return if updated cols/rows is not equal to previous
        return (this.masonry.cols !== prevSegments);
    };

})(window, jQuery);
/* ------------------------------------------------------------------------
 Class: prettyPhoto
 Use: Lightbox clone for jQuery
 Author: Stephane Caron (http://www.no-margin-for-errors.com)
 Version: 3.1.5
 ------------------------------------------------------------------------- */
(function($) {
    $.prettyPhoto = {version: '3.1.5'};

    $.fn.prettyPhoto = function(pp_settings) {
        pp_settings = jQuery.extend({
            hook: 'rel', /* the attribute tag to use for prettyPhoto hooks. default: 'rel'. For HTML5, use "data-rel" or similar. */
            animation_speed: 'fast', /* fast/slow/normal */
            ajaxcallback: function() {
            },
            slideshow: 5000, /* false OR interval time in ms */
            autoplay_slideshow: false, /* true/false */
            opacity: 0.80, /* Value between 0 and 1 */
            show_title: true, /* true/false */
            allow_resize: true, /* Resize the photos bigger than viewport. true/false */
            allow_expand: true, /* Allow the user to expand a resized image. true/false */
            default_width: 500,
            default_height: 344,
            counter_separator_label: '/', /* The separator for the gallery counter 1 "of" 2 */
            theme: 'pp_default', /* light_rounded / dark_rounded / light_square / dark_square / facebook */
            horizontal_padding: 20, /* The padding on each side of the picture */
            hideflash: false, /* Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto */
            wmode: 'opaque', /* Set the flash wmode attribute */
            autoplay: true, /* Automatically start videos: True/False */
            modal: false, /* If set to true, only the close button will close the window */
            deeplinking: true, /* Allow prettyPhoto to update the url to enable deeplinking. */
            overlay_gallery: true, /* If set to true, a gallery will overlay the fullscreen image on mouse over */
            overlay_gallery_max: 30, /* Maximum number of pictures in the overlay gallery */
            keyboard_shortcuts: true, /* Set to false if you open forms inside prettyPhoto */
            changepicturecallback: function() {
            }, /* Called everytime an item is shown/changed */
            callback: function() {
            }, /* Called when prettyPhoto is closed */
            ie6_fallback: true,
            markup: '<div class="pp_pic_holder"> \
						<div class="ppt">&nbsp;</div> \
						<div class="pp_top"> \
							<div class="pp_left"></div> \
							<div class="pp_middle"></div> \
							<div class="pp_right"></div> \
						</div> \
						<div class="pp_content_container"> \
							<div class="pp_left"> \
							<div class="pp_right"> \
								<div class="pp_content"> \
									<div class="pp_loaderIcon"></div> \
									<div class="pp_fade"> \
										<a href="#" class="pp_expand" title="Expand the image">Expand</a> \
										<div class="pp_hoverContainer"> \
											<a class="pp_next" href="#">next</a> \
											<a class="pp_previous" href="#">previous</a> \
										</div> \
										<div id="pp_full_res"></div> \
										<div class="pp_details"> \
											<div class="pp_nav"> \
												<a href="#" class="pp_arrow_previous">Previous</a> \
												<p class="currentTextHolder">0/0</p> \
												<a href="#" class="pp_arrow_next">Next</a> \
											</div> \
											<p class="pp_description"></p> \
											<div class="pp_social">{pp_social}</div> \
											<a class="pp_close" href="#">Close</a> \
										</div> \
									</div> \
								</div> \
							</div> \
							</div> \
						</div> \
						<div class="pp_bottom"> \
							<div class="pp_left"></div> \
							<div class="pp_middle"></div> \
							<div class="pp_right"></div> \
						</div> \
					</div> \
					<div class="pp_overlay"></div>',
            gallery_markup: '<div class="pp_gallery"> \
								<a href="#" class="pp_arrow_previous">Previous</a> \
								<div> \
									<ul> \
										{gallery} \
									</ul> \
								</div> \
								<a href="#" class="pp_arrow_next">Next</a> \
							</div>',
            image_markup: '<img id="fullResImage" src="{path}" />',
            flash_markup: '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{width}" height="{height}"><param name="wmode" value="{wmode}" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{path}" /><embed src="{path}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{width}" height="{height}" wmode="{wmode}"></embed></object>',
            quicktime_markup: '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" height="{height}" width="{width}"><param name="src" value="{path}"><param name="autoplay" value="{autoplay}"><param name="type" value="video/quicktime"><embed src="{path}" height="{height}" width="{width}" autoplay="{autoplay}" type="video/quicktime" pluginspage="http://www.apple.com/quicktime/download/"></embed></object>',
            iframe_markup: '<iframe src ="{path}" width="{width}" height="{height}" frameborder="no"></iframe>',
            inline_markup: '<div class="pp_inline">{content}</div>',
            custom_markup: '',
            social_tools: '<div class="twitter"><a href="http://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script></div><div class="facebook"><iframe src="//www.facebook.com/plugins/like.php?locale=en_US&href={location_href}&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:500px; height:23px;" allowTransparency="true"></iframe></div>' /* html or false to disable */
        }, pp_settings);

        // Global variables accessible only by prettyPhoto
        var matchedObjects = this, percentBased = false, pp_dimensions, pp_open,
                // prettyPhoto container specific
                pp_contentHeight, pp_contentWidth, pp_containerHeight, pp_containerWidth,
                // Window size
                windowHeight = $(window).height(), windowWidth = $(window).width(),
                // Global elements
                pp_slideshow;

        doresize = true, scroll_pos = _get_scroll();

        // Window/Keyboard events
        $(window).unbind('resize.prettyphoto').bind('resize.prettyphoto', function() {
            _center_overlay();
            _resize_overlay();
        });

        if (pp_settings.keyboard_shortcuts) {
            $(document).unbind('keydown.prettyphoto').bind('keydown.prettyphoto', function(e) {
                if (typeof $pp_pic_holder != 'undefined') {
                    if ($pp_pic_holder.is(':visible')) {
                        switch (e.keyCode) {
                            case 37:
                                $.prettyPhoto.changePage('previous');
                                e.preventDefault();
                                break;
                            case 39:
                                $.prettyPhoto.changePage('next');
                                e.preventDefault();
                                break;
                            case 27:
                                if (!settings.modal)
                                    $.prettyPhoto.close();
                                e.preventDefault();
                                break;
                        }
                        ;
                        // return false;
                    }
                    ;
                }
                ;
            });
        }
        ;

        /**
         * Initialize prettyPhoto.
         */
        $.prettyPhoto.initialize = function() {

            settings = pp_settings;

            if (settings.theme == 'pp_default')
                settings.horizontal_padding = 16;

            // Find out if the picture is part of a set
            theRel = $(this).attr(settings.hook);
            galleryRegExp = /\[(?:.*)\]/;
            isSet = (galleryRegExp.exec(theRel)) ? true : false;

            // Put the SRCs, TITLEs, ALTs into an array.
            pp_images = (isSet) ? jQuery.map(matchedObjects, function(n, i) {
                if ($(n).attr(settings.hook).indexOf(theRel) != -1)
                    return $(n).attr('href');
            }) : $.makeArray($(this).attr('href'));
            pp_titles = (isSet) ? jQuery.map(matchedObjects, function(n, i) {
                if ($(n).attr(settings.hook).indexOf(theRel) != -1)
                    return ($(n).find('img').attr('alt')) ? $(n).find('img').attr('alt') : "";
            }) : $.makeArray($(this).find('img').attr('alt'));
            pp_descriptions = (isSet) ? jQuery.map(matchedObjects, function(n, i) {
                if ($(n).attr(settings.hook).indexOf(theRel) != -1)
                    return ($(n).attr('title')) ? $(n).attr('title') : "";
            }) : $.makeArray($(this).attr('title'));

            if (pp_images.length > settings.overlay_gallery_max)
                settings.overlay_gallery = false;

            set_position = jQuery.inArray($(this).attr('href'), pp_images); // Define where in the array the clicked item is positionned
            rel_index = (isSet) ? set_position : $("a[" + settings.hook + "^='" + theRel + "']").index($(this));

            _build_overlay(this); // Build the overlay {this} being the caller

            if (settings.allow_resize)
                $(window).bind('scroll.prettyphoto', function() {
                    _center_overlay();
                });


            $.prettyPhoto.open();

            return false;
        }


        /**
         * Opens the prettyPhoto modal box.
         * @param image {String,Array} Full path to the image to be open, can also be an array containing full images paths.
         * @param title {String,Array} The title to be displayed with the picture, can also be an array containing all the titles.
         * @param description {String,Array} The description to be displayed with the picture, can also be an array containing all the descriptions.
         */
        $.prettyPhoto.open = function(event) {
            if (typeof settings == "undefined") { // Means it's an API call, need to manually get the settings and set the variables
                settings = pp_settings;
                pp_images = $.makeArray(arguments[0]);
                pp_titles = (arguments[1]) ? $.makeArray(arguments[1]) : $.makeArray("");
                pp_descriptions = (arguments[2]) ? $.makeArray(arguments[2]) : $.makeArray("");
                isSet = (pp_images.length > 1) ? true : false;
                set_position = (arguments[3]) ? arguments[3] : 0;
                _build_overlay(event.target); // Build the overlay {this} being the caller
            }

            if (settings.hideflash)
                $('object,embed,iframe[src*=youtube],iframe[src*=vimeo]').css('visibility', 'hidden'); // Hide the flash

            _checkPosition($(pp_images).size()); // Hide the next/previous links if on first or last images.

            $('.pp_loaderIcon').show();

            if (settings.deeplinking)
                setHashtag();

            // Rebuild Facebook Like Button with updated href
            if (settings.social_tools) {
                facebook_like_link = settings.social_tools.replace('{location_href}', encodeURIComponent(location.href));
                $pp_pic_holder.find('.pp_social').html(facebook_like_link);
            }

            // Fade the content in
            if ($ppt.is(':hidden'))
                $ppt.css('opacity', 0).show();
            $pp_overlay.show().fadeTo(settings.animation_speed, settings.opacity);

            // Display the current position
            $pp_pic_holder.find('.currentTextHolder').text((set_position + 1) + settings.counter_separator_label + $(pp_images).size());

            // Set the description
            if (typeof pp_descriptions[set_position] != 'undefined' && pp_descriptions[set_position] != "") {
                $pp_pic_holder.find('.pp_description').show().html(unescape(pp_descriptions[set_position]));
            } else {
                $pp_pic_holder.find('.pp_description').hide();
            }

            // Get the dimensions
            movie_width = (parseFloat(getParam('width', pp_images[set_position]))) ? getParam('width', pp_images[set_position]) : settings.default_width.toString();
            movie_height = (parseFloat(getParam('height', pp_images[set_position]))) ? getParam('height', pp_images[set_position]) : settings.default_height.toString();

            // If the size is % based, calculate according to window dimensions
            percentBased = false;
            if (movie_height.indexOf('%') != -1) {
                movie_height = parseFloat(($(window).height() * parseFloat(movie_height) / 100) - 150);
                percentBased = true;
            }
            if (movie_width.indexOf('%') != -1) {
                movie_width = parseFloat(($(window).width() * parseFloat(movie_width) / 100) - 150);
                percentBased = true;
            }

            // Fade the holder
            $pp_pic_holder.fadeIn(function() {
                // Set the title
                (settings.show_title && pp_titles[set_position] != "" && typeof pp_titles[set_position] != "undefined") ? $ppt.html(unescape(pp_titles[set_position])) : $ppt.html('&nbsp;');

                imgPreloader = "";
                skipInjection = false;

                // Inject the proper content
                switch (_getFileType(pp_images[set_position])) {
                    case 'image':
                        imgPreloader = new Image();

                        // Preload the neighbour images
                        nextImage = new Image();
                        if (isSet && set_position < $(pp_images).size() - 1)
                            nextImage.src = pp_images[set_position + 1];
                        prevImage = new Image();
                        if (isSet && pp_images[set_position - 1])
                            prevImage.src = pp_images[set_position - 1];

                        $pp_pic_holder.find('#pp_full_res')[0].innerHTML = settings.image_markup.replace(/{path}/g, pp_images[set_position]);

                        imgPreloader.onload = function() {
                            // Fit item to viewport
                            pp_dimensions = _fitToViewport(imgPreloader.width, imgPreloader.height);

                            _showContent();
                        };

                        imgPreloader.onerror = function() {
                            alert('Image cannot be loaded. Make sure the path is correct and image exist.');
                            $.prettyPhoto.close();
                        };

                        imgPreloader.src = pp_images[set_position];
                        break;

                    case 'youtube':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport

                        // Regular youtube link
                        movie_id = getParam('v', pp_images[set_position]);

                        // youtu.be link
                        if (movie_id == "") {
                            movie_id = pp_images[set_position].split('youtu.be/');
                            movie_id = movie_id[1];
                            if (movie_id.indexOf('?') > 0)
                                movie_id = movie_id.substr(0, movie_id.indexOf('?')); // Strip anything after the ?

                            if (movie_id.indexOf('&') > 0)
                                movie_id = movie_id.substr(0, movie_id.indexOf('&')); // Strip anything after the &
                        }

                        movie = 'http://www.youtube.com/embed/' + movie_id;
                        (getParam('rel', pp_images[set_position])) ? movie += "?rel=" + getParam('rel', pp_images[set_position]) : movie += "?rel=1";

                        if (settings.autoplay)
                            movie += "&autoplay=1";

                        toInject = settings.iframe_markup.replace(/{width}/g, pp_dimensions['width']).replace(/{height}/g, pp_dimensions['height']).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, movie);
                        break;

                    case 'vimeo':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport

                        movie_id = pp_images[set_position];
                        var regExp = /http(s?):\/\/(www\.)?vimeo.com\/(\d+)/;
                        var match = movie_id.match(regExp);

                        movie = 'http://player.vimeo.com/video/' + match[3] + '?title=0&amp;byline=0&amp;portrait=0';
                        if (settings.autoplay)
                            movie += "&autoplay=1;";

                        vimeo_width = pp_dimensions['width'] + '/embed/?moog_width=' + pp_dimensions['width'];

                        toInject = settings.iframe_markup.replace(/{width}/g, vimeo_width).replace(/{height}/g, pp_dimensions['height']).replace(/{path}/g, movie);
                        break;

                    case 'quicktime':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport
                        pp_dimensions['height'] += 15;
                        pp_dimensions['contentHeight'] += 15;
                        pp_dimensions['containerHeight'] += 15; // Add space for the control bar

                        toInject = settings.quicktime_markup.replace(/{width}/g, pp_dimensions['width']).replace(/{height}/g, pp_dimensions['height']).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, pp_images[set_position]).replace(/{autoplay}/g, settings.autoplay);
                        break;

                    case 'flash':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport

                        flash_vars = pp_images[set_position];
                        flash_vars = flash_vars.substring(pp_images[set_position].indexOf('flashvars') + 10, pp_images[set_position].length);

                        filename = pp_images[set_position];
                        filename = filename.substring(0, filename.indexOf('?'));

                        toInject = settings.flash_markup.replace(/{width}/g, pp_dimensions['width']).replace(/{height}/g, pp_dimensions['height']).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, filename + '?' + flash_vars);
                        break;

                    case 'iframe':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport

                        frame_url = pp_images[set_position];
                        frame_url = frame_url.substr(0, frame_url.indexOf('iframe') - 1);

                        toInject = settings.iframe_markup.replace(/{width}/g, pp_dimensions['width']).replace(/{height}/g, pp_dimensions['height']).replace(/{path}/g, frame_url);
                        break;

                    case 'ajax':
                        doresize = false; // Make sure the dimensions are not resized.
                        pp_dimensions = _fitToViewport(movie_width, movie_height);
                        doresize = true; // Reset the dimensions

                        skipInjection = true;
                        $.get(pp_images[set_position], function(responseHTML) {
                            toInject = settings.inline_markup.replace(/{content}/g, responseHTML);
                            $pp_pic_holder.find('#pp_full_res')[0].innerHTML = toInject;
                            _showContent();
                        });

                        break;

                    case 'custom':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport

                        toInject = settings.custom_markup;
                        break;

                    case 'inline':
                        // to get the item height clone it, apply default width, wrap it in the prettyPhoto containers , then delete
                        myClone = $(pp_images[set_position]).clone().append('<br clear="all" />').css({'width': settings.default_width}).wrapInner('<div id="pp_full_res"><div class="pp_inline"></div></div>').appendTo($('body')).show();
                        doresize = false; // Make sure the dimensions are not resized.
                        pp_dimensions = _fitToViewport($(myClone).width(), $(myClone).height());
                        doresize = true; // Reset the dimensions
                        $(myClone).remove();
                        toInject = settings.inline_markup.replace(/{content}/g, $(pp_images[set_position]).html());
                        break;
                }
                ;

                if (!imgPreloader && !skipInjection) {
                    $pp_pic_holder.find('#pp_full_res')[0].innerHTML = toInject;

                    // Show content
                    _showContent();
                }
                ;
            });

            return false;
        };


        /**
         * Change page in the prettyPhoto modal box
         * @param direction {String} Direction of the paging, previous or next.
         */
        $.prettyPhoto.changePage = function(direction) {
            currentGalleryPage = 0;

            if (direction == 'previous') {
                set_position--;
                if (set_position < 0)
                    set_position = $(pp_images).size() - 1;
            } else if (direction == 'next') {
                set_position++;
                if (set_position > $(pp_images).size() - 1)
                    set_position = 0;
            } else {
                set_position = direction;
            }
            ;

            rel_index = set_position;

            if (!doresize)
                doresize = true; // Allow the resizing of the images
            if (settings.allow_expand) {
                $('.pp_contract').removeClass('pp_contract').addClass('pp_expand');
            }

            _hideContent(function() {
                $.prettyPhoto.open();
            });
        };


        /**
         * Change gallery page in the prettyPhoto modal box
         * @param direction {String} Direction of the paging, previous or next.
         */
        $.prettyPhoto.changeGalleryPage = function(direction) {
            if (direction == 'next') {
                currentGalleryPage++;

                if (currentGalleryPage > totalPage)
                    currentGalleryPage = 0;
            } else if (direction == 'previous') {
                currentGalleryPage--;

                if (currentGalleryPage < 0)
                    currentGalleryPage = totalPage;
            } else {
                currentGalleryPage = direction;
            }
            ;

            slide_speed = (direction == 'next' || direction == 'previous') ? settings.animation_speed : 0;

            slide_to = currentGalleryPage * (itemsPerPage * itemWidth);

            $pp_gallery.find('ul').animate({left: -slide_to}, slide_speed);
        };


        /**
         * Start the slideshow...
         */
        $.prettyPhoto.startSlideshow = function() {
            if (typeof pp_slideshow == 'undefined') {
                $pp_pic_holder.find('.pp_play').unbind('click').removeClass('pp_play').addClass('pp_pause').click(function() {
                    $.prettyPhoto.stopSlideshow();
                    return false;
                });
                pp_slideshow = setInterval($.prettyPhoto.startSlideshow, settings.slideshow);
            } else {
                $.prettyPhoto.changePage('next');
            }
            ;
        }


        /**
         * Stop the slideshow...
         */
        $.prettyPhoto.stopSlideshow = function() {
            $pp_pic_holder.find('.pp_pause').unbind('click').removeClass('pp_pause').addClass('pp_play').click(function() {
                $.prettyPhoto.startSlideshow();
                return false;
            });
            clearInterval(pp_slideshow);
            pp_slideshow = undefined;
        }


        /**
         * Closes prettyPhoto.
         */
        $.prettyPhoto.close = function() {
            if ($pp_overlay.is(":animated"))
                return;

            $.prettyPhoto.stopSlideshow();

            $pp_pic_holder.stop().find('object,embed').css('visibility', 'hidden');

            $('div.pp_pic_holder,div.ppt,.pp_fade').fadeOut(settings.animation_speed, function() {
                $(this).remove();
            });

            $pp_overlay.fadeOut(settings.animation_speed, function() {

                if (settings.hideflash)
                    $('object,embed,iframe[src*=youtube],iframe[src*=vimeo]').css('visibility', 'visible'); // Show the flash

                $(this).remove(); // No more need for the prettyPhoto markup

                $(window).unbind('scroll.prettyphoto');

                clearHashtag();

                settings.callback();

                doresize = true;

                pp_open = false;

                delete settings;
            });
        };

        /**
         * Set the proper sizes on the containers and animate the content in.
         */
        function _showContent() {
            $('.pp_loaderIcon').hide();

            // Calculate the opened top position of the pic holder
            projectedTop = scroll_pos['scrollTop'] + ((windowHeight / 2) - (pp_dimensions['containerHeight'] / 2));
            if (projectedTop < 0)
                projectedTop = 0;

            $ppt.fadeTo(settings.animation_speed, 1);

            // Resize the content holder
            $pp_pic_holder.find('.pp_content')
                    .animate({
                height: pp_dimensions['contentHeight'],
                width: pp_dimensions['contentWidth']
            }, settings.animation_speed);

            // Resize picture the holder
            $pp_pic_holder.animate({
                'top': projectedTop,
                'left': ((windowWidth / 2) - (pp_dimensions['containerWidth'] / 2) < 0) ? 0 : (windowWidth / 2) - (pp_dimensions['containerWidth'] / 2),
                width: pp_dimensions['containerWidth']
            }, settings.animation_speed, function() {
                $pp_pic_holder.find('.pp_hoverContainer,#fullResImage').height(pp_dimensions['height']).width(pp_dimensions['width']);

                $pp_pic_holder.find('.pp_fade').fadeIn(settings.animation_speed); // Fade the new content

                // Show the nav
                if (isSet && _getFileType(pp_images[set_position]) == "image") {
                    $pp_pic_holder.find('.pp_hoverContainer').show();
                } else {
                    $pp_pic_holder.find('.pp_hoverContainer').hide();
                }

                if (settings.allow_expand) {
                    if (pp_dimensions['resized']) { // Fade the resizing link if the image is resized
                        $('a.pp_expand,a.pp_contract').show();
                    } else {
                        $('a.pp_expand').hide();
                    }
                }

                if (settings.autoplay_slideshow && !pp_slideshow && !pp_open)
                    $.prettyPhoto.startSlideshow();

                settings.changepicturecallback(); // Callback!

                pp_open = true;
            });

            _insert_gallery();
            pp_settings.ajaxcallback();
        }
        ;

        /**
         * Hide the content...DUH!
         */
        function _hideContent(callback) {
            // Fade out the current picture
            $pp_pic_holder.find('#pp_full_res object,#pp_full_res embed').css('visibility', 'hidden');
            $pp_pic_holder.find('.pp_fade').fadeOut(settings.animation_speed, function() {
                $('.pp_loaderIcon').show();

                callback();
            });
        }
        ;

        /**
         * Check the item position in the gallery array, hide or show the navigation links
         * @param setCount {integer} The total number of items in the set
         */
        function _checkPosition(setCount) {
            (setCount > 1) ? $('.pp_nav').show() : $('.pp_nav').hide(); // Hide the bottom nav if it's not a set.
        }
        ;

        /**
         * Resize the item dimensions if it's bigger than the viewport
         * @param width {integer} Width of the item to be opened
         * @param height {integer} Height of the item to be opened
         * @return An array containin the "fitted" dimensions
         */
        function _fitToViewport(width, height) {
            resized = false;

            _getDimensions(width, height);

            // Define them in case there's no resize needed
            imageWidth = width, imageHeight = height;

            if (((pp_containerWidth > windowWidth) || (pp_containerHeight > windowHeight)) && doresize && settings.allow_resize && !percentBased) {
                resized = true, fitting = false;

                while (!fitting) {
                    if ((pp_containerWidth > windowWidth)) {
                        imageWidth = (windowWidth - 200);
                        imageHeight = (height / width) * imageWidth;
                    } else if ((pp_containerHeight > windowHeight)) {
                        imageHeight = (windowHeight - 200);
                        imageWidth = (width / height) * imageHeight;
                    } else {
                        fitting = true;
                    }
                    ;

                    pp_containerHeight = imageHeight, pp_containerWidth = imageWidth;
                }
                ;



                if ((pp_containerWidth > windowWidth) || (pp_containerHeight > windowHeight)) {
                    _fitToViewport(pp_containerWidth, pp_containerHeight)
                }
                ;

                _getDimensions(imageWidth, imageHeight);
            }
            ;

            return {
                width: Math.floor(imageWidth),
                height: Math.floor(imageHeight),
                containerHeight: Math.floor(pp_containerHeight),
                containerWidth: Math.floor(pp_containerWidth) + (settings.horizontal_padding * 2),
                contentHeight: Math.floor(pp_contentHeight),
                contentWidth: Math.floor(pp_contentWidth),
                resized: resized
            };
        }
        ;

        /**
         * Get the containers dimensions according to the item size
         * @param width {integer} Width of the item to be opened
         * @param height {integer} Height of the item to be opened
         */
        function _getDimensions(width, height) {
            width = parseFloat(width);
            height = parseFloat(height);

            // Get the details height, to do so, I need to clone it since it's invisible
            $pp_details = $pp_pic_holder.find('.pp_details');
            $pp_details.width(width);
            detailsHeight = parseFloat($pp_details.css('marginTop')) + parseFloat($pp_details.css('marginBottom'));

            $pp_details = $pp_details.clone().addClass(settings.theme).width(width).appendTo($('body')).css({
                'position': 'absolute',
                'top': -10000
            });
            detailsHeight += $pp_details.height();
            detailsHeight = (detailsHeight <= 34) ? 36 : detailsHeight; // Min-height for the details
            $pp_details.remove();

            // Get the titles height, to do so, I need to clone it since it's invisible
            $pp_title = $pp_pic_holder.find('.ppt');
            $pp_title.width(width);
            titleHeight = parseFloat($pp_title.css('marginTop')) + parseFloat($pp_title.css('marginBottom'));
            $pp_title = $pp_title.clone().appendTo($('body')).css({
                'position': 'absolute',
                'top': -10000
            });
            titleHeight += $pp_title.height();
            $pp_title.remove();

            // Get the container size, to resize the holder to the right dimensions
            pp_contentHeight = height + detailsHeight;
            pp_contentWidth = width;
            pp_containerHeight = pp_contentHeight + titleHeight + $pp_pic_holder.find('.pp_top').height() + $pp_pic_holder.find('.pp_bottom').height();
            pp_containerWidth = width;
        }

        function _getFileType(itemSrc) {
            if (itemSrc.match(/youtube\.com\/watch/i) || itemSrc.match(/youtu\.be/i)) {
                return 'youtube';
            } else if (itemSrc.match(/vimeo\.com/i)) {
                return 'vimeo';
            } else if (itemSrc.match(/\b.mov\b/i)) {
                return 'quicktime';
            } else if (itemSrc.match(/\b.swf\b/i)) {
                return 'flash';
            } else if (itemSrc.match(/\biframe=true\b/i)) {
                return 'iframe';
            } else if (itemSrc.match(/\bajax=true\b/i)) {
                return 'ajax';
            } else if (itemSrc.match(/\bcustom=true\b/i)) {
                return 'custom';
            } else if (itemSrc.substr(0, 1) == '#') {
                return 'inline';
            } else {
                return 'image';
            }
            ;
        }
        ;

        function _center_overlay() {
            if (doresize && typeof $pp_pic_holder != 'undefined') {
                scroll_pos = _get_scroll();
                contentHeight = $pp_pic_holder.height(), contentwidth = $pp_pic_holder.width();

                projectedTop = (windowHeight / 2) + scroll_pos['scrollTop'] - (contentHeight / 2);
                if (projectedTop < 0)
                    projectedTop = 0;

                if (contentHeight > windowHeight)
                    return;

                $pp_pic_holder.css({
                    'top': projectedTop,
                    'left': (windowWidth / 2) + scroll_pos['scrollLeft'] - (contentwidth / 2)
                });
            }
            ;
        }
        ;

        function _get_scroll() {
            if (self.pageYOffset) {
                return {scrollTop: self.pageYOffset, scrollLeft: self.pageXOffset};
            } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
                return {scrollTop: document.documentElement.scrollTop, scrollLeft: document.documentElement.scrollLeft};
            } else if (document.body) {// all other Explorers
                return {scrollTop: document.body.scrollTop, scrollLeft: document.body.scrollLeft};
            }
            ;
        }
        ;

        function _resize_overlay() {
            windowHeight = $(window).height(), windowWidth = $(window).width();

            if (typeof $pp_overlay != "undefined")
                $pp_overlay.height($(document).height()).width(windowWidth);
        }
        ;

        function _insert_gallery() {
            if (isSet && settings.overlay_gallery && _getFileType(pp_images[set_position]) == "image") {
                itemWidth = 52 + 5; // 52 beign the thumb width, 5 being the right margin.
                navWidth = (settings.theme == "facebook" || settings.theme == "pp_default") ? 50 : 30; // Define the arrow width depending on the theme

                itemsPerPage = Math.floor((pp_dimensions['containerWidth'] - 100 - navWidth) / itemWidth);
                itemsPerPage = (itemsPerPage < pp_images.length) ? itemsPerPage : pp_images.length;
                totalPage = Math.ceil(pp_images.length / itemsPerPage) - 1;

                // Hide the nav in the case there's no need for links
                if (totalPage == 0) {
                    navWidth = 0; // No nav means no width!
                    $pp_gallery.find('.pp_arrow_next,.pp_arrow_previous').hide();
                } else {
                    $pp_gallery.find('.pp_arrow_next,.pp_arrow_previous').show();
                }
                ;

                galleryWidth = itemsPerPage * itemWidth;
                fullGalleryWidth = pp_images.length * itemWidth;

                // Set the proper width to the gallery items
                $pp_gallery
                        .css('margin-left', -((galleryWidth / 2) + (navWidth / 2)))
                        .find('div:first').width(galleryWidth + 5)
                        .find('ul').width(fullGalleryWidth)
                        .find('li.selected').removeClass('selected');

                goToPage = (Math.floor(set_position / itemsPerPage) < totalPage) ? Math.floor(set_position / itemsPerPage) : totalPage;

                $.prettyPhoto.changeGalleryPage(goToPage);

                $pp_gallery_li.filter(':eq(' + set_position + ')').addClass('selected');
            } else {
                $pp_pic_holder.find('.pp_content').unbind('mouseenter mouseleave');
                // $pp_gallery.hide();
            }
        }

        function _build_overlay(caller) {
            // Inject Social Tool markup into General markup
            if (settings.social_tools)
                facebook_like_link = settings.social_tools.replace('{location_href}', encodeURIComponent(location.href));

            settings.markup = settings.markup.replace('{pp_social}', '');

            $('body').append(settings.markup); // Inject the markup

            $pp_pic_holder = $('.pp_pic_holder'), $ppt = $('.ppt'), $pp_overlay = $('div.pp_overlay'); // Set my global selectors

            // Inject the inline gallery!
            if (isSet && settings.overlay_gallery) {
                currentGalleryPage = 0;
                toInject = "";
                for (var i = 0; i < pp_images.length; i++) {
                    if (!pp_images[i].match(/\b(jpg|jpeg|png|gif)\b/gi)) {
                        classname = 'default';
                        img_src = '';
                    } else {
                        classname = '';
                        img_src = pp_images[i];
                    }
                    toInject += "<li class='" + classname + "'><a href='#'><img src='" + img_src + "' width='50' alt='' /></a></li>";
                }
                ;

                toInject = settings.gallery_markup.replace(/{gallery}/g, toInject);

                $pp_pic_holder.find('#pp_full_res').after(toInject);

                $pp_gallery = $('.pp_pic_holder .pp_gallery'), $pp_gallery_li = $pp_gallery.find('li'); // Set the gallery selectors

                $pp_gallery.find('.pp_arrow_next').click(function() {
                    $.prettyPhoto.changeGalleryPage('next');
                    $.prettyPhoto.stopSlideshow();
                    return false;
                });

                $pp_gallery.find('.pp_arrow_previous').click(function() {
                    $.prettyPhoto.changeGalleryPage('previous');
                    $.prettyPhoto.stopSlideshow();
                    return false;
                });

                $pp_pic_holder.find('.pp_content').hover(
                        function() {
                            $pp_pic_holder.find('.pp_gallery:not(.disabled)').fadeIn();
                        },
                        function() {
                            $pp_pic_holder.find('.pp_gallery:not(.disabled)').fadeOut();
                        });

                itemWidth = 52 + 5; // 52 beign the thumb width, 5 being the right margin.
                $pp_gallery_li.each(function(i) {
                    $(this)
                            .find('a')
                            .click(function() {
                        $.prettyPhoto.changePage(i);
                        $.prettyPhoto.stopSlideshow();
                        return false;
                    });
                });
            }
            ;


            // Inject the play/pause if it's a slideshow
            if (settings.slideshow) {
                $pp_pic_holder.find('.pp_nav').prepend('<a href="#" class="pp_play">Play</a>')
                $pp_pic_holder.find('.pp_nav .pp_play').click(function() {
                    $.prettyPhoto.startSlideshow();
                    return false;
                });
            }

            $pp_pic_holder.attr('class', 'pp_pic_holder ' + settings.theme); // Set the proper theme

            $pp_overlay
                    .css({
                'opacity': 0,
                'height': $(document).height(),
                'width': $(window).width()
            })
                    .bind('click', function() {
                if (!settings.modal)
                    $.prettyPhoto.close();
            });

            $('a.pp_close').bind('click', function() {
                $.prettyPhoto.close();
                return false;
            });


            if (settings.allow_expand) {
                $('a.pp_expand').bind('click', function(e) {
                    // Expand the image
                    if ($(this).hasClass('pp_expand')) {
                        $(this).removeClass('pp_expand').addClass('pp_contract');
                        doresize = false;
                    } else {
                        $(this).removeClass('pp_contract').addClass('pp_expand');
                        doresize = true;
                    }
                    ;

                    _hideContent(function() {
                        $.prettyPhoto.open();
                    });

                    return false;
                });
            }

            $pp_pic_holder.find('.pp_previous, .pp_nav .pp_arrow_previous').bind('click', function() {
                $.prettyPhoto.changePage('previous');
                $.prettyPhoto.stopSlideshow();
                return false;
            });

            $pp_pic_holder.find('.pp_next, .pp_nav .pp_arrow_next').bind('click', function() {
                $.prettyPhoto.changePage('next');
                $.prettyPhoto.stopSlideshow();
                return false;
            });

            _center_overlay(); // Center it
        }
        ;

        if (!pp_alreadyInitialized && getHashtag()) {
            pp_alreadyInitialized = true;

            // Grab the rel index to trigger the click on the correct element
            hashIndex = getHashtag();
            hashRel = hashIndex;
            hashIndex = hashIndex.substring(hashIndex.indexOf('/') + 1, hashIndex.length - 1);
            hashRel = hashRel.substring(0, hashRel.indexOf('/'));

            // Little timeout to make sure all the prettyPhoto initialize scripts has been run.
            // Useful in the event the page contain several init scripts.
            setTimeout(function() {
                $("a[" + pp_settings.hook + "^='" + hashRel + "']:eq(" + hashIndex + ")").trigger('click');
            }, 50);
        }

        return this.unbind('click.prettyphoto').bind('click.prettyphoto', $.prettyPhoto.initialize); // Return the jQuery object for chaining. The unbind method is used to avoid click conflict when the plugin is called more than once
    };

    function getHashtag() {
        var url = location.href;
        hashtag = (url.indexOf('#prettyPhoto') !== -1) ? decodeURI(url.substring(url.indexOf('#prettyPhoto') + 1, url.length)) : false;

        return hashtag;
    }
    ;

    function setHashtag() {
        if (typeof theRel == 'undefined')
            return; // theRel is set on normal calls, it's impossible to deeplink using the API
        location.hash = theRel + '/' + rel_index + '/';
    }
    ;

    function clearHashtag() {
        if (location.href.indexOf('#prettyPhoto') !== -1)
            location.hash = "prettyPhoto";
    }

    function getParam(name, url) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        return (results == null) ? "" : results[1];
    }

})(jQuery);

var pp_alreadyInitialized = false; // Used for the deep linking to make sure not to call the same function several times.
/*
 Copyright (c) 2012 Jeremie Patonnier
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

(function($) {
    'use strict';

    $.fn.scrollPoint = function(params) {
        var $window = $(window);

        params = $.extend({
            up: false,
            down: false,
            offsetUp: 0,
            offsetDown: 0
        }, params);

        return this.each(function() {
            var up = params.up,
                    down = params.down,
                    isIn = false,
                    element = $(this);

            if (!up && up !== 0) {
                up = element.offset().top;
            }

            if (!down && down !== 0) {
                down = up + element.outerHeight();
            }

            up -= params.offsetUp;
            down -= params.offsetDown;

            function triggerEvent(eventType, eventParams) {
                var n, Event = $.Event(eventType);

                for (n in eventParams) {
                    Event[n] = eventParams[n];
                }

                element.trigger(Event);
            }

            function checkScroll() {
                var pos = $window.scrollTop(),
                        oldIn = isIn,
                        param = {
                    isUp: pos <= up,
                    isDown: pos >= down,
                    isIn: false
                };

                isIn = param.isIn = !param.isUp && !param.isDown;

                if (oldIn !== isIn) {
                    triggerEvent("scrollPoint" + (isIn ? "Enter" : "Leave"), param);
                }

                triggerEvent("scrollPointMove", param);
            }

            $window.scroll(checkScroll);
        });
    };
})(jQuery);/********************************************
 -	THEMEPUNCH TOOLS Ver. 1.0     -
 Last Update of Tools 28.03.2013
 *********************************************/

/*!
 * jQuery Transit - CSS3 transitions and transformations
 * Copyright(c) 2011 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */

/*!
 jQuery WaitForImages
 
 Copyright (c) 2012 Alex Dickson
 
 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:
 
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 
 
 https://github.com/alexanderdickson/waitForImages
 
 
 */

// WAIT FOR IMAGES
/*
 * waitForImages 1.4
 * -----------------
 * Provides a callback when all images have loaded in your given selector.
 * http://www.alexanderdickson.com/
 *
 *
 * Copyright (c) 2011 Alex Dickson
 * Licensed under the MIT licenses.
 * See website for more info.
 *
 */

// EASINGS

/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2012 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */
(function(jQuery) {
    jQuery.transit = {
        version: "0.9.9",
        // Map of $.css() keys to values for 'transitionProperty'.
        // See https://developer.mozilla.org/en/CSS/CSS_transitions#Properties_that_can_be_animated
        propertyMap: {
            marginLeft: 'margin',
            marginRight: 'margin',
            marginBottom: 'margin',
            marginTop: 'margin',
            paddingLeft: 'padding',
            paddingRight: 'padding',
            paddingBottom: 'padding',
            paddingTop: 'padding'
        },
        // Will simply transition "instantly" if false
        enabled: true,
        // Set this to false if you don't want to use the transition end property.
        useTransitionEnd: false
    };

    var div = document.createElement('div');
    var support = {};

    // Helper function to get the proper vendor property name.
    // (`transition` => `WebkitTransition`)
    function getVendorPropertyName(prop) {
        // Handle unprefixed versions (FF16+, for example)
        if (prop in div.style)
            return prop;

        var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
        var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

        if (prop in div.style) {
            return prop;
        }

        for (var i = 0; i < prefixes.length; ++i) {
            var vendorProp = prefixes[i] + prop_;
            if (vendorProp in div.style) {
                return vendorProp;
            }
        }
    }

    // Helper function to check if transform3D is supported.
    // Should return true for Webkits and Firefox 10+.
    function checkTransform3dSupport() {
        div.style[support.transform] = '';
        div.style[support.transform] = 'rotateY(90deg)';
        return div.style[support.transform] !== '';
    }

    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

    // Check for the browser's transitions support.
    support.transition = getVendorPropertyName('transition');
    support.transitionDelay = getVendorPropertyName('transitionDelay');
    support.transform = getVendorPropertyName('transform');
    support.transformOrigin = getVendorPropertyName('transformOrigin');
    support.transform3d = checkTransform3dSupport();

    var eventNames = {
        'transition': 'transitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'WebkitTransition': 'webkitTransitionEnd',
        'msTransition': 'MSTransitionEnd'
    };

    // Detect the 'transitionend' event needed.
    var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;

    // Populate jQuery's `$.support` with the vendor prefixes we know.
    // As per [jQuery's cssHooks documentation](http://api.jquery.com/jQuery.cssHooks/),
    // we set $.support.transition to a string of the actual property name used.
    for (var key in support) {
        if (support.hasOwnProperty(key) && typeof jQuery.support[key] === 'undefined') {
            jQuery.support[key] = support[key];
        }
    }

    // Avoid memory leak in IE.
    div = null;

    // ## $.cssEase
    // List of easing aliases that you can use with `$.fn.transition`.
    jQuery.cssEase = {
        '_default': 'ease',
        'in': 'ease-in',
        'out': 'ease-out',
        'in-out': 'ease-in-out',
        'snap': 'cubic-bezier(0,1,.5,1)',
        // Penner equations
        'easeInCubic': 'cubic-bezier(.55, .055, .675, .19)',
        'easeOutCubic': 'cubic-bezier(.215,.61,.355,1)',
        'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
        'easeInCirc': 'cubic-bezier(.6,.04,.98,.335)',
        'easeOutCirc': 'cubic-bezier(.075,.82,.165,1)',
        'easeInOutCirc': 'cubic-bezier(.785,.135,.15,.86)',
        'easeInExpo': 'cubic-bezier(.95,.05,.795,.035)',
        'easeOutExpo': 'cubic-bezier(.19,1,.22,1)',
        'easeInOutExpo': 'cubic-bezier(1,0,0,1)',
        'easeInQuad': 'cubic-bezier(.55,.085,.68,.53)',
        'easeOutQuad': 'cubic-bezier(.25,.46,.45,.94)',
        'easeInOutQuad': 'cubic-bezier(.455,.03,.515,.955)',
        'easeInQuart': 'cubic-bezier(.895,.03,.685,.22)',
        'easeOutQuart': 'cubic-bezier(.165,.84,.44,1)',
        'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
        'easeInQuint': 'cubic-bezier(.755,.05,.855,.06)',
        'easeOutQuint': 'cubic-bezier(.23,1,.32,1)',
        'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
        'easeInSine': 'cubic-bezier(.47,0,.745,.715)',
        'easeOutSine': 'cubic-bezier(.39,.575,.565,1)',
        'easeInOutSine': 'cubic-bezier(.445,.05,.55,.95)',
        'easeInBack': 'cubic-bezier(.6,-.28,.735,.045)',
        'easeOutBack': 'cubic-bezier(.175, .885,.32,1.275)',
        'easeInOutBack': 'cubic-bezier(.68,-.55,.265,1.55)'
    };

    // ## 'transform' CSS hook
    // Allows you to use the `transform` property in CSS.
    //
    //     $("#hello").css({ transform: "rotate(90deg)" });
    //
    //     $("#hello").css('transform');
    //     //=> { rotate: '90deg' }
    //
    jQuery.cssHooks['transit:transform'] = {
        // The getter returns a `Transform` object.
        get: function(elem) {
            return $(elem).data('transform') || new Transform();
        },
        // The setter accepts a `Transform` object or a string.
        set: function(elem, v) {
            var value = v;

            if (!(value instanceof Transform)) {
                value = new Transform(value);
            }

            // We've seen the 3D version of Scale() not work in Chrome when the
            // element being scaled extends outside of the viewport.  Thus, we're
            // forcing Chrome to not use the 3d transforms as well.  Not sure if
            // translate is affectede, but not risking it.  Detection code from
            // http://davidwalsh.name/detecting-google-chrome-javascript
            if (support.transform === 'WebkitTransform' && !isChrome) {
                elem.style[support.transform] = value.toString(true);
            } else {
                elem.style[support.transform] = value.toString();
            }

            $(elem).data('transform', value);
        }
    };

    // Add a CSS hook for `.css({ transform: '...' })`.
    // In jQuery 1.8+, this will intentionally override the default `transform`
    // CSS hook so it'll play well with Transit. (see issue #62)
    jQuery.cssHooks.transform = {
        set: jQuery.cssHooks['transit:transform'].set
    };

    // jQuery 1.8+ supports prefix-free transitions, so these polyfills will not
    // be necessary.
    if (jQuery.fn.jquery < "1.8") {
        // ## 'transformOrigin' CSS hook
        // Allows the use for `transformOrigin` to define where scaling and rotation
        // is pivoted.
        //
        //     $("#hello").css({ transformOrigin: '0 0' });
        //
        jQuery.cssHooks.transformOrigin = {
            get: function(elem) {
                return elem.style[support.transformOrigin];
            },
            set: function(elem, value) {
                elem.style[support.transformOrigin] = value;
            }
        };

        // ## 'transition' CSS hook
        // Allows you to use the `transition` property in CSS.
        //
        //     $("#hello").css({ transition: 'all 0 ease 0' });
        //
        jQuery.cssHooks.transition = {
            get: function(elem) {
                return elem.style[support.transition];
            },
            set: function(elem, value) {
                elem.style[support.transition] = value;
            }
        };
    }

    // ## Other CSS hooks
    // Allows you to rotate, scale and translate.
    registerCssHook('scale');
    registerCssHook('translate');
    registerCssHook('rotate');
    registerCssHook('rotateX');
    registerCssHook('rotateY');
    registerCssHook('rotate3d');
    registerCssHook('perspective');
    registerCssHook('skewX');
    registerCssHook('skewY');
    registerCssHook('x', true);
    registerCssHook('y', true);

    // ## Transform class
    // This is the main class of a transformation property that powers
    // `jQuery.fn.css({ transform: '...' })`.
    //
    // This is, in essence, a dictionary object with key/values as `-transform`
    // properties.
    //
    //     var t = new Transform("rotate(90) scale(4)");
    //
    //     t.rotate             //=> "90deg"
    //     t.scale              //=> "4,4"
    //
    // Setters are accounted for.
    //
    //     t.set('rotate', 4)
    //     t.rotate             //=> "4deg"
    //
    // Convert it to a CSS string using the `toString()` and `toString(true)` (for WebKit)
    // functions.
    //
    //     t.toString()         //=> "rotate(90deg) scale(4,4)"
    //     t.toString(true)     //=> "rotate(90deg) scale3d(4,4,0)" (WebKit version)
    //
    function Transform(str) {
        if (typeof str === 'string') {
            this.parse(str);
        }
        return this;
    }

    Transform.prototype = {
        // ### setFromString()
        // Sets a property from a string.
        //
        //     t.setFromString('scale', '2,4');
        //     // Same as set('scale', '2', '4');
        //
        setFromString: function(prop, val) {
            var args =
                    (typeof val === 'string') ? val.split(',') :
                    (val.constructor === Array) ? val :
                    [val];

            args.unshift(prop);

            Transform.prototype.set.apply(this, args);
        },
        // ### set()
        // Sets a property.
        //
        //     t.set('scale', 2, 4);
        //
        set: function(prop) {
            var args = Array.prototype.slice.apply(arguments, [1]);
            if (this.setter[prop]) {
                this.setter[prop].apply(this, args);
            } else {
                this[prop] = args.join(',');
            }
        },
        get: function(prop) {
            if (this.getter[prop]) {
                return this.getter[prop].apply(this);
            } else {
                return this[prop] || 0;
            }
        },
        setter: {
            // ### rotate
            //
            //     .css({ rotate: 30 })
            //     .css({ rotate: "30" })
            //     .css({ rotate: "30deg" })
            //     .css({ rotate: "30deg" })
            //
            rotate: function(theta) {
                this.rotate = unit(theta, 'deg');
            },
            rotateX: function(theta) {
                this.rotateX = unit(theta, 'deg');
            },
            rotateY: function(theta) {
                this.rotateY = unit(theta, 'deg');
            },
            // ### scale
            //
            //     .css({ scale: 9 })      //=> "scale(9,9)"
            //     .css({ scale: '3,2' })  //=> "scale(3,2)"
            //
            scale: function(x, y) {
                if (y === undefined) {
                    y = x;
                }
                this.scale = x + "," + y;
            },
            // ### skewX + skewY
            skewX: function(x) {
                this.skewX = unit(x, 'deg');
            },
            skewY: function(y) {
                this.skewY = unit(y, 'deg');
            },
            // ### perspectvie
            perspective: function(dist) {
                this.perspective = unit(dist, 'px');
            },
            // ### x / y
            // Translations. Notice how this keeps the other value.
            //
            //     .css({ x: 4 })       //=> "translate(4px, 0)"
            //     .css({ y: 10 })      //=> "translate(4px, 10px)"
            //
            x: function(x) {
                this.set('translate', x, null);
            },
            y: function(y) {
                this.set('translate', null, y);
            },
            // ### translate
            // Notice how this keeps the other value.
            //
            //     .css({ translate: '2, 5' })    //=> "translate(2px, 5px)"
            //
            translate: function(x, y) {
                if (this._translateX === undefined) {
                    this._translateX = 0;
                }
                if (this._translateY === undefined) {
                    this._translateY = 0;
                }

                if (x !== null && x !== undefined) {
                    this._translateX = unit(x, 'px');
                }
                if (y !== null && y !== undefined) {
                    this._translateY = unit(y, 'px');
                }

                this.translate = this._translateX + "," + this._translateY;
            }
        },
        getter: {
            x: function() {
                return this._translateX || 0;
            },
            y: function() {
                return this._translateY || 0;
            },
            scale: function() {
                var s = (this.scale || "1,1").split(',');
                if (s[0]) {
                    s[0] = parseFloat(s[0]);
                }
                if (s[1]) {
                    s[1] = parseFloat(s[1]);
                }

                // "2.5,2.5" => 2.5
                // "2.5,1" => [2.5,1]
                return (s[0] === s[1]) ? s[0] : s;
            },
            rotate3d: function() {
                var s = (this.rotate3d || "0,0,0,0deg").split(',');
                for (var i = 0; i <= 3; ++i) {
                    if (s[i]) {
                        s[i] = parseFloat(s[i]);
                    }
                }
                if (s[3]) {
                    s[3] = unit(s[3], 'deg');
                }

                return s;
            }
        },
        // ### parse()
        // Parses from a string. Called on constructor.
        parse: function(str) {
            var self = this;
            str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
                self.setFromString(prop, val);
            });
        },
        // ### toString()
        // Converts to a `transition` CSS property string. If `use3d` is given,
        // it converts to a `-webkit-transition` CSS property string instead.
        toString: function(use3d) {
            var re = [];

            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    // Don't use 3D transformations if the browser can't support it.
                    if ((!support.transform3d) && (
                            (i === 'rotateX') ||
                            (i === 'rotateY') ||
                            (i === 'perspective') ||
                            (i === 'transformOrigin'))) {
                        continue;
                    }

                    if (i[0] !== '_') {
                        if (use3d && (i === 'scale')) {
                            re.push(i + "3d(" + this[i] + ",1)");
                        } else if (use3d && (i === 'translate')) {
                            re.push(i + "3d(" + this[i] + ",0)");
                        } else {
                            re.push(i + "(" + this[i] + ")");
                        }
                    }
                }
            }

            return re.join(" ");
        }
    };

    function callOrQueue(self, queue, fn) {
        if (queue === true) {
            self.queue(fn);
        } else if (queue) {
            self.queue(queue, fn);
        } else {
            fn();
        }
    }

    // ### getProperties(dict)
    // Returns properties (for `transition-property`) for dictionary `props`. The
    // value of `props` is what you would expect in `jQuery.css(...)`.
    function getProperties(props) {
        var re = [];

        jQuery.each(props, function(key) {
            key = jQuery.camelCase(key); // Convert "text-align" => "textAlign"
            key = jQuery.transit.propertyMap[key] || jQuery.cssProps[key] || key;
            key = uncamel(key); // Convert back to dasherized

            if (jQuery.inArray(key, re) === -1) {
                re.push(key);
            }
        });

        return re;
    }

    // ### getTransition()
    // Returns the transition string to be used for the `transition` CSS property.
    //
    // Example:
    //
    //     getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');
    //     //=> 'opacity 500ms ease, -webkit-transform 500ms ease'
    //
    function getTransition(properties, duration, easing, delay) {
        // Get the CSS properties needed.
        var props = getProperties(properties);

        // Account for aliases (`in` => `ease-in`).
        if (jQuery.cssEase[easing]) {
            easing = jQuery.cssEase[easing];
        }

        // Build the duration/easing/delay attributes for it.
        var attribs = '' + toMS(duration) + ' ' + easing;
        if (parseInt(delay, 10) > 0) {
            attribs += ' ' + toMS(delay);
        }

        // For more properties, add them this way:
        // "margin 200ms ease, padding 200ms ease, ..."
        var transitions = [];
        jQuery.each(props, function(i, name) {
            transitions.push(name + ' ' + attribs);
        });

        return transitions.join(', ');
    }

    // ## jQuery.fn.transition
    // Works like jQuery.fn.animate(), but uses CSS transitions.
    //
    //     $("...").transition({ opacity: 0.1, scale: 0.3 });
    //
    //     // Specific duration
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500);
    //
    //     // With duration and easing
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in');
    //
    //     // With callback
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, function() { ... });
    //
    //     // With everything
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in', function() { ... });
    //
    //     // Alternate syntax
    //     $("...").transition({
    //       opacity: 0.1,
    //       duration: 200,
    //       delay: 40,
    //       easing: 'in',
    //       complete: function() { /* ... */ }
    //      });
    //
    jQuery.fn.transition = jQuery.fn.transit = function(properties, duration, easing, callback) {
        var self = this;
        var delay = 0;
        var queue = true;

        var theseProperties = jQuery.extend(true, {}, properties);

        // Account for `.transition(properties, callback)`.
        if (typeof duration === 'function') {
            callback = duration;
            duration = undefined;
        }

        // Account for `.transition(properties, options)`.
        if (typeof duration === 'object') {
            easing = duration.easing;
            delay = duration.delay || 0;
            queue = duration.queue || true;
            callback = duration.complete;
            duration = duration.duration;
        }

        // Account for `.transition(properties, duration, callback)`.
        if (typeof easing === 'function') {
            callback = easing;
            easing = undefined;
        }

        // Alternate syntax.
        if (typeof theseProperties.easing !== 'undefined') {
            easing = theseProperties.easing;
            delete theseProperties.easing;
        }

        if (typeof theseProperties.duration !== 'undefined') {
            duration = theseProperties.duration;
            delete theseProperties.duration;
        }

        if (typeof theseProperties.complete !== 'undefined') {
            callback = theseProperties.complete;
            delete theseProperties.complete;
        }

        if (typeof theseProperties.queue !== 'undefined') {
            queue = theseProperties.queue;
            delete theseProperties.queue;
        }

        if (typeof theseProperties.delay !== 'undefined') {
            delay = theseProperties.delay;
            delete theseProperties.delay;
        }

        // Set defaults. (`400` duration, `ease` easing)
        if (typeof duration === 'undefined') {
            duration = jQuery.fx.speeds._default;
        }
        if (typeof easing === 'undefined') {
            easing = jQuery.cssEase._default;
        }

        duration = toMS(duration);

        // Build the `transition` property.
        var transitionValue = getTransition(theseProperties, duration, easing, delay);

        // Compute delay until callback.
        // If this becomes 0, don't bother setting the transition property.
        var work = jQuery.transit.enabled && support.transition;
        var i = work ? (parseInt(duration, 10) + parseInt(delay, 10)) : 0;

        // If there's nothing to do...
        if (i === 0) {
            var fn = function(next) {
                self.css(theseProperties);
                if (callback) {
                    callback.apply(self);
                }
                if (next) {
                    next();
                }
            };

            callOrQueue(self, queue, fn);
            return self;
        }

        // Save the old transitions of each element so we can restore it later.
        var oldTransitions = {};

        var run = function(nextCall) {
            var bound = false;

            // Prepare the callback.
            var cb = function() {
                if (bound) {
                    self.unbind(transitionEnd, cb);
                }

                if (i > 0) {
                    self.each(function() {
                        this.style[support.transition] = (oldTransitions[this] || null);
                    });
                }

                if (typeof callback === 'function') {
                    callback.apply(self);
                }
                if (typeof nextCall === 'function') {
                    nextCall();
                }
            };

            if ((i > 0) && (transitionEnd) && (jQuery.transit.useTransitionEnd)) {
                // Use the 'transitionend' event if it's available.
                bound = true;
                self.bind(transitionEnd, cb);
            } else {
                // Fallback to timers if the 'transitionend' event isn't supported.
                window.setTimeout(cb, i);
            }

            // Apply transitions.
            self.each(function() {
                if (i > 0) {
                    this.style[support.transition] = transitionValue;
                }
                $(this).css(properties);
            });
        };

        // Defer running. This allows the browser to paint any pending CSS it hasn't
        // painted yet before doing the transitions.
        var deferredRun = function(next) {
            this.offsetWidth; // force a repaint
            run(next);
        };

        // Use jQuery's fx queue.
        callOrQueue(self, queue, deferredRun);

        // Chainability.
        return this;
    };

    function registerCssHook(prop, isPixels) {
        // For certain properties, the 'px' should not be implied.
        if (!isPixels) {
            jQuery.cssNumber[prop] = true;
        }

        jQuery.transit.propertyMap[prop] = support.transform;

        jQuery.cssHooks[prop] = {
            get: function(elem) {
                var t = $(elem).css('transit:transform');
                return t.get(prop);
            },
            set: function(elem, value) {
                var t = $(elem).css('transit:transform');
                t.setFromString(prop, value);

                $(elem).css({'transit:transform': t});
            }
        };

    }

    // ### uncamel(str)
    // Converts a camelcase string to a dasherized string.
    // (`marginLeft` => `margin-left`)
    function uncamel(str) {
        return str.replace(/([A-Z])/g, function(letter) {
            return '-' + letter.toLowerCase();
        });
    }

    // ### unit(number, unit)
    // Ensures that number `number` has a unit. If no unit is found, assume the
    // default is `unit`.
    //
    //     unit(2, 'px')          //=> "2px"
    //     unit("30deg", 'rad')   //=> "30deg"
    //
    function unit(i, units) {
        if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
            return i;
        } else {
            return "" + i + units;
        }
    }

    // ### toMS(duration)
    // Converts given `duration` to a millisecond string.
    //
    // toMS('fast') => jQuery.fx.speeds[i] => "200ms"
    // toMS('normal') //=> jQuery.fx.speeds._default => "400ms"
    // toMS(10) //=> '10ms'
    // toMS('100ms') //=> '100ms'
    //
    function toMS(duration) {
        var i = duration;

        // Allow string durations like 'fast' and 'slow', without overriding numeric values.
        if (typeof i === 'string' && (!i.match(/^[\-0-9\.]+/))) {
            i = jQuery.fx.speeds[i] || jQuery.fx.speeds._default;
        }

        return unit(i, 'ms');
    }

    // Export some functions for testable-ness.
    jQuery.transit.getTransitionValue = getTransition;
})(jQuery);

(function(e, t) {
    jQuery.easing["jswing"] = jQuery.easing["swing"];
    jQuery.extend(jQuery.easing, {def: "easeOutQuad", swing: function(e, t, n, r, i) {
            return jQuery.easing[jQuery.easing.def](e, t, n, r, i)
        }, easeInQuad: function(e, t, n, r, i) {
            return r * (t /= i) * t + n
        }, easeOutQuad: function(e, t, n, r, i) {
            return-r * (t /= i) * (t - 2) + n
        }, easeInOutQuad: function(e, t, n, r, i) {
            if ((t /= i / 2) < 1)
                return r / 2 * t * t + n;
            return-r / 2 * (--t * (t - 2) - 1) + n
        }, easeInCubic: function(e, t, n, r, i) {
            return r * (t /= i) * t * t + n
        }, easeOutCubic: function(e, t, n, r, i) {
            return r * ((t = t / i - 1) * t * t + 1) + n
        }, easeInOutCubic: function(e, t, n, r, i) {
            if ((t /= i / 2) < 1)
                return r / 2 * t * t * t + n;
            return r / 2 * ((t -= 2) * t * t + 2) + n
        }, easeInQuart: function(e, t, n, r, i) {
            return r * (t /= i) * t * t * t + n
        }, easeOutQuart: function(e, t, n, r, i) {
            return-r * ((t = t / i - 1) * t * t * t - 1) + n
        }, easeInOutQuart: function(e, t, n, r, i) {
            if ((t /= i / 2) < 1)
                return r / 2 * t * t * t * t + n;
            return-r / 2 * ((t -= 2) * t * t * t - 2) + n
        }, easeInQuint: function(e, t, n, r, i) {
            return r * (t /= i) * t * t * t * t + n
        }, easeOutQuint: function(e, t, n, r, i) {
            return r * ((t = t / i - 1) * t * t * t * t + 1) + n
        }, easeInOutQuint: function(e, t, n, r, i) {
            if ((t /= i / 2) < 1)
                return r / 2 * t * t * t * t * t + n;
            return r / 2 * ((t -= 2) * t * t * t * t + 2) + n
        }, easeInSine: function(e, t, n, r, i) {
            return-r * Math.cos(t / i * (Math.PI / 2)) + r + n
        }, easeOutSine: function(e, t, n, r, i) {
            return r * Math.sin(t / i * (Math.PI / 2)) + n
        }, easeInOutSine: function(e, t, n, r, i) {
            return-r / 2 * (Math.cos(Math.PI * t / i) - 1) + n
        }, easeInExpo: function(e, t, n, r, i) {
            return t == 0 ? n : r * Math.pow(2, 10 * (t / i - 1)) + n
        }, easeOutExpo: function(e, t, n, r, i) {
            return t == i ? n + r : r * (-Math.pow(2, -10 * t / i) + 1) + n
        }, easeInOutExpo: function(e, t, n, r, i) {
            if (t == 0)
                return n;
            if (t == i)
                return n + r;
            if ((t /= i / 2) < 1)
                return r / 2 * Math.pow(2, 10 * (t - 1)) + n;
            return r / 2 * (-Math.pow(2, -10 * --t) + 2) + n
        }, easeInCirc: function(e, t, n, r, i) {
            return-r * (Math.sqrt(1 - (t /= i) * t) - 1) + n
        }, easeOutCirc: function(e, t, n, r, i) {
            return r * Math.sqrt(1 - (t = t / i - 1) * t) + n
        }, easeInOutCirc: function(e, t, n, r, i) {
            if ((t /= i / 2) < 1)
                return-r / 2 * (Math.sqrt(1 - t * t) - 1) + n;
            return r / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + n
        }, easeInElastic: function(e, t, n, r, i) {
            var s = 1.70158;
            var o = 0;
            var u = r;
            if (t == 0)
                return n;
            if ((t /= i) == 1)
                return n + r;
            if (!o)
                o = i * .3;
            if (u < Math.abs(r)) {
                u = r;
                var s = o / 4
            } else
                var s = o / (2 * Math.PI) * Math.asin(r / u);
            return-(u * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * i - s) * 2 * Math.PI / o)) + n
        }, easeOutElastic: function(e, t, n, r, i) {
            var s = 1.70158;
            var o = 0;
            var u = r;
            if (t == 0)
                return n;
            if ((t /= i) == 1)
                return n + r;
            if (!o)
                o = i * .3;
            if (u < Math.abs(r)) {
                u = r;
                var s = o / 4
            } else
                var s = o / (2 * Math.PI) * Math.asin(r / u);
            return u * Math.pow(2, -10 * t) * Math.sin((t * i - s) * 2 * Math.PI / o) + r + n
        }, easeInOutElastic: function(e, t, n, r, i) {
            var s = 1.70158;
            var o = 0;
            var u = r;
            if (t == 0)
                return n;
            if ((t /= i / 2) == 2)
                return n + r;
            if (!o)
                o = i * .3 * 1.5;
            if (u < Math.abs(r)) {
                u = r;
                var s = o / 4
            } else
                var s = o / (2 * Math.PI) * Math.asin(r / u);
            if (t < 1)
                return-.5 * u * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * i - s) * 2 * Math.PI / o) + n;
            return u * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * i - s) * 2 * Math.PI / o) * .5 + r + n
        }, easeInBack: function(e, t, n, r, i, s) {
            if (s == undefined)
                s = 1.70158;
            return r * (t /= i) * t * ((s + 1) * t - s) + n
        }, easeOutBack: function(e, t, n, r, i, s) {
            if (s == undefined)
                s = 1.70158;
            return r * ((t = t / i - 1) * t * ((s + 1) * t + s) + 1) + n
        }, easeInOutBack: function(e, t, n, r, i, s) {
            if (s == undefined)
                s = 1.70158;
            if ((t /= i / 2) < 1)
                return r / 2 * t * t * (((s *= 1.525) + 1) * t - s) + n;
            return r / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + n
        }, easeInBounce: function(e, t, n, r, i) {
            return r - jQuery.easing.easeOutBounce(e, i - t, 0, r, i) + n
        }, easeOutBounce: function(e, t, n, r, i) {
            if ((t /= i) < 1 / 2.75) {
                return r * 7.5625 * t * t + n
            } else if (t < 2 / 2.75) {
                return r * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + n
            } else if (t < 2.5 / 2.75) {
                return r * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + n
            } else {
                return r * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + n
            }
        }, easeInOutBounce: function(e, t, n, r, i) {
            if (t < i / 2)
                return jQuery.easing.easeInBounce(e, t * 2, 0, r, i) * .5 + n;
            return jQuery.easing.easeOutBounce(e, t * 2 - i, 0, r, i) * .5 + r * .5 + n
        }});
    e.waitForImages = {hasImageProperties: ["backgroundImage", "listStyleImage", "borderImage", "borderCornerImage"]};
    e.expr[":"].uncached = function(t) {
        var n = document.createElement("img");
        n.src = t.src;
        return e(t).is('img[src!=""]') && !n.complete
    };
    e.fn.waitForImages = function(t, n, r) {
        if (e.isPlainObject(arguments[0])) {
            n = t.each;
            r = t.waitForAll;
            t = t.finished
        }
        t = t || e.noop;
        n = n || e.noop;
        r = !!r;
        if (!e.isFunction(t) || !e.isFunction(n)) {
            throw new TypeError("An invalid callback was supplied.")
        }
        return this.each(function() {
            var i = e(this), s = [];
            if (r) {
                var o = e.waitForImages.hasImageProperties || [], u = /url\((['"]?)(.*?)\1\)/g;
                i.find("*").each(function() {
                    var t = e(this);
                    if (t.is("img:uncached")) {
                        s.push({src: t.attr("src"), element: t[0]})
                    }
                    e.each(o, function(e, n) {
                        var r = t.css(n);
                        if (!r) {
                            return true
                        }
                        var i;
                        while (i = u.exec(r)) {
                            s.push({src: i[2], element: t[0]})
                        }
                    })
                })
            } else {
                i.find("img:uncached").each(function() {
                    s.push({src: this.src, element: this})
                })
            }
            var f = s.length, l = 0;
            if (f == 0) {
                t.call(i[0])
            }
            e.each(s, function(r, s) {
                var o = new Image;
                e(o).bind("load error", function(e) {
                    l++;
                    n.call(s.element, l, f, e.type == "load");
                    if (l == f) {
                        t.call(i[0]);
                        return false
                    }
                });
                o.src = s.src
            })
        })
    };
    e.fn.swipe = function(t) {
        if (!this)
            return false;
        var n = {fingers: 1, threshold: 75, swipe: null, swipeLeft: null, swipeRight: null, swipeUp: null, swipeDown: null, swipeStatus: null, click: null, triggerOnTouchEnd: true, allowPageScroll: "auto"};
        var r = "left";
        var i = "right";
        var s = "up";
        var o = "down";
        var u = "none";
        var f = "horizontal";
        var l = "vertical";
        var c = "auto";
        var h = "start";
        var p = "move";
        var d = "end";
        var v = "cancel";
        var m = "ontouchstart"in window, g = m ? "touchstart" : "mousedown", y = m ? "touchmove" : "mousemove", b = m ? "touchend" : "mouseup", w = "touchcancel";
        var E = "start";
        if (t.allowPageScroll == undefined && (t.swipe != undefined || t.swipeStatus != undefined))
            t.allowPageScroll = u;
        if (t)
            e.extend(n, t);
        return this.each(function() {
            function t() {
                var e = S();
                if (e <= 45 && e >= 0)
                    return r;
                else if (e <= 360 && e >= 315)
                    return r;
                else if (e >= 135 && e <= 225)
                    return i;
                else if (e > 45 && e < 135)
                    return o;
                else
                    return s
            }
            function S() {
                var e = H.x - B.x;
                var t = B.y - H.y;
                var n = Math.atan2(t, e);
                var r = Math.round(n * 180 / Math.PI);
                if (r < 0)
                    r = 360 - Math.abs(r);
                return r
            }
            function x() {
                return Math.round(Math.sqrt(Math.pow(B.x - H.x, 2) + Math.pow(B.y - H.y, 2)))
            }
            function T(e, t) {
                if (n.allowPageScroll == u) {
                    e.preventDefault()
                } else {
                    var a = n.allowPageScroll == c;
                    switch (t) {
                        case r:
                            if (n.swipeLeft && a || !a && n.allowPageScroll != f)
                                e.preventDefault();
                            break;
                        case i:
                            if (n.swipeRight && a || !a && n.allowPageScroll != f)
                                e.preventDefault();
                            break;
                        case s:
                            if (n.swipeUp && a || !a && n.allowPageScroll != l)
                                e.preventDefault();
                            break;
                        case o:
                            if (n.swipeDown && a || !a && n.allowPageScroll != l)
                                e.preventDefault();
                            break
                    }
                }
            }
            function N(e, t) {
                if (n.swipeStatus)
                    n.swipeStatus.call(_, e, t, direction || null, distance || 0);
                if (t == v) {
                    if (n.click && (P == 1 || !m) && (isNaN(distance) || distance == 0))
                        n.click.call(_, e, e.target)
                }
                if (t == d) {
                    if (n.swipe) {
                        n.swipe.call(_, e, direction, distance)
                    }
                    switch (direction) {
                        case r:
                            if (n.swipeLeft)
                                n.swipeLeft.call(_, e, direction, distance);
                            break;
                        case i:
                            if (n.swipeRight)
                                n.swipeRight.call(_, e, direction, distance);
                            break;
                        case s:
                            if (n.swipeUp)
                                n.swipeUp.call(_, e, direction, distance);
                            break;
                        case o:
                            if (n.swipeDown)
                                n.swipeDown.call(_, e, direction, distance);
                            break
                    }
                }
            }
            function C(e) {
                P = 0;
                H.x = 0;
                H.y = 0;
                B.x = 0;
                B.y = 0;
                F.x = 0;
                F.y = 0
            }
            function L(e) {
                e.preventDefault();
                distance = x();
                direction = t();
                if (n.triggerOnTouchEnd) {
                    E = d;
                    if ((P == n.fingers || !m) && B.x != 0) {
                        if (distance >= n.threshold) {
                            N(e, E);
                            C(e)
                        } else {
                            E = v;
                            N(e, E);
                            C(e)
                        }
                    } else {
                        E = v;
                        N(e, E);
                        C(e)
                    }
                } else if (E == p) {
                    E = v;
                    N(e, E);
                    C(e)
                }
                M.removeEventListener(y, A, false);
                M.removeEventListener(b, L, false)
            }
            function A(e) {
                if (E == d || E == v)
                    return;
                var r = m ? e.touches[0] : e;
                B.x = r.pageX;
                B.y = r.pageY;
                direction = t();
                if (m) {
                    P = e.touches.length
                }
                E = p;
                T(e, direction);
                if (P == n.fingers || !m) {
                    distance = x();
                    if (n.swipeStatus)
                        N(e, E, direction, distance);
                    if (!n.triggerOnTouchEnd) {
                        if (distance >= n.threshold) {
                            E = d;
                            N(e, E);
                            C(e)
                        }
                    }
                } else {
                    E = v;
                    N(e, E);
                    C(e)
                }
            }
            function O(e) {
                var t = m ? e.touches[0] : e;
                E = h;
                if (m) {
                    P = e.touches.length
                }
                distance = 0;
                direction = null;
                if (P == n.fingers || !m) {
                    H.x = B.x = t.pageX;
                    H.y = B.y = t.pageY;
                    if (n.swipeStatus)
                        N(e, E)
                } else {
                    C(e)
                }
                M.addEventListener(y, A, false);
                M.addEventListener(b, L, false)
            }
            var M = this;
            var _ = e(this);
            var D = null;
            var P = 0;
            var H = {x: 0, y: 0};
            var B = {x: 0, y: 0};
            var F = {x: 0, y: 0};
            try {
                this.addEventListener(g, O, false);
                this.addEventListener(w, C)
            } catch (I) {
            }
        })
    }
})(jQuery)

// SOME ERROR MESSAGES IN CASE THE PLUGIN CAN NOT BE LOADED
function revslider_showDoubleJqueryError(sliderID) {
    var errorMessage = "Revolution Slider Error: You have some jquery.js library include that comes after the revolution files js include.";
    errorMessage += "<br> This includes make eliminates the revolution slider libraries, and make it not work.";
    errorMessage += "<br><br> To fix it you can:<br>&nbsp;&nbsp;&nbsp; 1. In the Slider Settings -> Troubleshooting set option:  <strong><b>Put JS Includes To Body</b></strong> option to true.";
    errorMessage += "<br>&nbsp;&nbsp;&nbsp; 2. Find the double jquery.js include and remove it.";
    errorMessage = "<span style='font-size:16px;color:#BC0C06;'>" + errorMessage + "</span>"
    jQuery(sliderID).show().html(errorMessage);
}
/**************************************************************************
 * jquery.themepunch.revolution.js - jQuery Plugin for kenburn Slider
 * @version: 3.0 (16.06.2013)
 * @requires jQuery v1.7 or later (tested on 1.9)
 * @author ThemePunch
 **************************************************************************/

(function(jQuery, undefined) {


    ////////////////////////////////////////
    // THE REVOLUTION PLUGIN STARTS HERE //
    ///////////////////////////////////////

    jQuery.fn.extend({
        // OUR PLUGIN HERE :)
        revolution: function(options) {



            ////////////////////////////////
            // SET DEFAULT VALUES OF ITEM //
            ////////////////////////////////
            jQuery.fn.revolution.defaults = {
                delay: 9000,
                startheight: 500,
                startwidth: 960,
                hideThumbs: 200,
                thumbWidth: 100, // Thumb With and Height and Amount (only if navigation Tyope set to thumb !)
                thumbHeight: 50,
                thumbAmount: 5,
                navigationType: "bullet", // bullet, thumb, none
                navigationArrows: "withbullet", // nextto, solo, none

                navigationStyle: "round", // round,square,navbar,round-old,square-old,navbar-old, or any from the list in the docu (choose between 50+ different item),

                navigationHAlign: "center", // Vertical Align top,center,bottom
                navigationVAlign: "bottom", // Horizontal Align left,center,right
                navigationHOffset: 0,
                navigationVOffset: 20,
                soloArrowLeftHalign: "left",
                soloArrowLeftValign: "center",
                soloArrowLeftHOffset: 20,
                soloArrowLeftVOffset: 0,
                soloArrowRightHalign: "right",
                soloArrowRightValign: "center",
                soloArrowRightHOffset: 20,
                soloArrowRightVOffset: 0,
                touchenabled: "on", // Enable Swipe Function : on/off
                onHoverStop: "on", // Stop Banner Timet at Hover on Slide on/off


                stopAtSlide: -1, // Stop Timer if Slide "x" has been Reached. If stopAfterLoops set to 0, then it stops already in the first Loop at slide X which defined. -1 means do not stop at any slide. stopAfterLoops has no sinn in this case.
                stopAfterLoops: -1, // Stop Timer if All slides has been played "x" times. IT will stop at THe slide which is defined via stopAtSlide:x, if set to -1 slide never stop automatic

                hideCaptionAtLimit: 0, // It Defines if a caption should be shown under a Screen Resolution ( Basod on The Width of Browser)
                hideAllCaptionAtLilmit: 0, // Hide all The Captions if Width of Browser is less then this value
                hideSliderAtLimit: 0, // Hide the whole slider, and stop also functions if Width of Browser is less than this value

                shadow: 1, //0 = no Shadow, 1,2,3 = 3 Different Art of Shadows  (No Shadow in Fullwidth Version !)
                fullWidth: "off", // Turns On or Off the Fullwidth Image Centering in FullWidth Modus
                fullScreen: "off",
            };

            options = jQuery.extend({}, jQuery.fn.revolution.defaults, options);




            return this.each(function() {

                var opt = options;
                var container = jQuery(this);
                if (!container.hasClass("revslider-initialised")) {

                    container.addClass("revslider-initialised");
                    if (container.attr('id') == undefined)
                        container.attr('id', "revslider-" + Math.round(Math.random() * 1000 + 5));

                    // CHECK IF FIREFOX 13 IS ON WAY.. IT HAS A STRANGE BUG, CSS ANIMATE SHOULD NOT BE USED



                    opt.firefox13 = false;
                    opt.ie = !jQuery.support.opacity;
                    opt.ie9 = (document.documentMode == 9);


                    // CHECK THE jQUERY VERSION
                    var version = jQuery.fn.jquery.split('.'),
                            versionTop = parseFloat(version[0]),
                            versionMinor = parseFloat(version[1]),
                            versionIncrement = parseFloat(version[2] || '0');

                    if (versionTop == 1 && versionMinor < 7) {
                        container.html('<div style="text-align:center; padding:40px 0px; font-size:20px; color:#992222;"> The Current Version of jQuery:' + version + ' <br>Please update your jQuery Version to min. 1.7 in Case you wish to use the Revolution Slider Plugin</div>');
                    }

                    if (versionTop > 1)
                        opt.ie = false;


                    // Delegate .transition() calls to .animate()
                    // if the browser can't do CSS transitions.
                    if (!jQuery.support.transition)
                        jQuery.fn.transition = jQuery.fn.animate;




                    jQuery.cssEase['Bounce'] = 'cubic-bezier(0,1,0.5,1.3)';

                    // CATCH THE CONTAINER
                    //var container=jQuery(this);
                    //container.css({'display':'block'});

                    // LOAD THE YOUTUBE API IF NECESSARY

                    container.find('.caption').each(function() {
                        jQuery(this).addClass('tp-caption')
                    });
                    var addedyt = 0;
                    var addedvim = 0;
                    var addedvid = 0;
                    container.find('.tp-caption iframe').each(function(i) {
                        try {

                            if (jQuery(this).attr('src').indexOf('you') > 0 && addedyt == 0) {
                                addedyt = 1;
                                var s = document.createElement("script");
                                s.src = "http://www.youtube.com/player_api"; /* Load Player API*/
                                var before = document.getElementsByTagName("script")[0];
                                before.parentNode.insertBefore(s, before);
                            }
                        } catch (e) {
                        }
                    });



                    // LOAD THE VIMEO API
                    container.find('.tp-caption iframe').each(function(i) {
                        try {
                            if (jQuery(this).attr('src').indexOf('vim') > 0 && addedvim == 0) {
                                addedvim = 1;
                                var f = document.createElement("script");
                                f.src = "http://a.vimeocdn.com/js/froogaloop2.min.js"; /* Load Player API*/
                                var before = document.getElementsByTagName("script")[0];
                                before.parentNode.insertBefore(f, before);
                            }
                        } catch (e) {
                        }
                    });

                    // LOAD THE VIDEO.JS API IF NEEDED
                    container.find('.tp-caption video').each(function(i) {
                        try {
                            if (jQuery(this).hasClass('video-js') && addedvid == 0) {
                                addedvid = 1;
                                var f = document.createElement("script");
                                f.src = opt.videoJsPath + "video.js"; /* Load Player API*/
                                var before = document.getElementsByTagName("script")[0];
                                before.parentNode.insertBefore(f, before);
                                jQuery('head').append('<link rel="stylesheet" type="text/css" href="' + opt.videoJsPath + 'video-js.min.css" media="screen" />');
                                jQuery('head').append('<script> videojs.options.flash.swf = "' + opt.videoJsPath + 'video-js.swf";</script>');
                            }
                        } catch (e) {
                        }
                    });

                    // SHUFFLE MODE
                    if (opt.shuffle == "on") {
                        for (var u = 0; u < container.find('>ul:first-child >li').length; u++) {
                            var it = Math.round(Math.random() * container.find('>ul:first-child >li').length);
                            container.find('>ul:first-child >li:eq(' + it + ')').prependTo(container.find('>ul:first-child'));
                        }
                    }


                    // CREATE SOME DEFAULT OPTIONS FOR LATER
                    opt.slots = 4;
                    opt.act = -1;
                    opt.next = 0;

                    // IF START SLIDE IS SET
                    if (opt.startWithSlide != undefined)
                        opt.next = opt.startWithSlide;

                    // IF DEEPLINK HAS BEEN SET
                    var deeplink = getUrlVars("#")[0];
                    if (deeplink.length < 9) {
                        if (deeplink.split('slide').length > 1) {
                            var dslide = parseInt(deeplink.split('slide')[1], 0);
                            if (dslide < 1)
                                dslide = 1;
                            if (dslide > container.find('>ul:first >li').length)
                                dslide = container.find('>ul:first >li').length;
                            opt.next = dslide - 1;
                        }
                    }


                    opt.origcd = opt.delay;

                    opt.firststart = 1;






                    // BASIC OFFSET POSITIONS OF THE BULLETS
                    if (opt.navigationHOffset == undefined)
                        opt.navOffsetHorizontal = 0;
                    if (opt.navigationVOffset == undefined)
                        opt.navOffsetVertical = 0;





                    container.append('<div class="tp-loader"></div>');

                    // RESET THE TIMER
                    if (container.find('.tp-bannertimer').length == 0)
                        container.append('<div class="tp-bannertimer" style="visibility:hidden"></div>');
                    var bt = container.find('.tp-bannertimer');
                    if (bt.length > 0) {
                        bt.css({'width': '0%'});
                    }
                    ;


                    // WE NEED TO ADD A BASIC CLASS FOR SETTINGS.CSS
                    container.addClass("tp-simpleresponsive");
                    opt.container = container;

                    //if (container.height()==0) container.height(opt.startheight);

                    // AMOUNT OF THE SLIDES
                    opt.slideamount = container.find('>ul:first >li').length;


                    // A BASIC GRID MUST BE DEFINED. IF NO DEFAULT GRID EXIST THAN WE NEED A DEFAULT VALUE, ACTUAL SIZE OF CONAINER
                    if (container.height() == 0)
                        container.height(opt.startheight);
                    if (opt.startwidth == undefined || opt.startwidth == 0)
                        opt.startwidth = container.width();
                    if (opt.startheight == undefined || opt.startheight == 0)
                        opt.startheight = container.height();

                    // OPT WIDTH && HEIGHT SHOULD BE SET
                    opt.width = container.width();
                    opt.height = container.height();


                    // DEFAULT DEPENDECIES
                    opt.bw = opt.startwidth / container.width();
                    opt.bh = opt.startheight / container.height();

                    // IF THE ITEM ALREADY IN A RESIZED FORM
                    if (opt.width != opt.startwidth) {

                        opt.height = Math.round(opt.startheight * (opt.width / opt.startwidth));
                        container.height(opt.height);

                    }

                    // LETS SEE IF THERE IS ANY SHADOW
                    if (opt.shadow != 0) {
                        container.parent().append('<div class="tp-bannershadow tp-shadow' + opt.shadow + '"></div>');

                        container.parent().find('.tp-bannershadow').css({'width': opt.width});
                    }


                    container.find('ul').css({'display': 'none'});


                    if (opt.lazyLoad != "on") {
                        // IF IMAGES HAS BEEN LOADED
                        container.waitForImages(function() {
                            // PREPARE THE SLIDES
                            container.find('ul').css({'display': 'block'});
                            prepareSlides(container, opt);

                            // CREATE BULLETS
                            if (opt.slideamount > 1)
                                createBullets(container, opt);
                            if (opt.slideamount > 1)
                                createThumbs(container, opt);
                            if (opt.slideamount > 1)
                                createArrows(container, opt);

                            jQuery('#unvisible_button').click(function() {

                                opt.navigationArrows = jQuery('.selectnavarrows').val();
                                opt.navigationType = jQuery('.selectnavtype').val();
                                opt.navigationStyle = jQuery('.selectnavstyle').val();
                                opt.soloArrowStyle = "default";

                                jQuery('.tp-bullets').remove();
                                jQuery('.tparrows').remove();

                                if (opt.slideamount > 1)
                                    createBullets(container, opt);
                                if (opt.slideamount > 1)
                                    createThumbs(container, opt);
                                if (opt.slideamount > 1)
                                    createArrows(container, opt);

                            });


                            swipeAction(container, opt);

                            if (opt.hideThumbs > 0)
                                hideThumbs(container, opt);


                            container.waitForImages(function() {
                                // START THE FIRST SLIDE

                                container.find('.tp-loader').fadeOut(600);
                                setTimeout(function() {

                                    swapSlide(container, opt);
                                    // START COUNTDOWN
                                    if (opt.slideamount > 1)
                                        countDown(container, opt);
                                    container.trigger('revolution.slide.onloaded');
                                }, 600);

                            });


                        });
                    } else {		// IF LAZY LOAD IS ACTIVATED
                        var fli = container.find('ul >li >img').first();
                        if (fli.data('lazyload') != undefined)
                            fli.attr('src', fli.data('lazyload'));
                        fli.data('lazydone', 1);
                        fli.parent().waitForImages(function() {

                            // PREPARE THE SLIDES
                            container.find('ul').css({'display': 'block'});
                            prepareSlides(container, opt);

                            // CREATE BULLETS
                            if (opt.slideamount > 1)
                                createBullets(container, opt);
                            if (opt.slideamount > 1)
                                createThumbs(container, opt);
                            if (opt.slideamount > 1)
                                createArrows(container, opt);

                            swipeAction(container, opt);

                            if (opt.hideThumbs > 0)
                                hideThumbs(container, opt);

                            fli.parent().waitForImages(function() {
                                // START THE FIRST SLIDE

                                container.find('.tp-loader').fadeOut(600);
                                setTimeout(function() {

                                    swapSlide(container, opt);
                                    // START COUNTDOWN
                                    if (opt.slideamount > 1)
                                        countDown(container, opt);
                                    container.trigger('revolution.slide.onloaded');
                                }, 600);
                            });
                        });
                    }



                    // IF RESIZED, NEED TO STOP ACTUAL TRANSITION AND RESIZE ACTUAL IMAGES
                    jQuery(window).resize(function() {
                        if (jQuery('body').find(container) != 0)
                            if (container.outerWidth(true) != opt.width) {
                                containerResized(container, opt);
                            }
                    });


                    // CHECK IF THE CAPTION IS A "SCROLL ME TO POSITION" CAPTION IS
                    //if (opt.fullScreen=="on") {
                    container.find('.tp-scrollbelowslider').on('click', function() {
                        var off = 0;
                        try {
                            off = jQuery('body').find(opt.fullScreenOffsetContainer).height();
                        } catch (e) {
                        }
                        try {
                            off = off - jQuery(this).data('scrolloffset');
                        } catch (e) {
                        }

                        jQuery('body,html').animate(
                                {scrollTop: (container.offset().top + (container.find('>ul >li').height()) - off) + "px"}, {duration: 400});
                    });
                    //}
                }

            })
        },
        // METHODE PAUSE
        revscroll: function(oy) {
            return this.each(function() {
                var container = jQuery(this);
                jQuery('body,html').animate(
                        {scrollTop: (container.offset().top + (container.find('>ul >li').height()) - oy) + "px"}, {duration: 400});
            })
        },
        // METHODE PAUSE
        revpause: function(options) {

            return this.each(function() {
                var container = jQuery(this);
                container.data('conthover', 1);
                container.data('conthover-changed', 1);
                container.trigger('revolution.slide.onpause');
                var bt = container.parent().find('.tp-bannertimer');
                bt.stop();

            })


        },
        // METHODE RESUME
        revresume: function(options) {
            return this.each(function() {
                var container = jQuery(this);
                container.data('conthover', 0);
                container.data('conthover-changed', 1);
                container.trigger('revolution.slide.onresume');
                var bt = container.parent().find('.tp-bannertimer');
                var opt = bt.data('opt');

                bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
            })

        },
        // METHODE NEXT
        revnext: function(options) {
            return this.each(function() {
                // CATCH THE CONTAINER
                var container = jQuery(this);
                container.parent().find('.tp-rightarrow').click();


            })

        },
        // METHODE RESUME
        revprev: function(options) {
            return this.each(function() {
                // CATCH THE CONTAINER
                var container = jQuery(this);
                container.parent().find('.tp-leftarrow').click();
            })

        },
        // METHODE LENGTH
        revmaxslide: function(options) {
            // CATCH THE CONTAINER
            return jQuery(this).find('>ul:first-child >li').length;
        },
        // METHODE CURRENT
        revcurrentslide: function(options) {
            // CATCH THE CONTAINER
            var container = jQuery(this);
            var bt = container.parent().find('.tp-bannertimer');
            var opt = bt.data('opt');
            return opt.act;
        },
        // METHODE CURRENT
        revlastslide: function(options) {
            // CATCH THE CONTAINER
            var container = jQuery(this);
            var bt = container.parent().find('.tp-bannertimer');
            var opt = bt.data('opt');
            return opt.lastslide;
        },
        // METHODE JUMP TO SLIDE
        revshowslide: function(slide) {
            return this.each(function() {
                // CATCH THE CONTAINER
                var container = jQuery(this);
                container.data('showus', slide);
                container.parent().find('.tp-rightarrow').click();
            })

        }


    })


    ///////////////////////////
    // GET THE URL PARAMETER //
    ///////////////////////////
    function getUrlVars(hashdivider)
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf(hashdivider) + 1).split('_');
        for (var i = 0; i < hashes.length; i++)
        {
            hashes[i] = hashes[i].replace('%3D', "=");
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    //////////////////////////
    //	CONTAINER RESIZED	//
    /////////////////////////
    function containerResized(container, opt) {


        container.find('.defaultimg').each(function(i) {

            setSize(jQuery(this), opt);

            opt.height = Math.round(opt.startheight * (opt.width / opt.startwidth));

            container.height(opt.height);

            setSize(jQuery(this), opt);

            try {
                container.parent().find('.tp-bannershadow').css({'width': opt.width});
            } catch (e) {
            }

            var actsh = container.find('>ul >li:eq(' + opt.act + ') .slotholder');
            var nextsh = container.find('>ul >li:eq(' + opt.next + ') .slotholder');
            removeSlots(container, opt);
            nextsh.find('.defaultimg').css({'opacity': 0});
            actsh.find('.defaultimg').css({'opacity': 1});

            setCaptionPositions(container, opt);

            var nextli = container.find('>ul >li:eq(' + opt.next + ')');
            container.find('.tp-caption').each(function() {
                jQuery(this).stop(true, true);
            });
            animateTheCaptions(nextli, opt);

            restartBannerTimer(opt, container);

        });
    }



    ////////////////////////////////
    //	RESTART THE BANNER TIMER //
    //////////////////////////////
    function restartBannerTimer(opt, container) {
        opt.cd = 0;
        if (opt.videoplaying != true) {
            var bt = container.find('.tp-bannertimer');
            if (bt.length > 0) {
                bt.stop();
                bt.css({'width': '0%'});
                bt.animate({'width': "100%"}, {duration: (opt.delay - 100), queue: false, easing: "linear"});
            }
            clearTimeout(opt.thumbtimer);
            opt.thumbtimer = setTimeout(function() {
                moveSelectedThumb(container);
                setBulPos(container, opt);
            }, 200);
        }
    }

    ////////////////////////////////
    //	RESTART THE BANNER TIMER //
    //////////////////////////////
    function killBannerTimer(opt, container) {
        opt.cd = 0;

        var bt = container.find('.tp-bannertimer');
        if (bt.length > 0) {
            bt.stop(true, true);
            bt.css({'width': '0%'});
            //bt.animate({'width':"100%"},{duration:(opt.delay-100),queue:false, easing:"linear"});
        }
        clearTimeout(opt.thumbtimer);

    }

    function callingNewSlide(opt, container) {
        opt.cd = 0;
        swapSlide(container, opt);

        // STOP TIMER AND RESCALE IT
        var bt = container.find('.tp-bannertimer');
        if (bt.length > 0) {
            bt.stop();
            bt.css({'width': '0%'});
            bt.animate({'width': "100%"}, {duration: (opt.delay - 100), queue: false, easing: "linear"});
        }
    }



    ////////////////////////////////
    //	-	CREATE THE BULLETS -  //
    ////////////////////////////////
    function createThumbs(container, opt) {

        var cap = container.parent();

        if (opt.navigationType == "thumb" || opt.navsecond == "both") {
            cap.append('<div class="tp-bullets tp-thumbs ' + opt.navigationStyle + '"><div class="tp-mask"><div class="tp-thumbcontainer"></div></div></div>');
        }
        var bullets = cap.find('.tp-bullets.tp-thumbs .tp-mask .tp-thumbcontainer');
        var bup = bullets.parent();

        bup.width(opt.thumbWidth * opt.thumbAmount);
        bup.height(opt.thumbHeight);
        bup.parent().width(opt.thumbWidth * opt.thumbAmount);
        bup.parent().height(opt.thumbHeight);

        container.find('>ul:first >li').each(function(i) {
            var li = container.find(">ul:first >li:eq(" + i + ")");
            if (li.data('thumb') != undefined)
                var src = li.data('thumb')
            else
                var src = li.find("img:first").attr('src');
            bullets.append('<div class="bullet thumb"><img src="' + src + '"></div>');
            var bullet = bullets.find('.bullet:first');
        });
        //bullets.append('<div style="clear:both"></div>');
        var minwidth = 100;


        // ADD THE BULLET CLICK FUNCTION HERE
        bullets.find('.bullet').each(function(i) {
            var bul = jQuery(this);

            if (i == opt.slideamount - 1)
                bul.addClass('last');
            if (i == 0)
                bul.addClass('first');
            bul.width(opt.thumbWidth);
            bul.height(opt.thumbHeight);
            if (minwidth > bul.outerWidth(true))
                minwidth = bul.outerWidth(true);

            bul.click(function() {
                if (opt.transition == 0 && bul.index() != opt.act) {
                    opt.next = bul.index();
                    callingNewSlide(opt, container);
                }
            });
        });


        var max = minwidth * container.find('>ul:first >li').length;

        var thumbconwidth = bullets.parent().width();
        opt.thumbWidth = minwidth;



        ////////////////////////
        // SLIDE TO POSITION  //
        ////////////////////////
        if (thumbconwidth < max) {
            jQuery(document).mousemove(function(e) {
                jQuery('body').data('mousex', e.pageX);
            });



            // ON MOUSE MOVE ON THE THUMBNAILS EVERYTHING SHOULD MOVE :)

            bullets.parent().mouseenter(function() {
                var $this = jQuery(this);
                $this.addClass("over");
                var offset = $this.offset();
                var x = jQuery('body').data('mousex') - offset.left;
                var thumbconwidth = $this.width();
                var minwidth = $this.find('.bullet:first').outerWidth(true);
                var max = minwidth * container.find('>ul:first >li').length;
                var diff = (max - thumbconwidth) + 15;
                var steps = diff / thumbconwidth;
                x = x - 30;
                //if (x<30) x=0;
                //if (x>thumbconwidth-30) x=thumbconwidth;

                //ANIMATE TO POSITION
                var pos = (0 - ((x) * steps));
                if (pos > 0)
                    pos = 0;
                if (pos < 0 - max + thumbconwidth)
                    pos = 0 - max + thumbconwidth;
                moveThumbSliderToPosition($this, pos, 200);
            });

            bullets.parent().mousemove(function() {

                var $this = jQuery(this);

                //if (!$this.hasClass("over")) {
                var offset = $this.offset();
                var x = jQuery('body').data('mousex') - offset.left;
                var thumbconwidth = $this.width();
                var minwidth = $this.find('.bullet:first').outerWidth(true);
                var max = minwidth * container.find('>ul:first >li').length;
                var diff = (max - thumbconwidth) + 15;
                var steps = diff / thumbconwidth;
                x = x - 30;
                //if (x<30) x=0;
                //if (x>thumbconwidth-30) x=thumbconwidth;

                //ANIMATE TO POSITION
                var pos = (0 - ((x) * steps));
                if (pos > 0)
                    pos = 0;
                if (pos < 0 - max + thumbconwidth)
                    pos = 0 - max + thumbconwidth;
                moveThumbSliderToPosition($this, pos, 0);
                //} else {
                //$this.removeClass("over");
                //}

            });

            bullets.parent().mouseleave(function() {
                var $this = jQuery(this);
                $this.removeClass("over");
                moveSelectedThumb(container);
            });
        }


    }


    ///////////////////////////////
    //	SelectedThumbInPosition //
    //////////////////////////////
    function moveSelectedThumb(container) {

        var bullets = container.parent().find('.tp-bullets.tp-thumbs .tp-mask .tp-thumbcontainer');
        var $this = bullets.parent();
        var offset = $this.offset();
        var minwidth = $this.find('.bullet:first').outerWidth(true);

        var x = $this.find('.bullet.selected').index() * minwidth;
        var thumbconwidth = $this.width();
        var minwidth = $this.find('.bullet:first').outerWidth(true);
        var max = minwidth * container.find('>ul:first >li').length;
        var diff = (max - thumbconwidth);
        var steps = diff / thumbconwidth;

        //ANIMATE TO POSITION
        var pos = 0 - x;

        if (pos > 0)
            pos = 0;
        if (pos < 0 - max + thumbconwidth)
            pos = 0 - max + thumbconwidth;
        if (!$this.hasClass("over")) {
            moveThumbSliderToPosition($this, pos, 200);
        }
    }


    ////////////////////////////////////
    //	MOVE THUMB SLIDER TO POSITION //
    ///////////////////////////////////
    function moveThumbSliderToPosition($this, pos, speed) {
        $this.stop();
        $this.find('.tp-thumbcontainer').animate({'left': pos + 'px'}, {duration: speed, queue: false});
    }



    ////////////////////////////////
    //	-	CREATE THE BULLETS -  //
    ////////////////////////////////
    function createBullets(container, opt) {

        if (opt.navigationType == "bullet" || opt.navigationType == "both") {
            container.parent().append('<div class="tp-bullets simplebullets ' + opt.navigationStyle + '"></div>');
        }


        var bullets = container.parent().find('.tp-bullets');

        container.find('>ul:first >li').each(function(i) {
            var src = container.find(">ul:first >li:eq(" + i + ") img:first").attr('src');
            bullets.append('<div class="bullet"></div>');
            var bullet = bullets.find('.bullet:first');


        });

        // ADD THE BULLET CLICK FUNCTION HERE
        bullets.find('.bullet').each(function(i) {
            var bul = jQuery(this);
            if (i == opt.slideamount - 1)
                bul.addClass('last');
            if (i == 0)
                bul.addClass('first');

            bul.click(function() {
                var sameslide = false;
                if (opt.navigationArrows == "withbullet" || opt.navigationArrows == "nexttobullets") {
                    if (bul.index() - 1 == opt.act)
                        sameslide = true;
                } else {
                    if (bul.index() == opt.act)
                        sameslide = true;
                }

                if (opt.transition == 0 && !sameslide) {

                    if (opt.navigationArrows == "withbullet" || opt.navigationArrows == "nexttobullets") {
                        opt.next = bul.index() - 1;
                    } else {
                        opt.next = bul.index();
                    }

                    callingNewSlide(opt, container);
                }
            });

        });

        bullets.append('<div class="tpclear"></div>');



        setBulPos(container, opt);





    }

    //////////////////////
    //	CREATE ARROWS	//
    /////////////////////
    function createArrows(container, opt) {

        var bullets = container.find('.tp-bullets');

        var hidden = "";
        var arst = opt.navigationStyle;
        if (opt.navigationArrows == "none")
            hidden = "visibility:none";
        opt.soloArrowStyle = "default";

        if (opt.navigationArrows != "none" && opt.navigationArrows != "nexttobullets")
            arst = opt.soloArrowStyle;

        container.parent().append('<div style="' + hidden + '" class="tp-leftarrow tparrows ' + arst + '"></div>');
        container.parent().append('<div style="' + hidden + '" class="tp-rightarrow tparrows ' + arst + '"></div>');

        // 	THE LEFT / RIGHT BUTTON CLICK !	 //
        container.parent().find('.tp-rightarrow').click(function() {

            if (opt.transition == 0) {
                if (container.data('showus') != undefined && container.data('showus') != -1)
                    opt.next = container.data('showus') - 1;
                else
                    opt.next = opt.next + 1;
                container.data('showus', -1);
                if (opt.next >= opt.slideamount)
                    opt.next = 0;
                if (opt.next < 0)
                    opt.next = 0;

                if (opt.act != opt.next)
                    callingNewSlide(opt, container);
            }
        });

        container.parent().find('.tp-leftarrow').click(function() {
            if (opt.transition == 0) {
                opt.next = opt.next - 1;
                opt.leftarrowpressed = 1;
                if (opt.next < 0)
                    opt.next = opt.slideamount - 1;
                callingNewSlide(opt, container);
            }
        });

        setBulPos(container, opt);

    }

    ////////////////////////////
    // SET THE SWIPE FUNCTION //
    ////////////////////////////
    function swipeAction(container, opt) {
        // TOUCH ENABLED SCROLL

        if (opt.touchenabled == "on")
            container.swipe({data: container,
                swipeRight: function()
                {

                    if (opt.transition == 0) {
                        opt.next = opt.next - 1;
                        opt.leftarrowpressed = 1;
                        if (opt.next < 0)
                            opt.next = opt.slideamount - 1;
                        callingNewSlide(opt, container);
                    }
                },
                swipeLeft: function()
                {

                    if (opt.transition == 0) {
                        opt.next = opt.next + 1;
                        if (opt.next == opt.slideamount)
                            opt.next = 0;
                        callingNewSlide(opt, container);
                    }
                },
                allowPageScroll: "auto"});
    }




    ////////////////////////////////////////////////////////////////
    // SHOW AND HIDE THE THUMBS IF MOUE GOES OUT OF THE BANNER  ///
    //////////////////////////////////////////////////////////////
    function hideThumbs(container, opt) {

        var bullets = container.parent().find('.tp-bullets');
        var ca = container.parent().find('.tparrows');

        if (bullets == null) {
            container.append('<div class=".tp-bullets"></div>');
            var bullets = container.parent().find('.tp-bullets');
        }

        if (ca == null) {
            container.append('<div class=".tparrows"></div>');
            var ca = container.parent().find('.tparrows');
        }


        //var bp = (thumbs.parent().outerHeight(true) - opt.height)/2;

        //	ADD THUMBNAIL IMAGES FOR THE BULLETS //
        container.data('hidethumbs', opt.hideThumbs);

        bullets.addClass("hidebullets");
        ca.addClass("hidearrows");

        bullets.hover(function() {
            bullets.addClass("hovered");
            clearTimeout(container.data('hidethumbs'));
            bullets.removeClass("hidebullets");
            ca.removeClass("hidearrows");
        },
                function() {

                    bullets.removeClass("hovered");
                    if (!container.hasClass("hovered") && !bullets.hasClass("hovered"))
                        container.data('hidethumbs', setTimeout(function() {
                            bullets.addClass("hidebullets");
                            ca.addClass("hidearrows");
                        }, opt.hideThumbs));
                });


        ca.hover(function() {
            bullets.addClass("hovered");
            clearTimeout(container.data('hidethumbs'));
            bullets.removeClass("hidebullets");
            ca.removeClass("hidearrows");

        },
                function() {

                    bullets.removeClass("hovered");
                    /*if (!container.hasClass("hovered") && !bullets.hasClass("hovered"))
                     container.data('hidethumbs', setTimeout(function() {
                     bullets.addClass("hidebullets");
                     ca.addClass("hidearrows");
                     },opt.hideThumbs));*/
                });



        container.on('mouseenter', function() {
            container.addClass("hovered");
            clearTimeout(container.data('hidethumbs'));
            bullets.removeClass("hidebullets");
            ca.removeClass("hidearrows");
        });

        container.on('mouseleave', function() {
            container.removeClass("hovered");
            if (!container.hasClass("hovered") && !bullets.hasClass("hovered"))
                container.data('hidethumbs', setTimeout(function() {
                    bullets.addClass("hidebullets");
                    ca.addClass("hidearrows");
                }, opt.hideThumbs));
        });

    }







    //////////////////////////////
    //	SET POSITION OF BULLETS	//
    //////////////////////////////
    function setBulPos(container, opt) {
        var topcont = container.parent();
        var bullets = topcont.find('.tp-bullets');
        var tl = topcont.find('.tp-leftarrow');
        var tr = topcont.find('.tp-rightarrow');

        if (opt.navigationType == "thumb" && opt.navigationArrows == "nexttobullets")
            opt.navigationArrows = "solo";
        // IM CASE WE HAVE NAVIGATION BULLETS TOGETHER WITH ARROWS
        if (opt.navigationArrows == "nexttobullets") {
            tl.prependTo(bullets).css({'float': 'left'});
            tr.insertBefore(bullets.find('.tpclear')).css({'float': 'left'});
        }


        if (opt.navigationArrows != "none" && opt.navigationArrows != "nexttobullets") {

            tl.css({'position': 'absolute'});
            tr.css({'position': 'absolute'});

            if (opt.soloArrowLeftValign == "center")
                tl.css({'top': '50%', 'marginTop': (opt.soloArrowLeftVOffset - Math.round(tl.innerHeight() / 2)) + "px"});
            if (opt.soloArrowLeftValign == "bottom")
                tl.css({'bottom': (0 + opt.soloArrowLeftVOffset) + "px"});
            if (opt.soloArrowLeftValign == "top")
                tl.css({'top': (0 + opt.soloArrowLeftVOffset) + "px"});
            if (opt.soloArrowLeftHalign == "center")
                tl.css({'left': '50%', 'marginLeft': (opt.soloArrowLeftHOffset - Math.round(tl.innerWidth() / 2)) + "px"});
            if (opt.soloArrowLeftHalign == "left")
                tl.css({'left': (0 + opt.soloArrowLeftHOffset) + "px"});
            if (opt.soloArrowLeftHalign == "right")
                tl.css({'right': (0 + opt.soloArrowLeftHOffset) + "px"});

            if (opt.soloArrowRightValign == "center")
                tr.css({'top': '50%', 'marginTop': (opt.soloArrowRightVOffset - Math.round(tr.innerHeight() / 2)) + "px"});
            if (opt.soloArrowRightValign == "bottom")
                tr.css({'bottom': (0 + opt.soloArrowRightVOffset) + "px"});
            if (opt.soloArrowRightValign == "top")
                tr.css({'top': (0 + opt.soloArrowRightVOffset) + "px"});
            if (opt.soloArrowRightHalign == "center")
                tr.css({'left': '50%', 'marginLeft': (opt.soloArrowRightHOffset - Math.round(tr.innerWidth() / 2)) + "px"});
            if (opt.soloArrowRightHalign == "left")
                tr.css({'left': (0 + opt.soloArrowRightHOffset) + "px"});
            if (opt.soloArrowRightHalign == "right")
                tr.css({'right': (0 + opt.soloArrowRightHOffset) + "px"});


            if (tl.position() != null)
                tl.css({'top': Math.round(parseInt(tl.position().top, 0)) + "px"});

            if (tr.position() != null)
                tr.css({'top': Math.round(parseInt(tr.position().top, 0)) + "px"});
        }

        if (opt.navigationArrows == "none") {
            tl.css({'visibility': 'hidden'});
            tr.css({'visibility': 'hidden'});
        }

        // SET THE POSITIONS OF THE BULLETS // THUMBNAILS


        if (opt.navigationVAlign == "center")
            bullets.css({'top': '50%', 'marginTop': (opt.navigationVOffset - Math.round(bullets.innerHeight() / 2)) + "px"});
        if (opt.navigationVAlign == "bottom")
            bullets.css({'bottom': (0 + opt.navigationVOffset) + "px"});
        if (opt.navigationVAlign == "top")
            bullets.css({'top': (0 + opt.navigationVOffset) + "px"});


        if (opt.navigationHAlign == "center")
            bullets.css({'left': '50%', 'marginLeft': (opt.navigationHOffset - Math.round(bullets.innerWidth() / 2)) + "px"});
        if (opt.navigationHAlign == "left")
            bullets.css({'left': (0 + opt.navigationHOffset) + "px"});
        if (opt.navigationHAlign == "right")
            bullets.css({'right': (0 + opt.navigationHOffset) + "px"});



    }



    //////////////////////////////////////////////////////////
    //	-	SET THE IMAGE SIZE TO FIT INTO THE CONTIANER -  //
    ////////////////////////////////////////////////////////
    function setSize(img, opt) {



        opt.width = parseInt(opt.container.width(), 0);
        opt.height = parseInt(opt.container.height(), 0);



        opt.bw = (opt.width / opt.startwidth);

        if (opt.fullScreen == "on") {
            opt.height = opt.bw * opt.startheight;
        }
        opt.bh = (opt.height / opt.startheight);



        if (opt.bh > 1) {
            opt.bh = 1;
            opt.bw = 1;
        }


        // IF IMG IS ALREADY PREPARED, WE RESET THE SIZE FIRST HERE

        if ((img.data('lazyload') != undefined && img.data('lazydone') == 1) || img.data('lazyload') === undefined) {
            if (img.data('orgw') != undefined && img.data('orgw') != 0) {
                img.width(img.data('orgw'));
                img.height(img.data('orgh'));
            }
        }

        var fw = opt.width / img.width();
        var fh = opt.height / img.height();


        opt.fw = fw;
        opt.fh = fh;


        if ((img.data('lazyload') != undefined && img.data('lazydone') == 1) || img.data('lazyload') === undefined) {
            if (img.data('orgw') == undefined || img.data('orgw') == 0) {

                img.data('orgw', img.width());
                img.data('orgh', img.height());

            }
        }



        if (opt.fullWidth == "on" && opt.fullScreen != "on") {

            var cow = opt.container.parent().width();
            var coh = opt.container.parent().height();
            var ffh = coh / img.data('orgh');
            var ffw = cow / img.data('orgw');


            if ((img.data('lazyload') != undefined && img.data('lazydone') == 1) || img.data('lazyload') === undefined) {
                img.width(img.width() * ffh);
                img.height(coh);
            }

            if (img.width() < cow) {
                img.width(cow + 50);
                var ffw = img.width() / img.data('orgw');
                img.height(img.data('orgh') * ffw);

            }

            if (img.width() > cow) {
                img.data("fxof", (cow / 2 - img.width() / 2));
                img.css({'position': 'absolute', 'left': img.data('fxof') + "px"});

            }


            if (img.height() <= coh) {
                img.data('fyof', 0);
                img.data("fxof", (cow / 2 - img.width() / 2));
                img.css({'position': 'absolute', 'top': img.data('fyof') + "px", 'left': img.data('fxof') + "px"});

            }


            if (img.height() > coh && img.data('fullwidthcentering') == "on") {
                img.data('fyof', (coh / 2 - img.height() / 2));
                img.data("fxof", (cow / 2 - img.width() / 2));
                img.css({'position': 'absolute', 'top': img.data('fyof') + "px", 'left': img.data('fxof') + "px"});

            }


        } else

        if (opt.fullScreen == "on") {

            var cow = opt.container.parent().width();


            var coh = jQuery(window).height();

            // IF THE DEFAULT GRID IS HIGHER THEN THE CALCULATED SLIDER HEIGHT, WE NEED TO RESIZE THE SLIDER HEIGHT
            var offsety = coh / 2 - (opt.startheight * opt.bh) / 2;
            if (offsety < 0)
                coh = opt.startheight * opt.bh;


            if (opt.fullScreenOffsetContainer != undefined) {
                try {
                    coh = coh - jQuery(opt.fullScreenOffsetContainer).outerHeight(true);
                } catch (e) {
                }
            }


            opt.container.parent().height(coh);
            opt.container.css({'height': '100%'});

            opt.height = coh;


            var ffh = coh / img.data('orgh');
            var ffw = cow / img.data('orgw');


            if ((img.data('lazyload') != undefined && img.data('lazydone') == 1) || img.data('lazyload') === undefined) {
                img.width(img.width() * ffh);
                img.height(coh);
            }


            if (img.width() < cow) {
                img.width(cow + 50);
                var ffw = img.width() / img.data('orgw');
                img.height(img.data('orgh') * ffw);

            }

            if (img.width() > cow) {
                img.data("fxof", (cow / 2 - img.width() / 2));
                img.css({'position': 'absolute', 'left': img.data('fxof') + "px"});

            }


            if (img.height() <= coh) {
                img.data('fyof', 0);
                img.data("fxof", (cow / 2 - img.width() / 2));
                img.css({'position': 'absolute', 'top': img.data('fyof') + "px", 'left': img.data('fxof') + "px"});

            }


            if (img.height() > coh && img.data('fullwidthcentering') == "on") {
                img.data('fyof', (coh / 2 - img.height() / 2));
                img.data("fxof", (cow / 2 - img.width() / 2));
                img.css({'position': 'absolute', 'top': img.data('fyof') + "px", 'left': img.data('fxof') + "px"});

            }


        } else {
            if ((img.data('lazyload') != undefined && img.data('lazydone') == 1) || img.data('lazyload') === undefined) {
                img.width(opt.width);
                img.height(img.height() * fw);
            }

            if (img.height() < opt.height && img.height() != 0 && img.height() != null) {

                if ((img.data('lazyload') != undefined && img.data('lazydone') == 1) || img.data('lazyload') === undefined) {
                    img.height(opt.height);
                    img.width(img.data('orgw') * fh);
                }
            }
        }



        img.data('neww', img.width());
        img.data('newh', img.height());
        if (opt.fullWidth == "on") {
            opt.slotw = Math.ceil(img.width() / opt.slots);
        } else {
            opt.slotw = Math.ceil(opt.width / opt.slots);
        }

        if (opt.fullSreen == "on")
            opt.sloth = Math.ceil(jQuery(window).height() / opt.slots);
        else
            opt.sloth = Math.ceil(opt.height / opt.slots);

    }




    /////////////////////////////////////////
    //	-	PREPARE THE SLIDES / SLOTS -  //
    ///////////////////////////////////////
    function prepareSlides(container, opt) {

        container.find('.tp-caption').each(function() {
            jQuery(this).addClass(jQuery(this).data('transition'));
            jQuery(this).addClass('start')
        });
        // PREPARE THE UL CONTAINER TO HAVEING MAX HEIGHT AND HEIGHT FOR ANY SITUATION
        container.find('>ul:first').css({overflow: 'hidden', width: '100%', height: '100%', maxHeight: container.parent().css('maxHeight')});

        container.find('>ul:first >li').each(function(j) {
            var li = jQuery(this);

            // MAKE LI OVERFLOW HIDDEN FOR FURTHER ISSUES
            li.css({'width': '100%', 'height': '100%', 'overflow': 'hidden'});

            if (li.data('link') != undefined) {
                var link = li.data('link');
                var target = "_self";
                var zindex = 2;
                if (li.data('slideindex') == "back")
                    zindex = 0;

                var linktoslide = li.data('linktoslide');
                if (li.data('target') != undefined)
                    target = li.data('target');

                if (link == "slide") {
                    li.append('<div class="tp-caption sft slidelink" style="z-index:' + zindex + ';" data-x="0" data-y="0" data-linktoslide="' + linktoslide + '" data-start="0"><a><div></div></a></div>');
                } else {
                    linktoslide = "no";
                    li.append('<div class="tp-caption sft slidelink" style="z-index:' + zindex + ';" data-x="0" data-y="0" data-linktoslide="' + linktoslide + '" data-start="0"><a target="' + target + '" href="' + link + '"><div></div></a></div>');
                }

            }
        });

        // RESOLVE OVERFLOW HIDDEN OF MAIN CONTAINER
        container.parent().css({'overflow': 'visible'});


        container.find('>ul:first >li >img').each(function(j) {

            var img = jQuery(this);
            img.addClass('defaultimg');
            if (img.data('lazyload') != undefined && img.data('lazydone') != 1) {
            } else {
                setSize(img, opt);
                setSize(img, opt);
            }
            img.wrap('<div class="slotholder"></div>');
            img.css({'opacity': 0});
            img.data('li-id', j);

        });
    }


    ///////////////////////
    // PREPARE THE SLIDE //
    //////////////////////
    function prepareOneSlide(slotholder, opt, visible) {

        var sh = slotholder;
        var img = sh.find('img')

        setSize(img, opt)
        var src = img.attr('src');
        var bgcolor = img.css('background-color');

        var w = img.data('neww');
        var h = img.data('newh');
        var fulloff = img.data("fxof");
        if (fulloff == undefined)
            fulloff = 0;

        var fullyoff = img.data("fyof");
        if (img.data('fullwidthcentering') != "on" || fullyoff == undefined)
            fullyoff = 0;

        var off = 0;


        if (!visible)
            var off = 0 - opt.slotw;

        for (var i = 0; i < opt.slots; i++)
            sh.append('<div class="slot" style="position:absolute;top:' + (0 + fullyoff) + 'px;left:' + (fulloff + i * opt.slotw) + 'px;overflow:hidden;width:' + opt.slotw + 'px;height:' + h + 'px"><div class="slotslide" style="position:absolute;top:0px;left:' + off + 'px;width:' + opt.slotw + 'px;height:' + h + 'px;overflow:hidden;"><img style="background-color:' + bgcolor + ';position:absolute;top:0px;left:' + (0 - (i * opt.slotw)) + 'px;width:' + w + 'px;height:' + h + 'px" src="' + src + '"></div></div>');

    }


    ///////////////////////
    // PREPARE THE SLIDE //
    //////////////////////
    function prepareOneSlideV(slotholder, opt, visible) {

        var sh = slotholder;
        var img = sh.find('img')
        setSize(img, opt)
        var src = img.attr('src');
        var bgcolor = img.css('background-color');
        var w = img.data('neww');
        var h = img.data('newh');
        var fulloff = img.data("fxof");
        if (fulloff == undefined)
            fulloff = 0;

        var fullyoff = img.data("fyof");
        if (img.data('fullwidthcentering') != "on" || fullyoff == undefined)
            fullyoff = 0;

        var off = 0;



        if (!visible)
            var off = 0 - opt.sloth;

        //alert(fullyoff+"  "+opt.sloth+" "opt.slots+"  "+)

        for (var i = 0; i < opt.slots + 2; i++)
            sh.append('<div class="slot" style="position:absolute;' +
                    'top:' + (fullyoff + (i * opt.sloth)) + 'px;' +
                    'left:' + (fulloff) + 'px;' +
                    'overflow:hidden;' +
                    'width:' + w + 'px;' +
                    'height:' + (opt.sloth) + 'px"' +
                    '><div class="slotslide" style="position:absolute;' +
                    'top:' + (off) + 'px;' +
                    'left:0px;width:' + w + 'px;' +
                    'height:' + opt.sloth + 'px;' +
                    'overflow:hidden;"><img style="position:absolute;' +
                    'background-color:' + bgcolor + ';' +
                    'top:' + (0 - (i * opt.sloth)) + 'px;' +
                    'left:0px;width:' + w + 'px;' +
                    'height:' + h + 'px" src="' + src + '"></div></div>');

    }


    ///////////////////////
    // PREPARE THE SLIDE //
    //////////////////////
    function prepareOneSlideBox(slotholder, opt, visible) {

        var sh = slotholder;
        var img = sh.find('img')
        setSize(img, opt)
        var src = img.attr('src');
        var bgcolor = img.css('background-color');

        var w = img.data('neww');
        var h = img.data('newh');
        var fulloff = img.data("fxof");
        if (fulloff == undefined)
            fulloff = 0;

        var fullyoff = img.data("fyof");
        if (img.data('fullwidthcentering') != "on" || fullyoff == undefined)
            fullyoff = 0;



        var off = 0;




        // SET THE MINIMAL SIZE OF A BOX
        var basicsize = 0;
        if (opt.sloth > opt.slotw)
            basicsize = opt.sloth
        else
            basicsize = opt.slotw;


        if (!visible) {
            var off = 0 - basicsize;
        }

        opt.slotw = basicsize;
        opt.sloth = basicsize;
        var x = 0;
        var y = 0;



        for (var j = 0; j < opt.slots; j++) {

            y = 0;
            for (var i = 0; i < opt.slots; i++) {


                sh.append('<div class="slot" ' +
                        'style="position:absolute;' +
                        'top:' + (fullyoff + y) + 'px;' +
                        'left:' + (fulloff + x) + 'px;' +
                        'width:' + basicsize + 'px;' +
                        'height:' + basicsize + 'px;' +
                        'overflow:hidden;">' +
                        '<div class="slotslide" data-x="' + x + '" data-y="' + y + '" ' +
                        'style="position:absolute;' +
                        'top:' + (0) + 'px;' +
                        'left:' + (0) + 'px;' +
                        'width:' + basicsize + 'px;' +
                        'height:' + basicsize + 'px;' +
                        'overflow:hidden;">' +
                        '<img style="position:absolute;' +
                        'top:' + (0 - y) + 'px;' +
                        'left:' + (0 - x) + 'px;' +
                        'width:' + w + 'px;' +
                        'height:' + h + 'px' +
                        'background-color:' + bgcolor + ';"' +
                        'src="' + src + '"></div></div>');
                y = y + basicsize;
            }
            x = x + basicsize;
        }
    }





    ///////////////////////
    //	REMOVE SLOTS	//
    /////////////////////
    function removeSlots(container, opt, time) {
        if (time == undefined)
            time == 80

        setTimeout(function() {
            container.find('.slotholder .slot').each(function() {
                clearTimeout(jQuery(this).data('tout'));
                jQuery(this).remove();
            });
            opt.transition = 0;
        }, time);
    }


    ////////////////////////
    //	CAPTION POSITION  //
    ///////////////////////
    function setCaptionPositions(container, opt) {

        // FIND THE RIGHT CAPTIONS
        var actli = container.find('>li:eq(' + opt.act + ')');
        var nextli = container.find('>li:eq(' + opt.next + ')');

        // SET THE NEXT CAPTION AND REMOVE THE LAST CAPTION
        var nextcaption = nextli.find('.tp-caption');

        if (nextcaption.find('iframe') == 0) {

            // MOVE THE CAPTIONS TO THE RIGHT POSITION
            if (nextcaption.hasClass('hcenter'))
                nextcaption.css({'height': opt.height + "px", 'top': '0px', 'left': (opt.width / 2 - nextcaption.outerWidth() / 2) + 'px'});
            else
            if (nextcaption.hasClass('vcenter'))
                nextcaption.css({'width': opt.width + "px", 'left': '0px', 'top': (opt.height / 2 - nextcaption.outerHeight() / 2) + 'px'});
        }
    }


    //////////////////////////////
    //                         //
    //	-	SWAP THE SLIDES -  //
    //                        //
    ////////////////////////////
    function swapSlide(container, opt) {
        try {
            var actli = container.find('>ul:first-child >li:eq(' + opt.act + ')');
        } catch (e) {
            var actli = container.find('>ul:first-child >li:eq(1)');
        }
        opt.lastslide = opt.act;
        var nextli = container.find('>ul:first-child >li:eq(' + opt.next + ')');

        var defimg = nextli.find('.defaultimg');

        if (defimg.data('lazyload') != undefined && defimg.data('lazydone') != 1) {
            defimg.attr('src', nextli.find('.defaultimg').data('lazyload')),
                    defimg.data('lazydone', 1);
            defimg.data('orgw', 0);
            container.find('.tp-loader').fadeIn(300);
            setTimeout(function() {
                killBannerTimer(opt, container)
            }, 180);


            nextli.waitForImages(function() {
                restartBannerTimer(opt, container)
                setSize(defimg, opt);
                setBulPos(container, opt);
                setSize(defimg, opt);
                swapSlideProgress(container, opt);
                container.find('.tp-loader').fadeOut(300);
            });

        } else {
            swapSlideProgress(container, opt);
        }
    }


    function swapSlideProgress(container, opt) {


        container.trigger('revolution.slide.onbeforeswap');


        opt.transition = 1;
        opt.videoplaying = false;
        //console.log("VideoPlay set to False due swapSlideProgress");

        try {
            var actli = container.find('>ul:first-child >li:eq(' + opt.act + ')');
        } catch (e) {
            var actli = container.find('>ul:first-child >li:eq(1)');
        }

        opt.lastslide = opt.act;

        var nextli = container.find('>ul:first-child >li:eq(' + opt.next + ')');

        var actsh = actli.find('.slotholder');
        var nextsh = nextli.find('.slotholder');
        actli.css({'visibility': 'visible'});
        nextli.css({'visibility': 'visible'});

        if (opt.ie) {
            if (comingtransition == "boxfade")
                comingtransition = "boxslide";
            if (comingtransition == "slotfade-vertical")
                comingtransition = "slotzoom-vertical";
            if (comingtransition == "slotfade-horizontal")
                comingtransition = "slotzoom-horizontal";
        }


        // IF DELAY HAS BEEN SET VIA THE SLIDE, WE TAKE THE NEW VALUE, OTHER WAY THE OLD ONE...
        if (nextli.data('delay') != undefined) {
            opt.cd = 0;
            opt.delay = nextli.data('delay');
        } else {
            opt.delay = opt.origcd;
        }

        // RESET POSITION AND FADES OF LI'S
        actli.css({'left': '0px', 'top': '0px'});
        nextli.css({'left': '0px', 'top': '0px'});


        // IF THERE IS AN OTHER FIRST SLIDE START HAS BEED SELECTED
        if (nextli.data('differentissplayed') == 'prepared') {
            nextli.data('differentissplayed', 'done');
            nextli.data('transition', nextli.data('savedtransition'));
            nextli.data('slotamount', nextli.data('savedslotamount'));
            nextli.data('masterspeed', nextli.data('savedmasterspeed'));
        }


        if (nextli.data('fstransition') != undefined && nextli.data('differentissplayed') != "done") {
            nextli.data('savedtransition', nextli.data('transition'));
            nextli.data('savedslotamount', nextli.data('slotamount'));
            nextli.data('savedmasterspeed', nextli.data('masterspeed'));

            nextli.data('transition', nextli.data('fstransition'));
            nextli.data('slotamount', nextli.data('fsslotamount'));
            nextli.data('masterspeed', nextli.data('fsmasterspeed'));

            nextli.data('differentissplayed', 'prepared');
        }

        ///////////////////////////////////////
        // TRANSITION CHOOSE - RANDOM EFFECTS//
        ///////////////////////////////////////
        var nexttrans = 0;


        var transtext = nextli.data('transition').split(",");
        var curtransid = nextli.data('nexttransid');
        if (curtransid == undefined) {
            curtransid = 0;
            nextli.data('nexttransid', curtransid);
        } else {
            curtransid = curtransid + 1;
            if (curtransid == transtext.length)
                curtransid = 0;
            nextli.data('nexttransid', curtransid);

        }



        var comingtransition = transtext[curtransid];

        if (comingtransition == "boxslide")
            nexttrans = 0
        else
        if (comingtransition == "boxfade")
            nexttrans = 1
        else
        if (comingtransition == "slotslide-horizontal")
            nexttrans = 2
        else
        if (comingtransition == "slotslide-vertical")
            nexttrans = 3
        else
        if (comingtransition == "curtain-1")
            nexttrans = 4
        else
        if (comingtransition == "curtain-2")
            nexttrans = 5
        else
        if (comingtransition == "curtain-3")
            nexttrans = 6
        else
        if (comingtransition == "slotzoom-horizontal")
            nexttrans = 7
        else
        if (comingtransition == "slotzoom-vertical")
            nexttrans = 8
        else
        if (comingtransition == "slotfade-horizontal")
            nexttrans = 9
        else
        if (comingtransition == "slotfade-vertical")
            nexttrans = 10
        else
        if (comingtransition == "fade")
            nexttrans = 11
        else
        if (comingtransition == "slideleft")
            nexttrans = 12
        else
        if (comingtransition == "slideup")
            nexttrans = 13
        else
        if (comingtransition == "slidedown")
            nexttrans = 14
        else
        if (comingtransition == "slideright")
            nexttrans = 15;
        else
        if (comingtransition == "papercut")
            nexttrans = 16;
        else
        if (comingtransition == "3dcurtain-horizontal")
            nexttrans = 17;
        else
        if (comingtransition == "3dcurtain-vertical")
            nexttrans = 18;
        else
        if (comingtransition == "cubic" || comingtransition == "cube")
            nexttrans = 19;
        else
        if (comingtransition == "flyin")
            nexttrans = 20;
        else
        if (comingtransition == "turnoff")
            nexttrans = 21;
        else {
            nexttrans = Math.round(Math.random() * 21);
            nextli.data('slotamount', Math.round(Math.random() * 12 + 4));
        }

        if (comingtransition == "random-static") {
            nexttrans = Math.round(Math.random() * 16);
            if (nexttrans > 15)
                nexttrans = 15;
            if (nexttrans < 0)
                nexttrans = 0;
        }

        if (comingtransition == "random-premium") {
            nexttrans = Math.round(Math.random() * 6 + 16);
            if (nexttrans > 21)
                nexttrans = 21;
            if (nexttrans < 16)
                nexttrans = 16;
        }



        var direction = -1;
        if (opt.leftarrowpressed == 1 || opt.act > opt.next)
            direction = 1;

        if (comingtransition == "slidehorizontal") {
            nexttrans = 12
            if (opt.leftarrowpressed == 1)
                nexttrans = 15
        }

        if (comingtransition == "slidevertical") {
            nexttrans = 13
            if (opt.leftarrowpressed == 1)
                nexttrans = 14
        }

        opt.leftarrowpressed = 0;



        if (nexttrans > 21)
            nexttrans = 21;
        if (nexttrans < 0)
            nexttrans = 0;

        if ((opt.ie || opt.ie9) && nexttrans > 18) {
            nexttrans = Math.round(Math.random() * 16);
            nextli.data('slotamount', Math.round(Math.random() * 12 + 4));
        }
        ;
        if (opt.ie && (nexttrans == 17 || nexttrans == 16 || nexttrans == 2 || nexttrans == 3 || nexttrans == 9 || nexttrans == 10))
            nexttrans = Math.round(Math.random() * 3 + 12);


        if (opt.ie9 && (nexttrans == 3))
            nexttrans = 4;




        //jQuery('body').find('.debug').html("Transition:"+nextli.data('transition')+"  id:"+nexttrans);

        // DEFINE THE MASTERSPEED FOR THE SLIDE //
        var masterspeed = 300;
        if (nextli.data('masterspeed') != undefined && nextli.data('masterspeed') > 99 && nextli.data('masterspeed') < 4001)
            masterspeed = nextli.data('masterspeed');



        /////////////////////////////////////////////
        // SET THE BULLETS SELECTED OR UNSELECTED  //
        /////////////////////////////////////////////


        container.parent().find(".bullet").each(function() {
            var bul = jQuery(this);
            bul.removeClass("selected");


            if (opt.navigationArrows == "withbullet" || opt.navigationArrows == "nexttobullets") {
                if (bul.index() - 1 == opt.next)
                    bul.addClass('selected');

            } else {

                if (bul.index() == opt.next)
                    bul.addClass('selected');

            }
        });


        //////////////////////////////////////////////////////////////////
        // 		SET THE NEXT CAPTION AND REMOVE THE LAST CAPTION		//
        //////////////////////////////////////////////////////////////////

        container.find('>li').each(function() {
            var li = jQuery(this);
            if (li.index != opt.act && li.index != opt.next)
                li.css({'z-index': 16});
        });

        actli.css({'z-index': 18});
        nextli.css({'z-index': 20});
        nextli.css({'opacity': 0});


        ///////////////////////////
        //	ANIMATE THE CAPTIONS //
        ///////////////////////////
        if (actli.index() != nextli.index()) {
            removeTheCaptions(actli, opt);

        }
        animateTheCaptions(nextli, opt);




        /////////////////////////////////////////////
        //	SET THE ACTUAL AMOUNT OF SLIDES !!     //
        //  SET A RANDOM AMOUNT OF SLOTS          //
        ///////////////////////////////////////////
        if (nextli.data('slotamount') == undefined || nextli.data('slotamount') < 1) {
            opt.slots = Math.round(Math.random() * 12 + 4);
            if (comingtransition == "boxslide")
                opt.slots = Math.round(Math.random() * 6 + 3);
        } else {
            opt.slots = nextli.data('slotamount');

        }

        /////////////////////////////////////////////
        //	SET THE ACTUAL AMOUNT OF SLIDES !!     //
        //  SET A RANDOM AMOUNT OF SLOTS          //
        ///////////////////////////////////////////
        if (nextli.data('rotate') == undefined)
            opt.rotate = 0
        else
        if (nextli.data('rotate') == 999)
            opt.rotate = Math.round(Math.random() * 360);
        else
            opt.rotate = nextli.data('rotate');
        if (!jQuery.support.transition || opt.ie || opt.ie9)
            opt.rotate = 0;



        //////////////////////////////
        //	FIRST START 			//
        //////////////////////////////

        if (opt.firststart == 1) {
            actli.css({'opacity': 0});
            opt.firststart = 0;
        }


        /////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION I.  //
        ////////////////////////////////////
        if (nexttrans == 0) {								// BOXSLIDE

            masterspeed = masterspeed + 100;
            if (opt.slots > 10)
                opt.slots = 10;

            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlideBox(actsh, opt, true);
            prepareOneSlideBox(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT


            nextsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                if (opt.ie9)
                    ss.transition({top: (0 - opt.sloth), left: (0 - opt.slotw)}, 0);
                else
                    ss.transition({top: (0 - opt.sloth), left: (0 - opt.slotw), rotate: opt.rotate}, 0);
                setTimeout(function() {
                    ss.transition({top: 0, left: 0, scale: 1, rotate: 0}, masterspeed * 1.5, function() {

                        if (j == (opt.slots * opt.slots) - 1) {
                            removeSlots(container, opt);
                            nextsh.find('.defaultimg').css({'opacity': 1});

                            if (nextli.index() != actli.index())
                                actsh.find('.defaultimg').css({'opacity': 0});
                            opt.act = opt.next;
                            moveSelectedThumb(container);

                        }
                    });
                }, j * 15);
            });
        }



        /////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION I.  //
        ////////////////////////////////////
        if (nexttrans == 1) {


            if (opt.slots > 5)
                opt.slots = 5;
            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            //prepareOneSlideBox(actsh,opt,true);
            prepareOneSlideBox(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT

            nextsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                ss.css({'opacity': 0});
                ss.find('img').css({'opacity': 0});
                if (opt.ie9)
                    ss.find('img').transition({'top': (Math.random() * opt.slotw - opt.slotw) + "px", 'left': (Math.random() * opt.slotw - opt.slotw) + "px"}, 0);
                else
                    ss.find('img').transition({'top': (Math.random() * opt.slotw - opt.slotw) + "px", 'left': (Math.random() * opt.slotw - opt.slotw) + "px", rotate: opt.rotate}, 0);

                var rand = Math.random() * 1000 + (masterspeed + 200);
                if (j == (opt.slots * opt.slots) - 1)
                    rand = 1500;

                ss.find('img').transition({'opacity': 1, 'top': (0 - ss.data('y')) + "px", 'left': (0 - ss.data('x')) + 'px', rotate: 0}, rand);
                ss.transition({'opacity': 1}, rand, function() {
                    if (j == (opt.slots * opt.slots) - 1) {
                        removeSlots(container, opt);
                        nextsh.find('.defaultimg').css({'opacity': 1});
                        if (nextli.index() != actli.index())
                            actsh.find('.defaultimg').css({'opacity': 0});
                        opt.act = opt.next;

                        moveSelectedThumb(container);
                    }

                });


            });
        }


        /////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION I.  //
        ////////////////////////////////////
        if (nexttrans == 2) {


            masterspeed = masterspeed + 200;

            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlide(actsh, opt, true);
            prepareOneSlide(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});


            // ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
            actsh.find('.slotslide').each(function() {
                var ss = jQuery(this);


                //ss.animate({'left':opt.slotw+'px'},{duration:masterspeed,queue:false,complete:function() {
                ss.transit({'left': opt.slotw + 'px', rotate: (0 - opt.rotate)}, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});
                    opt.act = opt.next;
                    moveSelectedThumb(container);

                });

            });

            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            nextsh.find('.slotslide').each(function() {
                var ss = jQuery(this);
                if (opt.ie9)
                    ss.transit({'left': (0 - opt.slotw) + "px"}, 0);
                else
                    ss.transit({'left': (0 - opt.slotw) + "px", rotate: opt.rotate}, 0);

                ss.transit({'left': '0px', rotate: 0}, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});
                    if (opt.ie)
                        actsh.find('.defaultimg').css({'opacity': 1});
                    opt.act = opt.next;

                    moveSelectedThumb(container);

                });

            });
        }



        /////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION I.  //
        ////////////////////////////////////
        if (nexttrans == 3) {


            masterspeed = masterspeed + 200;
            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlideV(actsh, opt, true);
            prepareOneSlideV(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});

            // ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
            actsh.find('.slotslide').each(function() {
                var ss = jQuery(this);

                ss.transit({'top': opt.sloth + 'px', rotate: opt.rotate}, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});
                    opt.act = opt.next;
                    moveSelectedThumb(container);

                });

            });

            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            nextsh.find('.slotslide').each(function() {
                var ss = jQuery(this);
                if (opt.ie9)
                    ss.transit({'top': (0 - opt.sloth) + "px"}, 0);
                else
                    ss.transit({'top': (0 - opt.sloth) + "px", rotate: opt.rotate}, 0);
                ss.transit({'top': '0px', rotate: 0}, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});
                    opt.act = opt.next;
                    moveSelectedThumb(container);

                });

            });
        }



        /////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION I.  //
        ////////////////////////////////////
        if (nexttrans == 4) {



            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlide(actsh, opt, true);
            prepareOneSlide(nextsh, opt, true);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            actsh.find('.defaultimg').css({'opacity': 0});


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            actsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);

                ss.transit({'top': (0 + (opt.height)) + "px", 'opacity': 1, rotate: opt.rotate}, masterspeed + (i * (70 - opt.slots)));
            });

            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);
                if (opt.ie9)
                    ss.transition({'top': (0 - (opt.height)) + "px", 'opacity': 0}, 0);
                else
                    ss.transition({'top': (0 - (opt.height)) + "px", 'opacity': 0, rotate: opt.rotate}, 0);

                ss.transition({'top': '0px', 'opacity': 1, rotate: 0}, masterspeed + (i * (70 - opt.slots)), function() {
                    if (i == opt.slots - 1) {
                        removeSlots(container, opt);
                        nextsh.find('.defaultimg').css({'opacity': 1});
                        if (nextli.index() != actli.index())
                            actsh.find('.defaultimg').css({'opacity': 0});
                        opt.act = opt.next;
                        moveSelectedThumb(container);
                    }

                });

            });
        }


        /////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION I.  //
        ////////////////////////////////////
        if (nexttrans == 5) {



            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlide(actsh, opt, true);
            prepareOneSlide(nextsh, opt, true);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            actsh.find('.defaultimg').css({'opacity': 0});

            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            actsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);

                ss.transition({'top': (0 + (opt.height)) + "px", 'opacity': 1, rotate: opt.rotate}, masterspeed + ((opt.slots - i) * (70 - opt.slots)));

            });

            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);
                if (opt.ie9)
                    ss.transition({'top': (0 - (opt.height)) + "px", 'opacity': 0}, 0);
                else
                    ss.transition({'top': (0 - (opt.height)) + "px", 'opacity': 0, rotate: opt.rotate}, 0);

                ss.transition({'top': '0px', 'opacity': 1, rotate: 0}, masterspeed + ((opt.slots - i) * (70 - opt.slots)), function() {
                    if (i == 0) {
                        removeSlots(container, opt);
                        nextsh.find('.defaultimg').css({'opacity': 1});
                        if (nextli.index() != actli.index())
                            actsh.find('.defaultimg').css({'opacity': 0});
                        opt.act = opt.next;
                        moveSelectedThumb(container);
                    }

                });

            });
        }


        /////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION I.  //
        ////////////////////////////////////
        if (nexttrans == 6) {



            nextli.css({'opacity': 1});
            if (opt.slots < 2)
                opt.slots = 2;
            // PREPARE THE SLOTS HERE
            prepareOneSlide(actsh, opt, true);
            prepareOneSlide(nextsh, opt, true);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            actsh.find('.defaultimg').css({'opacity': 0});


            actsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);

                if (i < opt.slots / 2)
                    var tempo = (i + 2) * 60;
                else
                    var tempo = (2 + opt.slots - i) * 60;


                ss.transition({'top': (0 + (opt.height)) + "px", 'opacity': 1}, masterspeed + tempo);

            });

            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);
                if (opt.ie9)
                    ss.transition({'top': (0 - (opt.height)) + "px", 'opacity': 0}, 0);
                else
                    ss.transition({'top': (0 - (opt.height)) + "px", 'opacity': 0, rotate: opt.rotate}, 0);
                if (i < opt.slots / 2)
                    var tempo = (i + 2) * 60;
                else
                    var tempo = (2 + opt.slots - i) * 60;


                ss.transition({'top': '0px', 'opacity': 1, rotate: 0}, masterspeed + tempo, function() {
                    if (i == Math.round(opt.slots / 2)) {
                        removeSlots(container, opt);
                        nextsh.find('.defaultimg').css({'opacity': 1});
                        if (nextli.index() != actli.index())
                            actsh.find('.defaultimg').css({'opacity': 0});
                        opt.act = opt.next;
                        moveSelectedThumb(container);
                    }

                });

            });
        }


        ////////////////////////////////////
        // THE SLOTSZOOM - TRANSITION II. //
        ////////////////////////////////////
        if (nexttrans == 7) {

            masterspeed = masterspeed * 3;
            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlide(actsh, opt, true);
            prepareOneSlide(nextsh, opt, true);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});

            // ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
            actsh.find('.slotslide').each(function() {
                var ss = jQuery(this).find('img');

                ss.transition({'left': (0 - opt.slotw / 2) + 'px',
                    'top': (0 - opt.height / 2) + 'px',
                    'width': (opt.slotw * 2) + "px",
                    'height': (opt.height * 2) + "px",
                    opacity: 0,
                    rotate: opt.rotate
                }, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});
                    opt.act = opt.next;
                    moveSelectedThumb(container);
                });

            });

            /						//////////////////////////////////////////////////////////////
            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT //
            ///////////////////////////////////////////////////////////////
            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this).find('img');

                if (opt.ie9)
                    ss.transition({'left': (0) + 'px', 'top': (0) + 'px', opacity: 0}, 0);
                else
                    ss.transition({'left': (0) + 'px', 'top': (0) + 'px', opacity: 0, rotate: opt.rotate}, 0);
                ss.transition({'left': (0 - i * opt.slotw) + 'px',
                    'top': (0) + 'px',
                    'width': (nextsh.find('.defaultimg').data('neww')) + "px",
                    'height': (nextsh.find('.defaultimg').data('newh')) + "px",
                    opacity: 1, rotate: 0

                }, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});
                    opt.act = opt.next;
                    moveSelectedThumb(container);
                });


            });
        }




        ////////////////////////////////////
        // THE SLOTSZOOM - TRANSITION II. //
        ////////////////////////////////////
        if (nexttrans == 8) {

            masterspeed = masterspeed * 3;
            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlideV(actsh, opt, true);
            prepareOneSlideV(nextsh, opt, true);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});

            // ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
            actsh.find('.slotslide').each(function() {
                var ss = jQuery(this).find('img');

                ss.transition({'left': (0 - opt.width / 2) + 'px',
                    'top': (0 - opt.sloth / 2) + 'px',
                    'width': (opt.width * 2) + "px",
                    'height': (opt.sloth * 2) + "px",
                    opacity: 0, rotate: opt.rotate
                }, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});

                    opt.act = opt.next;
                    moveSelectedThumb(container);
                });

            });


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT //
            ///////////////////////////////////////////////////////////////
            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this).find('img');
                if (opt.ie9)
                    ss.transition({'left': (0) + 'px', 'top': (0) + 'px', opacity: 0}, 0);
                else
                    ss.transition({'left': (0) + 'px', 'top': (0) + 'px', opacity: 0, rotate: opt.rotate}, 0);
                ss.transition({'left': (0) + 'px',
                    'top': (0 - i * opt.sloth) + 'px',
                    'width': (nextsh.find('.defaultimg').data('neww')) + "px",
                    'height': (nextsh.find('.defaultimg').data('newh')) + "px",
                    opacity: 1, rotate: 0
                }, masterspeed, function() {
                    removeSlots(container, opt);
                    nextsh.find('.defaultimg').css({'opacity': 1});
                    if (nextli.index() != actli.index())
                        actsh.find('.defaultimg').css({'opacity': 0});

                    opt.act = opt.next;
                    moveSelectedThumb(container);
                });

            });
        }


        ////////////////////////////////////////
        // THE SLOTSFADE - TRANSITION III.   //
        //////////////////////////////////////
        if (nexttrans == 9) {



            nextli.css({'opacity': 1});

            opt.slots = opt.width / 20;

            prepareOneSlide(nextsh, opt, true);


            //actsh.find('.defaultimg').css({'opacity':0});
            nextsh.find('.defaultimg').css({'opacity': 0});

            var ssamount = 0;
            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);
                ssamount++;
                ss.transition({'opacity': 0, x: 0, y: 0}, 0);
                ss.data('tout', setTimeout(function() {
                    ss.transition({x: 0, y: 0, 'opacity': 1}, masterspeed);

                }, i * 4)
                        );

            });

            //nextsh.find('.defaultimg').transition({'opacity':1},(masterspeed+(ssamount*4)));

            setTimeout(function() {
                removeSlots(container, opt);
                nextsh.find('.defaultimg').css({'opacity': 1});
                if (nextli.index() != actli.index())
                    actsh.find('.defaultimg').css({'opacity': 0});
                if (opt.ie)
                    actsh.find('.defaultimg').css({'opacity': 1});

                opt.act = opt.next;
                moveSelectedThumb(container);
            }, (masterspeed + (ssamount * 4)));
        }




        ////////////////////////////////////////
        // THE SLOTSFADE - TRANSITION III.   //
        //////////////////////////////////////
        if (nexttrans == 10) {



            nextli.css({'opacity': 1});

            opt.slots = opt.height / 20;

            prepareOneSlideV(nextsh, opt, true);


            //actsh.find('.defaultimg').css({'opacity':0});
            nextsh.find('.defaultimg').css({'opacity': 0});

            var ssamount = 0;
            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);
                ssamount++;
                ss.transition({'opacity': 0, x: 0, y: 0}, 0);
                ss.data('tout', setTimeout(function() {
                    ss.transition({x: 0, y: 0, 'opacity': 1}, masterspeed);

                }, i * 4)
                        );

            });

            //nextsh.find('.defaultimg').transition({'opacity':1},(masterspeed+(ssamount*4)));

            setTimeout(function() {
                removeSlots(container, opt);
                nextsh.find('.defaultimg').css({'opacity': 1});
                if (nextli.index() != actli.index())
                    actsh.find('.defaultimg').css({'opacity': 0});
                if (opt.ie)
                    actsh.find('.defaultimg').css({'opacity': 1});

                opt.act = opt.next;
                moveSelectedThumb(container);
            }, (masterspeed + (ssamount * 4)));
        }


        ///////////////////////////
        // SIMPLE FADE ANIMATION //
        ///////////////////////////

        if (nexttrans == 11) {



            nextli.css({'opacity': 1});

            opt.slots = 1;

            prepareOneSlide(nextsh, opt, true);


            //actsh.find('.defaultimg').css({'opacity':0});
            nextsh.find('.defaultimg').css({'opacity': 0, 'position': 'relative'});

            var ssamount = 0;
            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT

            nextsh.find('.slotslide').each(function(i) {
                var ss = jQuery(this);
                ssamount++;

                if (opt.ie9 || opt.ie) {
                    if (opt.ie)
                        nextli.css({'opacity': '0'});
                    ss.css({'opacity': 0});

                } else
                    ss.transition({'opacity': 0, rotate: opt.rotate}, 0);


                setTimeout(function() {
                    if (opt.ie9 || opt.ie) {
                        if (opt.ie)
                            nextli.animate({'opacity': 1}, {duration: masterspeed});
                        else
                            ss.transition({'opacity': 1}, masterspeed);

                    } else {
                        ss.transition({'opacity': 1, rotate: 0}, masterspeed);
                    }
                }, 10);
            });

            setTimeout(function() {
                removeSlots(container, opt);
                nextsh.find('.defaultimg').css({'opacity': 1});
                if (nextli.index() != actli.index())
                    actsh.find('.defaultimg').css({'opacity': 0});
                if (opt.ie)
                    actsh.find('.defaultimg').css({'opacity': 1});

                opt.act = opt.next;
                moveSelectedThumb(container);
            }, masterspeed + 15);
        }






        if (nexttrans == 12 || nexttrans == 13 || nexttrans == 14 || nexttrans == 15) {

            masterspeed = masterspeed * 3;
            nextli.css({'opacity': 1});

            opt.slots = 1;

            prepareOneSlide(nextsh, opt, true);
            prepareOneSlide(actsh, opt, true);


            actsh.find('.defaultimg').css({'opacity': 0});
            nextsh.find('.defaultimg').css({'opacity': 0});

            var oow = opt.width;
            var ooh = opt.height;


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
            var ssn = nextsh.find('.slotslide')

            if (opt.fullWidth == "on" || opt.fullSreen == "on") {
                oow = ssn.width();
                ooh = ssn.height();
            }

            if (nexttrans == 12)
                if (opt.ie9) {
                    ssn.transition({'left': oow + "px"}, 0);

                } else {
                    ssn.transition({'left': oow + "px", rotate: opt.rotate}, 0);

                }
            else
            if (nexttrans == 15)
                if (opt.ie9)
                    ssn.transition({'left': (0 - oow) + "px"}, 0);
                else
                    ssn.transition({'left': (0 - oow) + "px", rotate: opt.rotate}, 0);
            else
            if (nexttrans == 13)
                if (opt.ie9)
                    ssn.transition({'top': (ooh) + "px"}, 0);
                else
                    ssn.transition({'top': (ooh) + "px", rotate: opt.rotate}, 0);
            else
            if (nexttrans == 14)
                if (opt.ie9)
                    ssn.transition({'top': (0 - ooh) + "px"}, 0);
                else
                    ssn.transition({'top': (0 - ooh) + "px", rotate: opt.rotate}, 0);


            ssn.transition({'left': '0px', 'top': '0px', opacity: 1, rotate: 0}, masterspeed, function() {


                removeSlots(container, opt, 0);
                if (nextli.index() != actli.index())
                    actsh.find('.defaultimg').css({'opacity': 0});
                nextsh.find('.defaultimg').css({'opacity': 1});
                opt.act = opt.next;
                moveSelectedThumb(container);
            });



            var ssa = actsh.find('.slotslide');

            if (nexttrans == 12)
                ssa.transition({'left': (0 - oow) + 'px', opacity: 1, rotate: 0}, masterspeed);
            else
            if (nexttrans == 15)
                ssa.transition({'left': (oow) + 'px', opacity: 1, rotate: 0}, masterspeed);
            else
            if (nexttrans == 13)
                ssa.transition({'top': (0 - ooh) + 'px', opacity: 1, rotate: 0}, masterspeed);
            else
            if (nexttrans == 14)
                ssa.transition({'top': (ooh) + 'px', opacity: 1, rotate: 0}, masterspeed);



        }


        //////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION XVI.  //
        //////////////////////////////////////
        if (nexttrans == 16) {						// PAPERCUT

            actli.css({'position': 'absolute', 'z-index': 20});
            nextli.css({'position': 'absolute', 'z-index': 15});
            // PREPARE THE CUTS
            actli.wrapInner('<div class="tp-half-one"></div>');
            actli.find('.tp-half-one').clone(true).appendTo(actli).addClass("tp-half-two");
            actli.find('.tp-half-two').removeClass('tp-half-one');
            actli.find('.tp-half-two').wrapInner('<div class="tp-offset"></div>');

            var oow = opt.width;
            var ooh = opt.height;
            if (opt.fullWidth == "on" || opt.fullSreen == "on") {
                oow = opt.container.parent().width();
                ooh = opt.container.parent().height();
            }


            // ANIMATE THE CUTS
            var img = actli.find('.defaultimg');
            if (img.length > 0 && img.data("fullwidthcentering") == "on") {
                var imgh = ooh / 2;
                var to = img.position().top;
            } else {

                var imgh = ooh / 2;
                var to = 0;
            }
            actli.find('.tp-half-one').css({'width': oow + "px", 'height': (to + imgh) + "px", 'overflow': 'hidden', 'position': 'absolute', 'top': '0px', 'left': '0px'});
            actli.find('.tp-half-two').css({'width': oow + "px", 'height': (to + imgh) + "px", 'overflow': 'hidden', 'position': 'absolute', 'top': (to + imgh) + 'px', 'left': '0px'});
            actli.find('.tp-half-two .tp-offset').css({'position': 'absolute', 'top': (0 - imgh - to) + 'px', 'left': '0px'});




            // Delegate .transition() calls to .animate()
            // if the browser can't do CSS transitions.
            if (!jQuery.support.transition) {

                actli.find('.tp-half-one').animate({'opacity': 0, 'top': (0 - ooh / 2) + "px"}, {duration: 500, queue: false});
                actli.find('.tp-half-two').animate({'opacity': 0, 'top': (ooh) + "px"}, {duration: 500, queue: false});
            } else {
                var ro1 = Math.round(Math.random() * 40 - 20);
                var ro2 = Math.round(Math.random() * 40 - 20);
                var sc1 = Math.random() * 1 + 1;
                var sc2 = Math.random() * 1 + 1;
                actli.find('.tp-half-one').transition({opacity: 1, scale: sc1, rotate: ro1, y: (0 - ooh / 1.4) + "px"}, 800, 'in');
                actli.find('.tp-half-two').transition({opacity: 1, scale: sc2, rotate: ro2, y: (0 + ooh / 1.4) + "px"}, 800, 'in');

                if (actli.html() != null)
                    nextli.transition({scale: 0.8, x: opt.width * 0.1, y: ooh * 0.1, rotate: ro1}, 0).transition({rotate: 0, scale: 1, x: 0, y: 0}, 600, 'snap');
            }
            nextsh.find('.defaultimg').css({'opacity': 1});
            setTimeout(function() {


                // CLEAN UP BEFORE WE START
                actli.css({'position': 'absolute', 'z-index': 18});
                nextli.css({'position': 'absolute', 'z-index': 20});
                nextsh.find('.defaultimg').css({'opacity': 1});
                actsh.find('.defaultimg').css({'opacity': 0});
                if (actli.find('.tp-half-one').length > 0) {
                    actli.find('.tp-half-one >img, .tp-half-one >div').unwrap();

                }
                actli.find('.tp-half-two').remove();
                opt.transition = 0;
                opt.act = opt.next;

            }, 800);
            nextli.css({'opacity': 1});

        }

        ////////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION XVII.  //
        ///////////////////////////////////////
        if (nexttrans == 17) {								// 3D CURTAIN HORIZONTAL

            masterspeed = masterspeed + 100;
            if (opt.slots > 10)
                opt.slots = 10;

            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlideV(actsh, opt, true);
            prepareOneSlideV(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT


            nextsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                ss.transition({opacity: 0, rotateY: 350, rotateX: 40, perspective: '1400px'}, 0);
                setTimeout(function() {
                    ss.transition({opacity: 1, top: 0, left: 0, scale: 1, perspective: '150px', rotate: 0, rotateY: 0, rotateX: 0}, masterspeed * 2, function() {

                        if (j == opt.slots - 1) {
                            removeSlots(container, opt);
                            nextsh.find('.defaultimg').css({'opacity': 1});

                            if (nextli.index() != actli.index())
                                actsh.find('.defaultimg').css({'opacity': 0});
                            opt.act = opt.next;
                            moveSelectedThumb(container);

                        }
                    });
                }, j * 100);
            });
        }



        ////////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION XVIII.  //
        ///////////////////////////////////////
        if (nexttrans == 18) {								// 3D CURTAIN VERTICAL

            masterspeed = masterspeed + 100;
            if (opt.slots > 10)
                opt.slots = 10;

            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlide(actsh, opt, true);
            prepareOneSlide(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT


            nextsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                ss.transition({rotateX: 10, rotateY: 310, perspective: '1400px', rotate: 0, opacity: 0}, 0);
                setTimeout(function() {
                    ss.transition({top: 0, left: 0, scale: 1, perspective: '150px', rotate: 0, rotateY: 0, rotateX: 0, opacity: 1}, masterspeed * 2, function() {

                        if (j == opt.slots - 1) {
                            removeSlots(container, opt);
                            nextsh.find('.defaultimg').css({'opacity': 1});

                            if (nextli.index() != actli.index())
                                actsh.find('.defaultimg').css({'opacity': 0});
                            opt.act = opt.next;
                            moveSelectedThumb(container);

                        }
                    });
                }, j * 100);
            });
        }

        ////////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION XIX.  //
        ///////////////////////////////////////
        if (nexttrans == 19) {								// CUBIC VERTICAL
            masterspeed = masterspeed + 100;
            if (opt.slots > 10)
                opt.slots = 10;
            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlide(actsh, opt, true);
            prepareOneSlide(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});
            var chix = nextli.css('z-index');
            var chix2 = actli.css('z-index');

            //actli.css({'z-index':22});



            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT


            nextsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                //ss.css({'overflow':'visible'});
                ss.parent().css({'overflow': 'visible'});
                ss.css({'background': '#333'});
                if (direction == 1)
                    ss.transition({opacity: 0, left: 0, top: opt.height / 2, rotate3d: '1, 0, 0, -90deg '}, 0);
                else
                    ss.transition({opacity: 0, left: 0, top: 0 - opt.height / 2, rotate3d: '1, 0, 0, 90deg '}, 0);

                setTimeout(function() {

                    ss.transition({opacity: 1, top: 0, perspective: opt.height * 2, rotate3d: ' 1, 0, 0, 0deg '}, masterspeed * 2, function() {

                        if (j == opt.slots - 1) {
                            removeSlots(container, opt);
                            nextsh.find('.defaultimg').css({'opacity': 1});

                            if (nextli.index() != actli.index())
                                actsh.find('.defaultimg').css({'opacity': 0});
                            opt.act = opt.next;
                            moveSelectedThumb(container);

                        }
                    });
                }, j * 150);

            });

            actsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                ss.parent().css({'overflow': 'visible'});
                ss.css({'background': '#333'});
                ss.transition({top: 0, rotate3d: '1, 0, 0, 0deg'}, 0);
                actsh.find('.defaultimg').css({'opacity': 0});
                setTimeout(function() {
                    if (direction == 1)
                        ss.transition({opacity: 0.6, left: 0, perspective: opt.height * 2, top: 0 - opt.height / 2, rotate3d: '1, 0, 0, 90deg'}, masterspeed * 2, function() {
                        });
                    else
                        ss.transition({opacity: 0.6, left: 0, perspective: opt.height * 2, top: (0 + opt.height / 2), rotate3d: '1, 0, 0, -90deg'}, masterspeed * 2, function() {
                        });
                }, j * 150);
            });
        }

        ////////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION XX.  //
        ///////////////////////////////////////
        if (nexttrans == 20) {								// FLYIN
            masterspeed = masterspeed + 100;
            if (opt.slots > 10)
                opt.slots = 10;



            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlideV(actsh, opt, true);
            prepareOneSlideV(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT


            nextsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                ss.parent().css({'overflow': 'visible'});

                if (direction == 1)
                    ss.transition({scale: 0.8, top: 0, left: 0 - opt.width, rotate3d: '2, 5, 0, 110deg'}, 0);
                else
                    ss.transition({scale: 0.8, top: 0, left: 0 + opt.width, rotate3d: '2, 5, 0, -110deg'}, 0);
                setTimeout(function() {
                    ss.transition({scale: 0.8, left: 0, perspective: opt.width, rotate3d: '1, 5, 0, 0deg'}, masterspeed * 2, 'ease').transition({scale: 1}, 200, 'out', function() {

                        if (j == opt.slots - 1) {
                            removeSlots(container, opt);
                            nextsh.find('.defaultimg').css({'opacity': 1});

                            if (nextli.index() != actli.index())
                                actsh.find('.defaultimg').css({'opacity': 0});
                            opt.act = opt.next;
                            moveSelectedThumb(container);

                        }
                    });
                }, j * 100);
            });

            actsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                ss.transition({scale: 0.5, left: 0, rotate3d: '1, 5, 0, 5deg'}, 300, 'in-out');
                actsh.find('.defaultimg').css({'opacity': 0});
                setTimeout(function() {
                    if (direction == 1)
                        ss.transition({top: 0, left: opt.width / 2, perspective: opt.width, rotate3d: '0, -3, 0, 70deg', opacity: 0}, masterspeed * 2, 'out', function() {
                        });
                    else
                        ss.transition({top: 0, left: 0 - opt.width / 2, perspective: opt.width, rotate3d: '0, -3, 0, -70deg', opacity: 0}, masterspeed * 2, 'out', function() {
                        });
                }, j * 100);
            });
        }


        ////////////////////////////////////////
        // THE SLOTSLIDE - TRANSITION XX.  //
        ///////////////////////////////////////
        if (nexttrans == 21) {								// TURNOFF
            masterspeed = masterspeed + 100;
            if (opt.slots > 10)
                opt.slots = 10;

            nextli.css({'opacity': 1});

            // PREPARE THE SLOTS HERE
            prepareOneSlideV(actsh, opt, true);
            prepareOneSlideV(nextsh, opt, false);

            //SET DEFAULT IMG UNVISIBLE
            nextsh.find('.defaultimg').css({'opacity': 0});
            //actsh.find('.defaultimg').css({'opacity':0});


            // ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT


            nextsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                if (direction == 1)
                    ss.transition({top: 0, left: 0 - (opt.width), rotate3d: '0, 1, 0, 90deg'}, 0);
                else
                    ss.transition({top: 0, left: 0 + (opt.width), rotate3d: '0, 1, 0, -90deg'}, 0);
                setTimeout(function() {
                    ss.transition({left: 0, perspective: opt.width * 2, rotate3d: '0, 0, 0, 0deg'}, masterspeed * 2, function() {

                        if (j == opt.slots - 1) {
                            removeSlots(container, opt);
                            nextsh.find('.defaultimg').css({'opacity': 1});

                            if (nextli.index() != actli.index())
                                actsh.find('.defaultimg').css({'opacity': 0});
                            opt.act = opt.next;
                            moveSelectedThumb(container);

                        }
                    });
                }, j * 100);
            });

            actsh.find('.slotslide').each(function(j) {
                var ss = jQuery(this);
                ss.transition({left: 0, rotate3d: '0, 0, 0, 0deg'}, 0);
                actsh.find('.defaultimg').css({'opacity': 0});
                setTimeout(function() {
                    if (direction == 1)
                        ss.transition({top: 0, left: (opt.width / 2), perspective: opt.width, rotate3d: '0, 1, 0, -90deg'}, masterspeed * 1.5, function() {
                        });
                    else
                        ss.transition({top: 0, left: (0 - opt.width / 2), perspective: opt.width, rotate3d: '0, 1, 0, +90deg'}, masterspeed * 1.5, function() {
                        });

                }, j * 100);
            });
        }


        var data = {};
        data.slideIndex = opt.next + 1;
        container.trigger('revolution.slide.onchange', data);
        setTimeout(function() {
            container.trigger('revolution.slide.onafterswap');
        }, masterspeed);
        container.trigger('revolution.slide.onvideostop');


    }




    function onYouTubePlayerAPIReady() {

    }


    //////////////////////////////////////////
    // CHANG THE YOUTUBE PLAYER STATE HERE //
    ////////////////////////////////////////
    function onPlayerStateChange(event) {

        if (event.data == YT.PlayerState.PLAYING) {

            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');
            bt.stop();

            opt.videoplaying = true;
            //console.log("VideoPlay set to True due onPlayerStateChange PLAYING");
            opt.videostartednow = 1;

        } else {
            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');

            if (event.data != -1) {
                if (opt.conthover == 0)
                    bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
                opt.videoplaying = false;
                opt.videostoppednow = 1;
                //console.log("VideoPlay set to False due onPlayerStateChange PAUSE");
            }

        }
        if (event.data == 0 && opt.nextslideatend == true)
            opt.container.revnext();


    }

    ///////////////////////////////
    //	YOUTUBE VIDEO AUTOPLAY //
    ///////////////////////////////
    function onPlayerReady(event) {
        event.target.playVideo();
    }

    ////////////////////////
    // VIMEO ADD EVENT /////
    ////////////////////////
    function addEvent(element, eventName, callback) {

        if (element.addEventListener) {

            element.addEventListener(eventName, callback, false);
        }
        else {

            element.attachEvent(eventName, callback, false);
        }


    }

    //////////////////////////////////////////
    // CHANGE THE YOUTUBE PLAYER STATE HERE //
    ////////////////////////////////////////
    function vimeoready(player_id) {

        var froogaloop = $f(player_id);

        //jQuery('#debug').html(jQuery('#debug').html()+" <br>Frooga Func"+Math.round(Math.random()*100));

        froogaloop.addEvent('ready', function(data) {
            //jQuery('#debug').html(jQuery('#debug').html()+" <br>Ready"+Math.round(Math.random()*100));
            froogaloop.addEvent('play', function(data) {
                //jQuery('#debug').html(jQuery('#debug').html()+" <br>Play"+Math.round(Math.random()*100));

                var bt = jQuery('body').find('.tp-bannertimer');
                var opt = bt.data('opt');
                bt.stop();
                opt.videoplaying = true;
                //console.log("VideoPlay set to True due vimeoready PLAYING");
            });

            froogaloop.addEvent('finish', function(data) {
                var bt = jQuery('body').find('.tp-bannertimer');
                var opt = bt.data('opt');
                if (opt.conthover == 0)
                    bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
                opt.videoplaying = false;
                //console.log("VideoPlay set to False due vimeoready FINNSIH");
                opt.videostartednow = 1;
                if (opt.nextslideatend == true)
                    opt.container.revnext();

            });

            froogaloop.addEvent('pause', function(data) {
                var bt = jQuery('body').find('.tp-bannertimer');
                var opt = bt.data('opt');
                if (opt.conthover == 0)
                    bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
                opt.videoplaying = false;
                //console.log("VideoPlay set to False due vimeoready PAUSE");
                opt.videostoppednow = 1;
            });
        });




    }

    /////////////////////////////////////
    // EVENT HANDLING FOR VIMEO VIDEOS //
    /////////////////////////////////////

    function vimeoready_auto(player_id) {

        var froogaloop = $f(player_id);


        froogaloop.addEvent('ready', function(data) {
            froogaloop.api('play');
        });

        froogaloop.addEvent('play', function(data) {
            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');
            bt.stop();
            opt.videoplaying = true;
            //console.log("VideoPlay set to True due vimeoready_auto PLAYING");
        });

        froogaloop.addEvent('finish', function(data) {
            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');
            if (opt.conthover == 0)
                bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
            opt.videoplaying = false;
            //console.log("VideoPlay set to False due vimeoready_auto FINISH");
            opt.videostartednow = 1;
            if (opt.nextslideatend == true)
                opt.container.revnext();

        });

        froogaloop.addEvent('pause', function(data) {
            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');
            if (opt.conthover == 0)
                bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
            opt.videoplaying = false;
            //console.log("VideoPlay set to False due vimeoready_auto PAUSE");
            opt.videostoppednow = 1;
        });
    }


    ///////////////////////////////////////
    // EVENT HANDLING FOR VIDEO JS VIDEOS //
    ////////////////////////////////////////
    function html5vidready(myPlayer) {

        myPlayer.on("play", function() {
            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');
            bt.stop();
            try {
                opt.videoplaying = true;
            } catch (e) {
            }
            //console.log("VideoPlay set to True due html5vidready PLAYING");
        });

        myPlayer.on("pause", function() {
            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');
            if (opt.conthover == 0)
                bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
            opt.videoplaying = false;
            //console.log("VideoPlay set to False due html5vidready pause");
            opt.videostoppednow = 1;
        });

        myPlayer.on("ended", function() {
            var bt = jQuery('body').find('.tp-bannertimer');
            var opt = bt.data('opt');
            if (opt.conthover == 0)
                bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
            opt.videoplaying = false;
            //console.log("VideoPlay set to False due html5vidready pause");
            opt.videostoppednow = 1;
            if (opt.nextslideatend == true)
                opt.container.revnext();
        });

    }




    ////////////////////////
    // SHOW THE CAPTION  //
    ///////////////////////
    function animateTheCaptions(nextli, opt, actli) {


        //if (jQuery("body").find('#debug').length==0)
        //		jQuery("body").append('<div id="debug" style="background:#000;z-index:1000;position:fixed;top:5px;left:5px;width:100px;height:500px;color:#fff;font-size:10px;font-family:Arial;"</div>');


        var offsetx = 0;
        var offsety = 0;

        nextli.find('.tp-caption').each(function(i) {

            offsetx = opt.width / 2 - opt.startwidth / 2;



            if (opt.bh > 1) {
                opt.bw = 1;
                opt.bh = 1;
            }

            if (opt.bw > 1) {
                opt.bw = 1;
                opt.bh = 1;
            }

            var xbw = opt.bw;
            var xbh = opt.bh;


            if (opt.fullScreen == "on")
                offsety = opt.height / 2 - (opt.startheight * opt.bh) / 2;

            if (offsety < 0)
                offsety = 0;



            var nextcaption = nextli.find('.tp-caption:eq(' + i + ')');

            var handlecaption = 0;

            // HIDE CAPTION IF RESOLUTION IS TOO LOW
            if (opt.width < opt.hideCaptionAtLimit && nextcaption.data('captionhidden') == "on") {
                nextcaption.addClass("tp-hidden-caption")
                handlecaption = 1;
            } else {
                if (opt.width < opt.hideAllCaptionAtLilmit) {
                    nextcaption.addClass("tp-hidden-caption")
                    handlecaption = 1;
                } else {
                    nextcaption.removeClass("tp-hidden-caption")
                }
            }




            nextcaption.stop(true, true);
            if (handlecaption == 0) {
                if (nextcaption.data('linktoslide') != undefined) {
                    nextcaption.css({'cursor': 'pointer'});
                    if (nextcaption.data('linktoslide') != "no") {
                        nextcaption.click(function() {
                            var nextcaption = jQuery(this);
                            var dir = nextcaption.data('linktoslide');
                            if (dir != "next" && dir != "prev") {
                                opt.container.data('showus', dir);
                                opt.container.parent().find('.tp-rightarrow').click();
                            } else
                            if (dir == "next")
                                opt.container.parent().find('.tp-rightarrow').click();
                            else
                            if (dir == "prev")
                                opt.container.parent().find('.tp-leftarrow').click();
                        });
                    }
                }


                if (nextcaption.hasClass("coloredbg"))
                    offsetx = 0;
                if (offsetx < 0)
                    offsetx = 0;

                //var offsety = 0; //opt.height/2 - (opt.startheight*xbh)/2;

                clearTimeout(nextcaption.data('timer'));
                clearTimeout(nextcaption.data('timer-end'));



                // YOUTUBE AND VIMEO LISTENRES INITIALISATION

                var frameID = "iframe" + Math.round(Math.random() * 1000 + 1);

                if (nextcaption.find('iframe').length > 0) {

                    nextcaption.find('iframe').each(function() {
                        var ifr = jQuery(this);

                        if (ifr.attr('src').toLowerCase().indexOf('youtube') >= 0) {
                            opt.nextslideatend = nextcaption.data('nextslideatend');
                            if (!ifr.hasClass("HasListener")) {
                                try {
                                    ifr.attr('id', frameID);

                                    var player;
                                    if (nextcaption.data('autoplay') == true)
                                        player = new YT.Player(frameID, {
                                            events: {
                                                "onStateChange": onPlayerStateChange,
                                                'onReady': onPlayerReady
                                            }
                                        });
                                    else
                                        player = new YT.Player(frameID, {
                                            events: {
                                                "onStateChange": onPlayerStateChange
                                            }
                                        });
                                    ifr.addClass("HasListener");

                                    nextcaption.data('player', player);

                                    if (nextcaption.data('autoplay') == true) {
                                        var bt = jQuery('body').find('#' + opt.container.attr('id')).find('.tp-bannertimer');
                                        setTimeout(function() {
                                            bt.stop();
                                            opt.videoplaying = true;
                                        }, 200);


                                        //console.log("VideoPlay set to True due youtube 1st load AutoPlay");
                                    }
                                } catch (e) {
                                }
                            } else {
                                if (nextcaption.data('autoplay') == true) {


                                    var player = nextcaption.data('player');
                                    player.playVideo();
                                    var bt = jQuery('body').find('#' + opt.container.attr('id')).find('.tp-bannertimer');
                                    setTimeout(function() {
                                        bt.stop();
                                        opt.videoplaying = true;
                                    }, 200);


                                    //console.log("VideoPlay set to True due youtube 2nd load AutoPlay");
                                }
                            }

                        } else {
                            if (ifr.attr('src').toLowerCase().indexOf('vimeo') >= 0) {
                                opt.nextslideatend = nextcaption.data('nextslideatend');
                                if (!ifr.hasClass("HasListener")) {
                                    ifr.addClass("HasListener");
                                    ifr.attr('id', frameID);
                                    var isrc = ifr.attr('src');
                                    var queryParameters = {}, queryString = isrc,
                                            re = /([^&=]+)=([^&]*)/g, m;
                                    // Creates a map with the query string parameters
                                    while (m = re.exec(queryString)) {
                                        queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                                    }


                                    if (queryParameters['player_id'] != undefined) {

                                        isrc = isrc.replace(queryParameters['player_id'], frameID);
                                    } else {
                                        isrc = isrc + "&player_id=" + frameID;
                                    }

                                    try {
                                        isrc = isrc.replace('api=0', 'api=1');
                                    } catch (e) {
                                    }

                                    isrc = isrc + "&api=1";



                                    ifr.attr('src', isrc);
                                    var player = nextcaption.find('iframe')[0];
                                    if (nextcaption.data('autoplay') == true) {

                                        $f(player).addEvent('ready', vimeoready_auto);
                                        var bt = jQuery('body').find('#' + opt.container.attr('id')).find('.tp-bannertimer');
                                        setTimeout(function() {
                                            bt.stop();
                                            opt.videoplaying = true;
                                        }, 200);


                                        //console.log("VideoPlay set to True due vimeo 1st load AutoPlay");
                                    } else {
                                        $f(player).addEvent('ready', vimeoready);
                                    }


                                } else {
                                    if (nextcaption.data('autoplay') == true) {

                                        var ifr = nextcaption.find('iframe');
                                        var id = ifr.attr('id');
                                        var froogaloop = $f(id);
                                        froogaloop.api("pause");
                                        var bt = jQuery('body').find('#' + opt.container.attr('id')).find('.tp-bannertimer');
                                        setTimeout(function() {
                                            bt.stop();
                                            opt.videoplaying = true;
                                        }, 200);


                                        //console.log("VideoPlay set to True due youtube 2nd load AutoPlay");
                                    }
                                }

                            }
                        }
                    });
                }

                // IF HTML5 VIDEO IS EMBEDED
                if (nextcaption.find('video').length > 0) {
                    nextcaption.find('video').each(function(i) {
                        var html5vid = jQuery(this).parent();

                        if (html5vid.hasClass("video-js")) {
                            opt.nextslideatend = nextcaption.data('nextslideatend');
                            if (!html5vid.hasClass("HasListener")) {
                                html5vid.addClass("HasListener");
                                var videoID = "videoid_" + Math.round(Math.random() * 1000 + 1);
                                html5vid.attr('id', videoID);
                                videojs(videoID).ready(function() {
                                    html5vidready(this)
                                });
                            } else {
                                videoID = html5vid.attr('id');
                            }
                            if (nextcaption.data('autoplay') == true) {

                                var bt = jQuery('body').find('#' + opt.container.attr('id')).find('.tp-bannertimer');
                                setTimeout(function() {
                                    bt.stop();
                                    opt.videoplaying = true;
                                }, 200);

                                //console.log("VideoPlay set to True due HTML5 VIDEO 1st/2nd load AutoPlay");

                                videojs(videoID).ready(function() {
                                    var myPlayer = this;
                                    html5vid.data('timerplay', setTimeout(function() {
                                        myPlayer.play();
                                    }, nextcaption.data('start')));
                                });
                            }


                            if (html5vid.data('ww') == undefined)
                                html5vid.data('ww', html5vid.width());
                            if (html5vid.data('hh') == undefined)
                                html5vid.data('hh', html5vid.height());

                            videojs(videoID).ready(function() {
                                if (!nextcaption.hasClass("fullscreenvideo")) {
                                    var myPlayer = videojs(videoID);

                                    try {
                                        myPlayer.width(html5vid.data('ww') * opt.bw);
                                        myPlayer.height(html5vid.data('hh') * opt.bh);
                                    } catch (e) {
                                    }
                                }
                            });


                        }

                    });
                } // END OF VIDEO JS FUNCTIONS



                if (nextcaption.hasClass("randomrotate") && (opt.ie || opt.ie9))
                    nextcaption.removeClass("randomrotate").addClass("sfb");
                nextcaption.removeClass('noFilterClass');



                var imw = 0;
                var imh = 0;

                if (nextcaption.find('img').length > 0) {
                    var im = nextcaption.find('img');
                    if (im.data('ww') == undefined)
                        im.data('ww', im.width());
                    if (im.data('hh') == undefined)
                        im.data('hh', im.height());

                    var ww = im.data('ww');
                    var hh = im.data('hh');


                    im.width(ww * opt.bw);
                    im.height(hh * opt.bh);
                    imw = im.width();
                    imh = im.height();
                } else {

                    if (nextcaption.find('iframe').length > 0) {

                        var im = nextcaption.find('iframe');
                        if (nextcaption.data('ww') == undefined) {
                            nextcaption.data('ww', im.width());
                        }
                        if (nextcaption.data('hh') == undefined)
                            nextcaption.data('hh', im.height());

                        var ww = nextcaption.data('ww');
                        var hh = nextcaption.data('hh');

                        var nc = nextcaption;
                        if (nc.data('fsize') == undefined)
                            nc.data('fsize', parseInt(nc.css('font-size'), 0) || 0);
                        if (nc.data('pt') == undefined)
                            nc.data('pt', parseInt(nc.css('paddingTop'), 0) || 0);
                        if (nc.data('pb') == undefined)
                            nc.data('pb', parseInt(nc.css('paddingBottom'), 0) || 0);
                        if (nc.data('pl') == undefined)
                            nc.data('pl', parseInt(nc.css('paddingLeft'), 0) || 0);
                        if (nc.data('pr') == undefined)
                            nc.data('pr', parseInt(nc.css('paddingRight'), 0) || 0);

                        if (nc.data('mt') == undefined)
                            nc.data('mt', parseInt(nc.css('marginTop'), 0) || 0);
                        if (nc.data('mb') == undefined)
                            nc.data('mb', parseInt(nc.css('marginBottom'), 0) || 0);
                        if (nc.data('ml') == undefined)
                            nc.data('ml', parseInt(nc.css('marginLeft'), 0) || 0);
                        if (nc.data('mr') == undefined)
                            nc.data('mr', parseInt(nc.css('marginRight'), 0) || 0);

                        if (nc.data('bt') == undefined)
                            nc.data('bt', parseInt(nc.css('borderTop'), 0) || 0);
                        if (nc.data('bb') == undefined)
                            nc.data('bb', parseInt(nc.css('borderBottom'), 0) || 0);
                        if (nc.data('bl') == undefined)
                            nc.data('bl', parseInt(nc.css('borderLeft'), 0) || 0);
                        if (nc.data('br') == undefined)
                            nc.data('br', parseInt(nc.css('borderRight'), 0) || 0);

                        if (nc.data('lh') == undefined)
                            nc.data('lh', parseInt(nc.css('lineHeight'), 0) || 0);

                        var fvwidth = opt.width;
                        var fvheight = opt.height;
                        if (fvwidth > opt.startwidth)
                            fvwidth = opt.startwidth;
                        if (fvheight > opt.startheight)
                            fvheight = opt.startheight;

                        if (!nextcaption.hasClass('fullscreenvideo'))
                            nextcaption.css({
                                'font-size': (nc.data('fsize') * opt.bw) + "px",
                                'padding-top': (nc.data('pt') * opt.bh) + "px",
                                'padding-bottom': (nc.data('pb') * opt.bh) + "px",
                                'padding-left': (nc.data('pl') * opt.bw) + "px",
                                'padding-right': (nc.data('pr') * opt.bw) + "px",
                                'margin-top': (nc.data('mt') * opt.bh) + "px",
                                'margin-bottom': (nc.data('mb') * opt.bh) + "px",
                                'margin-left': (nc.data('ml') * opt.bw) + "px",
                                'margin-right': (nc.data('mr') * opt.bw) + "px",
                                'border-top': (nc.data('bt') * opt.bh) + "px",
                                'border-bottom': (nc.data('bb') * opt.bh) + "px",
                                'border-left': (nc.data('bl') * opt.bw) + "px",
                                'border-right': (nc.data('br') * opt.bw) + "px",
                                'line-height': (nc.data('lh') * opt.bh) + "px",
                                'height': (hh * opt.bh) + 'px',
                                'white-space': "nowrap"
                            });
                        else
                            nextcaption.css({
                                'width': opt.startwidth * opt.bw,
                                'height': opt.startheight * opt.bh
                            });


                        im.width(ww * opt.bw);
                        im.height(hh * opt.bh);
                        imw = im.width();
                        imh = im.height();
                    } else {


                        nextcaption.find('.tp-resizeme, .tp-resizeme *').each(function() {
                            calcCaptionResponsive(jQuery(this), opt);
                        });

                        calcCaptionResponsive(nextcaption, opt);

                        imh = nextcaption.outerHeight(true);
                        imw = nextcaption.outerWidth(true);

                        // NEXTCAPTION FRONTCORNER CHANGES
                        var ncch = nextcaption.outerHeight();
                        var bgcol = nextcaption.css('backgroundColor');
                        nextcaption.find('.frontcorner').css({
                            'borderWidth': ncch + "px",
                            'left': (0 - ncch) + 'px',
                            'borderRight': '0px solid transparent',
                            'borderTopColor': bgcol
                        });

                        nextcaption.find('.frontcornertop').css({
                            'borderWidth': ncch + "px",
                            'left': (0 - ncch) + 'px',
                            'borderRight': '0px solid transparent',
                            'borderBottomColor': bgcol
                        });

                        // NEXTCAPTION BACKCORNER CHANGES
                        nextcaption.find('.backcorner').css({
                            'borderWidth': ncch + "px",
                            'right': (0 - ncch) + 'px',
                            'borderLeft': '0px solid transparent',
                            'borderBottomColor': bgcol
                        });

                        // NEXTCAPTION BACKCORNER CHANGES
                        nextcaption.find('.backcornertop').css({
                            'borderWidth': ncch + "px",
                            'right': (0 - ncch) + 'px',
                            'borderLeft': '0px solid transparent',
                            'borderTopColor': bgcol
                        });

                    }
                }

                if (nextcaption.data('voffset') == undefined)
                    nextcaption.data('voffset', 0);
                if (nextcaption.data('hoffset') == undefined)
                    nextcaption.data('hoffset', 0);

                var vofs = nextcaption.data('voffset') * xbw;
                var hofs = nextcaption.data('hoffset') * xbw;

                var crw = opt.startwidth * xbw;
                var crh = opt.startheight * xbw;


                // CENTER THE CAPTION HORIZONTALLY
                if (nextcaption.data('x') == "center" || nextcaption.data('xcenter') == 'center') {
                    nextcaption.data('xcenter', 'center');
                    nextcaption.data('x', (crw / 2 - nextcaption.outerWidth(true) / 2) / xbw + hofs);

                }

                // ALIGN LEFT THE CAPTION HORIZONTALLY
                if (nextcaption.data('x') == "left" || nextcaption.data('xleft') == 'left') {
                    nextcaption.data('xleft', 'left');
                    nextcaption.data('x', (0) / xbw + hofs);

                }

                // ALIGN RIGHT THE CAPTION HORIZONTALLY
                if (nextcaption.data('x') == "right" || nextcaption.data('xright') == 'right') {
                    nextcaption.data('xright', 'right');
                    nextcaption.data('x', ((crw - nextcaption.outerWidth(true)) + hofs) / xbw);
                    //console.log("crw:"+crw+"  width:"+nextcaption.outerWidth(true)+"  xbw:"+xbw);
                    //console.log("x-pos:"+nextcaption.data('x'))
                }


                // CENTER THE CAPTION VERTICALLY
                if (nextcaption.data('y') == "center" || nextcaption.data('ycenter') == 'center') {
                    nextcaption.data('ycenter', 'center');
                    nextcaption.data('y', (crh / 2 - nextcaption.outerHeight(true) / 2) / opt.bh + vofs);

                }

                // ALIGN TOP THE CAPTION VERTICALLY
                if (nextcaption.data('y') == "top" || nextcaption.data('ytop') == 'top') {
                    nextcaption.data('ytop', 'top');
                    nextcaption.data('y', (0) / opt.bh + vofs);

                }

                // ALIGN BOTTOM THE CAPTION VERTICALLY
                if (nextcaption.data('y') == "bottom" || nextcaption.data('ybottom') == 'bottom') {
                    nextcaption.data('ybottom', 'bottom');
                    nextcaption.data('y', ((crh - nextcaption.outerHeight(true)) + vofs) / xbw);
                }


                if (nextcaption.hasClass('fade')) {

                    nextcaption.css({'opacity': 0, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': (opt.bh * nextcaption.data('y') + offsety) + "px"});
                }

                if (nextcaption.hasClass("randomrotate")) {

                    nextcaption.css({'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': ((xbh * nextcaption.data('y')) + offsety) + "px"});
                    var sc = Math.random() * 2 + 1;
                    var ro = Math.round(Math.random() * 200 - 100);
                    var xx = Math.round(Math.random() * 200 - 100);
                    var yy = Math.round(Math.random() * 200 - 100);
                    nextcaption.data('repx', xx);
                    nextcaption.data('repy', yy);
                    nextcaption.data('repo', nextcaption.css('opacity'));
                    nextcaption.data('rotate', ro);
                    nextcaption.data('scale', sc);

                    nextcaption.transition({opacity: 0, scale: sc, rotate: ro, x: xx, y: yy, duration: '0ms'});
                } else {
                    if (opt.ie || opt.ie9)
                    {
                    }
                    else {
                        if (nextcaption.find('iframe').length == 0)
                            nextcaption.transition({scale: 1, rotate: 0});
                    }
                }

                if (nextcaption.hasClass('lfr')) {

                    nextcaption.css({'opacity': 1, 'left': (15 + opt.width) + 'px', 'top': (opt.bh * nextcaption.data('y') + offsety) + "px"});

                }

                if (nextcaption.hasClass('lfl')) {

                    nextcaption.css({'opacity': 1, 'left': (-15 - imw) + 'px', 'top': (opt.bh * nextcaption.data('y') + offsety) + "px"});

                }

                if (nextcaption.hasClass('sfl')) {

                    nextcaption.css({'opacity': 0, 'left': ((xbw * nextcaption.data('x')) - 50 + offsetx) + 'px', 'top': (opt.bh * nextcaption.data('y') + offsety) + "px"});
                }

                if (nextcaption.hasClass('sfr')) {
                    nextcaption.css({'opacity': 0, 'left': ((xbw * nextcaption.data('x')) + 50 + offsetx) + 'px', 'top': (opt.bh * nextcaption.data('y') + offsety) + "px"});
                }




                if (nextcaption.hasClass('lft')) {

                    nextcaption.css({'opacity': 1, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': (-25 - imh) + "px"});

                }

                if (nextcaption.hasClass('lfb')) {
                    nextcaption.css({'opacity': 1, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': (25 + opt.height) + "px"});

                }

                if (nextcaption.hasClass('sft')) {
                    nextcaption.css({'opacity': 0, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': ((opt.bh * nextcaption.data('y') + offsety) - 50) + "px"});
                }

                if (nextcaption.hasClass('sfb')) {
                    nextcaption.css({'opacity': 0, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': ((opt.bh * nextcaption.data('y') + offsety) + 50) + "px"});
                }




                nextcaption.data('timer', setTimeout(function() {
                    var easetype = nextcaption.data('easing');
                    if (easetype == undefined)
                        easetype = "linear";

                    nextcaption.css({'visibility': 'visible'});
                    if (nextcaption.hasClass('fade')) {
                        nextcaption.data('repo', nextcaption.css('opacity'));

                        //nextcaption.animate({'opacity':1},{duration:nextcaption.data('speed'),complete:function() { if (opt.ie) jQuery(this).addClass('noFilterClass');}});
                        nextcaption.transition({'opacity': 1, duration: nextcaption.data('speed')});
                        //if (opt.ie) nextcaption.addClass('noFilterClass');
                    }

                    if (nextcaption.hasClass("randomrotate")) {

                        easetype = easetype.replace('Elastic', 'Back');
                        easetype = easetype.replace('Bounce', 'Back');
                        nextcaption.transition({opacity: 1, scale: 1, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': (xbh * (nextcaption.data('y')) + offsety) + "px", rotate: 0, x: 0, y: 0, duration: nextcaption.data('speed'), easing: easetype});
                        if (opt.ie)
                            nextcaption.addClass('noFilterClass');
                    }

                    if (nextcaption.hasClass('lfr') ||
                            nextcaption.hasClass('lfl') ||
                            nextcaption.hasClass('sfr') ||
                            nextcaption.hasClass('sfl') ||
                            nextcaption.hasClass('lft') ||
                            nextcaption.hasClass('lfb') ||
                            nextcaption.hasClass('sft') ||
                            nextcaption.hasClass('sfb')
                            )
                    {

                        nextcaption.data('repx', nextcaption.position().left);
                        nextcaption.data('repy', nextcaption.position().top);

                        nextcaption.data('repo', nextcaption.css('opacity'));
                        if (easetype.indexOf("Bounce") >= 0 || easetype.indexOf("Elastic") >= 0)
                            nextcaption.animate({'opacity': 1, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': opt.bh * (nextcaption.data('y')) + offsety + "px"}, {duration: nextcaption.data('speed'), easing: easetype, complete: function() {
                                    if (opt.ie)
                                        jQuery(this).addClass('noFilterClass');
                                }});
                        else
                            nextcaption.transition({'opacity': 1, 'left': (xbw * nextcaption.data('x') + offsetx) + 'px', 'top': opt.bh * (nextcaption.data('y')) + offsety + "px", duration: nextcaption.data('speed'), easing: easetype});
                        //if (opt.ie) nextcaption.addClass('noFilterClass');
                    }
                }, nextcaption.data('start')));


                // IF THERE IS ANY EXIT ANIM DEFINED
                if (nextcaption.data('end') != undefined)
                    nextcaption.data('timer-end', setTimeout(function() {

                        if ((opt.ie || opt.ie9) && (nextcaption.hasClass("randomrotate") || nextcaption.hasClass("randomrotateout"))) {
                            nextcaption.removeClass("randomrotate").removeClass("randomrotateout").addClass('fadeout');
                        }

                        endMoveCaption(nextcaption, opt);

                    }, nextcaption.data('end')));
            }
        })

        var bt = jQuery('body').find('#' + opt.container.attr('id')).find('.tp-bannertimer');
        bt.data('opt', opt);
    }



    /////////////////////////////////////////////////////////////////
    //	-	CALCULATE THE RESPONSIVE SIZES OF THE CAPTIONS	-	  //
    /////////////////////////////////////////////////////////////////
    function calcCaptionResponsive(nc, opt) {
        if (nc.data('fsize') == undefined)
            nc.data('fsize', parseInt(nc.css('font-size'), 0) || 0);
        if (nc.data('pt') == undefined)
            nc.data('pt', parseInt(nc.css('paddingTop'), 0) || 0);
        if (nc.data('pb') == undefined)
            nc.data('pb', parseInt(nc.css('paddingBottom'), 0) || 0);
        if (nc.data('pl') == undefined)
            nc.data('pl', parseInt(nc.css('paddingLeft'), 0) || 0);
        if (nc.data('pr') == undefined)
            nc.data('pr', parseInt(nc.css('paddingRight'), 0) || 0);

        if (nc.data('mt') == undefined)
            nc.data('mt', parseInt(nc.css('marginTop'), 0) || 0);
        if (nc.data('mb') == undefined)
            nc.data('mb', parseInt(nc.css('marginBottom'), 0) || 0);
        if (nc.data('ml') == undefined)
            nc.data('ml', parseInt(nc.css('marginLeft'), 0) || 0);
        if (nc.data('mr') == undefined)
            nc.data('mr', parseInt(nc.css('marginRight'), 0) || 0);

        if (nc.data('bt') == undefined)
            nc.data('bt', parseInt(nc.css('borderTopWidth'), 0) || 0);
        if (nc.data('bb') == undefined)
            nc.data('bb', parseInt(nc.css('borderBottomWidth'), 0) || 0);
        if (nc.data('bl') == undefined)
            nc.data('bl', parseInt(nc.css('borderLeftWidth'), 0) || 0);
        if (nc.data('br') == undefined)
            nc.data('br', parseInt(nc.css('borderRightWidth'), 0) || 0);

        if (nc.data('lh') == undefined)
            nc.data('lh', parseInt(nc.css('lineHeight'), 0) || 0);
        if (nc.data('minwidth') == undefined)
            nc.data('minwidth', parseInt(nc.css('minWidth'), 0) || 0);
        if (nc.data('minheight') == undefined)
            nc.data('minheight', parseInt(nc.css('minHeight'), 0) || 0);
        if (nc.data('maxwidth') == undefined)
            nc.data('maxwidth', parseInt(nc.css('maxWidth'), 0) || "none");
        if (nc.data('maxheight') == undefined)
            nc.data('maxheight', parseInt(nc.css('maxHeight'), 0) || "none");


        nc.css({
            'font-size': Math.round((nc.data('fsize') * opt.bw)) + "px",
            'padding-top': Math.round((nc.data('pt') * opt.bh)) + "px",
            'padding-bottom': Math.round((nc.data('pb') * opt.bh)) + "px",
            'padding-left': Math.round((nc.data('pl') * opt.bw)) + "px",
            'padding-right': Math.round((nc.data('pr') * opt.bw)) + "px",
            'margin-top': (nc.data('mt') * opt.bh) + "px",
            'margin-bottom': (nc.data('mb') * opt.bh) + "px",
            'margin-left': (nc.data('ml') * opt.bw) + "px",
            'margin-right': (nc.data('mr') * opt.bw) + "px",
            'borderTopWidth': Math.round((nc.data('bt') * opt.bh)) + "px",
            'borderBottomWidth': Math.round((nc.data('bb') * opt.bh)) + "px",
            'borderLeftWidth': Math.round((nc.data('bl') * opt.bw)) + "px",
            'borderRightWidth': Math.round((nc.data('br') * opt.bw)) + "px",
            'line-height': Math.round((nc.data('lh') * opt.bh)) + "px",
            'white-space': "nowrap",
            'minWidth': (nc.data('minwidth') * opt.bw) + "px",
            'minHeight': (nc.data('minheight') * opt.bh) + "px",
        });

        //console.log(nc.data('maxwidth')+"  "+nc.data('maxheight'));
        if (nc.data('maxheight') != 'none')
            nc.css({'maxHeight': (nc.data('maxheight') * opt.bh) + "px"});


        if (nc.data('maxwidth') != 'none')
            nc.css({'maxWidth': (nc.data('maxwidth') * opt.bw) + "px"});
    }


    //////////////////////////
    //	REMOVE THE CAPTIONS //
    /////////////////////////
    function removeTheCaptions(actli, opt) {

        actli.find('.tp-caption').each(function(i) {
            var nextcaption = actli.find('.tp-caption:eq(' + i + ')');
            nextcaption.stop(true, true);
            clearTimeout(nextcaption.data('timer'));
            clearTimeout(nextcaption.data('timer-end'));

            var easetype = nextcaption.data('easing');
            easetype = "easeInOutSine";
            var ll = nextcaption.data('repx');
            var tt = nextcaption.data('repy');
            var oo = nextcaption.data('repo');
            var rot = nextcaption.data('rotate');
            var sca = nextcaption.data('scale');


            if (nextcaption.find('iframe').length > 0) {
                // VIMEO VIDEO PAUSE
                try {
                    var ifr = nextcaption.find('iframe');
                    var id = ifr.attr('id');
                    var froogaloop = $f(id);
                    froogaloop.api("pause");
                } catch (e) {
                }
                //YOU TUBE PAUSE
                try {
                    var player = nextcaption.data('player');
                    player.stopVideo();
                } catch (e) {
                }
            }

            // IF HTML5 VIDEO IS EMBEDED
            if (nextcaption.find('video').length > 0) {
                try {
                    nextcaption.find('video').each(function(i) {
                        var html5vid = jQuery(this).parent();
                        var videoID = html5vid.attr('id');
                        clearTimeout(html5vid.data('timerplay'));
                        videojs(videoID).ready(function() {
                            var myPlayer = this;
                            myPlayer.pause();
                        });
                    })
                } catch (e) {
                }
            } // END OF VIDEO JS FUNCTIONS
            try {
                /*if (rot!=undefined || sca!=undefined)
                 {
                 if (rot==undefined) rot=0;
                 if (sca==undefined) sca=1;
                 nextcaption.transition({'rotate':rot, 'scale':sca, 'opacity':0,'left':ll+'px','top':tt+"px"},(nextcaption.data('speed')+10), function() { nextcaption.removeClass('noFilterClass');nextcaption.css({'visibility':'hidden'})});
                 } else {
                 
                 nextcaption.animate({'opacity':0,'left':ll+'px','top':tt+"px"},{duration:(nextcaption.data('speed')+10), easing:easetype, complete:function() { nextcaption.removeClass('noFilterClass');nextcaption.css({'visibility':'hidden'})}});
                 }*/
                endMoveCaption(nextcaption, opt);
            } catch (e) {
            }



        });
    }

    //////////////////////////
    //	MOVE OUT THE CAPTIONS //
    /////////////////////////
    function endMoveCaption(nextcaption, opt) {


        if (nextcaption.hasClass("randomrotate") && (opt.ie || opt.ie9))
            nextcaption.removeClass("randomrotate").addClass("sfb");
        if (nextcaption.hasClass("randomrotateout") && (opt.ie || opt.ie9))
            nextcaption.removeClass("randomrotateout").addClass("stb");

        var endspeed = nextcaption.data('endspeed');
        if (endspeed == undefined)
            endspeed = nextcaption.data('speed');

        var xx = nextcaption.data('repx');
        var yy = nextcaption.data('repy');
        var oo = nextcaption.data('repo');

        if (opt.ie) {
            nextcaption.css({'opacity': 'inherit', 'filter': 'inherit'});
        }

        if (nextcaption.hasClass('ltr') ||
                nextcaption.hasClass('ltl') ||
                nextcaption.hasClass('str') ||
                nextcaption.hasClass('stl') ||
                nextcaption.hasClass('ltt') ||
                nextcaption.hasClass('ltb') ||
                nextcaption.hasClass('stt') ||
                nextcaption.hasClass('stb')
                )
        {

            xx = nextcaption.position().left;
            yy = nextcaption.position().top;

            if (nextcaption.hasClass('ltr'))
                xx = opt.width + 60;
            else if (nextcaption.hasClass('ltl'))
                xx = 0 - nextcaption.width() - 60;
            else if (nextcaption.hasClass('ltt'))
                yy = 0 - nextcaption.height() - 60;
            else if (nextcaption.hasClass('ltb'))
                yy = opt.height + 60;
            else if (nextcaption.hasClass('str')) {
                xx = xx + 50;
                oo = 0;
            } else if (nextcaption.hasClass('stl')) {
                xx = xx - 50;
                oo = 0;
            } else if (nextcaption.hasClass('stt')) {
                yy = yy - 50;
                oo = 0;
            } else if (nextcaption.hasClass('stb')) {
                yy = yy + 50;
                oo = 0;
            }

            var easetype = nextcaption.data('endeasing');
            if (easetype == undefined)
                easetype = "linear";
            if (easetype.indexOf("Bounce") >= 0 || easetype.indexOf("Elastic") >= 0)
                nextcaption.animate({'opacity': oo, 'left': xx + 'px', 'top': yy + "px"}, {duration: nextcaption.data('endspeed'), easing: easetype, complete: function() {
                        jQuery(this).css({visibility: 'hidden'})
                    }});
            else
                nextcaption.transition({'opacity': oo, 'left': xx + 'px', 'top': yy + "px", duration: nextcaption.data('endspeed'), easing: easetype});
            if (opt.ie)
                nextcaption.removeClass('noFilterClass');

        }

        else

        if (nextcaption.hasClass("randomrotateout")) {

            nextcaption.transition({opacity: 0, scale: Math.random() * 2 + 0.3, 'left': Math.random() * opt.width + 'px', 'top': Math.random() * opt.height + "px", rotate: Math.random() * 40, duration: endspeed, easing: easetype, complete: function() {
                    jQuery(this).css({visibility: 'hidden'})
                }});
            if (opt.ie)
                nextcaption.removeClass('noFilterClass');

        }

        else

        if (nextcaption.hasClass('fadeout')) {
            if (opt.ie)
                nextcaption.removeClass('noFilterClass');
            nextcaption.transition({'opacity': 0, duration: 200});
            //nextcaption.animate({'opacity':0},{duration:200,complete:function() { jQuery(this).css({visibility:'hidden'})}});

        }

        else

        if (nextcaption.hasClass('lfr') ||
                nextcaption.hasClass('lfl') ||
                nextcaption.hasClass('sfr') ||
                nextcaption.hasClass('sfl') ||
                nextcaption.hasClass('lft') ||
                nextcaption.hasClass('lfb') ||
                nextcaption.hasClass('sft') ||
                nextcaption.hasClass('sfb')
                )
        {

            if (nextcaption.hasClass('lfr'))
                xx = opt.width + 60;
            else if (nextcaption.hasClass('lfl'))
                xx = 0 - nextcaption.width() - 60;
            else if (nextcaption.hasClass('lft'))
                yy = 0 - nextcaption.height() - 60;
            else if (nextcaption.hasClass('lfb'))
                yy = opt.height + 60;


            var easetype = nextcaption.data('endeasing');
            if (easetype == undefined)
                easetype = "linear";
            if (easetype.indexOf("Bounce") >= 0 || easetype.indexOf("Elastic") >= 0)
                nextcaption.animate({'opacity': oo, 'left': xx + 'px', 'top': yy + "px"}, {duration: nextcaption.data('endspeed'), easing: easetype, complete: function() {
                        jQuery(this).css({visibility: 'hidden'})
                    }});
            else
                nextcaption.transition({'opacity': oo, 'left': xx + 'px', 'top': yy + "px", duration: nextcaption.data('endspeed'), easing: easetype});
            if (opt.ie)
                nextcaption.removeClass('noFilterClass');

        }

        else

        if (nextcaption.hasClass('fade')) {

            //nextcaption.animate({'opacity':0},{duration:endspeed,complete:function() { jQuery(this).css({visibility:'hidden'})} });
            nextcaption.transition({'opacity': 0, duration: endspeed});
            if (opt.ie)
                nextcaption.removeClass('noFilterClass');

        }

        else

        if (nextcaption.hasClass("randomrotate")) {

            nextcaption.transition({opacity: 0, scale: Math.random() * 2 + 0.3, 'left': Math.random() * opt.width + 'px', 'top': Math.random() * opt.height + "px", rotate: Math.random() * 40, duration: endspeed, easing: easetype});
            if (opt.ie)
                nextcaption.removeClass('noFilterClass');

        }
    }

    ///////////////////////////
    //	REMOVE THE LISTENERS //
    ///////////////////////////
    function removeAllListeners(container, opt) {
        container.children().each(function() {
            try {
                jQuery(this).die('click');
            } catch (e) {
            }
            try {
                jQuery(this).die('mouseenter');
            } catch (e) {
            }
            try {
                jQuery(this).die('mouseleave');
            } catch (e) {
            }
            try {
                jQuery(this).unbind('hover');
            } catch (e) {
            }
        })
        try {
            container.die('click', 'mouseenter', 'mouseleave');
        } catch (e) {
        }
        clearInterval(opt.cdint);
        container = null;



    }

    ///////////////////////////
    //	-	COUNTDOWN	-	//
    /////////////////////////
    function countDown(container, opt) {
        opt.cd = 0;
        opt.loop = 0;
        if (opt.stopAfterLoops != undefined && opt.stopAfterLoops > -1)
            opt.looptogo = opt.stopAfterLoops;
        else
            opt.looptogo = 9999999;

        if (opt.stopAtSlide != undefined && opt.stopAtSlide > -1)
            opt.lastslidetoshow = opt.stopAtSlide;
        else
            opt.lastslidetoshow = 999;

        opt.stopLoop = "off";

        if (opt.looptogo == 0)
            opt.stopLoop = "on";



        if (opt.slideamount > 1 && !(opt.stopAfterLoops == 0 && opt.stopAtSlide == 1)) {
            var bt = container.find('.tp-bannertimer');
            if (bt.length > 0) {
                bt.css({'width': '0%'});
                bt.animate({'width': "100%"}, {duration: (opt.delay - 100), queue: false, easing: "linear"});

            }

            bt.data('opt', opt);


            opt.cdint = setInterval(function() {

                if (jQuery('body').find(container).length == 0)
                    removeAllListeners(container, opt);
                if (container.data('conthover-changed') == 1) {
                    opt.conthover = container.data('conthover');
                    container.data('conthover-changed', 0);
                }

                if (opt.conthover != 1 && opt.videoplaying != true && opt.width > opt.hideSliderAtLimit)
                    opt.cd = opt.cd + 100;


                if (opt.fullWidth != "on")
                    if (opt.width > opt.hideSliderAtLimit)
                        container.parent().removeClass("tp-hide-revslider")
                    else
                        container.parent().addClass("tp-hide-revslider")
                // EVENT TRIGGERING IN CASE VIDEO HAS BEEN STARTED
                if (opt.videostartednow == 1) {
                    container.trigger('revolution.slide.onvideoplay');
                    opt.videostartednow = 0;
                }

                // EVENT TRIGGERING IN CASE VIDEO HAS BEEN STOPPED
                if (opt.videostoppednow == 1) {
                    container.trigger('revolution.slide.onvideostop');
                    opt.videostoppednow = 0;
                }


                if (opt.cd >= opt.delay) {
                    opt.cd = 0;
                    // SWAP TO NEXT BANNER
                    opt.act = opt.next;
                    opt.next = opt.next + 1;
                    if (opt.next > container.find('>ul >li').length - 1) {
                        opt.next = 0;
                        opt.looptogo = opt.looptogo - 1;

                        if (opt.looptogo <= 0) {
                            opt.stopLoop = "on";

                        }
                    }

                    // STOP TIMER IF NO LOOP NO MORE NEEDED.

                    if (opt.stopLoop == "on" && opt.next == opt.lastslidetoshow - 1) {
                        clearInterval(opt.cdint);
                        container.find('.tp-bannertimer').css({'visibility': 'hidden'});
                        container.trigger('revolution.slide.onstop');
                    }

                    // SWAP THE SLIDES
                    swapSlide(container, opt);


                    // Clear the Timer
                    if (bt.length > 0) {
                        bt.css({'width': '0%'});
                        bt.animate({'width': "100%"}, {duration: (opt.delay - 100), queue: false, easing: "linear"});
                    }
                }
            }, 100);


            container.hover(
                    function() {

                        if (opt.onHoverStop == "on") {
                            opt.conthover = 1;
                            bt.stop();
                            container.trigger('revolution.slide.onpause');
                        }
                    },
                    function() {
                        if (container.data('conthover') != 1) {
                            container.trigger('revolution.slide.onresume');
                            opt.conthover = 0;
                            if (opt.onHoverStop == "on" && opt.videoplaying != true) {
                                bt.animate({'width': "100%"}, {duration: ((opt.delay - opt.cd) - 100), queue: false, easing: "linear"});
                            }
                        }
                    });
        }
    }



})(jQuery);




// tipsy, facebook style tooltips for jquery
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license

(function($) {

    function maybeCall(thing, ctx) {
        return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
    }
    ;

    function isElementInDOM(ele) {
        while (ele = ele.parentNode) {
            if (ele == document)
                return true;
        }
        return false;
    }
    ;

    function Tipsy(element, options) {
        this.$element = $(element);
        this.options = options;
        this.enabled = true;
        this.fixTitle();
    }
    ;

    Tipsy.prototype = {
        show: function() {
            var title = this.getTitle();
            if (title && this.enabled) {
                var $tip = this.tip();

                $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
                $tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
                $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body);

                var pos = $.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth,
                    height: this.$element[0].offsetHeight
                });

                var actualWidth = $tip[0].offsetWidth,
                        actualHeight = $tip[0].offsetHeight,
                        gravity = maybeCall(this.options.gravity, this.$element[0]);

                var tp;
                switch (gravity.charAt(0)) {
                    case 'n':
                        tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 's':
                        tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 'e':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
                        break;
                    case 'w':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
                        break;
                }

                if (gravity.length == 2) {
                    if (gravity.charAt(1) == 'w') {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }

                $tip.css(tp).addClass('tipsy-' + gravity);
                $tip.find('.tipsy-arrow')[0].className = 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0);
                if (this.options.className) {
                    $tip.addClass(maybeCall(this.options.className, this.$element[0]));
                }

                if (this.options.fade) {
                    $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
                } else {
                    $tip.css({visibility: 'visible', opacity: this.options.opacity});
                }
            }
        },
        hide: function() {
            if (this.options.fade) {
                this.tip().stop().fadeOut(function() {
                    $(this).remove();
                });
            } else {
                this.tip().remove();
            }
        },
        fixTitle: function() {
            var $e = this.$element;
            if ($e.attr('title') || typeof($e.attr('original-title')) != 'string') {
                $e.attr('original-title', $e.attr('title') || '').removeAttr('title');
            }
        },
        getTitle: function() {
            var title, $e = this.$element, o = this.options;
            this.fixTitle();
            var title, o = this.options;
            if (typeof o.title == 'string') {
                title = $e.attr(o.title == 'title' ? 'original-title' : o.title);
            } else if (typeof o.title == 'function') {
                title = o.title.call($e[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*$)/, "");
            return title || o.fallback;
        },
        tip: function() {
            if (!this.$tip) {
                this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
                this.$tip.data('tipsy-pointee', this.$element[0]);
            }
            return this.$tip;
        },
        validate: function() {
            if (!this.$element[0].parentNode) {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        },
        enable: function() {
            this.enabled = true;
        },
        disable: function() {
            this.enabled = false;
        },
        toggleEnabled: function() {
            this.enabled = !this.enabled;
        }
    };

    $.fn.tipsy = function(options) {

        if (options === true) {
            return this.data('tipsy');
        } else if (typeof options == 'string') {
            var tipsy = this.data('tipsy');
            if (tipsy)
                tipsy[options]();
            return this;
        }

        options = $.extend({}, $.fn.tipsy.defaults, options);

        function get(ele) {
            var tipsy = $.data(ele, 'tipsy');
            if (!tipsy) {
                tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
                $.data(ele, 'tipsy', tipsy);
            }
            return tipsy;
        }

        function enter() {
            var tipsy = get(this);
            tipsy.hoverState = 'in';
            if (options.delayIn == 0) {
                tipsy.show();
            } else {
                tipsy.fixTitle();
                setTimeout(function() {
                    if (tipsy.hoverState == 'in')
                        tipsy.show();
                }, options.delayIn);
            }
        }
        ;

        function leave() {
            var tipsy = get(this);
            tipsy.hoverState = 'out';
            if (options.delayOut == 0) {
                tipsy.hide();
            } else {
                setTimeout(function() {
                    if (tipsy.hoverState == 'out')
                        tipsy.hide();
                }, options.delayOut);
            }
        }
        ;

        if (!options.live)
            this.each(function() {
                get(this);
            });

        if (options.trigger != 'manual') {
            var binder = options.live ? 'live' : 'bind',
                    eventIn = options.trigger == 'hover' ? 'mouseenter' : 'focus',
                    eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
            this[binder](eventIn, enter)[binder](eventOut, leave);
        }

        return this;

    };

    $.fn.tipsy.defaults = {
        className: null,
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        live: false,
        offset: 0,
        opacity: 0.8,
        title: 'title',
        trigger: 'hover'
    };

    $.fn.tipsy.revalidate = function() {
        $('.tipsy').each(function() {
            var pointee = $.data(this, 'tipsy-pointee');
            if (!pointee || !isElementInDOM(pointee)) {
                $(this).remove();
            }
        });
    };

    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tipsy-gravity' attribute:
    // return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    $.fn.tipsy.elementOptions = function(ele, options) {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };

    $.fn.tipsy.autoNS = function() {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };

    $.fn.tipsy.autoWE = function() {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };

    /**
     * yields a closure of the supplied parameters, producing a function that takes
     * no arguments and is suitable for use as an autogravity function like so:
     *
     * @param margin (int) - distance from the viewable region edge that an
     *        element should be before setting its tooltip's gravity to be away
     *        from that edge.
     * @param prefer (string, e.g. 'n', 'sw', 'w') - the direction to prefer
     *        if there are no viewable region edges effecting the tooltip's
     *        gravity. It will try to vary from this minimally, for example,
     *        if 'sw' is preferred and an element is near the right viewable 
     *        region edge, but not the top edge, it will set the gravity for
     *        that element's tooltip to be 'se', preserving the southern
     *        component.
     */
    $.fn.tipsy.autoBounds = function(margin, prefer) {
        return function() {
            var dir = {ns: prefer[0], ew: (prefer.length > 1 ? prefer[1] : false)},
            boundTop = $(document).scrollTop() + margin,
                    boundLeft = $(document).scrollLeft() + margin,
                    $this = $(this);

            if ($this.offset().top < boundTop)
                dir.ns = 'n';
            if ($this.offset().left < boundLeft)
                dir.ew = 'w';
            if ($(window).width() + $(document).scrollLeft() - $this.offset().left < margin)
                dir.ew = 'e';
            if ($(window).height() + $(document).scrollTop() - $this.offset().top < margin)
                dir.ns = 's';

            return dir.ns + (dir.ew ? dir.ew : '');
        }
    };

})(jQuery);
/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2012 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */

(function($) {
    $.transit = {
        version: "0.9.9",
        // Map of $.css() keys to values for 'transitionProperty'.
        // See https://developer.mozilla.org/en/CSS/CSS_transitions#Properties_that_can_be_animated
        propertyMap: {
            marginLeft: 'margin',
            marginRight: 'margin',
            marginBottom: 'margin',
            marginTop: 'margin',
            paddingLeft: 'padding',
            paddingRight: 'padding',
            paddingBottom: 'padding',
            paddingTop: 'padding'
        },
        // Will simply transition "instantly" if false
        enabled: true,
        // Set this to false if you don't want to use the transition end property.
        useTransitionEnd: false
    };

    var div = document.createElement('div');
    var support = {};

    // Helper function to get the proper vendor property name.
    // (`transition` => `WebkitTransition`)
    function getVendorPropertyName(prop) {
        // Handle unprefixed versions (FF16+, for example)
        if (prop in div.style)
            return prop;

        var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
        var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

        if (prop in div.style) {
            return prop;
        }

        for (var i = 0; i < prefixes.length; ++i) {
            var vendorProp = prefixes[i] + prop_;
            if (vendorProp in div.style) {
                return vendorProp;
            }
        }
    }

    // Helper function to check if transform3D is supported.
    // Should return true for Webkits and Firefox 10+.
    function checkTransform3dSupport() {
        div.style[support.transform] = '';
        div.style[support.transform] = 'rotateY(90deg)';
        return div.style[support.transform] !== '';
    }

    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

    // Check for the browser's transitions support.
    support.transition = getVendorPropertyName('transition');
    support.transitionDelay = getVendorPropertyName('transitionDelay');
    support.transform = getVendorPropertyName('transform');
    support.transformOrigin = getVendorPropertyName('transformOrigin');
    support.transform3d = checkTransform3dSupport();

    var eventNames = {
        'transition': 'transitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'WebkitTransition': 'webkitTransitionEnd',
        'msTransition': 'MSTransitionEnd'
    };

    // Detect the 'transitionend' event needed.
    var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;

    // Populate jQuery's `$.support` with the vendor prefixes we know.
    // As per [jQuery's cssHooks documentation](http://api.jquery.com/jQuery.cssHooks/),
    // we set $.support.transition to a string of the actual property name used.
    for (var key in support) {
        if (support.hasOwnProperty(key) && typeof $.support[key] === 'undefined') {
            $.support[key] = support[key];
        }
    }

    // Avoid memory leak in IE.
    div = null;

    // ## $.cssEase
    // List of easing aliases that you can use with `$.fn.transition`.
    $.cssEase = {
        '_default': 'ease',
        'in': 'ease-in',
        'out': 'ease-out',
        'in-out': 'ease-in-out',
        'snap': 'cubic-bezier(0,1,.5,1)',
        // Penner equations
        'easeOutCubic': 'cubic-bezier(.215,.61,.355,1)',
        'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
        'easeInCirc': 'cubic-bezier(.6,.04,.98,.335)',
        'easeOutCirc': 'cubic-bezier(.075,.82,.165,1)',
        'easeInOutCirc': 'cubic-bezier(.785,.135,.15,.86)',
        'easeInExpo': 'cubic-bezier(.95,.05,.795,.035)',
        'easeOutExpo': 'cubic-bezier(.19,1,.22,1)',
        'easeInOutExpo': 'cubic-bezier(1,0,0,1)',
        'easeInQuad': 'cubic-bezier(.55,.085,.68,.53)',
        'easeOutQuad': 'cubic-bezier(.25,.46,.45,.94)',
        'easeInOutQuad': 'cubic-bezier(.455,.03,.515,.955)',
        'easeInQuart': 'cubic-bezier(.895,.03,.685,.22)',
        'easeOutQuart': 'cubic-bezier(.165,.84,.44,1)',
        'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
        'easeInQuint': 'cubic-bezier(.755,.05,.855,.06)',
        'easeOutQuint': 'cubic-bezier(.23,1,.32,1)',
        'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
        'easeInSine': 'cubic-bezier(.47,0,.745,.715)',
        'easeOutSine': 'cubic-bezier(.39,.575,.565,1)',
        'easeInOutSine': 'cubic-bezier(.445,.05,.55,.95)',
        'easeInBack': 'cubic-bezier(.6,-.28,.735,.045)',
        'easeOutBack': 'cubic-bezier(.175, .885,.32,1.275)',
        'easeInOutBack': 'cubic-bezier(.68,-.55,.265,1.55)'
    };

    // ## 'transform' CSS hook
    // Allows you to use the `transform` property in CSS.
    //
    //     $("#hello").css({ transform: "rotate(90deg)" });
    //
    //     $("#hello").css('transform');
    //     //=> { rotate: '90deg' }
    //
    $.cssHooks['transit:transform'] = {
        // The getter returns a `Transform` object.
        get: function(elem) {
            return $(elem).data('transform') || new Transform();
        },
        // The setter accepts a `Transform` object or a string.
        set: function(elem, v) {
            var value = v;

            if (!(value instanceof Transform)) {
                value = new Transform(value);
            }

            // We've seen the 3D version of Scale() not work in Chrome when the
            // element being scaled extends outside of the viewport.  Thus, we're
            // forcing Chrome to not use the 3d transforms as well.  Not sure if
            // translate is affectede, but not risking it.  Detection code from
            // http://davidwalsh.name/detecting-google-chrome-javascript
            if (support.transform === 'WebkitTransform' && !isChrome) {
                elem.style[support.transform] = value.toString(true);
            } else {
                elem.style[support.transform] = value.toString();
            }

            $(elem).data('transform', value);
        }
    };

    // Add a CSS hook for `.css({ transform: '...' })`.
    // In jQuery 1.8+, this will intentionally override the default `transform`
    // CSS hook so it'll play well with Transit. (see issue #62)
    $.cssHooks.transform = {
        set: $.cssHooks['transit:transform'].set
    };

    // jQuery 1.8+ supports prefix-free transitions, so these polyfills will not
    // be necessary.
    if ($.fn.jquery < "1.8") {
        // ## 'transformOrigin' CSS hook
        // Allows the use for `transformOrigin` to define where scaling and rotation
        // is pivoted.
        //
        //     $("#hello").css({ transformOrigin: '0 0' });
        //
        $.cssHooks.transformOrigin = {
            get: function(elem) {
                return elem.style[support.transformOrigin];
            },
            set: function(elem, value) {
                elem.style[support.transformOrigin] = value;
            }
        };

        // ## 'transition' CSS hook
        // Allows you to use the `transition` property in CSS.
        //
        //     $("#hello").css({ transition: 'all 0 ease 0' });
        //
        $.cssHooks.transition = {
            get: function(elem) {
                return elem.style[support.transition];
            },
            set: function(elem, value) {
                elem.style[support.transition] = value;
            }
        };
    }

    // ## Other CSS hooks
    // Allows you to rotate, scale and translate.
    registerCssHook('scale');
    registerCssHook('translate');
    registerCssHook('rotate');
    registerCssHook('rotateX');
    registerCssHook('rotateY');
    registerCssHook('rotate3d');
    registerCssHook('perspective');
    registerCssHook('skewX');
    registerCssHook('skewY');
    registerCssHook('x', true);
    registerCssHook('y', true);

    // ## Transform class
    // This is the main class of a transformation property that powers
    // `$.fn.css({ transform: '...' })`.
    //
    // This is, in essence, a dictionary object with key/values as `-transform`
    // properties.
    //
    //     var t = new Transform("rotate(90) scale(4)");
    //
    //     t.rotate             //=> "90deg"
    //     t.scale              //=> "4,4"
    //
    // Setters are accounted for.
    //
    //     t.set('rotate', 4)
    //     t.rotate             //=> "4deg"
    //
    // Convert it to a CSS string using the `toString()` and `toString(true)` (for WebKit)
    // functions.
    //
    //     t.toString()         //=> "rotate(90deg) scale(4,4)"
    //     t.toString(true)     //=> "rotate(90deg) scale3d(4,4,0)" (WebKit version)
    //
    function Transform(str) {
        if (typeof str === 'string') {
            this.parse(str);
        }
        return this;
    }

    Transform.prototype = {
        // ### setFromString()
        // Sets a property from a string.
        //
        //     t.setFromString('scale', '2,4');
        //     // Same as set('scale', '2', '4');
        //
        setFromString: function(prop, val) {
            var args =
                    (typeof val === 'string') ? val.split(',') :
                    (val.constructor === Array) ? val :
                    [val];

            args.unshift(prop);

            Transform.prototype.set.apply(this, args);
        },
        // ### set()
        // Sets a property.
        //
        //     t.set('scale', 2, 4);
        //
        set: function(prop) {
            var args = Array.prototype.slice.apply(arguments, [1]);
            if (this.setter[prop]) {
                this.setter[prop].apply(this, args);
            } else {
                this[prop] = args.join(',');
            }
        },
        get: function(prop) {
            if (this.getter[prop]) {
                return this.getter[prop].apply(this);
            } else {
                return this[prop] || 0;
            }
        },
        setter: {
            // ### rotate
            //
            //     .css({ rotate: 30 })
            //     .css({ rotate: "30" })
            //     .css({ rotate: "30deg" })
            //     .css({ rotate: "30deg" })
            //
            rotate: function(theta) {
                this.rotate = unit(theta, 'deg');
            },
            rotateX: function(theta) {
                this.rotateX = unit(theta, 'deg');
            },
            rotateY: function(theta) {
                this.rotateY = unit(theta, 'deg');
            },
            // ### scale
            //
            //     .css({ scale: 9 })      //=> "scale(9,9)"
            //     .css({ scale: '3,2' })  //=> "scale(3,2)"
            //
            scale: function(x, y) {
                if (y === undefined) {
                    y = x;
                }
                this.scale = x + "," + y;
            },
            // ### skewX + skewY
            skewX: function(x) {
                this.skewX = unit(x, 'deg');
            },
            skewY: function(y) {
                this.skewY = unit(y, 'deg');
            },
            // ### perspectvie
            perspective: function(dist) {
                this.perspective = unit(dist, 'px');
            },
            // ### x / y
            // Translations. Notice how this keeps the other value.
            //
            //     .css({ x: 4 })       //=> "translate(4px, 0)"
            //     .css({ y: 10 })      //=> "translate(4px, 10px)"
            //
            x: function(x) {
                this.set('translate', x, null);
            },
            y: function(y) {
                this.set('translate', null, y);
            },
            // ### translate
            // Notice how this keeps the other value.
            //
            //     .css({ translate: '2, 5' })    //=> "translate(2px, 5px)"
            //
            translate: function(x, y) {
                if (this._translateX === undefined) {
                    this._translateX = 0;
                }
                if (this._translateY === undefined) {
                    this._translateY = 0;
                }

                if (x !== null && x !== undefined) {
                    this._translateX = unit(x, 'px');
                }
                if (y !== null && y !== undefined) {
                    this._translateY = unit(y, 'px');
                }

                this.translate = this._translateX + "," + this._translateY;
            }
        },
        getter: {
            x: function() {
                return this._translateX || 0;
            },
            y: function() {
                return this._translateY || 0;
            },
            scale: function() {
                var s = (this.scale || "1,1").split(',');
                if (s[0]) {
                    s[0] = parseFloat(s[0]);
                }
                if (s[1]) {
                    s[1] = parseFloat(s[1]);
                }

                // "2.5,2.5" => 2.5
                // "2.5,1" => [2.5,1]
                return (s[0] === s[1]) ? s[0] : s;
            },
            rotate3d: function() {
                var s = (this.rotate3d || "0,0,0,0deg").split(',');
                for (var i = 0; i <= 3; ++i) {
                    if (s[i]) {
                        s[i] = parseFloat(s[i]);
                    }
                }
                if (s[3]) {
                    s[3] = unit(s[3], 'deg');
                }

                return s;
            }
        },
        // ### parse()
        // Parses from a string. Called on constructor.
        parse: function(str) {
            var self = this;
            str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
                self.setFromString(prop, val);
            });
        },
        // ### toString()
        // Converts to a `transition` CSS property string. If `use3d` is given,
        // it converts to a `-webkit-transition` CSS property string instead.
        toString: function(use3d) {
            var re = [];

            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    // Don't use 3D transformations if the browser can't support it.
                    if ((!support.transform3d) && (
                            (i === 'rotateX') ||
                            (i === 'rotateY') ||
                            (i === 'perspective') ||
                            (i === 'transformOrigin'))) {
                        continue;
                    }

                    if (i[0] !== '_') {
                        if (use3d && (i === 'scale')) {
                            re.push(i + "3d(" + this[i] + ",1)");
                        } else if (use3d && (i === 'translate')) {
                            re.push(i + "3d(" + this[i] + ",0)");
                        } else {
                            re.push(i + "(" + this[i] + ")");
                        }
                    }
                }
            }

            return re.join(" ");
        }
    };

    function callOrQueue(self, queue, fn) {
        if (queue === true) {
            self.queue(fn);
        } else if (queue) {
            self.queue(queue, fn);
        } else {
            fn();
        }
    }

    // ### getProperties(dict)
    // Returns properties (for `transition-property`) for dictionary `props`. The
    // value of `props` is what you would expect in `$.css(...)`.
    function getProperties(props) {
        var re = [];

        $.each(props, function(key) {
            key = $.camelCase(key); // Convert "text-align" => "textAlign"
            key = $.transit.propertyMap[key] || $.cssProps[key] || key;
            key = uncamel(key); // Convert back to dasherized

            if ($.inArray(key, re) === -1) {
                re.push(key);
            }
        });

        return re;
    }

    // ### getTransition()
    // Returns the transition string to be used for the `transition` CSS property.
    //
    // Example:
    //
    //     getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');
    //     //=> 'opacity 500ms ease, -webkit-transform 500ms ease'
    //
    function getTransition(properties, duration, easing, delay) {
        // Get the CSS properties needed.
        var props = getProperties(properties);

        // Account for aliases (`in` => `ease-in`).
        if ($.cssEase[easing]) {
            easing = $.cssEase[easing];
        }

        // Build the duration/easing/delay attributes for it.
        var attribs = '' + toMS(duration) + ' ' + easing;
        if (parseInt(delay, 10) > 0) {
            attribs += ' ' + toMS(delay);
        }

        // For more properties, add them this way:
        // "margin 200ms ease, padding 200ms ease, ..."
        var transitions = [];
        $.each(props, function(i, name) {
            transitions.push(name + ' ' + attribs);
        });

        return transitions.join(', ');
    }

    // ## $.fn.transition
    // Works like $.fn.animate(), but uses CSS transitions.
    //
    //     $("...").transition({ opacity: 0.1, scale: 0.3 });
    //
    //     // Specific duration
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500);
    //
    //     // With duration and easing
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in');
    //
    //     // With callback
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, function() { ... });
    //
    //     // With everything
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in', function() { ... });
    //
    //     // Alternate syntax
    //     $("...").transition({
    //       opacity: 0.1,
    //       duration: 200,
    //       delay: 40,
    //       easing: 'in',
    //       complete: function() { /* ... */ }
    //      });
    //
    $.fn.transition = $.fn.transit = function(properties, duration, easing, callback) {
        var self = this;
        var delay = 0;
        var queue = true;

        var theseProperties = jQuery.extend(true, {}, properties);

        // Account for `.transition(properties, callback)`.
        if (typeof duration === 'function') {
            callback = duration;
            duration = undefined;
        }

        // Account for `.transition(properties, options)`.
        if (typeof duration === 'object') {
            easing = duration.easing;
            delay = duration.delay || 0;
            queue = duration.queue || true;
            callback = duration.complete;
            duration = duration.duration;
        }

        // Account for `.transition(properties, duration, callback)`.
        if (typeof easing === 'function') {
            callback = easing;
            easing = undefined;
        }

        // Alternate syntax.
        if (typeof theseProperties.easing !== 'undefined') {
            easing = theseProperties.easing;
            delete theseProperties.easing;
        }

        if (typeof theseProperties.duration !== 'undefined') {
            duration = theseProperties.duration;
            delete theseProperties.duration;
        }

        if (typeof theseProperties.complete !== 'undefined') {
            callback = theseProperties.complete;
            delete theseProperties.complete;
        }

        if (typeof theseProperties.queue !== 'undefined') {
            queue = theseProperties.queue;
            delete theseProperties.queue;
        }

        if (typeof theseProperties.delay !== 'undefined') {
            delay = theseProperties.delay;
            delete theseProperties.delay;
        }

        // Set defaults. (`400` duration, `ease` easing)
        if (typeof duration === 'undefined') {
            duration = $.fx.speeds._default;
        }
        if (typeof easing === 'undefined') {
            easing = $.cssEase._default;
        }

        duration = toMS(duration);

        // Build the `transition` property.
        var transitionValue = getTransition(theseProperties, duration, easing, delay);

        // Compute delay until callback.
        // If this becomes 0, don't bother setting the transition property.
        var work = $.transit.enabled && support.transition;
        var i = work ? (parseInt(duration, 10) + parseInt(delay, 10)) : 0;

        // If there's nothing to do...
        if (i === 0) {
            var fn = function(next) {
                self.css(theseProperties);
                if (callback) {
                    callback.apply(self);
                }
                if (next) {
                    next();
                }
            };

            callOrQueue(self, queue, fn);
            return self;
        }

        // Save the old transitions of each element so we can restore it later.
        var oldTransitions = {};

        var run = function(nextCall) {
            var bound = false;

            // Prepare the callback.
            var cb = function() {
                if (bound) {
                    self.unbind(transitionEnd, cb);
                }

                if (i > 0) {
                    self.each(function() {
                        this.style[support.transition] = (oldTransitions[this] || null);
                    });
                }

                if (typeof callback === 'function') {
                    callback.apply(self);
                }
                if (typeof nextCall === 'function') {
                    nextCall();
                }
            };

            if ((i > 0) && (transitionEnd) && ($.transit.useTransitionEnd)) {
                // Use the 'transitionend' event if it's available.
                bound = true;
                self.bind(transitionEnd, cb);
            } else {
                // Fallback to timers if the 'transitionend' event isn't supported.
                window.setTimeout(cb, i);
            }

            // Apply transitions.
            self.each(function() {
                if (i > 0) {
                    this.style[support.transition] = transitionValue;
                }
                $(this).css(properties);
            });
        };

        // Defer running. This allows the browser to paint any pending CSS it hasn't
        // painted yet before doing the transitions.
        var deferredRun = function(next) {
            this.offsetWidth; // force a repaint
            run(next);
        };

        // Use jQuery's fx queue.
        callOrQueue(self, queue, deferredRun);

        // Chainability.
        return this;
    };

    function registerCssHook(prop, isPixels) {
        // For certain properties, the 'px' should not be implied.
        if (!isPixels) {
            $.cssNumber[prop] = true;
        }

        $.transit.propertyMap[prop] = support.transform;

        $.cssHooks[prop] = {
            get: function(elem) {
                var t = $(elem).css('transit:transform');
                return t.get(prop);
            },
            set: function(elem, value) {
                var t = $(elem).css('transit:transform');
                t.setFromString(prop, value);

                $(elem).css({'transit:transform': t});
            }
        };

    }

    // ### uncamel(str)
    // Converts a camelcase string to a dasherized string.
    // (`marginLeft` => `margin-left`)
    function uncamel(str) {
        return str.replace(/([A-Z])/g, function(letter) {
            return '-' + letter.toLowerCase();
        });
    }

    // ### unit(number, unit)
    // Ensures that number `number` has a unit. If no unit is found, assume the
    // default is `unit`.
    //
    //     unit(2, 'px')          //=> "2px"
    //     unit("30deg", 'rad')   //=> "30deg"
    //
    function unit(i, units) {
        if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
            return i;
        } else {
            return "" + i + units;
        }
    }

    // ### toMS(duration)
    // Converts given `duration` to a millisecond string.
    //
    // toMS('fast') => $.fx.speeds[i] => "200ms"
    // toMS('normal') //=> $.fx.speeds._default => "400ms"
    // toMS(10) //=> '10ms'
    // toMS('100ms') //=> '100ms'  
    //
    function toMS(duration) {
        var i = duration;

        // Allow string durations like 'fast' and 'slow', without overriding numeric values.
        if (typeof i === 'string' && (!i.match(/^[\-0-9\.]+/))) {
            i = $.fx.speeds[i] || $.fx.speeds._default;
        }

        return unit(i, 'ms');
    }

    // Export some functions for testable-ness.
    $.transit.getTransitionValue = getTransition;
})(jQuery);
/*!
 * jQuery Validation Plugin 1.11.1
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright 2013 JÃ¶rn Zaefferer
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($) {

    $.extend($.fn, {
        // http://docs.jquery.com/Plugins/Validation/validate
        validate: function(options) {

            // if nothing is selected, return nothing; can't chain anyway
            if (!this.length) {
                if (options && options.debug && window.console) {
                    console.warn("Nothing selected, can't validate, returning nothing.");
                }
                return;
            }

            // check if a validator for this form was already created
            var validator = $.data(this[0], "validator");
            if (validator) {
                return validator;
            }

            // Add novalidate tag if HTML5.
            this.attr("novalidate", "novalidate");

            validator = new $.validator(options, this[0]);
            $.data(this[0], "validator", validator);

            if (validator.settings.onsubmit) {

                this.validateDelegate(":submit", "click", function(event) {
                    if (validator.settings.submitHandler) {
                        validator.submitButton = event.target;
                    }
                    // allow suppressing validation by adding a cancel class to the submit button
                    if ($(event.target).hasClass("cancel")) {
                        validator.cancelSubmit = true;
                    }

                    // allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
                    if ($(event.target).attr("formnovalidate") !== undefined) {
                        validator.cancelSubmit = true;
                    }
                });

                // validate the form on submit
                this.submit(function(event) {
                    if (validator.settings.debug) {
                        // prevent form submit to be able to see console output
                        event.preventDefault();
                    }
                    function handle() {
                        var hidden;
                        if (validator.settings.submitHandler) {
                            if (validator.submitButton) {
                                // insert a hidden input as a replacement for the missing submit button
                                hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val($(validator.submitButton).val()).appendTo(validator.currentForm);
                            }
                            validator.settings.submitHandler.call(validator, validator.currentForm, event);
                            if (validator.submitButton) {
                                // and clean up afterwards; thanks to no-block-scope, hidden can be referenced
                                hidden.remove();
                            }
                            return false;
                        }
                        return true;
                    }

                    // prevent submit for invalid forms or custom submit handlers
                    if (validator.cancelSubmit) {
                        validator.cancelSubmit = false;
                        return handle();
                    }
                    if (validator.form()) {
                        if (validator.pendingRequest) {
                            validator.formSubmitted = true;
                            return false;
                        }
                        return handle();
                    } else {
                        validator.focusInvalid();
                        return false;
                    }
                });
            }

            return validator;
        },
        // http://docs.jquery.com/Plugins/Validation/valid
        valid: function() {
            if ($(this[0]).is("form")) {
                return this.validate().form();
            } else {
                var valid = true;
                var validator = $(this[0].form).validate();
                this.each(function() {
                    valid = valid && validator.element(this);
                });
                return valid;
            }
        },
        // attributes: space seperated list of attributes to retrieve and remove
        removeAttrs: function(attributes) {
            var result = {},
                    $element = this;
            $.each(attributes.split(/\s/), function(index, value) {
                result[value] = $element.attr(value);
                $element.removeAttr(value);
            });
            return result;
        },
        // http://docs.jquery.com/Plugins/Validation/rules
        rules: function(command, argument) {
            var element = this[0];

            if (command) {
                var settings = $.data(element.form, "validator").settings;
                var staticRules = settings.rules;
                var existingRules = $.validator.staticRules(element);
                switch (command) {
                    case "add":
                        $.extend(existingRules, $.validator.normalizeRule(argument));
                        // remove messages from rules, but allow them to be set separetely
                        delete existingRules.messages;
                        staticRules[element.name] = existingRules;
                        if (argument.messages) {
                            settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages);
                        }
                        break;
                    case "remove":
                        if (!argument) {
                            delete staticRules[element.name];
                            return existingRules;
                        }
                        var filtered = {};
                        $.each(argument.split(/\s/), function(index, method) {
                            filtered[method] = existingRules[method];
                            delete existingRules[method];
                        });
                        return filtered;
                }
            }

            var data = $.validator.normalizeRules(
                    $.extend(
                    {},
                    $.validator.classRules(element),
                    $.validator.attributeRules(element),
                    $.validator.dataRules(element),
                    $.validator.staticRules(element)
                    ), element);

            // make sure required is at front
            if (data.required) {
                var param = data.required;
                delete data.required;
                data = $.extend({required: param}, data);
            }

            return data;
        }
    });

// Custom selectors
    $.extend($.expr[":"], {
        // http://docs.jquery.com/Plugins/Validation/blank
        blank: function(a) {
            return !$.trim("" + $(a).val());
        },
        // http://docs.jquery.com/Plugins/Validation/filled
        filled: function(a) {
            return !!$.trim("" + $(a).val());
        },
        // http://docs.jquery.com/Plugins/Validation/unchecked
        unchecked: function(a) {
            return !$(a).prop("checked");
        }
    });

// constructor for validator
    $.validator = function(options, form) {
        this.settings = $.extend(true, {}, $.validator.defaults, options);
        this.currentForm = form;
        this.init();
    };

    $.validator.format = function(source, params) {
        if (arguments.length === 1) {
            return function() {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply(this, args);
            };
        }
        if (arguments.length > 2 && params.constructor !== Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor !== Array) {
            params = [params];
        }
        $.each(params, function(i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function() {
                return n;
            });
        });
        return source;
    };

    $.extend($.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            validClass: "valid",
            errorElement: "label",
            focusInvalid: true,
            errorContainer: $([]),
            errorLabelContainer: $([]),
            onsubmit: true,
            ignore: ":hidden",
            ignoreTitle: false,
            onfocusin: function(element, event) {
                this.lastActive = element;

                // hide error label and remove error class on focus if enabled
                if (this.settings.focusCleanup && !this.blockFocusCleanup) {
                    if (this.settings.unhighlight) {
                        this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
                    }
                    this.addWrapper(this.errorsFor(element)).hide();
                }
            },
            onfocusout: function(element, event) {
                if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
                    this.element(element);
                }
            },
            onkeyup: function(element, event) {
                if (event.which === 9 && this.elementValue(element) === "") {
                    return;
                } else if (element.name in this.submitted || element === this.lastElement) {
                    this.element(element);
                }
            },
            onclick: function(element, event) {
                // click on selects, radiobuttons and checkboxes
                if (element.name in this.submitted) {
                    this.element(element);
                }
                // or option elements, check parent select in that case
                else if (element.parentNode.name in this.submitted) {
                    this.element(element.parentNode);
                }
            },
            highlight: function(element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                } else {
                    $(element).addClass(errorClass).removeClass(validClass);
                }
            },
            unhighlight: function(element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).removeClass(errorClass).addClass(validClass);
                } else {
                    $(element).removeClass(errorClass).addClass(validClass);
                }
            }
        },
        // http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
        setDefaults: function(settings) {
            $.extend($.validator.defaults, settings);
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            creditcard: "Please enter a valid credit card number.",
            equalTo: "Please enter the same value again.",
            maxlength: $.validator.format("Please enter no more than {0} characters."),
            minlength: $.validator.format("Please enter at least {0} characters."),
            rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
            range: $.validator.format("Please enter a value between {0} and {1}."),
            max: $.validator.format("Please enter a value less than or equal to {0}."),
            min: $.validator.format("Please enter a value greater than or equal to {0}.")
        },
        autoCreateRanges: false,
        prototype: {
            init: function() {
                this.labelContainer = $(this.settings.errorLabelContainer);
                this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
                this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
                this.submitted = {};
                this.valueCache = {};
                this.pendingRequest = 0;
                this.pending = {};
                this.invalid = {};
                this.reset();

                var groups = (this.groups = {});
                $.each(this.settings.groups, function(key, value) {
                    if (typeof value === "string") {
                        value = value.split(/\s/);
                    }
                    $.each(value, function(index, name) {
                        groups[name] = key;
                    });
                });
                var rules = this.settings.rules;
                $.each(rules, function(key, value) {
                    rules[key] = $.validator.normalizeRule(value);
                });

                function delegate(event) {
                    var validator = $.data(this[0].form, "validator"),
                            eventType = "on" + event.type.replace(/^validate/, "");
                    if (validator.settings[eventType]) {
                        validator.settings[eventType].call(validator, this[0], event);
                    }
                }
                $(this.currentForm)
                        .validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
                        "[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
                        "[type='email'], [type='datetime'], [type='date'], [type='month'], " +
                        "[type='week'], [type='time'], [type='datetime-local'], " +
                        "[type='range'], [type='color'] ",
                        "focusin focusout keyup", delegate)
                        .validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

                if (this.settings.invalidHandler) {
                    $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
                }
            },
            // http://docs.jquery.com/Plugins/Validation/Validator/form
            form: function() {
                this.checkForm();
                $.extend(this.submitted, this.errorMap);
                this.invalid = $.extend({}, this.errorMap);
                if (!this.valid()) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                }
                this.showErrors();
                return this.valid();
            },
            checkForm: function() {
                this.prepareForm();
                for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
                    this.check(elements[i]);
                }
                return this.valid();
            },
            // http://docs.jquery.com/Plugins/Validation/Validator/element
            element: function(element) {
                element = this.validationTargetFor(this.clean(element));
                this.lastElement = element;
                this.prepareElement(element);
                this.currentElements = $(element);
                var result = this.check(element) !== false;
                if (result) {
                    delete this.invalid[element.name];
                } else {
                    this.invalid[element.name] = true;
                }
                if (!this.numberOfInvalids()) {
                    // Hide error containers on last error
                    this.toHide = this.toHide.add(this.containers);
                }
                this.showErrors();
                return result;
            },
            // http://docs.jquery.com/Plugins/Validation/Validator/showErrors
            showErrors: function(errors) {
                if (errors) {
                    // add items to error list and map
                    $.extend(this.errorMap, errors);
                    this.errorList = [];
                    for (var name in errors) {
                        this.errorList.push({
                            message: errors[name],
                            element: this.findByName(name)[0]
                        });
                    }
                    // remove items from success list
                    this.successList = $.grep(this.successList, function(element) {
                        return !(element.name in errors);
                    });
                }
                if (this.settings.showErrors) {
                    this.settings.showErrors.call(this, this.errorMap, this.errorList);
                } else {
                    this.defaultShowErrors();
                }
            },
            // http://docs.jquery.com/Plugins/Validation/Validator/resetForm
            resetForm: function() {
                if ($.fn.resetForm) {
                    $(this.currentForm).resetForm();
                }
                this.submitted = {};
                this.lastElement = null;
                this.prepareForm();
                this.hideErrors();
                this.elements().removeClass(this.settings.errorClass).removeData("previousValue");
            },
            numberOfInvalids: function() {
                return this.objectLength(this.invalid);
            },
            objectLength: function(obj) {
                var count = 0;
                for (var i in obj) {
                    count++;
                }
                return count;
            },
            hideErrors: function() {
                this.addWrapper(this.toHide).hide();
            },
            valid: function() {
                return this.size() === 0;
            },
            size: function() {
                return this.errorList.length;
            },
            focusInvalid: function() {
                if (this.settings.focusInvalid) {
                    try {
                        $(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
                                .filter(":visible")
                                .focus()
                                // manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
                                .trigger("focusin");
                    } catch (e) {
                        // ignore IE throwing errors when focusing hidden elements
                    }
                }
            },
            findLastActive: function() {
                var lastActive = this.lastActive;
                return lastActive && $.grep(this.errorList, function(n) {
                    return n.element.name === lastActive.name;
                }).length === 1 && lastActive;
            },
            elements: function() {
                var validator = this,
                        rulesCache = {};

                // select all valid inputs inside the form (no submit or reset buttons)
                return $(this.currentForm)
                        .find("input, select, textarea")
                        .not(":submit, :reset, :image, [disabled]")
                        .not(this.settings.ignore)
                        .filter(function() {
                    if (!this.name && validator.settings.debug && window.console) {
                        console.error("%o has no name assigned", this);
                    }

                    // select only the first element for each name, and only those with rules specified
                    if (this.name in rulesCache || !validator.objectLength($(this).rules())) {
                        return false;
                    }

                    rulesCache[this.name] = true;
                    return true;
                });
            },
            clean: function(selector) {
                return $(selector)[0];
            },
            errors: function() {
                var errorClass = this.settings.errorClass.replace(" ", ".");
                return $(this.settings.errorElement + "." + errorClass, this.errorContext);
            },
            reset: function() {
                this.successList = [];
                this.errorList = [];
                this.errorMap = {};
                this.toShow = $([]);
                this.toHide = $([]);
                this.currentElements = $([]);
            },
            prepareForm: function() {
                this.reset();
                this.toHide = this.errors().add(this.containers);
            },
            prepareElement: function(element) {
                this.reset();
                this.toHide = this.errorsFor(element);
            },
            elementValue: function(element) {
                var type = $(element).attr("type"),
                        val = $(element).val();

                if (type === "radio" || type === "checkbox") {
                    return $("input[name='" + $(element).attr("name") + "']:checked").val();
                }

                if (typeof val === "string") {
                    return val.replace(/\r/g, "");
                }
                return val;
            },
            check: function(element) {
                element = this.validationTargetFor(this.clean(element));

                var rules = $(element).rules();
                var dependencyMismatch = false;
                var val = this.elementValue(element);
                var result;

                for (var method in rules) {
                    var rule = {method: method, parameters: rules[method]};
                    try {

                        result = $.validator.methods[method].call(this, val, element, rule.parameters);

                        // if a method indicates that the field is optional and therefore valid,
                        // don't mark it as valid when there are no other rules
                        if (result === "dependency-mismatch") {
                            dependencyMismatch = true;
                            continue;
                        }
                        dependencyMismatch = false;

                        if (result === "pending") {
                            this.toHide = this.toHide.not(this.errorsFor(element));
                            return;
                        }

                        if (!result) {
                            this.formatAndAdd(element, rule);
                            return false;
                        }
                    } catch (e) {
                        if (this.settings.debug && window.console) {
                            console.log("Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e);
                        }
                        throw e;
                    }
                }
                if (dependencyMismatch) {
                    return;
                }
                if (this.objectLength(rules)) {
                    this.successList.push(element);
                }
                return true;
            },
            // return the custom message for the given element and validation method
            // specified in the element's HTML5 data attribute
            customDataMessage: function(element, method) {
                return $(element).data("msg-" + method.toLowerCase()) || (element.attributes && $(element).attr("data-msg-" + method.toLowerCase()));
            },
            // return the custom message for the given element name and validation method
            customMessage: function(name, method) {
                var m = this.settings.messages[name];
                return m && (m.constructor === String ? m : m[method]);
            },
            // return the first defined argument, allowing empty strings
            findDefined: function() {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] !== undefined) {
                        return arguments[i];
                    }
                }
                return undefined;
            },
            defaultMessage: function(element, method) {
                return this.findDefined(
                        this.customMessage(element.name, method),
                        this.customDataMessage(element, method),
                        // title is never undefined, so handle empty string as undefined
                        !this.settings.ignoreTitle && element.title || undefined,
                        $.validator.messages[method],
                        "<strong>Warning: No message defined for " + element.name + "</strong>"
                        );
            },
            formatAndAdd: function(element, rule) {
                var message = this.defaultMessage(element, rule.method),
                        theregex = /\$?\{(\d+)\}/g;
                if (typeof message === "function") {
                    message = message.call(this, rule.parameters, element);
                } else if (theregex.test(message)) {
                    message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
                }
                this.errorList.push({
                    message: message,
                    element: element
                });

                this.errorMap[element.name] = message;
                this.submitted[element.name] = message;
            },
            addWrapper: function(toToggle) {
                if (this.settings.wrapper) {
                    toToggle = toToggle.add(toToggle.parent(this.settings.wrapper));
                }
                return toToggle;
            },
            defaultShowErrors: function() {
                var i, elements;
                for (i = 0; this.errorList[i]; i++) {
                    var error = this.errorList[i];
                    if (this.settings.highlight) {
                        this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
                    }
                    this.showLabel(error.element, error.message);
                }
                if (this.errorList.length) {
                    this.toShow = this.toShow.add(this.containers);
                }
                if (this.settings.success) {
                    for (i = 0; this.successList[i]; i++) {
                        this.showLabel(this.successList[i]);
                    }
                }
                if (this.settings.unhighlight) {
                    for (i = 0, elements = this.validElements(); elements[i]; i++) {
                        this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
                    }
                }
                this.toHide = this.toHide.not(this.toShow);
                this.hideErrors();
                this.addWrapper(this.toShow).show();
            },
            validElements: function() {
                return this.currentElements.not(this.invalidElements());
            },
            invalidElements: function() {
                return $(this.errorList).map(function() {
                    return this.element;
                });
            },
            showLabel: function(element, message) {
                var label = this.errorsFor(element);
                if (label.length) {
                    // refresh error/success class
                    label.removeClass(this.settings.validClass).addClass(this.settings.errorClass);
                    // replace message on existing label
                    label.html(message);
                } else {
                    // create label
                    label = $("<" + this.settings.errorElement + ">")
                            .attr("for", this.idOrName(element))
                            .addClass(this.settings.errorClass)
                            .html(message || "");
                    if (this.settings.wrapper) {
                        // make sure the element is visible, even in IE
                        // actually showing the wrapped element is handled elsewhere
                        label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
                    }
                    if (!this.labelContainer.append(label).length) {
                        if (this.settings.errorPlacement) {
                            this.settings.errorPlacement(label, $(element));
                        } else {
                            label.insertAfter(element);
                        }
                    }
                }
                if (!message && this.settings.success) {
                    label.text("");
                    if (typeof this.settings.success === "string") {
                        label.addClass(this.settings.success);
                    } else {
                        this.settings.success(label, element);
                    }
                }
                this.toShow = this.toShow.add(label);
            },
            errorsFor: function(element) {
                var name = this.idOrName(element);
                return this.errors().filter(function() {
                    return $(this).attr("for") === name;
                });
            },
            idOrName: function(element) {
                return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
            },
            validationTargetFor: function(element) {
                // if radio/checkbox, validate first element in group instead
                if (this.checkable(element)) {
                    element = this.findByName(element.name).not(this.settings.ignore)[0];
                }
                return element;
            },
            checkable: function(element) {
                return (/radio|checkbox/i).test(element.type);
            },
            findByName: function(name) {
                return $(this.currentForm).find("[name='" + name + "']");
            },
            getLength: function(value, element) {
                switch (element.nodeName.toLowerCase()) {
                    case "select":
                        return $("option:selected", element).length;
                    case "input":
                        if (this.checkable(element)) {
                            return this.findByName(element.name).filter(":checked").length;
                        }
                }
                return value.length;
            },
            depend: function(param, element) {
                return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
            },
            dependTypes: {
                "boolean": function(param, element) {
                    return param;
                },
                "string": function(param, element) {
                    return !!$(param, element.form).length;
                },
                "function": function(param, element) {
                    return param(element);
                }
            },
            optional: function(element) {
                var val = this.elementValue(element);
                return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
            },
            startRequest: function(element) {
                if (!this.pending[element.name]) {
                    this.pendingRequest++;
                    this.pending[element.name] = true;
                }
            },
            stopRequest: function(element, valid) {
                this.pendingRequest--;
                // sometimes synchronization fails, make sure pendingRequest is never < 0
                if (this.pendingRequest < 0) {
                    this.pendingRequest = 0;
                }
                delete this.pending[element.name];
                if (valid && this.pendingRequest === 0 && this.formSubmitted && this.form()) {
                    $(this.currentForm).submit();
                    this.formSubmitted = false;
                } else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                    this.formSubmitted = false;
                }
            },
            previousValue: function(element) {
                return $.data(element, "previousValue") || $.data(element, "previousValue", {
                    old: null,
                    valid: true,
                    message: this.defaultMessage(element, "remote")
                });
            }

        },
        classRuleSettings: {
            required: {required: true},
            email: {email: true},
            url: {url: true},
            date: {date: true},
            dateISO: {dateISO: true},
            number: {number: true},
            digits: {digits: true},
            creditcard: {creditcard: true}
        },
        addClassRules: function(className, rules) {
            if (className.constructor === String) {
                this.classRuleSettings[className] = rules;
            } else {
                $.extend(this.classRuleSettings, className);
            }
        },
        classRules: function(element) {
            var rules = {};
            var classes = $(element).attr("class");
            if (classes) {
                $.each(classes.split(" "), function() {
                    if (this in $.validator.classRuleSettings) {
                        $.extend(rules, $.validator.classRuleSettings[this]);
                    }
                });
            }
            return rules;
        },
        attributeRules: function(element) {
            var rules = {};
            var $element = $(element);
            var type = $element[0].getAttribute("type");

            for (var method in $.validator.methods) {
                var value;

                // support for <input required> in both html5 and older browsers
                if (method === "required") {
                    value = $element.get(0).getAttribute(method);
                    // Some browsers return an empty string for the required attribute
                    // and non-HTML5 browsers might have required="" markup
                    if (value === "") {
                        value = true;
                    }
                    // force non-HTML5 browsers to return bool
                    value = !!value;
                } else {
                    value = $element.attr(method);
                }

                // convert the value to a number for number inputs, and for text for backwards compability
                // allows type="date" and others to be compared as strings
                if (/min|max/.test(method) && (type === null || /number|range|text/.test(type))) {
                    value = Number(value);
                }

                if (value) {
                    rules[method] = value;
                } else if (type === method && type !== 'range') {
                    // exception: the jquery validate 'range' method
                    // does not test for the html5 'range' type
                    rules[method] = true;
                }
            }

            // maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
            if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
                delete rules.maxlength;
            }

            return rules;
        },
        dataRules: function(element) {
            var method, value,
                    rules = {}, $element = $(element);
            for (method in $.validator.methods) {
                value = $element.data("rule-" + method.toLowerCase());
                if (value !== undefined) {
                    rules[method] = value;
                }
            }
            return rules;
        },
        staticRules: function(element) {
            var rules = {};
            var validator = $.data(element.form, "validator");
            if (validator.settings.rules) {
                rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
            }
            return rules;
        },
        normalizeRules: function(rules, element) {
            // handle dependency check
            $.each(rules, function(prop, val) {
                // ignore rule when param is explicitly false, eg. required:false
                if (val === false) {
                    delete rules[prop];
                    return;
                }
                if (val.param || val.depends) {
                    var keepRule = true;
                    switch (typeof val.depends) {
                        case "string":
                            keepRule = !!$(val.depends, element.form).length;
                            break;
                        case "function":
                            keepRule = val.depends.call(element, element);
                            break;
                    }
                    if (keepRule) {
                        rules[prop] = val.param !== undefined ? val.param : true;
                    } else {
                        delete rules[prop];
                    }
                }
            });

            // evaluate parameters
            $.each(rules, function(rule, parameter) {
                rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
            });

            // clean number parameters
            $.each(['minlength', 'maxlength'], function() {
                if (rules[this]) {
                    rules[this] = Number(rules[this]);
                }
            });
            $.each(['rangelength', 'range'], function() {
                var parts;
                if (rules[this]) {
                    if ($.isArray(rules[this])) {
                        rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
                    } else if (typeof rules[this] === "string") {
                        parts = rules[this].split(/[\s,]+/);
                        rules[this] = [Number(parts[0]), Number(parts[1])];
                    }
                }
            });

            if ($.validator.autoCreateRanges) {
                // auto-create ranges
                if (rules.min && rules.max) {
                    rules.range = [rules.min, rules.max];
                    delete rules.min;
                    delete rules.max;
                }
                if (rules.minlength && rules.maxlength) {
                    rules.rangelength = [rules.minlength, rules.maxlength];
                    delete rules.minlength;
                    delete rules.maxlength;
                }
            }

            return rules;
        },
        // Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
        normalizeRule: function(data) {
            if (typeof data === "string") {
                var transformed = {};
                $.each(data.split(/\s/), function() {
                    transformed[this] = true;
                });
                data = transformed;
            }
            return data;
        },
        // http://docs.jquery.com/Plugins/Validation/Validator/addMethod
        addMethod: function(name, method, message) {
            $.validator.methods[name] = method;
            $.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
            if (method.length < 3) {
                $.validator.addClassRules(name, $.validator.normalizeRule(name));
            }
        },
        methods: {
            // http://docs.jquery.com/Plugins/Validation/Methods/required
            required: function(value, element, param) {
                // check if dependency is met
                if (!this.depend(param, element)) {
                    return "dependency-mismatch";
                }
                if (element.nodeName.toLowerCase() === "select") {
                    // could be an array for select-multiple or a string, both are fine this way
                    var val = $(element).val();
                    return val && val.length > 0;
                }
                if (this.checkable(element)) {
                    return this.getLength(value, element) > 0;
                }
                return $.trim(value).length > 0;
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/email
            email: function(value, element) {
                // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
                return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/url
            url: function(value, element) {
                // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
                return this.optional(element) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/date
            date: function(value, element) {
                return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/dateISO
            dateISO: function(value, element) {
                return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/number
            number: function(value, element) {
                return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/digits
            digits: function(value, element) {
                return this.optional(element) || /^\d+$/.test(value);
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/creditcard
            // based on http://en.wikipedia.org/wiki/Luhn
            creditcard: function(value, element) {
                if (this.optional(element)) {
                    return "dependency-mismatch";
                }
                // accept only spaces, digits and dashes
                if (/[^0-9 \-]+/.test(value)) {
                    return false;
                }
                var nCheck = 0,
                        nDigit = 0,
                        bEven = false;

                value = value.replace(/\D/g, "");

                for (var n = value.length - 1; n >= 0; n--) {
                    var cDigit = value.charAt(n);
                    nDigit = parseInt(cDigit, 10);
                    if (bEven) {
                        if ((nDigit *= 2) > 9) {
                            nDigit -= 9;
                        }
                    }
                    nCheck += nDigit;
                    bEven = !bEven;
                }

                return (nCheck % 10) === 0;
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/minlength
            minlength: function(value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);
                return this.optional(element) || length >= param;
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/maxlength
            maxlength: function(value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);
                return this.optional(element) || length <= param;
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/rangelength
            rangelength: function(value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);
                return this.optional(element) || (length >= param[0] && length <= param[1]);
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/min
            min: function(value, element, param) {
                return this.optional(element) || value >= param;
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/max
            max: function(value, element, param) {
                return this.optional(element) || value <= param;
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/range
            range: function(value, element, param) {
                return this.optional(element) || (value >= param[0] && value <= param[1]);
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/equalTo
            equalTo: function(value, element, param) {
                // bind to the blur event of the target in order to revalidate whenever the target field is updated
                // TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
                var target = $(param);
                if (this.settings.onfocusout) {
                    target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                        $(element).valid();
                    });
                }
                return value === target.val();
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/remote
            remote: function(value, element, param) {
                if (this.optional(element)) {
                    return "dependency-mismatch";
                }

                var previous = this.previousValue(element);
                if (!this.settings.messages[element.name]) {
                    this.settings.messages[element.name] = {};
                }
                previous.originalMessage = this.settings.messages[element.name].remote;
                this.settings.messages[element.name].remote = previous.message;

                param = typeof param === "string" && {url: param} || param;

                if (previous.old === value) {
                    return previous.valid;
                }

                previous.old = value;
                var validator = this;
                this.startRequest(element);
                var data = {};
                data[element.name] = value;
                $.ajax($.extend(true, {
                    url: param,
                    mode: "abort",
                    port: "validate" + element.name,
                    dataType: "json",
                    data: data,
                    success: function(response) {
                        validator.settings.messages[element.name].remote = previous.originalMessage;
                        var valid = response === true || response === "true";
                        if (valid) {
                            var submitted = validator.formSubmitted;
                            validator.prepareElement(element);
                            validator.formSubmitted = submitted;
                            validator.successList.push(element);
                            delete validator.invalid[element.name];
                            validator.showErrors();
                        } else {
                            var errors = {};
                            var message = response || validator.defaultMessage(element, "remote");
                            errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
                            validator.invalid[element.name] = true;
                            validator.showErrors(errors);
                        }
                        previous.valid = valid;
                        validator.stopRequest(element, valid);
                    }
                }, param));
                return "pending";
            }

        }

    });

// deprecated, use $.validator.format instead
    $.format = $.validator.format;

}(jQuery));

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
(function($) {
    var pendingRequests = {};
    // Use a prefilter if available (1.5+)
    if ($.ajaxPrefilter) {
        $.ajaxPrefilter(function(settings, _, xhr) {
            var port = settings.port;
            if (settings.mode === "abort") {
                if (pendingRequests[port]) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = xhr;
            }
        });
    } else {
        // Proxy ajax
        var ajax = $.ajax;
        $.ajax = function(settings) {
            var mode = ("mode" in settings ? settings : $.ajaxSettings).mode,
                    port = ("port" in settings ? settings : $.ajaxSettings).port;
            if (mode === "abort") {
                if (pendingRequests[port]) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = ajax.apply(this, arguments);
                return pendingRequests[port];
            }
            return ajax.apply(this, arguments);
        };
    }
}(jQuery));

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
(function($) {
    $.extend($.fn, {
        validateDelegate: function(delegate, type, handler) {
            return this.bind(type, function(event) {
                var target = $(event.target);
                if (target.is(delegate)) {
                    return handler.apply(target, arguments);
                }
            });
        }
    });
}(jQuery));/*
 * Viewport - jQuery selectors for finding elements in viewport
 *
 * Copyright (c) 2008-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *  http://www.appelsiini.net/projects/viewport
 *
 */
(function($) {

    $.belowthefold = function(element, settings) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var top = $(window).scrollTop();
        return top >= $(element).offset().top + $(element).height() - settings.threshold;
    };

    $.rightofscreen = function(element, settings) {
        var fold = $(window).width() + $(window).scrollLeft();
        return fold <= $(element).offset().left - settings.threshold;
    };

    $.leftofscreen = function(element, settings) {
        var left = $(window).scrollLeft();
        return left >= $(element).offset().left + $(element).width() - settings.threshold;
    };

    $.inviewport = function(element, settings) {
        return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };

    $.extend($.expr[':'], {
        "below-the-fold": function(a, i, m) {
            return $.belowthefold(a, {threshold: 0});
        },
        "above-the-top": function(a, i, m) {
            return $.abovethetop(a, {threshold: 0});
        },
        "left-of-screen": function(a, i, m) {
            return $.leftofscreen(a, {threshold: 0});
        },
        "right-of-screen": function(a, i, m) {
            return $.rightofscreen(a, {threshold: 0});
        },
        "in-viewport": function(a, i, m) {
            return $.inviewport(a, {threshold: 0});
        }
    });


})(jQuery);
// jQuery.XDomainRequest.js
// Author: Jason Moon - @JSONMOON
// IE8+
if (!jQuery.support.cors && jQuery.ajaxTransport && window.XDomainRequest) {
    var httpRegEx = /^https?:\/\//i;
    var getOrPostRegEx = /^get|post$/i;
    var sameSchemeRegEx = new RegExp('^' + location.protocol, 'i');
    var htmlRegEx = /text\/html/i;
    var jsonRegEx = /\/json/i;
    var xmlRegEx = /\/xml/i;

    // ajaxTransport exists in jQuery 1.5+
    jQuery.ajaxTransport('text html xml json', function(options, userOptions, jqXHR) {
        // XDomainRequests must be: asynchronous, GET or POST methods, HTTP or HTTPS protocol, and same scheme as calling page
        if (options.crossDomain && options.async && getOrPostRegEx.test(options.type) && httpRegEx.test(options.url) && sameSchemeRegEx.test(options.url)) {
            var xdr = null;
            var userType = (userOptions.dataType || '').toLowerCase();
            return {
                send: function(headers, complete) {
                    xdr = new XDomainRequest();
                    if (/^\d+$/.test(userOptions.timeout)) {
                        xdr.timeout = userOptions.timeout;
                    }
                    xdr.ontimeout = function() {
                        complete(500, 'timeout');
                    };
                    xdr.onload = function() {
                        var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
                        var status = {
                            code: 200,
                            message: 'success'
                        };
                        var responses = {
                            text: xdr.responseText
                        };
                        try {
                            if (userType === 'html' || htmlRegEx.test(xdr.contentType)) {
                                responses.html = xdr.responseText;
                            } else if (userType === 'json' || (userType !== 'text' && jsonRegEx.test(xdr.contentType))) {
                                try {
                                    responses.json = jQuery.parseJSON(xdr.responseText);
                                } catch (e) {
                                    status.code = 500;
                                    status.message = 'parseerror';
                                    //throw 'Invalid JSON: ' + xdr.responseText;
                                }
                            } else if (userType === 'xml' || (userType !== 'text' && xmlRegEx.test(xdr.contentType))) {
                                var doc = new ActiveXObject('Microsoft.XMLDOM');
                                doc.async = false;
                                try {
                                    doc.loadXML(xdr.responseText);
                                } catch (e) {
                                    doc = undefined;
                                }
                                if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
                                    status.code = 500;
                                    status.message = 'parseerror';
                                    throw 'Invalid XML: ' + xdr.responseText;
                                }
                                responses.xml = doc;
                            }
                        } catch (parseMessage) {
                            throw parseMessage;
                        } finally {
                            complete(status.code, status.message, responses, allResponseHeaders);
                        }
                    };
                    // set an empty handler for 'onprogress' so requests don't get aborted
                    xdr.onprogress = function() {
                    };
                    xdr.onerror = function() {
                        complete(500, 'error', {
                            text: xdr.responseText
                        });
                    };
                    var postData = '';
                    if (userOptions.data) {
                        postData = (jQuery.type(userOptions.data) === 'string') ? userOptions.data : jQuery.param(userOptions.data);
                    }
                    xdr.open(options.type, options.url);
                    xdr.send(postData);
                },
                abort: function() {
                    if (xdr) {
                        xdr.abort();
                    }
                }
            };
        }
    });
}
// retina.js, a high-resolution image swapper (http://retinajs.com), v0.0.2

(function() {
    function t(e) {
        this.path = e;
        var t = this.path.split("."), n = t.slice(0, t.length - 1).join("."), r = t[t.length - 1];
        this.at_2x_path = n + "@2x." + r
    }
    function n(e) {
        this.el = e, this.path = new t(this.el.getAttribute("src"));
        var n = this;
        this.path.check_2x_variant(function(e) {
            e && n.swap()
        })
    }
    var e = typeof exports == "undefined" ? window : exports;
    e.RetinaImagePath = t, t.confirmed_paths = [], t.prototype.is_external = function() {
        return!!this.path.match(/^https?\:/i) && !this.path.match("//" + document.domain)
    }, t.prototype.check_2x_variant = function(e) {
        var n, r = this;
        if (this.is_external())
            return e(!1);
        if (this.at_2x_path in t.confirmed_paths)
            return e(!0);
        n = new XMLHttpRequest, n.open("HEAD", this.at_2x_path), n.onreadystatechange = function() {
            return n.readyState != 4 ? e(!1) : n.status >= 200 && n.status <= 399 ? (t.confirmed_paths.push(r.at_2x_path), e(!0)) : e(!1)
        }, n.send()
    }, e.RetinaImage = n, n.prototype.swap = function(e) {
        function n() {
            t.el.complete ? (t.el.setAttribute("width", t.el.offsetWidth), t.el.setAttribute("height", t.el.offsetHeight), t.el.setAttribute("src", e)) : setTimeout(n, 5)
        }
        typeof e == "undefined" && (e = this.path.at_2x_path);
        var t = this;
        n()
    }, e.devicePixelRatio > 1 && (window.onload = function() {
        var e = document.getElementsByTagName("img"), t = [], r, i;
        for (r = 0; r < e.length; r++)
            i = e[r], t.push(new n(i))
    })
})();/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 1.3.0
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2013, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    $.timeago = function(timestamp) {
        if (timestamp instanceof Date) {
            return inWords(timestamp);
        } else if (typeof timestamp === "string") {
            return inWords($.timeago.parse(timestamp));
        } else if (typeof timestamp === "number") {
            return inWords(new Date(timestamp));
        } else {
            return inWords($.timeago.datetime(timestamp));
        }
    };
    var $t = $.timeago;

    $.extend($.timeago, {
        settings: {
            refreshMillis: 60000,
            allowFuture: false,
            localeTitle: false,
            cutoff: 0,
            strings: {
                prefixAgo: null,
                prefixFromNow: null,
                suffixAgo: "ago",
                suffixFromNow: "from now",
                seconds: "less than a minute",
                minute: "about a minute",
                minutes: "%d minutes",
                hour: "about an hour",
                hours: "about %d hours",
                day: "a day",
                days: "%d days",
                month: "about a month",
                months: "%d months",
                year: "about a year",
                years: "%d years",
                wordSeparator: " ",
                numbers: []
            }
        },
        inWords: function(distanceMillis) {
            var $l = this.settings.strings;
            var prefix = $l.prefixAgo;
            var suffix = $l.suffixAgo;
            if (this.settings.allowFuture) {
                if (distanceMillis < 0) {
                    prefix = $l.prefixFromNow;
                    suffix = $l.suffixFromNow;
                }
            }

            var seconds = Math.abs(distanceMillis) / 1000;
            var minutes = seconds / 60;
            var hours = minutes / 60;
            var days = hours / 24;
            var years = days / 365;

            function substitute(stringOrFunction, number) {
                var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
                var value = ($l.numbers && $l.numbers[number]) || number;
                return string.replace(/%d/i, value);
            }

            var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
                    seconds < 90 && substitute($l.minute, 1) ||
                    minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
                    minutes < 90 && substitute($l.hour, 1) ||
                    hours < 24 && substitute($l.hours, Math.round(hours)) ||
                    hours < 42 && substitute($l.day, 1) ||
                    days < 30 && substitute($l.days, Math.round(days)) ||
                    days < 45 && substitute($l.month, 1) ||
                    days < 365 && substitute($l.months, Math.round(days / 30)) ||
                    years < 1.5 && substitute($l.year, 1) ||
                    substitute($l.years, Math.round(years));

            var separator = $l.wordSeparator || "";
            if ($l.wordSeparator === undefined) {
                separator = " ";
            }
            return $.trim([prefix, words, suffix].join(separator));
        },
        parse: function(iso8601) {
            var s = $.trim(iso8601);
            s = s.replace(/\.\d+/, ""); // remove milliseconds
            s = s.replace(/-/, "/").replace(/-/, "/");
            s = s.replace(/T/, " ").replace(/Z/, " UTC");
            s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
            return new Date(s);
        },
        datetime: function(elem) {
            var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
            return $t.parse(iso8601);
        },
        isTime: function(elem) {
            // jQuery's `is()` doesn't play well with HTML5 in IE
            return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
        }
    });

    // functions that can be called via $(el).timeago('action')
    // init is default when no action is given
    // functions are called with context of a single element
    var functions = {
        init: function() {
            var refresh_el = $.proxy(refresh, this);
            refresh_el();
            var $s = $t.settings;
            if ($s.refreshMillis > 0) {
                setInterval(refresh_el, $s.refreshMillis);
            }
        },
        update: function(time) {
            $(this).data('timeago', {datetime: $t.parse(time)});
            refresh.apply(this);
        },
        updateFromDOM: function() {
            $(this).data('timeago', {datetime: $t.parse($t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title"))});
            refresh.apply(this);
        }
    };

    $.fn.timeago = function(action, options) {
        var fn = action ? functions[action] : functions.init;
        if (!fn) {
            throw new Error("Unknown function name '" + action + "' for timeago");
        }
        // each over objects here and call the requested function
        this.each(function() {
            fn.call(this, options);
        });
        return this;
    };

    function refresh() {
        var data = prepareData(this);
        var $s = $t.settings;

        if (!isNaN(data.datetime)) {
            if ($s.cutoff == 0 || distance(data.datetime) < $s.cutoff) {
                $(this).text(inWords(data.datetime));
            }
        }
        return this;
    }

    function prepareData(element) {
        element = $(element);
        if (!element.data("timeago")) {
            element.data("timeago", {datetime: $t.datetime(element)});
            var text = $.trim(element.text());
            if ($t.settings.localeTitle) {
                element.attr("title", element.data('timeago').datetime.toLocaleString());
            } else if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
                element.attr("title", text);
            }
        }
        return element.data("timeago");
    }

    function inWords(date) {
        return $t.inWords(distance(date));
    }

    function distance(date) {
        return (new Date().getTime() - date.getTime());
    }

    // fix for IE6 suckage
    document.createElement("abbr");
    document.createElement("time");
}));/*
 * tweetable 1.7.1 - jQuery twitter feed plugin
 *
 * Copyright (c) 2009 Philip Beel (http://www.theodin.co.uk/)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * With modifications from Philipp Robbel (http://www.robbel.com/) & Patrick DW (stackoverflow)
 *
 * Revision: $Id: jquery.tweetable.js 2013-06-16 $ 
 *
 */

(function($) {

    //Cross-Origin Resource Sharing enable, ie bug fix for tweetable plugin
    jQuery.support.cors = true;

    jQuery.fn.tweetable = function(opts) {
        opts = $.extend({}, $.fn.tweetable.options, opts);

        return this.each(function() {

            var act = jQuery(this)
                    , tweetList = jQuery('<ul class="tweetList footer-recent-tweets">')[opts.position.toLowerCase() + 'To'](act)
                    , shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                    , api = "http://api.getmytweets.co.uk/?screenname="
                    , limitcount = "&limit="
                    , twitterError
                    , tweetMonth
                    , tweetMonthInt
                    , iterate
                    , element;

            // Fire JSON request to twitter API
            jQuery.getJSON(api + opts.username + limitcount + opts.limit, act, function(data) {
                $('.footer-recent-tweets-container .loading').hide();
                // Check for response error
                twitterError = data && data.error || null;

                if (twitterError)
                {
                    tweetList.append('<li class="tweet_content item"><p class="tweet_link">' + opts.failed + '</p></li>');
                    return;
                }

                // Loop through twitter API response
                jQuery.each(data.tweets, function(i, tweet) {

                    // Output tweets if less than limit
                    if (i >= opts.limit)
                        return;

                    tweetList.append('<li class="tweet_content_' + i + '"><p class="tweet_link_' + i + '">' + tweet.response.replace(/#(.*?)(\s|$)/g, '<span class="hash">#$1 </span>').replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$&">$&</a> ').replace(/@(.*?)(\s|\(|\)|$)/g, '<a href="http://twitter.com/$1">@$1 </a>$2').replace(/:">/, ' ">').replace(/: <\/a>/, '</a>:') + '</p></li>');

                    // Display the time of tweet if required
                    if (opts.time === true) {
                        for (iterate = 0; iterate <= 12; iterate++) {
                            if (shortMonths[iterate] === tweet.tweet_date.substr(4, 3)) {
                                tweetMonthInt = iterate + 1;
                                tweetMonth = (tweetMonthInt < 10) ? '0' + tweetMonthInt : tweetMonthInt;
                            }
                        }
                        // Create ISO 8601 formatted date
                        var iso8601 = tweet.tweet_date.substr(26, 4) + '-' + tweetMonth + '-' + tweet.tweet_date.substr(8, 2) + 'T' + tweet.tweet_date.substr(11, 8) + 'Z';
                        jQuery('.tweet_link_' + i).append('<p class="timestamp"><'
                                + ((opts.html5) ? 'time datetime="' + iso8601 + '"' : 'small')
                                + '> ' + tweet.tweet_date.substr(8, 2) + '/' + tweetMonth + '/' + tweet.tweet_date.substr(26, 4) + ', ' + tweet.tweet_date.substr(11, 5) + '</'
                                + ((opts.html5) ? 'time' : 'small') +
                                '></p>');
                    }
                })

                // Display one tweet and retweet
                if (opts.rotate === true) {

                    var listItem = tweetList.find('li')
                            , listLength = listItem.length || null
                            , current = 0
                            , timeout = opts.speed;

                    if (!listLength)
                        return

                    // Rotate the tweets one at a time
                    function rotateTweets() {
                        listItem.eq(current++).fadeOut(400, function() {
                            current = (current === listLength) ? 0 : current;
                            listItem.eq(current).fadeIn(400);
                        });
                    }
                    //Hide all but the first tweet
                    listItem.slice(1).hide();

                    //Rotate tweets at specified interval
                    setInterval(rotateTweets, timeout);
                }
                opts.onComplete(tweetList);
            }).error(function(jqXHR, textStatus, errorThrown) {
            });
            ;
        });
    };

    // Define plugin defaults
    $.fn.tweetable.options = {
        limit: 5, // Number of tweets to show
        username: 'philipbeel', // @username tweets to display
        time: false, // Display date
        rotate: false, // Rotate tweets
        speed: 5000, // Speed of rotation
        replies: false, // Filter out @replys
        position: 'append', // Append position
        failed: "No tweets available", // Twitter stream unavailable text
        html5: false, // HTML5 Support
        retweets: false, // Show retweets
        onComplete: function($ul) {
        }    // On complete callback
    };

})(jQuery);
// Generated by CoffeeScript 1.6.2
/*
 jQuery Waypoints - v2.0.2
 Copyright (c) 2011-2013 Caleb Troughton
 Dual licensed under the MIT license and GPL license.
 https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
 */


(function() {
    var __indexOf = [].indexOf || function(item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item)
                return i;
        }
        return -1;
    },
            __slice = [].slice;

    (function(root, factory) {
        if (typeof define === 'function' && define.amd) {
            return define('waypoints', ['jquery'], function($) {
                return factory($, root);
            });
        } else {
            return factory(root.jQuery, root);
        }
    })(this, function($, window) {
        var $w, Context, Waypoint, allWaypoints, contextCounter, contextKey, contexts, isTouch, jQMethods, methods, resizeEvent, scrollEvent, waypointCounter, waypointKey, wp, wps;

        $w = $(window);
        isTouch = __indexOf.call(window, 'ontouchstart') >= 0;
        allWaypoints = {
            horizontal: {},
            vertical: {}
        };
        contextCounter = 1;
        contexts = {};
        contextKey = 'waypoints-context-id';
        resizeEvent = 'resize.waypoints';
        scrollEvent = 'scroll.waypoints';
        waypointCounter = 1;
        waypointKey = 'waypoints-waypoint-ids';
        wp = 'waypoint';
        wps = 'waypoints';
        Context = (function() {
            function Context($element) {
                var _this = this;

                this.$element = $element;
                this.element = $element[0];
                this.didResize = false;
                this.didScroll = false;
                this.id = 'context' + contextCounter++;
                this.oldScroll = {
                    x: $element.scrollLeft(),
                    y: $element.scrollTop()
                };
                this.waypoints = {
                    horizontal: {},
                    vertical: {}
                };
                $element.data(contextKey, this.id);
                contexts[this.id] = this;
                $element.bind(scrollEvent, function() {
                    var scrollHandler;

                    if (!(_this.didScroll || isTouch)) {
                        _this.didScroll = true;
                        scrollHandler = function() {
                            _this.doScroll();
                            return _this.didScroll = false;
                        };
                        return window.setTimeout(scrollHandler, $[wps].settings.scrollThrottle);
                    }
                });
                $element.bind(resizeEvent, function() {
                    var resizeHandler;

                    if (!_this.didResize) {
                        _this.didResize = true;
                        resizeHandler = function() {
                            $[wps]('refresh');
                            return _this.didResize = false;
                        };
                        return window.setTimeout(resizeHandler, $[wps].settings.resizeThrottle);
                    }
                });
            }

            Context.prototype.doScroll = function() {
                var axes,
                        _this = this;

                axes = {
                    horizontal: {
                        newScroll: this.$element.scrollLeft(),
                        oldScroll: this.oldScroll.x,
                        forward: 'right',
                        backward: 'left'
                    },
                    vertical: {
                        newScroll: this.$element.scrollTop(),
                        oldScroll: this.oldScroll.y,
                        forward: 'down',
                        backward: 'up'
                    }
                };
                if (isTouch && (!axes.vertical.oldScroll || !axes.vertical.newScroll)) {
                    $[wps]('refresh');
                }
                $.each(axes, function(aKey, axis) {
                    var direction, isForward, triggered;

                    triggered = [];
                    isForward = axis.newScroll > axis.oldScroll;
                    direction = isForward ? axis.forward : axis.backward;
                    $.each(_this.waypoints[aKey], function(wKey, waypoint) {
                        var _ref, _ref1;

                        if ((axis.oldScroll < (_ref = waypoint.offset) && _ref <= axis.newScroll)) {
                            return triggered.push(waypoint);
                        } else if ((axis.newScroll < (_ref1 = waypoint.offset) && _ref1 <= axis.oldScroll)) {
                            return triggered.push(waypoint);
                        }
                    });
                    triggered.sort(function(a, b) {
                        return a.offset - b.offset;
                    });
                    if (!isForward) {
                        triggered.reverse();
                    }
                    return $.each(triggered, function(i, waypoint) {
                        if (waypoint.options.continuous || i === triggered.length - 1) {
                            return waypoint.trigger([direction]);
                        }
                    });
                });
                return this.oldScroll = {
                    x: axes.horizontal.newScroll,
                    y: axes.vertical.newScroll
                };
            };

            Context.prototype.refresh = function() {
                var axes, cOffset, isWin,
                        _this = this;

                isWin = $.isWindow(this.element);
                cOffset = this.$element.offset();
                this.doScroll();
                axes = {
                    horizontal: {
                        contextOffset: isWin ? 0 : cOffset.left,
                        contextScroll: isWin ? 0 : this.oldScroll.x,
                        contextDimension: this.$element.width(),
                        oldScroll: this.oldScroll.x,
                        forward: 'right',
                        backward: 'left',
                        offsetProp: 'left'
                    },
                    vertical: {
                        contextOffset: isWin ? 0 : cOffset.top,
                        contextScroll: isWin ? 0 : this.oldScroll.y,
                        contextDimension: isWin ? $[wps]('viewportHeight') : this.$element.height(),
                        oldScroll: this.oldScroll.y,
                        forward: 'down',
                        backward: 'up',
                        offsetProp: 'top'
                    }
                };
                return $.each(axes, function(aKey, axis) {
                    return $.each(_this.waypoints[aKey], function(i, waypoint) {
                        var adjustment, elementOffset, oldOffset, _ref, _ref1;

                        adjustment = waypoint.options.offset;
                        oldOffset = waypoint.offset;
                        elementOffset = $.isWindow(waypoint.element) ? 0 : waypoint.$element.offset()[axis.offsetProp];
                        if ($.isFunction(adjustment)) {
                            adjustment = adjustment.apply(waypoint.element);
                        } else if (typeof adjustment === 'string') {
                            adjustment = parseFloat(adjustment);
                            if (waypoint.options.offset.indexOf('%') > -1) {
                                adjustment = Math.ceil(axis.contextDimension * adjustment / 100);
                            }
                        }
                        waypoint.offset = elementOffset - axis.contextOffset + axis.contextScroll - adjustment;
                        if ((waypoint.options.onlyOnScroll && (oldOffset != null)) || !waypoint.enabled) {
                            return;
                        }
                        if (oldOffset !== null && (oldOffset < (_ref = axis.oldScroll) && _ref <= waypoint.offset)) {
                            return waypoint.trigger([axis.backward]);
                        } else if (oldOffset !== null && (oldOffset > (_ref1 = axis.oldScroll) && _ref1 >= waypoint.offset)) {
                            return waypoint.trigger([axis.forward]);
                        } else if (oldOffset === null && axis.oldScroll >= waypoint.offset) {
                            return waypoint.trigger([axis.forward]);
                        }
                    });
                });
            };

            Context.prototype.checkEmpty = function() {
                if ($.isEmptyObject(this.waypoints.horizontal) && $.isEmptyObject(this.waypoints.vertical)) {
                    this.$element.unbind([resizeEvent, scrollEvent].join(' '));
                    return delete contexts[this.id];
                }
            };

            return Context;

        })();
        Waypoint = (function() {
            function Waypoint($element, context, options) {
                var idList, _ref;

                options = $.extend({}, $.fn[wp].defaults, options);
                if (options.offset === 'bottom-in-view') {
                    options.offset = function() {
                        var contextHeight;

                        contextHeight = $[wps]('viewportHeight');
                        if (!$.isWindow(context.element)) {
                            contextHeight = context.$element.height();
                        }
                        return contextHeight - $(this).outerHeight();
                    };
                }
                this.$element = $element;
                this.element = $element[0];
                this.axis = options.horizontal ? 'horizontal' : 'vertical';
                this.callback = options.handler;
                this.context = context;
                this.enabled = options.enabled;
                this.id = 'waypoints' + waypointCounter++;
                this.offset = null;
                this.options = options;
                context.waypoints[this.axis][this.id] = this;
                allWaypoints[this.axis][this.id] = this;
                idList = (_ref = $element.data(waypointKey)) != null ? _ref : [];
                idList.push(this.id);
                $element.data(waypointKey, idList);
            }

            Waypoint.prototype.trigger = function(args) {
                if (!this.enabled) {
                    return;
                }
                if (this.callback != null) {
                    this.callback.apply(this.element, args);
                }
                if (this.options.triggerOnce) {
                    return this.destroy();
                }
            };

            Waypoint.prototype.disable = function() {
                return this.enabled = false;
            };

            Waypoint.prototype.enable = function() {
                this.context.refresh();
                return this.enabled = true;
            };

            Waypoint.prototype.destroy = function() {
                delete allWaypoints[this.axis][this.id];
                delete this.context.waypoints[this.axis][this.id];
                return this.context.checkEmpty();
            };

            Waypoint.getWaypointsByElement = function(element) {
                var all, ids;

                ids = $(element).data(waypointKey);
                if (!ids) {
                    return [];
                }
                all = $.extend({}, allWaypoints.horizontal, allWaypoints.vertical);
                return $.map(ids, function(id) {
                    return all[id];
                });
            };

            return Waypoint;

        })();
        methods = {
            init: function(f, options) {
                var _ref;

                if (options == null) {
                    options = {};
                }
                if ((_ref = options.handler) == null) {
                    options.handler = f;
                }
                this.each(function() {
                    var $this, context, contextElement, _ref1;

                    $this = $(this);
                    contextElement = (_ref1 = options.context) != null ? _ref1 : $.fn[wp].defaults.context;
                    if (!$.isWindow(contextElement)) {
                        contextElement = $this.closest(contextElement);
                    }
                    contextElement = $(contextElement);
                    context = contexts[contextElement.data(contextKey)];
                    if (!context) {
                        context = new Context(contextElement);
                    }
                    return new Waypoint($this, context, options);
                });
                $[wps]('refresh');
                return this;
            },
            disable: function() {
                return methods._invoke(this, 'disable');
            },
            enable: function() {
                return methods._invoke(this, 'enable');
            },
            destroy: function() {
                return methods._invoke(this, 'destroy');
            },
            prev: function(axis, selector) {
                return methods._traverse.call(this, axis, selector, function(stack, index, waypoints) {
                    if (index > 0) {
                        return stack.push(waypoints[index - 1]);
                    }
                });
            },
            next: function(axis, selector) {
                return methods._traverse.call(this, axis, selector, function(stack, index, waypoints) {
                    if (index < waypoints.length - 1) {
                        return stack.push(waypoints[index + 1]);
                    }
                });
            },
            _traverse: function(axis, selector, push) {
                var stack, waypoints;

                if (axis == null) {
                    axis = 'vertical';
                }
                if (selector == null) {
                    selector = window;
                }
                waypoints = jQMethods.aggregate(selector);
                stack = [];
                this.each(function() {
                    var index;

                    index = $.inArray(this, waypoints[axis]);
                    return push(stack, index, waypoints[axis]);
                });
                return this.pushStack(stack);
            },
            _invoke: function($elements, method) {
                $elements.each(function() {
                    var waypoints;

                    waypoints = Waypoint.getWaypointsByElement(this);
                    return $.each(waypoints, function(i, waypoint) {
                        waypoint[method]();
                        return true;
                    });
                });
                return this;
            }
        };
        $.fn[wp] = function() {
            var args, method;

            method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            if (methods[method]) {
                return methods[method].apply(this, args);
            } else if ($.isFunction(method)) {
                return methods.init.apply(this, arguments);
            } else if ($.isPlainObject(method)) {
                return methods.init.apply(this, [null, method]);
            } else if (!method) {
                return $.error("jQuery Waypoints needs a callback function or handler option.");
            } else {
                return $.error("The " + method + " method does not exist in jQuery Waypoints.");
            }
        };
        $.fn[wp].defaults = {
            context: window,
            continuous: true,
            enabled: true,
            horizontal: false,
            offset: 0,
            triggerOnce: false
        };
        jQMethods = {
            refresh: function() {
                return $.each(contexts, function(i, context) {
                    return context.refresh();
                });
            },
            viewportHeight: function() {
                var _ref;

                return (_ref = window.innerHeight) != null ? _ref : $w.height();
            },
            aggregate: function(contextSelector) {
                var collection, waypoints, _ref;

                collection = allWaypoints;
                if (contextSelector) {
                    collection = (_ref = contexts[$(contextSelector).data(contextKey)]) != null ? _ref.waypoints : void 0;
                }
                if (!collection) {
                    return [];
                }
                waypoints = {
                    horizontal: [],
                    vertical: []
                };
                $.each(waypoints, function(axis, arr) {
                    $.each(collection[axis], function(key, waypoint) {
                        return arr.push(waypoint);
                    });
                    arr.sort(function(a, b) {
                        return a.offset - b.offset;
                    });
                    waypoints[axis] = $.map(arr, function(waypoint) {
                        return waypoint.element;
                    });
                    return waypoints[axis] = $.unique(waypoints[axis]);
                });
                return waypoints;
            },
            above: function(contextSelector) {
                if (contextSelector == null) {
                    contextSelector = window;
                }
                return jQMethods._filter(contextSelector, 'vertical', function(context, waypoint) {
                    return waypoint.offset <= context.oldScroll.y;
                });
            },
            below: function(contextSelector) {
                if (contextSelector == null) {
                    contextSelector = window;
                }
                return jQMethods._filter(contextSelector, 'vertical', function(context, waypoint) {
                    return waypoint.offset > context.oldScroll.y;
                });
            },
            left: function(contextSelector) {
                if (contextSelector == null) {
                    contextSelector = window;
                }
                return jQMethods._filter(contextSelector, 'horizontal', function(context, waypoint) {
                    return waypoint.offset <= context.oldScroll.x;
                });
            },
            right: function(contextSelector) {
                if (contextSelector == null) {
                    contextSelector = window;
                }
                return jQMethods._filter(contextSelector, 'horizontal', function(context, waypoint) {
                    return waypoint.offset > context.oldScroll.x;
                });
            },
            enable: function() {
                return jQMethods._invoke('enable');
            },
            disable: function() {
                return jQMethods._invoke('disable');
            },
            destroy: function() {
                return jQMethods._invoke('destroy');
            },
            extendFn: function(methodName, f) {
                return methods[methodName] = f;
            },
            _invoke: function(method) {
                var waypoints;

                waypoints = $.extend({}, allWaypoints.vertical, allWaypoints.horizontal);
                return $.each(waypoints, function(key, waypoint) {
                    waypoint[method]();
                    return true;
                });
            },
            _filter: function(selector, axis, test) {
                var context, waypoints;

                context = contexts[$(selector).data(contextKey)];
                if (!context) {
                    return [];
                }
                waypoints = [];
                $.each(context.waypoints[axis], function(i, waypoint) {
                    if (test(context, waypoint)) {
                        return waypoints.push(waypoint);
                    }
                });
                waypoints.sort(function(a, b) {
                    return a.offset - b.offset;
                });
                return $.map(waypoints, function(waypoint) {
                    return waypoint.element;
                });
            }
        };
        $[wps] = function() {
            var args, method;

            method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            if (jQMethods[method]) {
                return jQMethods[method].apply(null, args);
            } else {
                return jQMethods.aggregate.call(null, method);
            }
        };
        $[wps].settings = {
            resizeThrottle: 100,
            scrollThrottle: 30
        };
        return $w.load(function() {
            return $[wps]('refresh');
        });
    });

}).call(this);
jQuery(document).ready(function($) {
    "use strict";

    /* Search Box Effect Handler */

    //Click
    $('.searchbox .searchbox-icon,.searchbox .searchbox-inputtext').bind('click', function() {
        var $search_tbox = $('.searchbox .searchbox-inputtext');
        $search_tbox.css('width', '120px');
        $search_tbox.focus();
        $('.searchbox', this).addClass('searchbox-focus');
    });

    //Blur
    $('.top-bar .searchbox-inputtext,body').bind('blur', function() {
        var $search_tbox = $('.searchbox .searchbox-inputtext');
        $search_tbox.css('width', '0');
        $('.searchbox', this).removeClass('searchbox-focus');
    });

    // Clients Carousel
    $(".clients-list").carouFredSel({
        items: {
            width: 170,
            visible: {
                min: 1,
                max: 6
            }
        },
        prev: {
            button: function() {
                return jQuery(this).closest('.row-fluid').find('.carousel-prev');
            },
            key: "left"
        },
        next: {
            button: function() {
                return jQuery(this).closest('.row-fluid').find('.carousel-next');
            },
            key: "right"
        },
        responsive: true,
        auto: false,
        scroll: {
            onAfter: function() {
                /**
                 We have bug in chrome, and we need to force chrome to re-render specific portion of the page
                 after it's complete the scrolling animation so this is why we add these dumb lines.
                 */
                if (/chrome/.test(navigator.userAgent.toLowerCase())) {
                    this.style.display = 'none';
                    this.offsetHeight;
                    this.style.display = 'block';
                }

            },
            items: 1
        }

    }, {
        debug: false
    });


    /* Tabs Init */
    easyTabsZeina('.tab-container', {
        animate: true,
        animationSpeed: 'fast',
        defaultTab: 'li:first-child'
    });


    $('.accordion .accordion-row:first-child .title').trigger('click');


    if (document.getElementById('contact_map')) {
        google.maps.event.addDomListener(window, 'load', contactusMap);
    }


    /* Portfolio PrettyPhoto */


    $("a[rel^='prettyPhoto']").prettyPhoto({
        animation_speed: 'fast', /* fast/slow/normal */
        slideshow: 5000, /* false OR interval time in ms */
        autoplay_slideshow: false, /* true/false */
        opacity: 0.80  /* Value between 0 and 1 */
    });


    /*
     Responsive menu Handler
     */
    //$('.header .mobile-nav ').append( '<li class="responsive-searchbox">'+$('.searchbox').html()+'</li>' );
    /* Main Nav & Sticky menu init */

    //sticky menu
    // $('#sticky-navigation').append('<ul class="navigation">' + $('.navigation').html() + '</ul>');
    //$('.navigation').first().remove()
    $('.navigation').AXMenu({
        showArrowIcon: true, // true for showing the menu arrow, false for hide them
        firstLevelArrowIcon: '<i class="icon-chevron-down"></i>',
        menuArrowIcon: ""
    });


    /* Mobile Nav */
    $('.header .mobile-nav ').append($('.navigation').html());
    $('.header .mobile-nav li').bind('click', function(e) {

        var $this = $(this);
        var $ulKid = $this.find('>ul');
        var $ulKidA = $this.find('>a');

        if ($ulKid.length === 0 && $ulKidA[0].nodeName.toLowerCase() === 'a') {
            window.location.href = $ulKidA.attr('href');
        }
        else {
            $ulKid.toggle(0, function() {
                if ($(this).css('display') === 'block') {
                    $ulKidA.find('.icon-chevron-down').removeClass('icon-chevron-down').addClass('icon-chevron-up');
                }
                else {
                    $ulKidA.find('.icon-chevron-up').removeClass('icon-chevron-up').addClass('icon-chevron-down');
                }
            });
        }

        e.stopPropagation();

        return false;
    });

    $('.mobile-menu-button').click(function() {
        $('.mobile-nav').toggle();
    });

    $('.header .mobile-nav .icon-chevron-right').each(function() {
        $(this).removeClass('icon-chevron-right').addClass('icon-chevron-down');
    });


    /* Revolution Slider */
    //show until every thing loaded
    $('.rev-slider-fixed,.rev-slider-full').css('visibility', 'visible');

    //Fixed Size
    $('.rev-slider-banner-fixed').revolution({
        delay: 9000,
        startwidth: 926,
        startheight: 430,
        onHoverStop: "on",
        thumbWidth: 100,
        thumbHeight: 50,
        thumbAmount: 3,
        hideThumbs: 0,
        navigationType: "bullet",
        navigationArrows: "solo",
        navigationStyle: "round",
        navigationHAlign: "center",
        navigationVAlign: "bottom",
        navigationHOffset: 30,
        navigationVOffset: -40,
        soloArrowLeftHalign: "left",
        soloArrowLeftValign: "center",
        soloArrowLeftHOffset: 5,
        soloArrowLeftVOffset: 0,
        soloArrowRightHalign: "right",
        soloArrowRightValign: "center",
        soloArrowRightHOffset: 5,
        soloArrowRightVOffset: 0,
        touchenabled: "on",
        stopAtSlide: -1,
        stopAfterLoops: -1,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        hideSliderAtLimit: 0,
        fullWidth: "off",
        fullScreen: "off",
        fullScreenOffsetContainer: "#topheader-to-offset",
        shadow: 0

    });


    /* Full */
    $('.rev-slider-banner-full').revolution({
        delay: 5000,
        startwidth: 960,
        startheight: 500,
        onHoverStop: "on",
        thumbWidth: 100,
        thumbHeight: 50,
        thumbAmount: 3,
        hideThumbs: 0,
        navigationType: "none",
        navigationArrows: "solo",
        navigationStyle: "bullets",
        navigationHAlign: "center",
        navigationVAlign: "bottom",
        navigationHOffset: 30,
        navigationVOffset: 30,
        soloArrowLeftHalign: "left",
        soloArrowLeftValign: "center",
        soloArrowLeftHOffset: 20,
        soloArrowLeftVOffset: 0,
        soloArrowRightHalign: "right",
        soloArrowRightValign: "center",
        soloArrowRightHOffset: 20,
        soloArrowRightVOffset: 0,
        touchenabled: "on",
        stopAtSlide: -1,
        stopAfterLoops: -1,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        hideSliderAtLimit: 0,
        fullWidth: "on",
        fullScreen: "off",
        fullScreenOffsetContainer: "#topheader-to-offset",
        shadow: 0

    });


    /* Elastic Slide Show */
    $('#ei-slider').eislideshow({
        // animation types:
        // "sides" : new slides will slide in from left / right
        // "center": new slides will appear in the center
        animation: 'center', // sides || center

        // if true the slider will automatically slide, and it will only stop if the user clicks on a thumb
        autoplay: true,
        // interval for the slideshow
        slideshow_interval: 3000,
        // speed for the sliding animation
        speed: 800,
        // easing for the sliding animation
        easing: '',
        // percentage of speed for the titles animation. Speed will be speed * titlesFactor
        titlesFactor: 0.60,
        // titles animation speed
        titlespeed: 800,
        // titles animation easing
        titleeasing: '',
        // maximum width for the thumbs in pixels
        thumbMaxWidth: 150

    });


    /* jQuery Tweetable */
    $('.footer-recent-tweets-container').tweetable({
        username: 'envato',
        limit: 2,
        time: true,
        html5: true,
        onComplete: function($ul) {
            $('time').timeago();
        }
    });


    /* Accrodion */
    zeinaAccordion('.accordion', true);


    /* Init the plugin */


    form_validation('#contact-form');
    form_validation('#comment-form');

    /* get in touch form valdiation */
    $('#footer-contact-form').validate({
        rules: {
            name: "required"
        }
    });

    /* to top button */
    $('body').append('<div id="to-top-button"> <i class="icon-angle-up"></i> </div>');


    $('#to-top-button').click(function() {
        $('body,html').animate({
            scrollTop: 0
        });
    });


    /* Info Box Listeners */
    $('.info-box .icon-remove').click(function() {
        $(this).parents('.info-box').first().fadeOut();
        return false;
    });

    $(window).resize(function() {
        centeringBullets();
    });

    //place holder fallback
    $('input, textarea').placeholder();


    //process video posts
    embed_video_processing();

    //init tooltip tipsy
    $('.social-media-icon,.tool-tip').tipsy({gravity: 's', fade: true, offset: 5});


    //Remove tipsy tooltip event from image overlay elements
    $('.item_img_overlay_content .social-media-icon,.top-bar .social-media-icon').unbind('mouseenter');


    //Callout Box And Message Box Mobile Button
    $('.message-box ,.callout-box').each(function() {
        var $box = $(this);
        var $button = $box.find(".button");
        $box.append('<a href="' + $button.attr("href") + '" class="button large mobile">' + $button.html() + '</a>');
    });

    stickyMenu();

    //bread crumb last child fix for IE8
    $('.breadcrumbs li:last-child').addClass('last-child');
    $('.navigation > li:last-child').addClass('last-child-nav');
    $('.flickr_badge_wrapper .flickr_badge_image:nth-child(3n+1)').addClass('last-child-nav');


});


/* Portfolio */
$(window).load(function() {
    var $cont = $('.portfolio-items');


    $cont.isotope({
        itemSelector: '.portfolio-items .thumb-label-item',
        masonry: {columnWidth: $('.isotope-item:first').width(), gutterWidth: 30},
        filter: '*'
    });

    $('.portfolio-filter-container a').click(function() {
        $cont.isotope({
            filter: this.getAttribute('data-filter')
        });

        return false;
    });

    var lastClickFilter = null;
    $('.portfolio-filter a').click(function() {

        //first clicked we don't know which element is selected last time
        if (lastClickFilter === null) {
            $('.portfolio-filter a').removeClass('portfolio-selected');
        }
        else {
            $(lastClickFilter).removeClass('portfolio-selected');
        }

        lastClickFilter = this;
        $(this).addClass('portfolio-selected');
    });


    centeringBullets();
    var $masonryElement = $('#masonry-elements');
    $masonryElement.isotope({
        transformsEnabled: false,
        masonry: {
            columnWidth: 280,
            gutterWidth: 15
        },
    });

    $masonryElement.infinitescroll({
        navSelector: '#masonry-elements-nav', // selector for the paged navigation
        nextSelector: '#masonry-elements-nav a:first', // selector for the NEXT link (to page 2)
        itemSelector: '.feature', // selector for all items you'll retrieve
        loading: {
            finishedMsg: 'No more pages to load.',
            img: 'images/loading.gif',
            selector: '#loading',
            speed: 'normal'
        },
        maxPage: 5
    },
    // call Isotope as a callback
    function(newElements) {
        embed_video_processing();
        var $newElements = $(newElements);
        $masonryElement.append($newElements);
        $masonryElement.isotope('appended', $newElements);

        $masonryElement.find('.cycle-slideshow').cycle({
        });
    });
});

/**
 * This function used to add some features to easytabs  out of the box.
 * @param selector
 */
function easyTabsZeina(selector, options) {
    var $ref = $(selector);

    options = options || {};
    options['animationSpeed'] = options['animationSpeed'] || 'fast';

    $ref.easytabs(options).bind('easytabs:midTransition', function() {
        var $this = $(this), activeLink = $this.find('a.active'), offset = activeLink.offset();
        $this.find('.section-tab-arrow').css('left', (offset.left + (activeLink.outerWidth()) / 2) + 'px');
    });

    //trigger event on init
    $ref.trigger('easytabs:midTransition');

}


/* Contaact Map */
var map;
function contactusMap() {

    var myLatlng, mapOptions, marker;
    var myLatlng = new google.maps.LatLng(-37.817590, 144.965188);

    mapOptions = {
        zoom: 11,
        center: myLatlng,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('contact_map'), mapOptions);

    marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Envato'
    });
}


/**
 * Form Validation Helper
 */
function form_validation(selector) {
    var errorContainerOpen = '<div class="span1 error_container" ><div class="error-box">',
            errorContainerClose = '<i class="icon-remove"></i></div></div>';
    /* Contact From Validation */
    $(selector).validate({
        errorClass: "input_error",
        errorElement: "span",
        errorPlacement: function(error, element) {
            var errorHtml = errorContainerOpen + error[0].innerText + errorContainerClose, $row = $(element[0]).parents('.row-fluid').first();
            $row.find('.error_container').remove();
            $row.append(errorHtml);
            $row.find('.error_container');
            $row.find('input,textarea').addClass('input_error');
        },
        success: function(label, element) {
            $(element).parent().next().remove();
        }
    });

    /* Close error lister */
    $('.form-wrapper').on('click', '.error-box .icon-remove', function() {
        var $boxContainer = $(this).parents('.error_container').first();
        $boxContainer.fadeOut('fast', function() {
            $boxContainer.remove();
        });
    });

}


/**
 * Embed Video
 */
function embed_video_processing() {

    var youtube_template = '<iframe src="http://www.youtube.com/embed/{{id}}" frameborder="0" allowfullscreen=""  width="100%" height="100%" allowfullscreen></iframe>',
            vimeo_template = '<iframe src="http://player.vimeo.com/video/{{id}}?color=ffffff" frameborder="0" allowfullscreen=""  width="100%" height="360"></iframe>',
            soundcloud_template = '<iframe src="https://w.soundcloud.com/player/?url={{id}}" frameborder="0" allowfullscreen=""  width="100%" height="166"></iframe>',
            template, id;

    $('.blog-post-youtube,.blog-post-vimeo,.blog-post-soundcloud').each(function() {
        id = false;

        //youtube
        if ($(this).hasClass('blog-post-youtube')) {
            id = getYoutubeId($(this).attr('href'));
            template = youtube_template;
        }
        //vimeo
        else if ($(this).hasClass('blog-post-vimeo')) {
            id = getVimeoId($(this).attr('href'));
            template = vimeo_template;
        }
        //sound clound
        else if ($(this).hasClass('blog-post-soundcloud')) {
            id = $(this).attr('href');
            template = soundcloud_template;
        }

        if (id !== false) {
            //process the template
            $(this).replaceWith(template.replace('{{id}}', id));
        }

    });

}

/***
 * Get youtube url.
 *
 * @param url
 * @returns {*}
 */
function getYoutubeId(url) {
    var regExp = /^.*((youtu.[\w]{1,3}\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[7].length == 11) {
        return match[7];
    } else {
        return false;
    }
}
/***
 * Get vimeo url.
 *
 * @param url
 * @returns {*}
 */
function getVimeoId(url) {
    var regExp = /http:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
    var match = url.match(regExp);

    if (match) {
        return  match[2];
    } else {
        return false;
    }
}


/*
 * Zeina Accordion
 * Written specially for Zeina Theme
 */
function zeinaAccordion(selector) {

    $(document).on('click', selector + ' .accordion-row .title,' + selector + ' .accordion-row .open-icon', function() {

        var me = this,
                accordion = $(this).parents('.accordion'),
                $prev,
                $accRow = $(this),
                $accTitle = $accRow.parent(), $this, icon, desc, title, activeRow,
                $accRow = $accTitle.parent(),
                toggle = accordion.data('toggle') == 'on' ? true : false;


        if (toggle === true) {

            icon = $accTitle.find('.open-icon');
            desc = $accTitle.find('.desc');
            title = $accTitle.find('.title');

            if ($accTitle.find('.close-icon').length > 0) {
                desc.slideUp('fast');
                icon.removeClass('close-icon');
                title.removeClass('active');
            }
            else {
                desc.slideDown('fast');
                icon.addClass('close-icon');
                title.addClass('active');
            }

        }
        else {
            $accRow.find('.accordion-row').each(function() {

                $this = $(this);
                icon = $this.find('.open-icon');
                desc = $this.find('.desc');
                title = $this.find('.title');

                /* if this the one which is clicked , slide up  */
                if ($accTitle[0] != this) {
                    desc.slideUp('fast');
                    icon.removeClass('close-icon');
                    title.removeClass('active');
                }

                else {
                    desc.slideDown('fast');
                    icon.addClass('close-icon');
                    title.addClass('active');
                }

            });
        }

    });


    // active div
    $(selector).each(function() {

        var $this = $(this), icon, desc, title, activeRow,
                activeIndex = parseInt($this.data('active-index')),
                activeIndex = activeIndex < 0 ? false : activeIndex;

        if (activeIndex !== false) {
            activeRow = $this.find('.accordion-row').eq(activeIndex);
            icon = activeRow.find('.open-icon');
            desc = activeRow.find('.desc');
            title = activeRow.find('.title');

            desc.slideDown('fast');
            icon.addClass('close-icon');
            title.addClass('active');
        }

    });


}

/* Sticky Menu */
function stickyMenu() {

    $(window).scroll(function() {
        if ($(window).scrollTop() > 35) {
            $('#header').addClass('sticky-header');
            $('.sticky-navigation,#to-top-button').fadeIn();
        }
        else {
            $('#header').removeClass('sticky-header');
            $('.sticky-navigation,#to-top-button').fadeOut();
        }
    });
}

/* Centering Bullets */
function centeringBullets() {
    //Bullets center fixing in revolution slide
    $('.simplebullets,.slider-fixed-frame .home-bullets').each(function() {
        var $this = $(this), w = $this.width();
        $this.css('margin-left', -(w / 2) + 'px');
    });
}