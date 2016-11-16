window.fbAsyncInit = function() {
    FB.init({
        appId      : '1475645609411268',
        cookie     : true, 
        xfbml      : true,  
        version    : 'v2.2' 
    });
};
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$().ready(function() {
    //Check if selection is the default value
    $.validator.addMethod("checkS",function(value,element,arg){
        return arg!=value;
    }, "Value must not equal default.");
    //Check if the input has only whitespace
    $.validator.addMethod("noWhite",function(value,element){
        return !(value.trim()=='');
    }, "Value must not be only whitespace.");
    $("#myForm").validate({
        rules:{
            streetAddress:{
                noWhite:true
            },
            cities:{
                noWhite:true
            },
            states:{
                checkS:"default"
            }  
        },
        messages:{
            streetAddress:{
                noWhite:"Please enter the street address"
            },
            cities:{
                noWhite:"Please enter the city"
            },
            states:{
                checkS:"Please select a state"
            }
        },
        submitHandler: function() {
            //Ajax Call
            $.ajax({
                url: 'http://superweather.elasticbeanstalk.com/',
                type: 'GET',
                data:{
                    streetAddress:$("#streetAddress").val(),
                    cities:$("#cities").val(),
                    states:$("#states").val(),
                    degree:$("input[name=degree]:checked").val()
                },
                success: function(output) {
                //Parse JSON Data
                var obj=JSON.parse(output);
                
                //Initiation
                $("#cloudMap").html("");
                if (!$("#tab1").hasClass("active")){
                    $("#tab1").addClass("active");
                }
                if ($("#tab2").hasClass("active")){
                    $("#tab2").removeClass("active");
                }
                if ($("#tab3").hasClass("active")){
                    $("#tab3").removeClass("active");
                }
                if (!$("#rightnow").hasClass("active")){
                    $("#rightnow").addClass("active");
                }
                if ($("#nexth").hasClass("active")){
                    $("#nexth").removeClass("active");
                }
                if ($("#nextd").hasClass("active")){
                    $("#nextd").removeClass("active");
                }
                $(".result").css("display","block");
                
                //Tab 1!!!!!!!!!!!!!
                    
                //Show Current Weather
                //Unit 
                if ($("input[name=degree]:checked").val()=="us"){
                    var tu="&deg;F";
                    var wu="mph";
                    var vu="mi";
                    var pu="mb";
                }else{
                    var tu="&deg;C";
                    var wu="m/s";
                    var vu="km";
                    var pu="hPa";
                }
                //Current Icon
                var icon=obj.currently.icon;
                if (icon=="clear-day"){
                    var iconShow="clear.png";
                }else if (icon=="clear-night"){
                    var iconShow="clear_night.png";
                }else if (icon=="partly-cloudy-day"){
                    var iconShow="cloud_day.png";
                }else if (icon=="partly-cloudy-night"){
                    var iconShow="cloud_night.png";
                }else{
                    var iconShow=icon+".png";
                }
                $("#currenticon").html("<img src=\"/public/images/"+iconShow+"\" title=\""+iconShow+"\" alt=\""+iconShow+"\" width=\"130\" height=\"130\">");
                //Current Summary
                var summary=obj.currently.summary;
                $("#summary").html(summary+" in "+$("#cities").val()+", "+$("#states").val());
                //Current Temprature
                var temp=obj.currently.temperature;
                temp=Math.round(temp);
                $("#temperature").html(temp);
                $("#tempdegree").html(tu);
                //Current High Low
                var highT=obj.daily.data[0].temperatureMax;
                highT=Math.round(highT);
                var lowT=obj.daily.data[0].temperatureMin;
                lowT=Math.round(lowT);
                $("#low").html("L:"+lowT+"&deg;");
                $("#high").html("H:"+highT+"&deg;");
                //Current Precipitation
                var prein=obj.currently.precipIntensity; 
                if (prein>=0&&prein<0.002){
                    var preinV="None";
                }else if (prein>=0.002&&prein<0.017){
                    var preinV="Very Light";
                }else if (prein>=0.017&&prein<0.1){
                    var preinV="Light";
                }else if (prein>=0.1&&prein<0.4){
                    var preinV="Moderate";
                }else if (prein>=0.4){
                    var preinV="Heavy";
                }
                $("#precipitation").text(preinV);
                //Current Chance of Rain
                var prepb=obj.currently.precipProbability;
                prepb=Math.round(prepb*100);
                $("#rainchance").html(prepb+"&#37;");
                //Current Wind Speed
                var wind=obj.currently.windSpeed;
                wind=Math.round(wind * 100) / 100;
                $("#windspeed").text(wind+wu);
                //Current Dew Point
                var dew=obj.currently.dewPoint;
                dew=Math.round(dew * 100) / 100;
                $("#dewpoint").html(dew+tu);
                //Current Humidity
                var hum=obj.currently.humidity;
                var hum=Math.round(hum*100);
                $("#humidity").html(hum+"&#37;");
                //Current Visibility
                var vis=obj.currently.visibility
                vis=Math.round(vis * 100) / 100;
                $("#visibility").text(vis+vu);
                //Sunrise
                var timeZone=obj.timezone;
                var sunRise=obj.daily.data[0].sunriseTime;
                var dateR=new Date(sunRise*1000);
                $("#sunrise").text(AMPM(dateR,timeZone));
                //Sunset
                var sunSet=obj.daily.data[0].sunsetTime;
                var dateS=new Date(sunSet*1000);
                $("#sunset").text(AMPM(dateS,timeZone));
                
                    
                
                //Tab 2!!!!!!!!!!!!!
                
                $("#tab2temph").html("Temp &#40;"+tu+"&#41;");
                $(".nTime").each(function(index,element){
                        var hourtime=obj.hourly.data[index].time;
                        var hourT=new Date(hourtime*1000);
                        $(element).html(AMPM(hourT,timeZone));
                });
                $(".nIcon").each(function(index,element){
                        var houricon=obj.hourly.data[index].icon;
                        if (houricon=="clear-day"){
                            var houriconShow="clear.png";
                        }else if (houricon=="clear-night"){
                            var houriconShow="clear_night.png";
                        }else if (houricon=="partly-cloudy-day"){
                            var houriconShow="cloud_day.png";
                        }else if (houricon=="partly-cloudy-night"){
                            var houriconShow="cloud_night.png";
                        }else{
                            var houriconShow=houricon+".png";
                        }
                        $(element).html("<img src=\"/public/images/"+houriconShow+"\" title=\""+houriconShow+"\" alt=\""+houriconShow+"\" width=\"40\" height=\"40\">");
                });
                $(".nCloud").each(function(index,element){
                        var hourcloud=obj.hourly.data[index].cloudCover;
                        hourcloud=Math.round(hourcloud*100);
                        $(element).html(hourcloud+"&#37;");
                });
                $(".nTemp").each(function(index,element){
                        var hourtemp=obj.hourly.data[index].temperature;
                        hourtemp=Math.round(hourtemp*100)/100;
                        $(element).html(hourtemp);
                });
                $(".nWind").each(function(index,element){
                        var hourwind=obj.hourly.data[index].windSpeed;
                        $(element).text(hourwind+wu);
                });
                $(".nHum").each(function(index,element){
                        var hourhum=obj.hourly.data[index].humidity;
                        hourhum=Math.round(hourhum*100);
                        $(element).html(hourhum+"&#37;");
                });
                $(".nVis").each(function(index,element){
                        var hourvis=obj.hourly.data[index].visibility;
                        $(element).text(hourvis+vu);
                });
                $(".nPre").each(function(index,element){
                        var hourpre=obj.hourly.data[index].pressure;
                        $(element).text(hourpre+pu);
                });
                
                
                //Tab 3!!!!!!!!!!!!!
                
                $(".dayday").each(function(index,element){
                        var day=obj.daily.data[index+1].time;
                        day=new Date(day*1000);
                        day=tzconvert(day,timeZone).getDay();
                        var dayset=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                        $(element).html(dayset[day]);
                });
                $(".daymonth").each(function(index,element){
                        var monthd=obj.daily.data[index+1].time;
                        monthd=new Date(monthd*1000);
                        var date=tzconvert(monthd,timeZone).getDate();
                        var month=tzconvert(monthd,timeZone).getMonth();
                        var monthset=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        $(element).html(monthset[month]+" "+date);
                });
                $(".dayicon").each(function(index,element){
                        var dayicon=obj.daily.data[index+1].icon;
                        if (dayicon=="clear-day"){
                            var dayiconShow="clear.png";
                        }else if (dayicon=="clear-night"){
                            var dayiconShow="clear_night.png";
                        }else if (dayicon=="partly-cloudy-day"){
                            var dayiconShow="cloud_day.png";
                        }else if (dayicon=="partly-cloudy-night"){
                            var dayiconShow="cloud_night.png";
                        }else{
                            var dayiconShow=dayicon+".png";
                        }
                        $(element).html("<img src=\"/public/images/"+dayiconShow+"\" title=\""+dayiconShow+"\" alt=\""+dayiconShow+"\" class=\"img-responsive\">");
                });
                $(".daymin").each(function(index,element){
                        var dmin=obj.daily.data[index+1].temperatureMin;
                        dmin=Math.round(dmin);
                        $(element).html(dmin+"&deg;");
                });
                $(".daymax").each(function(index,element){
                        var dmax=obj.daily.data[index+1].temperatureMax;
                        dmax=Math.round(dmax);
                        $(element).html(dmax+"&deg;");
                });
                $(".modal-title").each(function(index,element){
                        var monthd=obj.daily.data[index+1].time;
                        monthd=new Date(monthd*1000);
                        var date=tzconvert(monthd,timeZone).getDate();
                        var month=tzconvert(monthd,timeZone).getMonth();
                        var monthset=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        $(element).html("Weather in "+$("#cities").val()+" on "+monthset[month]+" "+date);
                });
                $(".dayiconlg").each(function(index,element){
                        var dayicon=obj.daily.data[index+1].icon;
                        if (dayicon=="clear-day"){
                            var dayiconShow="clear.png";
                        }else if (dayicon=="clear-night"){
                            var dayiconShow="clear_night.png";
                        }else if (dayicon=="partly-cloudy-day"){
                            var dayiconShow="cloud_day.png";
                        }else if (dayicon=="partly-cloudy-night"){
                            var dayiconShow="cloud_night.png";
                        }else{
                            var dayiconShow=dayicon+".png";
                        }
                        $(element).html("<img src=\"/public/images/"+dayiconShow+"\" title=\""+dayiconShow+"\" alt=\""+dayiconShow+"\" class=\"img-responsive\">");
                });
                $(".daylg").each(function(index,element){
                        var day=obj.daily.data[index+1].time;
                        day=new Date(day*1000);
                        day=tzconvert(day,timeZone).getDay();
                        var dayset=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                        $(element).html(dayset[day]+": ");
                });
                $(".sumlg").each(function(index,element){
                        var dsum=obj.daily.data[index+1].summary;
                        $(element).html(dsum);
                });
                $(".daysunrise").each(function(index,element){
                        var daysunRise=obj.daily.data[index+1].sunriseTime;
                        var dateR=new Date(daysunRise*1000);
                        $(element).text(AMPM(dateR,timeZone));
                });
                $(".daysunset").each(function(index,element){
                        var daysunSet=obj.daily.data[index+1].sunsetTime;
                        var dateS=new Date(daysunSet*1000);
                        $(element).text(AMPM(dateS,timeZone));
                });
                $(".dayhum").each(function(index,element){
                        var dayhum=obj.daily.data[index+1].humidity;
                        dayhum=Math.round(dayhum*100);
                        $(element).html(dayhum+"&#37;");
                });
                $(".daywind").each(function(index,element){
                        var daywind=obj.daily.data[index+1].windSpeed;
                        $(element).text(daywind+wu);
                });
                $(".dayvis").each(function(index,element){
                        var dayvis=obj.daily.data[index+1].visibility;
                        if (dayvis==undefined){
                            dayvis="N.A.";
                        }else{
                            dayvis=dayvis+vu;
                        }
                        $(element).text(dayvis);
                });
                $(".daypre").each(function(index,element){
                        var daypre=obj.daily.data[index+1].pressure;
                        $(element).text(daypre+pu);
                });
                console.log("Success!!!");
                
                
                //Show Map with 3 Layers
                var args = OpenLayers.Util.getParameters();
                var layer_name = "rain";
                var lat = obj.latitude;
                var lon = obj.longitude;
                var zoom = 11;
                var opacity = 0.3;
                    if (args.l)	layer_name = args.l;
                    if (args.lat)	lat = args.lat;
                    if (args.lon)	lon = args.lon;
                    if (args.zoom)	zoom = args.zoom;
                    if (args.opacity)	opacity = args.opacity;
                var map = new OpenLayers.Map("cloudMap", 
                {
                    units:'m',
                    projection: "EPSG:900913",
                    displayProjection: new OpenLayers.Projection("EPSG:4326")
                });
                var osm = new OpenLayers.Layer.XYZ(
                    "osm",    "http://${s}.tile.openweathermap.org/map/osm/${z}/${x}/${y}.png",
                    {
                        numZoomLevels: 18, 
                        sphericalMercator: true
                    }
                );
                var mapnik = new OpenLayers.Layer.OSM();

                var opencyclemap = new OpenLayers.Layer.XYZ(
                    "opencyclemap",                 "http://a.tile3.opencyclemap.org/landscape/${z}/${x}/${y}.png",
                    {
                        numZoomLevels: 18, 
                        sphericalMercator: true
                    }
                );
                var layer = new OpenLayers.Layer.XYZ(
                    "layer "+layer_name, "http://${s}.tile.openweathermap.org/map/"+layer_name+"/${z}/${x}/${y}.png",
                    {
                        isBaseLayer: false,
                        opacity: opacity,
                        sphericalMercator: true

                    }
                );
                var centre = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), 
                                            new OpenLayers.Projection("EPSG:900913"));
                map.addLayers([mapnik, osm, opencyclemap, layer]);
                map.setCenter( centre, zoom);
                },
                error: function(e) {
                    console.log(e.message);
                }
            });
        }
    });
    //Facebook Button Event Handler
    $("#fblg").click(function(){
        var posticon=$("#currenticon img").attr("src");
        var postsum=$("#summary").html();
        postsum=postsum.substring(0,postsum.indexOf(" "));
        var posttemp=$("#temperature").html();
        var postdeg=$("#tempdegree").html();
        var postcity=$("#cities").val();
        var poststate=$("#states").val();
        Login(posticon,postsum,posttemp,postdeg,postcity,poststate);
    });
    //Clear Form and Result
    $("#clear").click(function(){
        $("#myForm")[0].reset();
        $("#myForm label.error").html("");
        $(".result").css("display","none");
        $("#cloudMap").html("");
    });
});

