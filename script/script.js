const settings = {
    extraWeather: true,
    srm: 0.5,
}

let meta = {
    isFull: true,
}

const Stripes = [{
        main: {
            name: "Reddit",
            color: "#223349",
            href: "https://reddit.com/r/all",
        },
        content: [
            ["r/Startpages", "https://reddit.com/r/startpages"],
            ["r/Linux", "https://reddit.com/r/linux"],
            ["r/Linux_Gaming", "https://reddit.com/r/linux_gaming"],
        ]
    },
    {
        main: {
            name: "Youtube",
            color: "#1A2832",
            href: "https://youtube.com",
        },
        content: [
            ["LinusTechTips", "https://youtube.com/users/LinusTechTips"],
            ["some oter Link", "/"],
            ["mooore...", "/"],
        ]
    },
    {
        main: {
            name: "Youtube2",
            color: "#1C323B",
            href: "https://youtube.com",
        },
        content: [
            ["LinusTechTips", "https://youtube.com/users/LinusTechTips"],
            ["some oter Link", "/"],
            ["mooore...", "/"],
        ]
    },
    {
        main: {
            name: "Youtube3",
            color: "#1D3F43",
            href: "https://youtube.com",
        },
        content: [
            ["LinusTechTips", "https://youtube.com/users/LinusTechTips"],
            ["some oter Link", "/"],
            ["o", "/"],
        ]
    }
]

const NoteTabs = [
    "First",
    "Second",
    "Third",
]

const createStripe = (obj) => {
    let template = document.createElement("template");
    let HtmlString = `
    <div class="stripe" id="SpeedId4">
        <div class="approx"></div>
        <div class="stripeBody transition" style="background-color:${obj.main.color}">
            <a href="${obj.main.href}">
                <div class="title">
                    <div>${obj.main.name}</div>
                </div>
            </a>
            <div class="content">`

    obj.content.forEach(el => {
        HtmlString += `
                <span class="buttonStripe">
                    <a href="${el[1]}">${el[0]}</a>
                </span>
                `
    });
    `
            </div>
        </div>
    </div>`

    template.innerHTML = HtmlString;
    return template.content;
};

const renderStripes = () => {
    let parent = document.getElementById("stripes");

    Stripes.forEach(stripe => {
        parent.appendChild(createStripe(stripe))
    })
};

const addApprox = () => {
    let approxs = Array.from(document.getElementsByClassName("approx"));

    approxs.forEach(approx => {
        let stripeBody = approx.parentNode.children[1];

        const setWidth = (e) => {
            stripeBody.style.width = 40 / ((e.x - 40 - _.getMainMargin()) / (_.getAdjustW(window.innerWidth) * 0.15)) * settings.srm + (40 - 40 * settings.srm) + "px";
            //40/((e.x - 40 - bodyOffsetLeft) / (window.innerWidth * 0.15)) + "px"; once weather
        };

        approx.addEventListener("mouseenter", (e) => {
            let mouseOverApprox = true;
            const delay = -(e.x - 40 - window.innerWidth * 0.15) * 2

            setTimeout(() => {
                mouseOverApprox && stripeBody.classList.remove("transition");
            }, delay);

            approx.addEventListener("mousemove", setWidth);

            _.evtlOnce(approx, "mouseleave", () => {
                mouseOverApprox = false;
                approx.removeEventListener("mousemove", setWidth);
                stripeBody.classList.add("transition");
                stripeBody.style.width = "";
            })

        });
    })
};

((window, document) => {

    var prefix = "",
        _addEventListener, support;

    // detect event model
    if (window.addEventListener) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }

    // detect available wheel event
    support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
        document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
        "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

    window.addWheelListener = (elem, callback, useCapture) => {
        _addWheelListener(elem, support, callback, useCapture);

        // handle MozMousePixelScroll in older Firefox
        if (support == "DOMMouseScroll") {
            _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
        }
    };

    const _addWheelListener = (elem, eventName, callback, useCapture) => {
        elem[_addEventListener](prefix + eventName, support == "wheel" ? callback : function (originalEvent) {
            !originalEvent && (originalEvent = window.event);

            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                deltaZ: 0,
                preventDefault: function () {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                }
            };

            // calculate deltaY (and deltaX) according to the event
            if (support == "mousewheel") {
                event.deltaY = -1 / 40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
            } else {
                event.deltaY = originalEvent.detail;
            }

            // it's time to fire the callback
            return callback(event);

        }, useCapture || false);
    }

})(window, document);

(() => {

    const mainBody = document.getElementById("mainBody");
    const weatherWiget = document.getElementById("weatherWiget");

    const Up = () => {
        meta.isFull = false;
        mainBody.classList.add("open")
        weatherWiget.classList.add("lowerIcons")
    };

    const Down = () => {
        meta.isFull = true;
        mainBody.classList.remove("open")
        weatherWiget.classList.remove("lowerIcons")
    };

    addWheelListener(document, function (e) {
        if (document.getElementById("menu_Wrap").matches(":hover")) {
            e.deltaY < 0 ? sidebar.menu.selPrev() : sidebar.menu.selNext();
            e.preventDefault();
        } else {
            e.deltaY < 0 ? Down() : Up();
            e.preventDefault();
        }
    });

})()

