"use strict";

jQuery(document).ready(function($) {


    if (Function('/*@cc_on return document.documentMode===10@*/')()) {
        document.documentElement.className += ' ie10';
    }


    /* Show testimonial after loading */
    $('.testimonial-item').css('visibility', 'visible');


    /* Tabs Init */
    easyTabsZeina('.tab-container', {
        animationSpeed: 'fast',
        defaultTab: 'li:first-child',
        tabs: 'ul>li'
    });


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
        $search_tbox.css('width', '0px');
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


    $('.accordion .accordion-row:first-child .title').trigger('click');


    if (document.getElementById('contact_map')) {
        google.maps.event.addDomListener(window, 'load', contactusMap);
    }


    /* Portfolio PrettyPhoto */


    $("a[data-rel^='prettyPhoto']").prettyPhoto({
        animation_speed: 'fast', /* fast/slow/normal */
        slideshow: 5000, /* false OR interval time in ms */
        autoplay_slideshow: false, /* true/false */
        opacity: 0.80  /* Value between 0 and 1 */
    });


    $('.navigation').AXMenu({
        showArrowIcon: true, // true for showing the menu arrow, false for hide them
        firstLevelArrowIcon: '',
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
        delay: 5000,
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
        startwidth: 1170,
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
    $('body').append('<div id="to-top-button"> <i class="fa fa-angle-up"></i> </div>');


    $('#to-top-button').click(function() {
        $('body,html').animate({
            scrollTop: 0
        });
    });


    /* Info Box Listeners */
    $('.alert a.alert-remove').click(function() {
        $(this).parents('.alert').first().fadeOut();
        return false;
    });

    $(window).resize(function() {
        centeringBullets();

        $('.tab-container').trigger('easytabs:midTransition');
        $('#masonry-elements,.portfolio-items').isotope('reLayout');
        setTimeout(function() {
            $('#masonry-elements,.portfolio-items').isotope('reLayout');
        }, 500);
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
        var $button = $box.find(".btn");
        $box.append('<button href="' + $button.attr("href") + '" class="' + $button.attr("class") + ' btn-mobile">' + $button.html() + '</button>');

    });

    //stickyMenu();

    if ($("html").hasClass("lt-ie9")) {

        //bread crumb last child fix for IE8
        $('.breadcrumbs li:last-child').addClass('last-child');
        $('.navigation > li:last-child').addClass('last-child-nav');
        $('.flickr_badge_wrapper .flickr_badge_image').addClass('flicker-ie');
        $('.flickr_badge_wrapper .flickr_badge_image:nth-child(3n+1)').addClass('last-child-flicker');
        $('.content-style3 ').css('width', '100%').css('width', '-=28px');
        $('.section-subscribe input[type=text]').css('width', '100%').css('width', '-=40px');
        $('.blog-search .blog-search-input').css('width', '100%').css('width', '-=40px');

        $('.tab').click(function() {
            setTimeout(function() {
                $('.content-style3 ').css('width', '100%').css('width', '-=28px');
                $('.section-subscribe input[type=text]').css('width', '100%').css('width', '-=40px');
            }, 500);

        });

        setInterval(function() {
            $('#masonry-elements,.portfolio-items').isotope('reLayout');
        }, 1000);
    }
    ;

    centeringBullets();


    var $cont = $('.portfolio-items');

    // IE 8
    if ($("html").hasClass("lt-ie9")) {
        $cont.isotope({
            itemSelector: '.portfolio-items .thumb-label-item',
            masonry: {columnWidth: $('.isotope-item:first').width(), gutterWidth: 6},
            filter: '*',
            transformsEnabled: false,
            layoutMode: 'masonry',
            animationEngine: 'css'
        });
    }
    else {
        $cont.isotope({
            itemSelector: '.portfolio-items .thumb-label-item',
            masonry: {columnWidth: $('.isotope-item:first').width(), gutterWidth: 6},
            filter: '*',
            transformsEnabled: false,
            layoutMode: 'masonry',
            //  animationEngine: 'css'
        });
    }


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


});


/* Portfolio */

var loaded = false, timeout = 20000;//loaded flag for timeout
setTimeout(function() {
    if (!loaded) {
        hideLoading();
    }
}, timeout);

$(window).load(function() {
    loaded = true;
    centeringBullets();

    hideLoading();

    var $masonryElement = $('#masonry-elements');
    $masonryElement.isotope({
        transformsEnabled: false,
        masonry: {
            columnWidth: 270,
            gutterWidth: 15
        }
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
        maxPage: 3
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

    $('#masonry-elements,.portfolio-items').isotope('reLayout');
});


/* Loading functions */
function hideLoading() {
    $('.loading-container').remove();
    $('.hide-until-loading').removeClass('hide-until-loading');
}

/**
 * This function used to add some features to easytabs  out of the box.
 * @param selector
 */
function easyTabsZeina(selector, options) {
    var $ref = $(selector);

    $('.tab-container').css('visibility', 'visible');
    options = options || {};
    options['animationSpeed'] = options['animationSpeed'] || 'fast';
    $ref.easytabs(options).bind('easytabs:midTransition', function() {
        var $this = $(this), activeLink = $this.find('a.active'), offset = activeLink.offset();
        $this.find('.section-tab-arrow').css('left', ((offset.left + (activeLink.outerWidth()) / 2) - 7) + 'px');
    });

    //trigger event on init
    $ref.trigger('easytabs:midTransition');
    $(window).load(function() {
        $ref.trigger('easytabs:midTransition');
    });

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
        success: function(label, element) {

        }
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