//America Timezone List
var tzlist=new Array();
tzlist["America/Adak"]=-9;
tzlist["America/Anchorage"]=-8;
tzlist["America/Boise"]=-6;
tzlist["America/Chicago"]=-5;
tzlist["America/Denver"]=-6;
tzlist["America/Detroit"]=-4;
tzlist["America/Indiana/Indianapolis"]=-5;
tzlist["America/Indiana/Knox"]=-6;
tzlist["America/Indiana/Marengo"]=-5;
tzlist["America/Indiana/Petersburg"]=-5;
tzlist["America/Indiana/Tell_City"]=-6;
tzlist["America/Indiana/Vevay"]=-5;
tzlist["America/Indiana/Vincennes"]=-5;
tzlist["America/Indiana/Winamac"]=-5;
tzlist["America/Juneau"]=-9;
tzlist["America/Kentucky/Louisville"]=-5;
tzlist["America/Kentucky/Monticello"]=-5;
tzlist["America/Los_Angeles"]=-8;
tzlist["America/Menominee"]=-6;
tzlist["America/Metlakatla"]=-8;
tzlist["America/New_York"]=-5;
tzlist["America/Nome"]=-9;
tzlist["America/North_Dakota/Beulah"]=-6;
tzlist["America/North_Dakota/Center"]=-6;
tzlist["America/North_Dakota/New_Salem"]=-6;
tzlist["America/Phoenix"]=-7;
tzlist["America/Sitka"]=-9;
tzlist["America/Yakutat"]=-9;
tzlist["Pacific/Honolulu"]=-10;

