const req = {
	post: (url = "/", func = req => {}, params = {}, async = false) => {
		req.perform(url, func, params, async, "post");
	},
	get: (url = "/", func = req => {}, params = {}, async = false) => {
		req.perform(url, func, params, async, "get");
	},
	perform: (url = "/", func, params = {}, async = false, method = "get") => {
		let request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				try {
					this.data = JSON.parse(this.responseText);
				} catch (e) {
					this.data = {};
				}
				func(this);
			}
		};
		let parameters = [];
		for (let i = 0; i < Object.keys(params).length; i++) {
			parameters.push(
				Object.keys(params)[i] + "=" + params[Object.keys(params)[i]]
			);
		}
		request.open(method, url, true);
		request.send(parameters.join("&"));
	}
};

/**
 *  @class LiveText
 *  @description Provides which updates text live as you change the values in its data
 *
 *  @param {element} element Dom element which should be made live
 *  @param {string} src_value source value of the text, as 'hello {{ value }}'
 *  @param {object} data json object with all the data in it, as '{"value": "there"}'
 */
class LiveText {
	constructor(element, src_value, data) {
		this.element = element;
		data.__src = src_value;
		this.src_data = data;
		this.data = new Proxy(this.src_data, {
			set: this.update
		});
		this.data.__element = element;
	}

	update(target, prop, value) {
		let output = Reflect.set(target, prop, value);
		console.log(target);
		let keys = Object.keys(target);
		let out = target.__src;
		for (let i = 0; i < keys.length; i++) {
			out = out.replace("{{ " + keys[i] + " }}", target[keys[i]]);
		}
		target.__element.innerHTML = out;
		return output;
	}
}

let texts = [];
let player = {};

/**
 * @function
 * @name initLiveTexts
 * @description gets out all 'live-text' elements in the document and changes them into LiveTexts
 */
function initLiveTexts() {
	let textsSrc = document.getElementsByTagName("live-text");
	for (let i = textsSrc.length - 1; i >= 0; i--) {
		let type = textsSrc[i].getAttribute("type")
			? textsSrc[i].getAttribute("type")
			: "p";
		let data = textsSrc[i].getAttribute("data")
			? textsSrc[i].getAttribute("data")
			: "{}";

		let element = document.createElement(type);
		let obj = new LiveText(
			element,
			textsSrc[i].innerHTML,
			JSON.parse(data)
		);
		element.id = textsSrc[i].id;
		element.classList = textsSrc[i].classList;
		textsSrc[i].parentElement.replaceChild(element, textsSrc[i]);
		texts.push(obj);
		textsSrc = document.getElementsByTagName("live-text");
	}
}

/**
 * @functions
 * @name getLiveTextById
 * @description returns a live text object from the 'texts' array
 *
 * @param {string} id
 *
 * @returns {LiveText}
 */
function getLiveTextById(id) {
	for (let i = 0; i < texts.length; i++) {
		if (texts[i].element.id == id) {
			return texts[i];
		}
	}
	return null;
}

/**
 * @name getElement
 * @description smaller method so its faster to get an element
 *
 * @param {string} id
 *
 * @returns {object} element of given id
 */
function getElement(id) {
	return document.getElementById(id);
}

function GetUser() {
	setCookie('user-token', getElement('token-input').value, 7)
    window.location.replace("/panel");
}

function NewUser() {
	req.get("/create", response => {
        console.log(response.data);
        if(response.data != null) {
            setCookie('user-token', response.responseText, 7)
            window.location.replace("/panel");
        }
	});
}

window.onload = () => {
    if(getCookie('user-token')) {
        setCookie('user-token', getCookie('user-token'), 7)
        window.location.replace("/panel");
    }
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return null;
}
