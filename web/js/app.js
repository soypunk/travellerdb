/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

/*!
 * Generated using the Bootstrap Customizer (http://getbootstrap.com/customize/?id=4d6ed1c7b67ee5183a59)
 * Config saved to config.json and https://gist.github.com/4d6ed1c7b67ee5183a59
 */
if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}
+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.5
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.5'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.5
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.5'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.5
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.5'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.5
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.5'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.5
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.5'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.5
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.5'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.5
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.5'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.5
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.5'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/*! Table of Contents jQuery Plugin - jquery.toc * Copyright 2013 Nikhil Dabas * http://www.apache.org/licenses/LICENSE-2.0 */
(function(t){"use strict";var n=function(n){return this.each(function(){var i,e,a=t(this),c=a.data(),o=[a],h=this.tagName,r=0;i=t.extend({content:"body",headings:"h1,h2,h3"},{content:c.toc||void 0,headings:c.tocHeadings||void 0},n),e=i.headings.split(","),t(i.content).find(i.headings).attr("id",function(n,i){return i||t(this).text().replace(/^[^A-Za-z]*/,"").replace(/[^A-Za-z0-9]+/g,"_")}).each(function(){var n=t(this),i=t.map(e,function(t,i){return n.is(t)?i:void 0})[0];if(i>r){var a=o[0].children("li:last")[0];a&&o.unshift(t("<"+h+"/>").appendTo(a))}else o.splice(0,Math.min(r-i,Math.max(o.length-1,0)));t("<li/>").appendTo(o[0]).append(t("<a/>").text(n.text()).attr("href","#"+n.attr("id"))),r=i})})},i=t.fn.toc;t.fn.toc=n,t.fn.toc.noConflict=function(){return t.fn.toc=i,this},t(function(){n.call(t("[data-toc]"))})})(window.jQuery);
(function app_data(data, $) {

    data.isLoaded = false;

    var database_changed = false;
    var locale_changed = false;

    var fdb = new ForerunnerDB();
    var database = fdb.db('travellerdb');
    var masters = {
        packs: database.collection('master_pack', {primaryKey: 'code'}),
        cards: database.collection('master_card', {primaryKey: 'code'})
    };

    var dfd;

    function onCollectionUpdate(updated) {
        database_changed = true;
    }

    function onCollectionInsert(inserted, failed) {
        database_changed = true;
    }

    /**
     * loads the database from local
     * sets up a Promise on all data loading/updating
     * @memberOf data
     */
    function load() {
        masters.packs.load(function (err) {
            if (err) {
                console.log('error when loading packs', err);
            }
            masters.cards.load(function (err) {
                if (err) {
                    console.log('error when loading cards', err);
                }

                /*
                 * data has been fetched from local store
                 */
                
                /*
                 * we set up insert and update listeners now
                 * if we did it before, .load() would have called onInsert
                 */
                masters.packs.on("insert", onCollectionInsert).on("update", onCollectionUpdate);
                masters.cards.on("insert", onCollectionInsert).on("update", onCollectionUpdate);

                /*
                 * if database is not empty, use it for now
                 */
                if (masters.packs.count() > 0 && masters.cards.count() > 0) {
                    release();
                }

                /*
                 * then we ask the server if new data is available
                 */
                query();
            });
        });
    }

    /**
     * release the data for consumption by other modules
     * @memberOf data
     */
    function release() {
        data.packs = database.collection('pack', {primaryKey: 'code', changeTimestamp: false});
        data.packs.setData(masters.packs.find());

        data.cards = database.collection('card', {primaryKey: 'code', changeTimestamp: false});
        data.cards.setData(masters.cards.find());

        data.isLoaded = true;

        $(document).trigger('data.app');
    }

    /**
     * queries the server to update data
     * @memberOf data
     */
    function query() {
        dfd = {
            packs: new $.Deferred(),
            cards: new $.Deferred()
        };
        $.when(dfd.packs, dfd.cards).done(update_done).fail(update_fail);

        $.ajax({
            url: Routing.generate('api_packs'),
            success: parse_packs,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('error when requesting packs', errorThrown);
                dfd.packs.reject(false);
            }
        });

        $.ajax({
            url: Routing.generate('api_cards'),
            success: parse_cards,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('error when requesting cards', errorThrown);
                dfd.cards.reject(false);
            }
        });
    }

    /**
     * called if all operations (load+update) succeed (resolve)
     * deferred returns true if data has been updated
     * @memberOf data
     */
    function update_done() {
        if (database_changed && !locale_changed) {
            /*
             * we display a message informing the user that they can reload their page to use the updated data
             * except if we are on the front page, because data is not essential on the front page
             */
            if ($('.site-title').size() === 0) {
                var message = "A new version of the data is available. Click <a href=\"javascript:window.location.reload(true)\">here</a> to reload your page.";
                app.ui.insert_alert_message('warning', message);
            }
        }

        // if it is a force update, we haven't release the data yet
        if (!data.isLoaded) {
            release();
        }
    }

    /**
     * called if an operation (load+update) fails (reject)
     * deferred returns true if data has been loaded
     * @memberOf data
     */
    function update_fail(packs_loaded, cards_loaded) {
        if (packs_loaded === false || cards_loaded === false) {
            var message = Translator.trans('data_load_fail');
            app.ui.insert_alert_message('danger', message);
        } else {
            /*
             * since data hasn't been persisted, we will have to do the query next time as well
             * -- not much we can do about it
             * but since data has been loaded, we call the promise
             */
            release();
        }
    }

    /**
     * updates the database if necessary, from fetched data
     * @memberOf data
     */
    function update_collection(data, collection, locale, deferred) {
        // we update the database and Forerunner will tell us if the data is actually different
        data.forEach(function (row) {
            if(collection.findById(row.code)) {
                collection.update({code: row.code}, row);
            } else {
                collection.insert(row);
            }
        });

        // we update the locale
        if (locale !== collection.metaData().locale) {
            locale_changed = true;
        }
        collection.metaData().locale = locale;

        collection.save(function (err) {
            if (err) {
                console.log('error when saving ' + collection.name(), err);
                deferred.reject(true)
            } else {
                deferred.resolve();
            }
        });
    }

    /**
     * handles the response to the ajax query for packs data
     * @memberOf data
     */
    function parse_packs(response, textStatus, jqXHR) {
        var locale = jqXHR.getResponseHeader('Content-Language');
        update_collection(response, masters.packs, locale, dfd.packs);
    }

    /**
     * handles the response to the ajax query for the cards data
     * @memberOf data
     */
    function parse_cards(response, textStatus, jqXHR) {
        var locale = jqXHR.getResponseHeader('Content-Language');
        update_collection(response, masters.cards, locale, dfd.cards);
    }

    $(function () {
        load();
    });

})(app.data = {}, jQuery);