//Time Format
function AMPM(date,timezone) {
    if (timezone in tzlist){
        var tz=tzlist[timezone];
        var utc=date.getTime()+(date.getTimezoneOffset()*60000);
        date=new Date(utc+(tz*3600000));
    }
    var hours=date.getHours();
    var minutes=date.getMinutes();
    var ap=hours>=12?'PM':'AM';
    hours=hours%12;
    hours=hours?hours:12;
    hours=hours<10?'0'+hours:hours;
    minutes=minutes<10?'0'+minutes:minutes;
    var timestring=hours+':'+minutes+' '+ap;
    return timestring;
}

//Timezone Conversion
function tzconvert(date,timezone){
    if (timezone in tzlist){
        var tz=tzlist[timezone];
        var utc=date.getTime()+(date.getTimezoneOffset()*60000);
        date=new Date(utc+(tz*3600000));
    }
    return date;
}

//Facebook Login and Post Feed
function Login(iconShow,summary,temp,tu,city,state){
    //Check Login Status
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
    function statusChangeCallback(response) {
        //Already Logged In
        if (response.status === 'connected') {
            FB.ui(
                {
                method: 'feed',
                name: 'Current Weather in '+city+', '+state,
                link: 'http://forecast.io/',
                picture: iconShow,
                caption: 'WEATHER INFORMATION FROM FORECAST.IO',
                description: summary+', '+temp+tu,
                message: ''
                },
                function(response) {
                     if (response && response.post_id) {
                       alert('Post Successfully');
                     } else {
                       alert('Not Posted');
                     }
                }
            );
        } else if (response.status === 'not_authorized') {
            console.log('User cancelled login or did not fully authorize.');
        } else {
            FB.login(function(response) {
               if (response.authResponse) {
                    FB.ui(
                        {
                        method: 'feed',
                        name: 'Current Weather in '+city+', '+state,
                        link: 'http://forecast.io/',
                        picture: iconShow,
                        caption: 'WEATHER INFORMATION FROM FORECAST.IO',
                        description: summary+', '+temp+tu,
                        message: ''
                        },
                        function(response) {
                             if (response && response.post_id) {
                               alert('Post Successfully');
                             } else {
                               alert('Not Posted');
                             }
                        }
                    );
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            },{scope: 'email,user_photos,user_videos'}); 
        }
    }
}
            