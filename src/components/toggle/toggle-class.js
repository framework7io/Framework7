import $ from 'dom7';
import Utils from '../../utils/utils';
import Framework7Class from '../../utils/class';
import Support from '../../utils/support';

class Toggle extends Framework7Class {
  constructor(app, params = {}) {
    super(params, [app]);
    const toggle = this;

    const defaults = {};

    // Extend defaults with modules params
    toggle.useInstanceModulesParams(defaults);

    toggle.params = Utils.extend(defaults, params);

    const el = toggle.params.el;
    if (!el) return toggle;

    const $el = $(el);
    if ($el.length === 0) return toggle;

    const dataset = $el.dataset();

    const $inputEl = $el.children('input[type="checkbox"]');

    Utils.extend(toggle, {
      $el,
      el: $el[0],
      dataset,
      $inputEl,
      inputEl: $inputEl[0],
      disabled: $el.hasClass('disabled') || $inputEl.hasClass('disabled') || $inputEl.attr('disabled') || $inputEl[0].disabled,
    });

    Object.defineProperty(toggle, 'checked', {
      enumerable: true,
      configurable: true,
      set(checked) {
        if (!toggle || typeof toggle.$inputEl === 'undefined') return;
        if (toggle.checked === checked) return;
        $inputEl[0].checked = checked;
        toggle.$inputEl.trigger('change');
      },
      get() {
        return $inputEl[0].checked;
      },
    });

    $el[0].f7Toggle = toggle;

    let isTouched;
    const touchesStart = {};
    let isScrolling;
    let touchesDiff;
    let toggleWidth;
    let touchStartTime;
    let touchStartChecked;
    function handleTouchStart(e) {
      if (isTouched || toggle.disabled) return;
      touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
      touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
      touchesDiff = 0;

      isTouched = true;
      isScrolling = undefined;
      touchStartTime = Utils.now();
      touchStartChecked = toggle.checked;

      toggleWidth = $el[0].offsetWidth;
      Utils.nextTick(() => {
        if (isTouched) {
          $el.addClass('toggle-active-state');
        }
      });
    }
    function handleTouchMove(e) {
      if (!isTouched || toggle.disabled) return;
      const pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
      const pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

      if (typeof isScrolling === 'undefined') {
        isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
      }
      if (isScrolling) {
        isTouched = false;
        return;
      }
      e.preventDefault();

      touchesDiff = pageX - touchesStart.x;

      let changed;
      if (touchesDiff < 0 && Math.abs(touchesDiff) > toggleWidth / 3 && touchStartChecked) {
        changed = true;
      }
      if (touchesDiff > 0 && Math.abs(touchesDiff) > toggleWidth / 3 && !touchStartChecked) {
        changed = true;
      }
      if (changed) {
        touchesStart.x = pageX;
        toggle.checked = !touchStartChecked;
        touchStartChecked = !touchStartChecked;
      }
    }
    function handleTouchEnd() {
      if (!isTouched || toggle.disabled) {
        if (isScrolling) $el.removeClass('toggle-active-state');
        isTouched = false;
        return;
      }
      isTouched = false;

      $el.removeClass('toggle-active-state');

      let changed;
      if ((Utils.now() - touchStartTime) < 300) {
        if (touchesDiff < 0 && touchStartChecked) {
          changed = true;
        }
        if (touchesDiff > 0 && !touchStartChecked) {
          changed = true;
        }
        if (changed) {
          toggle.checked = !touchStartChecked;
        }
      }
    }
    function handleInputChange() {
      toggle.emit({
        events: 'change',
        parents: [],
      });
      toggle.emit('toggleChange toggle:change', toggle);
    }
    toggle.attachEvents = function attachEvents() {
      if (!Support.touch) return;
      const passive = Support.passiveListener ? { passive: true } : false;
      $el.on(app.touchEvents.start, handleTouchStart, passive);
      app.on('touchmove', handleTouchMove);
      app.on('touchend:passive', handleTouchEnd);
      toggle.$inputEl.on('change', handleInputChange);
    };
    toggle.detachEvents = function detachEvents() {
      if (!Support.touch) return;
      const passive = Support.passiveListener ? { passive: true } : false;
      $el.off(app.touchEvents.start, handleTouchStart, passive);
      app.off('touchmove', handleTouchMove);
      app.off('touchend:passive', handleTouchEnd);
      toggle.$inputEl.off('change', handleInputChange);
    };


    // Install Modules
    toggle.useInstanceModules();

    // Init
    toggle.init();
  }
  toggle() {
    const toggle = this;
    toggle.checked = !toggle.checked;
  }
  init() {
    const toggle = this;
    toggle.attachEvents();
  }
  destroy() {
    let toggle = this;
    delete toggle.$el[0].f7Toggle;
    toggle.detachEvents();
    Utils.deleteProps(toggle);
    toggle = null;
  }
}

export default Toggle;
