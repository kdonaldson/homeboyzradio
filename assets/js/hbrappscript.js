/*
		K. DONALDSON LLC
		Keith D. Donaldson
*/
		// Get Homeboyzradio Stream
		var hbraudio = new Video('http://icecast.ksl.com:8000/');
		//var hbraudio = new Audio('http://s8.voscast.com:7438/');
		hbraudio.id = 'playerMyAudio';
			
		function playStream() {
		  try {
			hbraudio.play();
		  } catch (e) {
			alert('no audio support!');
		  } 
		};
		
		function killStream(){
			hbraudio.pause();
		};
		
		function toggleAudio()  {
			if (document.getElementById("toggle").value=='Turn music off') {
				document.getElementById("toggle").value='Turn music on';
				killStream()
			}
			else {
				document.getElementById("toggle").value='Turn music off';
				playStream()
			}
		};

		// Lawnchair
        $(document).bind("pagebeforechange", function( event, data ) {
            $.mobile.pageData = (data && data.options && data.options.pageData)
                ? data.options.pageData
                : null;
        });
        
        $("#story").live("pagebeforeshow", function(e, data){
                var output = ' ';
                var head_output = ' ';

            if ($.mobile.pageData && $.mobile.pageData.id){

               	var store = Lawnchair({name:'store'},function(e){
                });

                store.get($.mobile.pageData.id,function(obj){
                    var newsitem = obj.value;
                    console.log($.mobile.pageData.id);
                    console.log(newsitem);
                    $.each(newsitem, function(key, val) {
                        var headline = newsitem[key].headline;
                        var image_url = newsitem[key].image_url;
                        var story = newsitem[key].story;

                        output += '<img id="" src="' + image_url + '" style="width: 100%; height: auto; margin-left: auto;  margin-right: auto;"/>';


                        output += story;
                        $('#showstory').html(output);
                        head_output += headline;
                        $('#showheadline').html(head_output);
                    });
                });
            }
        });
	
        $.fn.serializeObject = function()
            {
                var o = {};
                var a = this.serializeArray();
                $.each(a, function() {
                    if (o[this.name] !== undefined) {
                        if (!o[this.name].push) {
                            o[this.name] = [o[this.name]];
                        }
                        o[this.name].push(this.value || '');
                    } else {
                        o[this.name] = this.value || '';
                    }
                });
                return o;
            };

		
		// POST Subcriber to Mailing List
        $(document).ready(function(){
                $('#mailinglist').validate({
                    rules: {
                        month: {
                            required: true,
                            digits: true
                        },
                        day: {
                            required: true,
                            digits: true
                        },
                        year: {
                            required: true,
                            digits: true
                        }
                    },
                submitHandler: function(form) {
                        console.log('Handler for .submit() called.');
                        $.ajax({
                            //url: 'http://localhost:8000/api/v1/subscriber/',
                            url: 'http://homeboyzradio.herokuapp.com/api/v1/subscriber/',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify($('form#mailinglist').serializeObject()),
                            dataType: 'json',
                            processData: false,
                            success: function(){
                                console.log("success");
                                $.mobile.changePage('#success');
                            },
                            error: function(){
                                console.log("failure");
                                $.mobile.changePage('#failure');
                            }
                        });
                }
                });
        });
  
        $('#mailinglist').live("submit",function() {
            console.log('Handler for .submit() called.');
              $.ajax({
                //url: 'http://localhost:8000/api/v1/subscriber/',
                url: 'http://homeboyzradio.herokuapp.com/api/v1/subscriber/',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify($('form#mailinglist').serializeObject()),
                dataType: 'json',
                processData: false,
                success: function(){
                    console.log("success");
                },
                error: function(){
                    console.log("failure");
                }
            });
                          return false;
        });
		
		// List Tweets
		function listTweets(data) {
			 console.log(data);
			 var output = '<ul data-role="listview" data-theme="a">';
			 
			 $.each(data, function(key, val) {
				var text = data[key].text;
				var thumbnail = data[key].user.profile_image_url;
				var name = data[key].user.name;
				
				text = text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(i){
					var url=i.link(i);
					return url;
				});

				text = text.replace(/[@]+[A-Za-z0-9-_]+/g, function(i){
					var item = i.replace("@", ' ');
					var url = i.link("http://twitter.com/" + item);
					return url;
				});
				
				text = text.replace(/[#]+[A-Za-z0-9-_]+/g, function(i){
					var item = i.replace("#", '%23');
					var url = i.link("http://search.twitter.com/search?q=" + item);
					return url;
				});	
				
				output += '<li>';
				output += '<img src="' + thumbnail + '"alt="Photo of ' + name + '">';
				output += '<div>' + text + '</div>';
				output += '</li>';
			 }); // go through each tweet
			 output += '</ul>';
			 $('#tweetlist').html(output);
		};

		// List Headlines
		function listHeadlines(data) {
			var newsitems = data.objects;
			console.log(newsitems);
			
			var store = new Lawnchair({name:'store'}, function(e) {
				console.log('storage open');
				this.nuke()
			});


			var output = '<ul data-role="listview" data-theme="d">';

			$.each(newsitems, function(key, val) {
				var id = newsitems[key].id;
				var headline = newsitems[key].headline;
				var image_url = newsitems[key].image;
				var story  = newsitems[key].story;
				var jsonObj = []; //declare array

				jsonObj.push({id: newsitems[key].id, headline: newsitems[key].headline, image_url: newsitems[key].image, 
		story: newsitems[key].story}); 
				store.save({key:id,value:jsonObj});

				console.log('key=' + key);
				console.log(jsonObj);
				console.log('image_url = ' + image_url);

				output += '<li>';
				output += '<a href="#story?id=' + id + '"><img src="' + image_url + '" /><h1>' + headline + '</h1></a>';
				output += '</li>';
			}); // go through each headline
			output += '</ul>';
			$('#headlinelist').html(output);
			$('#headlinelist').listview("refresh");
		};

		// Call Twitter: Get HomeboyzRadio Feed
		$(document).ready(function() {
			var refreshID = setInterval(function() {
				$.getJSON('http://twitter.com/status/user_timeline/HomeboyzRadio.json?count=30&callback=?',function(data){
					console.log(data);
					listTweets(data);  
					$('#tweetlist').trigger('create');  
		 });
			}, 24000);
		 });
	
		// Call HBR CMS: Get HomeboyzRadio News Headline Feed
		$(document).ready(function() {
			//$.getJSON('http://localhost:8000/api/v1/item/?format=json',function(data){listHeadlines(data);
			$.getJSON('http://homeboyzradio.herokuapp.com/api/v1/item/?format=json',function(data){
					listHeadlines(data);
					$('#headlinelist').trigger('create');
			});
		}); 