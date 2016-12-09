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
    var SelectTag = (function (_super) {
        __extends(SelectTag, _super);
        function SelectTag(options) {
            var _this = _super.call(this, options) || this;
            // build the option tags
            _this.optionTags = [];
            var domOptionTags = _this.domElement.getElementsByTagName("option");
            for (var i = 0; i < domOptionTags.length; i++) {
                var element = domOptionTags[i];
                var tag = cf.Tag.createTag(element);
                if (tag) {
                    _this.optionTags.push(tag);
                }
                else {
                }
            }
            return _this;
        }
        Object.defineProperty(SelectTag.prototype, "type", {
            get: function () {
                return "select";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectTag.prototype, "multipleChoice", {
            get: function () {
                return this.domElement.hasAttribute("multiple");
            },
            enumerable: true,
            configurable: true
        });
        SelectTag.prototype.setTagValueAndIsValid = function (value) {
            var isValid = false;
            // select tag values are set via selected attribute on option tag
            var numberOptionButtonsVisible = [];
            for (var i = 0; i < this.optionTags.length; i++) {
                var tag = this.optionTags[i];
                for (var j = 0; j < value.controlElements.length; j++) {
                    var controllerElement = value.controlElements[j];
                    if (controllerElement.referenceTag == tag) {
                        // tag match found, so set value
                        tag.selected = controllerElement.selected;
                        // check for minimum one selected
                        if (!isValid && tag.selected)
                            isValid = true;
                        if (controllerElement.visible)
                            numberOptionButtonsVisible.push(controllerElement);
                    }
                }
            }
            // special case 1, only one optiontag visible from a filter
            if (!isValid && numberOptionButtonsVisible.length == 1) {
                var element = numberOptionButtonsVisible[0];
                var tag = this.optionTags[this.optionTags.indexOf(element.referenceTag)];
                element.selected = true;
                tag.selected = true;
                isValid = true;
            }
            return isValid;
        };
        return SelectTag;
    }(cf.Tag));
    cf.SelectTag = SelectTag;
})(cf || (cf = {}));
