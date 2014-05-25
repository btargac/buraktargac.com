(function( $ ) {
 
    $.fn.makeEditable = function() {
		return this.each(function() {
			if($(this).get(0).tagName.toLowerCase() == "span") {
				if($(this).attr("data-type") && $(this).attr("data-type").length > 0) {
					var dataType = $(this).attr("data-type").toLowerCase();
					var thisElem = this;
					var newElement;
					var newElemName = $(this).attr("data-elemName") ? $(this).attr("data-elemName") : "ME_" + $(this).attr('id');
					switch(dataType) {
						case 'boolean':
							newElement = $("<input type=\"checkbox\" name=\"" + newElemName + "\" value=\"" + $(thisElem).val() + "\" style=\"display:none;\" />");
							$(newElement).on("blur", function() {
								$(thisElem).text($(newElement).is(":checked") ? "Yes" : "No");
								$(newElement).hide();
								$(thisElem).show();
							});
							
							$(thisElem).on("click", function() {
								$(newElement).prop("checked", $(thisElem).text().toLowerCase() == "yes" ? true : false);
								$(newElement).val($(thisElem).text());
								$(thisElem).hide();
								$(newElement).show();
								$(newElement).focus();
							});
							
							$(thisElem).trigger('click');
							$(newElement).trigger('blur');
							break;
							
						case 'list':
							var values = getValuesFromCallback($(this).attr("data-callback"));
							newElement = $("<select name=\"" + newElemName + "\" style=\"display:none;\" />");
							
							if(values) {
								$(values).each(function() {
									$(newElement).append($("<option value=\"" + this.value + "\">" + this.label + "</option>"));
								});
							}
							
							$(newElement).on("blur", function() {
								$(thisElem).text($(newElement).find(":selected").text());
								$(thisElem).attr("data-value", $(newElement).val());
								$(newElement).hide();
								$(thisElem).show();
							});
							
							$(thisElem).on("click", function() {
								var oldValue = $(thisElem).attr("data-value");
								$(newElement).val(oldValue ? oldValue : "");
								$(thisElem).hide();
								$(newElement).show();
								$(newElement).focus();
							});

							$(thisElem).trigger('click');
							$(newElement).trigger('blur');
							break;
							
						case 'text':
							newElement = $("<input type=\"text\" name=\"" + newElemName + "\" value=\"" + $(thisElem).val() + "\" style=\"display:none;\" />");
							$(newElement).on("blur", function() {
								$(thisElem).text($(newElement).val());
								$(newElement).hide();
								$(thisElem).show();
							});
							
							$(thisElem).on("click", function() {
								$(newElement).val($(thisElem).text());
								$(thisElem).hide();
								$(newElement).show();
								$(newElement).focus();
							});

							$(thisElem).trigger('click');
							$(newElement).trigger('blur');
							break;
					}
					
					$(newElement).insertAfter(this);
					$(this).css({cursor: "hand"});
				} else {
					debug($(this).get(0) + " has no data-type defined.");
				}
			} else {
				debug("this can only be applied to <span> elements");
			}
		});
    };
	
	var getValuesFromCallback = function(callback) {
		callback = window[callback];
		if(callback && (typeof callback === "function")) {
			var values = callback();
			if(values && values.length > 0) {
				return values;
			} else {
				debug("No values returned from callback");
			}
		} else {
			debug("Value callback required for this data-type.");
		}
	};
	
	var debug = function(message) {
		if(window.console && window.console.log) {
			console.log(message);
		} else {
			alert(message);
		}
	};
 
}( jQuery ));
