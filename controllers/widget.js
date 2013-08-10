/**
 * Init the navbar
 * _params.title = [String|File] a text title or a file ref to an image
 * @todo consider testing for start with http:// and make it a ref to remote image
 * _params.useGlobalEvents (default true) - Should the nav bar listen for globals event
 */

var ARGS = arguments[0] || {};

$.init = function(_params) {
	$.backImage._clickCallback = null;

	if(Alloy.CFG.colours) {
		$.ColourPrimary = Alloy.CFG.colours.primary || "#2600ff";
		$.ColourSecondary = Alloy.CFG.colours.primary || "#0090ff";
		$.ColourText = Alloy.CFG.colours.text || "#fff";
	}

	$.Wrapper.backgroundColor	= $.ColourPrimary;
	$.Title.color = $.ColourText;

	$.setTitle( _params.title ? _params.title : "" );

	$.Overlay.addEventListener('click',function(_e){
		Ti.API.debug("NavBar overlay click event: " + _e.source);
		Ti.API.debug("NavBar overlay click event: " + _e.source.id);
	});

	if( (_params.useGlobalEvents) ? _params.useGlobalEvents : true) {
		$.setGlobalListeners();
	}
}

/*
 *
 */
$.setGlobalListeners = function() {
	Ti.App.addEventListener("css:navbar:in:showBack",function(_event){
		$.showBack( (_event.params) ? _event.params : {} );
	});

	Ti.App.addEventListener("css:navbar:in:showSettings",function(_event){
		$.showSettings( (_event.params) ? _event.params : {} );
	});

	Ti.App.addEventListener("css:navbar:in:showAction",function(_event){
		$.showAction( (_event.params) ? _event.params : {} );
	});

}

$.setTitle = function(_txt) {
	$.Title.text = _txt;
	$.Title.visible = true;
}

$.showBack = function(_params) {
	$.back.visible = (_params && typeof _params.visible !== "undefined") ? _params.visible : true;
	Ti.API.debug("showBack visible = " + $.back.visible);

	if($.back.visible === true) {
		if ($.backImage._clickCallback === null) {
			if(_params && typeof _params.callback !== "undefined") {
				Ti.API.debug("NavBar showBack | click event to _params.callback ");
				$.backImage._clickCallback = _params.callback;
			} else {
				Ti.API.debug("NavBar showBack | click event to global fireEvent ");
				$.backImage._clickCallback = function(_event) {
					Ti.API.debug("NavBar showBack | click event");
					Ti.App.fireEvent("app:navbar:back",{});
				};
			}
			$.backImage.addEventListener("click",  $.backImage._clickCallback);
		}
	}
	else {
		if ($.backImage._clickCallback !== null) {
			$.backImage.removeEventListener("click", $.backImage._clickCallback);
			$.backImage._clickCallback = null;
		}
	}
};

$.showLeft = function(_params) {
	$.left.visible = true;
	$.leftImage.image = _params.image;
	$.left.addEventListener("click", _params.callback);
};

$.showRight = function(_params) {
	$.right.visible = true;
	$.rightImage.image = _params.image;
	$.right.addEventListener("click", _params.callback);
};

$.showMenu = function(_params) {
	var _callback = (_params && typeof _params.callback !== "undefined") ?
		_params.callback :
		function() { Ti.App.fireEvent("app:navbar:showmenu",{}); };

	$.showLeft({
		image: WPATH("images/menu.png"),
		callback: _callback
	});
};

$.showSettings = function(_params) {
	var _callback = (_params && typeof _params.callback !== "undefined") ?
		_params.callback :
		function() { Ti.App.fireEvent("app:navbar:showsettings",{}); };

	$.showRight({
		image: WPATH("images/settings.png"),
		callback: _callback
	});
};

$.showAction = function(_params) {
	$.showRight({
		image: WPATH("images/action.png"),
		callback: _params.callback
	});
};
