//Strings

$(document).ready(function() {
    $("input[title='Info']").val("/sites/VSC/SiteCollectionImages/Informationsign.png");
    $("input[title='Kopieren']").val("/sites/VSC/SiteCollectionImages/Copy.png");
    $("input[title='Info']").closest("tr").hide();
    $("input[title='Kopieren']").closest("tr").hide();
    $("textarea[title='Copy History']").closest("tr").hide();
    $("input[title='Titel Pflichtfeld']").closest("tr").hide()
    $("select[title*='Offen']").closest("tr").insertBefore($("textarea[title='Offener Punkt']").closest("tr"));
    insertUserTimeStamp();
    insertTextbaustein();
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