(function app_format(format, $)
{

    /**
     * @memberOf format
     */
    format.traits = function traits(card)
    {
        return card.traits || '';
    };

    /**
     * @memberOf format
     */
    format.name = function name(card)
    {
        return (card.is_unique ? '<span class="icon-unique"></span> ' : "") + card.name;
    }

    format.faction = function faction(card)
    {
        var text = '<span class="fg-' + card.faction_code + ' icon-' + card.faction_code + '"></span> ' + card.faction_name + '. ';
        if(card.faction_code != 'neutral') {
            if(card.is_loyal)
                text += Translator.trans('card.info.loyal') + '. ';
            else
                text += Translator.trans('card.info.nonloyal') + '. ';
        }
        return text;
    }

    /**
     * @memberOf format
     */
    format.pack = function pack(card)
    {
        var text = card.pack_name + ' #' + card.position + '. ';
        return text;
    }

    /**
     * @memberOf format
     */
    format.info = function info(card)
    {
        var text = '<span class="card-type">' + card.type_name + '</span>';
        switch(card.type_code) {
            case 'character':
                text += Translator.trans('card.info.cost') + ': ' + (card.cost != null ? card.cost : 'X') + '. ';
                text += Translator.trans('card.info.str') + ': ' + (card.strength != null ? card.strength : 'X') + '. '
                if(card.is_military)
                    text += '<span class="color-military icon-military" title="' + Translator.trans('challenges.military') + '"></span> ';
                if(card.is_intrigue)
                    text += '<span class="color-intrigue icon-intrigue" title="' + Translator.trans('challenges.intrigue') + '"></span> ';
                if(card.is_power)
                    text += '<span class="color-power icon-power" title="' + Translator.trans('challenges.power') + '"></span> ';
                break;
            case 'attachment':
            case 'location':
            case 'event':
                text += '<p><span class="card-traits">' + card.traits + '</span></p>';
                text += Translator.trans('card.info.cost') + ': ' + (card.cost != null ? card.cost : 'X') + '. ';
                text += Translator.trans('card.info.expense') + ': ' +(card.expense != null ? card.expense : 'X') + '<span class="expenses"></span>';
                break;
            case 'plot':
                text += Translator.trans('card.info.income') + ': ' + card.income + '. ';
                text += Translator.trans('card.info.initiative') + ': ' + card.initiative + '. ';
                text += Translator.trans('card.info.claim') + ': ' + card.claim + '. ';
                text += Translator.trans('card.info.reserve') + ': ' + card.reserve + '. ';
                text += Translator.trans('card.info.plotlimit') + ': ' + card.deck_limit + '. ';
                break;
            case 'adv':
                text += '<p><span class="distance"></span>: ' + card.distance +'     <span class="card-type">   ' + card.contractname + '</span></p>';
                text += '<p><span class="card-traits">' + card.traits + '</span></p>';
                text += '<p>' + Translator.trans('card.info.contractrequirements') + ': ' + card.contractrequirements  + '</p>';
                text += '<p>' + Translator.trans('card.info.subplots') + ': ' + (card.subplots != null ? card.subplots : '') + '</p>';
                text += '<p>' + (card.compslots != null ? card.compslots : '') + '<span class="complication"></span>  '
                text +=  + (card.abandpenalty != null ? card.abandpenalty : '') + '<span class="abandonment"></span>  '
                text +=  + (card.victorypoints != null ? card.victorypoints : '') + '<span class="victoryppoint"></span></p>';
                text += '<p><span class="card-type">' + card.complicationname + '</span><br />';
                text += '<span class="card-traits">' + (card.complicationtraits != null ? card.complicationtraits : '') + '</span><br />';
                text += '<span class="card-info">' + Translator.trans('card.info.complicationtext') + ': ' + card.complicationtext + '</span></p>';
                text += '<p><span class="abandonment"></span><span class="card-info">: ' + (card.abandpenmodifier != null ? card.abandpenmodifier : '') + '</span></p>';
                break;
            case 'conn':
                text += ' - <span class="card-type">'+ card.subtype_name +'</span>';
                text += '<p><span class="card-traits">' + card.traits + '</span></p>';
                text += Translator.trans('card.info.cost') + ': ' + (card.cost != null ? card.cost : 'X') + '. ';
                text += Translator.trans('card.info.expense') + ': ' +(card.expense != null ? card.expense : 'X') + '<span class="expenses"></span>';
                break;
            case 'crew':
                text += '<p><span class="card-traits">' + card.traits + '</span></p>';
                text += '<p><span class="card-info">' + Translator.trans('card.info.species') + ': ' + (card.species != null ? card.species: '<em>Classified</em>' ) + '</span><br />';
                text += '<span class="card-info">' + Translator.trans('card.info.skill') + ': ' + (card.skills != null ? card.skills: '<em>Classified</em>' ) + '</span></p>';
                text += Translator.trans('card.info.wound') + ': ' + (card.wound != null ? card.wound : 'X') + '<span class="wounds"></span>. <br />';
                text += Translator.trans('card.info.cost') + ': ' + (card.cost != null ? card.cost : 'X') + '. ';
                text += Translator.trans('card.info.expense') + ': ' +(card.expense != null ? card.expense : 'X') + '<span class="expenses"></span>';
                break;
            case 'gear':
                text += ' - <span class="card-type">'+ card.subtype_name +'</span>';
                text += '<p><span class="card-traits">' + card.traits + '</span></p>';
                text += Translator.trans('card.info.cost') + ': ' + (card.cost != null ? card.cost : 'X') + '. ';
                text += Translator.trans('card.info.expense') + ': ' +(card.expense != null ? card.expense : 'X') + '<span class="expenses"></span>';
                break;
            case 'heroic':
                text += '<p><span class="card-traits">' + card.traits + '</span></p>';
                text += '<span class="card-info">' + Translator.trans('card.info.requiredskill') + ': ' + (card.requiredskill != null ? card.requiredskill: '<em>Classified</em>' ) + '</span></p>';
                text += Translator.trans('card.info.cost') + ': ' + (card.cost != null ? card.cost : 'X') + '. ';
                text += Translator.trans('card.info.expense') + ': ' +(card.expense != null ? card.expense : 'X') + '<span class="expenses"></span>';
                break;
            case 'upgrade':
                text += ' - <span class="card-type">'+ card.subtype_name +'</span>';
                text += '<p><span class="card-traits">' + card.traits + '</span></p>';
                text += '<span class="card-info">' + Translator.trans('card.info.tonnage') + ': ' + (card.tonnagerequirement != null ? card.tonnagerequirement: '<em>Classified</em>' ) + '</span></p>';
                text += Translator.trans('card.info.structure') + ': ' + (card.structure != null ? card.structure: '<em>Classified</em>' ) + '<span class="structure"></span><br />';
                text += Translator.trans('card.info.cost') + ': ' + (card.cost != null ? card.cost : 'X') + '. ';
                text += Translator.trans('card.info.expense') + ': ' +(card.expense != null ? card.expense : 'X') + '<span class="expenses"></span>';
                break;
            case 'ship':
                text += '<p><span class="card-traits">' + card.traits + '</span>     <span class="card-type">' + Translator.trans('card.info.tonnage') + ': ' + (card.tonnage != null ? card.tonnage: '<em>Classified</em>' ) + '</span></p>';
                text += '<p><span class="card-info">' + Translator.trans('card.info.capabilities') + ': ' + (card.capabilities != null ? card.capabilities: '<em>Classified</em>' ) + '</span></p>';
                text += '<p><span class="initiative"></span>: ' + (card.initiative != null ? card.initiative : 'X') + '  ';
                text += '<span class="jump"></span>: '+ (card.jump != null ? card.jump : 'X') + '  ';
                text += '<span class="attack"></span>: ' + (card.attack != null ? card.attack : 'X') + '  ';
                text += '<span class="defense"></span>: '+ (card.defense != null ? card.defense : 'X') + '</p>';
                text += '<p>'
                    + ' <span class="crew"></span>: ' + (card.crew != null ? card.crew : 'X') + '  '
                    + ' <span class="computer"></span>: ' + (card.computer != null ? card.computer : 'X') + '  '
                    + ' <span class="hardpoint"></span>: ' + (card.hardpoint != null ? card.hardpoint : 'X') + '  '
                    + ' <span class="hull"></span>: ' + (card.hull != null ? card.hull : 'X') + '  '
                    + ' <span class="internal"></span>: ' + (card.internal != null ? card.internal : 'X') + '  '
                    + '</p>';
                break;
        }

        text = text.replace(/\[(\w+)\]/g, '<span class="$1"></span>');
        text = text.split("\\n").join('</p><p>');
        text = text.replace(/\[Cargo\/Passenger\]/g, '<span class="CargoPassenger"></span>');
        text = text.replace(/\[Military\/Passenger\]/g, '<span class="PassengerMilitary"></span>');
        text = text.replace(/\[Military\/Survey\]/g, '<span class="MilitarySurvey"></span>');
        text = text.replace(/\[Passenger\/Survey\]/g, '<span class="PassengerSurvey"></span>');
        text = text.replace(/\[Cargo\/Survey\]/g, '<span class="CargoSurvey"></span>');
        text = text.replace(/\[Cargo\/Military\]/g, '<span class="CargoMilitary"></span>');
        text = text.replace(/\[Trained\:Admin\]/g, '<span class="admintrained"></span>');
        text = text.replace(/\[Expert\:Admin\]/g, '<span class="adminexpert"></span>');
        text = text.replace(/\[Trained\:Combat\]/g, '<span class="combattrained"></span>');
        text = text.replace(/\[Expert\:Combat\]/g, '<span class="combatexpert"></span>');
        text = text.replace(/\[Trained\:Jack\]/g, '<span class="jacktrained"></span>');
        text = text.replace(/\[Expert\:Jack\]/g, '<span class="jackexpert"></span>');
        text = text.replace(/\[Trained\:Medical\]/g, '<span class="medicaltrained"></span>');
        text = text.replace(/\[Expert\:Medical\]/g, '<span class="medicalexpert"></span>');
        text = text.replace(/\[Trained\:Psionics\]/g, '<span class="psionicstrained"></span>');
        text = text.replace(/\[Expert\:Psionics\]/g, '<span class="psionicsexpert"></span>');
        text = text.replace(/\[Trained\:Psionic\]/g, '<span class="psionictrained"></span>');
        text = text.replace(/\[Expert\:Psionic\]/g, '<span class="psionicexpert"></span>');
        text = text.replace(/\[Trained\:Science\]/g, '<span class="sciencetrained"></span>');
        text = text.replace(/\[Expert\:Science\]/g, '<span class="scienceexpert"></span>');
        text = text.replace(/\[Trained\:Social\]/g, '<span class="socialtrained"></span>');
        text = text.replace(/\[Expert\:Social\]/g, '<span class="socialexpert"></span>');
        text = text.replace(/\[Trained\:StarshipOps\]/g, '<span class="staropstrained"></span>');
        text = text.replace(/\[Expert\:StarshipOps\]/g, '<span class="staropsexpert"></span>');
        text = text.replace(/\[Trained\:Tech\]/g, '<span class="techtrained"></span>');
        text = text.replace(/\[Expert\:Tech\]/g, '<span class="techexpert"></span>');
        text = text.replace(/\[Trained\:Underworld\]/g, '<span class="underworldtrained"></span>');
        text = text.replace(/\[Expert\:Underworld\]/g, '<span class="underworldexpert"></span>');
        text = text.replace(/\[Trained\:StarshipOperation\]/g, '<span class="staropstrained"></span>');
        text = text.replace(/\[Expert\:StarshipOperation\]/g, '<span class="staropsexpert"></span>');
        text = text.replace(/\[Admin\]/g, '<span class="expert"></span>');
        text = text.replace(/\[Combat\]/g, '<span class="combat"></span>');
        text = text.replace(/\[Jack\]/g, '<span class="jack"></span>');
        text = text.replace(/\[Medical\]/g, '<span class="medical"></span>');
        text = text.replace(/\[Psionic\]/g, '<span class="psionic"></span>');
        text = text.replace(/\[Science\]/g, '<span class="science"></span>');
        text = text.replace(/\[Social\]/g, '<span class="social"></span>');
        text = text.replace(/\[StarshipOps\]/g, '<span class="starops"></span>');
        text = text.replace(/\[Tech\]/g, '<span class="tech"></span>');
        text = text.replace(/\[Underworld\]/g, '<span class="underworld"></span>');
        text = text.replace(/\[StarshipOperation\]/g, '<span class="starops"></span>');
        text = text.replace(/\[Jump\]/g, '<span class="jump"></span>span>');

        return text;
    };

    /**
     * @memberOf format
     */
    format.text = function text(card)
    {
        var text = card.text || '';
        text = text.replace(/\[(\w+)\]/g, '<span class="$1"></span>');
        text = text.split("\\n").join('</p><p>');
        /* text = text.replace(/\\n/g, '<br />');*/
        text = text.replace(/\[Cargo\/Passenger\]/g, '<span class="CargoPassenger"></span>');
        text = text.replace(/\[Military\/Passenger\]/g, '<span class="PassengerMilitary"></span>');
        text = text.replace(/\[Military\/Survey\]/g, '<span class="MilitarySurvey"></span>');
        text = text.replace(/\[Passenger\/Survey\]/g, '<span class="PassengerSurvey"></span>');
        text = text.replace(/\[Cargo\/Survey\]/g, '<span class="CargoSurvey"></span>');
        text = text.replace(/\[Cargo\/Military\]/g, '<span class="CargoMilitary"></span>');
        text = text.replace(/\[Trained\:Admin\]/g, '<span class="admintrained"></span>');
        text = text.replace(/\[Expert\:Admin\]/g, '<span class="adminexpert"></span>');
        text = text.replace(/\[Trained\:Combat\]/g, '<span class="combattrained"></span>');
        text = text.replace(/\[Expert\:Combat\]/g, '<span class="combatexpert"></span>');
        text = text.replace(/\[Trained\:Jack\]/g, '<span class="jacktrained"></span>');
        text = text.replace(/\[Expert\:Jack\]/g, '<span class="jackexpert"></span>');
        text = text.replace(/\[Trained\:Medical\]/g, '<span class="medicaltrained"></span>');
        text = text.replace(/\[Expert\:Medical\]/g, '<span class="medicalexpert"></span>');
        text = text.replace(/\[Trained\:Psionics\]/g, '<span class="psionicstrained"></span>');
        text = text.replace(/\[Expert\:Psionics\]/g, '<span class="psionicsexpert"></span>');
        text = text.replace(/\[Trained\:Psionic\]/g, '<span class="psionictrained"></span>');
        text = text.replace(/\[Expert\:Psionic\]/g, '<span class="psionicexpert"></span>');
        text = text.replace(/\[Trained\:Science\]/g, '<span class="sciencetrained"></span>');
        text = text.replace(/\[Expert\:Science\]/g, '<span class="scienceexpert"></span>');
        text = text.replace(/\[Trained\:Social\]/g, '<span class="socialtrained"></span>');
        text = text.replace(/\[Expert\:Social\]/g, '<span class="socialexpert"></span>');
        text = text.replace(/\[Trained\:StarshipOps\]/g, '<span class="starsopstrained"></span>');
        text = text.replace(/\[Expert\:StarshipOps\]/g, '<span class="staropsexpert"></span>');
        text = text.replace(/\[Trained\:Tech\]/g, '<span class="techtrained"></span>');
        text = text.replace(/\[Expert\:Tech\]/g, '<span class="techexpert"></span>');
        text = text.replace(/\[Trained\:Underworld\]/g, '<span class="underworldtrained"></span>');
        text = text.replace(/\[Expert\:Underworld\]/g, '<span class="underworldexpert"></span>');
        text = text.replace(/\[Trained\:StarshipOperation\]/g, '<span class="staropstrained"></span>');
        text = text.replace(/\[Expert\:StarshipOperation\]/g, '<span class="staropsexpert"></span>');
        text = text.replace(/\[Jump\]/g, '<span class="jump"></span>span>');
        return '<p>' + text + '</p>';
    };

})(app.format = {}, jQuery);

