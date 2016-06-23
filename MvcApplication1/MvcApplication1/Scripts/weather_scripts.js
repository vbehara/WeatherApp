function dateAdd(date, interval, units) {
    var ret = new Date(date); //don't change original date
    switch (interval.toLowerCase()) {
        case 'year': ret.setFullYear(ret.getFullYear() + units); break;
        case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); break;
        case 'month': ret.setMonth(ret.getMonth() + units); break;
        case 'week': ret.setDate(ret.getDate() + 7 * units); break;
        case 'day': ret.setDate(ret.getDate() + units); break;
        case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
        case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
        case 'second': ret.setTime(ret.getTime() + units * 1000); break;
        default: ret = undefined; break;
    }
    return ret;
}

function formatDateTime(dateTime) {
    var date = dateTime,
    values = date.split(/[^0-9]/),
    year = parseInt(values[0], 10),
    month = parseInt(values[1], 10) - 1,
    day = parseInt(values[2], 10),
    hours = parseInt(values[3], 10),
    minutes = parseInt(values[4], 10),
    seconds = parseInt(values[5], 10),
    formattedDate;

    formattedDate = new Date(year, month, day, hours, minutes, seconds);
    return formattedDate.toString();

}
function getDateAndTime(time) {
    var dt = new Date(time * 1000);
    var hr = dt.getHours();
    if (hr < 10) hr = '0' + hr;
    var mn = dt.getMinutes();
    if (mn < 10) mn = '0' + mn;
    var mon = dt.getMonth() + 1;
    if (mon < 10) mon = '0' + mon;
    var day = dt.getDate();
    if (day < 10) day = '0' + day;
    var year = dt.getFullYear();
    return (year + '.' + mon + '.' + day + ' ' + hr + ':' + mn);
}


function setRiseSet(time) {
    var d = new Date();
    var currentDateLength = d.getTime().toString().length;


    var riseOrSetTimeLength = time.toString().length;

    var finalRiseSet = time.toString();
    if (riseOrSetTimeLength < currentDateLength) {
        var i = 0;

        for (i = 0; i < currentDateLength - riseOrSetTimeLength; i++) {
            finalRiseSet = finalRiseSet + "0";
        }
    }

    return new Date(parseInt(finalRiseSet));

}

function getHrsMins(date) {
    var hr = date.getHours();
    var mn = date.getMinutes();

    var stringFormat = date.toString();
    stringFormat = stringFormat.split(" G");
    if (hr < 10) hr = '0' + hr;

    if (mn < 10) mn = '0' + mn;
    return (hr + ':' + mn + " G" + stringFormat[stringFormat.length - 1]);
}

function getTimeDiff(date) {

    var hr = date.getHours();
    var mn = date.getMinutes();

    var stringFormat = date.toString();
    var i = stringFormat.indexOf('-');
    // stringFormat = stringFormat.split(" GMT");
    if (stringFormat.indexOf('-') >= 0) {

        var hrsMins = stringFormat.split('-');
        if (hrsMins.length > 0) {
            var hrs = hrsMins[1].substring(0, 2);
            var mins = hrsMins[1].substring(2, 4);

        }
        if (hrs > 0)
            date.setHours(hr - hrs);
        if (mins > 0)
            date.setMinutes(mn - mins);

    }
    if (stringFormat.indexOf('+') >= 0) {
        var hrsMins = stringFormat.split('+');
        if (hrsMins.length > 0) {
            var hrs = hrsMins[1].substring(0, 2);
            var mins = hrsMins[1].substring(2, 4);

        }
        if (hrs > 0)
            date.setHours(hr + hrs);
        if (mins > 0)
            date.setMinutes(mn + mins);
    }


    return date;
}

