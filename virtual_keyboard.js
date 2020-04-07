const enKeyLayout = [
    "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0","-","=", "backspace",
    "tab","q", "w", "e", "r", "t", "y", "u", "i", "o", "p","[","]","\\",
    "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l",";","'", "enter",
    "/","z", "x", "c", "v", "b", "n", "m", ",", ".", "/","keyboard_arrow_up","shift",
    "control","option","command","space","command","option","keyboard_arrow_left","keyboard_arrow_down","keyboard_arrow_right"
];
const ruKeyLayout = [
    "ё", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")","_","+", "backspace",
    "tab","й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з","х","ъ","|",
    "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д","ж","э", "enter",
    "/","я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".","keyboard_arrow_up","shift",
    "control","option","command","space","command","option","keyboard_arrow_left","keyboard_arrow_down","keyboard_arrow_right"
];

const keyIndexes = [
    "223", "49", "50", "51", "52", "53", "53", "55", "56", "57", "48","189","187", "8",
    "9","81", "87", "69", "82", "84", "89", "85", "73", "79", "80","219","221","220",
    "20", "65", "83", "68", "70", "71", "72", "74", "75", "76","186","222", "13",
    "16","90", "88", "67", "86", "66", "78", "77", "188", "190", "191","38","16",
    "17","18","91","32","93","18","37","40","39"
];
const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        text: null,
        keys: []
    },


    properties: {
        capsLock: false,
        language: enKeyLayout
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");
        this.elements.text = document.createElement("p");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);
        document.body.appendChild(this.elements.text);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
        var area = document.getElementById("textarea");
        
        this._tabInit(area);

        area.addEventListener("keydown", function(e) {
            const elem = document.getElementById(e.keyCode.toString());
            elem.classList.add("keyboard--pressed");
        });

        area.addEventListener("keyup", function(e) {
            const elem = document.getElementById(e.keyCode.toString());
            elem.classList.remove("keyboard--pressed");
        });

        area.addEventListener("keydown", (e) => {
            if (e.metaKey && e.keyCode === 91 ) {
                this.properties.language = this.properties.language === enKeyLayout 
                    ? ruKeyLayout
                    : enKeyLayout;
                    
                for (let i = 0; i < keyIndexes.length; ++i) {
                    const elem = document.getElementById(`${keyIndexes[i]}`);

                    if (elem.classList.contains("plain--key")){
                        elem.textContent = (this.properties.capsLock 
                            ? this.properties.language[i].toUpperCase() 
                            : this.properties.language[i].toLowerCase())
                    }
                }
            }
        });
    },

    _tabInit(area){
        area.addEventListener("keydown", function(e) {
            if(e.keyCode === 9) {
                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;
        
                var target = e.target;
                var value = target.value;
        
                target.value = value.substring(0, start)
                            + "\t"
                            + value.substring(end);
        
                this.selectionStart = this.selectionEnd = start + 1;

            }
        },false)
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        for (let i = 0; i < keyIndexes.length; ++i){
            const key = enKeyLayout[i];
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "\\","enter", "shift"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.setAttribute("id", keyIndexes[i]);
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        const area = document.getElementById("textarea");
                        const start = area.selectionStart;
                        const end = area.selectionEnd;
                        if (start === end) {
                            if (start > 0) {
                                area.value = area.value.substring(0, start - 1) + area.value.substring(start);
                                area.focus();
                                area.selectionEnd = area.selectionStart = start - 1;

                            }
                        } else {
                            area.value = area.value.substring(0, start) + area.value.substring(end);
                            area.focus();
                            area.selectionStart = start;
                            area.selectionEnd = start;
                        }
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                        document.getElementById("textarea").focus();
                    });
                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        const area = document.getElementById("textarea");
                        const start = area.selectionStart;
                        const end = area.selectionEnd;
                        area.value = area.value.substring(0, start)
                                    + "\n"
                                    + area.value.substring(end);
                        area.focus();
                        area.selectionStart = area.selectionEnd = start + 1;
                    });
                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        const area = document.getElementById("textarea");
                        const start = area.selectionStart;
                        const end = area.selectionEnd;
                        area.value = area.value.substring(0, start)
                                    + " "
                                    + area.value.substring(end);
                        area.focus();
                        area.selectionStart = area.selectionEnd = start + 1;
                    });
                    break;

                // case "done":
                //     keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                //     keyElement.innerHTML = createIconHTML("check_circle");

                //     keyElement.addEventListener("click", () => {
                //         this.close();
                //         document.getElementById("textarea").focus();
                //     });
                //     break;

                case "keyboard_arrow_up":
                    keyElement.classList.add("keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_up");

                    keyElement.addEventListener("click", () => this._arrowUp(document.getElementById("textarea")));
    
                    break;
                
                case "keyboard_arrow_down":
                    keyElement.classList.add("keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_down");

                    keyElement.addEventListener("click", () => this._arrowDown(document.getElementById("textarea")));
        
                    break;
                    
                case "keyboard_arrow_right":
                    keyElement.classList.add("keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_right");

                    keyElement.addEventListener("click", () => this._arrowRight(document.getElementById("textarea")));
                    break;
                
                case "keyboard_arrow_left":
                    keyElement.classList.add("keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_left");

                    keyElement.addEventListener("click", () => this._arrowLeft(document.getElementById("textarea")));
                    break;
                
                case "tab":
                    keyElement.classList.add("keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("keyboard_tab");
                    keyElement.addEventListener("click", () => this._vitrualTab(document.getElementById("textarea")));

                    break;
                default:
                    keyElement.textContent = key.toLowerCase();
                    keyElement.classList.add("plain--key");

                    keyElement.addEventListener("click", () => {
                        const area = document.getElementById("textarea");
                        const start = area.selectionStart;
                        const end = area.selectionEnd;
                        area.value = area.value.substring(0, start)
                                    + (this.properties.capsLock ? keyElement.textContent.toUpperCase() : keyElement.textContent.toLowerCase())
                                    + area.value.substring(end);
                        area.focus();
                        area.selectionStart = area.selectionEnd = start + 1;
                    });
                    break;

            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        }

        return fragment;
    },
    
    _arrowUp(area) {
        var pos = area.selectionEnd,
            prevLine = area.value.lastIndexOf('\n', pos),
            TwoBLine = area.value.lastIndexOf('\n', prevLine - 1);
        if (prevLine === -1) return;
        pos = pos - prevLine;
        area.focus();
        area.selectionStart = area.selectionEnd = TwoBLine + pos;
    },


    _arrowDown(area) {
        var pos = area.selectionEnd,
            prevLine = area.value.lastIndexOf('\n', pos),
            nextLine = area.value.indexOf('\n', pos + 1);
        if (nextLine === -1) return;
        pos = pos - prevLine;
        area.focus();
        area.selectionStart = area.selectionEnd = nextLine + pos;
    },


    _arrowLeft(area) {
        area.focus();
        area.selectionStart = area.selectionEnd -= 1;
    },
    
    _arrowRight(area) {
        area.focus();
        area.selectionStart = area.selectionEnd += 1;
    },
    
    _vitrualTab(area){
            const start = area.selectionStart;
            const end = area.selectionEnd;
            area.value = area.value.substring(0, start)
                        + "\t"
                        + area.value.substring(end);
            area.focus();
            area.selectionStart = area.selectionEnd = start + 1;
    },


    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.elements.main.classList.add("keyboard--hidden");
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});