/* global app */

(function app_tip(tip, $)
{

    var cards_zoom_regexp = /card\/(\d\d\d\d\d)$/,
            mode = 'text',
            hide_event = 'mouseout';

    function display_card_on_element(card, element, event)
    {
        var content;
        if(mode === 'text') {
            var image = card.imagesrc ? '<div class="card-thumbnail card-thumbnail-' + (card.type_code === 'plot' ? 4 : 3) + 'x card-thumbnail-' + card.type_code + '" style="background-image:url(' + card.imagesrc + ')"></div>' : "";

            content = image
                    + '<h4 class="card-name">' + app.format.name(card) + '</h4>'
                    + '<div class="card-info">' + app.format.info(card) + '</div>'
                    + '<div class="card-text border-' + card.faction_code + '">' + app.format.text(card) + '</div>'
                    + '<div class="card-pack">' + app.format.pack(card) + '</div>'
                    ;

        } else {
            content = card.imagesrc ? '<img src="' + card.imagesrc + '">' : "";
        }

        var qtip = {
            content: {
                text: content
            },
            style: {
                classes: 'card-content qtip-bootstrap qtip-thronesdb qtip-thronesdb-' + mode
            },
            position: {
                my: mode === 'text' ? 'center left' : 'top left',
                at: mode === 'text' ? 'center right' : 'bottom right',
                viewport: $(window)
            },
            show: {
                event: event.type,
                ready: true,
                solo: true
            },
            hide: {
                event: hide_event
            }
        };

        $(element).qtip(qtip, event);
    }

    /**
     * @memberOf tip
     * @param event
     */
    tip.display = function display(event)
    {
        var code = $(this).data('code');
        var card = app.data.cards.findById(code);
        if(!card)
            return;
        display_card_on_element(card, this, event);
    };

    /**
     * @memberOf tip
     * @param event
     */
    tip.guess = function guess(event)
    {
        if($(this).hasClass('no-popup'))
            return;
        var href = $(this).get(0).href;
        if(href && href.match(cards_zoom_regexp)) {
            var code = RegExp.$1;
            var generated_url = Routing.generate('cards_zoom', {card_code: code}, true);
            var card = app.data.cards.findById(code);
            if(card && href === generated_url) {
                display_card_on_element(card, this, event);
            }
        }
    };

    tip.set_mode = function set_mode(opt_mode)
    {
        if(opt_mode === 'text' || opt_mode === 'image') {
            mode = opt_mode;
        }
    };

    tip.set_hide_event = function set_hide_event(opt_hide_event)
    {
        if(opt_hide_event === 'mouseout' || opt_hide_event === 'unfocus') {
            hide_event = opt_hide_event;
        }
    };

    $(document).on('start.app', function ()
    {
        $('body').on({
            mouseover: tip.display
        }, 'a.card-tip');

        $('body').on({
            mouseover: tip.guess
        }, 'a:not(.card-tip)');
    });

})(app.tip = {}, jQuery);

(function app_card_modal(card_modal, $)
{

    var modal = null;

    /**
     * @memberOf card_modal
     */
    card_modal.display_modal = function display_modal(event, element)
    {
        event.preventDefault();
        $(element).qtip('destroy', true);
        fill_modal($(element).data('code'));
    };

    /**
     * @memberOf card_modal
     */
    card_modal.typeahead = function typeahead(event, card)
    {
        fill_modal(card.code);
        $('#cardModal').modal('show');
    };

    function fill_modal(code)
    {
        var card = app.data.cards.findById(code),
                modal = $('#cardModal');

        if(!card)
            return;

        modal.data('code', code);
        modal.find('.card-modal-link').attr('href', card.url);
        modal.find('h3.modal-title').html(app.format.name(card));
        modal.find('.modal-image').html('<img class="img-responsive" src="' + card.imagesrc + '">');
        modal.find('.modal-info').html (
            '<div class="card-info">' + app.format.info(card)+ '<div>'
            + '<div class="card-text border-' + card.faction_code + '">' + app.format.text(card) + '</div>'
            + '<div class="card-pack">' + app.format.pack(card) + '</div>'
        );
        /* modal.find('.modal-info').html(
                '<div class="card-faction">' + app.format.faction(card) + '</div>'
                + '<div class="card-info">' + app.format.info(card) + '</div>'
                + '<div class="card-traits">' + app.format.traits(card) + '</div>'
                + '<div class="card-text border-' + card.faction_code + '">' + app.format.text(card) + '</div>'
                + '<div class="card-pack">' + app.format.pack(card) + '</div>'
                );
        */
        var qtyelt = modal.find('.modal-qty');
        if(qtyelt) {

            var qty = '';
            for(var i = 0; i <= card.maxqty; i++) {
                qty += '<label class="btn btn-default"><input type="radio" name="qty" value="' + i + '">' + i + '</label>';
            }
            qtyelt.html(qty);

            qtyelt.find('label').each(function (index, element)
            {
                if(index == card.indeck)
                    $(element).addClass('active');
                else
                    $(element).removeClass('active');
            });

        } else {
            if(qtyelt)
                qtyelt.closest('.row').remove();
        }
    }

    $(function ()
    {

        $('body').on({click: function (event)
            {
                var element = $(this);
                if(event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
                    event.stopPropagation();
                    return;
                }
                card_modal.display_modal(event, element);
            }}, '.card');

    })

})(app.card_modal = {}, jQuery);

/* global moment, Translator, app */

(function app_user(user, $)
{

    user.params = {};

    /**
     * Deferred Object. The handlers are defined at the end of the module, once the functions are declared
     * resolve: the User is logged in (authenticated session)
     * reject: the User is not logged in (anonymous session)
     */
    user.loaded = $.Deferred();

    /**
     * @memberOf user
     */
    user.query = function query()
    {
        $.ajax(Routing.generate('user_info', user.params), {
            cache: false,
            dataType: 'json',
            success: function (data, textStatus, jqXHR)
            {
                user.data = data;
                if(user.data) {
                    user.loaded.resolve();
                } else {
                    user.loaded.reject();
                }
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log('[' + moment().format('YYYY-MM-DD HH:mm:ss') + '] Error on ' + this.url, textStatus, errorThrown);
                user.loaded.reject();
            }
        });
    };

    /**
     * @memberOf user
     */
    user.retrieve = function retrieve()
    {
        if(localStorage) {
            var timestamp = new Date(parseInt(localStorage.getItem('user_timestamp'), 10));
            var now = new Date();
            if(now - timestamp < 3600000) {
                var storedData = localStorage.getItem('user');
                if(storedData) {
                    user.data = JSON.parse(storedData);
                    if(user.data) {
                        user.loaded.resolve();
                    } else {
                        user.loaded.reject();
                    }
                    return;
                }
            }
        }
        user.query();
    };

    /**
     * @memberOf user
     */
    user.wipe = function wipe()
    {
        localStorage.removeItem('user');
        localStorage.removeItem('user_timestamp');
    };

    /**
     * @memberOf user
     */
    user.store = function store()
    {
        localStorage.setItem('user', JSON.stringify(user.data));
        localStorage.setItem('user_timestamp', new Date().getTime());
    };

    /**
     * @memberOf user
     */
    user.anonymous = function anonymous()
    {
        user.wipe();
        user.dropdown('<ul class="dropdown-menu"><li><a href="' + Routing.generate('fos_user_security_login') + '">' + Translator.trans('nav.user.loginregister') + '</a></li></ul>');
    };

    /**
     * @memberOf user
     */
    user.update = function update()
    {
        user.store();
        user.dropdown('<ul class="dropdown-menu"><li><a href="'
                + Routing.generate('user_profile_edit')
                + '">' + Translator.trans('nav.user.editaccount') + '</a></li><li><a href="'
                + user.data.public_profile_url
                + '">' + Translator.trans('nav.user.profile') + '</a></li><li><a href="'
                + Routing.generate('fos_user_security_logout')
                + '" onclick="app.user.wipe()">' + Translator.trans('nav.user.logout') + '</a></li></ul>');
    };

    user.dropdown = function dropdown(list)
    {
        $('#login a').append('<span class="caret"></span>').removeClass('disabled').addClass('dropdown-toggle').attr('data-toggle', 'dropdown').after(list);
    };

    /**
     * @memberOf user
     */
    user.display_ads = function display_ads()
    {
        // show ads if not donator
        if(user.data && user.data.donation > 0)
            return;

        adsbygoogle = window.adsbygoogle || [];

        $('div.ad').each(function (index, element)
        {
            $(element).show();
            adsbygoogle.push({});
        });
        /*
         if($('ins.adsbygoogle').filter(':visible').length === 0) {
         $('div.ad').each(function (index, element) {
         $(element).addClass('ad-blocked').html("Please whitelist us<br>or <a href=\""+Routing.generate('donators')+"\">donate</a>.");
         });
         }
         */
    };

    user.loaded.done(user.update).fail(user.anonymous).always(user.display_ads);

    $(function ()
    {
        if($.isEmptyObject(user.params)) {
            user.retrieve();
        } else {
            user.query();
        }
    });

})(app.user = {}, jQuery);

/**
 * binomial coefficient module, shamelessly ripped from https://github.com/pboyer/binomial.js
 */
(function app_binomial(binomial, $)
{

    var memo = [];

    /**
     * @memberOf binomial
     */
    binomial.get = function (n, k)
    {
        if(k === 0) {
            return 1;
        }
        if(n === 0 || k > n) {
            return 0;
        }
        if(k > n - k) {
            k = n - k;
        }
        if(memo_exists(n, k)) {
            return get_memo(n, k);
        }
        var r = 1,
                n_o = n;
        for(var d = 1; d <= k; d++) {
            if(memo_exists(n_o, d)) {
                n--;
                r = get_memo(n_o, d);
                continue;
            }
            r *= n--;
            r /= d;
            memoize(n_o, d, r);
        }
        return r;
    };

    function memo_exists(n, k)
    {
        return (memo[n] != undefined && memo[n][k] != undefined);
    }

    function get_memo(n, k)
    {
        return memo[n][k];
    }

    function memoize(n, k, val)
    {
        if(memo[n] === undefined) {
            memo[n] = [];
        }
        memo[n][k] = val;
    }

})(app.binomial = {}, jQuery);