function fnGetCurrentWeather() {
    try {
        var providerSubscriptionId = $('#cityName').val();
        //debugger
        //fnShowAjaxLoader();
        $.ajax(

            {
                type: "GET",
                url: "/Weather/WeatherOfCity",
                contentType: "application/json; charset=utf-8",
                data: { city: providerSubscriptionId },
                dataType: "json",
                async: false,
                cache: false,
                success: function (msg) {
                    var forecast = jQuery.parseJSON(msg);
                    //debugger
                    if (forecast.name != null) {

                        var rise = setRiseSet(forecast.sys.sunrise);
                        var riseTime = getHrsMins(rise);
                        riseTime = riseTime.split(' (');
                        $("table tbody tr td#sunrise").html("");
                        $("table tbody tr td#sunrise").html(riseTime[0]);
                        var set = setRiseSet(forecast.sys.sunset);
                        var setTime = getHrsMins(set);
                        setTime = setTime.split(' (');
                        $("table tbody tr td#sunset").html("");
                        $("table tbody tr td#sunset").html(setTime[0]);
                        var temp = Math.round(10 * (forecast.main.temp)) / 10;

                        var tmin = Math.round(10 * (forecast.main.temp_min)) / 10;
                        var tmax = Math.round(10 * (forecast.main.temp_max)) / 10;
                        var humidity = forecast.main.humidity;


                        var gust = forecast.wind.speed;
                        var deg = forecast.wind.deg;
                        var gustText = "Gentle Breeze";
                        if (gust > 6) {
                            gustText = "Heavy Breeze";
                        }
                        else if (gust > 4) {
                            gustText = "Bit Breezy";
                        }
                        else {
                            gustText = gustText;
                        }

                        $("table tbody tr td#wind").html("");


                        $("table tbody tr td#wind").html(gustText + ' ' + gust + ' m/s <br>' + 'Towards (' + deg.toFixed(2) + '°)');
                        //     Gentle Breeze 4.36 m/s <br>
                        //SouthEast (130.501°)
                        var pressure = forecast.main.pressure;
                        var cloud = forecast.clouds.all;


                        var text = forecast.weather[0].description;
                        var icon = forecast.weather[0].icon;


                        var location = forecast.name;
                        location = location + ',' + forecast.sys.country;

                        $("h3#place").html("");

                        $("h3#place").html(location);

                        var longitude = forecast.coord.lon;
                        var latitude = forecast.coord.lat;

                        $("table tbody tr td#cloudiness").html("");
                        $("table tbody tr td#cloudiness").html(forecast.weather[0].description);
                        var tempHtml = '<img id="imgTemp" style="float: left;" src="/Images/' + forecast.weather[0].icon + '.png"/>';
                        $("h2#temp").html("");
                        $("h2#temp").html(tempHtml + '<p style="margin-top: -10px;font-size: 24px; "> ' + temp + ' °C</p>');
                        $("p#desc").empty();
                        $("p#desc").prepend(forecast.weather[0].main);

                        $("table tbody tr td#coord").html("");
                        $("#coordinates").val("");
                        $("table tbody tr td#coord").html("[ " + latitude.toFixed(2) + ", " + longitude.toFixed(2) + " ]");
                        $("#coordinates").val(latitude + "," + longitude);
                        showReport();
                        showDailyListVertical();
                        activeTab('forecast-main_a');
                        showHideDivs('chart');
                        //var options = '';
                        //var hdnOptions = '';
                        //if (costCenters.CostCenters != null) {
                        //    $.each(costCenters.CostCenters, function (key, value) {
                        //        options = options + "<option value='" + value.Id + "'>" + value.Name + "</option>";
                        //        hdnOptions = hdnOptions + ',' + value.Id;
                        //    });
                        //}
                        //$("[Id$='lstMappedCostCenters']").empty();
                        //$("[Id$='lstMappedCostCenters']").html(options);
                        //$("[id$='']")
                        //$("[Id$='hdnMappedCostCenters']").attr("value", hdnOptions);
                    }
                    else {
                        // give message
                    }
                    //document.getElementById("ajaxPopup").style.display = "none";
                },
                error: function (x, e) {
                    //alert("The call to the server side failed. " + x.responseText + e);
                    //document.getElementById("ajaxPopup").style.display = "none";
                }
            }
                    );
        //$("#imgLoad").hide(100);
        return false;
    }
    catch (err) {
        alert(err);
        //document.getElementById("mask").style.display = "none";
    }
}

