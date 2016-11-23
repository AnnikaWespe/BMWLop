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
			console.log(value + " " + key);
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
					var updatedCopyHistory;
					var targetList = $("#availableListsSelect").find(":selected").text();
					var currentId = data[indexToCopy].getAttribute("ID");
					var currentCopyHistory = data[indexToCopy].getAttribute("wq1z");
					var currentTitle = data[indexToCopy].getAttribute("Title");
					var currentKopieren = data[indexToCopy].getAttribute("Kopieren");
					var currentAnmerkung = data[indexToCopy].getAttribute("Anmerkung");
					var currentModell = data[indexToCopy].getAttribute("Modell");
					var currentVscStatus = data[indexToCopy].getAttribute("VSC_x002d_Status");
					var currentVppStatus = data[indexToCopy].getAttribute("VPP_x0020_Status");
					var currentOffenerPunkt = data[indexToCopy].getAttribute("Offener_x0020_Punkt");
					var currentAusleitung = data[indexToCopy].getAttribute("Ausleitung");
					var currentDoku = data[indexToCopy].getAttribute("Doku");
					var currentInfo = data[indexToCopy].getAttribute("Info");
					var currentEmail = data[indexToCopy].getAttribute("Email");
					var currentLegende = data[indexToCopy].getAttribute("f1za");
					var currentErstellt = data[indexToCopy].getAttribute("Created_x0020_Date");
					var currentErstelltVon = data[indexToCopy].getAttribute("Author");
					var currentGeaendertVon = data[indexToCopy].getAttribute("Editor");
					var currentVerantwortlicher = data[indexToCopy].getAttribute("Verantwortlicher");
					var currentGeaendert = data[indexToCopy].getAttribute("Last_x0020_Modified");
					var newCopyHistoryItem = getDate() + " von " + currentListName + " mit ID = " + currentId;
					var entriesToCheck = [currentId, currentCopyHistory, currentTitle, currentAnmerkung, currentKopieren, currentModell, currentVscStatus, currentVppStatus, currentOffenerPunkt, currentAusleitung, currentDoku, currentInfo, currentEmail, currentLegende, currentErstellt, currentErstelltVon, currentGeaendert, currentGeaendertVon, currentVerantwortlicher, currentGeaendert];
					var numberOfEntriesToCheck = entriesToCheck.length;
					for (var i = 0; i < numberOfEntriesToCheck; i++) {
						if (!entriesToCheck[i]) {
							ent
						}
					};
					if (currentCopyHistory != null) {
						updatedCopyHistory = currentCopyHistory + ";" + newCopyHistoryItem;
					} else {
						updatedCopyHistory = newCopyHistoryItem;
					};

					$SP().list(currentListName).update({
						ID: currentId,
						wq1z: updatedCopyHistory
					});
					$SP().list(targetList).add({
						Kopieren: urlCopySign,
						Info: urlInfoSign,
						wq1z: updatedCopyHistory,

						Title: currentTitle,
						Anmerkung: currentAnmerkung,
						Modell: currentModell,
						VSC_x002d_Status: currentVscStatus,
						VPP_x0020_Status: currentVppStatus,
						wq1z: currentCopyHistory,
						Offener_x0020_Punkt: currentOffenerPunkt,
						Ausleitung: currentAusleitung,
						Doku: currentDoku,
						Email: currentEmail,
						f1za: currentLegende,
						Created_x0020_Date: currentErstellt,
						Author: currentErstelltVon,
						Editor: currentGeaendertVon,
						Verantwortlicher: currentVerantwortlicher,
						Last_x0020_Modified: currentGeaendert,
					}, {
						error: function(items) {
							for (var i = 0; i < items.length; i++) console.log("Error '" + items[i].errorMessage + "' with:" + items[i].Title); // the 'errorMessage' attribute is added to the object
						},
						success: function(items) {
							for (var i = 0; i < items.length; i++) console.log("Success for:" + items[i].Title + " (ID:" + items[i].ID + ")");
						}
					})
				});
			});
		})
	});
})


var getDate = function() {
	var date = new Date();
	var dd = date.getDate();
	var mm = date.getMonth() + 1;
	var yy = date.getFullYear().toString().substr(2, 2);
	if (dd < 10) {
		dd = '0' + dd
	}
	if (mm < 10) {
		mm = '0' + mm
	}
	timeStamp = mm + '/' + yy;
	return timeStamp;
}