/// <reference path="BasicElement.ts"/>
/// <reference path="control-elements/ControlElements.ts"/>
/// <reference path="../logic/FlowManager.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// namespace
var cf;
(function (cf) {
    // interface
    cf.UserInputEvents = {
        SUBMIT: "cf-input-user-input-submit",
        //	detail: string
        KEY_CHANGE: "cf-input-key-change",
        //	detail: string
        CONTROL_ELEMENTS_ADDED: "cf-input-control-elements-added",
    };
    // class
    var UserInput = (function (_super) {
        __extends(UserInput, _super);
        function UserInput(options) {
            var _this = _super.call(this, options) || this;
            _this.errorTimer = 0;
            _this.shiftIsDown = false;
            _this._disabled = false;
            _this.el.setAttribute("placeholder", cf.Dictionary.get("input-placeholder"));
            _this.inputElement = _this.el.getElementsByTagName("input")[0];
            _this.onInputFocusCallback = _this.onInputFocus.bind(_this);
            _this.inputElement.addEventListener('focus', _this.onInputFocusCallback, false);
            //<cf-input-control-elements> is defined in the ChatList.ts
            _this.controlElements = new cf.ControlElements({
                el: _this.el.getElementsByTagName("cf-input-control-elements")[0]
            });
            // setup event listeners
            _this.windowFocusCallback = _this.windowFocus.bind(_this);
            window.addEventListener('focus', _this.windowFocusCallback, false);
            _this.keyUpCallback = _this.onKeyUp.bind(_this);
            document.addEventListener("keyup", _this.keyUpCallback, false);
            _this.keyDownCallback = _this.onKeyDown.bind(_this);
            document.addEventListener("keydown", _this.keyDownCallback, false);
            _this.flowUpdateCallback = _this.onFlowUpdate.bind(_this);
            document.addEventListener(cf.FlowEvents.FLOW_UPDATE, _this.flowUpdateCallback, false);
            _this.inputInvalidCallback = _this.inputInvalid.bind(_this);
            document.addEventListener(cf.FlowEvents.USER_INPUT_INVALID, _this.inputInvalidCallback, false);
            _this.onControlElementSubmitCallback = _this.onControlElementSubmit.bind(_this);
            document.addEventListener(cf.ControlElementEvents.SUBMIT_VALUE, _this.onControlElementSubmitCallback, false);
            _this.onControlElementProgressChangeCallback = _this.onControlElementProgressChange.bind(_this);
            document.addEventListener(cf.ControlElementEvents.PROGRESS_CHANGE, _this.onControlElementProgressChangeCallback, false);
            _this.submitButton = _this.el.getElementsByTagName("cf-input-button")[0];
            _this.onSubmitButtonClickCallback = _this.onSubmitButtonClick.bind(_this);
            _this.submitButton.addEventListener("click", _this.onSubmitButtonClickCallback, false);
            return _this;
        }
        Object.defineProperty(UserInput.prototype, "active", {
            get: function () {
                return this.inputElement === document.activeElement;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserInput.prototype, "disabled", {
            set: function (value) {
                var hasChanged = this._disabled != value;
                if (hasChanged) {
                    this._disabled = value;
                    if (value) {
                        this.el.setAttribute("disabled", "disabled");
                        this.inputElement.blur();
                    }
                    else {
                        this.setFocusOnInput();
                        this.el.removeAttribute("disabled");
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        UserInput.prototype.getInputValue = function () {
            return this.inputElement.value;
        };
        UserInput.prototype.getFlowDTO = function () {
            var value; // = this.inputElement.value;
            // check for values on control elements as they should overwrite the input value.
            if (this.controlElements && this.controlElements.active) {
                value = this.controlElements.getDTO();
            }
            else {
                value = {
                    text: this.getInputValue()
                };
            }
            value.input = this;
            return value;
        };
        UserInput.prototype.inputInvalid = function (event) {
            var _this = this;
            cf.ConversationalForm.illustrateFlow(this, "receive", event.type, event.detail);
            var dto = event.detail;
            this.inputElement.setAttribute("data-value", this.inputElement.value);
            this.inputElement.value = "";
            this.el.setAttribute("error", "");
            this.disabled = true;
            // cf-error
            this.inputElement.setAttribute("placeholder", dto.errorText || this.currentTag.errorMessage);
            clearTimeout(this.errorTimer);
            this.errorTimer = setTimeout(function () {
                _this.disabled = false;
                _this.el.removeAttribute("error");
                _this.inputElement.value = _this.inputElement.getAttribute("data-value");
                _this.inputElement.setAttribute("data-value", "");
                _this.inputElement.setAttribute("placeholder", cf.Dictionary.get("input-placeholder"));
                _this.setFocusOnInput();
            }, UserInput.ERROR_TIME);
        };
        UserInput.prototype.onFlowUpdate = function (event) {
            var _this = this;
            cf.ConversationalForm.illustrateFlow(this, "receive", event.type, event.detail);
            // animate input field in
            if (!this.el.classList.contains("animate-in"))
                this.el.classList.add("animate-in");
            this.currentTag = event.detail;
            this.el.setAttribute("tag-type", this.currentTag.type);
            clearTimeout(this.errorTimer);
            this.el.removeAttribute("error");
            this.inputElement.setAttribute("data-value", "");
            this.inputElement.value = "";
            this.inputElement.setAttribute("placeholder", cf.Dictionary.get("input-placeholder"));
            this.resetValue();
            if (!UserInput.preventAutoFocus)
                this.setFocusOnInput();
            this.controlElements.reset();
            if (this.currentTag.type == "group") {
                this.buildControlElements(this.currentTag.elements);
            }
            else {
                this.buildControlElements([this.currentTag]);
            }
            setTimeout(function () {
                _this.disabled = false;
            }, 1000);
        };
        UserInput.prototype.onControlElementProgressChange = function (event) {
            var status = event.detail;
            this.disabled = status == cf.ControlElementProgressStates.BUSY;
        };
        UserInput.prototype.buildControlElements = function (tags) {
            this.controlElements.buildTags(tags);
        };
        UserInput.prototype.onControlElementSubmit = function (event) {
            cf.ConversationalForm.illustrateFlow(this, "receive", event.type, event.detail);
            // when ex a RadioButton is clicked..
            var controlElement = event.detail;
            this.controlElements.updateStateOnElements(controlElement);
            this.doSubmit();
        };
        UserInput.prototype.onSubmitButtonClick = function (event) {
            this.onEnterOrSubmitButtonSubmit();
        };
        UserInput.prototype.onKeyDown = function (event) {
            if (event.keyCode == cf.Dictionary.keyCodes["shift"])
                this.shiftIsDown = true;
        };
        UserInput.prototype.onKeyUp = function (event) {
            if (event.keyCode == cf.Dictionary.keyCodes["shift"]) {
                this.shiftIsDown = false;
            }
            else if (event.keyCode == cf.Dictionary.keyCodes["up"]) {
                event.preventDefault();
                if (this.active && !this.controlElements.focus)
                    this.controlElements.focusFrom("bottom");
            }
            else if (event.keyCode == cf.Dictionary.keyCodes["down"]) {
                event.preventDefault();
                if (this.active && !this.controlElements.focus)
                    this.controlElements.focusFrom("top");
            }
            else if (event.keyCode == cf.Dictionary.keyCodes["tab"]) {
                // tab key pressed, check if node is child of CF, if then then reset focus to input element
                var doesKeyTargetExistInCF = false;
                var node = event.target.parentNode;
                while (node != null) {
                    if (node === window.ConversationalForm.el) {
                        doesKeyTargetExistInCF = true;
                        break;
                    }
                    node = node.parentNode;
                }
                // prevent normal behaviour, we are not here to take part, we are here to take over!
                if (!doesKeyTargetExistInCF) {
                    event.preventDefault();
                    if (this.shiftIsDown) {
                        // focus the last item in controlElement
                        if (this.controlElements.active)
                            this.controlElements.setFocusOnElement(this.controlElements.length - 1);
                        else
                            this.setFocusOnInput();
                    }
                    else {
                        this.setFocusOnInput();
                    }
                }
            }
            if (this.el.hasAttribute("disabled"))
                return;
            var value = this.getFlowDTO();
            if (event.keyCode == cf.Dictionary.keyCodes["enter"] || event.keyCode == cf.Dictionary.keyCodes["space"]) {
                if (event.keyCode == cf.Dictionary.keyCodes["enter"] && this.active) {
                    event.preventDefault();
                    this.onEnterOrSubmitButtonSubmit();
                }
                else {
                    // either click on submit button or do something with control elements
                    if (event.keyCode == cf.Dictionary.keyCodes["enter"] || event.keyCode == cf.Dictionary.keyCodes["space"]) {
                        event.preventDefault();
                        var tagType = this.currentTag.type == "group" ? this.currentTag.getGroupTagType() : this.currentTag.type;
                        if (tagType == "select" || tagType == "checkbox") {
                            var mutiTag = this.currentTag;
                            // if select or checkbox then check for multi select item
                            if (tagType == "checkbox" || mutiTag.multipleChoice) {
                                if (this.active && event.keyCode == cf.Dictionary.keyCodes["enter"]) {
                                    // click on UserInput submit button, only ENTER allowed
                                    this.submitButton.click();
                                }
                                else {
                                    // let UI know what we changed the key
                                    this.dispatchKeyChange(value, event.keyCode);
                                    if (!this.active) {
                                        // after ui has been selected we RESET the input/filter
                                        this.resetValue();
                                        this.setFocusOnInput();
                                        this.dispatchKeyChange(value, event.keyCode);
                                    }
                                }
                            }
                            else {
                                this.dispatchKeyChange(value, event.keyCode);
                            }
                        }
                        else {
                            if (this.currentTag.type == "group") {
                                // let the controlements handle action
                                this.dispatchKeyChange(value, event.keyCode);
                            }
                        }
                    }
                    else if (event.keyCode == cf.Dictionary.keyCodes["space"] && document.activeElement) {
                        this.dispatchKeyChange(value, event.keyCode);
                    }
                }
            }
            else if (event.keyCode != cf.Dictionary.keyCodes["shift"] && event.keyCode != cf.Dictionary.keyCodes["tab"]) {
                this.dispatchKeyChange(value, event.keyCode);
            }
        };
        UserInput.prototype.dispatchKeyChange = function (dto, keyCode) {
            cf.ConversationalForm.illustrateFlow(this, "dispatch", cf.UserInputEvents.KEY_CHANGE, dto);
            document.dispatchEvent(new CustomEvent(cf.UserInputEvents.KEY_CHANGE, {
                detail: {
                    dto: dto,
                    keyCode: keyCode,
                    inputFieldActive: this.active
                }
            }));
        };
        UserInput.prototype.windowFocus = function (event) {
            if (!UserInput.preventAutoFocus)
                this.setFocusOnInput();
        };
        UserInput.prototype.onInputFocus = function (event) {
            if (this.controlElements.active)
                this.controlElements.setFocusOnElement(-1);
        };
        UserInput.prototype.setFocusOnInput = function () {
            this.inputElement.focus();
        };
        UserInput.prototype.onEnterOrSubmitButtonSubmit = function () {
            // we need to check if current tag is file
            if (this.currentTag.type == "file") {
                // trigger <input type="file"
                this.controlElements.getElement(0).triggerFileSelect();
            }
            else {
                // for groups, we expect that there is always a default value set
                this.doSubmit();
            }
        };
        UserInput.prototype.doSubmit = function () {
            var value = this.getFlowDTO();
            this.disabled = true;
            this.el.removeAttribute("error");
            this.inputElement.setAttribute("data-value", "");
            cf.ConversationalForm.illustrateFlow(this, "dispatch", cf.UserInputEvents.SUBMIT, value);
            document.dispatchEvent(new CustomEvent(cf.UserInputEvents.SUBMIT, {
                detail: value
            }));
        };
        UserInput.prototype.resetValue = function () {
            this.inputElement.value = "";
        };
        UserInput.prototype.dealloc = function () {
            this.inputElement.removeEventListener('focus', this.onInputFocusCallback, false);
            this.onInputFocusCallback = null;
            window.removeEventListener('focus', this.windowFocusCallback, false);
            this.windowFocusCallback = null;
            document.removeEventListener("keydown", this.keyDownCallback, false);
            this.keyDownCallback = null;
            document.removeEventListener("keyup", this.keyUpCallback, false);
            this.keyUpCallback = null;
            document.removeEventListener(cf.FlowEvents.FLOW_UPDATE, this.flowUpdateCallback, false);
            this.flowUpdateCallback = null;
            document.removeEventListener(cf.FlowEvents.USER_INPUT_INVALID, this.inputInvalidCallback, false);
            this.inputInvalidCallback = null;
            document.removeEventListener(cf.ControlElementEvents.SUBMIT_VALUE, this.onControlElementSubmitCallback, false);
            this.onControlElementSubmitCallback = null;
            this.submitButton = this.el.getElementsByClassName("cf-input-button")[0];
            this.submitButton.removeEventListener("click", this.onSubmitButtonClickCallback, false);
            this.onSubmitButtonClickCallback = null;
            _super.prototype.dealloc.call(this);
        };
        // override
        UserInput.prototype.getTemplate = function () {
            return "<cf-input>\n\t\t\t\t<cf-input-control-elements>\n\t\t\t\t\t<cf-list-button direction=\"prev\">\n\t\t\t\t\t</cf-list-button>\n\t\t\t\t\t<cf-list-button direction=\"next\">\n\t\t\t\t\t</cf-list-button>\n\t\t\t\t\t<cf-list>\n\t\t\t\t\t\t<cf-info></cf-info>\n\t\t\t\t\t</cf-list>\n\t\t\t\t</cf-input-control-elements>\n\n\t\t\t\t<cf-input-button class=\"cf-input-button\">\n\t\t\t\t\t<svg class=\"cf-icon-progress\" viewBox=\"0 0 24 22\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"><g fill=\"#B9BCBE\"><polygon transform=\"translate(12.257339, 11.185170) rotate(90.000000) translate(-12.257339, -11.185170) \" points=\"10.2587994 9.89879989 14.2722074 5.85954869 12.4181046 3.92783101 5.07216899 11.1851701 12.4181046 18.4425091 14.2722074 16.5601737 10.2587994 12.5405503 19.4425091 12.5405503 19.4425091 9.89879989\"></polygon></g></g></svg>\n\n\t\t\t\t\t<svg class=\"cf-icon-attachment\" viewBox=\"0 0 24 22\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g><g transform=\"translate(-1226.000000, -1427.000000)\"><g transform=\"translate(738.000000, 960.000000)\"><g transform=\"translate(6.000000, 458.000000)\"><path stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" d=\"M499,23.1092437 L499,18.907563 C499,16.2016807 496.756849,14 494,14 C491.243151,14 489,16.2016807 489,18.907563 L489,24.5042017 C489,26.4369748 490.592466,28 492.561644,28 C494.530822,28 496.123288,26.4369748 496.123288,24.5042017 L496.123288,18.907563 C496.140411,17.7478992 495.181507,16.8067227 494,16.8067227 C492.818493,16.8067227 491.859589,17.7478992 491.859589,18.907563 L491.859589,23.1092437\" id=\"Icon\"></path></g></g></g></g></svg>\n\t\t\t\t</cf-input-button>\n\t\t\t\t\n\t\t\t\t<input type='input' tabindex=\"1\">\n\n\t\t\t</cf-input>\n\t\t\t";
        };
        return UserInput;
    }(cf.BasicElement));
    UserInput.preventAutoFocus = false;
    UserInput.ERROR_TIME = 2000;
    cf.UserInput = UserInput;
})(cf || (cf = {}));
