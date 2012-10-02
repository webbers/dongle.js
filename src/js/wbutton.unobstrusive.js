/*
* WButton 1.0
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
$(document).ready(function ()
{
    $('.wbutton').each(function ()
    {
        var opt = {};
        if ($(this).attr('icon'))
        {
            opt.icon = $(this).attr('icon');
        }

        $(this).wbutton(opt);
    });
});