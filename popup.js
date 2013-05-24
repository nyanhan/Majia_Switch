$(function() {
	//var _users = [{displayName:'马甲一', userName:'geesimon@hotmail.com', password:'simon1'}, {displayName:'马甲三', userName:'geesimon@hotmail.com', password:'Simon=01'}, {displayName:'马甲二', userName:'geesimon@hotmail.com', password:'simon3'}];
	//chrome.storage.sync.set({'users':_users}, function(){});
	//displayAccount(_users);
	
	var _users;
	chrome.storage.local.get('users', function(items){
		if(items.users) {
			_users = items.users;
			displayAccount(_users);			
		} else {
			chrome.storage.sync.get('users', function(items){
				if(items.users) {
					_users = items.users;
					displayAccount(_users);	
				} 
			});
		}
	});

	var show_weibo_click = $("#show_weibo_click");

	show_weibo_click.on("click", function(){
		chrome.windows.getCurrent(function(w) {
			chrome.tabs.getSelected(w.id,function (tab){
				chrome.tabs.sendMessage(tab.id, { show_weibo_click: true }, function(response) {
					window.close();
				})
			})
		});
	});
});

function displayAccount(users) {
	for(var i = 0; i < users.length; i++) {
		var accountDiv = $('#account').clone();
		accountDiv.attr('id', 'account_'+ 1);
		accountDiv.attr('data-id', i);
		accountDiv.text(users[i].displayName);
		//$('#account_list').append(accountDiv);
		$('#option_link').before(accountDiv);
	}
	
	registerClickHandler(users);	
}

function registerClickHandler(users) {
	$('#account_list a').click(function(e){
		var _username = users[$(this).attr('data-id')].userName, _password = users[$(this).attr('data-id')].password;
		//chrome.extension.getBackgroundPage().startSwitch(username, password);		
		chrome.windows.getCurrent(function(w) {
			chrome.tabs.getSelected(w.id,function (tab){
				chrome.tabs.sendMessage(tab.id, {login:true, username: _username, password: _password}, function(response) {
					window.close();
				})
			})
		});
	});
}
