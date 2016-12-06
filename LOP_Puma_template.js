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
var dummyAttachmentUrl;


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
		var $infoSigns = $("img[src='" + urlInfoSign + "']");
		$infoSigns.each(function(index, value) {
			var $this = $(this);
			var currentIndex = index;
			$this.mouseover(function(index) {
				$SP().list(currentListName).get(function(data) {
					var arrayOfHiddenColumns = [columnGeaendertAm, columnGeaendertVon, columnErfasstAm, columnErstelltVon, columnCopyHistory];
					var arrayOfColumnsWithAestheticProblems = [columnGeaendertVon, columnErstelltVon, columnErfasstAm, columnGeaendertAm];
					var numberOfHiddenColumns = arrayOfHiddenColumns.length;
					var infoText = "";
					for (var i = 0; i < numberOfHiddenColumns; i++) {
						var currentColumnName = arrayOfHiddenColumns[i];
						var currentColumnNumber = nameColumnNumberMap[currentColumnName];
						var currentColumnDisplayName = nameDisplaynameMap[currentColumnName];
						var currentEntry = data[currentIndex].getAttribute(currentColumnName);
						if (currentEntry == null) {
							currentEntry = " ";
						};
						if (arrayOfColumnsWithAestheticProblems.indexOf(currentColumnName) !== -1) {
							var helperArray = currentEntry.split("#");
							currentEntry = helperArray[1];
						}
						infoText += currentColumnDisplayName + ": " + currentEntry + "&lt;br /&gt;";
					};
					$this.wrap(bootstrapTooltip + infoText + '"></a>');
					$this.closest("a").tooltip();
				})
			})
		});


		$SP().list(currentListName).get(function(data) {
			var arrayOfColumnsWithAestheticProblems = [columnGeaendertVon, columnErstelltVon, columnErfasstAm, columnGeaendertAm];
			var numberOfRows = data.length;
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
					if (currentListChecked.indexOf(typeOfList) !== -1) {
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
					var listItemToCopy = {};
					var rowsToCopy = ["wq1z", "Title", "Anmerkung", "Modell", "VSC_x002d_Status", "VPP_x0020_Status", "Offener_x0020_Punkt", "Ausleitung", "Doku", "Email", "f1za", "Created_x0020_Date", "Author", "Editor", "Verantwortlicher", "Last_x0020_Modified"]
					var numberOfRowsToCopy = rowsToCopy.length;
					var targetList = $("#availableListsSelect").find(":selected").text();
					var currentId = data[indexToCopy].getAttribute("ID");
					var currentCopyHistory = data[indexToCopy].getAttribute("wq1z");
					var currentTitle = data[indexToCopy].getAttribute("Title");
					var attachmentHelper = (data[indexToCopy].getAttribute("Attachments")).split(";#")[1];
					var newCopyHistoryItem = " " + getDate() + " von " + currentListName + " mit ID = " + currentId;
					if (currentCopyHistory != null) {
						updatedCopyHistory = currentCopyHistory + ";" + newCopyHistoryItem;
					} else {
						updatedCopyHistory = newCopyHistoryItem;
					};
					for (var i = 0; i < numberOfRowsToCopy; i++) {
						var currentColumnName = rowsToCopy[i];
						var currentEntry = data[indexToCopy].getAttribute(currentColumnName);
						if (currentEntry == null) {
							currentEntry = "";
						};
						if (arrayOfColumnsWithAestheticProblems.indexOf(currentColumnName) !== -1) {
							var helperArray = currentEntry.split("#");
							currentEntry = helperArray[1];
						}
						listItemToCopy[rowsToCopy[i]] = currentEntry;
					};
					$SP().list(currentListName).update({
						ID: currentId,
						wq1z: updatedCopyHistory,
					});
					listItemToCopy.Kopieren = urlCopySign;
					listItemToCopy.Info = urlInfoSign;
					listItemToCopy.wq1z = updatedCopyHistory;
					$SP().list(targetList).add(
						listItemToCopy, {
							error: function(items) {
								$("button#Abbrechen").click();
								alert("Es ist ein Fehler aufgetreten.");
							},
							success: function(items) {
								var idInNewList = items[0].ID;
								if (attachmentHelper) {
									var context = new SP.ClientContext();
									var attachmentsOriginUrl = attachmentHelper.split(".net")[1].split("/Attachments/")[0] + "/Attachments/" + currentId;
									console.log(attachmentsOriginUrl);
									createAttachmentFolder(attachmentsOriginUrl, targetList, idInNewList);
								}
							}
						}
					);
				});
			});
		})
	});
})
var createAttachmentFolder = function(attachmentsOriginUrl, targetList, idInNewList) {
	$SP().list(targetList).addAttachment({
		ID: idInNewList,
		filename: "dummyAttachment.txt",
		attachment: "U2hhcmVwb2ludFBsdXMgUm9ja3Mh",
		after: function(fileUrl) {
			dummyAttachmentUrl = fileUrl;
			console.log(fileUrl);
			copyAttachments(attachmentsOriginUrl, targetList, idInNewList)
		}
	});
}



var copyAttachments = function(attachmentsOriginUrl, targetList, idInNewList) {
	alert("copyAttachments");
	var context = new SP.ClientContext();
	var web = context.get_web();
	var srcFolder = web.getFolderByServerRelativeUrl(attachmentsOriginUrl);
	var attachments = srcFolder.get_files();
	$("button#Abbrechen").click();
	alert("Erfolgreich kopiert");
	context.load(attachments);
	context.executeQueryAsync(
		function() {
			var numberOfAttachments = attachments.get_count();
			var dummy = web.getFileByServerRelativeUrl(dummyAttachmentUrl);
			dummy.deleteObject();
			for (var i = 0; i < numberOfAttachments; i++) {
				var currentFile = attachments.getItemAtIndex(i);
				var currentFileName = currentFile.get_name();
				var targetUrl = "/sites/VSC/Lists/" + targetList + "/Attachments/" + idInNewList + "/" + currentFileName;
				console.log("targetUrl: " + targetUrl);
				console.log(currentFileName);
				currentFile.copyTo(targetUrl, false);
				context.executeQueryAsync(
					function() {
						console.log(currentFileName + " copied");
					},
					function(sender, args) {
						//onQueryFailed(sender, args);
					}
				);
			};
		},
		function() {
			alert('Es gab ein Problem beim Kopieren der Anhänge: ' + args.get_message() + '\n' + args.get_stackTrace());
		}
	);
}

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