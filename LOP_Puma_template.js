//Strings
var columnGeaendertVon = "g9fj";
var columnGeaendertAm = "q5hp";
var columnEmail = "Email";
var columnLegende = "f1za";
var columnErfasstAm = "d3o3";
var columnErstelltVon = "Author";
var urlInfoSign = '/sites/VSC/SiteCollectionImages/Informationsign.png';


$(document).ready(function() {
    $SP().list("LOP / Puma Template").info(function(fields) {
        var nameDisplaynameMap = {};
        var displaynameNameMap = {};
        var nameColumnNumberMap = {};
        var infoText = [];
        for (var i = 0; i < fields.length; i++) {
            var key = fields[i]["Name"];
            var value = fields[i]["DisplayName"];
            nameDisplaynameMap[key] = value;
            displaynameNameMap[value] = key;
            nameColumnNumberMap[key] = i;
            console.log(key + "    " + value);
        };
        $SP().list("LOP / Puma Template").get(function(data) {
            var arrayOfHiddenColumns = [columnGeaendertVon, columnGeaendertAm, columnEmail, columnLegende, columnErfasstAm, columnErstelltVon];
            var numberOfHiddenColumns = arrayOfHiddenColumns.length;
            var numberOfRows = data.length;
            for (var j = 0; j < numberOfRows; j++) {
                infoText[j] = "";
                for (var i = 1; i < numberOfHiddenColumns; i++) {
                    var currentColumnName = arrayOfHiddenColumns[i];
                    var currentColumnNumber = nameColumnNumberMap[currentColumnName];
                    var currentColumnDisplayName = nameDisplaynameMap[currentColumnName];
                    var currentEntry = data[j].getAttribute(currentColumnName);
                    if (currentEntry == "null") {
                        currentEntry = " ";
                    };
                    if (currentColumnName == columnErstelltVon) {
                        var helperArray = currentEntry.split("#");
                        currentEntry = helperArray[1];
                    }
                    infoText[j] += currentColumnDisplayName + ": " + currentEntry + "\n";
                }
            };
            var $infoSigns = $("img[src='" + urlInfoSign + "']");
            $infoSigns.each(function(index, value) {
                $(this).wrap('<a href="#" data-toggle="tooltip" title="' + infoText[index] + '"></a>');
                $(this).tooltip();
                $(this).click(function() {
                    alert("you seriously clicked me")
                })
            })
        })
    })
})