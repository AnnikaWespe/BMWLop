var itemAlreadyInMediaPool;
var itemTitel;

$(document).ready(function() {
    $("input[title='Info']").val("/sites/VSC/SiteCollectionImages/Informationsign.png");
    $("input[title='Kopieren']").val("/sites/VSC/SiteCollectionImages/Copy.png");
    $("input[title='Info']").closest("tr").hide();
    $("input[title='Kopieren']").closest("tr").hide();
    $("textarea[title='Copy History']").closest("tr").hide();
    $("input[title='Titel Pflichtfeld']").closest("tr").hide();
    $("select[title*='Offen']").closest("tr").insertBefore($("textarea[title='Offener Punkt']").closest("tr"));
    $("select[title='Legende']").closest("tr").hide();
    $("input[value='Speichern'").click(checkForMediaPool);
    itemAlreadyInMediaPool = $("input[title = 'Doku'").prop("checked");
    itemTitel = $("input[title='Titel Pflichtfeld']").val();
    insertUserTimeStamp();
    insertTextbaustein();
    duplicateLegendField();
    colorMediaPoolElementsBlue();
})


var insertUserTimeStamp = function() {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', execOperation);
}

var execOperation = function() {
    try {
        context = new SP.ClientContext.get_current();
        var web = context.get_web();
        var currentUser = web.get_currentUser();
        var timeStamp;
        var userTimeStamp;
        var today;
        currentUser.retrieve();
        context.load(web);
        context.executeQueryAsync(
            function() { //On success function
                var userObject = web.get_currentUser();
                var loginName = userObject.get_title();
                var helperArray = loginName.split(" ");
                userNameToken = helperArray[1].charAt(0) + helperArray[0].charAt(0);
                createStamp(userNameToken);
            },
            function() { //On fail function
            alert('Error: ' + args.get_message() + '\n' + args.get_stackTrace());
            }
        );
    } catch (err) {
        alert(err);
    }
}


var createStamp = function(token) {
    var userNameToken;
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    var anmerkungInputFieldAlreadyClicked = 0;
    var $anmerkungInputField = $("textarea[title='** Anmerkung **']");
    var timeStampParagraph = document.createElement("p");
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    today = dd + '.' + mm + '.' + yyyy;
    userTimeStamp = document.createTextNode("(" + today + " " + token + ")");
    timeStampParagraph.appendChild(userTimeStamp);
    $anmerkungInputField.click(function() {
        if (!anmerkungInputFieldAlreadyClicked) {
            $anmerkungInputField.append(timeStampParagraph);
            anmerkungInputFieldAlreadyClicked = 1;
        };
    });
}

var insertTextbaustein = function() {
    var $selectTextbaustein = $("select[title*='Offen']");
    var $textareaOffenerPunkt = $("textarea[title='Offener Punkt']");
    $selectTextbaustein.closest("tr").insertBefore($textareaOffenerPunkt);
    $selectTextbaustein.find("option").each(function() {
        var $this = $(this);
        $this.click(function() {
            if ($this.val() != 0) {
                $textareaOffenerPunkt.prepend($this.text() + " ");
            }
        })
    })
}
var duplicateLegendField = function() {
    var $modellTable = $("table[id*='Modell']");
    $modellTable.find("input[type='checkbox']").each(function() {
        var $this = $(this);
        var $thisTableRow = $this.closest("tr");
        var $thisLegend = $("select[title='Legende']").closest("tr").clone();
        var $thisTitle = $this.closest("span").attr("title");
        if ($this.attr("checked")) {
            $thisLegend.show()
        };
        $thisLegend.find("nobr").text("Legende für " + $thisTitle);
        $thisLegend.attr("title", $thisTitle);
        $thisLegend.find("select").attr("title", $thisTitle);
        $modellTable.find("tbody").append($thisLegend);
        $this.click(function() {
            $thisLegend.toggle();
        })
    });
}

var checkForMediaPool = function() {
    // "input[title = 'Doku'").prop("checked")
    // if ($("input[title = 'Doku'").prop("checked")) {
    var copyItemInMediaPool = $("input[title = 'Doku'").prop("checked");
    var $modellTable = $("table[id*='Modell']");
    $modellTable.find("input[type='checkbox']").each(function() {
        var $this = $(this);
        if ($this.prop("checked")) {
            var currentModell = $this.closest("span").attr("title");
            var $thisSelect = $modellTable.find("select[title='" + currentModell + "']");
            var currentLegend = $thisSelect.val();
            if (itemAlreadyInMediaPool && !copyItemInMediaPool) {
                deleteItemFromMediaPool(itemTitel + currentModell);
            } else if (!itemAlreadyInMediaPool && copyItemInMediaPool) {
                createItemForMediaPool(currentModell, currentLegend, false);
            } else if (itemAlreadyInMediaPool && copyItemInMediaPool) {
                createItemForMediaPool(currentModell, currentLegend, true);
            }
        }
    })
}

var createItemForMediaPool = function(model, legend, update) {
    var listItemToCopy = {
        c9dx: model,
        _x0066_uo0: legend,
    };
    listItemToCopy.o2g2 = $("title").text().split(" - ")[0].trim();
    listItemToCopy._x006e_xa6 = $("input[title = 'SA / Part number']").val() || "";
    listItemToCopy.y5hr = $("input[title = 'SA / Teilebezeichnung']").val() || "";
    listItemToCopy.sqsf = $("textarea[title = 'Beschreibung']").val() || "";
    listItemToCopy.Description = $("textarea[title = 'Description']").val() || "";
    listItemToCopy.Verf_x00fc_gbar_x0020_zu = $("select[title = 'Verfügbar zu']").val() || "";
    listItemToCopy.Available_x0020_at = $("select[title='Available at']").val() || "";
    listItemToCopy.Title = itemTitel + model;
    if (update) {
        updateInMediaPool(listItemToCopy, model);
    } else {
        saveInMediaPool(listItemToCopy, model);
    }
}

var saveInMediaPool = function(item, model) {
    $SP().list("LOP MediaPool Liste").add(
        item, {
            error: function(items) {
                alert("Es ist ein Fehler aufgetreten.");
            },
            success: function(items) {
                var idInNewList = items[0].ID;
                alert(model + " erfolgreich im Media Pool angelegt");
            }
        }
    );
}

var updateInMediaPool = function(item, model, title) {
    $SP().list("LOP MediaPool Liste").update(item, {
        where: "Title = '" + itemTitel + model + "'",
        success: function(items) {
        }
    });
}

var deleteItemFromMediaPool = function(title) {
    $SP().list("LOP MediaPool Liste").remove({
        where: "Title = '" + title + "'",
    });
}

var colorMediaPoolElementsBlue = function() {
    $("input[title='Doku']").closest("tr").css("background-color", "#ADD8E6;");
    $("input[title='SA / Teilebezeichnung']").closest("tr").css("background-color", "#ADD8E6;");
    $("input[title='SA / Part number']").closest("tr").css("background-color", "#ADD8E6;");
    $("input[title='Doku']").closest("tr").css("background-color", "#ADD8E6;");
    $("textarea[title='Beschreibung']").closest("tr").css("background-color", "#ADD8E6;");
    $("textarea[title='Description']").closest("tr").css("background-color", "#ADD8E6;");
    $("select[title='Verfügbar zu']").closest("tr").css("background-color", "#ADD8E6;");
    $("select[title='Available at']").closest("tr").css("background-color", "#ADD8E6;");
}