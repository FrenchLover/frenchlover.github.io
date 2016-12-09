/// <reference path="Button.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// namespace
var cf;
(function (cf) {
    // interface
    cf.OptionButtonEvents = {
        CLICK: "cf-option-button-click"
    };
    // class
    var OptionButton = (function (_super) {
        __extends(OptionButton, _super);
        function OptionButton() {
            var _this = _super.apply(this, arguments) || this;
            _this.isMultiChoice = false;
            return _this;
        }
        Object.defineProperty(OptionButton.prototype, "type", {
            get: function () {
                return "OptionButton";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OptionButton.prototype, "selected", {
            get: function () {
                return this.el.hasAttribute("selected");
            },
            set: function (value) {
                if (value) {
                    this.el.setAttribute("selected", "selected");
                }
                else {
                    this.el.removeAttribute("selected");
                }
            },
            enumerable: true,
            configurable: true
        });
        OptionButton.prototype.setData = function (options) {
            this.isMultiChoice = options.isMultiChoice;
            _super.prototype.setData.call(this, options);
        };
        OptionButton.prototype.onClick = function (event) {
            cf.ConversationalForm.illustrateFlow(this, "dispatch", cf.OptionButtonEvents.CLICK, this);
            document.dispatchEvent(new CustomEvent(cf.OptionButtonEvents.CLICK, {
                detail: this
            }));
        };
        // override
        OptionButton.prototype.getTemplate = function () {
            var tmpl = '<cf-button class="cf-button ' + (this.isMultiChoice ? "cf-checkbox-button" : "") + '" ' + (this.referenceTag.domElement.selected ? "selected='selected'" : "") + '>';
            if (this.isMultiChoice)
                tmpl += "<cf-checkbox></cf-checkbox>";
            tmpl += this.referenceTag.label;
            tmpl += "</cf-button>";
            return tmpl;
        };
        return OptionButton;
    }(cf.Button));
    cf.OptionButton = OptionButton;
})(cf || (cf = {}));
