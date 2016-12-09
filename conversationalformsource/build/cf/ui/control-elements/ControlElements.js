/// <reference path="Button.ts"/>
/// <reference path="ControlElement.ts"/>
/// <reference path="RadioButton.ts"/>
/// <reference path="CheckboxButton.ts"/>
/// <reference path="OptionsList.ts"/>
/// <reference path="UploadFileUI.ts"/>
/// <reference path="../ScrollController.ts"/>
/// <reference path="../chat/ChatResponse.ts"/>
/// <reference path="../../../typings/globals/es6-promise/index.d.ts"/>
// namespace
var cf;
(function (cf) {
    var ControlElements = (function () {
        function ControlElements(options) {
            this.ignoreKeyboardInput = false;
            this.rowIndex = -1;
            this.columnIndex = 0;
            this.elementWidth = 0;
            this.filterListNumberOfVisible = 0;
            this.listWidth = 0;
            this.el = options.el;
            this.list = this.el.getElementsByTagName("cf-list")[0];
            this.infoElement = this.el.getElementsByTagName("cf-info")[0];
            this.onScrollCallback = this.onScroll.bind(this);
            this.el.addEventListener('scroll', this.onScrollCallback, false);
            this.onElementFocusCallback = this.onElementFocus.bind(this);
            document.addEventListener(cf.ControlElementEvents.ON_FOCUS, this.onElementFocusCallback, false);
            this.onChatAIReponseCallback = this.onChatAIReponse.bind(this);
            document.addEventListener(cf.ChatResponseEvents.AI_QUESTION_ASKED, this.onChatAIReponseCallback, false);
            this.onUserInputKeyChangeCallback = this.onUserInputKeyChange.bind(this);
            document.addEventListener(cf.UserInputEvents.KEY_CHANGE, this.onUserInputKeyChangeCallback, false);
            // user input update
            this.userInputUpdateCallback = this.onUserInputUpdate.bind(this);
            document.addEventListener(cf.FlowEvents.USER_INPUT_UPDATE, this.userInputUpdateCallback, false);
            this.listScrollController = new cf.ScrollController({
                interactionListener: this.el,
                listToScroll: this.list,
                listNavButtons: this.el.getElementsByTagName("cf-list-button"),
            });
        }
        Object.defineProperty(ControlElements.prototype, "active", {
            get: function () {
                return this.elements && this.elements.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ControlElements.prototype, "focus", {
            get: function () {
                var elements = this.getElements();
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    if (element.focus) {
                        return true;
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ControlElements.prototype, "length", {
            get: function () {
                var elements = this.getElements();
                return elements.length;
            },
            enumerable: true,
            configurable: true
        });
        ControlElements.prototype.onScroll = function (event) {
            // some times the tabbing will result in el scroll, reset this.
            this.el.scrollLeft = 0;
        };
        ControlElements.prototype.onElementFocus = function (event) {
            var vector = event.detail;
            var x = (vector.x + vector.width < this.elementWidth ? 0 : vector.x - vector.width);
            x *= -1;
            // TODO: update rowIndex and columnIndex
            this.listScrollController.setScroll(x, 0);
        };
        ControlElements.prototype.onChatAIReponse = function (event) {
            this.animateElementsIn();
        };
        ControlElements.prototype.onUserInputKeyChange = function (event) {
            if (this.ignoreKeyboardInput) {
                this.ignoreKeyboardInput = false;
                return;
            }
            var dto = event.detail;
            var userInput = dto.dto.input;
            if (this.active) {
                var shouldFilter = dto.inputFieldActive;
                if (shouldFilter) {
                    // input field is active, so we should filter..
                    var dto_1 = event.detail.dto;
                    var inputValue = dto_1.input.getInputValue();
                    this.filterElementsFrom(inputValue);
                }
                else {
                    if (dto.keyCode == cf.Dictionary.keyCodes["left"]) {
                        this.columnIndex--;
                    }
                    else if (dto.keyCode == cf.Dictionary.keyCodes["right"]) {
                        this.columnIndex++;
                    }
                    else if (dto.keyCode == cf.Dictionary.keyCodes["down"]) {
                        this.updateRowIndex(1);
                    }
                    else if (dto.keyCode == cf.Dictionary.keyCodes["up"]) {
                        this.updateRowIndex(-1);
                    }
                    else if (dto.keyCode == cf.Dictionary.keyCodes["enter"] || dto.keyCode == cf.Dictionary.keyCodes["space"]) {
                        if (this.tableableRows[this.rowIndex] && this.tableableRows[this.rowIndex][this.columnIndex])
                            this.tableableRows[this.rowIndex][this.columnIndex].el.click();
                        else if (this.tableableRows[0] && this.tableableRows[0].length == 1)
                            // this is when only one element in a filter, then we click it!
                            this.tableableRows[0][0].el.click();
                    }
                    if (!this.validateRowColIndexes()) {
                        userInput.setFocusOnInput();
                    }
                }
            }
            if (!userInput.active && this.tableableRows && (this.rowIndex == 0 || this.rowIndex == 1)) {
                this.tableableRows[this.rowIndex][this.columnIndex].el.focus();
            }
        };
        ControlElements.prototype.validateRowColIndexes = function () {
            var maxRowIndex = (this.el.classList.contains("two-row") ? 1 : 0);
            if (this.tableableRows[this.rowIndex]) {
                // columnIndex is only valid if rowIndex is valid
                if (this.columnIndex < 0) {
                    this.columnIndex = this.tableableRows[this.rowIndex].length - 1;
                }
                if (this.columnIndex > this.tableableRows[this.rowIndex].length - 1) {
                    this.columnIndex = 0;
                }
                return true;
            }
            else {
                this.resetTabList();
                return false;
            }
        };
        ControlElements.prototype.updateRowIndex = function (direction) {
            var oldRowIndex = this.rowIndex;
            this.rowIndex += direction;
            // console.log("updateRowIndex:", this.tableableRows);
            if (this.tableableRows[this.rowIndex]) {
                // when row index is changed we need to find the closest column element, we cannot expect them to be indexly aligned
                var oldVector = this.tableableRows[oldRowIndex][this.columnIndex].positionVector;
                var items = this.tableableRows[this.rowIndex];
                var currentDistance = 10000000000000;
                for (var i = 0; i < items.length; i++) {
                    var element = items[i];
                    if (currentDistance > Math.abs(oldVector.centerX - element.positionVector.centerX)) {
                        currentDistance = Math.abs(oldVector.centerX - element.positionVector.centerX);
                        this.columnIndex = i;
                    }
                }
            }
        };
        ControlElements.prototype.resetTabList = function () {
            this.rowIndex = -1;
            this.columnIndex = -1;
        };
        ControlElements.prototype.onUserInputUpdate = function (event) {
            this.el.classList.remove("animate-in");
            this.infoElement.classList.remove("show");
            if (this.elements) {
                var elements = this.getElements();
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    element.animateOut();
                }
            }
        };
        ControlElements.prototype.filterElementsFrom = function (value) {
            var inputValuesLowerCase = value.toLowerCase().split(" ");
            if (inputValuesLowerCase.indexOf("") != -1)
                inputValuesLowerCase.splice(inputValuesLowerCase.indexOf(""), 1);
            var elements = this.getElements();
            if (elements.length > 1) {
                // the type is not strong with this one..
                var itemsVisible = [];
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    var elementVisibility = true;
                    // check for all words of input
                    for (var i_1 = 0; i_1 < inputValuesLowerCase.length; i_1++) {
                        var inputWord = inputValuesLowerCase[i_1];
                        if (elementVisibility) {
                            elementVisibility = element.value.toLowerCase().indexOf(inputWord) != -1;
                        }
                    }
                    // set element visibility.
                    element.visible = elementVisibility;
                    if (elementVisibility && element.visible)
                        itemsVisible.push(element);
                }
                // set feedback text for filter..
                this.infoElement.innerHTML = itemsVisible.length == 0 ? cf.Dictionary.get("input-no-filter").split("{input-value}").join(value) : "";
                if (itemsVisible.length == 0) {
                    this.infoElement.classList.add("show");
                }
                else {
                    this.infoElement.classList.remove("show");
                }
                // crude way of checking if list has changed...
                var hasListChanged = this.filterListNumberOfVisible != itemsVisible.length;
                if (hasListChanged) {
                    this.resize();
                    this.animateElementsIn();
                }
                this.filterListNumberOfVisible = itemsVisible.length;
            }
        };
        ControlElements.prototype.animateElementsIn = function () {
            var elements = this.getElements();
            if (elements.length > 0) {
                if (!this.el.classList.contains("animate-in"))
                    this.el.classList.add("animate-in");
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    element.animateIn();
                }
            }
        };
        ControlElements.prototype.getElements = function () {
            if (this.elements.length > 0 && this.elements[0].type == "OptionsList")
                return this.elements[0].elements;
            return this.elements;
        };
        /**
        * @name buildTabableRows
        * build the tabable array index
        */
        ControlElements.prototype.buildTabableRows = function () {
            this.tableableRows = [];
            this.resetTabList();
            var elements = this.getElements();
            if (this.el.classList.contains("two-row")) {
                // two rows
                this.tableableRows[0] = [];
                this.tableableRows[1] = [];
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    if (element.visible) {
                        // crude way of checking if element is top row or bottom row..
                        if (element.positionVector.y < 30)
                            this.tableableRows[0].push(element);
                        else
                            this.tableableRows[1].push(element);
                    }
                }
            }
            else {
                // single row
                this.tableableRows[0] = [];
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    if (element.visible)
                        this.tableableRows[0].push(element);
                }
            }
            // console.log("this.tableableRows created:", this.tableableRows)
        };
        ControlElements.prototype.focusFrom = function (angle) {
            if (!this.tableableRows)
                return;
            this.columnIndex = 0;
            if (angle == "bottom") {
                this.rowIndex = this.el.classList.contains("two-row") ? 1 : 0;
            }
            else if (angle == "top") {
                this.rowIndex = 0;
            }
            if (this.tableableRows[this.rowIndex] && this.tableableRows[this.rowIndex][this.columnIndex]) {
                this.ignoreKeyboardInput = true;
                this.tableableRows[this.rowIndex][this.columnIndex].el.focus();
            }
            else {
                this.resetTabList();
            }
            // console.log("focusFrom", angle, "this.rowIndex:", this.rowIndex);
        };
        ControlElements.prototype.setFocusOnElement = function (index) {
            var elements = this.getElements();
            if (this.tableableRows && index != -1) {
                this.tableableRows[0][0].el.focus();
            }
            else {
                this.rowIndex = 0;
            }
        };
        ControlElements.prototype.updateStateOnElements = function (controlElement) {
            this.list.classList.add("disabled");
            if (controlElement.type == "RadioButton") {
                // uncheck other radio buttons...
                var elements = this.getElements();
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    if (element != controlElement) {
                        element.checked = false;
                    }
                }
            }
        };
        ControlElements.prototype.reset = function () {
            this.el.classList.remove("one-row");
            this.el.classList.remove("two-row");
        };
        ControlElements.prototype.getElement = function (index) {
            return this.elements[index];
        };
        ControlElements.prototype.getDTO = function () {
            var dto = {
                text: undefined,
                controlElements: [],
            };
            // generate text value for ChatReponse
            if (this.elements && this.elements.length > 0) {
                switch (this.elements[0].type) {
                    case "CheckboxButton":
                        var values = [];
                        for (var i = 0; i < this.elements.length; i++) {
                            var element_1 = this.elements[i];
                            if (element_1.checked) {
                                values.push(element_1.value);
                            }
                            dto.controlElements.push(element_1);
                        }
                        dto.text = cf.Dictionary.parseAndGetMultiValueString(values);
                        break;
                    case "RadioButton":
                        for (var i = 0; i < this.elements.length; i++) {
                            var element_2 = this.elements[i];
                            if (element_2.checked) {
                                dto.text = element_2.value;
                            }
                            dto.controlElements.push(element_2);
                        }
                        break;
                    case "OptionsList":
                        var element = this.elements[0];
                        dto.controlElements = element.getValue();
                        var values = [];
                        if (dto.controlElements && dto.controlElements[0]) {
                            for (var i_2 = 0; i_2 < dto.controlElements.length; i_2++) {
                                var element_3 = dto.controlElements[i_2];
                                values.push(dto.controlElements[i_2].value);
                            }
                        }
                        // after value is created then set to all elements
                        dto.controlElements = element.elements;
                        dto.text = cf.Dictionary.parseAndGetMultiValueString(values);
                        break;
                    case "UploadFileUI":
                        dto.text = this.elements[0].value; //Dictionary.parseAndGetMultiValueString(values);
                        dto.controlElements.push(this.elements[0]);
                        break;
                }
            }
            return dto;
        };
        ControlElements.prototype.buildTags = function (tags) {
            var _this = this;
            this.list.classList.remove("disabled");
            var topList = this.el.parentNode.getElementsByTagName("ul")[0];
            var bottomList = this.el.parentNode.getElementsByTagName("ul")[1];
            // remove old elements
            if (this.elements) {
                while (this.elements.length > 0) {
                    this.elements.pop().dealloc();
                }
            }
            this.elements = [];
            for (var i = 0; i < tags.length; i++) {
                var tag = tags[i];
                switch (tag.type) {
                    case "radio":
                        this.elements.push(new cf.RadioButton({
                            referenceTag: tag
                        }));
                        break;
                    case "checkbox":
                        this.elements.push(new cf.CheckboxButton({
                            referenceTag: tag
                        }));
                        break;
                    case "select":
                        this.elements.push(new cf.OptionsList({
                            referenceTag: tag,
                            context: this.list,
                        }));
                        break;
                    case "input":
                    default:
                        if (tag.type == "file") {
                            this.elements.push(new cf.UploadFileUI({
                                referenceTag: tag,
                            }));
                        }
                        // nothing to add.
                        // console.log("UserInput buildControlElements:", "none Control UI type, only input field is needed.");
                        break;
                }
                if (tag.type != "select" && this.elements.length > 0) {
                    var element = this.elements[this.elements.length - 1];
                    this.list.appendChild(element.el);
                }
            }
            var isElementsOptionsList = this.elements[0] && this.elements[0].type == "OptionsList";
            if (isElementsOptionsList) {
                this.filterListNumberOfVisible = this.elements[0].elements.length;
            }
            else {
                this.filterListNumberOfVisible = tags.length;
            }
            new Promise(function (resolve, reject) { return _this.resize(resolve, reject); }).then(function () {
                // const h: number = this.el.classList.contains("one-row") ? 52 : this.el.classList.contains("two-row") ? 102 : 0;
                var listHeight = _this.el.offsetHeight;
                var h = _this.el.classList.contains("one-row") ? 52 : _this.el.classList.contains("two-row") ? listHeight : 0;
                var controlElementsAddedDTO = {
                    height: h,
                };
                cf.ConversationalForm.illustrateFlow(_this, "dispatch", cf.UserInputEvents.CONTROL_ELEMENTS_ADDED, controlElementsAddedDTO);
                document.dispatchEvent(new CustomEvent(cf.UserInputEvents.CONTROL_ELEMENTS_ADDED, {
                    detail: controlElementsAddedDTO
                }));
            });
        };
        ControlElements.prototype.resize = function (resolve, reject) {
            var _this = this;
            // scrollbar things
            // Element.offsetWidth - Element.clientWidth
            this.list.style.width = "100%";
            this.el.classList.remove("one-row");
            this.el.classList.remove("two-row");
            this.elementWidth = 0;
            setTimeout(function () {
                _this.listWidth = 0;
                var elements = _this.getElements();
                if (elements.length > 0) {
                    var listWidthValues = [];
                    var listWidthValues2 = [];
                    for (var i = 0; i < elements.length; i++) {
                        var element = elements[i];
                        if (element.visible) {
                            element.calcPosition();
                            _this.listWidth += element.positionVector.width;
                            listWidthValues.push(element.positionVector.x + element.positionVector.width);
                            listWidthValues2.push(element);
                        }
                    }
                    var elOffsetWidth_1 = _this.el.offsetWidth;
                    var isListWidthOverElementWidth_1 = _this.listWidth > elOffsetWidth_1;
                    if (isListWidthOverElementWidth_1) {
                        _this.el.classList.add("two-row");
                        _this.listWidth = Math.max(elOffsetWidth_1, Math.round((listWidthValues[Math.floor(listWidthValues.length / 2)]) + 50));
                        _this.list.style.width = _this.listWidth + "px";
                    }
                    else {
                        _this.el.classList.add("one-row");
                    }
                    setTimeout(function () {
                        // recalc after LIST classes has been added
                        for (var i = 0; i < elements.length; i++) {
                            var element = elements[i];
                            if (element.visible) {
                                element.calcPosition();
                            }
                        }
                        // check again after classes are set.
                        isListWidthOverElementWidth_1 = _this.listWidth > elOffsetWidth_1;
                        // sort the list so we can set tabIndex properly
                        var elementsCopyForSorting = elements.slice();
                        var tabIndexFilteredElements = elementsCopyForSorting.sort(function (a, b) {
                            return a.positionVector.x == b.positionVector.x ? 0 : a.positionVector.x < b.positionVector.x ? -1 : 1;
                        });
                        var tabIndex = 0;
                        for (var i = 0; i < tabIndexFilteredElements.length; i++) {
                            var element = tabIndexFilteredElements[i];
                            if (element.visible) {
                                //tabindex 1 are the UserInput element
                                element.tabIndex = 2 + (tabIndex++);
                            }
                            else {
                                element.tabIndex = -1;
                            }
                        }
                        // toggle nav button visiblity
                        cancelAnimationFrame(_this.rAF);
                        if (isListWidthOverElementWidth_1) {
                            _this.el.classList.remove("hide-nav-buttons");
                        }
                        else {
                            _this.el.classList.add("hide-nav-buttons");
                        }
                        _this.elementWidth = elOffsetWidth_1;
                        // resize scroll
                        _this.listScrollController.resize(_this.listWidth, _this.elementWidth);
                        _this.buildTabableRows();
                    }, 0);
                }
                if (resolve)
                    resolve();
            }, 0);
        };
        ControlElements.prototype.dealloc = function () {
            this.tableableRows = null;
            cancelAnimationFrame(this.rAF);
            this.rAF = null;
            this.el.removeEventListener('scroll', this.onScrollCallback, false);
            this.onScrollCallback = null;
            document.removeEventListener(cf.ControlElementEvents.ON_FOCUS, this.onElementFocusCallback, false);
            this.onElementFocusCallback = null;
            document.removeEventListener(cf.ChatResponseEvents.AI_QUESTION_ASKED, this.onChatAIReponseCallback, false);
            this.onChatAIReponseCallback = null;
            document.removeEventListener(cf.UserInputEvents.KEY_CHANGE, this.onUserInputKeyChangeCallback, false);
            this.onUserInputKeyChangeCallback = null;
            document.removeEventListener(cf.FlowEvents.USER_INPUT_UPDATE, this.userInputUpdateCallback, false);
            this.userInputUpdateCallback = null;
            this.listScrollController.dealloc();
        };
        return ControlElements;
    }());
    cf.ControlElements = ControlElements;
})(cf || (cf = {}));
