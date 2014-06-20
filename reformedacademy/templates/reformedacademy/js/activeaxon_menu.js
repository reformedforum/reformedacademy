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