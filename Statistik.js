$(document).ready(function() {
    var modellStat = {};
    var statusStat = {};
    var ausleitungStat = {};
    var verantwortlicherStat = {};
    var loopVariable = 0;

    var modellStatArray = [
        ['Modell', 'Anzahl']
    ];
    var statusStatArray = [
        ['Status', 'Anzahl']
    ];
    var ausleitungStatArray = [
        ['Ausleitung', 'Anzahl']
    ];
    var verantwortlicherStatArray = [
        ['Verantwortlicher', 'Häufigkeit']
    ];

    $SP().lists(function(list) {
        var numberOfAvailableLists = list.length;
        var availableLopLists = [];
        var numberOfLopLists;
        for (var i = 0; i < numberOfAvailableLists; i++) {
            var currentListName = list[i]['Name'];
            var helperArray = currentListName.split(" ");
            if (helperArray[0] == "LOP" && helperArray[3] != "Scripts") {
                availableLopLists.push(currentListName);
            }
        };
        console.log(availableLopLists);
        numberOfLopLists = availableLopLists.length;
        loopThroughLists(availableLopLists, numberOfLopLists);

        console.log("i: " + i + " on list " + availableLopLists[i]);
    });

    var loopThroughLists = function(listOfLists, maxNumber) {
        $SP().list(listOfLists[loopVariable]).get(function(data) {
            // console.log("i: " + i + " on list " + availableLopLists[i]);
            var numberOfRows = data.length;
            console.log(numberOfRows);
            for (var j = 0; j < numberOfRows; j++) {
                var currentModell = data[j].getAttribute("Modell");
                var currentStatus = data[j].getAttribute("VSC_x002d_Status");
                var currentAusleitung = data[j].getAttribute("Ausleitung");
                var currentVerantwortlicher = data[j].getAttribute("Verantwortlicher");
                //initialize at 1 or increment according object properties 
                modellStat[currentModell] = ++modellStat[currentModell] || 1;
                statusStat[currentStatus] = ++statusStat[currentStatus] || 1;
                ausleitungStat[currentAusleitung] = ++ausleitungStat[currentAusleitung] || 1;
                verantwortlicherStat[currentVerantwortlicher] = ++verantwortlicherStat[currentVerantwortlicher] || 1;
            };
            loopVariable++;
            if (loopVariable < maxNumber) {
                loopThroughLists(listOfLists, maxNumber);
            } else {
                buildArrays(modellStat, statusStat, ausleitungStat, verantwortlicherStat);
            }
        });
    }
    var buildArrays = function(modell, status, ausleitung, verantwortlicher) {
        for (key in modellStat) {
            modellStatArray.push([key, modellStat[key]]);
        };
        for (key in statusStat) {
            statusStatArray.push([key, statusStat[key]]);
        };
        for (key in ausleitungStat) {
            ausleitungStatArray.push([key, ausleitungStat[key]]);
        };
        for (key in verantwortlicherStat) {
            verantwortlicherStatArray.push([key, verantwortlicherStat[key]]);
        };
        console.log(modellStatArray);
        console.log(verantwortlicherStatArray);
        console.log(ausleitungStatArray);
        console.log(statusStatArray);
        console.log(modellStat);
        console.log(statusStat);
        console.log(ausleitungStat);
        console.log(verantwortlicherStat);
        insertData(modellStatArray, statusStatArray, ausleitungStatArray, verantwortlicherStatArray);
    };
})

var insertData = function(modell, status, ausleitung, verantwortlicher) {
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

        var modellData = google.visualization.arrayToDataTable(modell);

        var modellOptions = {
            title: 'Modell'
        };
        var verantwortlicherOptions = {
            title: 'Verantwortlicher'
        };
        var statusOptions = {
            title: 'Status'
        };
        var ausleitungOptions = {
            title: 'Ausleitung'
        };

        var chart = new google.visualization.PieChart(document.getElementById('Modell'));

        chart.draw(modellData, modellOptions);
    }
}