/*
if (document.querySelector('#logout')) {
	chrome.extension.sendMessage({can_logout:true}, function(response) {});
} else {
	chrome.extension.sendMessage({can_logout:false}, function(response) {});
}
*/

var $cookie = function (key, value, options) {

    // key and value given, set cookie...
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = jQuery.extend({}, options);

        if (value === null) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? String(value) : encodeURIComponent(String(value)),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

chrome.extension.sendMessage({can_switch:true}, function(response) {});

setTimeout('tagging()', 1000);
if (window.location.href.search("/people/") > 0) {
	check_board = true;
} else {
	check_board = false;
}


function tagging() {	
	if (check_board) {
		tagBoard();
	} else {
		tagPicture();
	}
	setTimeout('tagging()', 1000);
}
function tagPicture() {
	var pic_elements = document.getElementsByClassName('pic_item box_regular transport');
	var tagged = false;
	for (i = 0; i < pic_elements.length; i++) {
		if (pic_elements[i].className.search("EditorClass") < 0) {
			pic_elements[i].className += " EditorClass";
			iconBox = pic_elements[i].getElementsByClassName('l')[0];
			if(pic_elements[i].attributes['data-rid']) {
				rid = pic_elements[i].attributes['data-rid'].value
			} else {
				rid = null;
			}			
			iconBox.appendChild(getPictureEditorLink(pic_elements[i].attributes['data-pid'].value, rid));
			tagged = true;
		}
	}

	pic_elements = document.querySelectorAll('a[pid]');

	var temp;

	for (i = 0; i < pic_elements.length; i++) {
		if (pic_elements[i].className.search("EditorClass") < 0) {
			pic_elements[i].className += " EditorClass";

			temp = document.createElement("b");
			temp.style.cssText = "position:absolute;background-color:#fff;";
			temp.setAttribute("onclick", 'window.open("https://www.zhaohaowan.com:1443/b/pin/' + pic_elements[i].getAttribute("pid") + '/");event.stopPropagation()');
			temp.innerHTML = "管理";
			pic_elements[i].insertBefore(temp, pic_elements[i].firstChild);
		}
	}
	return tagged;
}

function getPictureEditorLink(id, rid) {	
	var aLink = document.createElement('a');
	aLink.href = "https://www.zhaohaowan.com:1443/b/pin/" + id + "/";
	if(rid) {
		aLink.href += "?rid=" + rid;
	}
	aLink.target= "_blank";
	var div = document.createElement('div');
	div.className="icon_default";
	div.style.top = '37px';
	var b = document.createElement('b')
	var p = document.createElement('p')
	p.innerHTML="管理"
	div.appendChild(b)
	div.appendChild(p)
	aLink.appendChild(div)
	
	return aLink
}
 
function tagBoard() {
	var board_elements = document.getElementsByClassName('pic_item box_regular');
	var tagged = false;
	for (i = 0; i < board_elements.length; i++) {
		if (board_elements[i].className.search("EditorClass") < 0) {
			board_elements[i].className += " EditorClass";
			board_elements[i].appendChild(getBoardEditorLink(board_elements[i].attributes['data-bid'].value));
			tagged = true;
		}
	}
	return tagged;
}

function getBoardEditorLink(id) {	
	var aLink = document.createElement('a');
	aLink.href = "https://www.zhaohaowan.com:1443/b/board/" + id + "/";
	aLink.target= "_blank";
	var div = document.createElement('div');
	div.className="icon_default";
	div.style.top = '37px';
	div.style.position = 'absolute';
	var b = document.createElement('b')
	var p = document.createElement('p')
	p.innerHTML="管理"
	div.appendChild(b)
	div.appendChild(p)
	aLink.appendChild(div)
	
	return aLink
}
 
chrome.extension.onMessage.addListener(function (message, sender, sendResponse){
	if (message.login) {
		loginUser(message.username, message.password);
	}

	if (message.show_weibo_click) {
	    injectWeiboClickNumber();
	}
	
	sendResponse();
});

function injectWeiboClickNumber(){
	var links = document.getElementsByTagName("a");
	var href = "", hrefs = [], ls = [];

	for (var i = 0, l = links.length; i < l; i++) {
		href = links[i].getAttribute("href");
		
		if (href && href.indexOf("t.cn/") > 0) {
			hrefs.push(href);
			ls.push(links[i]);
		}
	}

	fetchWeiboClickNumber(ls, hrefs);
}

function fetchWeiboClickNumber(links, hrefs){

	if (!hrefs.length) {
	    return;
	}

	// 微博的限制
	if (hrefs.length > 20) {
	    hrefs.length = 20;
	}

	var xmlhttp = new XMLHttpRequest();
	var url = 'https://api.weibo.com/2/short_url/clicks.json';
	var response;

	url += '?source=717464131';

	for (var i = 0, l = hrefs.length; i < l; i++) {
		url += '&url_short=' + encodeURIComponent(hrefs[i]);
	}
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			response = JSON.parse(xmlhttp.responseText);
			response.urls.forEach(function(item, i){
				var span = document.createElement("span");

				span.style.color = "red";

				span.textContent = " (" + item.clicks + ")";

				links[i].insertAdjacentElement("afterEnd", span);
			});
		}
	};
	
	xmlhttp.open('get', url, true);
	xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xmlhttp.send();
}

function loginUser(username, password) {
	var xmlhttp = new XMLHttpRequest();
	var url = '/j/login';
	var params = 'account=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password);
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			response = JSON.parse(xmlhttp.responseText);
			if(response.hasOwnProperty('uid')) {
				window.location.reload()
			} else {
				alert('登陆失败! 请在配置里检查你的用户名口令.')
			}
		}
	};
	
	xmlhttp.open('post', url, true);
	xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xmlhttp.setRequestHeader('X-Xsrftoken', $cookie("_xsrf"));
	xmlhttp.send(params);
}

/*
function logoutUser() {
	window.location.href = 'http://www.zhaohaowan.com/account/logout';
}

function loginUser(username, password) {
	var loginLink = document.getElementById('header_login');
	var mouseEvent1 = document.createEvent('MouseEvents');
	
    mouseEvent1.initMouseEvent('click', true, true, window,
								0, 0, 0, 0, 0,
								false, false, false, false,
								0, null);			
    loginLink.dispatchEvent(mouseEvent1);
	
	var inputUser = document.getElementById('login_user');
	var inputPassword = document.getElementById('login_password');
	var btnLogin = document.querySelector('.btn_blue')
	
	inputUser.value = username;
	inputPassword.value=password;
	setTimeout(function(){
		var mouseEvent2 = document.createEvent('MouseEvents');
		mouseEvent2.initMouseEvent('click', true, true, window,
								0, 0, 0, 0, 0,
								false, false, false, false,
								0, null);
		btnLogin.dispatchEvent(mouseEvent2);
	}, 1000);
}
*/
