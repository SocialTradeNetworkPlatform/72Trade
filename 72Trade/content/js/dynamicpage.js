$(function () {

    var newHash = "",
        $mainContent = $("#main-content"),
        $pageWrap = $("#page-wrap"),
        baseHeight = 0,
        $el;

    $pageWrap.height($pageWrap.height());
    baseHeight = $pageWrap.height() - $mainContent.height();

    $("nav").delegate("a", "click", function (e) {
			
														$mainContent
                .find("#guts").empty().html('<img src="images/loader.gif">');

															e.preventDefault();
															var $link = $(e.target),
															state = {'href': $link.attr('href'), 'title': $link.html()};
															// $div = $link.siblings('div'),
															//		 content = $div.html();
															//			alert($link.attr('href'));						
													
               $mainContent
                .find("#guts")
                .fadeOut(200, function () {
                    $mainContent.hide().load( state.href  +" #guts", function () {
                        $mainContent.fadeIn(200, function () {
                            $pageWrap.animate({
                                height: baseHeight + $mainContent.height() + "px"
                            });
                        });
                        $("nav a").removeClass("current");
                        $("nav a[href=" + newHash + "]").addClass("current");
                    });
                });
																
                history.pushState(null, state.title, state.href);	
																// history.pushState(null, document.textContent, $(this).attr("href"));																
																		document.title = state.title;
																// window.location.hash = $(this).attr("href");
        return false;
    });
/*
    $(window).bind('statechange', function () {
					
        newHash = window.location.hash.substring(1);
						//		alert(newHash);
        debugger;
        if (newHash) {
            $mainContent
                .find("#guts")
                .fadeOut(200, function () {
                    $mainContent.hide().load(newHash + " #guts", function () {
                        $mainContent.fadeIn(200, function () {
                            $pageWrap.animate({
                                height: baseHeight + $mainContent.height() + "px"
                            });
                        });
                        $("nav a").removeClass("current");
                        $("nav a[href=" + newHash + "]").addClass("current");
                    });
                });
        };

    });

    $(window).trigger('statechange');
*/
});


 
       