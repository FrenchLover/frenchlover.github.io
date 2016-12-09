/// <reference path="../form-tags/Tag.ts"/>
/// <reference path="../ConversationalForm.ts"/>
var cf;
(function (cf) {
    // interface
    cf.FlowEvents = {
        USER_INPUT_UPDATE: "cf-flow-user-input-update",
        USER_INPUT_INVALID: "cf-flow-user-input-invalid",
        //	detail: string
        FLOW_UPDATE: "cf-flow-update",
    };
    // class
    var FlowManager = (function () {
        function FlowManager(options) {
            this.maxSteps = 0;
            this.step = 0;
            this.stepTimer = 0;
            this.cuiReference = options.cuiReference;
            this.tags = options.tags;
            this.maxSteps = this.tags.length;
            this.userInputSubmitCallback = this.userInputSubmit.bind(this);
            document.addEventListener(cf.UserInputEvents.SUBMIT, this.userInputSubmitCallback, false);
        }
        Object.defineProperty(FlowManager.prototype, "currentTag", {
            get: function () {
                return this.tags[this.step];
            },
            enumerable: true,
            configurable: true
        });
        FlowManager.prototype.userInputSubmit = function (event) {
            var _this = this;
            cf.ConversationalForm.illustrateFlow(this, "receive", event.type, event.detail);
            var appDTO = event.detail;
            if (this.currentTag.setTagValueAndIsValid(appDTO)) {
                cf.ConversationalForm.illustrateFlow(this, "dispatch", cf.FlowEvents.USER_INPUT_UPDATE, appDTO);
                // update to latest DTO because values can be changed in validation flow...
                appDTO = appDTO.input.getFlowDTO();
                document.dispatchEvent(new CustomEvent(cf.FlowEvents.USER_INPUT_UPDATE, {
                    detail: appDTO //UserInput value
                }));
                // goto next step when user has answered
                setTimeout(function () { return _this.nextStep(); }, 250);
            }
            else {
                cf.ConversationalForm.illustrateFlow(this, "dispatch", cf.FlowEvents.USER_INPUT_INVALID, appDTO);
                // Value not valid
                document.dispatchEvent(new CustomEvent(cf.FlowEvents.USER_INPUT_INVALID, {
                    detail: appDTO //UserInput value
                }));
            }
        };
        FlowManager.prototype.start = function () {
            this.validateStepAndUpdate();
        };
        FlowManager.prototype.nextStep = function () {
            this.step++;
            this.validateStepAndUpdate();
        };
        FlowManager.prototype.previousStep = function () {
            this.step--;
            this.validateStepAndUpdate();
        };
        FlowManager.prototype.addStep = function () {
            // this can be used for when a Tags value is updated and new tags are presented
            // like dynamic tag insertion depending on an answer.. V2..
        };
        FlowManager.prototype.dealloc = function () {
            document.removeEventListener(cf.UserInputEvents.SUBMIT, this.userInputSubmitCallback, false);
            this.userInputSubmitCallback = null;
        };
        FlowManager.prototype.validateStepAndUpdate = function () {
            if (this.step == this.maxSteps) {
                // console.warn("We are at the end..., submit click")
                this.cuiReference.doSubmitForm();
            }
            else {
                this.step %= this.maxSteps;
                this.showStep();
            }
        };
        FlowManager.prototype.showStep = function () {
            cf.ConversationalForm.illustrateFlow(this, "dispatch", cf.FlowEvents.FLOW_UPDATE, this.currentTag);
            document.dispatchEvent(new CustomEvent(cf.FlowEvents.FLOW_UPDATE, {
                detail: this.currentTag
            }));
        };
        return FlowManager;
    }());
    FlowManager.STEP_TIME = 1000;
    cf.FlowManager = FlowManager;
})(cf || (cf = {}));
