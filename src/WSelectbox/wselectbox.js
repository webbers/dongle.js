/*
* WSelectbox
* Copyright (c) 2012 Webers
*
* Depends:
*   - jQuery 1.4.2+
*
*   Licensed under MIT
*   http://en.wikipedia.org/wiki/MIT_License
*
*/

(function ($, undefined)
{
    var propName = 'wselectbox';
    /**
    * Selectbox manager.
    * Use the singleton instance of this class, $.wselectbox, to interact with the select box.
    * Settings for (groups of) select boxes are maintained in an instance object,
    * allowing multiple different settings on the same page
    */
    function wselectbox()
    {
        this._state = [];
        this._defaults = { // Global defaults for all the select box instances
            classHolder: "wselectbox-holder",
            classHolderDisabled: "wselectbox-holder-disabled",
            classSelector: "wselectbox-selector",
            classOptions: "wselectbox-options",
            classGroup: "wselectbox-group",
            classSub: "wselectbox-sub",
            classDisabled: "wselectbox-disabled",
            classToggleOpen: "wselectbox-toggle-open",
            classToggle: "wselectbox-toggle",
            speed: 100,
            effect: "fade", // "slide" or "fade"
            onChange: null, //Define a callback function when the wselectbox is changed
            onOpen: null, //Define a callback function when the wselectbox is open
            onClose: null, //Define a callback function when the wselectbox is closed
            rightAlign: false,
            showFirst: true
        };
    }

    $.extend(wselectbox.prototype, {
        /**
        * Is the first field in a jQuery collection open as a wselectbox
        * 
        * @param {Object} target
        * @return {Boolean}
        */
        _isOpenSelectbox: function (target)
        {
            if (!target)
            {
                return false;
            }
            var inst = this._getInst(target);
            return inst.isOpen;
        },
        /**
        * Is the first field in a jQuery collection disabled as a wselectbox
        * 
        * @param {HTMLElement} target
        * @return {Boolean}
        */
        _isDisabledSelectbox: function (target)
        {
            if (!target)
            {
                return false;
            }
            var inst = this._getInst(target);
            return inst.isDisabled;
        },
        /**
        * Attach the select box to a jQuery selection.
        * 
        * @param {HTMLElement} target
        * @param {Object} settings
        */
        _attachSelectbox: function (target, settings)
        {
            if (this._getInst(target))
            {
                return false;
            }
            var $target = $(target);
            var self = this;
            var inst = self._newInst($target);
            var s = false;
            var opts = $target.find("option");
            var olen = opts.length;

            $target.attr("sb", inst.uid);

            $.extend(inst.settings, self._defaults, settings);
            self._state[inst.uid] = false;

            $target.change(function ()
            {
                if (!$target.is('.wselectbox-menu'))
                {
                    $('#wselectbox-selector_' + $(this).attr('sb')).text($(this).find('option:checked').text());
                }
            });
            $target.hide();

            function closeOthers()
            {
                var key, uid = this.attr("id").split("_")[1];
                for (key in self._state)
                {
                    if (key !== uid)
                    {
                        if (self._state.hasOwnProperty(key))
                        {
                            if ($(":input[sb='" + key + "']")[0])
                            {
                                self._closeSelectbox($(":input[sb='" + key + "']")[0]);
                            }
                        }
                    }
                }
            }

            var wselectboxholder = $("<a>", {
                "href": "#",
                "id": "wselectbox-holder_" + inst.uid,
                "class": inst.settings.classHolder,
                "click": function()
                {
                    return false;
                }
            });

            var wselectboxselector = $("<a>", {
                "id": "wselectbox-selector_" + inst.uid,
                "href": "#",
                "class": inst.settings.classSelector,
                "click": function (e)
                {
                    e.stopImmediatePropagation();
                    closeOthers.apply($(this), []);
                    var uid = $(this).attr("id").split("_")[1];
                    if (self._state[uid])
                    {
                        self._closeSelectbox(target);
                    } else
                    {
                        self._openSelectbox(target);
                    }
                    return false;
                }
            });


            var wselectboxtoggle = $("<a>", {
                "id": "wselectbox-toggle_" + inst.uid,
                "href": "#",
                "class": inst.settings.classToggle,
                "click": function (e)
                {
                    e.stopImmediatePropagation();
                    closeOthers.apply($(this), []);
                    var uid = $(this).attr("id").split("_")[1];
                    if (self._state[uid])
                    {
                        self._closeSelectbox(target);
                    } else
                    {
                        self._openSelectbox(target);
                    }
                    return false;
                }
            });
            wselectboxtoggle.appendTo(wselectboxholder);

            var wselectboxoptions = $("<ul>", {
                "id": "wselectbox-options_" + inst.uid,
                "class": inst.settings.classOptions,
                "css": {
                    "display": "none"
                }
            });

            $target.children().each(function (index)
            {
                if (index === 0 && (!inst.settings.showFirst || $target.is('.wselectbox-menu'))) return;
                var that = $(this), li, config = {};
                if (that.is("option"))
                {
                    getOptions(that);
                } else if (that.is("optgroup"))
                {
                    li = $("<li>");
                    $("<span>", {
                        "text": that.attr("label")
                    }).addClass(inst.settings.classGroup).appendTo(li);
                    li.appendTo(wselectboxoptions);
                    if (that.is(":disabled"))
                    {
                        config.disabled = true;
                    }
                    config.sub = true;
                    getOptions(that.find("option"), config);
                }
            });

            function getOptions()
            {
                var sub = arguments[1] && arguments[1].sub ? true : false,
                    disabled = arguments[1] && arguments[1].disabled ? true : false;
                arguments[0].each(function (i)
                {
                    var that = $(this),
                        li = $("<li>"),
                        child;
                    if (that.is(":selected"))
                    {
                        wselectboxselector.text(that.text());
                        s = true;
                    }
                    if (i === olen - 1)
                    {
                        li.addClass("last");
                    }
                    if (!that.is(":disabled") && !disabled)
                    {
                        child = $("<a>", {
                            "href": "#" + that.val(),
                            "rel": that.val(),
                            "text": that.text(),
                            "click": function (e)
                            {
                                self._closeSelectbox(target);
                                e.preventDefault();
                                self._changeSelectbox(target, $(this).attr("rel"), $(this).text(), $target.is('.wselectbox-menu'));
                            }
                        });
                        if (sub)
                        {
                            child.addClass(inst.settings.classSub);
                        }
                        child.appendTo(li);
                    } else
                    {
                        child = $("<span>", {
                            "text": that.text()
                        }).addClass(inst.settings.classDisabled);
                        if (sub)
                        {
                            child.addClass(inst.settings.classSub);
                        }
                        child.appendTo(li);
                    }
                    li.appendTo(wselectboxoptions);
                });
            }

            if (!s)
            {
                wselectboxselector.text(opts.first().text());
            }

            $.data(target, propName, inst);

            wselectboxselector.appendTo(wselectboxholder);
            wselectboxoptions.appendTo(wselectboxholder);
            wselectboxholder.insertAfter($target);
            return true;
        },
        /**
        * Remove the wselectbox functionality completely. This will return the element back to its pre-init state.
        * 
        * @param {HTMLElement} target
        */
        _detachSelectbox: function (target)
        {
            var inst = this._getInst(target);
            if (!inst)
            {
                return false;
            }
            $("#wselectbox-holder_" + inst.uid).remove();
            $.data(target, propName, null);
            $(target).show();
            return true;
        },
        /**
        * Change selected attribute of the wselectbox.
        * 
        * @param {HTMLElement} target
        * @param {String} value
        * @param {String} text
        */
        _changeSelectbox: function (target, value, text, isMenu)
        {
            var inst = this._getInst(target),
                onChange = this._get(inst, 'onChange');

            var completeSelect = "#wselectbox-selector_" + inst.uid;

            $(target).find("option[value='" + value + "']").attr("selected", true);
            if (onChange)
            {
                onChange.apply((inst.input ? inst.input[0] : null), [value, inst]);
            } else if (inst.input)
            {
                inst.input.trigger('change');
            }

            if (!isMenu)
            {
                $(completeSelect).text(text);
            }
        },
        /**
        * Enable the wselectbox.
        * 
        * @param {HTMLElement} target
        */
        _enableSelectbox: function (target)
        {
            var inst = this._getInst(target);
            if (!inst || !inst.isDisabled)
            {
                return false;
            }
            $("#wselectbox-holder_" + inst.uid).removeClass(inst.settings.classHolderDisabled);

            inst.isDisabled = false;
            $.data(target, propName, inst);
            return true;
        },
        /**
        * Disable the wselectbox.
        * 
        * @param {HTMLElement} target
        */
        _disableSelectbox: function (target)
        {
            var inst = this._getInst(target);
            if (!inst || inst.isDisabled)
            {
                return false;
            }
            $("#wselectbox-holder_" + inst.uid).addClass(inst.settings.classHolderDisabled);
            inst.isDisabled = true;
            $.data(target, propName, inst);
            return true;
        },
        /**
        * Get or set any wselectbox option. If no value is specified, will act as a getter.
        * 
        * @param {HTMLElement} target
        * @param {String} name
        * @param {Object} value
        */
        _optionSelectbox: function (target, name, value)
        {
            var inst = this._getInst(target);
            if (!inst)
            {
                return false;
            }
            //TODO check name
            inst[name] = value;
            $.data(target, propName, inst);
            return true;
        },
        /**
        * Call up attached wselectbox
        * 
        * @param {HTMLElement} target
        */
        _openSelectbox: function (target)
        {
            var inst = this._getInst(target);
            if (!inst || inst.isOpen || inst.isDisabled)
            {
                return;
            }
            var el = $("#wselectbox-options_" + inst.uid),
                viewportHeight = parseInt($(window).height(), 10),
                offset = $("#wselectbox-holder_" + inst.uid).offset(),
                scrollTop = $(window).scrollTop(),
                height = el.prev().height(),
                diff = viewportHeight - (offset.top - scrollTop) - height / 2,
                onOpen = this._get(inst, 'onOpen');
            el.css({
                "maxHeight": (diff - height) + "px"
            });

            if (inst.settings.rightAlign)
            {
                el.css('right', '0px');
            }

            if(inst.settings.effect === "fade")
            {
                el.fadeIn(inst.settings.speed);
            }
            else
            {
                el.slideDown(inst.settings.speed);
            }
            
            $("#wselectbox-holder_" + inst.uid).addClass(inst.settings.classToggleOpen);

            this._state[inst.uid] = true;
            inst.isOpen = true;
            if (onOpen)
            {
                onOpen.apply((inst.input ? inst.input[0] : null), [inst]);
            }
            $.data(target, propName, inst);
        },
        /**
        * Close opened wselectbox
        * 
        * @param {HTMLElement} target
        */
        _closeSelectbox: function (target)
        {
            var inst = this._getInst(target);
            //if (!inst || !this._state[inst.uid]) {
            if (!inst || !inst.isOpen)
            {
                return;
            }
            var onClose = this._get(inst, 'onClose');
            if(inst.settings.effect === "fade")
            {
                $("#wselectbox-options_" + inst.uid).fadeOut(inst.settings.speed);
            }
            else
            {
                $("#wselectbox-options_" + inst.uid).slideUp(inst.settings.speed);
            }
            $("#wselectbox-holder_" + inst.uid).removeClass(inst.settings.classToggleOpen);
            this._state[inst.uid] = false;
            inst.isOpen = false;
            if (onClose)
            {
                onClose.apply((inst.input ? inst.input[0] : null), [inst]);
            }
            $.data(target, propName, inst);
        },
        /**
        * Create a new instance object
        * 
        * @param {HTMLElement} target
        * @return {Object}
        */
        _newInst: function (target)
        {
            var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, '\\\\$1');
            return {
                id: id,
                input: target,
                uid: Math.floor(Math.random() * 99999999),
                isOpen: false,
                isDisabled: false,
                settings: {}
            };
        },
        /**
        * Retrieve the instance data for the target control.
        * 
        * @param {HTMLElement} target
        * @return {Object} - the associated instance data
        * @throws error if a jQuery problem getting data
        */
        _getInst: function (target)
        {
            try
            {
                return $.data(target, propName);
            }
            catch (err)
            {
                throw 'Missing instance data for this wselectbox';
            }
        },
        /**
        * Get a setting value, defaulting if necessary
        * 
        * @param {Object} inst
        * @param {String} name
        * @return {Mixed}
        */
        _get: function (inst, name)
        {
            return inst.settings[name] !== undefined ? inst.settings[name] : this._defaults[name];
        }
    });

    /**
    * Invoke the wselectbox functionality.
    * 
    * @param {Object|String} options
    * @return {Object}
    */
    $.fn.wselectbox = function (options)
    {
        var otherArgs = Array.prototype.slice.call(arguments, 1);
        if (typeof options == 'string' && options == 'isDisabled')
        {
            return $.wselectbox['_' + options + 'Selectbox'].apply($.wselectbox, [this[0]].concat(otherArgs));
        }

        if (options == 'option' && arguments.length == 2 && typeof arguments[1] == 'string')
        {
            return $.wselectbox['_' + options + 'Selectbox'].apply($.wselectbox, [this[0]].concat(otherArgs));
        }

        return this.each(function ()
        {
            if(typeof options == 'string')
            {   
                $.wselectbox['_' + options + 'Selectbox'].apply($.wselectbox, [this].concat(otherArgs));
            }
            else
            {
                $.wselectbox._attachSelectbox(this, options);
            }
        });
    };

    $.wselectbox = new wselectbox(); // singleton instance
    $.wselectbox.version = "0.1.3";
})(jQuery);

$(document).ready(function ()
{
    $(document).click(function (e)
    {
        var el = $(e.srcElement).closest('.wselectbox-holder').prev();
        $('[sb]').each(function ()
        {
            if (el[0] != this)
            {
                $(this).wselectbox('close');
            }
        });
    });
});