var googleChartsColors = ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#0099C6", "#DD4477", "#66AA00", "#B82E2E", "#316395", "#994499", "#22AA99", "# AAA11", "#6633CC", "#E67300", "#8B0707", "#329262", "#5574A6", "#3B3EAC"];

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
                var currentModell = data[j].getAttribute("Modell") || "keine Angabe";
                var currentStatus = data[j].getAttribute("VSC_x002d_Status") || "keine Angabe";
                var currentAusleitung = data[j].getAttribute("Ausleitung") || "keine Angabe";
                var currentVerantwortlicher = data[j].getAttribute("Verantwortlicher") || "keine Angabe";
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
        var verantwortlicherData = google.visualization.arrayToDataTable(verantwortlicher);
        var statusData = google.visualization.arrayToDataTable(status);
        var ausleitungData = google.visualization.arrayToDataTable(ausleitung);


        function Options(title) {
            this.title = title;
            this.is3D = true;
            this.width = 300;
            this.height = 200;
            this.chartArea = {
                'width': '100%',
                'height': '100%'
            };
            this.legend = {
                'position': 'none'
            };
            this.pieSliceText = 'label';
        }

        var modellOptions = new Options("Modell");
        var statusOptions = new Options("Status");
        var ausleitungOptions = new Options("Ausleitung");
        var verantwortlicherOptions = new Options("Verantwortlicher");

        var modellChart = new google.visualization.PieChart(document.getElementById('Modell'));
        var verantwortlicherChart = new google.visualization.PieChart(document.getElementById('Verantwortlicher'));
        var statusChart = new google.visualization.PieChart(document.getElementById('Status'));
        var ausleitungChart = new google.visualization.PieChart(document.getElementById('Ausleitung'));

        $(".loader").hide();
        $("#big-table").show();
        modellChart.draw(modellData, modellOptions);
        statusChart.draw(statusData, statusOptions);
        ausleitungChart.draw(ausleitungData, ausleitungOptions);
        verantwortlicherChart.draw(verantwortlicherData, verantwortlicherOptions);

        createTable(modell, "modellTable");
        createTable(status, "statusTable");
        createTable(verantwortlicher, "verantwortlicherTable");
        createTable(ausleitung, "ausleitungTable");
    }
}

var createTable = function(array, id) {
    var tableString = "<tr><th>Farbe</th><th>";
    var numberOfOptions = array.length;
    tableString += array[0][0] + "</th><th>" + array[0][1] + "</th></tr>";
    for (var i = 1; i < numberOfOptions; i++) {
        tableString += "</tr><td class='showColor'><div class = 'showColor' style= 'background-color:" + googleChartsColors[i - 1] + "''></div></td><td>" + array[i][0] + "</td><td>" + array[i][1] + "</td></tr>";
        console.log(array[i][1]);
    }
    $("#" + id).append(tableString);
}