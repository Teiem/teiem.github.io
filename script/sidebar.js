let tabs = ["first", "second", "third"]

;


const sidebar = (() => {
    let isOpen = false;
    const sidebarNode = document.getElementById("sidebar");
    const openButtonNode = document.getElementById("openButton");
    const menuNode = document.getElementById("tabSelect");
    const leftArrowNode = document.getElementById("menuLeft")
    const rightArrowNode = document.getElementById("menuRight")
    const textareaNode = document.getElementById("notesTextarea");
    
    let leftBlocked = false;
    let rightBlocked = false;

    const tabbable = [textareaNode, menuNode]

    const open = () => {
        isOpen = true;
        sidebarNode.classList.add("openSidebar");

        if (!leftBlocked) leftArrowNode.tabIndex = 0;
        if (!rightBlocked) rightArrowNode.tabIndex = 0;

        tabbable.forEach(el => {
            el.tabIndex = 0;
        })
    };
    const close = () => {
        isOpen = false;
        sidebarNode.classList.remove("openSidebar");

        [...tabbable, leftArrowNode, rightArrowNode].forEach(el => {
            el.tabIndex = -1;
        })
    };
    const toggle = () => {
        isOpen ? close() : open();
    };

    const menu = (() => {
        let isOpen = false;
        let arrowNode = document.getElementById("arrow_down");

        const open = () => {
            if (!isOpen) {
                console.log("opend Select")
                isOpen = true;
                arrowNode.classList.add("arrowDown");
                _.unselectSelect(menuNode, close);
            }
        };
        const close = () => {
            isOpen = false;
            arrowNode.classList.remove("arrowDown");
        };

        const toggle = () => {
            isOpen ? close() : open();
        };

        const readSelect = () => {
            console.log("option Changed")
            notesStorage.load();
        };

        const addOptions = () => {
            let template = document.createElement("template");
            let HtmlString = ""

            tabs.forEach(name => {
                HtmlString += `
                <option>${name}</option>
                `;
            })

            template.innerHTML = HtmlString;
            document.getElementById("tabSelect").appendChild(template.content);
        }

        const selOption = (option) => {
            menuNode.value = option;
            manageArrowActive();
        };

        const selByIndex = (index) => {
			console.log("TCL: selByIndex -> index", index)
            index = Math.min(tabs.length, Math.max(index, 1));
			console.log("TCL: selByIndex -> index", index)
            selOption(tabs[index - 1]);
        };

        const getCurOption = () => menuNode.value;

        const selNext = (event) => {
			console.log("TCL: selPrev -> event", event)
            if (menuNode.selectedIndex + 1 < menuNode.length) {
                menuNode.selectedIndex += 1;
                manageArrowActive(event);
                notesStorage.load();
            }
        };

        const selPrev = (event) => {
            if (menuNode.selectedIndex > 0) {
                menuNode.selectedIndex -= 1;
                manageArrowActive(event);
                notesStorage.load();
            }
        };

        const addEnterNext = () => {
            _.makeEnterClickable([menuNode, leftArrowNode, rightArrowNode, openButtonNode])
        };

        const manageArrowActive = (event) => {
            console.trace(menuNode.selectedIndex, menuNode.length)

            const _activate = (_node) => {
                _node.tabIndex = 0;
                _node.style.pointerEvents = "initial";
                _node.style.opacity = 1;
            };
            const _deactivate = (_node) => {
                _node.tabIndex = -1;
                _node.style.pointerEvents = "none";
                _node.style.opacity = 0.125;
                
                if (event && !event.isTrusted) {
                    // what is the best way to get the event here or detect mouse clicks otherwise
                    setTimeout(() => {
                        menuNode.focus();
                    }, 1);
                }

            };

            if (menuNode.selectedIndex === 0) {
                _deactivate(leftArrowNode);
                leftBlocked = true;
            } else if (leftBlocked) {
                _activate(leftArrowNode);
                leftBlocked = false;
            }

            if (menuNode.selectedIndex + 1 === menuNode.length) {
                _deactivate(rightArrowNode);
                rightBlocked = true;
            } else if (rightBlocked) {
                _activate(rightArrowNode);
                rightBlocked = false;
            }
        };

        return {
            open,
            close,
            toggle,
            readSelect,
            addOptions,
            selOption,
            selByIndex,
            getCurOption,
            selNext,
            selPrev,
            addEnterNext,
            manageArrowActive,
        };
    })();

    const notesStorage = (() => {

        let _lastName = "";
        const load = (name) => {
            name = name || menu.getCurOption();
            if (name !== _lastName) {
                menu.selOption(name);
                textareaNode.value = localStorage.getItem(name);
            }
			console.log(name, "loaded");
 
        };
        
        const store = () => {
			console.log("stored")
            localStorage.setItem(menu.getCurOption(), textareaNode.value);
        };

        const storeOnBlur = () => {
            textareaNode.addEventListener("blur", () => store())
        };

        const add = (string) => {
            let curText = textareaNode.value;
            if (curText === "") {
                textareaNode.value += string;
            } else {
                textareaNode.value += "\n" + string;
            }
        };

        return {
            load,
            store,
            storeOnBlur,
            add,
        };
    })();

    return {
        open,
        close,
        toggle,
        menu,
        notesStorage,
    };
})();

// sidebar.open();