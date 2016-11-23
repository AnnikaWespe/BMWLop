//Strings

$(document).ready(function() {
    $("input[title='Info']").val("/sites/VSC/SiteCollectionImages/Informationsign.png");
    $("input[title='Kopieren']").val("/sites/VSC/SiteCollectionImages/Copy.png");
    $("input[title='Info']").closest("tr").hide();
    $("input[title='Kopieren']").closest("tr").hide();
    $("input[title='Copy History']").closest("tr").hide();
    $("input[title='Titel Pflichtfeld']").closest("tr").hide()
    $(".ms-rtestate-field p, p.ms-rteElement-P").css("line-height", "1");
    insertUserTimeStamp();
})

var insertUserTimeStamp = function() {
    var context = new SP.ClientContext.get_current();
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

}

var createStamp = function(token) {
    var userNameToken;
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    var anmerkungInputFieldAlreadyClicked = 0;
    var $anmerkungInputField = $(".ms-rtestate-write.ms-rteflags-0.ms-rtestate-field").filter("[id*=Anmerkung]");
    var timeStampParagraph = document.createElement("p");
    $anmerkungInputField.css('line-height: 1;');
    timeStampParagraph.style.cssText = "style='line-height: 1;'"
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