/// <reference path="ControlElement.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// namespace
var cf;
(function (cf) {
    // interface
    // class
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(options) {
            var _this = _super.call(this, options) || this;
            _this.clickCallback = _this.onClick.bind(_this);
            _this.el.addEventListener("click", _this.clickCallback, false);
            _this.mouseDownCallback = _this.onMouseDown.bind(_this);
            _this.el.addEventListener("mousedown", _this.mouseDownCallback, false);
            return _this;
        }
        Object.defineProperty(Button.prototype, "type", {
            get: function () {
                return "Button";
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.onMouseDown = function (event) {
            event.preventDefault();
        };
        Button.prototype.onClick = function (event) {
            this.onChoose();
        };
        Button.prototype.dealloc = function () {
            this.el.removeEventListener("click", this.clickCallback, false);
            this.clickCallback = null;
            this.el.removeEventListener("mousedown", this.mouseDownCallback, false);
            this.mouseDownCallback = null;
            _super.prototype.dealloc.call(this);
        };
        // override
        Button.prototype.getTemplate = function () {
            return "<cf-button class=\"cf-button\">\n\t\t\t\t" + this.referenceTag.label + "\n\t\t\t</cf-button>\n\t\t\t";
        };
        return Button;
    }(cf.ControlElement));
    cf.Button = Button;
})(cf || (cf = {}));
