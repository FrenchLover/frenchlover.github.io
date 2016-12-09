/// <reference path="Tag.ts"/>
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
    var ButtonTag = (function (_super) {
        __extends(ButtonTag, _super);
        function ButtonTag(options) {
            var _this = _super.call(this, options) || this;
            if (_this.domElement.getAttribute("type") == "submit") {
            }
            else if (_this.domElement.getAttribute("type") == "button") {
            }
            return _this;
        }
        return ButtonTag;
    }(cf.Tag));
    cf.ButtonTag = ButtonTag;
})(cf || (cf = {}));
