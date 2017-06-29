import $ from 'dom7';
import Support from '../../utils/support';
import Device from '../../utils/device';
import TouchRipple from '../../components/touch-ripple/touch-ripple-class';

function initTouch() {
  const app = this;
  const params = app.params.touch;
  const useRipple = app.theme === 'md' && params.materialRipple;

  if (Device.ios && Device.webView) {
    // Strange hack required for iOS 8 webview to work on inputs
    window.addEventListener('touchstart', () => {});
  }

  let touchStartX;
  let touchStartY;
  let touchStartTime;
  let targetElement;
  let trackClick;
  let activeSelection;
  let scrollParent;
  let lastClickTime;
  let isMoved;
  let tapHoldFired;
  let tapHoldTimeout;

  let activableElement;
  let activeTimeout;

  let needsFastClick;
  let needsFastClickTimeOut;

  let rippleWave;
  let rippleTarget;
  let rippleTimeout;

  function findActivableElement(el) {
    const target = $(el);
    const parents = target.parents(params.activeStateElements);
    let activable;
    if (target.is(params.activeStateElements)) {
      activable = target;
    }
    if (parents.length > 0) {
      activable = activable ? activable.add(parents) : parents;
    }
    return activable || target;
  }

  function isInsideScrollableView(el) {
    const pageContent = el.parents('.page-content, .panel');

    if (pageContent.length === 0) {
      return false;
    }

    // This event handler covers the "tap to stop scrolling".
    if (pageContent.prop('scrollHandlerSet') !== 'yes') {
      pageContent.on('scroll', () => {
        clearTimeout(activeTimeout);
        clearTimeout(rippleTimeout);
      });
      pageContent.prop('scrollHandlerSet', 'yes');
    }

    return true;
  }
  function addActive() {
    if (!activableElement) return;
    activableElement.addClass('active-state');
  }
  function removeActive() {
    if (!activableElement) return;
    activableElement.removeClass('active-state');
    activableElement = null;
  }
  function isFormElement(el) {
    const nodes = ('input select textarea label').split(' ');
    if (el.nodeName && nodes.indexOf(el.nodeName.toLowerCase()) >= 0) return true;
    return false;
  }
  function androidNeedsBlur(el) {
    const noBlur = ('button input textarea select').split(' ');
    if (document.activeElement && el !== document.activeElement && document.activeElement !== document.body) {
      if (noBlur.indexOf(el.nodeName.toLowerCase()) >= 0) {
        return false;
      }
      return true;
    }
    return false;
  }
  function targetNeedsFastClick(el) {
    /*
    if (
      Device.ios
      &&
      (
        Device.osVersion.split('.')[0] > 9
        ||
        (Device.osVersion.split('.')[0] * 1 === 9 && Device.osVersion.split('.')[1] >= 1)
      )
    ) {
      return false;
    }
    */
    const $el = $(el);
    if (el.nodeName.toLowerCase() === 'input' && (el.type === 'file' || el.type === 'range')) return false;
    if (el.nodeName.toLowerCase() === 'select' && Device.android) return false;
    if ($el.hasClass('no-fastclick') || $el.parents('.no-fastclick').length > 0) return false;
    if (params.fastClicksExclude && $el.is(params.fastClicksExclude)) return false;
    return true;
  }
  function targetNeedsFocus(el) {
    if (document.activeElement === el) {
      return false;
    }
    const tag = el.nodeName.toLowerCase();
    const skipInputs = ('button checkbox file image radio submit').split(' ');
    if (el.disabled || el.readOnly) return false;
    if (tag === 'textarea') return true;
    if (tag === 'select') {
      if (Device.android) return false;
      return true;
    }
    if (tag === 'input' && skipInputs.indexOf(el.type) < 0) return true;
    return false;
  }
  function targetNeedsPrevent(el) {
    const $el = $(el);
    let prevent = true;
    if ($el.is('label') || $el.parents('label').length > 0) {
      if (Device.android) {
        prevent = false;
      } else if (Device.ios && $el.is('input')) {
        prevent = true;
      } else prevent = false;
    }
    return prevent;
  }

  // Ripple handlers
  function findRippleElement(el) {
    const rippleElements = params.materialRippleElements;
    const $el = $(el);
    if ($el.is(rippleElements)) {
      if ($el.hasClass('no-ripple')) {
        return false;
      }
      return $el;
    } else if ($el.parents(rippleElements).length > 0) {
      const rippleParent = $el.parents(rippleElements).eq(0);
      if (rippleParent.hasClass('no-ripple')) {
        return false;
      }
      return rippleParent;
    }
    return false;
  }
  function createRipple($el, x, y) {
    if (!$el) return;
    rippleWave = new TouchRipple($el, x, y);
  }

  function removeRipple() {
    if (!rippleWave) return;
    rippleWave.remove();
    rippleWave = undefined;
    rippleTarget = undefined;
  }
  function rippleTouchStart(el) {
    rippleTarget = findRippleElement(el);
    if (!rippleTarget || rippleTarget.length === 0) {
      rippleTarget = undefined;
      return;
    }
    if (!isInsideScrollableView(rippleTarget)) {
      createRipple(rippleTarget, touchStartX, touchStartY);
    } else {
      rippleTimeout = setTimeout(() => {
        createRipple(rippleTarget, touchStartX, touchStartY);
      }, 80);
    }
  }
  function rippleTouchMove() {
    clearTimeout(rippleTimeout);
    removeRipple();
  }
  function rippleTouchEnd() {
    if (rippleWave) {
      removeRipple();
    } else if (rippleTarget && !isMoved) {
      clearTimeout(rippleTimeout);
      createRipple(rippleTarget, touchStartX, touchStartY);
      setTimeout(removeRipple, 0);
    } else {
      removeRipple();
    }
  }

  // Mouse Handlers
  function handleMouseDown(e) {
    findActivableElement(e.target).addClass('active-state');
    if ('which' in e && e.which === 3) {
      setTimeout(() => {
        $('.active-state').removeClass('active-state');
      }, 0);
    }
    if (useRipple) {
      touchStartX = e.pageX;
      touchStartY = e.pageY;
      rippleTouchStart(e.target, e.pageX, e.pageY);
    }
  }
  function handleMouseMove() {
    $('.active-state').removeClass('active-state');
    if (useRipple) {
      rippleTouchMove();
    }
  }
  function handleMouseUp() {
    $('.active-state').removeClass('active-state');
    if (useRipple) {
      rippleTouchEnd();
    }
  }

  // Send Click
  function sendClick(e) {
    const touch = e.changedTouches[0];
    const evt = document.createEvent('MouseEvents');
    let eventType = 'click';
    if (Device.android && targetElement.nodeName.toLowerCase() === 'select') {
      eventType = 'mousedown';
    }
    evt.initMouseEvent(eventType, true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
    evt.forwardedTouchEvent = true;
    targetElement.dispatchEvent(evt);
  }

  // Touch Handlers
  function handleTouchStart(e) {
    isMoved = false;
    tapHoldFired = false;
    if (e.targetTouches.length > 1) {
      if (activableElement) removeActive();
      return true;
    }
    if (e.touches.length > 1 && activableElement) {
      removeActive();
    }
    if (params.tapHold) {
      if (tapHoldTimeout) clearTimeout(tapHoldTimeout);
      tapHoldTimeout = setTimeout(() => {
        if (e && e.touches && e.touches.length > 1) return;
        tapHoldFired = true;
        e.preventDefault();
        $(e.target).trigger('taphold');
      }, params.tapHoldDelay);
    }
    if (needsFastClickTimeOut) clearTimeout(needsFastClickTimeOut);
    needsFastClick = targetNeedsFastClick(e.target);

    if (!needsFastClick) {
      trackClick = false;
      return true;
    }
    if (Device.ios || (Device.android && 'getSelection' in window)) {
      const selection = window.getSelection();
      if (
        selection.rangeCount &&
        selection.focusNode !== document.body &&
        (!selection.isCollapsed || document.activeElement === selection.focusNode)
      ) {
        activeSelection = true;
        return true;
      }

      activeSelection = false;
    }
    if (Device.android) {
      if (androidNeedsBlur(e.target)) {
        document.activeElement.blur();
      }
    }

    trackClick = true;
    targetElement = e.target;
    touchStartTime = (new Date()).getTime();
    touchStartX = e.targetTouches[0].pageX;
    touchStartY = e.targetTouches[0].pageY;

      // Detect scroll parent
    if (Device.ios) {
      scrollParent = undefined;
      $(targetElement).parents().each(() => {
        const parent = this;
        if (parent.scrollHeight > parent.offsetHeight && !scrollParent) {
          scrollParent = parent;
          scrollParent.f7ScrollTop = scrollParent.scrollTop;
        }
      });
    }
    if ((e.timeStamp - lastClickTime) < params.fastClicksDelayBetweenClicks) {
      e.preventDefault();
    }

    if (params.activeState) {
      activableElement = findActivableElement(targetElement);
      // If it's inside a scrollable view, we don't trigger active-state yet,
      // because it can be a scroll instead. Based on the link:
      // http://labnote.beedesk.com/click-scroll-and-pseudo-active-on-mobile-webk
      if (!isInsideScrollableView(activableElement)) {
        addActive();
      } else {
        activeTimeout = setTimeout(addActive, 80);
      }
    }
    if (useRipple) {
      rippleTouchStart(targetElement, touchStartX, touchStartY);
    }
    return true;
  }
  function handleTouchMove(e) {
    if (!trackClick) return;
    const distance = params.fastClicksDistanceThreshold;
    if (distance) {
      const pageX = e.targetTouches[0].pageX;
      const pageY = e.targetTouches[0].pageY;
      if (Math.abs(pageX - touchStartX) > distance || Math.abs(pageY - touchStartY) > distance) {
        isMoved = true;
      }
    } else {
      isMoved = true;
    }
    if (isMoved) {
      trackClick = false;
      targetElement = null;
      isMoved = true;
      if (params.tapHold) {
        clearTimeout(tapHoldTimeout);
      }
      if (params.activeState) {
        clearTimeout(activeTimeout);
        removeActive();
      }
      if (useRipple) {
        rippleTouchMove();
      }
    }
  }
  function handleTouchEnd(e) {
    clearTimeout(activeTimeout);
    clearTimeout(tapHoldTimeout);

    if (!trackClick) {
      if (!activeSelection && needsFastClick) {
        if (!(Device.android && !e.cancelable) && e.cancelable) {
          e.preventDefault();
        }
      }
      return true;
    }

    if (document.activeElement === e.target) {
      if (params.activeState) removeActive();
      if (useRipple) {
        rippleTouchEnd();
      }
      return true;
    }

    if (!activeSelection) {
      e.preventDefault();
    }

    if ((e.timeStamp - lastClickTime) < params.fastClicksDelayBetweenClicks) {
      setTimeout(removeActive, 0);
      return true;
    }

    lastClickTime = e.timeStamp;

    trackClick = false;

    if (Device.ios && scrollParent) {
      if (scrollParent.scrollTop !== scrollParent.f7ScrollTop) {
        return false;
      }
    }

    // Add active-state here because, in a very fast tap, the timeout didn't
    // have the chance to execute. Removing active-state in a timeout gives
    // the chance to the animation execute.
    if (params.activeState) {
      addActive();
      setTimeout(removeActive, 0);
    }
    // Remove Ripple
    if (useRipple) {
      rippleTouchEnd();
    }

      // Trigger focus when required
    if (targetNeedsFocus(targetElement)) {
      if (Device.ios && Device.webView) {
        if ((e.timeStamp - touchStartTime) > 159) {
          targetElement = null;
          return false;
        }
        targetElement.focus();
        return false;
      }

      targetElement.focus();
    }

      // Blur active elements
    if (document.activeElement && targetElement !== document.activeElement && document.activeElement !== document.body && targetElement.nodeName.toLowerCase() !== 'label') {
      document.activeElement.blur();
    }

      // Send click
    e.preventDefault();
    sendClick(e);
    return false;
  }
  function handleTouchCancel() {
    trackClick = false;
    targetElement = null;

      // Remove Active State
    clearTimeout(activeTimeout);
    clearTimeout(tapHoldTimeout);
    if (params.activeState) {
      removeActive();
    }

      // Remove Ripple
    if (useRipple) {
      rippleTouchEnd();
    }
  }

  function handleClick(e) {
    let allowClick = false;

    if (trackClick) {
      targetElement = null;
      trackClick = false;
      return true;
    }
    if ((e.target.type === 'submit' && e.detail === 0) || e.target.type === 'file') {
      return true;
    }
    if (!targetElement) {
      if (!isFormElement(e.target)) {
        allowClick = true;
      }
    }
    if (!needsFastClick) {
      allowClick = true;
    }
    if (document.activeElement === targetElement) {
      allowClick = true;
    }
    if (e.forwardedTouchEvent) {
      allowClick = true;
    }
    if (!e.cancelable) {
      allowClick = true;
    }
    if (params.tapHold && params.tapHoldPreventClicks && tapHoldFired) {
      allowClick = false;
    }
    if (!allowClick) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      if (targetElement) {
        if (targetNeedsPrevent(targetElement) || isMoved) {
          e.preventDefault();
        }
      } else {
        e.preventDefault();
      }
      targetElement = null;
    }
    needsFastClickTimeOut = setTimeout(() => {
      needsFastClick = false;
    }, (Device.ios || Device.androidChrome ? 100 : 400));

    if (params.tapHold) {
      tapHoldTimeout = setTimeout(() => {
        tapHoldFired = false;
      }, (Device.ios || Device.androidChrome ? 100 : 400));
    }

    return allowClick;
  }

  function emitAppTouchEvent(name, context, e) {
    app.emit({
      events: name,
      data: [e],
      context,
    });
  }
  function appClick(e) {
    emitAppTouchEvent('click', this, e);
  }
  function appTouchStartActive(e) {
    emitAppTouchEvent('touchstart', this, e);
  }
  function appTouchMoveActive(e) {
    emitAppTouchEvent('touchmove', this, e);
  }
  function appTouchEndActive(e) {
    emitAppTouchEvent('touchend', this, e);
  }
  function appTouchStartPassive(e) {
    emitAppTouchEvent('touchstart:passive', this, e);
  }
  function appTouchMovePassive(e) {
    emitAppTouchEvent('touchmove:passive', this, e);
  }
  function appTouchEndPassive(e) {
    emitAppTouchEvent('touchend:passive', this, e);
  }

  const passiveListener = Support.passiveListener ? { passive: true } : false;
  const activeListener = Support.passiveListener ? { passive: false } : false;

  document.addEventListener('click', appClick, true);

  if (Support.passiveListener) {
    document.addEventListener(app.touchEvents.start, appTouchStartActive, activeListener);
    document.addEventListener(app.touchEvents.move, appTouchMoveActive, activeListener);
    document.addEventListener(app.touchEvents.end, appTouchEndActive, activeListener);

    document.addEventListener(app.touchEvents.start, appTouchStartPassive, passiveListener);
    document.addEventListener(app.touchEvents.move, appTouchMovePassive, passiveListener);
    document.addEventListener(app.touchEvents.end, appTouchEndPassive, passiveListener);
  } else {
    document.addEventListener(app.touchEvents.start, function handler(e) {
      appTouchStartActive.call(this, e);
      appTouchStartPassive.call(this, e);
    }, false);
    document.addEventListener(app.touchEvents.move, function handler(e) {
      appTouchMoveActive.call(this, e);
      appTouchMovePassive.call(this, e);
    }, false);
    document.addEventListener(app.touchEvents.end, function handler(e) {
      appTouchEndActive.call(this, e);
      appTouchEndPassive.call(this, e);
    }, false);
  }

  if (Support.touch) {
    app.on('click', handleClick);
    app.on('touchstart', handleTouchStart);
    app.on('touchmove', handleTouchMove);
    app.on('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchCancel, { passive: true });
  } else if (params.activeState) {
    app.on('touchstart', handleMouseDown);
    app.on('touchmove', handleMouseMove);
    app.on('touchend', handleMouseUp);
  }

  if (useRipple) {
    document.addEventListener('contextmenu', () => {
      if (activableElement) removeActive();
      rippleTouchEnd();
    });
  }
}

export default {
  name: 'touch',
  params: {
    touch: {
      // Fast clicks
      fastClicks: true,
      fastClicksDistanceThreshold: 10,
      fastClicksDelayBetweenClicks: 50,
      fastClicksExclude: '', // CSS selector
      // Tap Hold
      tapHold: false,
      tapHoldDelay: 750,
      tapHoldPreventClicks: true,
      // Active State
      activeState: true,
      activeStateElements: 'a, button, label, span, .actions-button',
      materialRipple: true,
      materialRippleElements: '.ripple, .link, .item-link, .links-list a, .button, button, .input-clear-button, .dialog-button, .tab-link, .item-radio, .item-checkbox, .actions-button, a.searchbar-clear, .fab a, .checkbox, .radio, .data-table .sortable-cell',
    },
  },
  static: {
    TouchRipple,
  },
  instance: {
    touchEvents: {
      start: Support.touch ? 'touchstart' : 'mousedown',
      move: Support.touch ? 'touchmove' : 'mousemove',
      end: Support.touch ? 'touchend' : 'mouseup',
    },
  },
  on: {
    init: initTouch,
  },
};
