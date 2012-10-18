/*
* WInputfile 1.0
* Copyright (c) 2012 Webers
*
* Depends:
*   - jQuery 1.4.2+
*
* Dual licensed under MIT or GPLv2 licenses
*   http://en.wikipedia.org/wiki/MIT_License
*   http://en.wikipedia.org/wiki/GNU_General_Public_License
*
*/
function getInternetExplorerVersion()
{
    var rv = -1;
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
        if (re.exec(ua) !== null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}
(function ($) {
    $.fn.winputfile = function(options) {
        var defaults = {
            inputText: 'Selecione o arquivo'
        };
        options = $.extend(defaults, options);
        var id;
        var $inputDiv;
        var $this;
        $(this).each(function() {
            $this = $(this);
            if (!$(this).hasClass('rbinputfield')) {
                id = "winputfile_" + Math.floor((Math.random() * 10000) + 1);
                $inputDiv = $('<div class="winputfilediv" id="' + id +'"><div class="winputfile-file-name"></div><div class="winputfile-panel" index="' + $(this).index(this) + '"><div class="winputfile-text">' + options.inputText + '</div><div class="winputfile-bg3"></div></div></div><div style="clear:both"></div>');
                $(this).eq($(this).index(this)).change(function() {
                    $(this).eq($(this).index(this)).next().find('.winputfile-file-name').text('').text($(this).val().split('\\').pop());
                });

                $(this).after($inputDiv);
                $(this).css('position', 'absolute').fadeTo(0, 0).css('height', '26px').css('opacity', '0').css('alpha', '(opacity=00)');

                $('.winputfilediv').hover(function() {
                    $(this).find('.winputfile-panel').addClass('winputfile-panel-hover');
                },
                    function() {
                        $(this).find('.winputfile-panel').removeClass('winputfile-panel-hover');
                    });
                
                $(this).hover(function() {
                    $(this).next().find('.winputfile-panel').addClass('winputfile-panel-hover');
                },
                    function() {
                        $(this).next().find('.winputfile-panel').removeClass('winputfile-panel-hover');
                    });

                $this.css('margin-left', '5px');
                $(this).next().click(function() {
                    $(this).prev().click();
                });
                
                $(this).addClass('rbinputfield');
            }

        });
        return false;
    };
})(jQuery);