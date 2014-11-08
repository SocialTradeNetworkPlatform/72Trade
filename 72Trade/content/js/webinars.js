var autoPlay = false;
(function( $ ) {
    // Global Variables
    var selectedItemText, selectedItemTextClass, selectedItemEl;
    var prevSelectedItem = 'all';
    
    jQuery("div[rel^='prettyPhoto']").live('click', function(e){
        e.preventDefault();
        jQuery(this).prettyPhoto({ social_tools: false, hideflash: true, width: 780,
			height: 620, theme: 'light_square'});
        jQuery(this).trigger('click');
    });
    
    var settings = {
        language: 'All',
        subject: 'All',
        date: 'All',
        current_language: 'English'
    }

    var first_load = true;
    
    var methods = {
        // Called When Plugin is Initiated
        init : function(options) {
            
            settings = $.extend(settings, options);
            
            if (settings.current_language.toLowerCase() != 'english') {
                
                if (first_load) {
                    settings.language = settings.current_language;
                    jQuery('.selected.language').removeClass('all').addClass(settings.current_language.toLowerCase());
                    jQuery('.language.name').text(settings.current_language);

                    first_load = false;
                }
            }
            
            get_lessons();
            get_vods();
            update_subjects_list();
        }
    }
    
    $.extend ({
        initWebinars: function(method) {
            if ( methods[method] ) {
                return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.init.apply( this, arguments );
            }  
        }
    });
    
    // Search Filter Menus Behavior = Language, Subject & Time Frame
    $('.selected').live('click', function() {
        var list = $('.list', $(this).parent());
        var arrow = $('.arrow', $(this));
        
        if (!list.is(':visible')) {
            rotate(arrow,180);
            
            $(list).slideDown({ duration: 350 });
        }
        else
        {
            rotate(arrow,0);
            
            $(list).slideUp();
        }
    });
    
    jQuery('.list-item').live('click', function() {
		autoPlay = false;
        selectedItemText = jQuery(this).text();
        selectedItemTextClass = jQuery(this).attr('rel').toLowerCase();
        selectedItemEl = jQuery(this).parent().prev();
        
        itemType = jQuery(this).parent().attr('id');
        
        jQuery('.selected-item', jQuery(this).parent()).removeClass('selected-item');
        jQuery(this).addClass('selected-item');
        
        switch (itemType) {
            case 'languages':
                prevSelectedItem = jQuery('.name',selectedItemEl).text().toLowerCase();
                jQuery(selectedItemEl).attr('class', 'selected language ' + selectedItemTextClass);
                
                settings.language = selectedItemTextClass;
                
                $.initWebinars();
                break;
            case 'subjects':
                settings.subject = selectedItemTextClass;
                $.initWebinars();
                break;
            case 'time':
                var time = selectedItemTextClass;
                time = time.replace('two', '+2');
                time = time.replace('one', '+1');
                time = time.replace('-', ' ');
                settings.date = time;
                
                $.initWebinars();
                break;
            default:
                console.log('error');
                break;
        }
        jQuery('.name',selectedItemEl).text(selectedItemText);
        jQuery(selectedItemEl).trigger('click');
    });
    
    // Rotate Drop Down List Arrow
    var rotate = function(el, degree) {
        
        jQuery(el).css({
            '-webkit-transform': 'rotate(' + degree + 'deg)',
            '-moz-transform': 'rotate(' + degree + 'deg)',
            '-ms-transform': 'rotate(' + degree + 'deg)',
            '-o-transform': 'rotate(' + degree + 'deg)',
            'transform': 'rotate(' + degree + 'deg)',
            'zoom': 1
        });
    }
    
    // Get Lessons JSON
    var get_lessons = function() {
        show_loader();
        jQuery("#classes").empty();
        jQuery('.classes-table-shadow').hide();
        jQuery('.error.no-webinars').remove();
        
        getAJAX('https://site.etoro.com/Webinar/json/findWebinars.php?language=' + settings.language + '&subject=' + settings.subject + '&date=' + settings.date + '&current_language=' + settings.current_language, function(data) {
            
            var timer = 800;
            
            if (data != false) {
                setTimeout(function() {
                    hide_loader();
                    jQuery("#classes").hide();
                    jQuery("#lessonsTemplate").tmpl(data).appendTo("#classes");
                    jQuery('#classes tr:odd').addClass('odd');
                    jQuery('#classes tr:even').addClass('even');
                    jQuery("#classes").fadeIn(300);
                }, timer);
            } else {
                setTimeout(function() {
                    hide_loader();
                    jQuery('#classes').before('<strong class="error no-webinars">We Apologize, But Your Search Criteria did not Match any Active Webinars</strong>');
                }, timer);
            }
        });
    }
    // Get VODS JSON
    var get_vods = function() {
        // Show Loader
        show_vod_loader();
        
        getAJAX('https://site.etoro.com/Webinar/json/findVods.php?language=' + settings.language, function(data) {
            if (data != false) {
				
				for(i in data){
					data[i].youtube_link = 	data[i].youtube_link.replace('http://','https://');
					data[i].youtube_image = data[i].youtube_image.replace('http://','https://');
				}
				
                jQuery(".video-thumbs ul").empty();
                jQuery("#vodTemplate").tmpl(data).appendTo(".video-thumbs ul");
                
                // Set Active Video to First Video
                var firstVideo = jQuery('.video-thumbs li:eq(0)');
                update_active_video(firstVideo);
            } else {
                // No VODS
                var parentDiv = jQuery('#vod');
                var naImage = 'https://site.etoro.com/en/wp-content/themes/etoro/images/webinars/na.jpeg';
                
                jQuery('.video-thumbs ul').empty();
                jQuery('.active-video img.big-preview', parentDiv).attr('src', naImage);
                jQuery('.video-desc .desc', parentDiv).text('We Apologize, But Your Search Criteria did not Match any Vods');
                jQuery('.video-desc .title', parentDiv).empty();
                jQuery('.video-desc .speaker', parentDiv).empty();
                
                // Hide Loader with a delay
				if (autoPlay == false){
					setTimeout(function() {
						hide_vod_loader();
					}, 1000);
				}
            }
        });
    }
    // VODS
   /* jQuery('.video-thumbs li').live('click', function() {
		autoPlay = true;
        update_active_video(jQuery(this));
    });*/
    // Youtube Video Functions
    var update_active_video = function(el) {
        if (el.length > 0) {
			 
            var vodTitle = jQuery('.vod-title', el).text();
            var vodDesc = jQuery('.vod-desc', el).text();
            var vodSpeaker = jQuery('.vod-speaker', el).text();
            var vodImage = jQuery('img', el).attr('src');
            
            // Remove Video (if any)
            jQuery('#youtubePlayer').remove();
            jQuery('.active-video img.big-preview').attr('src', vodImage.replace('http://','https://'));
            
            // Hide Loader with a delay
			if (autoPlay == false){
				setTimeout(function() {
					hide_vod_loader();
				}, 1000);
			}
            
            jQuery('.video-thumbs li.active').removeClass('active');
            jQuery(this).addClass('active');
            
            jQuery('.video-desc .title').text(vodTitle);
            jQuery('.video-desc p.desc').text(vodDesc);
            jQuery('.video-desc p.speaker .name').text(vodSpeaker);
                
            activeVideoURL = jQuery('.vod-link', el).text();
            activeVideoURL = activeVideoURL.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/'); 
			if (autoPlay == true){
				
				jQuery(".big-preview").hide();
				jQuery('.active-video').trigger('click');  
				
			}
			
        }
    }
    
    var activeVideoURL = 'https://www.youtube.com/embed/X4jeUMqcozo';
    
    jQuery(".active-video").live("click", function () {
        jQuery('img.big-preview', this).hide();
        jQuery(this).append('<iframe id="youtubePlayer" style="display:block;" width="398" height="287" src="' + activeVideoURL + '?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');
    });
    // VOD images loader
    var show_vod_loader = function() {
        jQuery(".active-video img.big-preview").hide();
        jQuery('.active-video .loader').show();
    }
    var hide_vod_loader = function() {
		if (autoPlay == false){
        jQuery('.active-video img.big-preview').fadeIn();
        jQuery('.active-video .loader').hide();
		}
    }
    
    // Load Subjects List According To Chosen Language.
    var update_subjects_list = function() {
        
        var allText = jQuery('ul#subjects .list-item[rel="all"]').text();
        
        settings.subject = 'All'; // Reset Subject Selection
        jQuery('.subject.name').text(allText);
        
        getAJAX('https://site.etoro.com/Webinar/json/getSubjects.php?language=' + settings.language, function(data) {
            var html = '';
            
            if (data != false) {
                jQuery.each(data, function(i, value) {
                    html += '<li class="list-item" rel="' +value.title+ '">' + value.title + '</li>';
                });
            }
            jQuery('ul#subjects .list-item:not([rel="all"])').remove();
            jQuery('ul#subjects').append(html);
        });
    }
    // Show AJAX Loader
    var show_loader = function() {
        jQuery('.ajax-loader').show();
    }
    // Hide Ajax Loader
    var hide_loader = function() {
        jQuery('.ajax-loader').hide();
    }
    
    // A Fix for IE8-9 Cross Domain Problem
    var getAJAX = function(url, callback) {
        var xmlhttp;
        var callbackFunction = callback;
        
        if (window.XDomainRequest) {
            xmlhttp = new XDomainRequest();
            xmlhttp.onload = function(){ callbackFunction(jQuery.parseJSON(xmlhttp.responseText)) };
        }
        else if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                callbackFunction(jQuery.parseJSON(xmlhttp.responseText));
            }
        }
        xmlhttp.open("GET",url,true);
        xmlhttp.send();
    }
})( jQuery );

/*====== webtrader redirect =======*/

 // get URL parameters
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
}

switch(getURLParameter('lang'))
{
case '2':
// german
  window.location.href= "http://www.etoro.com/de/lernen/trading-webinare/";
  break;
case '3':
// arabic
   window.location.href= "http://www.etoro.com/ae/learn/trading-webinars/";
  break;
case '5':
// russian
   window.location.href= "http://www.etoro.com/ru/learn/trading-webinars/";
  break;
case '6':
// spanish
   window.location.href= "http://www.etoro.com/es/aprendizaje/webinars-de-trading/";
  break;
case '7':
// french
   window.location.href= "http://www.etoro.com/fr/webinars-en-direct/";
  break;
case '8':
// italian
   window.location.href= "http://www.etoro.com/it/webinar-trading/";
  break;

case '9':
// japanese
   //window.location.href= "http://www.etoro.com/learn/webinar.aspx";
  break;
}