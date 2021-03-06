/*
* WSpinButton 1.0
* Copyright (c) 2011 Webers
*
* Depends:
*   - jQuery 1.4.2+
*
* Dual licensed under MIT or GPLv2 licenses
*   http://en.wikipedia.org/wiki/MIT_License
*   http://en.wikipedia.org/wiki/GNU_General_Public_License
*
*/
(function ($)
{
    $.extend({
        spin:
        {
            step: 1,
            max: null,
            min: 0,
            timestep: 200,
            timeBlink: 100,
            locked: false,
            decimal: null,
            beforeChange: null,
            changed: null,
            buttonUp: null,
            buttonDown: null
        }
    });
    $.fn.extend({
        wspinbutton: function (o)
        {
            return this.each(function ()
            {
                o = o || {};
                var options = {};
                $.each($.spin, function (k, v)
                {
                    options[k] = (typeof o[k] != 'undefined' ? o[k] : v);
                });

                var $element = $(this);
                if (!$element.val())
                {
                    $element.val(options.min);
                }
                if ($(this).data('wspinned'))
                {
                    return false;
                }
                var $buttonElement = $('<div />');
                $buttonElement.addClass('wspinbutton-button');
                $element.after($buttonElement);
                $element.data('wspinned', true);
                
                var val;
                $element.keydown(function (e)
                {
                    val = $element.val();
                    if (!((e.keyCode > 45 && e.keyCode < 58) || (e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 36 && e.keyCode < 41) || e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 109 || e.keyCode == 9))
                    {
                        return false;
                    }
                });
                
                $element.keyup(function (e) {
                    if ($(this).val() === "-" || ($(this).val().split("-").length > 1 && $(this).val().split("-")[0] != ""))
                    {
                        $(this).val(val);
                    }
                    else if($(this).val() == "")
                    {
                        $(this).val(options.min);
                    }
                    
                });
                
                if (options.locked)
                {
                    $element.focus(function ()
                    {
                        $element.blur();
                    });
                }
                function spin(vector)
                {
                    var val = $element.val();
                    var originalVal = val;
                    if (options.decimal)
                    {
                        val = val.replace(options.decimal, '.');
                    }
                    if (!isNaN(val))
                    {
                        val = parseFloat(val) + parseFloat(vector * options.step);
                        if (options.min !== null && val < options.min) val = options.min;
                        if (options.max !== null && val > options.max) val = options.max;
                        if (val != $element.val())
                        {
                            if (options.decimal) val = val.toString().replace('.', options.decimal);
                            var ret = ($.isFunction(options.beforeChange) ? options.beforeChange.apply($element, [val, originalVal]) : true);
                            if (ret !== false)
                            {
                                $element.val(val);
                                if ($.isFunction(options.changed))
                                {
                                    options.changed.apply($element, [val]);
                                }
                                $element.change();

                                if (vector > 0)
                                {
                                    $buttonElement.addClass('up');
                                    $buttonElement.removeClass('down');
                                }
                                else
                                {
                                    $buttonElement.addClass('down');
                                    $buttonElement.removeClass('up');
                                }
                                if (options.timeBlink < options.timestep)
                                {
                                    setTimeout(function ()
                                    {
                                        $buttonElement.removeClass('down');
                                        $buttonElement.removeClass('up');
                                    }, options.timeBlink);
                                }
                            }
                        }
                    }
                    if (vector > 0)
                    {
                        if ($.isFunction(options.buttonUp))
                        {
                            options.buttonUp.apply($element, [val]);
                        }
                    }
                    else if ($.isFunction(options.buttonDown))
                    {
                        options.buttonDown.apply($element, [val]);
                    }
                }

                $buttonElement.mousedown(function (e)
                {
                    var pos = e.pageY - $buttonElement.offset().top;
                    var vector = ($buttonElement.height() / 2 > pos ? 1 : -1);
                    (function ()
                    {
                        spin(vector);
                        var timeout = setTimeout(arguments.callee, options.timestep);
                        $(document).one('mouseup', function ()
                        {
                            clearTimeout(timeout);
                            $buttonElement.removeClass('spinDown');
                            $buttonElement.removeClass('spinUp');
                        });
                    })();
                    return false;
                });
            });
        }
    });
})(jQuery);