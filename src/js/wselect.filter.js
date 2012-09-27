/*
 * WSelect Filter
 * Copyright (c) 2012 Webbbers
 *
 * Fork of  http://www.erichynds.com/jquery/jquery-wselect-widget/
 *
 * Depends:
 *   - WSelect
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
*/

(function($){
    var rEscape = /[\-\[\]{}()*+?.,\\\^$|#\s]/g;
    
    $.widget("ech.wselectfilter", {
        
        options: {
            label: "Filter:",
            width: null, /* override default width set in css file (px). null will inherit */
            placeholder: "Enter keywords",
            autoReset: false
        },
        
        _create: function(){
            var self = this,
                opts = this.options,
                instance = (this.instance = $(this.element).data("wselect")),
                
                // store header; add filter class so the close/check all/uncheck all links can be positioned correctly
                header = (this.header = instance.menu.find(".wselect-header").addClass("wselect-hasfilter")),
                
                // wrapper elem
                wrapper = (this.wrapper = $('<div class="wselect-filter">'+(opts.label.length ? opts.label : '')+'<input placeholder="'+opts.placeholder+'" type="search"' + (/\d/.test(opts.width) ? 'style="width:'+opts.width+'px"' : '') + ' /></div>').prependTo( this.header ));

            // reference to the actual inputs
            this.inputs = instance.menu.find('input[type="checkbox"], input[type="radio"]');
            
            // build the input box
            this.input = wrapper
            .find("input")
            .bind({
                keydown: function( e ){
                    // prevent the enter key from submitting the form / closing the widget
                    if( e.which === 13 ){
                        e.preventDefault();
                    }
                },
                keyup: $.proxy(self._handler, self),
                click: $.proxy(self._handler, self)
            });
            
            // cache input values for searching
            this.updateCache();
            
            // rewrite internal _toggleChecked fn so that when checkAll/uncheckAll is fired,
            // only the currently filtered elements are checked
            instance._toggleChecked = function(flag, group){
                var $inputs = (group && group.length) ?
                        group :
                        this.labels.find('input'),
                    
                    _self = this,

                    // do not include hidden elems if the menu isn't open.
                    selector = self.instance._isOpen ?
                        ":disabled, :hidden" :
                        ":disabled";

                $inputs = $inputs.not( selector ).each(this._toggleState('checked', flag));
                
                // update text
                this.update();
                
                // figure out which option tags need to be selected
                var values = $inputs.map(function(){
                    return this.value;
                }).get();
                
                // select option tags
                this.element
                    .find('option')
                    .filter(function(){
                        if( !this.disabled && $.inArray(this.value, values) > -1 ){
                            _self._toggleState('selected', flag).call( this );
                        }
                    });
            };
            
            // rebuild cache when wselect is updated
            var doc = $(document).bind("wselectrefresh", function(){
                self.updateCache();
                self._handler();
            });

            // automatically reset the widget on close?
            if(this.options.autoReset) {
                doc.bind("wselectclose", $.proxy(this._reset, this));
            }
        },
        
        // thx for the logic here ben alman
        _handler: function( e ){
            var term = $.trim( this.input[0].value.toLowerCase() ),
            
                // speed up lookups
                rows = this.rows, inputs = this.inputs, cache = this.cache;
            
            if( !term ){
                rows.show();
            } else {
                rows.hide();
                
                var regex = new RegExp(term.replace(rEscape, "\\$&"), 'gi');
                
                this._trigger( "filter", e, $.map(cache, function(v, i){
                    if( v.search(regex) !== -1 ){
                        rows.eq(i).show();
                        return inputs.get(i);
                    }
                    
                    return null;
                }));
            }

            // show/hide optgroups
            this.instance.menu.find(".wselect-optgroup-label").each(function(){
                var $this = $(this);
                var isVisible = $this.nextUntil('.wselect-optgroup-label').filter(function(){
                  return $.css(this, "display") !== 'none';
                }).length;
                
                $this[ isVisible ? 'show' : 'hide' ]();
            });
        },

        _reset: function() {
            this.input.val('').trigger('keyup');
        },
        
        updateCache: function(){
            // each list item
            this.rows = this.instance.menu.find(".wselect-checkboxes li:not(.wselect-optgroup-label)");
            
            // cache
            this.cache = this.element.children().map(function(){
                var self = $(this);
                
                // account for optgroups
                if( this.tagName.toLowerCase() === "optgroup" ){
                    self = self.children();
                }
                
                return self.map(function(){
                    return this.innerHTML.toLowerCase();
                }).get();
            }).get();
        },
        
        widget: function(){
            return this.wrapper;
        },
        
        destroy: function(){
            $.Widget.prototype.destroy.call( this );
            this.input.val('').trigger("keyup");
            this.wrapper.remove();
        }
    });
})(jQuery);