function showReport() {
    try {
        
        var coordinatesReport = $('#coordinates').val();
        if (coordinatesReport != "") {
            var latlon = coordinatesReport.split(",");
            var latitude = latlon[0];
            var longitude = latlon[1];
            // $("#imgLoad").show(100);

            $.ajax(
                            {
                                type: "GET",
                                url: "/Weather/WeatherForecast",
                                contentType: "application/json; charset=utf-8",
                                data: { latitude: latitude, longitude: longitude },
                                dataType: "json",
                                async: false,
                                cache: false,
                                success: function (msg) {
                                    var forecast = jQuery.parseJSON(msg);

                                    if (forecast.city.name != null) {

                                        var curdate = new Date();
                                        var html = '';
                                        var cnt = 0;

                                        var time = new Array();
                                        var tmp = new Array();
                                        var wind = new Array();
                                        var prcp = new Array();

                                        for (var i = 0; i < forecast.cnt; i++) {
                                            var dtString = formatDateTime(forecast.list[i].dt_txt);
                                            //Sun Jul 05 2015 21:00:00 GMT-0400 (Eastern Daylight Time)
                                            var dt = new Date(dtString);
                                            if (cnt >= 10) break;
                                            if (curdate <= dt) {
                                                cnt++;
                                                //debugger
                                                var temp = Math.round(10 * (forecast.list[i].main.temp)) / 10;
                                                var tmin = Math.round(10 * (forecast.list[i].main.temp_min)) / 10;
                                                var tmax = Math.round(10 * (forecast.list[i].main.temp_max)) / 10;

                                                var text = forecast.list[i].weather[0].description;
                                                var gust = forecast.list[i].wind.speed;
                                                var pressure = forecast.list[i].main.pressure;
                                                var cloud = forecast.list[i].clouds.all;
                                                var icon = forecast.list[i].weather[0].icon;

                                                if (forecast.list[i].sys.pod == 'd')
                                                    html = html + '<div style="float: left;padding:0.6%; text-align: center;" >';
                                                else
                                                    html = html + '<div style="float: left; padding:0.6%; text-align: center; background-color:#eeeeee" >';

                                                html = html + '<img alt="' + text + '" src="/Images/' + icon + '.png" height="50" width="50"/>\
		                                                        <div class="small_val" title="Temp" style="margin-top: -2px;">' + forecast.list[i].main.temp + ' °C</div>\
		                                                        <div class="small_val" title="Wind">' + forecast.list[i].wind.speed + ' m/s</div>\
		                                                        <div class="small_val_grey" title="Pressure">' + forecast.list[i].main.pressure + '</div>\
		                                                        </div>';

                                                tmp.push(Math.round(10 * (forecast.list[i].main.temp)) / 10);

                                                time.push(dt);
                                                wind.push(forecast.list[i].wind.speed);

                                                var p = 0;
                                                if (forecast.list[i].hasOwnProperty('rain') && forecast.list[i].rain.hasOwnProperty('3h')) p += forecast.list[i].rain['3h'];
                                                if (forecast.list[i].hasOwnProperty('snow') && forecast.list[i].snow.hasOwnProperty('3h')) p += forecast.list[i].snow['3h'];
                                                prcp.push(Math.round(p * 10) / 10);
                                            }

                                        }


                                        $('#chart').highcharts({
                                            chart: {
                                                zoomType: 'xy',
                                                width: 672,
                                                height: 260
                                            },
                                            title: NaN,

                                            xAxis: {
                                                categories: time,
                                                type: 'datetime',
                                                labels: {
                                                    formatter: function () {
                                                        var dt = getTimeDiff(this.value);
                                                        return Highcharts.dateFormat('%H:%M', dt);
                                                    }
                                                }
                                            },
                                            yAxis: [
                                            {
                                                labels: {
                                                    format: '{value}°C',
                                                    style: {
                                                        color: 'blue'
                                                    }
                                                },
                                                opposite: true,
                                                title: NaN
                                            }, {
                                                labels: {
                                                    format: '{value}mm',
                                                    style: {
                                                        color: '#4572A7'
                                                    }
                                                },
                                                opposite: true,
                                                title: NaN
                                            }],
                                            tooltip: {
                                                useHTML: true,
                                                shared: true,
                                                formatter: function () {
                                                    var s = '<small>' + Highcharts.dateFormat('%d %b. %H:%M', this.x) + '</small><table style="border:hidden;">';
                                                    $.each(this.points, function (i, point) {
                                                        s += '<tr style="border:hidden;"><td style="border:hidden;color:' + point.series.color + '">' + point.series.name + ': </td>' +
                                                        '<td style="text-align: right;border:hidden;"><b>' + point.y + '</b></td></tr>';
                                                    });
                                                    return s + '</table>';
                                                }
                                            },
                                            legend: {
                                                layout: 'vertical',
                                                align: 'left',
                                                x: 410,
                                                verticalAlign: 'top',
                                                y: 5,
                                                floating: true,
                                                backgroundColor: '#FFFFFF'
                                            },
                                            series: [
                                            {
                                                name: 'Precipitation',
                                                type: 'column',
                                                color: '#A0A0A0',
                                                yAxis: 1,
                                                data: prcp
                                            }, {
                                                name: 'Temperature',
                                                type: 'spline',
                                                color: 'blue',
                                                data: tmp
                                            }]
                                        });

                                        $("#forecast_small").html(html);

                                    }
                                    else {
                                        // give message
                                    }
                                    //document.getElementById("ajaxPopup").style.display = "none";
                                },
                                error: function (x, e) {
                                    alert("The call to the server side failed. " + x.responseText + e);
                                    //document.getElementById("ajaxPopup").style.display = "none";
                                }
                            }
                        );
        }
        //$("#imgLoad").hide(100);

        return false;
    }
    catch (err) {
        alert(err);
        //document.getElementById("mask").style.display = "none";
    }

}

function hideFnImageLoader() {
    $("#popDiv").attr("style", "display:none;");
    $("#popup").attr("style", "display:none;");

}

function redirectToChat() {
    window.open("/ChatRoom/ChatOnly", "_blank");
}

