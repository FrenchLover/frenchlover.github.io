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
    // class
    var CheckboxButton = (function (_super) {
        __extends(CheckboxButton, _super);
        function CheckboxButton() {
            return _super.apply(this, arguments) || this;
        }
        Object.defineProperty(CheckboxButton.prototype, "type", {
            get: function () {
                return "CheckboxButton";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CheckboxButton.prototype, "checked", {
            get: function () {
                return this.el.getAttribute("checked") == "checked";
            },
            set: function (value) {
                if (!value) {
                    this.el.removeAttribute("checked");
                }
                else {
                    this.el.setAttribute("checked", "checked");
                }
            },
            enumerable: true,
            configurable: true
        });
        CheckboxButton.prototype.onClick = function (event) {
            this.checked = !this.checked;
        };
        // override
        CheckboxButton.prototype.getTemplate = function () {
            var isChecked = this.referenceTag.value == "1" || this.referenceTag.domElement.hasAttribute("checked");
            return "<cf-button class=\"cf-button cf-checkbox-button " + (this.referenceTag.label.trim().length == 0 ? "no-text" : "") + "\" checked=" + (isChecked ? "checked" : "") + ">\n\t\t\t\t<cf-checkbox></cf-checkbox>\n\t\t\t\t" + this.referenceTag.label + "\n\t\t\t</cf-button>\n\t\t\t";
        };
        return CheckboxButton;
    }(cf.Button));
    cf.CheckboxButton = CheckboxButton;
})(cf || (cf = {}));
