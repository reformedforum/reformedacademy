jQuery(document).ready(function($) {

    var skinContainerShowHideClass = 'hide-skin-chooser';
    $('#show_hide_skin_chooser').click(function(e) {
        e.preventDefault();

        var $skinContainer = $('#skin-chooser-container');
        if ($skinContainer.hasClass(skinContainerShowHideClass)) {
            $skinContainer.removeClass(skinContainerShowHideClass);
        }
        else {
            $skinContainer.addClass(skinContainerShowHideClass);
        }


        return false;
    });


    /* Color Picker */
    var color_chooser_source = $("#css-skin").html(), color_chooser_template = Handlebars.compile(color_chooser_source);
    $('.input-colorpicker').ColorPicker({
        onSubmit: function(hsb, hex, rgb, el) {
            $(el).val('#' + hex);
            $(el).ColorPickerHide();
        },
        onBeforeShow: function() {
            $(this).ColorPickerSetColor(this.value);
        },
        onChange: function(hsb, hex, rgb, el) {

            var $el = $(el), new_color = '#' + hex, source, template, elName = $el.attr('name'), htmlTemplate;
            $el.next().css('background-color', '#' + hex);

            el.value = new_color;


            skins_data[$default_skin][elName] = new_color;
            skins_data[$default_skin][elName + '_rgba'] = convertHex(new_color, 0.5);
            htmlTemplate = color_chooser_template(skins_data[$default_skin]);

            $("#skin-chooser-css").remove();
            $('<style type="text/css" id="skin-chooser-css">' + htmlTemplate + '</style>').appendTo('head');


            //data:text/css;base64,
            $('#skin-save').attr('href', 'data:text/css;base64,' + $.base64Encode(htmlTemplate));
            // $("#skin-chooser-css")[0].cssText = htmlTemplate;
            // $("#skin-chooser-css").html( htmlTemplate );
        }
    }).bind('keyup', function() {
        $(this).ColorPickerSetColor(this.value);
    });


    $('.skin-chooser-label').click(function() {
        $(this).next().slideToggle();
    });

    /* Set default mode */
    if ($('#wrapper').hasClass('boxed')) {
        $('#layout-mode option[value="boxed"]')[0].selected = true;

    }
    //change mod
    $('#layout-mode').change(function() {
        $('#wrapper').attr('class', $('option:selected', this).val());
        $('#masonry-elements,.portfolio-items').isotope('reLayout');
    });

    $(document).on('click', '.predefined-skins', function() {
        $("#skin-chooser-css").remove();
        var skin_name = $(this).data('skinname'), $inputColorPicker, color;
        $default_skin = skin_name;

        for (var prop in default_skins_data[$default_skin]) {
            $inputColorPicker = $('.input-colorpicker[name=' + prop + ']')
            color = default_skins_data[$default_skin][prop];
            $inputColorPicker.val(color);
            $inputColorPicker.next().css('background-color', color);
        }

        $('#skin-file').attr('href', 'css/skins/' + skin_name + '.css');

        var header_div_type = default_skins_data[$default_skin]['header_type'];
        $('.top-header').attr('class', 'top-header ' + header_div_type);
        $('#divider-mode option:selected').removeAttr('selected');
        $('#divider-mode option[value=' + header_div_type + ']')[0].selected = true;
    });

    var last_class_used = '';
    $('.pattern,.image-chooser').click(function() {
        if (!isBoxed()) {
            alert('Please choose boxed layout first :)');
            return false;
        }
        var pattern_class = $(this).data('body-class');
        $('body').attr('class', pattern_class);
        //$('body').addClass(pattern_class);
        last_class_used = pattern_class;
    });


    $('#skin-save').click(function() {
        if ($(this).attr('href') == "") {
            alert('The skin does not changed!');
            return false;
        }
    });

    $('#divider-mode').change(function() {
        var option = $('option:selected', this).val();
        $('.top-header').attr('class', 'top-header ' + option);
    });
});

function rgb_color(rgb, a) {
    if (a) {
        return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + a + ')';
    }
    else {
        return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
    }
}

function isBoxed() {
    return  $('#layout-mode option:selected').val() == 'boxed';
}

function convertHex(hex, opacity) {
    hex = hex.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);

    result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    return result;
}