/**
 * hypergeometric distribution module, homemade
 */
(function app_hypergeometric(hypergeometric, $)
{

    var memo = [];

    /**
     * @memberOf hypergeometric
     */
    hypergeometric.get = function (k, N, K, n)
    {
        if(!k || !N || !K || !n)
            return 0;
        if(memo_exists(k, N, K, n)) {
            return get_memo(k, N, K, n);
        }
        if(memo_exists(n - k, N, N - K, n)) {
            return get_memo(n - k, N, N - K, n);
        }
        if(memo_exists(K - k, N, K, N - n)) {
            return get_memo(K - k, N, K, N - n);
        }
        if(memo_exists(k, N, n, K)) {
            return get_memo(k, N, n, K);
        }
        var d = app.binomial.get(N, n);
        if(d === 0)
            return 0;
        var r = app.binomial.get(K, k) * app.binomial.get(N - K, n - k) / d;
        memoize(k, N, K, n, r);
        return r;
    }

    /**
     * @memberOf hypergeometric
     */
    hypergeometric.get_cumul = function (k, N, K, n)
    {
        var r = 0;
        for(; k <= n; k++) {
            r += hypergeometric.get(k, N, K, n);
        }
        return r;
    }

    /**
     * @memberOf hypergeometric
     */
    function memo_exists(k, N, K, n)
    {
        return (memo[k] != undefined && memo[k][N] != undefined && memo[k][N][K] != undefined && memo[k][N][K][n] != undefined);
    }

    /**
     * @memberOf hypergeometric
     */
    function get_memo(k, N, K, n)
    {
        return memo[k][N][K][n];
    }

    /**
     * @memberOf hypergeometric
     */
    function memoize(k, N, K, n, val)
    {
        if(memo[k] === undefined) {
            memo[k] = [];
        }
        if(memo[k][N] === undefined) {
            memo[k][N] = [];
        }
        if(memo[k][N][K] === undefined) {
            memo[k][N][K] = [];
        }
        memo[k][N][K][n] = val;
    }

})(app.hypergeometric = {}, jQuery);

(function app_adv_draw_simulator(adv_draw_simulator, $)
{

    var advdeck = null,
            initial_size = 0,
            draw_count = 0,
            container = null;

    /**
     * @memberOf adv_draw_simulator
     */
    adv_draw_simulator.reset = function reset()
    {
        $(container).empty();
        adv_draw_simulator.on_data_loaded();
        draw_count = 0;
        adv_draw_simulator.update_odds();
        $('#draw-adv-simulator-clear').prop('disabled', true);
    };

    /**
     * @memberOf adv_draw_simulator
     */
    adv_draw_simulator.on_dom_loaded = function on_dom_loaded()
    {
        $('#table-adv-draw-simulator').on('click', 'button.btn', adv_draw_simulator.handle_click);
        $('#table-adv-draw-simulator').on('click', 'img, div.card-proxy', adv_draw_simulator.toggle_opacity);
        container = $('#table-adv-draw-simulator-content');

        $('#advOddsModal').on({change: adv_draw_simulator.compute_odds}, 'input');
    }

    /**
     * @memberOf adv_draw_simulator
     */
    adv_draw_simulator.compute_odds = function compute_odds()
    {
        var inputs = {};
        $.each(['N', 'K', 'n', 'k'], function (i, key)
        {
            inputs[key] = parseInt($('#odds-calculator-' + key).val(), 10) || 0;
        });
        $('#adv-odds-calculator-p').text(Math.round(100 * app.hypergeometric.get_cumul(inputs.k, inputs.N, inputs.K, inputs.n)));
    }

    /**
     * @memberOf adv_draw_simulator
     */
    adv_draw_simulator.on_data_loaded = function on_data_loaded()
    {
        advdeck = [];

        var cards = app.deck.get_adventure_deck();
        cards.forEach(function (card)
        {
            for(var ex = 0; ex < card.indeck; ex++) {
                advdeck.push(card);
            }
        });
        initial_size = advdeck.length;
    }

    /**
     * @memberOf adv_draw_simulator
     */
    adv_draw_simulator.update_odds = function update_odds()
    {
        for(var i = 1; i <= 3; i++) {
            var odd = app.hypergeometric.get_cumul(1, initial_size, i, draw_count);
            $('#adv-draw-simulator-odds-' + i).text(Math.round(100 * odd));
        }
    }

    /**
     * @memberOf adv_draw_simulator
     * @param draw integer
     */
    adv_draw_simulator.do_draw = function do_draw(draw)
    {
        for(var pick = 0; pick < draw && advdeck.length > 0; pick++) {
            var rand = Math.floor(Math.random() * advdeck.length);
            var spliced = advdeck.splice(rand, 1);
            var card = spliced[0];
            var card_element;
            if(card.imagesrc) {
                card_element = $('<img src="' + card.imagesrc + '">');
            } else {
                card_element = $('<div class="card-proxy"><div>' + card.label + '</div></div>');
            }
            container.append(card_element);
            draw_count++;
        }
        adv_draw_simulator.update_odds();
    }

    /**
     * @memberOf adv_draw_simulator
     */
    adv_draw_simulator.handle_click = function handle_click(event)
    {

        event.preventDefault();

        var command = $(this).data('command');
        $('[data-command=clear]').prop('disabled', false);
        if(command === 'clear') {
            adv_draw_simulator.reset();
            return;
        }
        if(event.shiftKey) {
            adv_draw_simulator.reset();
        }
        var draw;
        if(command === 'all') {
            draw = advdeck.length;
        } else {
            draw = command;
        }

        if(isNaN(draw))
            return;
        adv_draw_simulator.do_draw(draw);

    };

    /**
     * @memberOf adv_draw_simulator
     */
    adv_draw_simulator.toggle_opacity = function toggle_opacity(event)
    {
        $(this).css('opacity', 1.5 - parseFloat($(this).css('opacity')));
    };

})(app.adv_draw_simulator = {}, jQuery);

(function app_draw_simulator(draw_simulator, $)
{

    var deck = null,
            initial_size = 0,
            draw_count = 0,
            container = null;

    /**
     * @memberOf draw_simulator
     */
    draw_simulator.reset = function reset()
    {
        $(container).empty();
        draw_simulator.on_data_loaded();
        draw_count = 0;
        draw_simulator.update_odds();
        $('#draw-simulator-clear').prop('disabled', true);
    };

    /**
     * @memberOf draw_simulator
     */
    draw_simulator.on_dom_loaded = function on_dom_loaded()
    {
        $('#table-draw-simulator').on('click', 'button.btn', draw_simulator.handle_click);
        $('#table-draw-simulator').on('click', 'img, div.card-proxy', draw_simulator.toggle_opacity);
        container = $('#table-draw-simulator-content');

        $('#oddsModal').on({change: draw_simulator.compute_odds}, 'input');
    }

    /**
     * @memberOf draw_simulator
     */
    draw_simulator.compute_odds = function compute_odds()
    {
        var inputs = {};
        $.each(['N', 'K', 'n', 'k'], function (i, key)
        {
            inputs[key] = parseInt($('#odds-calculator-' + key).val(), 10) || 0;
        });
        $('#odds-calculator-p').text(Math.round(100 * app.hypergeometric.get_cumul(inputs.k, inputs.N, inputs.K, inputs.n)));
    }

    /**
     * @memberOf draw_simulator
     */
    draw_simulator.on_data_loaded = function on_data_loaded()
    {
        deck = [];

        var cards = app.deck.get_draw_deck();
        cards.forEach(function (card)
        {
            for(var ex = 0; ex < card.indeck; ex++) {
                deck.push(card);
            }
        });
        initial_size = deck.length;
    }

    /**
     * @memberOf draw_simulator
     */
    draw_simulator.update_odds = function update_odds()
    {
        for(var i = 1; i <= 3; i++) {
            var odd = app.hypergeometric.get_cumul(1, initial_size, i, draw_count);
            $('#draw-simulator-odds-' + i).text(Math.round(100 * odd));
        }
    }

    /**
     * @memberOf draw_simulator
     * @param draw integer
     */
    draw_simulator.do_draw = function do_draw(draw)
    {
        for(var pick = 0; pick < draw && deck.length > 0; pick++) {
            var rand = Math.floor(Math.random() * deck.length);
            var spliced = deck.splice(rand, 1);
            var card = spliced[0];
            var card_element;
            if(card.imagesrc) {
                card_element = $('<img src="' + card.imagesrc + '">');
            } else {
                card_element = $('<div class="card-proxy"><div>' + card.label + '</div></div>');
            }
            container.append(card_element);
            draw_count++;
        }
        draw_simulator.update_odds();
    }

    /**
     * @memberOf draw_simulator
     */
    draw_simulator.handle_click = function handle_click(event)
    {

        event.preventDefault();

        var command = $(this).data('command');
        $('[data-command=clear]').prop('disabled', false);
        if(command === 'clear') {
            draw_simulator.reset();
            return;
        }
        if(event.shiftKey) {
            draw_simulator.reset();
        }
        var draw;
        if(command === 'all') {
            draw = deck.length;
        } else {
            draw = command;
        }

        if(isNaN(draw))
            return;
        draw_simulator.do_draw(draw);

    };

    /**
     * @memberOf draw_simulator
     */
    draw_simulator.toggle_opacity = function toggle_opacity(event)
    {
        $(this).css('opacity', 1.5 - parseFloat($(this).css('opacity')));
    };

})(app.draw_simulator = {}, jQuery);

/* global _, app, Translator */

(function app_textcomplete(textcomplete, $)
{

    var icons = 'baratheon greyjoy intrigue lannister martell military thenightswatch power stark targaryen tyrell unique plot attachment location character event agenda neutral'.split(' ');

    /**
     * options: cards, icons, users
     */
    textcomplete.setup = function setup(textarea, options)
    {

        options = _.extend({cards: true, icons: true, users: false}, options);

        var actions = [];

        if(options.cards) {
            actions.push({
                match: /\B#([\-+\w]*)$/,
                search: function (term, callback)
                {
                    var regexp = new RegExp('\\b' + term, 'i');
                    callback(app.data.cards.find({
                        name: regexp
                    }));
                },
                template: function (value)
                {
                    return value.label;
                },
                replace: function (value)
                {
                    return '[' + value.label + ']('
                            + Routing.generate('cards_zoom', {card_code: value.code})
                            + ')';
                },
                index: 1
            });
        }

        if(options.icons) {
            actions.push({
                match: /\$([\-+\w]*)$/,
                search: function (term, callback)
                {
                    var regexp = new RegExp(term, 'i');
                    callback(_.filter(icons,
                            function (symbol)
                            {
                                return regexp.test(Translator.trans('icon.' + symbol));
                            }
                    ));
                },
                template: function (value)
                {
                    return Translator.trans('icon.' + value);
                },
                replace: function (value)
                {
                    return '<span class="icon-' + value + '"></span>';
                },
                index: 1
            });
        }

        if(options.users) {
            actions.push({
                match: /\B@([\-+\w]*)$/,
                search: function (term, callback)
                {
                    var regexp = new RegExp('^' + term, 'i');
                    callback($.grep(options.users, function (user)
                    {
                        return regexp.test(user);
                    }));
                },
                template: function (value)
                {
                    return value;
                },
                replace: function (value)
                {
                    return '`@' + value + '`';
                },
                index: 1
            });
        }

        $(textarea).textcomplete(actions);

    };

})(app.textcomplete = {}, jQuery);

