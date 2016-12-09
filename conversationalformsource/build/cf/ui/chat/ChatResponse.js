/// <reference path="../BasicElement.ts"/>
/// <reference path="../../logic/Helpers.ts"/>
/// <reference path="../../ConversationalForm.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// namespace
var cf;
(function (cf) {
    cf.ChatResponseEvents = {
        AI_QUESTION_ASKED: "cf-on-ai-asked-question"
    };
    // class
    var ChatResponse = (function (_super) {
        __extends(ChatResponse, _super);
        function ChatResponse(options) {
            var _this = _super.call(this, options) || this;
            _this.tag = options.tag;
            return _this;
        }
        Object.defineProperty(ChatResponse.prototype, "visible", {
            set: function (value) {
                if (value) {
                    this.el.classList.add("show");
                }
                else {
                    this.el.classList.remove("show");
                }
            },
            enumerable: true,
            configurable: true
        });
        ChatResponse.prototype.setValue = function (dto) {
            if (dto === void 0) { dto = null; }
            this.response = dto ? dto.text : "";
            this.processResponse();
            var text = this.el.getElementsByTagName("text")[0];
            if (!this.response || this.response.length == 0) {
                text.setAttribute("thinking", "");
            }
            else {
                text.innerHTML = this.response;
                text.setAttribute("value-added", "");
                text.removeAttribute("thinking");
                // check for if reponse type is file upload...
                if (dto.controlElements && dto.controlElements[0]) {
                    switch (dto.controlElements[0].type) {
                        case "UploadFileUI":
                            text.classList.add("file-icon");
                            var icon = document.createElement("span");
                            icon.innerHTML = cf.Dictionary.get("icon-type-file");
                            text.insertBefore(icon.children[0], text.firstChild);
                            break;
                    }
                }
                if (!this.visible) {
                    this.visible = true;
                }
                if (this.isAIReponse) {
                    // AI Reponse ready to ask question.
                    cf.ConversationalForm.illustrateFlow(this, "dispatch", cf.ChatResponseEvents.AI_QUESTION_ASKED, this.response);
                    document.dispatchEvent(new CustomEvent(cf.ChatResponseEvents.AI_QUESTION_ASKED, {
                        detail: this
                    }));
                }
            }
        };
        ChatResponse.prototype.processResponse = function () {
            this.response = cf.Helpers.emojify(this.response);
            if (this.tag.type == "password" && !this.isAIReponse) {
                var newStr = "";
                for (var i = 0; i < this.response.length; i++) {
                    newStr += "*";
                }
                this.response = newStr;
            }
        };
        ChatResponse.prototype.setData = function (options) {
            var _this = this;
            this.image = options.image;
            this.response = "";
            this.isAIReponse = options.isAIReponse;
            _super.prototype.setData.call(this, options);
            setTimeout(function () {
                _this.visible = _this.isAIReponse || (_this.response && _this.response.length > 0);
                _this.setValue();
                if (_this.isAIReponse) {
                    // AI is pseudo thinking
                    setTimeout(function () { return _this.setValue({ text: options.response }); }, cf.Helpers.lerp(Math.random(), 500, 900));
                }
                else {
                    // show the 3 dots automatically
                    setTimeout(function () { return _this.el.classList.add("peak-thumb"); }, 1400);
                }
            }, 0);
        };
        // template, can be overwritten ...
        ChatResponse.prototype.getTemplate = function () {
            return "<cf-chat-response>\n\t\t\t\t<thumb style=\"background-image: url(" + this.image + ")\"></thumb>\n\t\t\t\t<text>" + (!this.response ? "<thinking><span>.</span><span>.</span><span>.</span></thinking>" : this.response) + "</text>\n\t\t\t</cf-chat-response>";
        };
        return ChatResponse;
    }(cf.BasicElement));
    cf.ChatResponse = ChatResponse;
})(cf || (cf = {}));
