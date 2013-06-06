;(function($){
"use strict";
var overlay;
var zIndex = 1000;
var defaultOptions = {
    modal: false
};

var modelessZindex = [];

function _getMaxModelessZindex()
{
    var max = 999;
    $.each(modelessZindex, function(){
        var val = this;
        if(val > max)
        {
            max = val;
        }
    });

    return max;
}

function _deleteModelessZindex(zIndex)
{
    var idx = modelessZindex.indexOf(parseInt(zIndex, 10));
    if(idx !== -1)
    {
        modelessZindex.splice(idx, 1);
    }
}

function _setModelessZindex(elem, zIndex)
{
    elem.css('zIndex', zIndex);
    modelessZindex.push(parseInt(zIndex, 10));
}

$.fn.extend({
    responsiveDialog: function(options){
        var op = $.extend({}, defaultOptions, options||{});
        if(overlay === undefined)
        {
            overlay = $('<div id="responsiveDialogOverlay" />')
                .appendTo('body')
                .css({
                    position: 'absolute',
                    zIndex: '99999'
                })
                .offset({top:0, left:0})
                .hide()
                .data('responsiveDialog', {})
                ;

            overlay.on('click', function(){
                var dialog = overlay.data('responsiveDialog').dialog;
                dialog.data('responsiveDialog').close();
            });
        }

        return this.each(function(){
            var elem = $(this);
            elem.hide().css({position: 'absolute'});

            if(!op.modal)
            {
                elem.click(function(){
                    var max = _getMaxModelessZindex();
                    var current = elem.css('zIndex');
                    if(max != current)
                    {
                        _deleteModelessZindex(current);
                        var target = max + 1;
                        _setModelessZindex(elem, target);
                    }
                });
            }

            var params = {
                open: function(targetElem){
                    elem.show();
                    if(op.modal)
                    {
                        overlay.show();
                        var data = overlay.data('responsiveDialog');
                        if(data.dialog){
                            data.dialog.hide();
                        }
                        overlay.data('responsiveDialog').dialog = elem;
                        var docSize = Rect.document.rect().size;
                        overlay.width(docSize.width).height(docSize.height);
                        elem.css('zIndex', 100000);
                    }
                    else
                    {
                        var next = _getMaxModelessZindex() + 1;
                        _setModelessZindex(elem, next);
                    }


                    if(targetElem){
                        elem.center(targetElem.center());
                    } else {
                        elem.center(Rect.window.rect().center());
                    }

                    (op.onDidOpen||$.noop)({'dialog':elem});
                },
                close: function(){
                    elem.hide();
                    overlay.hide();
                    overlay.data('responsiveDialog').dialog = undefined;
                    _deleteModelessZindex(elem.css('zIndex'));
                    (op.onDidClose||$.noop)({'dialog':elem});
                }
            };

            elem.data('responsiveDialog', params);
        });
    }
});


})(jQuery);