(function app_markdown(markdown, $)
{

    markdown.setup = function setup(textarea, preview)
    {
        $(textarea).on('change keyup', function ()
        {
            $(preview).html(marked($(textarea).val()))
        });
        $(textarea).trigger('change');
    }

    markdown.refresh = function refresh(textarea, preview)
    {
        $(preview).html(marked($(textarea).val()))
    }

    markdown.update = function update(text_markdown, preview)
    {
        $(preview).html(marked(text_markdown))
    }

})(app.markdown = {}, jQuery);

(function app_smart_filter(smart_filter, $)
{

    var SmartFilterQuery = [];

    var configuration = {
        a: [add_string_sf, 'flavor', Translator.trans('decks.smartfilter.filters.flavor')],
        e: [add_string_sf, 'pack_code', Translator.trans('decks.smartfilter.filters.pack_code')],
        f: [add_string_sf, 'faction_code', Translator.trans('decks.smartfilter.filters.faction_code')],
        g: [add_string_sf, 'complication_name', Translator.trans('decks.smartfilter.filters.complication_name')],
        i: [add_string_sf, 'illustrator', Translator.trans('decks.smartfilter.filters.illustrator')],
        k: [add_string_sf, 'traits', Translator.trans('decks.smartfilter.filters.traits')],
        n: [add_integer_sf, 'expense_value', Translator.trans('decks.smartfilter.filters.expense_value')],
        o: [add_integer_sf, 'cost', Translator.trans('decks.smartfilter.filters.cost')],
        t: [add_string_sf, 'type_code', Translator.trans('decks.smartfilter.filters.type_code')],
        x: [add_string_sf, 'text', Translator.trans('decks.smartfilter.filters.text')],
    };

    /**
     * called when the list is refreshed
     * @memberOf smart_filter
     */
    smart_filter.get_query = function get_query(query)
    {
        return _.extend(query, SmartFilterQuery);
    };

    /**
     * called when the filter input is modified
     * @memberOf smart_filter
     */
    smart_filter.update = function update(value)
    {
        var conditions = filterSyntax(value);
        SmartFilterQuery = {};

        for(var i = 0; i < conditions.length; i++) {
            var condition = conditions[i];
            var type = condition.shift();
            var operator = condition.shift();
            var values = condition;

            var tools = configuration[type];
            if(tools) {
                tools[0].call(this, tools[1], operator, values);
            }
        }
    };

    smart_filter.get_help = function get_help()
    {
        var items = _.map(configuration, function (value, key)
        {
            return '<li><tt>' + key + '</tt> &ndash; ' + value[2] + '</li>';
        });
        return '<ul>' + items.join('') + '</ul><p>' + Translator.trans('decks.smartfilter.example') + '</p>';
    }

    function add_integer_sf(key, operator, values)
    {
        for(var j = 0; j < values.length; j++) {
            values[j] = parseInt(values[j], 10);
        }
        switch(operator) {
            case ":":
                SmartFilterQuery[key] = {
                    '$in': values
                };
                break;
            case "<":
                SmartFilterQuery[key] = {
                    '$lt': values[0]
                };
                break;
            case ">":
                SmartFilterQuery[key] = {
                    '$gt': values[0]
                };
                break;
            case "!":
                SmartFilterQuery[key] = {
                    '$nin': values
                };
                break;
        }
    }
    function add_string_sf(key, operator, values)
    {
        for(var j = 0; j < values.length; j++) {
            values[j] = new RegExp(values[j], 'i');
        }
        switch(operator) {
            case ":":
                SmartFilterQuery[key] = {
                    '$in': values
                };
                break;
            case "!":
                SmartFilterQuery[key] = {
                    '$nin': values
                };
                break;
        }
    }
    function add_boolean_sf(key, operator, values)
    {
        var value = parseInt(values.shift()), target = !!value;
        switch(operator) {
            case ":":
                SmartFilterQuery[key] = target;
                break;
            case "!":
                SmartFilterQuery[key] = {
                    '$ne': target
                };
                break;
        }
    }
    function filterSyntax(query)
    {
        // renvoie une liste de conditions (array)
        // chaque condition est un tableau à n>1 éléments
        // le premier est le type de condition (0 ou 1 caractère)
        // les suivants sont les arguments, en OR

        query = query.replace(/^\s*(.*?)\s*$/, "$1").replace('/\s+/', ' ');

        var list = [];
        var cond = null;
        // l'automate a 3 états :
        // 1:recherche de type
        // 2:recherche d'argument principal
        // 3:recherche d'argument supplémentaire
        // 4:erreur de parsing, on recherche la prochaine condition
        // s'il tombe sur un argument alors qu'il est en recherche de type, alors le
        // type est vide
        var etat = 1;
        while(query != "") {
            if(etat == 1) {
                if(cond !== null && etat !== 4 && cond.length > 2) {
                    list.push(cond);
                }
                // on commence par rechercher un type de condition
                if(query.match(/^(\w)([:<>!])(.*)/)) { // jeton "condition:"
                    cond = [RegExp.$1.toLowerCase(), RegExp.$2];
                    query = RegExp.$3;
                } else {
                    cond = ["", ":"];
                }
                etat = 2;
            } else {
                if(query.match(/^"([^"]*)"(.*)/) // jeton "texte libre entre guillements"
                        || query.match(/^([^\s]+)(.*)/) // jeton "texte autorisé sans guillements"
                        ) {
                    if((etat === 2 && cond.length === 2) || etat === 3) {
                        cond.push(RegExp.$1);
                        query = RegExp.$2;
                        etat = 2;
                    } else {
                        // erreur
                        query = RegExp.$2;
                        etat = 4;
                    }
                } else if(query.match(/^\|(.*)/)) { // jeton "|"
                    if((cond[1] === ':' || cond[1] === '!')
                            && ((etat === 2 && cond.length > 2) || etat === 3)) {
                        query = RegExp.$1;
                        etat = 3;
                    } else {
                        // erreur
                        query = RegExp.$1;
                        etat = 4;
                    }
                } else if(query.match(/^ (.*)/)) { // jeton " "
                    query = RegExp.$1;
                    etat = 1;
                } else {
                    // erreur
                    query = query.substr(1);
                    etat = 4;
                }
            }
        }
        if(cond !== null && etat !== 4 && cond.length > 2) {
            list.push(cond);
        }
        return list;
    }

    $(function ()
    {
        $('.smart-filter-help').tooltip({
            container: 'body',
            delay: 1000,
            html: true,
            placement: 'bottom',
            title: smart_filter.get_help(),
            trigger: 'hover'
        });
    })

})(app.smart_filter = {}, jQuery);

/* global _, app, Translator */

