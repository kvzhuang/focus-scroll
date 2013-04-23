/*global YUI, window, document */
/**
 * An YUI focus plugin provide .
 *
 * @module   focusscroll
 * @requires "anim", "event-resize", "event-focus", "event-delegate", "node"
 * @author   Kevin Zhuang
 * @created  2013/04/16
 */
YUI.add("focus-scroll", function (Y) {

    var MODULE_ID = "FocusScrollPlugin";

    function FocusScrollPlugin(config) {
        this._init(config);
    }

    FocusScrollPlugin.NS = "focus-scroll";

    FocusScrollPlugin.prototype = {
        _init: function (config) {
            Y.log("_init() is executed.", "info", MODULE_ID);
            var callback = config.host.callback || null,
                node = config.host,
                focusable = "a";
            Y.delegate("focus", this._handleFocus, node, focusable, node, callback);
            // Focus the first element.
            node.one(focusable).focus();
        },
        _handleFocus: function (e, callback) {
            Y.log("_handleFocus() is executed.", "info", MODULE_ID);
            var anim,
                container,
                isDoc,
                node,
                offset = 100, // offset to scroll
                nodeY,        // node offsetY position.
                nodeHeight,   // Height of each node. (MUST BE THE SAME)
                rowTotal,     // Available amount of rows within the viewport.
                scrollY,      // Current scroll position.
                scrollHeight, // Current scroll height.
                scrollTop,    // Target scrollTop value.
                viewHeight;
            node = e.currentTarget;
            container = this;
            isDoc = (container._node === document || container._node === window || container._node === document.body);
            nodeY = (isDoc) ? node.get("region").top : node.get("offsetTop") - container.get("region").top;
            nodeHeight = node.get("offsetHeight");
            scrollY = (isDoc) ? node.get("docScrollY") : container.get("scrollTop");
            Y.log("scrollY = " + scrollY);
            viewHeight = (isDoc) ? node.get("winHeight") : container.get("offsetHeight");
            scrollHeight = viewHeight + scrollY;
            Y.log("_handleFocus() - Current position " +
                 "(nodeBottomY = " + (nodeY + nodeHeight) + ", " +
                 "scrollHeight = " + scrollHeight + ").");

            // Scroll down when focused node exceeds viewport.
            if (nodeY + nodeHeight >= scrollHeight - offset) {
                Y.log("_handleFocus() - Scroll down " +
                     "(nodeBottomY = " + (nodeY + nodeHeight) + ", " +
                     "scrollHeight = " + scrollHeight + ").");

                scrollTop = nodeY;

            // Scroll up.
            } else if (nodeY < scrollY + offset) {
                Y.log("_handleFocus() - Scroll up " +
                     "(nodeTopY = " + nodeY + ", " +
                     "scrollY = " + scrollY + ").");

                // Caculates target scrollTop.
                rowTotal = Math.floor(viewHeight / nodeHeight);
                scrollTop = nodeY - (rowTotal - 1) * nodeHeight;
                scrollTop = (scrollTop <= 0) ? 0 : scrollTop;
            }

            // Makes scrolling while scrollTop isn't undefined.
            if (scrollTop) {
                anim = new Y.Anim({
                    duration: 0.5,
                    easing: "easeIn",
                    node: this,
                    to: {
                        scrollTop: scrollTop
                    }
                });
                anim.run();
            }
            if (callback) {
                callback.apply(e.currentTarget);
            }
        }
    };

    Y.FocusScrollPlugin = FocusScrollPlugin;
}, "0.0.1", {
    "group"    : "mui",
    "js"    : "focus-scroll/focus-scroll.js",
    "requires": [
        "anim",
        "event-resize",
        "event-focus",
        "event-delegate",
        "node"]
});
