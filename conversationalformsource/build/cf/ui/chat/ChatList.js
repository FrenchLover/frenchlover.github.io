/// <reference path="ChatResponse.ts"/>
/// <reference path="../BasicElement.ts"/>
/// <reference path="../../logic/FlowManager.ts"/>
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
    var ChatList = (function (_super) {
        __extends(ChatList, _super);
        function ChatList(options) {
            var _this = _super.call(this, options) || this;
            // flow update
            _this.flowUpdateCallback = _this.onFlowUpdate.bind(_this);
            document.addEventListener(cf.FlowEvents.FLOW_UPDATE, _this.flowUpdateCallback, false);
            // user input update
            _this.userInputUpdateCallback = _this.onUserInputUpdate.bind(_this);
            document.addEventListener(cf.FlowEvents.USER_INPUT_UPDATE, _this.userInputUpdateCallback, false);
            // user input key change
            _this.onInputKeyChangeCallback = _this.onInputKeyChange.bind(_this);
            document.addEventListener(cf.UserInputEvents.KEY_CHANGE, _this.onInputKeyChangeCallback, false);
            // user input key change
            _this.onControlElementsAddedToUserInputCallback = _this.onControlElementsAddedToUserInput.bind(_this);
            document.addEventListener(cf.UserInputEvents.CONTROL_ELEMENTS_ADDED, _this.onControlElementsAddedToUserInputCallback, false);
            return _this;
        }
        ChatList.prototype.onControlElementsAddedToUserInput = function (event) {
            var dto = event.detail;
            var paddingBottom = 30; // this to allow for the [thinking]... height
            this.el.style.paddingBottom = (dto.height + paddingBottom) + "px";
        };
        ChatList.prototype.onInputKeyChange = function (event) {
            var dto = event.detail.dto;
            cf.ConversationalForm.illustrateFlow(this, "receive", event.type, dto);
            if (this.currentResponse) {
                var inputFieldStr = dto.text || dto.input.getInputValue();
                if (!inputFieldStr || inputFieldStr.length == 0) {
                    this.currentResponse.visible = false;
                }
                else {
                    if (!this.currentResponse.visible)
                        this.currentResponse.visible = true;
                }
            }
        };
        ChatList.prototype.onUserInputUpdate = function (event) {
            cf.ConversationalForm.illustrateFlow(this, "receive", event.type, event.detail);
            if (this.currentResponse) {
                var response = event.detail;
                this.flowDTOFromUserInputUpdate = response;
            }
            else {
                // this should never happen..
                throw new Error("No current response ..?");
            }
        };
        ChatList.prototype.onFlowUpdate = function (event) {
            cf.ConversationalForm.illustrateFlow(this, "receive", event.type, event.detail);
            var currentTag = event.detail;
            if (this.flowDTOFromUserInputUpdate) {
                // validate text..
                if (!this.flowDTOFromUserInputUpdate.text)
                    this.flowDTOFromUserInputUpdate.text = cf.Dictionary.get("user-reponse-missing");
                this.currentResponse.setValue(this.flowDTOFromUserInputUpdate);
            }
            // AI response
            var aiThumb = cf.Dictionary.getAIResponse("thumb");
            var aiReponse = "";
            aiReponse = currentTag.question;
            // one way data binding values:
            if (this.flowDTOFromUserInputUpdate) {
                // previous answer..
                aiReponse = aiReponse.split("{previous-answer}").join(this.flowDTOFromUserInputUpdate.text);
            }
            this.createResponse(true, currentTag, aiReponse, aiThumb);
            // user reponse, create the waiting response
            this.createResponse(false, currentTag);
        };
        ChatList.prototype.createResponse = function (isAIReponse, currentTag, value, image) {
            if (value === void 0) { value = null; }
            if (image === void 0) { image = cf.Dictionary.get("user-image"); }
            this.currentResponse = new cf.ChatResponse({
                // image: null,
                tag: currentTag,
                isAIReponse: isAIReponse,
                response: value,
                image: image,
            });
            this.el.appendChild(this.currentResponse.el);
            // this.el.scrollTop = 1000000000;
        };
        ChatList.prototype.getTemplate = function () {
            return "<cf-chat type='pluto'>\n\t\t\t\t\t</cf-chat>";
        };
        ChatList.prototype.dealloc = function () {
            document.removeEventListener(cf.FlowEvents.FLOW_UPDATE, this.flowUpdateCallback, false);
            this.flowUpdateCallback = null;
            document.removeEventListener(cf.FlowEvents.USER_INPUT_UPDATE, this.userInputUpdateCallback, false);
            this.userInputUpdateCallback = null;
            document.removeEventListener(cf.UserInputEvents.KEY_CHANGE, this.onInputKeyChangeCallback, false);
            this.onInputKeyChangeCallback = null;
            document.removeEventListener(cf.UserInputEvents.CONTROL_ELEMENTS_ADDED, this.onControlElementsAddedToUserInputCallback, false);
            this.onControlElementsAddedToUserInputCallback = null;
            _super.prototype.dealloc.call(this);
        };
        return ChatList;
    }(cf.BasicElement));
    cf.ChatList = ChatList;
})(cf || (cf = {}));
