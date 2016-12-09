/// <reference path="ControlElement.ts"/>
/// <reference path="OptionButton.ts"/>
// namespace
var cf;
(function (cf) {
    // interface
    // class
    // builds x OptionsButton from the registered SelectTag
    var OptionsList = (function () {
        function OptionsList(options) {
            this.context = options.context;
            this.referenceTag = options.referenceTag;
            // check for multi choice select tag
            this.multiChoice = this.referenceTag.domElement.hasAttribute("multiple");
            this.onOptionButtonClickCallback = this.onOptionButtonClick.bind(this);
            document.addEventListener(cf.OptionButtonEvents.CLICK, this.onOptionButtonClickCallback, false);
            this.createElements();
        }
        Object.defineProperty(OptionsList.prototype, "type", {
            get: function () {
                return "OptionsList";
            },
            enumerable: true,
            configurable: true
        });
        OptionsList.prototype.getValue = function () {
            var arr = [];
            for (var i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                if (!this.multiChoice && element.selected) {
                    arr.push(element);
                    return arr;
                }
                else if (this.multiChoice && element.selected) {
                    arr.push(element);
                }
            }
            return arr;
        };
        OptionsList.prototype.onOptionButtonClick = function (event) {
            // if mutiple... then don remove selection on other buttons
            var isMutiple = false;
            if (!this.multiChoice) {
                // only one is selectable at the time.
                for (var i = 0; i < this.elements.length; i++) {
                    var element = this.elements[i];
                    if (element != event.detail) {
                        element.selected = false;
                    }
                    else {
                        element.selected = true;
                    }
                }
                cf.ConversationalForm.illustrateFlow(this, "dispatch", cf.ControlElementEvents.SUBMIT_VALUE, this.referenceTag);
                document.dispatchEvent(new CustomEvent(cf.ControlElementEvents.SUBMIT_VALUE, {
                    detail: event.detail
                }));
            }
            else {
                event.detail.selected = !event.detail.selected;
            }
        };
        OptionsList.prototype.createElements = function () {
            this.elements = [];
            var optionTags = this.referenceTag.optionTags;
            for (var i = 0; i < optionTags.length; i++) {
                var tag = optionTags[i];
                var btn = new cf.OptionButton({
                    referenceTag: tag,
                    isMultiChoice: this.referenceTag.multipleChoice,
                });
                this.elements.push(btn);
                this.context.appendChild(btn.el);
            }
        };
        OptionsList.prototype.dealloc = function () {
            document.removeEventListener(cf.OptionButtonEvents.CLICK, this.onOptionButtonClickCallback, false);
            this.onOptionButtonClickCallback = null;
            while (this.elements.length > 0)
                this.elements.pop().dealloc();
            this.elements = null;
        };
        return OptionsList;
    }());
    cf.OptionsList = OptionsList;
})(cf || (cf = {}));
