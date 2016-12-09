/// <reference path="ui/UserInput.ts"/>
/// <reference path="ui/chat/ChatList.ts"/>
/// <reference path="logic/FlowManager.ts"/>
/// <reference path="form-tags/Tag.ts"/>
/// <reference path="form-tags/TagGroup.ts"/>
/// <reference path="form-tags/InputTag.ts"/>
/// <reference path="form-tags/SelectTag.ts"/>
/// <reference path="form-tags/ButtonTag.ts"/>
/// <reference path="data/Dictionary.ts"/>
var cf;
(function (cf) {
    var ConversationalForm = (function () {
        function ConversationalForm(options) {
            var _this = this;
            this.isDevelopment = false;
            if (!window.ConversationalForm)
                window.ConversationalForm = this;
            if (!options.formEl)
                throw new Error("Conversational Form error, the formEl needs to be defined.");
            this.formEl = options.formEl;
            this.submitCallback = options.submitCallback;
            if (this.formEl.getAttribute("cf-prevent-autofocus") == "")
                cf.UserInput.preventAutoFocus = true;
            console.log(cf.UserInput.preventAutoFocus, this.formEl, this.formEl.getAttribute("cf-prevent-autofocus"));
            //
            this.dictionary = new cf.Dictionary({
                data: options.dictionaryData,
                aiQuestions: options.dictionaryAI,
                userImage: options.userImage,
            });
            // emoji.. fork and set your own values..
            cf.Helpers.setEmojiLib();
            this.context = options.context ? options.context : document.body;
            this.tags = options.tags;
            setTimeout(function () { return _this.init(); }, 0);
        }
        ConversationalForm.prototype.init = function () {
            var developmentScriptTag = document.getElementById("conversational-form-development");
            if (!developmentScriptTag) {
                // not in development/test, so inject production css
                var head = document.head || document.getElementsByTagName("head")[0];
                var style = document.createElement("link");
                var githubMasterUrl = "http://assets.frenchlover.org/conversationalform/conversational-form.min.css";
                style.type = "text/css";
                style.media = "all";
                style.setAttribute("rel", "stylesheet");
                style.setAttribute("href", githubMasterUrl);
                head.appendChild(style);
            }
            else {
                // expect styles to be in the document
                this.isDevelopment = true;
            }
            // set context position to relative, else we break out of the box
            if (this.context.style.position != "fixed" && this.context.style.position != "absolute" && this.context.style.position != "relative") {
                this.context.style.position = "relative";
            }
            // if tags are not defined then we will try and build some tags our selves..
            if (!this.tags || this.tags.length == 0) {
                this.tags = [];
                var fields = [].slice.call(this.formEl.querySelectorAll("input, select, button"), 0);
                for (var i = 0; i < fields.length; i++) {
                    var element = fields[i];
                    if (cf.Tag.isTagValid(element)) {
                        // ignore hidden tags
                        this.tags.push(cf.Tag.createTag(element));
                    }
                }
            }
            else {
            }
            // remove invalid tags if they've sneaked in.. this could happen if tags are setup manually as we don't encurage to use static Tag.isTagValid
            var indexesToRemove = [];
            for (var i = 0; i < this.tags.length; i++) {
                var element = this.tags[i];
                if (!element || !cf.Tag.isTagValid(element.domElement)) {
                    indexesToRemove.push(element);
                }
            }
            for (var i = 0; i < indexesToRemove.length; i++) {
                var tag = indexesToRemove[i];
                this.tags.splice(this.tags.indexOf(tag), 1);
            }
            //let's start the conversation
            this.setupTagGroups();
            this.setupUI();
            return this;
        };
        ConversationalForm.prototype.setupTagGroups = function () {
            // make groups, from input tag[type=radio | type=checkbox]
            // groups are used to bind logic like radio-button or checkbox dependencies
            var groups = [];
            for (var i = 0; i < this.tags.length; i++) {
                var tag = this.tags[i];
                if (tag.type == "radio" || tag.type == "checkbox") {
                    if (!groups[tag.name])
                        groups[tag.name] = [];
                    groups[tag.name].push(tag);
                }
            }
            if (Object.keys(groups).length > 0) {
                for (var group in groups) {
                    if (groups[group].length > 0) {
                        // always build groupd when radio or checkbox
                        var tagGroup = new cf.TagGroup({
                            elements: groups[group]
                        });
                        // remove the tags as they are now apart of a group
                        for (var i = 0; i < groups[group].length; i++) {
                            var tagToBeRemoved = groups[group][i];
                            if (i == 0)
                                this.tags.splice(this.tags.indexOf(tagToBeRemoved), 1, tagGroup);
                            else
                                this.tags.splice(this.tags.indexOf(tagToBeRemoved), 1);
                        }
                    }
                }
            }
        };
        ConversationalForm.prototype.setupUI = function () {
            var _this = this;
            console.log('Conversational Form > start > mapped DOM tags:', this.tags);
            console.log('----------------------------------------------');
            // start the flow
            this.flowManager = new cf.FlowManager({
                cuiReference: this,
                tags: this.tags,
            });
            this.el = document.createElement("div");
            this.el.id = "conversational-form";
            this.el.className = "conversational-form";
            this.context.appendChild(this.el);
            // Conversational Form UI
            this.chatList = new cf.ChatList({});
            this.el.appendChild(this.chatList.el);
            this.userInput = new cf.UserInput({});
            this.el.appendChild(this.userInput.el);
            setTimeout(function () {
                _this.el.classList.add("conversational-form--show");
                _this.flowManager.start();
            }, 0);
            // s10context.addEventListener('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
            // 	e.preventDefault();
            // 	e.stopPropagation();
            // 	console.log(e);
            // })
        };
        ConversationalForm.prototype.doSubmitForm = function () {
            if (this.submitCallback) {
                this.submitCallback();
            }
            else {
                this.formEl.submit();
                this.remove();
            }
        };
        ConversationalForm.prototype.remove = function () {
            this.userInput.dealloc();
            this.chatList.dealloc();
            this.userInput = null;
            this.chatList = null;
            console.log(this, 'remove() Conversational Form');
        };
        ConversationalForm.illustrateFlow = function (classRef, type, eventType, detail) {
            // ConversationalForm.illustrateFlow(this, "dispatch", FlowEvents.USER_INPUT_INVALID, event.detail);
            // ConversationalForm.illustrateFlow(this, "receive", event.type, event.detail);
            if (detail === void 0) { detail = null; }
            if (ConversationalForm.ILLUSTRATE_APP_FLOW && navigator.appName != 'Netscape') {
                var highlight = "font-weight: 900; background: pink; color: black; padding: 0px 5px;";
                console.log("%c** event flow: %c" + eventType + "%c flow type: %c" + type + "%c from: %c" + classRef.constructor.name, "font-weight: 900;", highlight, "font-weight: 400;", highlight, "font-weight: 400;", highlight);
                if (detail)
                    console.log("** event flow detail:", detail);
            }
        };
        return ConversationalForm;
    }());
    // to illustrate the event flow of the app
    ConversationalForm.ILLUSTRATE_APP_FLOW = true;
    cf.ConversationalForm = ConversationalForm;
})(cf || (cf = {}));
// check for a form element with attribute:
window.addEventListener("load", function () {
    var formEl = document.querySelector("form[cf-form-element]");
    var contextEl = document.querySelector("*[cf-context]");
    if (formEl) {
        window.ConversationalForm = new cf.ConversationalForm({
            formEl: formEl,
            context: contextEl
        });
    }
}, false);
