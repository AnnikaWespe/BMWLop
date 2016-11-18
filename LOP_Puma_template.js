//Strings
var columnGeaendertVon = "Editor";
var columnGeaendertAm = "Last_x0020_Modified";
var columnErfasstAm = "Created_x0020_Date";
var columnErstelltVon = "Author";
var columnCopyHistory = "wq1z";
var urlInfoSign = '/sites/VSC/SiteCollectionImages/Informationsign.png';
var urlCopySign = "/sites/VSC/SiteCollectionImages/Copy.png";
var bootstrapTooltip = '<a href="#" data-html="true" data-toggle="tooltip" style ="white-space: pre-wrap;min-width: 100px;" title="';


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
            var arrayOfHiddenColumns = [columnGeaendertAm, columnGeaendertVon, columnErfasstAm, columnErstelltVon, columnCopyHistory];
            var numberOfHiddenColumns = arrayOfHiddenColumns.length;
            var numberOfRows = data.length;
            for (var j = 0; j < numberOfRows; j++) {
                infoText[j] = "";
                for (var i = 0; i < numberOfHiddenColumns; i++) {
                    var currentColumnName = arrayOfHiddenColumns[i];
                    var currentColumnNumber = nameColumnNumberMap[currentColumnName];
                    var currentColumnDisplayName = nameDisplaynameMap[currentColumnName];
                    var currentEntry = data[j].getAttribute(currentColumnName);
                    if (currentEntry == null) {
                        currentEntry = " ";
                    };
                    if (currentColumnName == columnGeaendertVon || currentColumnName == columnErstelltVon || currentColumnName == columnErfasstAm || currentColumnName == columnGeaendertAm) {
                        var helperArray = currentEntry.split("#");
                        currentEntry = helperArray[1];
                    }
                    infoText[j] += currentColumnDisplayName + ": " + currentEntry + "&lt;br /&gt;";
                };
            };
            var $infoSigns = $("img[src='" + urlInfoSign + "']");
            $infoSigns.each(function(index, value) {
                $(this).wrap(bootstrapTooltip + infoText[index] + '"></a>');
                $(this).closest("a").tooltip();
            })
        })
    });
    $SP().lists(function(list) {
        var availableListsSelect = "<select class='availableListsSelect'>";
        var numberOfAvailableLists = list.length;
        var $copySigns = $("img[src='" + urlCopySign + "']");
        for (var i = 0; i < numberOfAvailableLists; i++) {
            availableListsSelect += "<option>" + list[i]['Name'] + "</option>";
        };
        availableListsSelect += "</select>";
        $copySigns.each(function(index, value) {
            $(this).wrap('<a href="#modular' + index + '" rel="modal:open"></a>');
            $(".appendModales").append('<div id="modular' + index + '" style="display:none;">' +
                '<p>In welche Liste möchten Sie die Daten kopieren?</p><p>' + availableListsSelect +
                '</p><a href="#" rel="modal:close"><button class = "btn btn-default">Abbrechen</button></a>' +
                '<button class="btn btn-default" id="Kopiere' + index + '"" style="float: right">Kopieren</button>');
            $("#Kopiere" + index).click(function() {
                console.log("Kopiere Index " + index + " in Liste " + $(".availableListsSelect option:selected").text());

            });
        });
    });

})