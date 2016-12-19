$(document).ready(function() {
    $SP().lists(function(list) {
        var numberOfLists = list.length;
        var listsAvailableForDelete = [];
        var numberOfListsAvailableForDelete = 0;
        for (var i = 0; i < numberOfLists; i++) {
            var currentList = list[i]['Name'];
            if (currentList.indexOf("LOP") !== -1 || currentList.indexOf("PUMA") !== -1 || currentList.indexOf("MeP") !== -1) {
                if (currentList.indexOf("Scripts") == -1) {
                    listsAvailableForDelete.push(currentList);
                    numberOfListsAvailableForDelete++;
                }
            }
        };
        createListSelect(listsAvailableForDelete, numberOfListsAvailableForDelete);
        confirmDelete();
    });

});


var createListSelect = function(listArray, number) {
    var availableListsSelect = document.createElement("select");
    availableListsSelect.id = "my_availableListsSelect";
    var defaultOption = document.createElement("option");
    defaultOption.text = "...";
    availableListsSelect.appendChild(defaultOption);
    for (var i = 0; i < number; i++) {
        var option = document.createElement("option");
        var currentList = listArray[i]
        option.value = currentList;
        option.text = currentList;
        availableListsSelect.appendChild(option);
    };
    document.getElementById("appendSelectHere").appendChild(availableListsSelect);
}

var confirmDelete = function() {
    var $select = $("#my_availableListsSelect");
    $select.change(function() {
        var $deleteButton = $("#Delete");
        var selectedList = $select.val();
        $deleteButton.removeClass("disabled");
        $deleteButton.click(function() {
            var proceedDelete = confirm('Wollen Sie wirklich alle Elemente in der Liste ' + selectedList + " löschen?");
            if (proceedDelete) {
                deleteItemsInList(selectedList);
            }
        })
    })
}

var deleteItemsInList = function(listName) {
    var ctx = SP.ClientContext.get_current(),
        list = ctx.get_web().get_lists().getByTitle(listName),
        query = new SP.CamlQuery(),
        items = list.getItems(query);
    ctx.load(items, "Include(Id)");
    ctx.executeQueryAsync(function() {
        var enumerator = items.getEnumerator(),
            simpleArray = [];
        while (enumerator.moveNext()) {
            simpleArray.push(enumerator.get_current());
        }
        for (var s in simpleArray) {
            simpleArray[s].deleteObject();
        }
        ctx.executeQueryAsync();
    });
    alert("Alle Einträge in der Liste " + listName + " wurden gelöscht.")
}