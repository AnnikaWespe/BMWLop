$(document).ready(function() {
	var $offenerPunktRow = $("textarea[title='Offener Punkt']").closest("tr");
	$("input[title='Info']").val("/sites/VSC/SiteCollectionImages/Informationsign.png");
	$("input[title='Kopieren']").val("/sites/VSC/SiteCollectionImages/Copy.png");
	$("input[title='Info']").closest("tr").hide();
	$("input[title='Kopieren']").closest("tr").hide();
	$("textarea[title='Copy History']").closest("tr").hide();
	insertUserTimeStamp();
	createTitle();
	insertTextbaustein();
	duplicateLegendField();
})

var insertUserTimeStamp = function() {
	SP.SOD.executeFunc('sp.js', 'SP.ClientContext', execOperation);
}

var execOperation = function() {
	try {
		var context = new SP.ClientContext();
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

var createTitle = function() {
	var date = new Date();
	var title = date.getTime();
	var $titleField = $("input[title='Titel Pflichtfeld']");
	$titleField.val(title);
	$titleField.closest("tr").hide()
}

var createStamp = function(token) {
	var userNameToken;
	var date = new Date();
	var dd = date.getDate();
	var mm = date.getMonth() + 1;
	var yyyy = date.getFullYear();
	var anmerkungInputFieldAlreadyClicked = 0;
	var $anmerkungInputField = $("textarea[title='** Anmerkung **']");
	var helperParagraph = document.createElement("p");
	if (dd < 10) {
		dd = '0' + dd
	}
	if (mm < 10) {
		mm = '0' + mm
	}
	today = dd + '.' + mm + '.' + yyyy;
	userTimeStamp = document.createTextNode("(" + today + " " + token + ")");
	helperParagraph.appendChild(userTimeStamp);
	$anmerkungInputField.click(function() {
		if (!anmerkungInputFieldAlreadyClicked) {
			$anmerkungInputField.append(helperParagraph);
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
	$("table[id*='Modell']").find("input[type='checkbox']").each(function() {
		var $this = $(this);
		$(this).click
	})
}