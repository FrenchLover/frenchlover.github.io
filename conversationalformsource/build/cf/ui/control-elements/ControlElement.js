/// <reference path="../../ConversationalForm.ts"/>
/// <reference path="../BasicElement.ts"/>
/// <reference path="../../form-tags/Tag.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// namespace
var cf;
(function (cf) {
    cf.ControlElementEvents = {
        SUBMIT_VALUE: "cf-basic-element-submit",
        PROGRESS_CHANGE: "cf-basic-element-progress",
        ON_FOCUS: "cf-basic-element-on-focus",
    };
    cf.ControlElementProgressStates = {
        BUSY: "cf-control-element-progress-BUSY",
        READY: "cf-control-element-progress-READY",
    };
    // class
    var ControlElement = (function (_super) {
        __extends(ControlElement, _super);
        function ControlElement(options) {
            var _this = _super.call(this, options) || this;
            _this.animateInTimer = 0;
            _this._focus = false;
            _this.onFocusCallback = _this.onFocus.bind(_this);
            _this.el.addEventListener('focus', _this.onFocusCallback, false);
            _this.onBlurCallback = _this.onBlur.bind(_this);
            _this.el.addEventListener('blur', _this.onBlurCallback, false);
            return _this;
        }
        Object.defineProperty(ControlElement.prototype, "type", {
            get: function () {
                return "ControlElement";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ControlElement.prototype, "value", {
            get: function () {
                return cf.Helpers.getInnerTextOfElement(this.el);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ControlElement.prototype, "positionVector", {
            get: function () {
                return this._positionVector;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ControlElement.prototype, "tabIndex", {
            set: function (value) {
                this.el.tabIndex = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ControlElement.prototype, "focus", {
            get: function () {
                return this._focus;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ControlElement.prototype, "visible", {
            get: function () {
                return !this.el.classList.contains("hide");
            },
            set: function (value) {
                if (value) {
                    this.el.classList.remove("hide");
                }
                else {
                    this.el.classList.add("hide");
                    this.tabIndex = -1;
                }
            },
            enumerable: true,
            configurable: true
        });
        ControlElement.prototype.onBlur = function (event) {
            this._focus = false;
        };
        ControlElement.prototype.onFocus = function (event) {
            this._focus = true;
            cf.ConversationalForm.illustrateFlow(this, "dispatch", cf.ControlElementEvents.ON_FOCUS, this.referenceTag);
            document.dispatchEvent(new CustomEvent(cf.ControlElementEvents.ON_FOCUS, {
                detail: this.positionVector
            }));
        };
        ControlElement.prototype.calcPosition = function () {
            var mr = parseInt(window.getComputedStyle(this.el).getPropertyValue("margin-right"), 10);
            // try not to do this to often, re-paint whammy!
            this._positionVector = {
                height: this.el.offsetHeight,
                width: this.el.offsetWidth + mr,
                x: this.el.offsetLeft,
                y: this.el.offsetTop,
            };
            this._positionVector.centerX = this._positionVector.x + (this._positionVector.width * 0.5);
            this._positionVector.centerY = this._positionVector.y + (this._positionVector.height * 0.5);
        };
        ControlElement.prototype.setData = function (options) {
            this.referenceTag = options.referenceTag;
            _super.prototype.setData.call(this, options);
        };
        ControlElement.prototype.animateIn = function () {
            var _this = this;
            clearTimeout(this.animateInTimer);
            if (this.el.classList.contains("animate-in")) {
                this.el.classList.remove("animate-in");
                this.animateInTimer = setTimeout(function () { return _this.el.classList.add("animate-in"); }, 0);
            }
            else {
                this.el.classList.add("animate-in");
            }
        };
        ControlElement.prototype.animateOut = function () {
            this.el.classList.add("animate-out");
        };
        ControlElement.prototype.onChoose = function () {
            cf.ConversationalForm.illustrateFlow(this, "dispatch", cf.ControlElementEvents.SUBMIT_VALUE, this.referenceTag);
            document.dispatchEvent(new CustomEvent(cf.ControlElementEvents.SUBMIT_VALUE, {
                detail: this
            }));
        };
        ControlElement.prototype.dealloc = function () {
            this.el.removeEventListener('blur', this.onBlurCallback, false);
            this.onBlurCallback = null;
            this.el.removeEventListener('focus', this.onFocusCallback, false);
            this.onFocusCallback = null;
            _super.prototype.dealloc.call(this);
        };
        return ControlElement;
    }(cf.BasicElement));
    cf.ControlElement = ControlElement;
})(cf || (cf = {}));
