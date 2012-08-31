// jguide script controlled 'screen explanation with narrator'
(function ($) {
    $.fn.jguide = function (script, options) {
        jqueryguide(this, script, options);
    };

    var jqueryguide = function (parent, script, options) {
        jqueryguide.fn.parent = parent;
        jqueryguide.fn.script = script;
        jqueryguide.fn.init(options);
        if (jqueryguide.fn.opts.executeImmediately) {
            jqueryguide.fn.execute();
        }
    };

    jqueryguide.fn = jqueryguide.prototype = {
        jguide: "0.0.2",
        parent: null, // TODO: Execute only within the parent
        jguideSource: "",
        opts: {
        },
        script: {
            // an array of defaultEntry elements
        },
        init: function (options) {
            var $this = this;
            // merge options
            $this.opts = $.extend(true, {}, jqueryguide.defaultOptions, options);
            $('head').append('<style id="jguidetemp" />');
            $('<div class="jguideflash"></div>').appendTo("body");
        },
        execute: function () {
            var $this = this;
            $this.script.push({ action: { scriptCall: function () { $('.jguidebubble').remove(); }, } });
            $this.executeInner($this.script);
        },
        executeInner: function (sc) {
            var $sc = sc;
            var $this = this;
            var $step = sc.shift();
            if (!$step) return;            
            // execute script element for element
            if ($($step.fieldSelector)) {
                // kill all bubbles
                $('.jguidebubble').remove();
                var elm = $($step.fieldSelector);
                if ($step.action.startFlash) {
                    $this.showFlash(elm);
                }
                if ($step.bubble) {
                    $this.showBubble(elm, $step.bubble);
                }
                if ($step.action.scriptCall instanceof Function) {
                    $step.action.scriptCall();
                }
                if ($step.fieldValue) {
                    $this.setValue(elm, $step.fieldValue);
                }
                if ($step.action.endFlash) {
                    $this.showFlash(elm);
                }
            }
            if ($step.action.afterDelay) {
                setTimeout(function () { $this.executeInner($sc); }, $step.action.afterDelay);
            }
        },
        showBubble: function (elm, bubbleParam) {
            var $el = $(elm);
            var i = $el.attr('id');
            // Make DIV and append to page 
            if (!bubbleParam.arrow) bubbleParam.arrow = '';
            var $bubble = $('<div class="jguidebubble" data-bubbles="' + i + '"><div>' + bubbleParam.header + '</div><div class="jguidecontent">' + bubbleParam.content + '</div><div class="arrow' + bubbleParam.arrow + '"></div></div>').appendTo("body");
            // Position right away, so first appearance is smooth
            var linkPosition = $el.position();
            $bubble.css({
                top: linkPosition.top + bubbleParam.offset.y - $bubble.height() -55,
                left: linkPosition.left + $el.width() - ($bubble.width() / 2) + bubbleParam.offset.x - 15
            });
            $bubble.show();
            if (bubbleParam.narrator) {
                var snd = new Audio(bubbleParam.narrator);
                snd.play();
            }
        },
        setValue: function (elm, fieldValue) {
            if (fieldValue.setValue) {
                if (fieldValue.flash) {
                    $(elm).addClass('jguidefieldflash');
                }
                if (fieldValue.human) {
                    this.typeValueInner(elm, fieldValue.value.split(''));
                } else {
                    $(elm).val(fieldValue.value);
                }
                setTimeout(function() {
                    $(elm).removeClass('jguidefieldflash');
                }, fieldValue.pause);
            }
            if (fieldValue.event) {
                setTimeout(function() {
                    $(elm).trigger(fieldValue.event);
                }, fieldValue.pause);                
            }
        },
        typeValueInner: function (elm, v) {
            var $this = this;
            $(elm).val($(elm).val() + v.shift());
            if (v.length > 0) {
                setTimeout(function() { $this.typeValueInner(elm, v); }, 50);
            }
        },
        showFlash: function (elm) {
            var $el = $(elm);
            var linkPosition = $el.position();
            var $flash = $('.jguideflash');
            $flash.css({
                top: linkPosition.top - $flash.outerHeight(),
                left: linkPosition.left - ($flash.width() / 2)
            });
            $flash.fadeIn(50);
            $flash.fadeOut(500);
        },
    };

    jqueryguide.defaultOptions = {
        executeImmediately: true
   };
    // this is just to have documentation
    jqueryguide.defaultEntry = {
        fieldSelector: '',
        fieldValue: {
            value: '',
            pause: 250,
            flash: true,
            human: true,
            event: ''
        },
        bubble: {
            header: 'Help',
            content: 'Bubble Text Goes Here...',
            offset: {
                x: 0,
                y: 0
            },
            arrow: '', // bottom, top, none
            narrator: ''
        },
        action: {
            afterDelay: 5000,
            scriptCall: function () { },
            startFlash: true,
            endFlash: true
        }
    };
})(jQuery);