function getLocation() {
    //debugger
    $('#flagInitialCall').val("1");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {

    try {
        //var providerSubscriptionId = $('#cityName').val();
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        
        //fnShowAjaxLoader();
        $.ajax(
                        {
                            type: "GET",
                            url: "/Weather/WeatherOfCurrentCity",
                            contentType: "application/json; charset=utf-8",
                            data: { latitude: latitude, longitude: longitude },
                            dataType: "json",
                            async: false,
                            cache: false,
                            success: function (msg) {
                                var forecast = jQuery.parseJSON(msg);
                                
                                if (forecast.name != null) {

                                    var rise = setRiseSet(forecast.sys.sunrise);

                                    var riseTime = getHrsMins(rise);

                                    riseTime = riseTime.split(' (');
                                    $("table tbody tr td#sunrise").html(riseTime[0]);
                                    var set = setRiseSet(forecast.sys.sunset);
                                    var setTime = getHrsMins(set);
                                    setTime = setTime.split(' (');
                                    $("table tbody tr td#sunset").html(setTime[0]);
                                    var temp = Math.round(10 * (forecast.main.temp)) / 10;

                                    var tmin = Math.round(10 * (forecast.main.temp_min)) / 10;
                                    var tmax = Math.round(10 * (forecast.main.temp_max)) / 10;
                                    var humidity = forecast.main.humidity;
                                    $("table tbody tr td#humidity").html(humidity + " %");

                                    var gust = forecast.wind.speed;
                                    var pressure = forecast.main.pressure;




                                    $("table tbody tr td#pressure").html(pressure + " hpa");
                                    var cloud = forecast.clouds.all;
                                    var i = 0;
                                    for (i = 0; i < forecast.weather.length; i++) {
                                        var text = forecast.weather[i].description;
                                        var icon = forecast.weather[i].icon;
                                    }

                                    $("table tbody tr td#cloudiness").html(forecast.weather[0].description);
                                    var tempHtml = '<img id="imgTemp" style="float: left;" src="/Images/' + forecast.weather[0].icon + '.png"/>';
                                    $("h2#temp").html(tempHtml + '<p style="margin-top: -10px;font-size: 24px; "> ' + temp + ' °C</p>');

                                    $("p#desc").prepend(forecast.weather[0].main);


                                    var location = forecast.name;
                                    location = location + ',' + forecast.sys.country;
                                    $("h3#place").html(location);

                                    $("table tbody tr td#coord").html("[ " + latitude.toFixed(2) + ", " + longitude.toFixed(2) + " ]");


                                    
                                    var deg = forecast.wind.deg;
                                    var gustText = "Gentle Breeze";
                                    if (gust > 6) {
                                        gustText = "Heavy Breeze";
                                    }
                                    else if (gust > 4) {
                                        gustText = "Bit Breezy";
                                    }
                                    else {
                                        gustText = gustText;
                                    }

                                    $("table tbody tr td#wind").html("");


                                    $("table tbody tr td#wind").html(gustText + ' ' + gust + ' m/s <br>' + 'Towards (' + deg + '°)');
                                    $("#coordinates").val(latitude + "," + longitude);
                                    showReport();
                                    showDailyListVertical();
                                    //$("table tbody tr td#wind").html(forecast.wind.speed + " m/s");
                                }
                                else {
                                    // give message
                                }
                                //document.getElementById("ajaxPopup").style.display = "none";
                            },
                            error: function (x, e) {
                                //alert("The call to the server side failed. " + x.responseText + e);
                                //document.getElementById("ajaxPopup").style.display = "none";
                            }
                        }
                    );
        //$("#imgLoad").hide(100);
        hideFnImageLoader();
        return false;
    }
    catch (err) {
        alert(err);
        //document.getElementById("mask").style.display = "none";
    }

}

function showDailyListVertical() {
    try {
        var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Avg", "Sen", "Oct", "Nov", "Dec"];
        var coordinatesReport = $('#coordinates').val();
        if (coordinatesReport != "") {
            var latlon = coordinatesReport.split(",");
            var latitude = latlon[0];
            var longitude = latlon[1];
            var time_zone = 1000 * (new Date().getTimezoneOffset()) * (-60);
            //fnShowAjaxLoader();
            $.ajax(
                            {
                                type: "GET",
                                url: "/Weather/DailyForecast",
                                contentType: "application/json; charset=utf-8",
                                data: { latitude: latitude, longitude: longitude },
                                dataType: "json",
                                async: false,
                                cache: false,
                                success: function (msg) {
                                    var daily = jQuery.parseJSON(msg);

                                    if (daily.city.name != null) {

                                        var html = '';

                                        for (var i = 0; i < daily.cnt; i++) {
                                            var dt = new Date(daily.list[i].dt * 1000 + time_zone);
                                            var day = dt.getDate() + ' ' + month[dt.getMonth()];

                                            //----DO it from here

                                            //debugger
                                            var temp = Math.round(10 * (daily.list[i].temp.day)) / 10;
                                            var eve = Math.round(10 * (daily.list[i].temp.eve)) / 10;
                                            var morn = Math.round(10 * (daily.list[i].temp.morn)) / 10;
                                            var night = Math.round(10 * (daily.list[i].temp.night)) / 10;
                                            var icon = daily.list[i].weather[0].icon;
                                            var text = daily.list[i].weather[0].description;

                                            html += '<tr><td>' + day + ' <img src="/Images/' + icon + '.png" ></td><td>';
                                            if (temp > 0)
                                                html += '<span class="label label-warning">';
                                            else
                                                html += '<span class="label label-primary">';

                                            html += temp + '°C </span>&nbsp<span class="label label-default">' + night +
                                            '°C </span> &nbsp&nbsp<i>' + text + '</i> <p> ' + daily.list[i].speed + 'm/s <br>clouds: ' + daily.list[i].clouds + '%, ' +
                                                daily.list[i].pressure + ' hpa</p></td></tr>';


                                        }
                                        html = '<table id="nextDays" class="table">' + html + '</table>';

                                        $("#daily_list").html(html);

                                    }
                                    else {
                                        // give message
                                    }
                                    //document.getElementById("ajaxPopup").style.display = "none";
                                },
                                error: function (x, e) {
                                    alert("The call to the server side failed. " + x.responseText + e);
                                    //document.getElementById("ajaxPopup").style.display = "none";
                                }
                            }
                        );
        }
        //$("#imgLoad").hide(100);
        return false;
    }
    catch (err) {
        alert(err);
        //document.getElementById("mask").style.display = "none";
    }


}


function showDailyChart() {
    try {

        var coordinatesReport = $('#coordinates').val();
        if (coordinatesReport != "") {
            var latlon = coordinatesReport.split(",");
            var latitude = latlon[0];
            var longitude = latlon[1];
            var time_zone = 1000 * (new Date().getTimezoneOffset()) * (-60);
            //fnShowAjaxLoader();
            $.ajax(
                            {
                                type: "GET",
                                url: "/Weather/DailyForecast",
                                contentType: "application/json; charset=utf-8",
                                data: { latitude: latitude, longitude: longitude },
                                dataType: "json",
                                async: false,
                                cache: false,
                                success: function (msg) {
                                    var daily = jQuery.parseJSON(msg);

                                    if (daily.city.name != null) {

                                        var time = new Array();
                                        var tmp = new Array();
                                        var tmpr = new Array();
                                        var rain = new Array();
                                        var snow = new Array();


                                        for (var i = 0; i < daily.cnt; i++) {

                                            tmp.push(Math.round(10 * (daily.list[i].temp.day)) / 10);
                                            var dt = new Date(daily.list[i].dt * 1000 + time_zone);
                                            time.push(dt);

                                            var tmpi = Math.round(10 * (daily.list[i].temp.min)) / 10;
                                            var tmpa = Math.round(10 * (daily.list[i].temp.max)) / 10;
                                            tmpr.push([tmpi, tmpa]);


                                            if (daily.list[i].hasOwnProperty('rain')) {
                                                rain.push(Math.round(daily.list[i].rain * 100) / 100);
                                            } else {
                                                rain.push(0);
                                            }
                                            if (daily.list[i].hasOwnProperty('snow')) {
                                                snow.push(Math.round(daily.list[i].snow * 100) / 100);
                                            } else {
                                                snow.push(0);
                                            }
                                        }

                                        $('#chart_daily').highcharts({
                                            chart: {
                                                type: 'column',
                                                width: 672,
                                                height: 330
                                            },
                                            title: NaN,
                                            xAxis: {
                                                categories: time,
                                                labels: {
                                                    formatter: function () {
                                                        return Highcharts.dateFormat('%d %b', this.value);
                                                    }
                                                }
                                            },

                                            yAxis: [
                                            {
                                                labels: {
                                                    format: '{value}°C',
                                                    style: {
                                                        color: 'blue'
                                                    }
                                                },
                                                title: {
                                                    text: 'Temp',
                                                    style: {
                                                        color: 'blue'
                                                    }
                                                }
                                            },
                                            {
                                                labels: {
                                                    format: '{value} mm',
                                                    style: {
                                                        color: '#909090'
                                                    }
                                                },
                                                opposite: true,
                                                title: {
                                                    text: 'Precipitation',
                                                    style: {
                                                        color: '#4572A7'
                                                    }
                                                }
                                            }],
                                            tooltip: {
                                                useHTML: true,
                                                shared: true,
                                                formatter: function () {
                                                    var s = '<small>' + Highcharts.dateFormat('%d %b', this.x) + '</small><table>';
                                                    $.each(this.points, function (i, point) {
                                                        //console.log(point);
                                                        if (point.y != 0)
                                                            s += '<tr><td style="color:' + point.series.color + '">' + point.series.name + ': </td>' +
                                                            '<td style="text-align: right"><b>' + point.y + '</b></td></tr>';
                                                    }
                                                    );
                                                    return s + '</table>';
                                                }
                                            },
                                            plotOptions: {
                                                column: {
                                                    stacking: 'normal'
                                                }
                                            },
                                            legend: NaN,
                                            series: [
                                            {
                                                name: 'Snow',
                                                type: 'column',
                                                color: '#909090',
                                                yAxis: 1,
                                                data: snow,
                                                stack: 'precipitation'
                                            },
                                            {
                                                name: 'Rain',
                                                type: 'column',
                                                color: '#B0B0B0',
                                                yAxis: 1,
                                                data: rain,
                                                stack: 'precipitation'
                                            },
                                            {
                                                name: 'Temperature',
                                                type: 'spline',
                                                color: 'blue',
                                                data: tmp
                                            },
                                            {
                                                name: 'Temperature min',
                                                data: tmpr,
                                                type: 'arearange',
                                                lineWidth: 0,
                                                linkedTo: ':previous',
                                                color: Highcharts.getOptions().colors[0],
                                                fillOpacity: 0.3,
                                                zIndex: 0
                                            }
                                            ]
                                        });

                                    }
                                    else {
                                        // give message
                                    }
                                    //document.getElementById("ajaxPopup").style.display = "none";
                                },
                                error: function (x, e) {
                                    alert("The call to the server side failed. " + x.responseText + e);
                                    //document.getElementById("ajaxPopup").style.display = "none";
                                }
                            }
                        );
        }
        //$("#imgLoad").hide(100);
        return false;
    }
    catch (err) {
        alert(err);
        //document.getElementById("mask").style.display = "none";
    }


}

function showHourlyForecastChart() {

    var curdate = new Date((new Date()).getTime() - 180 * 60 * 1000);

    var cnt = 0;

    var time = new Array();
    var tmp = new Array();
    var wind = new Array();
    var prcp = new Array();

    for (var i = 0; i < forecast.cnt; i++) {

        var dt = new Date(forecast.list[i].dt * 1000);
        if (curdate > dt) continue;
        if (cnt > 10) break;
        cnt++;

        tmp.push(Math.round(10 * (forecast.list[i].main.temp)) / 10);
        time.push(new Date(forecast.list[i].dt * 1000 + time_zone));
        wind.push(forecast.list[i].speed);

        var p = 0;
        if (forecast.list[i]['rain'] && forecast.list[i]['rain']['3h']) p += forecast.list[i]['rain']['3h'];
        if (forecast.list[i]['snow'] && forecast.list[i]['snow']['3h']) p += forecast.list[i]['snow']['3h'];
        prcp.push(Math.round(p * 10) / 10);
    }

    $('#chart_small').highcharts({
        chart: {
            zoomType: 'xy',
        },
        title: NaN,

        xAxis: {
            categories: time,
            type: 'datetime',
            labels: {
                formatter: function () {
                    return Highcharts.dateFormat('%H:%M', this.value);
                }
            }
        },
        yAxis: [
        {
            labels: {
                format: '{value}°C',
                style: {
                    color: 'blue'
                }
            },
            opposite: true,
            title: NaN
        }, {
            labels: {
                format: '{value}mm',
                style: {
                    color: '#4572A7'
                }
            },
            opposite: true,
            title: NaN
        }],
        tooltip: {
            useHTML: true,
            shared: true,
            formatter: function () {
                var s = '<small>' + Highcharts.dateFormat('%d %b. %H:%M', this.x) + '</small><table>';
                $.each(this.points, function (i, point) {
                    s += '<tr><td style="color:' + point.series.color + '">' + point.series.name + ': </td>' +
                    '<td style="text-align: right"><b>' + point.y + '</b></td></tr>';
                });
                return s + '</table>';
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 410,
            verticalAlign: 'top',
            y: 0,
            floating: true,
            backgroundColor: '#FFFFFF'
        },
        series: [
        {
            name: 'Precipitation',
            type: 'column',
            color: '#A0A0A0',
            yAxis: 1,
            data: prcp
        }, {
            name: 'Temperature',
            type: 'spline',
            color: 'blue',
            data: tmp
        }]
    });


}

function activeSubTab(ele) {
    $("ul#subNavChart li").attr("class", "");
    $("ul#subNavChart li#" + ele).attr("class", "subActive");

}

function activeTab(ele) {
    $("ul#mainNav li").attr("class", "");
    $("ul#mainNav li#" + ele).attr("class", "active");
}

function showForcastHourlyListLong() {

    try {

        var coordinatesReport = $('#coordinates').val();
        if (coordinatesReport != "") {
            var latlon = coordinatesReport.split(",");
            var latitude = latlon[0];
            var longitude = latlon[1];
            //fnShowAjaxLoader();
            //var time_zone = 1000 * (new Date().getTimezoneOffset()) * (-60);
            $.ajax(
                            {
                                type: "GET",
                                url: "/Weather/WeatherForecast",
                                contentType: "application/json; charset=utf-8",
                                data: { latitude: latitude, longitude: longitude },
                                dataType: "json",
                                async: false,
                                cache: false,
                                success: function (msg) {
                                    var forecast = jQuery.parseJSON(msg);

                                    if (forecast.city.name != null) {

                                        var curdate = new Date((new Date()).getTime() - 180 * 60 * 1000);
                                        var html = '';
                                        var lastday = 0;

                                        for (var i = 0; i < forecast.cnt; i++) {

                                            if (!forecast.list[i].main) continue;

                                            var dt = new Date(forecast.list[i].dt * 1000);

                                            if (curdate > dt) continue;

                                            var day = dt.getDate();
                                            var hr = dt.getHours();
                                            if (hr < 10) hr = '0' + hr;

                                            if (day != lastday) {
                                                html = html + "<tr class='well'><td colspan='2'><b>" + dt.toDateString() + "</b> </td></tr>";
                                                lastday = day;
                                            }



                                            var temp = Math.round(10 * (forecast.list[i].main.temp)) / 10;
                                            var tmin = Math.round(10 * (forecast.list[i].main.temp_min)) / 10;
                                            var tmax = Math.round(10 * (forecast.list[i].main.temp_max)) / 10;

                                            var text = forecast.list[i].weather[0].description;

                                            var img = forecast.list[i].weather[0].icon;
                                            var gust = 0;
                                            if (forecast.list[i].wind)
                                                gust = forecast.list[i].wind.speed;
                                            var pressure = forecast.list[i].main.pressure;
                                            var cloud = forecast.list[i].clouds.all;

                                            html = html + '<tr><td>' + hr + ':00 <img style="vertical-align: middle;margin-left:10px;" src="/Images/' + img + '.png" > </td><td><span class="badge badge-info">' + temp + '°C </span> <i>' + text + '</i> ' +
                                            '<p> ' + tmin + '°C   ' + tmax + '°C,  ' + gust + 'm/s.  ' + cloud + '%, ' + pressure + ' hpa</p></td></tr>';

                                        }

                                        html = '<table class="table">' + html + '</table>';

                                        $("#hourly_long_list").html(html);

                                    }
                                    else {
                                        // give message
                                    }
                                    //document.getElementById("ajaxPopup").style.display = "none";
                                },
                                error: function (x, e) {
                                    alert("The call to the server side failed. " + x.responseText + e);
                                    //document.getElementById("ajaxPopup").style.display = "none";
                                }
                            }
                        );
        }
        //$("#imgLoad").hide(100);
        return false;
    }
    catch (err) {
        alert(err);
        //document.getElementById("mask").style.display = "none";
    }

}

//**************************** Chart *************************
var chart;


function showForcastChartVal(val) {
    try {

        var coordinatesReport = $('#coordinates').val();
        if (coordinatesReport != "") {
            var latlon = coordinatesReport.split(",");
            var latitude = latlon[0];
            var longitude = latlon[1];
            //fnShowAjaxLoader();
            var time_zone = 1000 * (new Date().getTimezoneOffset()) * (-60);
            $.ajax(
                            {
                                type: "GET",
                                url: "/Weather/WeatherForecast",
                                contentType: "application/json; charset=utf-8",
                                data: { latitude: latitude, longitude: longitude },
                                dataType: "json",
                                async: false,
                                cache: false,
                                success: function (msg) {
                                    var forecast = jQuery.parseJSON(msg);

                                    if (forecast.city.name != null) {


                                        var tmp = new Array();
                                        var tlbl = new Array();


                                        for (var i = 0; i < forecast.list.length; i++) {
                                            if (val == 'temp')
                                                tmp.push(Math.round((forecast.list[i].main.temp) * 100) / 100);
                                            if (val == 'wind_ms')
                                                tmp.push(Math.round(forecast.list[i].wind.speed));
                                            if (val == 'pressure')
                                                tmp.push(Math.round(forecast.list[i].main.pressure));
                                            if (val == 'humidity')
                                                tmp.push(Math.round(forecast.list[i].main.humidity));
                                            if (val == 'precipitation') {

                                                if (forecast.list[i].hasOwnProperty('rain') && forecast.list[i].rain.hasOwnProperty('3h'))
                                                    tmp.push(Math.round(forecast.list[i].rain['3h']));
                                                if (forecast.list[i].hasOwnProperty('snow') && forecast.list[i].snow.hasOwnProperty('3h'))
                                                    tmp.push(Math.round(forecast.list[i].snow['3h']));
                                                else
                                                    tmp.push(0);
                                            }

                                            tlbl.push(new Date(forecast.list[i].dt * 1000 + time_zone));
                                        }
                                       
                                        if (val == 'temp')
                                            label = 'temp';
                                        if (val == 'wind_ms')
                                            label = 'wind';
                                        if (val == 'pressure')
                                            label = 'pressure';
                                        if (val == 'humidity')
                                            label = 'humidity';
                                        if (val == 'precipitation')
                                            label = 'precipitation';

                                        chart = new Highcharts.Chart({
                                            chart: {
                                                renderTo: 'chart-forecast',
                                                type: 'spline'
                                            },
                                            title: {
                                                text: NaN,
                                            },
                                            
                                            tooltip: {
                                                formatter: function () {
                                                    
                                                    if (val == 'temp')
                                                        return '<b>' + this.series.name + " </b><p>" + Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x) + ' ' + this.y + '°C </p>';
                                                    if (val == 'wind_ms')
                                                        return '<b>' + this.series.name + " </b><p>" + Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x) + ' ' + this.y + 'm/s </p>';
                                                    if (val == 'pressure')
                                                        return '<b>' + this.series.name + " </b><p>" + Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x) + ' ' + this.y + 'hpa </p>';
                                                    if (val == 'humidity')
                                                        return '<b>' + this.series.name + " </b><p>" + Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x) + ' ' + this.y + '% </p>';
                                                    if (val == 'precipitation')
                                                        return '<b>' + this.series.name + " </b><p>" + Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x) + ' ' + this.y + 'mm </p>';
                                                }
                                            },
                                            xAxis: {
                                                type: 'datetime',
                                                categories: tlbl,
                                                tickInterval: 7,

                                                labels: {
                                                    formatter: function () {
                                                        return Highcharts.dateFormat('%d', this.value);
                                                    },
                                                    align: 'right',
                                                    style: {
                                                        font: 'normal 13px Verdana, sans-serif'
                                                    }

                                                }
                                            },

                                            yAxis: {
                                                title: {
                                                    text: NaN
                                                },

                                                plotLines: [{
                                                    value: 0,
                                                    width: 1,
                                                    color: '#808080'
                                                }]
                                            },

                                            series: [{
                                                name: label,
                                                type: 'spline',
                                                data: tmp
                                            }
                                            ]

                                        });



                                    }
                                    else {
                                        // give message
                                    }
                                    //document.getElementById("ajaxPopup").style.display = "none";
                                },
                                error: function (x, e) {
                                    alert("The call to the server side failed. " + x.responseText + e);
                                    //document.getElementById("ajaxPopup").style.display = "none";
                                }
                            }
                        );
        }
        //$("#imgLoad").hide(100);
        return false;
    }
    catch (err) {
        alert(err);
        //document.getElementById("mask").style.display = "none";
    }

    //actul

}

