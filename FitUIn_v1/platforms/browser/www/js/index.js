var USER_ACCOUNT = null;
var USER_PROFILE = null;
var BUTTON_CNTRL = true;
//var API_SERVER = "http://capstone-v01.azurewebsites.net/api/";
var API_SERVER = "http://localhost:7964/api/";

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		/*
			DOCUMENT_HEADER event listeners.
		*/
		//Change the current page from PAGE_LOGIN to PAGE_PROFILE_SETUP.
		$("#HEADER_REGISTRATION").on("click", function(){
			app.setHeaderDetails(1);
			app.setPages("#PAGE_PROFILE_SETUP");
		});
		
		/*
			DOCUMENT_BODY event listeners
		*/
		//Attempt to login to a user account. Verify, then submit the information to 
		//	the server.
		$("#LOGIN_Submit").on("click", function(){
			app.clearInputErrors();
			var isValid = true;
			var user = app.getValueTrim("#LOGIN_Username");
			var pass = app.getValueTrim("#LOGIN_Password");
			var regEx = new RegExp("^([a-zA-Z0-9]{3,})$");
			if(!regEx.test(user)){
				isValid = false;
				app.displayMe("#LOGIN_hidden_uError");
			}
			if(!regEx.test(pass)){
				isValid = false;
				app.displayMe("#LOGIN_hidden_pError");
			}
			if(isValid){
				app.clearInputErrors();
				//AJAX
				console.log("VALID");
			}
		});
		//Attempt to create a user account. Verify, then submit the information to 
		//	the server.
		$("#ACCOUNT_Submit").on("click", function(){
			if(BUTTON_CNTRL){
				BUTTON_CNTRL = false;
				app.disableMe("#ACCOUNT_Submit");
			}
			else{
				return;
			}
			app.clearInputErrors();
			var isValid = true;
			var user = app.getValueTrim("#ACCOUNT_Username");
			var pas1 = app.getValueTrim("#ACCOUNT_Password");
			var pas2 = app.getValueTrim("#ACCOUNT_Password2");
			var fNam = app.getValueTrim("#ACCOUNT_NameFirst");
			var lNam = app.getValueTrim("#ACCOUNT_NameLast");
			var emai = app.getValueTrim("#ACCOUNT_Email");
			var phon = app.getValueTrim("#ACCOUNT_Phone");
			var gend = app.getValue("#ACCOUNT_Gender");
			var accT = app.getValue("#ACCOUNT_Type");
			
			//RegEx for username/password
			var regExUP = new RegExp("^([a-zA-Z0-9]{3,})$");
			//RegEx for first/last name
			var regExFL = new RegExp("^([a-zA-Z]{3,})$");
			//RegEx for email
			var regExEm = new RegExp("^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$");
			//RegEx for phone number
			var regExPn = new RegExp("^([0-9]{10})$");
			if(!regExUP.test(user)){
				isValid = false;
				app.displayMe("#ACCOUNT_hidden_uError");
			}
			if(!regExUP.test(pas1)){
				isValid = false;
				app.displayMe("#ACCOUNT_hidden_pError");
			}
			if(pas1 !== pas2){
				isValid = false;
				app.displayMe("#ACCOUNT_hidden_pError2");
			}
			if(!regExFL.test(fNam) || !regExFL.test(lNam)){
				isValid = false;
				app.displayMe("#ACCOUNT_hidden_nError");
			}
			if(!regExEm.test(emai)){
				isValid = false;
				app.displayMe("#ACCOUNT_hidden_eError");
			}
			if(!regExPn.test(phon)){
				isValid = false;
				app.displayMe("#ACCOUNT_hidden_phError");
			}
			if(gend < 0 || gend > 2){
				isValid = false;
				app.displayMe("#ACCOUNT_hidden_gError");
			}
			if(accT < 0 || accT > 2){
				isValid = false;
				app.displayMe("#ACCOUNT_hidden_atError");
			}
			if(isValid){
				app.clearInputErrors();
				USER_ACCOUNT = {
					Username: user,
					Password: pas1,
					FirstName: fNam,
					LastName: lNam,
					EmailAddress: emai,
					PhoneNumber: phon,
					Gender: gend,
					AccountType: accT
				};
				//console.log(USER_ACCOUNT);
				app.postData(
					"DBUsersApi",
					USER_ACCOUNT,
					function(data){
						//console.log(data);
						BUTTON_CNTRL = true;
						app.profileCreation();
						app.enableMe("#ACCOUNT_Submit");
					},
					function(e){
						BUTTON_CNTRL = true;
						//console.log(e.responseText);
						if(e.responseText == "0"){
							app.displayMe("#ACCOUNT_hidden_uError2");
							app.errorCard("Username Taken:", "This username is already in use! Please input a different username.");
						}
						else if(e.responseText == "1"){
							app.displayMe("#ACCOUNT_hidden_eError2");
							app.errorCard("Email Taken:", "This email address is already in use! Please input a different email address.");
						}
						app.enableMe("#ACCOUNT_Submit");
						//console.log(e);
					}
				);
			}
			else{
				BUTTON_CNTRL = true;
				app.enableMe("#ACCOUNT_Submit");
			}
		});
		//Add an additional input for a user to add their fitness goals.
		$("#PROFILE_AddGoal").on("click", function(){
			if(BUTTON_CNTRL){
				BUTTON_CNTRL = false;
				app.disableMe("#PROFILE_AddGoal");
				app.disableMe("#PROFILE_Submit");
			}
			else{
				return;
			}
			$("#PROFILE_USER_FITNESSGOAL").append("<input class='col-xs-12 profile_generatedInput' type='text' placeholder='Fitness goal...'/>");
			BUTTON_CNTRL = true;
			app.enableMe("#PROFILE_AddGoal");
			app.enableMe("#PROFILE_Submit");
		});
		//Add an additional input for an instructor to add another qualification.
		$("#PROFILE_AddQualification").on("click", function(){
			if(BUTTON_CNTRL){
				BUTTON_CNTRL = false;
				app.disableMe("#PROFILE_AddQualification");
				app.disableMe("#PROFILE_Submit");
			}
			else{
				return;
			}
			$("#PROFILE_USER_QUALIFICATIONS").append("<input class='col-xs-12 profile_generatedInput' type='text' placeholder='Qualification...'/>");
			BUTTON_CNTRL = true;
			app.enableMe("#PROFILE_AddQualification");
			app.enableMe("#PROFILE_Submit");
		});
		//Attempt and create the user's profile. Verify, and then submit the 
		//	information to the server.
		$("#PROFILE_Submit").on("click", function(){
			if(BUTTON_CNTRL){
				BUTTON_CNTRL = false;
				app.disableMe("#PROFILE_Submit");
				app.disableMe("#PROFILE_AddGoal");
				app.disableMe("#PROFILE_AddQualification");
			}
			//RegExp for Alpha characters.
			var regExA = new RegExp("^([a-zA-Z]{3,})$");
			//RegExp for AlphaNumeric characters.
			var regExUP = new RegExp("^([a-zA-Z0-9]{3,})$");
			if(USER_ACCOUNT.AccountType == 0){
				var temp = [];
				var goals = $("#PROFILE_USER_FITNESSGOAL").children();
				for(var i = 0; i < goals.length; i++){
					temp.push(app.getValue(goals[i]));
				}
				USER_PROFILE = {
					DBUsername: USER_ACCOUNT.Username,
					Goals: temp
				};
				app.postData(
					"DBUserProfilesApi",
					USER_PROFILE,
					function(data){
						//console.log(data);
						BUTTON_CNTRL = true;
						app.setHeaderDetails(0);
						app.setPages("#PAGE_LOGIN");
						USER_ACCOUNT = null;
						USER_PROFILE = null;
						app.enableMe("#PROFILE_Submit");
						app.enableMe("#PROFILE_AddGoal");
						app.enableMe("#PROFILE_AddQualification");
					},
					function(e){
						BUTTON_CNTRL = true;
						app.enableMe("#PROFILE_Submit");
						app.enableMe("#PROFILE_AddGoal");
						app.enableMe("#PROFILE_AddQualification");
						//console.log(e);
					}
				);
			}
			else if(USER_ACCOUNT.AccountType == 1){
			}
			else if(USER_ACCOUNT.AccountType == 2){
			}
		});
		//Hide the basic error card.
		$("#CARD_BASIC_OK").on("click", function(){
			$("#ERROR_CARD_BASIC").hide();
		});
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		app.setSectionHeights();
        $("#PAGE_DEFAULT h4").html("Application ready...<br>");
		$("#PAGE_DEFAULT h4").append("Checking login status...<br>");
		USER_ACCOUNT = localStorage.getItem("FitUIn_UserAccount");
		USER_PROFILE = localStorage.getItem("FitUIn_UserProfile");
		if(USER_ACCOUNT !== null && USER_PROFILE !== null){
			$("#PAGE_DEFAULT h4").append("User logged in... validating...<br>");
		}
		else{
			$("#PAGE_DEFAULT h4").append("No user logged in... routing...<br>");
			this.setPages("#PAGE_LOGIN");
		}
    },
	setSectionHeights: function(){
		$("#DOCUMENT_HEADER").height($(window).height() * 0.10);
		$("#DOCUMENT_BODY").height($(window).height() * 0.90);
	},
	setHeaderDetails: function(opt){
		//If no one is logged in.
		if(opt === 0){
			$("#HEADER_REGISTRATION").css("display", "inline-block");
		}
		//If someone is logged in, or is setting up a profile.
		else if(opt > 0){
			$("#HEADER_REGISTRATION").css("display", "none");
		}
	},
	setPages: function(pageId){
		app.setPagesNone();
		$(pageId).css("display", "inline-block");
	},
	setPagesNone: function(){
		$("[id^='PAGE_']").css("display", "none");
	},
	clearInputErrors: function(){
		$(".input_error_message").css("display", "none");
	},
	displayMe: function(selector){
		$(selector).css("display", "inline-block");
	},
	hideMe: function(selector){
		$(selector).css("display", "none");
	},
	enableMe: function(selector){
		$(selector).prop("disabled", false);
	},
	disableMe: function(selector){
		$(selector).prop("disabled", true);
	},
	getValue: function(selector){
		return $(selector).val();
	},
	getValueTrim: function(selector){
		return $(selector).val().trim();
	},
	postData: function(api, data, sCallback, eCallback){
		console.log("postData call initializing");
		$.ajax({
			type: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			url: API_SERVER + api,
			dataType: "json",
			data: JSON.stringify(data),
			success: function(data){
				console.log("postData call success");
				sCallback(data);
			},
			error: function(e){
				console.log("postData call error");
				eCallback(e);
			}
		});
	},
	getData: function(api, args, callback){},
	errorCard: function(title, message){
		$("#CARD_BASIC_TITLE").html(title);
		$("#CARD_BASIC_CONTENT").html(message);
		$("#ERROR_CARD_BASIC").show();
	},
	profileCreation: function(){
		app.hideMe("#SETUP_MENU_ACCOUNT");
		app.displayMe("#SETUP_MENU_PROFILE");
		if(USER_ACCOUNT.AccountType == 0){
			app.displayMe("#MENU_PROFILE_USER");
		}
		else if(USER_ACCOUNT.AccountType == 1){
			app.displayMe("#MENU_PROFILE_INSTRUCTOR");
		}
		else if(USER_ACCOUNT.AccountType == 2){
			app.displayMe("#MENU_PROFILE_COMPANY");
		}
	},
	loadLanding: function(){
		if(USER_ACCOUNT.AccountType === 0){}
		else if(USER_ACCOUNT.AccountType === 1){}
		else if(USER_ACCOUNT.AccountType === 2){}
	}
};

app.initialize();