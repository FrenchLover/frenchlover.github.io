// namespace
var cf;
(function (cf) {
    // class
    var Dictionary = (function () {
        function Dictionary(options) {
            // can be overwritten
            this.data = {
                "user-image": "http://assets.frenchlover.org/conversationalform/human.png",
                "entry-not-found": "Dictionary item not found.",
                "input-placeholder": "Type your answer here ...",
                "input-placeholder-error": "Your input is not correct ...",
                "input-placeholder-file-error": "File upload failed ...",
                "input-placeholder-file-size-error": "File size too big ...",
                "input-no-filter": "No results found for <strong>{input-value}</strong>",
                "user-reponse-and": " and ",
                "user-reponse-missing": "Missing input ...",
                "general": "General type1|General type2",
                "icon-type-file": "<svg class='cf-icon-file' viewBox='0 0 10 14' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g transform='translate(-756.000000, -549.000000)' fill='#0D83FF'><g transform='translate(736.000000, 127.000000)'><g transform='translate(0.000000, 406.000000)'><polygon points='20 16 26.0030799 16 30 19.99994 30 30 20 30'></polygon></g></g></g></g></svg>",
            };
            // can be overwriten
            this.AIQuestions = {
                "robot": {
                    "thumb": "http://assets.frenchlover.org/conversationalform/robot.png",
                    "text": "Please write some text.",
                    "name": "What's your name?",
                    "email": "Need your e-mail.",
                    "password": "Please provide password",
                    "tel": "What's your phone number?",
                    "radio": "I need you to select one of these.",
                    "checkbox": "Select as many as you want.",
                    "select": "Choose any of these options.",
                    "general": "General1|General2|General3..",
                },
                "sonny": {
                    "thumb": "data:image/jpeg;charset=utf-8;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAyAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpDNzJDM0VGRDkzREQxMUU2QUYxQzg3RUY5REZFRTA3QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpDNzJDM0VGRTkzREQxMUU2QUYxQzg3RUY5REZFRTA3QiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkM3MkMzRUZCOTNERDExRTZBRjFDODdFRjlERkVFMDdCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkM3MkMzRUZDOTNERDExRTZBRjFDODdFRjlERkVFMDdCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQACAYGBgYGCAYGCAwIBwgM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",
                    "text": "Gimme some text.",
                    "name": "I am wondering wht your name is..?",
                    "email": "Need your e-mail.",
                    "password": "What's your password?",
                    "tel": "What's your phone number? Promise not to exploit it.",
                    "radio": "I need you to select one of these.",
                    "checkbox": "Select as many as you want.",
                    "select": "Choose any of the options.",
                    "general": "General1|General2|General3..",
                },
            };
            Dictionary.instance = this;
            // overwrite data if defined
            if (options && options.data)
                this.data = this.validateAndSetNewData(options.data, this.data);
            // overwrite user image
            if (options.userImage)
                this.data["user-image"] = options.userImage;
            // overwrite ai questions if defined
            if (options && options.aiQuestions)
                this.AIQuestions[Dictionary.AIType] = this.validateAndSetNewData(options.aiQuestions, this.AIQuestions[Dictionary.AIType]);
        }
        Dictionary.get = function (id) {
            var ins = Dictionary.instance;
            var value = ins.data[id];
            if (!value) {
                value = ins.data["entry-not-found"];
            }
            else {
                var values = value.split("|");
                value = values[Math.floor(Math.random() * values.length)];
            }
            return value;
        };
        Dictionary.getAIResponse = function (tagType) {
            var ins = Dictionary.instance;
            var value = ins.AIQuestions[Dictionary.AIType][tagType];
            if (!value) {
                // value not found, so pick a general one
                var generals = ins.AIQuestions[Dictionary.AIType]["general"].split("|");
                value = generals[Math.floor(Math.random() * generals.length)];
            }
            else {
                var values = value.split("|");
                value = values[Math.floor(Math.random() * values.length)];
            }
            return value;
        };
        Dictionary.parseAndGetMultiValueString = function (arr) {
            var value = "";
            for (var i = 0; i < arr.length; i++) {
                var str = arr[i];
                var sym = (arr.length > 1 && i == arr.length - 2 ? Dictionary.get("user-reponse-and") : ", ");
                value += str + (i < arr.length - 1 ? sym : "");
            }
            return value;
        };
        Dictionary.prototype.validateAndSetNewData = function (newData, originalDataObject) {
            for (var key in originalDataObject) {
                if (!newData[key]) {
                    console.warn("Conversational Form Dictionary warning, '" + key + "' value is undefined, mapping '" + key + "' to default value. See Dictionary.ts for keys.");
                    newData[key] = originalDataObject[key];
                }
            }
            return newData;
        };
        return Dictionary;
    }());
    Dictionary.keyCodes = {
        "left": 37,
        "right": 39,
        "down": 40,
        "up": 38,
        "enter": 13,
        "space": 32,
        "shift": 16,
        "tab": 9,
    };
    // default...
    Dictionary.AIType = "robot";
    cf.Dictionary = Dictionary;
})(cf || (cf = {}));