function fnMake() {
    $("body").attr("style", "");
}

function showHideDivs(divElement) {
    // debugger

    if (divElement == "forecast-chart") {
        $("#nxtDays").attr("style", "display:none;");
        $("#nxtHrs").attr("style", "display:none;");
        $("div#hourly_long_list").attr("style", "display:none;");
        $("div#chart").attr("style", "display:none;");
        $("div#chart_daily").attr("style", "display:none;");
        $("div#forecast_small").attr("style", "display:none;");
        $("div#daily_list").attr("style", "display:none;");
        $("div#forecast-chart").attr("style", "display:block;float:right;width:70%;");
    }

    if (divElement == "chart") {
        $("div#chart").attr("style", "width: 672px; height: 260px; clear: both; margin-top: -305px; float: right;display:block;");

        
        var brow=$("#brows").val();
        if (brow == "false") {

            $("#nxtHrs").attr("style", "color: inherit; line-height: 1.1; font-family: inherit; font-weight: 600; margin-top: 115px; margin-right: 36%; float: right;display:block;")
            $("#searchCityWeather").attr("style", "float:right;margin-right:-2.3%;");
        }
        else {

            $("#nxtHrs").attr("style", "color: inherit; line-height: 1.1; font-family: inherit; font-weight: 600; margin-top: 115px; margin-right: 33%; float: right;display:block;")
            $("#searchCityWeather").attr("style", "float:right;margin-right:-3.7%;");
        }
        
        $("#nxtDays").attr("style", "margin-top: 35px; margin-right: 554px; float: right;font-family: inherit;font-weight: 600;line-height: 1.1;color: inherit;display:block;")

        $("div#forecast-chart").attr("style", "display:none;");
        $("div#daily_list").attr("style", "width:70%;float:right;margin-right:-9px;display:block;");
        $("div#forecast_small").attr("style", "float:right;clear:both;width:69%;margin-top:-40px;display:block;");
        $("div#hourly_long_list").attr("style", "display:none;");
        $("div#chart_daily").attr("style", "display:none;");

        //$('#chart').find('.highcharts-container').attr("style", "width: 70%; height: 260px;text-align: left; line-height: normal; overflow: hidden; font-family: 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif; font-size: 12px; position: relative; z-index: 0;");
    }
    if (divElement == "hourly_long_list") {
        $("#nxtDays").attr("style", "display:none;");
        $("#nxtHrs").attr("style", "display:none;");
        $("div#chart").attr("style", "display:none;");
        $("div#forecast-chart").attr("style", "display:none;");
        $("div#daily_list").attr("style", "display:none;");
        $("div#forecast_small").attr("style", "display:none;");
        $("div#hourly_long_list").attr("style", "float:right;width:70%;display:block;margin-top:-37%;");
        $("div#chart_daily").attr("style", "display:none;");
    }
    if (divElement == "chart_daily") {
        //none both headings h2----- to be do
        $("div#chart_daily").attr("style", "width: 672px; height: 330px; clear: both; margin-top: -330px; float: right;margin-right:1.5%;display:block;");

        $("#nxtDays").attr("style", "display:none;");
        $("#nxtHrs").attr("style", "display:none;");
        $("div#chart").attr("style", "display:none;");
        $("div#forecast-chart").attr("style", "display:none;");
        $("div#daily_list").attr("style", "display:none;");
        $("div#forecast_small").attr("style", "display:none;");
        $("div#hourly_long_list").attr("style", "display:none;");

        //$('#chart_daily').find('.highcharts-container').attr("style", "width: 70%; height: 330px;text-align: left; line-height: normal; overflow: hidden; font-family: 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif; font-size: 12px; position: relative; z-index: 0;");

    }

    //if (divElement == "chart_daily") {
    //    $("div#" + divElement).attr("style", "display:block;");
    //}
    //if (divElement == "forecast_small") {
    //    $("div#" + divElement).attr("style", "display:block;");
    //}


    //if (divElement == "hourly_long_list") {
    //    $("div#" + divElement).attr("style", "display:block;");
    //}

    //    $("div#" + id).attr("style", "display:none;");


}

function fnShowAjaxLoader() {

}