(function app_deck(deck, $)
{

    var date_creation,
            date_update,
            description_md,
            id,
            name,
            tags,
            faction_code,
            faction_name,
            unsaved,
            user_id,
            problem_labels = _.reduce(
                    ['too_few_cards', 'too_many_copies', 'invalid_cards', 'too_many_adventure_cards','too_few_adventure_cards','too_many_captains_cards','too_few_captains_cards'],
                    function (problems, key)
                    {
                        problems[key] = Translator.trans('decks.problems.' + key);
                        return problems;
                    },
                    {}),
            header_tpl = _.template('<h5><span class="icon <%= code %>"></span> <%= name %> (<%= quantity %>)</h5>'),
            card_line_tpl = _.template('<span class="icon <%= card.type_code %> fg-<%= card.faction_code %>"></span> <a href="<%= card.url %>" class="card card-tip" data-toggle="modal" data-remote="false" data-target="#cardModal" data-code="<%= card.code %>"><%= card.label %></a>'),
            layouts = {},
            layout_data = {};

    /*
     * Templates for the different deck layouts, see deck.get_layout_data
     */
    layouts[1] = _.template('<div class="deck-content"><%= meta %><%= conns %><%= crew %><%= events %><%= gear %><%= heroics %><%= upgrades %></div>');
    layouts[2] = _.template('<div class="deck-content"><div class="row"><div class="col-sm-6 col-print-6"><%= meta %></div><div class="col-sm-6 col-print-6"><%= advs %></div></div><div class="row"><div class="col-sm-6 col-print-6"><%= conns %><%= crews %><%= events %></div><div class="col-sm-6 col-print-6"><%= gears %><%= heroics %><%= upgrades %></div></div></div>');
    layouts[3] = _.template('<div class="deck-content"><div class="row"><div class="col-sm-4"><%= meta %><%= advs %></div><div class="col-sm-4"><%= conns %><%= crews %><%= events %></div><div class="col-sm-4"><%= gears %><%= heroics %><%= upgrades %></div></div></div>');

    /**
     * @memberOf deck
     * @param {object} data 
     */
    deck.init = function init(data)
    {
        date_creation = data.date_creation;
        date_update = data.date_update;
        description_md = data.description_md;
        id = data.id;
        name = data.name;
        tags = data.tags;
        faction_code = data.faction_code;
        faction_name = data.faction_name;
        unsaved = data.unsaved;
        user_id = data.user_id;

        if(app.data.isLoaded) {
            deck.set_slots(data.slots);
        } else {
            console.log("deck.set_slots put on hold until data.app");
            $(document).on('data.app', function ()
            {
                deck.set_slots(data.slots);
            });
        }
    };

    /**
     * Sets the slots of the deck
     * 
     * @memberOf deck
     * @param {object} slots 
     */
    deck.set_slots = function set_slots(slots)
    {
        app.data.cards.update({}, {
            indeck: 0
        });
        for(var code in slots) {
            if(slots.hasOwnProperty(code)) {
                app.data.cards.updateById(code, {indeck: slots[code]});
            }
        }
    };

    /**
     * @memberOf deck
     * @returns string
     */
    deck.get_id = function get_id()
    {
        return id;
    };

    /**
     * @memberOf deck
     * @returns string
     */
    deck.get_name = function get_name()
    {
        return name;
    };

    /**
     * @memberOf deck
     * @returns string
     */
    deck.get_faction_code = function get_faction_code()
    {
        return faction_code;
    };

    /**
     * @memberOf deck
     * @returns string
     */
    deck.get_description_md = function get_description_md()
    {
        return description_md;
    };

    /**
     * @memberOf deck
     * @param {object} sort 
     * @param {object} query 
     */
    deck.get_cards = function get_cards(sort, query)
    {
        sort = sort || {};
        sort['code'] = 1;

        query = query || {};
        query.indeck = {
            '$gt': 0
        };

        return app.data.cards.find(query, {
            '$orderBy': sort
        });
    };

    /**
     * @memberOf deck
     * @param {object} sort 
     */
    deck.get_draw_deck = function get_draw_deck(sort)
    {
        return deck.get_cards(sort, {
            type_code: {
                '$nin': ['adv', 'ship']
            }
        });
    };

    /**
     * @memberOf deck
     * @param {object} sort
     */
    deck.get_adventure_deck = function get_adventure_deck(sort)
    {
        return deck.get_cards(sort, {
            type_code: 'adv'
        });
    };

    /**
     * @memberOf deck
     * @returns the number of adventure cards
     * @param {object} sort
     */
    deck.get_adventure_deck_size = function get_adventure_deck_size(sort)
    {
        var adventure_deck = deck.get_adventure_deck();
        //console.log(deck.get_nb_cards(adventure_deck));
        return deck.get_nb_cards(adventure_deck);
    };

    /**
     * @memberOf deck
     * @param {object} sort
     */
    deck.get_captain_deck = function get_captain_deck(sort)
    {
        return deck.get_cards(sort, {
            type_code: {
                '$nin': ['adv', 'ship']
            }
        });

    };

    /**
     * @memberOf deck
     * @returns the number captain cards
     * @param {object} sort
     */
    deck.get_captain_deck_size = function get_captain_deck_size(sort)
    {
        var captain_deck = deck.get_captain_deck();
        //console.log(deck.get_nb_cards(captain_deck).toString());
        return deck.get_nb_cards(captain_deck);
    };

    /**
     * @memberOf deck
     *
     *  @param {object} sort
     */
    deck.get_draw_deck_size = function get_draw_deck_size(sort)
    {
        var draw_deck = deck.get_draw_deck();
        return deck.get_nb_cards(draw_deck);
    };

    deck.get_nb_cards = function get_nb_cards(cards)
    {
        if(!cards)
            cards = deck.get_cards();
        var quantities = _.pluck(cards, 'indeck');
        return _.reduce(quantities, function (memo, num)
        {
            return memo + num;
        }, 0);
    };

    /**
     * @memberOf deck
     */
    deck.get_included_packs = function get_included_packs()
    {
        var cards = deck.get_cards();
        var nb_packs = {};
        cards.forEach(function (card)
        {
            nb_packs[card.pack_code] = Math.max(nb_packs[card.pack_code] || 0, card.indeck / card.quantity);
        });
        var pack_codes = _.uniq(_.pluck(cards, 'pack_code'));
        var packs = app.data.packs.find({
            'code': {
                '$in': pack_codes
            }
        }, {
            '$orderBy': {
                'available': 1
            }
        });
        packs.forEach(function (pack)
        {
            pack.quantity = nb_packs[pack.code] || 0;
        });
        return packs;
    };

    /**
     * @memberOf deck
     * @param {object} container 
     * @param {object} options 
     */
    deck.display = function display(container, options)
    {

        options = _.extend({sort: 'type', cols: 2}, options);

        var layout_data = deck.get_layout_data(options);
        var deck_content = layouts[options.cols](layout_data);

        $(container)
                .removeClass('deck-loading')
                .empty();

        $(container).append(deck_content);
    };

    deck.get_layout_data = function get_layout_data(options)
    {

        var data = {
            images: '',
            meta: '',
            advs: '',
            conns: '',
            crews: '',
            events: '',
            gears: '',
            heroics: '',
            upgrades: '',
        };

        var problem = deck.get_problem();
        
        deck.update_layout_section(data, 'images', $('<div style="margin-bottom:10px"><img src="/bundles/app/images/factions/' + deck.get_faction_code() + '.png" class="img-responsive">'));
        /* adv.forEach(function (adv) {
            deck.update_layout_section(data, 'images', $('<div><img src="' + adv.imagesrc + '" class="img-responsive">'));
        }); */

        /*deck.update_layout_section(data, 'meta', $('<img src="/bundles/app/images/broadswordpto.png" class="img-responsive>'));*/
        deck.update_layout_section(data, 'meta', $('<img src="/bundles/app/images/cards/' + deck.get_faction_code() + '.png" class="img-responsive">'));
        /*adv.forEach(function (adv) {
            var adv_line = $('<h5>').append($(card_line_tpl({card: adv})));
            adv_line.find('.icon').remove();
            deck.update_layout_section(data, 'meta', adva_line);
        });*/
        var drawDeckSection = $('<div><h4 style="font-weight:bold">' + faction_name + '</h4>' + Translator.transChoice('decks.edit.meta.adventuredeck', deck.get_adventure_deck_size(), {count: deck.get_adventure_deck_size()}) + '</div>');
        drawDeckSection.addClass(problem && problem.indexOf('cards') !== -1 ? 'text-danger' : '');
        deck.update_layout_section(data, 'meta', drawDeckSection);
        var plotDeckSection = $('<div>' + Translator.transChoice('decks.edit.meta.captaindeck', deck.get_captain_deck_size(), {count: deck.get_captain_deck_size()}) + '</div>');
        plotDeckSection.addClass(problem && problem.indexOf('cards') !== -1 ? 'text-danger' : '');
        deck.update_layout_section(data, 'meta', plotDeckSection);
        //deck.update_layout_section(data, 'meta', $('<div>Packs: ' + _.map(deck.get_included_packs(), function (pack) { return pack.name+(pack.quantity > 1 ? ' ('+pack.quantity+')' : ''); }).join(', ') + '</div>'));
        var packs = _.map(deck.get_included_packs(), function (pack)
        {
            return pack.name + (pack.quantity > 1 ? ' (' + pack.quantity + ')' : '');
        }).join(', ');
        deck.update_layout_section(data, 'meta', $('<div>' + Translator.trans('decks.edit.meta.packs', {"packs": packs}) + '</div>'));
        if(problem) {
            deck.update_layout_section(data, 'meta', $('<div class="text-danger small"><span class="fa fa-exclamation-triangle"></span> ' + problem_labels[problem] + '</div>'));
        }

        deck.update_layout_section(data, 'advs', deck.get_layout_data_one_section('type_code', 'adv', 'type_name'));
        //deck.update_layout_section(data, 'advs', deck.get_layout_data_one_section("type_code', 'adv', 'type_name'"));
        deck.update_layout_section(data, 'conns', deck.get_layout_data_one_section('type_code', 'conn', 'type_name'));
        deck.update_layout_section(data, 'crews', deck.get_layout_data_one_section('type_code', 'crew', 'type_name'));
        deck.update_layout_section(data, 'events', deck.get_layout_data_one_section('type_code', 'event', 'type_name'));
        deck.update_layout_section(data, 'gears', deck.get_layout_data_one_section('type_code', 'gear', 'type_name'));
        deck.update_layout_section(data, 'heroics', deck.get_layout_data_one_section('type_code', 'heroic', 'type_name'));
        deck.update_layout_section(data, 'upgrades', deck.get_layout_data_one_section('type_code', 'upgrade', 'type_name'));

        return data;
    };

    deck.update_layout_section = function update_layout_section(data, section, element)
    {
        data[section] = data[section] + element[0].outerHTML;
    };

    deck.get_layout_data_one_section = function get_layout_data_one_section(sortKey, sortValue, displayLabel)
    {
        var section = $('<div>');
        var query = {};
        query[sortKey] = sortValue;
        var cards = deck.get_cards({name: 1}, query);
        if(cards.length) {
            $(header_tpl({code: sortValue, name: cards[0][displayLabel], quantity: deck.get_nb_cards(cards)})).appendTo(section);
            cards.forEach(function (card)
            {
                var $div = $('<div>').addClass(deck.can_include_card(card) ? '' : 'invalid-card');
                $div.append($(card_line_tpl({card: card})));
                $div.prepend(card.indeck + 'x ');
                $div.appendTo(section);
            });
        }
        return section;
    };

    /**
     * @memberOf deck
     * @return boolean true if at least one other card quantity was updated
     */
    deck.set_card_copies = function set_card_copies(card_code, nb_copies)
    {
        var card = app.data.cards.findById(card_code);
        if(!card)
            return false;

        var updated_other_card = false;
        if(nb_copies > 0) {
            // card-specific rules
            switch(card.type_code) {

            }
        }
        app.data.cards.updateById(card_code, {
            indeck: nb_copies
        });
        app.deck_history && app.deck_history.notify_change();

        return updated_other_card;
    };

    /**
     * @memberOf deck
     */
    deck.get_content = function get_content()
    {
        var cards = deck.get_cards();
        var content = {};
        cards.forEach(function (card)
        {
            content[card.code] = card.indeck;
        });
        return content;
    };

    /**
     * @memberOf deck
     */
    deck.get_json = function get_json()
    {
        return JSON.stringify(deck.get_content());
    };

    /**
     * @memberOf deck
     */
    deck.get_export = function get_export(format)
    {

    };

    /**
     * @memberOf deck
     */
    deck.get_copies_and_deck_limit = function get_copies_and_deck_limit()
    {
        var copies_and_deck_limit = {};
        deck.get_draw_deck().forEach(function (card)
        {
            var value = copies_and_deck_limit[card.name];
            if(!value) {
                copies_and_deck_limit[card.name] = {
                    nb_copies: card.indeck,
                    deck_limit: card.deck_limit
                };
            } else {
                value.nb_copies += card.indeck;
                value.deck_limit = Math.min(card.deck_limit, value.deck_limit);
            }
        })
        return copies_and_deck_limit;
    };

    /**
     * @memberOf deck
     */
    deck.get_problem = function get_problem()
    {
        var expectedMinCardCount = 60;
        var expectedCaptainCount = 60;
        var expectedAdventureCount = 20;

        // expect at least 20 adventure cards
        if(deck.get_adventure_deck_size() > expectedAdventureCount) {
            return 'too_many_adventure_cards';
        }
        else if(deck.get_adventure_deck_size() < expectedAdventureCount) {
            return 'too_few_adventure_cards';
        }

        //expect at least 60 captain cards
        if(deck.get_captain_deck_size() > expectedCaptainCount) {
            return 'too_many_captain_cards';
        }
        if(deck.get_captain_deck_size() < expectedCaptainCount) {
            return 'too_few_captain_cards';
        }

        // at least 60 others cards
        if(deck.get_draw_deck_size() < expectedMinCardCount) {
            return 'too_few_cards';
        }

        // too many copies of one card
        if(!_.isUndefined(_.findKey(deck.get_copies_and_deck_limit(), function (value)
        {
            return value.nb_copies > value.deck_limit;
        }))) {
            return 'too_many_copies';
        }

    };



    /**
     * returns true if the deck can include the card as parameter
     * @memberOf deck
     */
    deck.can_include_card = function can_include_card(card)
    {
        // neutral card => yes
        if(card.faction_code === 'neutral')
            return true;

        // in-house card => yes
        if(card.faction_code === faction_code)
            return true;


        // if none above => no
        return false;
    };

})(app.deck = {}, jQuery);

