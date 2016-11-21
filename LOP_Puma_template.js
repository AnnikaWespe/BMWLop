//Strings
var columnGeaendertVon = "Editor";
var columnGeaendertAm = "Last_x0020_Modified";
var columnErfasstAm = "Created_x0020_Date";
var columnErstelltVon = "Author";
var columnCopyHistory = "wq1z";
var urlInfoSign = '/sites/VSC/SiteCollectionImages/Informationsign.png';
var urlCopySign = "/sites/VSC/SiteCollectionImages/Copy.png";
var bootstrapTooltip = '<a href="#" data-html="true" data-toggle="tooltip" style ="white-space: pre-wrap;min-width: 100px;" title="';
var currentListName;


$(document).ready(function() {
	//get name of current list
	var url = window.location.href;
	var relativeUrl = url.replace("https://vts5.bmwgroup.net", "");
	var $copySigns = $("img[src='" + urlCopySign + "']");
	currentListName = $("#pageTitle").find("a[href='" + relativeUrl + "']").text();

	$SP().list(currentListName).info(function(fields) {
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
		$SP().list(currentListName).get(function(data) {
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
			});
			$SP().lists(function(list) {
				var availableListsSelect = document.createElement("select");
				var numberOfAvailableLists = list.length;
				var typeOfList;
				var indexToCopy;
				availableListsSelect.id = "availableListsSelect";
				//get the select to display only suitable lists for copying
				if (currentListName.indexOf("LOP") !== -1) {
					typeOfList = "LOP";
				} else if (currentListName.indexOf("PUMA") !== -1) {
					typeOfList = "PUMA"
				} else {
					typeOfList = "MeP"
				};
				for (var i = 0; i < numberOfAvailableLists; i++) {
					var currentListChecked = list[i]['Name'];
					if (currentListChecked.indexOf("LOP") !== -1) {
						var option = document.createElement("option");
						option.value = currentListChecked;
						option.text = currentListChecked;
						availableListsSelect.appendChild(option);
					}
				};
				$copySigns.each(function(index, value) {
					$(this).wrap('<a href="#modular" rel="modal:open"></a>');
					$(this).click(function() {
						indexToCopy = index;
					});
				});
				document.getElementById("appendSelectHere").appendChild(availableListsSelect);
				$("#Kopieren").click(function() {
					console.log("Kopiere Index " + indexToCopy + " in Liste " + $("#availableListsSelect").find(":selected").text());
					alert(data[indexToCopy].getAttribute("ID"));
				});
			});
		})
	});
})