function noop() {
}
const identity = (x) => x;
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
function append(target, node) {
  target.appendChild(node);
}
function get_root_for_style(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && root.host) {
    return root;
  }
  return node.ownerDocument;
}
function append_empty_stylesheet(node) {
  const style_element = element("style");
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element.sheet;
}
function append_stylesheet(node, style) {
  append(node.head || node, style);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function set_custom_element_data(node, prop, value) {
  if (prop in node) {
    node[prop] = typeof node[prop] === "boolean" && value === "" ? true : value;
  } else {
    attr(node, prop, value);
  }
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
}
function set_style(node, key, value, important) {
  if (value === null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
function toggle_class(element2, name, toggle) {
  element2.classList[toggle ? "add" : "remove"](name);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, cancelable, detail);
  return e;
}
function attribute_to_object(attributes) {
  const result = {};
  for (const attribute of attributes) {
    result[attribute.name] = attribute.value;
  }
  return result;
}
const managed_styles = /* @__PURE__ */ new Map();
let active = 0;
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i--)
    hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return hash2 >>> 0;
}
function create_style_information(doc, node) {
  const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
  managed_styles.set(doc, info);
  return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
  }
  const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
  if (!rules[name]) {
    rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}
function delete_rule(node, name) {
  const previous = (node.style.animation || "").split(", ");
  const next = previous.filter(name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1);
  const deleted = previous.length - next.length;
  if (deleted) {
    node.style.animation = next.join(", ");
    active -= deleted;
    if (!active)
      clear_rules();
  }
}
function clear_rules() {
  raf(() => {
    if (active)
      return;
    managed_styles.forEach((info) => {
      const { stylesheet } = info;
      let i = stylesheet.cssRules.length;
      while (i--)
        stylesheet.deleteRule(i);
      info.rules = {};
    });
    managed_styles.clear();
  });
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail, { cancelable = false } = {}) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail, { cancelable });
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];
  if (callbacks) {
    callbacks.slice().forEach((fn) => fn.call(this, event));
  }
}
const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  const saved_component = current_component;
  do {
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
let promise;
function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }
  return promise;
}
function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  }
}
const null_transition = { duration: 0 };
function create_bidirectional_transition(node, fn, params, intro) {
  let config = fn(node, params);
  let t = intro ? 0 : 1;
  let running_program = null;
  let pending_program = null;
  let animation_name = null;
  function clear_animation() {
    if (animation_name)
      delete_rule(node, animation_name);
  }
  function init2(program, duration) {
    const d = program.b - t;
    duration *= Math.abs(d);
    return {
      a: t,
      b: program.b,
      d,
      duration,
      start: program.start,
      end: program.start + duration,
      group: program.group
    };
  }
  function go(b) {
    const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
    const program = {
      start: now() + delay,
      b
    };
    if (!b) {
      program.group = outros;
      outros.r += 1;
    }
    if (running_program || pending_program) {
      pending_program = program;
    } else {
      if (css) {
        clear_animation();
        animation_name = create_rule(node, t, b, duration, delay, easing, css);
      }
      if (b)
        tick(0, 1);
      running_program = init2(program, duration);
      add_render_callback(() => dispatch(node, b, "start"));
      loop((now2) => {
        if (pending_program && now2 > pending_program.start) {
          running_program = init2(pending_program, duration);
          pending_program = null;
          dispatch(node, running_program.b, "start");
          if (css) {
            clear_animation();
            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
          }
        }
        if (running_program) {
          if (now2 >= running_program.end) {
            tick(t = running_program.b, 1 - t);
            dispatch(node, running_program.b, "end");
            if (!pending_program) {
              if (running_program.b) {
                clear_animation();
              } else {
                if (!--running_program.group.r)
                  run_all(running_program.group.c);
              }
            }
            running_program = null;
          } else if (now2 >= running_program.start) {
            const p = now2 - running_program.start;
            t = running_program.a + running_program.d * easing(p / running_program.duration);
            tick(t, 1 - t);
          }
        }
        return !!(running_program || pending_program);
      });
    }
  }
  return {
    run(b) {
      if (is_function(config)) {
        wait().then(() => {
          config = config();
          go(b);
        });
      } else {
        go(b);
      }
    },
    end() {
      clear_animation();
      running_program = pending_program = null;
    }
  };
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, on_mount, on_destroy, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy) {
        on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
let SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      const { on_mount } = this.$$;
      this.$$.on_disconnect = on_mount.map(run).filter(is_function);
      for (const key in this.$$.slotted) {
        this.appendChild(this.$$.slotted[key]);
      }
    }
    attributeChangedCallback(attr2, _oldValue, newValue) {
      this[attr2] = newValue;
    }
    disconnectedCallback() {
      run_all(this.$$.on_disconnect);
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };
}
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const height = parseFloat(style.height);
  const padding_top = parseFloat(style.paddingTop);
  const padding_bottom = parseFloat(style.paddingBottom);
  const margin_top = parseFloat(style.marginTop);
  const margin_bottom = parseFloat(style.marginBottom);
  const border_top_width = parseFloat(style.borderTopWidth);
  const border_bottom_width = parseFloat(style.borderBottomWidth);
  return {
    delay,
    duration,
    easing,
    css: (t) => `overflow: hidden;opacity: ${Math.min(t * 20, 1) * opacity};height: ${t * height}px;padding-top: ${t * padding_top}px;padding-bottom: ${t * padding_bottom}px;margin-top: ${t * margin_top}px;margin-bottom: ${t * margin_bottom}px;border-top-width: ${t * border_top_width}px;border-bottom-width: ${t * border_bottom_width}px;`
  };
}
function create_else_block$1(ctx) {
  let div3;
  let div1;
  let div0;
  let t0;
  let div2;
  let t1;
  let t2;
  let if_block_anchor;
  let current;
  let mounted;
  let dispose;
  let if_block = ctx[0] && create_if_block_1();
  return {
    c() {
      div3 = element("div");
      div1 = element("div");
      div0 = element("div");
      div0.innerHTML = `<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><path d="M593.450667 512.128L360.064 278.613333l45.290667-45.226666 278.613333 278.762666L405.333333 790.613333l-45.226666-45.269333z" p-id="1089"></path></svg>`;
      t0 = space();
      div2 = element("div");
      t1 = text(ctx[2]);
      t2 = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
      attr(div0, "class", "flex items-center transition");
      toggle_class(div0, "rotate-90", ctx[0]);
      attr(div1, "class", "ml-1 text-12px text-gray-600 flex item-center");
      set_style(div1, "height", "100%");
      set_style(div1, "width", "16px");
      attr(div2, "class", "ml-1");
      attr(div3, "class", "cursor-pointer text-gray-600 flex items-center h-40px bg-white transition hover-bg-eee");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div1);
      append(div1, div0);
      append(div3, t0);
      append(div3, div2);
      append(div2, t1);
      insert(target, t2, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
      if (!mounted) {
        dispose = listen(div3, "click", ctx[6]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 1) {
        toggle_class(div0, "rotate-90", ctx2[0]);
      }
      if (!current || dirty & 4)
        set_data(t1, ctx2[2]);
      if (ctx2[0]) {
        if (if_block) {
          if (dirty & 1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_1();
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div3);
      if (detaching)
        detach(t2);
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block$2(ctx) {
  let div1;
  let div0;
  let div1_style_value;
  let mounted;
  let dispose;
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      div0.innerHTML = `<slot></slot>`;
      attr(div0, "class", "ml-4");
      attr(div1, "class", "cursor-pointer text-gray-600 flex items-center h-40px bg-white transition hover-bg-eee");
      attr(div1, "style", div1_style_value = ctx[3] ? "background-color: rgba(119, 197, 250, 0.315)" : "");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      if (!mounted) {
        dispose = listen(div1, "click", ctx[5]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 8 && div1_style_value !== (div1_style_value = ctx2[3] ? "background-color: rgba(119, 197, 250, 0.315)" : "")) {
        attr(div1, "style", div1_style_value);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div1);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_1(ctx) {
  let div;
  let div_transition;
  let current;
  return {
    c() {
      div = element("div");
      div.innerHTML = `<slot></slot>`;
      attr(div, "class", "ml-1");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      add_render_callback(() => {
        if (!div_transition)
          div_transition = create_bidirectional_transition(div, slide, {}, true);
        div_transition.run(1);
      });
      current = true;
    },
    o(local) {
      if (!div_transition)
        div_transition = create_bidirectional_transition(div, slide, {}, false);
      div_transition.run(0);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (detaching && div_transition)
        div_transition.end();
    }
  };
}
function create_fragment$3(ctx) {
  let div;
  let current_block_type_index;
  let if_block;
  let current;
  const if_block_creators = [create_if_block$2, create_else_block$1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[1])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      div = element("div");
      if_block.c();
      this.c = noop;
      attr(div, "class", "item");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if_blocks[current_block_type_index].m(div, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(div, null);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if_blocks[current_block_type_index].d();
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let { leaf = false } = $$props;
  let { text: text2 = "" } = $$props;
  let { expand = false } = $$props;
  let { selected = false } = $$props;
  const thisComponent = get_current_component();
  const svelteDispatch = createEventDispatcher();
  const dispatch2 = (type, detail) => {
    var _a;
    (_a = thisComponent == null ? void 0 : thisComponent.dispatchEvent) == null ? void 0 : _a.call(thisComponent, new CustomEvent(type, { detail }));
    return svelteDispatch(type, detail);
  };
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  const click_handler_1 = () => {
    $$invalidate(0, expand = !expand);
    dispatch2("toggleExpand", expand);
  };
  $$self.$$set = ($$props2) => {
    if ("leaf" in $$props2)
      $$invalidate(1, leaf = $$props2.leaf);
    if ("text" in $$props2)
      $$invalidate(2, text2 = $$props2.text);
    if ("expand" in $$props2)
      $$invalidate(0, expand = $$props2.expand);
    if ("selected" in $$props2)
      $$invalidate(3, selected = $$props2.selected);
  };
  return [expand, leaf, text2, selected, dispatch2, click_handler, click_handler_1];
}
class TreeItem extends SvelteElement {
  constructor(options) {
    super();
    this.shadowRoot.innerHTML = `<style>.item{user-select:none}.item .cursor-pointer{cursor:pointer}.item .text-gray-600{color:#494949}.item .flex{display:flex}.item .items-center{align-items:center}.item .bg-white{background-color:#fff}.item .hover-bg-eee:hover{background-color:#eee}.item .transition{transition:all 0.2s ease}.item .ml-4{margin-left:32px}.item .ml-1{margin-left:8px}.item .h-40px{height:40px}.item .text-12px{font-size:12px}.item div.rotate-90{transform:rotate(90deg)}</style>`;
    init(this, {
      target: this.shadowRoot,
      props: attribute_to_object(this.attributes),
      customElement: true
    }, instance$3, create_fragment$3, safe_not_equal, { leaf: 1, text: 2, expand: 0, selected: 3 }, null);
    if (options) {
      if (options.target) {
        insert(options.target, this, options.anchor);
      }
      if (options.props) {
        this.$set(options.props);
        flush();
      }
    }
  }
  static get observedAttributes() {
    return ["leaf", "text", "expand", "selected"];
  }
  get leaf() {
    return this.$$.ctx[1];
  }
  set leaf(leaf) {
    this.$$set({ leaf });
    flush();
  }
  get text() {
    return this.$$.ctx[2];
  }
  set text(text2) {
    this.$$set({ text: text2 });
    flush();
  }
  get expand() {
    return this.$$.ctx[0];
  }
  set expand(expand) {
    this.$$set({ expand });
    flush();
  }
  get selected() {
    return this.$$.ctx[3];
  }
  set selected(selected) {
    this.$$set({ selected });
    flush();
  }
}
customElements.define("tree-item", TreeItem);
function create_fragment$2(ctx) {
  let tree_item;
  let slot;
  let mounted;
  let dispose;
  return {
    c() {
      tree_item = element("tree-item");
      slot = element("slot");
      this.c = noop;
      set_custom_element_data(tree_item, "leaf", "");
      set_custom_element_data(tree_item, "selected", ctx[0]);
    },
    m(target, anchor) {
      insert(target, tree_item, anchor);
      append(tree_item, slot);
      if (!mounted) {
        dispose = listen(tree_item, "click", ctx[1]);
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 1) {
        set_custom_element_data(tree_item, "selected", ctx2[0]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(tree_item);
      mounted = false;
      dispose();
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let { selected = false } = $$props;
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$set = ($$props2) => {
    if ("selected" in $$props2)
      $$invalidate(0, selected = $$props2.selected);
  };
  return [selected, click_handler];
}
class TreeLeaf extends SvelteElement {
  constructor(options) {
    super();
    init(this, {
      target: this.shadowRoot,
      props: attribute_to_object(this.attributes),
      customElement: true
    }, instance$2, create_fragment$2, safe_not_equal, { selected: 0 }, null);
    if (options) {
      if (options.target) {
        insert(options.target, this, options.anchor);
      }
      if (options.props) {
        this.$set(options.props);
        flush();
      }
    }
  }
  static get observedAttributes() {
    return ["selected"];
  }
  get selected() {
    return this.$$.ctx[0];
  }
  set selected(selected) {
    this.$$set({ selected });
    flush();
  }
}
customElements.define("tree-leaf", TreeLeaf);
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[10] = list[i];
  return child_ctx;
}
function create_else_block(ctx) {
  let tree_item;
  let treeview;
  let t;
  let tree_item_text_value;
  let current;
  let mounted;
  let dispose;
  treeview = new TreeView({
    props: { tree: ctx[10].children }
  });
  treeview.$on("leafClick", ctx[5]);
  treeview.$on("itemToggle", ctx[6]);
  function toggleExpand_handler(...args) {
    return ctx[7](ctx[10], ...args);
  }
  return {
    c() {
      tree_item = element("tree-item");
      create_component(treeview.$$.fragment);
      t = space();
      set_custom_element_data(tree_item, "text", tree_item_text_value = ctx[10].text);
    },
    m(target, anchor) {
      insert(target, tree_item, anchor);
      mount_component(treeview, tree_item, null);
      append(tree_item, t);
      current = true;
      if (!mounted) {
        dispose = listen(tree_item, "toggleExpand", toggleExpand_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const treeview_changes = {};
      if (dirty & 1)
        treeview_changes.tree = ctx[10].children;
      treeview.$set(treeview_changes);
      if (!current || dirty & 1 && tree_item_text_value !== (tree_item_text_value = ctx[10].text)) {
        set_custom_element_data(tree_item, "text", tree_item_text_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(treeview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(treeview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(tree_item);
      destroy_component(treeview);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block$1(ctx) {
  let tree_leaf;
  let t_value = ctx[10].text + "";
  let t;
  let tree_leaf_selected_value;
  let mounted;
  let dispose;
  function click_handler() {
    return ctx[4](ctx[10]);
  }
  return {
    c() {
      tree_leaf = element("tree-leaf");
      t = text(t_value);
      set_custom_element_data(tree_leaf, "selected", tree_leaf_selected_value = ctx[10].selected);
    },
    m(target, anchor) {
      insert(target, tree_leaf, anchor);
      append(tree_leaf, t);
      if (!mounted) {
        dispose = listen(tree_leaf, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 1 && t_value !== (t_value = ctx[10].text + ""))
        set_data(t, t_value);
      if (dirty & 1 && tree_leaf_selected_value !== (tree_leaf_selected_value = ctx[10].selected)) {
        set_custom_element_data(tree_leaf, "selected", tree_leaf_selected_value);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(tree_leaf);
      mounted = false;
      dispose();
    }
  };
}
function create_each_block(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$1, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (!ctx2[10].children)
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function create_fragment$1(ctx) {
  let each_1_anchor;
  let current;
  let each_value = ctx[0];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
      this.c = noop;
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(target, anchor);
      }
      insert(target, each_1_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & 15) {
        each_value = ctx2[0];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      destroy_each(each_blocks, detaching);
      if (detaching)
        detach(each_1_anchor);
    }
  };
}
function flat(t) {
  const queue = [...t];
  const result = [];
  while (true) {
    if (queue.length <= 0) {
      break;
    }
    const t2 = queue.shift();
    result.push(t2);
    if (t2.children && t2.children.length > 0) {
      queue.push(...t2.children);
    }
  }
  return result;
}
function instance$1($$self, $$props, $$invalidate) {
  let { tree = [] } = $$props;
  const thisComponent = get_current_component();
  const svelteDispatch = createEventDispatcher();
  const dispatch2 = (type, detail) => {
    var _a;
    (_a = thisComponent == null ? void 0 : thisComponent.dispatchEvent) == null ? void 0 : _a.call(thisComponent, new CustomEvent(type, { detail }));
    return svelteDispatch(type, detail);
  };
  const handleLeafClick = (item) => {
    flat(tree).forEach((fit) => {
      fit.selected = false;
    });
    item.selected = true;
    $$invalidate(0, tree);
  };
  const handleChildrenLeafClick = (e) => {
    flat(tree).forEach((fit) => {
      fit.selected = false;
    });
    $$invalidate(0, tree);
    dispatch2("leafClick", e.detail);
  };
  const click_handler = (item) => {
    dispatch2("leafClick", item);
    handleLeafClick(item);
  };
  const leafClick_handler = (e) => {
    handleChildrenLeafClick(e);
  };
  const itemToggle_handler = (e) => {
    dispatch2("itemToggle", e.detail);
  };
  const toggleExpand_handler = (item, e) => {
    dispatch2("itemToggle", { target: item, expand: e.detail });
  };
  $$self.$$set = ($$props2) => {
    if ("tree" in $$props2)
      $$invalidate(0, tree = $$props2.tree);
  };
  return [
    tree,
    dispatch2,
    handleLeafClick,
    handleChildrenLeafClick,
    click_handler,
    leafClick_handler,
    itemToggle_handler,
    toggleExpand_handler
  ];
}
class TreeView extends SvelteElement {
  constructor(options) {
    super();
    init(this, {
      target: this.shadowRoot,
      props: attribute_to_object(this.attributes),
      customElement: true
    }, instance$1, create_fragment$1, safe_not_equal, { tree: 0 }, null);
    if (options) {
      if (options.target) {
        insert(options.target, this, options.anchor);
      }
      if (options.props) {
        this.$set(options.props);
        flush();
      }
    }
  }
  static get observedAttributes() {
    return ["tree"];
  }
  get tree() {
    return this.$$.ctx[0];
  }
  set tree(tree) {
    this.$$set({ tree });
    flush();
  }
}
customElements.define("tree-view", TreeView);
function create_if_block(ctx) {
  let treeview;
  let current;
  treeview = new TreeView({ props: { tree: ctx[1] } });
  treeview.$on("itemToggle", ctx[3]);
  treeview.$on("leafClick", ctx[4]);
  return {
    c() {
      create_component(treeview.$$.fragment);
    },
    m(target, anchor) {
      mount_component(treeview, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const treeview_changes = {};
      if (dirty & 2)
        treeview_changes.tree = ctx2[1];
      treeview.$set(treeview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(treeview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(treeview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(treeview, detaching);
    }
  };
}
function create_fragment(ctx) {
  let if_block_anchor;
  let current;
  let if_block = ctx[0] && create_if_block(ctx);
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
      this.c = noop;
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (ctx2[0]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let { tree = [] } = $$props;
  let canRender = false;
  let renderTree = [];
  function itemToggle_handler(event) {
    bubble.call(this, $$self, event);
  }
  function leafClick_handler(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$set = ($$props2) => {
    if ("tree" in $$props2)
      $$invalidate(2, tree = $$props2.tree);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 4) {
      {
        if (Array.isArray(tree)) {
          $$invalidate(1, renderTree = tree);
          $$invalidate(0, canRender = true);
        } else if (typeof tree === "string") {
          $$invalidate(1, renderTree = JSON.parse(tree));
          $$invalidate(0, canRender = true);
        } else {
          console.warn("tree\u5FC5\u987B\u662F\u5408\u6CD5\u7684JSON\u5B57\u7B26\u4E32\u6216\u5BF9\u8C61\u6570\u7EC4");
        }
      }
    }
  };
  return [canRender, renderTree, tree, itemToggle_handler, leafClick_handler];
}
class MowTree extends SvelteElement {
  constructor(options) {
    super();
    init(this, {
      target: this.shadowRoot,
      props: attribute_to_object(this.attributes),
      customElement: true
    }, instance, create_fragment, safe_not_equal, { tree: 2 }, null);
    if (options) {
      if (options.target) {
        insert(options.target, this, options.anchor);
      }
      if (options.props) {
        this.$set(options.props);
        flush();
      }
    }
  }
  static get observedAttributes() {
    return ["tree"];
  }
  get tree() {
    return this.$$.ctx[2];
  }
  set tree(tree) {
    this.$$set({ tree });
    flush();
  }
}
customElements.define("mow-tree", MowTree);
export { MowTree };
