var LOGIN_STATUS = 0;
var LOGIN_INFORMATION = null;
var SERVER_ADDRESS = "http://localhost:11919/api/";

var REGEX_EMAIL = new RegExp("^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$");

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
			Login Events
		*/
		$("#login_button").on("click", function(){
			var username = $("#login_username").val().trim();
			var password = $("#login_password").val().trim();
			var returnFalse = false;
			if(username.length <= 0){
				returnFalse = true;
			}
			if(password.length <= 0){
				returnFalse = true;
			}
			if(returnFalse){
				return false;
			}
			$.ajax({
				type: "GET",
				url: SERVER_ADDRESS + "Login/" + username + "/" + password,
				success: function(data){
					console.log(data);
					accountData = data.user;
					userProfile = data.profile;
					app.setPageNull();
					app.setPage(".Page_Landing");
				},
				error: function(err){
					console.log(err);
				}
			});
		});
		$("#login_createAccount").on("click", function(){
			app.setPageNull();
			app.setPage(".Page_Create");
		});
		
		/*
			Create Account Events
		*/
		$("#createAccount_submit").on("click", function(){
			$("#createAccount_submit").prop("disabled", true);
			var tempUser = {
				Username: $("#createAccount_userName").val(),
				Password: $("#createAccount_password").val(),
				FirstName: $("#createAccount_firstName").val(),
				LastName: $("#createAccount_lastName").val(),
				EmailAddress: $("#createAccount_email").val(),
				Gender: $("#createAccount_gender").val(),
				AccountType: $("#createAccount_type").val()
			};
			app.postRequest(tempUser, "DBUsersApi");
			$("#createAccount_submit").prop("disabled", false);
		});
		$("#createAccount_cancel").on("click", function(){
			app.setPageNull();
			app.setPage(".Page_Login");
		});
		
		/*
			Setup User Profile Events
		*/
		$("#profileSetup_userSetup_addFitnessGoal").on("click", function(){
			$("#profileSetup_userSetup_addFitnessGoal").prop("disabled", true);
			$("#profileSetup_userSetup_goalList").append(
				"<input class='col-xs-12' style='margin-bottom:10px;' type='text' placeholder='Fitness goal...'/>"
			);
			$("#profileSetup_userSetup_addFitnessGoal").prop("disabled", false);
		});
		$("#profileSetup_userSetup_save").on("click", function(){
			$("#profileSetup_userSetup_save").prop("disabled", true);
			$("#profileSetup_userSetup_addFitnessGoal").prop("disabled", true);
			$("#profileSetup_userSetup_skip").prop("disabled", true);
			if($("#profileSetup_userSetup_goalList").children().length > 0){
				var goalArray = [];
				for(var i = 0; i < $("#profileSetup_userSetup_goalList").children().length; i++){
					goalArray.push($($("#profileSetup_userSetup_goalList").children()[i]).val());
				}
				var tempUser = {
					FitnessGoals: goalArray,
					DB_User: accountData.Id
				};
				app.postRequest(tempUser, "DBUserProfilesApi");
			}
			else{
				$("#profileSetup_userSetup_save").prop("disabled", false);
				$("#profileSetup_userSetup_addFitnessGoal").prop("disabled", false);
				$("#profileSetup_userSetup_skip").prop("disabled", false);
			}
		});
		$("#profileSetup_userSetup_skip").on("click", function(){
			app.setPageNull();
			var tempUser = {
				FitnessGoals: null,
				DB_User: accountData.Id
			};
			app.postRequest(tempUser, "DBUserProfilesApi");
			//app.setPage(".Page_Landing");
		});
		
		/*
			Setup Instructor Profile Events
		*/
		$("#profileSetup_instructorSetup_addQualification").on("click", function(){
			$("#profileSetup_instructorSetup_addQualification").prop("disabled", true);
			$("#profileSetup_instructorSetup_qualificationList").append(
				"<input class='col-xs-12' style='margin-bottom:10px;' type='text' placeholder='Qualification...'/>"
			);
			$("#profileSetup_instructorSetup_addQualification").prop("disabled", false);
		});
		$("#profileSetup_instructorSetup_save").on("click", function(){
			$("#profileSetup_instructorSetup_save").prop("disabled", true);
			$("#profileSetup_instructorSetup_addQualification").prop("disabled", true);
			$("#profileSetup_instructorSetup_skip").prop("disabled", true);
			//if($("#profileSetup_instructorSetup_qualificationList").children().length > 0){
				var description = $("#profileSetup_instructorSetup_description").val();
				var qualificationArray = [];
				for(var i = 0; i < $("#profileSetup_instructorSetup_qualificationList").children().length; i++){
					qualificationArray.push($($("#profileSetup_instructorSetup_qualificationList").children()[i]).val());
				}
				var tempUser = {
					Description: description,
					Qualifications: qualificationArray,
					DB_User: accountData.Id
				};
				app.postRequest(tempUser, "DBInstructorProfilesApi");
		});
		$("#profileSetup_instructorSetup_skip").on("click", function(){
			app.setPageNull();
			var tempUser = {
				Description: null,
				Qualifications: [],
				DB_User: accountData.Id
			};
			app.postRequest(tempUser, "DBInstructorProfilesApi");
		});
		
		/*
			Setup Company Profile Events
		*/
		$("#profileSetup_companySetup_save").on("click", function(){
			$("#profileSetup_companySetup_save").prop("disabled", true);
			$("#profileSetup_companySetup_skip").prop("disabled", true);
			var companyName = $("#profileSetup_companySetup_companyName").val();
			var streetAddress = $("#profileSetup_companySetup_streetAddress").val();
			var city = $("#profileSetup_companySetup_city").val();
			var country = $("#profileSetup_companySetup_country").val();
			var tempUser = {
				CompanyName: companyName,
				StreetAddress: streetAddress,
				City: city,
				Country: country,
				DB_User: accountData.Id
			};
			//console.log(tempUser);
			app.postRequest(tempUser, "DBCompanyProfilesApi");
			/*
			$("#profileSetup_companySetup_save").prop("disabled", false);
			$("#profileSetup_companySetup_skip").prop("disabled", false);
			*/
		});
		$("#profileSetup_companySetup_skip").on("click", function(){
			app.setPageNull();
			var tempUser = {
				CompanyName: null,
				StreetAddress: null,
				City: null,
				Country: null,
				DB_User: accountData.Id
			};
			app.postRequest(tempUser, "DBCompanyProfilesApi");
			//app.setPage(".Page_Landing");
		});
		
		/*
			User Account Events
		*/
		
		/*
			Instructor Account Events
		*/
		$("#Page_Landing_Instructor_gotoStudios").on("click", function(){
			app.setInstructorNull();
			app.setInstructorSection("#Landing_Instructor_Studios");
			$("#Landing_Instructor_Studios_gotoCurrent").css("display", "inline-block");
			$("#Landing_Instructor_Studios_gotoInvited").css("display", "inline-block");
			$("#Instructor_Studios_Current").css("display", "inline-block");
			$("#Landing_Instructor_Studios_gotoCurrent").trigger("click");
		});
		$("#Landing_Instructor_Studios_gotoCurrent").on("click", function(){
			$("#Instructor_Studios_Current").css("display", "inline-block");
			$("#Instructor_Studios_Invited").css("display", "none");
			$.ajax({
				type: "GET",
				url: SERVER_ADDRESS + "Instructor/AssocCompanies/" + userProfile.Id,
				success: function(data){
					console.log(data);
					$("#Instructor_Studios_Current").html("");
					for(var i = 0; i < data.length; i++){
						$("#Instructor_Studios_Current").append(
							"<div class='col-xs-12'>" +
								"<h3>" + data[i].CompanyName + "</h3>" +
								"<section class='col-xs-6'>" + 
									"<p>" + data[i].OwnerFirst + " " + data[i].OwnerLast + "<br>" + 
									data[i].EmailAddress + "</p>" + 
								"</section>" + 
								"<section class='col-xs-6'>" +
									"<input id='" + data[i].Id + "' class='btn btn-danger col-xs-12' type='button' value='Quit' onClick='app.quitStudio(this)'/>" + 
								"</section>" + 
							"</div>"
						);
					}
				},
				error: function(err){
					console.error(err);
					$("#Instructor_Studios_Current").html(
						"<span class='col-xs-12' style='text-align:center'>You are not currently listed as working at any companies/studios.</span>"
					);
				}
			});
		});
		$("#Landing_Instructor_Studios_gotoInvited").on("click", function(){
			$("#Instructor_Studios_Current").css("display", "none");
			$("#Instructor_Studios_Invited").css("display", "block");
			$.ajax({
				type: "GET",
				url: SERVER_ADDRESS + "Invitation/Instructor/" + userProfile.Id,
				success: function(data){
					console.log(data);
					$("#Instructor_Studios_Invited").html("");
					for(var i = 0; i < data.length; i++){
						$("#Instructor_Studios_Invited").append(
							"<div class='col-xs-12'>" + 
								"<h3>" + data[i].CompanyName + "</h3>" + 
								"<p>" + data[i].OwnerFirst + " " + data[i].OwnerLast + "<br>" + 
								data[i].EmailAddress + "</p>" + 
								"<input id='" + data[i].Id + "' class='btn btn-success col-xs-12' type='button' value='Accept' onClick='app.acceptOffer(this)'/>" + 
								"<input id='" + data[i].Id + "' class='btn btn-danger col-xs-12' type='button' value='Reject' onClick='app.rejectOffer(this)'/>" + 
							"</div>"
						);
					}
					if(data.length === 0){
						$("#Instructor_Studios_Invited").append(
							"<div class='col-xs-12'>" + 
								"<p>Yiu currently have no pending requests.</p>" + 
							"</div>"
						);
					}
				},
				error: function(err){
					if(err.status === 404){
						alert("User not in database, email sent.");
					}
				}
			});
		});

		/*
			Company Account Events
		*/
		$("#Page_Landing_Company_gotoCompanyInstructors").on("click", function(){
			app.setCompanyNull();
			app.setCompanySection("#Landing_Company_Instructors");
			$("#Landing_Company_Instructors_gotoCurrent").css("display", "inline-block");
			$("#Landing_Company_Instructors_gotoInvite").css("display", "inline-block");
			$("#Landing_Company_Instructors_gotoCurrent").trigger("click");
		});
		$("#Landing_Company_Instructors_gotoCurrent").on("click", function(){
			$("#Company_Instructors_Current").css("display", "inline-block");
			$("#Company_Instructors_Invite").css("display", "none");
			$.ajax({
				type: "GET",
				url: SERVER_ADDRESS + "/Instructor/AssocInstructors/" + userProfile.Id,
				success: function(data){
					console.log(data);
					$("#Company_Instructors_Current_Employed").html("");
					for(var i = 0; i < data.length; i++){
						$("#Company_Instructors_Current_Employed").append(
							"<div class='col-xs-12' style='border:1px solid black; margin-top:5px;'>" + 
								"<h4>" + data[i].FirstName + " " + data[i].LastName + "</h4>" + 
								"<p>" + data[i].Email + "</p>" + 
								"<input id='" + data[i].Id + "' class='btn btn-danger col-xs-12' type='button' value='Terminate?' onClick='app.terminateEmployee(this)'/>" +
							"</div>"
						);
					}
				},
				error: function(err){
					console.error(err);
				}
			});
		});
		$("#Landing_Company_Instructors_gotoInvite").on("click", function(){
			$("#Company_Instructors_Current").css("display", "none");
			$("#Company_Instructors_Invite").css("display", "inline-block");
			$.ajax({
				type: "GET",
				url: SERVER_ADDRESS + "Invitation/" + userProfile.Id,
				success: function(data){
					console.log(data);
					$("#Company_Instructors_Invite_Results").html("");
					for(var i = 0; i < data.length; i++){
						$("#Company_Instructors_Invite_Results").append(
							"<div class='col-xs-12' style='border:1px solid thick; margin-top:5px;'>" + 
								"<h4>" + data[i].FirstName + " " + data[i].LastName + "</h4>" + 
								"<p>" + data[i].Email + "</p>" + 
								"<input id='" + data[i].Id + "' class='btn btn-danger col-xs-12' type='button' value='Revoke' onClick='app.revokeRequest(this)'/>" + 
							"</div>"
						);
					}
				},
				error: function(err){}
			});
		});
		$("#Company_Instructors_Invite_SearchCmd").on("click", function(){
			var input = $("#Company_Instructors_Invite_SearchInput").val();
			if(input.trim().length > 0){
				if(REGEX_EMAIL.test(input)){
					$("#Company_Instructors_Invite_SearchInput_HiddenError").css("display", "none");
					var info = userProfile.Id + "/" + input;
					$.ajax({
						type: "GET",
						url: SERVER_ADDRESS + "Invitation/" + info,
						success: function(data){
							console.log(data);
						},
						error: function(err){
							if(err.status === 404){
								alert("User not in database, email sent.");
							}
						}
					}).done(function(){
						$("#Company_Instructors_Invite_SearchInput").val("");
						$("#Landing_Company_Instructors_gotoInvite").trigger("click");
					});
				}
				else{
					$("#Company_Instructors_Invite_SearchInput_HiddenError").css("display", "inline-block");
					return false;
				}
			}
			else{
				$("#Company_Instructors_Invite_SearchInput_HiddenError").css("display", "inline-block");
				return false;
			}
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
        console.log('Received Event: ' + id);
    },
	setPage: function(pageIdentifierString){
		$(pageIdentifierString).css("display", "inline-block");
		if(pageIdentifierString === ".Page_Landing"){
			app.setupLandingPage();
		}
	},
	setPageNull: function(){
		$("div[class^='Page_']").css("display", "none");
	},
	setupLandingPage: function(){
		//User Account
		if(accountData.AccountType == 0){
			$("#Page_Landing_User").css("display", "inline-block");
		}
		//Instructor Account
		if(accountData.AccountType == 1){
			$("#Page_Landing_Instructor").css("display", "inline-block");
			$("#Page_Landing_Instructor_welcome").html("Welcome, " + accountData.FirstName);
			$("#Page_Landing_Instructor_classesToday").html(
				"<h3>Today</h3>" + 
				"<p>You have no classes today.</p>"
			);
			$("#Page_Landing_Instructor_classesTomorrow").html(
				"<h3>Tomorrow</h3>" + 
				"<p>You have no classes tomorrow.</p>"
			);
		}
		//Company Account
		if(accountData.AccountType == 2){
			$("#Page_Landing_Company").css("display", "inline-block");
			$("#Landing_Company_Main").css("display", "inline-block");
			$("#Page_Landing_Company_welcome").html("Welcome, " + accountData.FirstName);
		}
		$("#Page_Landing_Title").html("FitUIn");
	},
	setInstructorSection: function(instructorSection){
		$(instructorSection).css("display", "inline-block");
	},
	setInstructorNull: function(){
		$("[id^='Landing_Instructor_']").css("display", "none");
	},
	setCompanySection: function(companySection){
		$(companySection).css("display", "inline-block");
	},
	setCompanyNull: function(){
		$("[id^='Landing_Company_']").css("display", "none");
	},
	evalInput: function(input){
		if(input.length > 3){
			return true;
		}
		return false;
	},
	postRequest: function(data, postLocation){
		$.ajax({
			type: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			url: SERVER_ADDRESS + postLocation,
			dataType: "json",
			data: JSON.stringify(data),
			success: function(data){
				//console.log(data);
				if(postLocation === "DBUsersApi"){
					accountData = data;
					//console.log(accountData);
					app.setPageNull();
					app.setPage(".Page_ProfileSetup");
					if(accountData.AccountType == 0){
						$("#profileSetup_userSetup").css("display", "inline-block");
					}
					else if(accountData.AccountType == 1){
						$("#profileSetup_instructorSetup").css("display", "inline-block");	
					}
					else if(accountData.AccountType == 2){
						$("#profileSetup_companySetup").css("display", "inline-block");
					}
				}
				else if(postLocation === "DBUserProfilesApi"){
					userProfile = data;
					//console.log(userProfile);
					app.setPageNull();
					app.setPage(".Page_Landing");
				}
				else if(postLocation === "DBInstructorProfilesApi"){
					userProfile = data;
					//console.log(userProfile);
					app.setPageNull();
					app.setPage(".Page_Landing");
				}
				else if(postLocation === "DBCompanyProfilesApi"){
					userProfile = data;
					console.log(userProfile);
					app.setPageNull();
					app.setPage(".Page_Landing");
				}
			},
			error: function(e){console.error(e);}
		});
	},
	revokeRequest: function(e){
		console.log(e.id);
		$.ajax({
			type: "GET",
			url: SERVER_ADDRESS + "Invitation/RevokeOffer/" + userProfile.Id + "/" + e.id,
			success: function(data){
				console.log(data);
				$("#Landing_Company_Instructors_gotoInvite").trigger("click");
			},
			error: function(err){
				console.error(err);
			}
		});
		$("#Landing_Company_Instructors_gotoInvite").trigger("click");
	},
	acceptOffer: function(e){
		console.log(e);
		$.ajax({
			type: "GET",
			url: SERVER_ADDRESS + "Invitation/AcceptOffer/" + userProfile.Id + "/" + e.id,
			success: function(data){
				console.log(data);
				$("#Landing_Instructor_Studios_gotoCurrent").trigger("click");
			},
			error: function(err){}
		});
	},
	rejectOffer: function(e){
		console.log(e);
		$.ajax({
			type: "GET",
			url: SERVER_ADDRESS + "Invitation/RejectOffer/" + userProfile.Id + "/" + e.id,
			success: function(data){
				console.log(data);
				$("#Landing_Instructor_Studios_gotoInvited").trigger("click");
			},
			error: function(err){
				console.error(err);
			}
		});
	},
	quitStudio: function(e){
		console.log(e.id);
		$.ajax({
			type: "GET",
			url: SERVER_ADDRESS + "Invitation/QuitStudio/" + userProfile.Id + "/" + e.id,
			success: function(data){
				console.log(data);
				$("#Landing_Instructor_Studios_gotoCurrent").trigger("click");
			},
			error: function(err){
				console.error(err);
			}
		});
	},
	terminateEmployee: function(e){
		$.ajax({
			type: "GET",
			url: SERVER_ADDRESS + "Invitation/TerminateEmployee/" + e.id + "/" + userProfile.Id, 
			success: function(data){
				console.log(data);
				$("#Landing_Company_Instructors_gotoCurrent").trigger("click");
			},
			error: function(err){
				console.error(err);
			}
		});
		$("#Landing_Company_Instructors_gotoCurrent").trigger("click");
	}
};

app.initialize();

var accountData = null;
var userProfile = null;

/* GET Invitation */
/*
$.ajax({
	type: "GET",
	url: SERVER_ADDRESS + "Invitation/" + info,
	success: function(data){},
	error: function(err){}
});
*/