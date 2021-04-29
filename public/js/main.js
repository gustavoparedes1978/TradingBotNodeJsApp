function changeAnimEase(element){
    console.log(element);
    animEase = element.value;
}

function changeAnimDuration(element){
    animDuration = element.value;
}

function changeChartTheme(element){
    chartTheme = element.value;
}

function changeReversalType(element){
    reversalType = element.value;
}

function changeReversalValue(element){
    reversalValue = element.value;
}

function showBreakPoints(element){
    breakPoints = element.checked;
}

function showLegend(element){
    legend = element.checked;
}

function showBreakPointTooltip(element){
    breakPointTooltips = element.checked;
}

function showBreakPoints(element){
    breakPoints = element.checked;
}

function showBreakPointText(element){
    breakPointText = element.checked;
}

function showAnimation(element){
    animation = element.checked;
}

function showRangePointTooltips(element){
    rangeTooltips = element.checked;
}

function changeCaption(element){
    caption = element.value;
}

function changeSubCaption(element){
    subCaption = element.value;
}

function changeRallyColor(element){
    rallyColor = element.value;
}

function changeRallyThickness(element){
    rallyThickness = element.value;
}

function changeRallyThicknessOnHover(element){
    rallyThicknessOnHover = element.value;
}

function changeDeclineColor(element){
    declineColor = element.value;
}

function changeDeclineThickness(element){
    declineThickness = element.value;
}

function changeDeclineThicknessOnHover(element){
    declineThicknessOnHover = element.value;
}

function changeBreakPointRadius(element){
    breakPointRadius = element.value;
}

function changeBreakPointRadiusOnHover(element){
    breakPointRadiusOnHover = element.value;
}

function changeBreakPointColor(element){
    breakPointColor = element.value;
}

function drawChart(data){
    console.log('drawChart');
    var chartElement = document.getElementById("kagiChart");
    chartElement.innerHTML="";
    var chart_options = {
        "width":window.innerWidth - document.getElementById("settings").offsetWidth - 25,
        "height":500,
        "margin":{top: 75, right: 50, bottom: 100, left: 50},
        "chartTheme":chartTheme,
        "caption": caption,
        "subCaption": subCaption,
        "reversalType": reversalType, // use "diff" for difference in value; use "pct" for percentage change
        "reversalValue": reversalValue,
        "unit": "$",
        "isPrecedingUnit":true,
        "rallyColor": rallyColor,
        "rallyThickness": rallyThickness,
        "rallyThicknessOnHover": rallyThicknessOnHover,
        "declineColor": declineColor,
        "declineThickness": declineThickness,
        "declineThicknessOnHover": declineThicknessOnHover,
        "showBreakPoints":breakPoints,
        "breakPointColor":breakPointColor,
        "breakPointRadius":breakPointRadius,
        "breakPointRadiusOnHover":breakPointRadiusOnHover,
        "showBreakPointText":breakPointText,
        "showBreakPointTooltips":breakPointTooltips,
        "showRangeTooltips":rangeTooltips,
        "showLegend":legend,
        "showAnimation":animation,
        "animationDurationPerTrend":animDuration, // in seconds
        "animationEase":animEase
    }

    KagiChart(data,chart_options); // data is served from data.js
}

var animEase = document.getElementById("animEase").value;
var animDuration = document.getElementById("animDuration").value;
var chartTheme = document.getElementById("chartTheme").value;
var reversalType = document.getElementById("reversalType").value;
var reversalValue = document.getElementById("reversalValue").value;

var caption = document.getElementById("caption").value;
var subCaption = document.getElementById("subCaption").value;

var rallyColor = document.getElementById("rallyColor").value;
var rallyThickness = document.getElementById("rallyThickness").value;
var rallyThicknessOnHover = document.getElementById("rallyThicknessOnHover").value;

var declineColor = document.getElementById("declineColor").value;
var declineThickness = document.getElementById("declineThickness").value;
var declineThicknessOnHover = document.getElementById("declineThicknessOnHover").value;

var breakPointRadius =  document.getElementById("breakPointRadius").value;
var breakPointColor = document.getElementById("breakPointColor").value;
var breakPointRadiusOnHover = document.getElementById("breakPointRadiusOnHover").value;

var legend = document.getElementById("legend").checked;
var breakPoints = document.getElementById("breakPoints").checked;
var breakPointText = document.getElementById("breakPointText").checked;
var breakPointTooltips = document.getElementById("breakPointTooltips").checked;
var rangeTooltips = document.getElementById("rangeTooltips").checked;
var animation = document.getElementById("animation").checked;

