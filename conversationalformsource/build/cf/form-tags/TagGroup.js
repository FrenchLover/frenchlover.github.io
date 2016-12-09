/// <reference path="ButtonTag.ts"/>
/// <reference path="InputTag.ts"/>
/// <reference path="SelectTag.ts"/>
/// <reference path="../ui/UserInput.ts"/>
// group tags together, this is done automatically by looking through InputTags with type radio or checkbox and same name attribute.
// single choice logic for Radio Button, <input type="radio", where name is the same
// multi choice logic for Checkboxes, <input type="checkbox", where name is the same
// namespace
var cf;
(function (cf) {
    // class
    var TagGroup = (function () {
        function TagGroup(options) {
            this.elements = options.elements;
            console.log('TagGroup registered:', this.elements[0].type, this);
        }
        Object.defineProperty(TagGroup.prototype, "type", {
            get: function () {
                return "group";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TagGroup.prototype, "name", {
            get: function () {
                return this.elements[0].name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TagGroup.prototype, "label", {
            get: function () {
                return this.elements[0].label;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TagGroup.prototype, "question", {
            get: function () {
                // check if elements have the questions, else fallback
                var tagQuestion = this.elements[0].question;
                if (tagQuestion) {
                    return tagQuestion;
                }
                else {
                    // fallback to AI response from dictionary
                    var aiReponse = cf.Dictionary.getAIResponse(this.getGroupTagType());
                    return aiReponse;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TagGroup.prototype, "value", {
            get: function () {
                // TODO: fix value???
                return "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TagGroup.prototype, "errorMessage", {
            get: function () {
                if (!this.errorMessages) {
                    this.errorMessages = [cf.Dictionary.get("input-placeholder-error")];
                    for (var i = 0; i < this.elements.length; i++) {
                        var element = this.elements[i];
                        if (this.elements[i].domElement.getAttribute("cf-error")) {
                            this.errorMessages = this.elements[i].domElement.getAttribute("cf-error").split("|");
                        }
                    }
                }
                return this.errorMessages[Math.floor(Math.random() * this.errorMessages.length)];
            },
            enumerable: true,
            configurable: true
        });
        TagGroup.prototype.dealloc = function () {
            for (var i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                element.dealloc();
            }
            this.elements = null;
            this.errorMessages = null;
        };
        TagGroup.prototype.getGroupTagType = function () {
            return this.elements[0].type;
        };
        TagGroup.prototype.setTagValueAndIsValid = function (value) {
            var isValid = false;
            var groupType = this.elements[0].type;
            switch (groupType) {
                case "radio":
                    var numberRadioButtonsVisible = [];
                    var wasRadioButtonChecked = false;
                    for (var i = 0; i < value.controlElements.length; i++) {
                        var element = value.controlElements[i];
                        var tag = this.elements[this.elements.indexOf(element.referenceTag)];
                        if (element.visible) {
                            numberRadioButtonsVisible.push(element);
                            if (tag == element.referenceTag) {
                                tag.domElement.checked = element.checked;
                                // a radio button was checked
                                if (!wasRadioButtonChecked && element.checked)
                                    wasRadioButtonChecked = true;
                            }
                        }
                    }
                    // special case 1, only one radio button visible from a filter
                    if (!isValid && numberRadioButtonsVisible.length == 1) {
                        var element = numberRadioButtonsVisible[0];
                        var tag = this.elements[this.elements.indexOf(element.referenceTag)];
                        element.checked = true;
                        tag.domElement.checked = true;
                        isValid = true;
                    }
                    else if (!isValid && wasRadioButtonChecked) {
                        // a radio button needs to be checked of
                        isValid = wasRadioButtonChecked;
                    }
                    break;
                case "checkbox":
                    // checkbox is always valid
                    isValid = true;
                    for (var i = 0; i < value.controlElements.length; i++) {
                        var element = value.controlElements[i];
                        var tag = this.elements[this.elements.indexOf(element.referenceTag)];
                        tag.domElement.checked = element.checked;
                    }
                    break;
            }
            return isValid;
        };
        return TagGroup;
    }());
    cf.TagGroup = TagGroup;
})(cf || (cf = {}));
