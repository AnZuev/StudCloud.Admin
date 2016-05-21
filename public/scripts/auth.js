jQuery(function($){
	Auth.init();

});

var Auth = {

	init: function() {
		//$(".alert-danger").show();
	},
	checkFields: function(){

		var login = $("#login").val();
		var password = $("#password").val();
		if(login.length < 3 || password.length < 5) return false;
		else{
			return {
				login: login,
				password: password
			}
		}
	},
	auth: function(){
		var authInfo = Auth.checkFields();
		if(!authInfo){
			$(".form-group ").each(function (index) {
				if($(this).children('input').val().length < 3){
					$(this).addClass("has-error");
				}else{
					$(this).removeClass("has-error");
				}
			})
		}else{
			$.ajax({
				url: "/auth/signin",
				type: 'POST',
				dataType: 'JSON',
				data: 'login=' + authInfo.login+"&password="+authInfo.password,
				statusCode:{
					200:function(){
						window.location.href = '/';
					},
					401: function(){
						Auth.showError();
					},
					500: function(){

					}
				}
			});
		}

	},
	showError: function(){
		$(".alert-danger").css('visibility', 'visible');
	},

	hideError: function(){
		$(".alert-danger").css('visibility', 'hidden');
	},
	logout: function(){
		$.ajax({
			url: "/auth/logout",
			type: 'POST',
			dataType: 'JSON',
			statusCode:{
				200:function(){
					window.location.href = '/';
				},
				401: function(){
					Auth.showError();
				},
				500: function(){
					console.error("Что-то плохое случилось на сервере");
				}
			}
		});
	}
}