(function app_diff(diff, $)
{

// takes an array of strings and returns an object where each string of the array
// is a key of the object and the value is the number of occurences of the string in the array
    function array_count(list)
    {
        var obj = {};
        var list = list.sort();
        for(var i = 0; i < list.length; ) {
            for(var j = i + 1; j < list.length; j++) {
                if(list[i] !== list[j])
                    break;
            }
            obj[list[i]] = (j - i);
            i = j;
        }
        return obj;
    }

    /**
     * contents is an array of content
     * content is a hash of pairs code-qty
     * @memberOf diff
     */
    diff.compute_simple = function compute_simple(contents)
    {

        var ensembles = [];
        for(var decknum = 0; decknum < contents.length; decknum++) {
            var cards = [];
            $.each(contents[decknum], function (code, qty)
            {
                for(var copynum = 0; copynum < qty; copynum++) {
                    cards.push(code);
                }
            });
            ensembles.push(cards);
        }

        var conjunction = [];
        for(var i = 0; i < ensembles[0].length; i++) {
            var code = ensembles[0][i];
            var indexes = [i];
            for(var j = 1; j < ensembles.length; j++) {
                var index = ensembles[j].indexOf(code);
                if(index > -1)
                    indexes.push(index);
                else
                    break;
            }
            if(indexes.length === ensembles.length) {
                conjunction.push(code);
                for(var j = 0; j < indexes.length; j++) {
                    ensembles[j].splice(indexes[j], 1);
                }
                i--;
            }
        }

        var listings = [];
        for(var i = 0; i < ensembles.length; i++) {
            listings[i] = array_count(ensembles[i]);
        }
        var intersect = array_count(conjunction);

        return [listings, intersect];
    };

})(app.diff = {}, jQuery);

(function app_deck_history(deck_history, $)
{

    var tbody,
            clock,
            snapshots_init = [],
            snapshots = [],
            progressbar,
            timer,
            ajax_in_process = false,
            period = 60,
            changed_since_last_autosave = false;


    /**
     * @memberOf deck_history
     */
    deck_history.all_changes = function all_changes() {
        //console.log("ch ch changes", app.deck.get_content());
        if (snapshots.length <= 0) {
            //console.log("boo");
            return;
        }

        // compute diff between last snapshot and current deck
        var last_snapshot = deck_history.base.content;
        var current_deck = app.deck.get_content();

        var result = app.diff.compute_simple([current_deck, last_snapshot]);
        if (!result) return;

        var diff = result[0];
        //console.log("DIFFF ", diff);


        var cards_removed = [];
        var cards_added = [];
        _.each(diff[1], function (qty, code) {
            var card = app.data.cards.findById(code);
            if (!card) return;
            var card_change = {
                "qty": qty,
                "code": code,
                "card": card
            };
            cards_removed.push(card_change);
        });

        _.each(diff[0], function (qty, code) {
            var card = app.data.cards.findById(code);
            if (!card) return;
            var card_change = {
                "qty": qty,
                "code": code,
                "card": card
            };
            cards_added.push(card_change);
        });

        // first check for same named cards
        _.each(cards_added, function (addition) {
            _.each(cards_removed, function (removal) {
                if (addition.qty > 0 && removal.qty > 0 && addition.card.xp >= 0 && addition.card.name == removal.card.name && addition.card.xp > removal.card.xp) {
                    addition.qty = addition.qty - removal.qty;
                    cost = cost + ((addition.card.xp - removal.card.xp) * removal.qty);
                    removal.qty = Math.abs(addition.qty);
                }
                if (removal.card.xp === 0) {
                    removed_0_cards += removal.qty;
                }
            });
        });

        var add_list = [];
        var remove_list = [];
        // run through the changes and show them
        _.each(diff[0], function (qty, code) {
            var card = app.data.cards.findById(code);
            if (!card) return;
            add_list.push('+' + qty + ' ' + '<a href="' + card.url + '" class="card card-tip fg-' + card.faction_code + '" data-toggle="modal" data-remote="false" data-target="#cardModal" data-code="' + card.code + '">' + card.name + '</a>' + app.format.xp(card.xp) + '</a>');
            //add_list.push('+'+qty+' '+'<a href="'+Routing.generate('cards_zoom',{card_code:code})+'" class="card-tip" data-code="'+code+'">'+card.name+''+(card.xp >= 0 ? ' ('+card.xp+')' : '')+'</a>');
        });
        _.each(diff[1], function (qty, code) {
            var card = app.data.cards.findById(code);
            if (!card) return;
            remove_list.push('&minus;' + qty + ' ' + '<a href="' + card.url + '" class="card card-tip fg-' + card.faction_code + '" data-toggle="modal" data-remote="false" data-target="#cardModal" data-code="' + card.code + '">' + card.name + '</a>' + app.format.xp(card.xp) + '</a>');
            //remove_list.push('&minus;'+qty+' '+'<a href="'+Routing.generate('cards_zoom',{card_code:code})+'" class="card-tip" data-code="'+code+'">'+card.name+'</a>');
        });

    }


    /**
     * @memberOf deck_history
     */
    deck_history.autosave = function autosave()
    {

        // check if deck has been modified since last autosave
        if(!changed_since_last_autosave)
            return;

        // compute diff between last snapshot and current deck
        var last_snapshot = snapshots[snapshots.length - 1].content;
        var current_deck = app.deck.get_content();

        changed_since_last_autosave = false;

        var result = app.diff.compute_simple([current_deck, last_snapshot]);
        if(!result)
            return;

        var diff = result[0];
        var diff_json = JSON.stringify(diff);
        if(diff_json == '[{},{}]')
            return;

        // send diff to autosave
        $('#tab-header-history').html("Autosave...");
        ajax_in_process = true;

        $.ajax(Routing.generate('deck_autosave'), {
            data: {
                diff: diff_json,
                deck_id: app.deck.get_id()
            },
            type: 'POST',
            success: function (data, textStatus, jqXHR)
            {
                deck_history.add_snapshot({datecreation: data, variation: diff, content: current_deck, is_saved: false});
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log('[' + moment().format('YYYY-MM-DD HH:mm:ss') + '] Error on ' + this.url, textStatus, errorThrown);
                changed_since_last_autosave = true;
            },
            complete: function ()
            {
                $('#tab-header-history').html("History");
                ajax_in_process = false;
            }
        });

    }

    /**
     * @memberOf deck_history
     */
    deck_history.autosave_interval = function autosave_interval()
    {
        // if we are in the process of an ajax autosave request, do nothing now
        if(ajax_in_process)
            return;

        // making sure we don't go into negatives
        if(timer < 0)
            timer = period;

        // update progressbar
        $(progressbar).css('width', (timer * 100 / period) + '%').attr('aria-valuenow', timer).find('span').text(timer + ' seconds remaining.');

        // timer action
        if(timer === 0) {
            deck_history.autosave();
        }

        timer--;
    }

    /**
     * @memberOf deck_history
     */
    deck_history.add_snapshot = function add_snapshot(snapshot)
    {

        snapshot.date_creation = snapshot.date_creation ? moment(snapshot.date_creation) : moment();
        snapshots.push(snapshot);

        var list = [];
        if(snapshot.variation) {
            _.each(snapshot.variation[0], function (qty, code)
            {
                var card = app.data.cards.findById(code);
                if(!card)
                    return;
                list.push('+' + qty + ' ' + '<a href="' + Routing.generate('cards_zoom', {card_code: code}) + '" class="card-tip" data-code="' + code + '">' + card.label + '</a>');
            });
            _.each(snapshot.variation[1], function (qty, code)
            {
                var card = app.data.cards.findById(code);
                if(!card)
                    return;
                list.push('&minus;' + qty + ' ' + '<a href="' + Routing.generate('cards_zoom', {card_code: code}) + '" class="card-tip" data-code="' + code + '">' + card.label + '</a>');
            });
        } else {
            list.push(Translator.trans('decks.history.firstversion'));
        }

        tbody.prepend('<tr' + (snapshot.is_saved ? '' : ' class="warning"') + '><td>' + snapshot.date_creation.calendar() + (snapshot.is_saved ? '' : ' (' + Translator.trans('decks.history.unsaved') + ')') + '</td><td>' + (snapshot.version || '') + '</td><td>' + list.join('<br>') + '</td><td><a role="button" href="#" data-index="' + (snapshots.length - 1) + '"">' + Translator.trans('decks.history.revert') + '</a></td></tr>');

        timer = -1; // start autosave timer

    }

    /**
     * @memberOf deck_history
     */
    deck_history.load_snapshot = function load_snapshot(event)
    {

        var index = $(this).data('index');
        var snapshot = snapshots[index];
        if(!snapshot)
            return;

        app.data.cards.find({}).forEach(function (card)
        {
            var indeck = 0;
            if(snapshot.content[card.code]) {
                indeck = snapshot.content[card.code];
            }
            app.data.cards.updateById(card.code, {
                indeck: indeck
            });
        });

        app.ui.on_deck_modified();
        changed_since_last_autosave = true;

        // cancel event
        return false;

    }

    /**
     * @memberOf deck_history
     */
    deck_history.notify_change = function notify_change()
    {
        changed_since_last_autosave = true;
    }

    deck_history.get_unsaved_edits = function get_unsaved_edits()
    {
        return _.filter(snapshots, function (snapshot)
        {
            return snapshot.is_saved === false;
        }).sort(function (a, b)
        {
            return a.date_creation - b.datecreation;
        });
    }

    deck_history.is_changed_since_last_autosave = function is_changed_since_last_autosave()
    {
        return changed_since_last_autosave;
    }

    deck_history.init = function init(data)
    {
        snapshots_init = data;
    }

    /**
     * @memberOf deck_history
     * @param container
     */
    deck_history.setup = function setup_history(container)
    {
        tbody = $(container).find('tbody').on('click', 'a[role=button]', deck_history.load_snapshot);
        progressbar = $(container).find('.progress-bar');

        clock = setInterval(deck_history.autosave_interval, 1000);

        snapshots_init.forEach(function (snapshot)
        {
            deck_history.add_snapshot(snapshot);
        });

    }

})(app.deck_history = {}, jQuery);

