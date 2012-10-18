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
$(document).ready(function()
{
    $('.wspinbutton').each(function()
    {
        var opt = {};
        var max = $(this).attr('max');
        var min = $(this).attr('min');
        var step = $(this).attr('step');
        opt.locked = $(this).attr('locked') !== undefined;

        if (max)
        {
            opt.max = max;
        }
        if (min)
        {
            opt.min = min;
        }
        if (step)
        {
            opt.step = step;
        }

        $(this).wspinbutton(opt);
    });
});