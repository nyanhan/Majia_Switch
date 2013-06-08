$(function() {
	/*
	var _users = [{displayName:'马甲一', userName:'geesimon@hotmail.com', password:'simon1'}, {displayName:'马甲二', userName:'geesimon@hotmail.com', password:'Simon=01'}, {displayName:'马甲三', userName:'geesimon@hotmail.com', password:'simon3'}];
	displayUsers(_users);
	*/
	
	var _users = [];
	
	//Check local first and if can't then check sync
	chrome.storage.local.get('users', function(items){
		if(items.users) {
			_users = items.users;
			displayUsers(_users);
		} else {
			chrome.storage.sync.get('users', function(items){
				if(items.users) {
					_users = items.users;
					displayUsers(_users);
				} 
			});
		}
	});
	
	$('#add_button').click(function(){
		newUser({displayName:'', userName:'', password:''});
		updated();
	})
	
	$(document).on('click', '.delete-button', function(event){
		var _displayName = $('.display-name', $(this).parent().parent()).val();
		
		if(confirm("你确定要删除马甲账号[" + _displayName + "]？")) {
			$(this).parent().parent().remove();
			updated();
		}
	});
	$(document).on('change', '.#user_table input', function(event){ 
		updated();	
	});
	$(document).on('click', '.check-button', function(event){ 
		var _username = $('.login-user-name', $(this).parent().parent()).val();
		var _password = $('.login-password', $(this).parent().parent()).val();
		
		loginUser(_username, _password);
	});
	/*
	$('.delete-button').on('click', function(event){
		$(this).parent().parent().remove();
		updated();	
	})
	
	$('input').on('change', function(event){
		updated();
	})
	*/
	$('#btn_save').click(function(){
		save();
	})
});

function displayUsers(users) {
	for(var i = 0; i < users.length; i++) {
		newUser(users[i]);
	}
}

function newUser(user) {
	var accountTr = $('#account tr').clone();
	
	$('.display-name', accountTr).val(user.displayName);
	$('.login-user-name', accountTr).val(user.userName)
	$('.login-password', accountTr).val(user.password)
	
	$('#user_table').append(accountTr);
}

function updated() {
	$('#btn_save').removeAttr('disabled');
}

function save(){
	var _valueInputs = $('#user_table input');
	var _users = new Array();
	
	var i = _valueInputs.length / 3, j;
	
	for(j = 0; j < i; j++) {
		if($(_valueInputs[j*3]).val().length != 0) {
			_users[j] = {};
			_users[j].displayName = $(_valueInputs[j*3]).val();
			_users[j].userName = $(_valueInputs[j*3 + 1]).val();
			_users[j].password = $(_valueInputs[j*3 + 2]).val();
		}
	}
	
	chrome.storage.local.set({'users':_users}, function(){
		$('#btn_save').attr('disabled','disabled');
		$('#save_status').animate({
		    opacity: 1,
		  }, 1000, function() {
				  		$('#save_status').animate({
				  			opacity: 0,
				  		}, 3000, function() {});
		  });
	});
}

function loginUser(username, password) {
	var xmlhttp = new XMLHttpRequest();
	var url = 'http://www.zhaohaowan.com/j/login';
	var params = 'account=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password);
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			response = JSON.parse(xmlhttp.responseText);
			if(response.hasOwnProperty('uid')) {
				alert('马甲验证成功!')
			} else {
				alert('对不起，这好像不是你的马甲哦:(')
			}
		}
	};
	
	xmlhttp.open('post', url, true);
	xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xmlhttp.send(params);
}