(function app_deck_charts(deck_charts, $)
{

    var charts = [],
            faction_colors = {
                targaryen:
                        '#1c1c1c',

                baratheon:
                        '#e3d852',

                stark:
                        '#cfcfcf',

                greyjoy:
                        '#1d7a99',

                lannister:
                        '#c00106',

                tyrell:
                        '#509f16',

                thenightswatch:
                        '#6e6e6e',

                martell:
                        '#e89521',

                neutral:
                        '#a99560',
            },
            type_colors = {
                adv: '#ff3300',
                conn: '#66ccff',
                crew: '#33cc33',
                event: '#990099',
                gear: '#cc0000',
                heroic: '#ffcc00',
                ship: '#000099',
                upgrade: '#cccccc',
            };

    deck_charts.chart_faction = function chart_faction()
    {
        var factions = {};
        var draw_deck = app.deck.get_draw_deck();
        draw_deck.forEach(function (card)
        {
            if(!factions[card.faction_code])
                factions[card.faction_code] = {code: card.faction_code, name: card.faction_name, count: 0};
            factions[card.faction_code].count += card.indeck;
        })

        var data = [];
        _.each(_.values(factions), function (faction)
        {
            data.push({
                name: faction.name,
                label: '<span class="icon icon-' + faction.code + '"></span>',
                color: faction_colors[faction.code],
                y: faction.count
            });
        })

        $("#deck-chart-faction").highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: Translator.trans("decks.charts.faction.title")
            },
            subtitle: {
                text: Translator.trans("decks.charts.faction.subtitle")
            },
            xAxis: {
                categories: _.pluck(data, 'label'),
                labels: {
                    useHTML: true
                },
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                allowDecimals: false,
                tickInterval: 3,
                title: null,
                labels: {
                    overflow: 'justify'
                }
            },
            series: [{
                    type: "column",
                    animation: false,
                    name: Translator.trans("decks.charts.faction.label"),
                    showInLegend: false,
                    data: data
                }],
            plotOptions: {
                column: {
                    borderWidth: 0,
                    groupPadding: 0,
                    shadow: false
                }
            }
        });
    }

    deck_charts.chart_type = function chart_type()
    {
        var types = {};
        var draw_deck = app.deck.get_draw_deck();
        draw_deck.forEach(function (card)
        {
            if(!types[card.type_code])
                types[card.type_code] = {code: card.type_code, name: card.type_name, count: 0};
            types[card.type_code].count += card.indeck;
        })

        var data = [];
        _.each(_.values(types), function (type)
        {
            data.push({
                name: type.name,
                label: '<span class="icon icon-' + type.code + '"></span>',
                color: type_colors[type.code],
                y: type.count
            });
        })

        $("#deck-chart-faction").highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: Translator.trans("decks.charts.type.title")
            },
            subtitle: {
                text: Translator.trans("decks.charts.type.subtitle")
            },
            xAxis: {
                categories: _.pluck(data, 'label'),
                labels: {
                    useHTML: true
                },
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                allowDecimals: false,
                tickInterval: 3,
                title: null,
                labels: {
                    overflow: 'justify'
                }
            },
            series: [{
                type: "column",
                animation: false,
                name: Translator.trans("decks.charts.type.label"),
                showInLegend: false,
                data: data
            }],
            plotOptions: {
                column: {
                    borderWidth: 0,
                    groupPadding: 0,
                    shadow: false
                }
            }
        });
    }

    deck_charts.chart_icon = function chart_icon()
    {

        var data = [{
                name: Translator.trans('challenges.military'),
                label: '<span class="icon icon-military"></span>',
                color: '#c8232a',
                y: 0
            }, {
                name: Translator.trans('challenges.intrigue'),
                label: '<span class="icon icon-intrigue"></span>',
                color: '#13522f',
                y: 0
            }, {
                name: Translator.trans('challenges.power'),
                label: '<span class="icon icon-power"></span>',
                color: '#292e5f',
                y: 0
            }];

        var draw_deck = app.deck.get_draw_deck();
        draw_deck.forEach(function (card)
        {
            if(card.is_military)
                data[0].y += (card.is_unique ? 1 : card.indeck);
            if(card.is_intrigue)
                data[1].y += (card.is_unique ? 1 : card.indeck);
            if(card.is_power)
                data[2].y += (card.is_unique ? 1 : card.indeck);
        })

        $("#deck-chart-icon").highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: Translator.trans("decks.charts.icon.title")
            },
            subtitle: {
                text: Translator.trans("decks.charts.icon.subtitle")
            },
            xAxis: {
                categories: _.pluck(data, 'label'),
                labels: {
                    useHTML: true
                },
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                allowDecimals: false,
                tickInterval: 2,
                title: null,
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                //headerFormat: '<span style="font-size: 10px">{point.key} Icon</span><br/>'
                headerFormat: '<span style="font-size: 10px">' + Translator.trans('decks.charts.icon.tooltip.header', {type: '{point.key}'}) + '</span><br/>'
            },
            series: [{
                    type: "column",
                    animation: false,
                    name: Translator.trans('decks.charts.icon.tooltip.label'),
                    showInLegend: false,
                    data: data
                }],
            plotOptions: {
                column: {
                    borderWidth: 0,
                    groupPadding: 0,
                    shadow: false
                }
            }
        });
    }

    deck_charts.chart_strength = function chart_strength()
    {

        var data = [];

        var draw_deck = app.deck.get_draw_deck();
        draw_deck.forEach(function (card)
        {
            if(typeof card.strength === 'number') {
                data[card.strength] = data[card.strength] || 0;
                data[card.strength] += (card.is_unique ? 1 : card.indeck);
            }
        })
        data = _.flatten(data).map(function (value)
        {
            return value || 0;
        });

        $("#deck-chart-strength").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: Translator.trans("decks.charts.strength.title")
            },
            subtitle: {
                text: Translator.trans("decks.charts.strength.subtitle")
            },
            xAxis: {
                allowDecimals: false,
                tickInterval: 1,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                allowDecimals: false,
                tickInterval: 1,
                title: null,
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size: 10px">' + Translator.trans('decks.charts.strength.tooltip.header', {str: '{point.key}'}) + '</span><br/>'
            },
            series: [{
                    animation: false,
                    name: Translator.trans('decks.charts.strength.tooltip.label'),
                    showInLegend: false,
                    data: data
                }]
        });
    }

    deck_charts.chart_vps = function chart_vps()
    {

        var data = [];

        var draw_deck = app.deck.get_adventure_deck();
        draw_deck.forEach(function (card)
        {
            if(typeof card.victorypoints === 'number') {
                data[card.victorypoints] = data[card.victorypoints] || 0;
                data[card.victorypoints] += (card.is_unique ? 1 : card.indeck);
            }
        })
        data = _.flatten(data).map(function (value)
        {
            return value || 0;
        });

        $("#deck-chart-vps").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: Translator.trans("decks.charts.vps.title")
            },
            subtitle: {
                text: Translator.trans("decks.charts.vps.subtitle")
            },
            xAxis: {
                allowDecimals: false,
                tickInterval: 1,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                allowDecimals: false,
                tickInterval: 1,
                title: null,
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size: 10px">' + Translator.trans('decks.charts.vps.tooltip.header', {str: '{point.key}'}) + '</span><br/>'
            },
            series: [{
                animation: false,
                name: Translator.trans('decks.charts.vps.tooltip.label'),
                showInLegend: false,
                data: data
            }]
        });
    }


    deck_charts.chart_expense = function chart_expense()
    {

        var data = [];

        var draw_deck = app.deck.get_draw_deck();
        draw_deck.forEach(function (card)
        {
            if(typeof card.expense === 'number') {
                data[card.expense] = data[card.expense] || 0;
                data[card.expense] += (card.is_unique ? 1 : card.indeck);
            }
        })
        data = _.flatten(data).map(function (value)
        {
            return value || 0;
        });

        $("#deck-chart-expense").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: Translator.trans("decks.charts.expense.title")
            },
            subtitle: {
                text: Translator.trans("decks.charts.expense.subtitle")
            },
            xAxis: {
                allowDecimals: false,
                tickInterval: 1,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                allowDecimals: false,
                tickInterval: 1,
                title: null,
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size: 10px">' + Translator.trans('decks.charts.expense.tooltip.header', {str: '{point.key}'}) + '</span><br/>'
            },
            series: [{
                animation: false,
                name: Translator.trans('decks.charts.expense.tooltip.label'),
                showInLegend: false,
                data: data
            }]
        });
    }

    deck_charts.chart_cost = function chart_cost()
    {

        var data = [];

        var draw_deck = app.deck.get_draw_deck();
        draw_deck.forEach(function (card)
        {
            if(typeof card.cost === 'number') {
                data[card.cost] = data[card.cost] || 0;
                data[card.cost] += card.indeck;
            }
        })
        data = _.flatten(data).map(function (value)
        {
            return value || 0;
        });

        $("#deck-chart-cost").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: Translator.trans("decks.charts.cost.title")
            },
            subtitle: {
                text: Translator.trans("decks.charts.cost.subtitle")
            },
            xAxis: {
                allowDecimals: false,
                tickInterval: 1,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                allowDecimals: false,
                tickInterval: 1,
                title: null,
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size: 10px">' + Translator.trans('decks.charts.cost.tooltip.header', {cost: '{point.key}'}) + '</span><br/>'
            },
            series: [{
                    animation: false,
                    name: Translator.trans('decks.charts.cost.tooltip.label'),
                    showInLegend: false,
                    data: data
                }]
        });
    }

    deck_charts.setup = function setup(options)
    {
        deck_charts.chart_faction();
        deck_charts.chart_type();
        deck_charts.chart_icon();
        deck_charts.chart_vps();
        //deck_charts.chart_strength();
        deck_charts.chart_cost();
        deck_charts.chart_expense();
    }

    $(document).on('shown.bs.tab', 'a[data-toggle=tab]', function (e)
    {
        deck_charts.setup();
    });

})(app.deck_charts = {}, jQuery);

/* global Translator, app */

(function ui_deck(ui, $)
{

    var dom_loaded = new $.Deferred(),
            data_loaded = new $.Deferred();

    /**
     * called when the DOM is loaded
     * @memberOf ui
     */
    ui.on_dom_loaded = function on_dom_loaded()
    {};

    /**
     * called when the app data is loaded
     * @memberOf ui
     */
    ui.on_data_loaded = function on_data_loaded()
    {};

    /**
     * called when both the DOM and the app data have finished loading
     * @memberOf ui
     */
    ui.on_all_loaded = function on_all_loaded()
    {};

    ui.insert_alert_message = function ui_insert_alert_message(type, message)
    {
        var alert = $('<div class="alert" role="alert"></div>').addClass('alert-' + type).append(message);
        $('#wrapper>div.container').first().prepend(alert);
    };

    $(document).ready(function ()
    {
        $('[data-toggle="tooltip"]').tooltip();
        $('time').each(function (index, element)
        {
            var datetime = moment($(element).attr('datetime'));
            $(element).html(datetime.fromNow());
            $(element).attr('title', datetime.format('LLLL'));
        });
        if(typeof ui.on_dom_loaded === 'function')
            ui.on_dom_loaded();
        dom_loaded.resolve();
    });
    $(document).on('data.app', function ()
    {
        if(typeof ui.on_data_loaded === 'function')
            ui.on_data_loaded();
        data_loaded.resolve();
    });
    $(document).on('start.app', function ()
    {
        if(typeof ui.on_all_loaded === 'function')
            ui.on_all_loaded();
        $('abbr').each(function (index, element)
        {
            var keyword = $(this).data('keyword');
            var title = Translator.trans('keyword.' + keyword + '.title');
            if(title)
                $(element).attr('title', title).tooltip();
        });
    });
    $.when(dom_loaded, data_loaded).done(function ()
    {
        setTimeout(function ()
        {
            $(document).trigger('start.app');
        }, 0);
    });

})(app.ui = {}, jQuery);