const _ = (() => {
    const evtlOnce = (obj, eventType, callback, cancel = false) => {
        const _remove = (event) => {
            callback();
            obj.removeEventListener(event, _remove)
            if (cancel) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
        obj.addEventListener(eventType, _remove)
    };

    const unselectSelect = (obj, callback) => {
        const _removeAndCallback = () => {
            console.log("evtl removed");

            callback();
            obj.removeEventListener("click", _removeAndCallback);
            obj.removeEventListener("blur", _removeAndCallback);
            obj.removeEventListener("keyup", _keyIsEsc);
        };

        const _keyIsEsc = (e) => {
            if (e.keyCode === 27) {
                _removeAndCallback();
            }
        };
        obj.addEventListener("click", _removeAndCallback);
        obj.addEventListener("blur", _removeAndCallback);
        obj.addEventListener("keyup", _keyIsEsc);
    };

    const makeEnterClickable = (objs) => {
        objs.forEach(el => {
            el.addEventListener("keydown", event => {
                event.keyCode === 13 && event.target.click();
                event.keyCode === 27 && event.target.blur();
            });
        })
    };

    const blurAfterClick = (obj, event) => {
        if (event.isTrusted) {
            obj.blur()
        }

    };

    const addToClipboard = (text) => {
        console.log("Creating Textarea to copy")
        const el = document.createElement('textarea');
        el.value = text;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    const createWeatherHTML = (weatherType, discription = "") => {
        console.log('adding icon for ', weatherType)
        let template = document.createElement("template");
        let HTMLString = "";

        switch (weatherType.toLowerCase()) {
            case "sun-shower":
                HTMLString += `
                    <div class="icon sun-shower">
                      <div class="cloud"></div>
                      <div class="sun">
                        <div class="rays"></div>
                      </div>
                      <div class="rain"></div>
                    </div>
                `;
                break;

            case "thunder-storm":
                HTMLString += `
                      <div class="icon thunder-storm">
                      <div class="cloud"></div>
                      <div class="lightning">
                        <div class="bolt"></div>
                        <div class="bolt"></div>
                      </div>
                    </div>
                `;
                break;

            case "clouds":
                HTMLString += `
                    <div class="icon cloudy">
                      <div class="cloud"></div>
                      <div class="cloud"></div>
                    </div>
                `;
                break;

            case "flurries":
                HTMLString += `
                    <div class="icon flurries">
                      <div class="cloud"></div>
                      <div class="snow">
                        <div class="flake"></div>
                        <div class="flake"></div>
                      </div>
                    </div>
                `;
                break;

            case "clear":
                HTMLString += `
                    <div class="icon sunny">
                      <div class="sun">
                        <div class="rays"></div>
                      </div>
                    </div>
                `;
                break;

            case "rain":
                HTMLString += `
                    <div class="icon rainy">
                      <div class="cloud"></div>
                      <div class="rain"></div>
                    </div>
                `;
                break;

            default:
                console.log("add icon or assing weather to icon: " + weatherType);

        }

        HTMLStringWithDiscription = `
        <div class="weather">
            ${HTMLString}
            <div class="weatherDiscription">${discription}</div>
        </div>
        `

        template.innerHTML = HTMLStringWithDiscription;
        return template.content;
    }

    const _getJSON = async (url) => await (await fetch(url)).json();


    let urlCach = []
    const getJSON = (LookupUrl) => {
        const cached = urlCach.find(obj => (LookupUrl === obj.url));
        if (cached) {
            console.log("using urlCache");
            return cached.res;
        } else {
            const res = _getJSON(LookupUrl);
            urlCach = [{
                url: LookupUrl,
                res
            }, ...urlCach];
            return res;
        }
    };

    const getAdjustW = (para) => para * (meta.isFull ? 1 : 0.9);
    const getMainMargin = () => window.innerWidth * 0.05 * !meta.isFull;

    return {
        evtlOnce,
        unselectSelect,
        makeEnterClickable,
        blurAfterClick,
        addToClipboard,
        createWeatherHTML,
        getJSON,
        getAdjustW,
        getMainMargin,
    };
})();

const weather = (() => {
    let _curData;

    const getWeather = () => _.getJSON("https://api.openweathermap.org/data/2.5/forecast?q=London&units=metric&APPID=22d4e741c978538ccba7d43999bb6441").then(obj => _curData = obj).then(_ => display());

    const getCurData = () => _curData;

    const display = (timeFromNow = 0) => {
        const weatherBar = document.getElementById("weatherWiget");

        const intervals = _curData.list.filter((number, index) => (index * 3) % 24 === timeFromNow);
        settings.extraWeather && intervals.length < 6 && _curData.list.length > 32 && intervals.push(_curData.list[_curData.list.length - 1]);
        console.log('TCL: display -> _curData', _curData)
        console.log('TCL: display -> intervals', intervals)

        intervals.forEach(el => {
            weatherBar.appendChild(_.createWeatherHTML(el.weather[0].main, el.weather[0].description));
        });
    };

    return {
        getWeather,
        getCurData,
        display,
    };
})();

// weather.getWeather();

renderStripes();
// addApprox();
