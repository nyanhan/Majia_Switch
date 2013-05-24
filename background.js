// Listen for the content script to send a message to the background page.
chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	if(!message.hasOwnProperty('can_switch')) return;
	
	chrome.pageAction.show(sender.tab.id);

	// Return nothing to let the connection be cleaned up.
	sendResponse();
});