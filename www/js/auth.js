const signup_form = document.querySelector("#signup-form");
const fullnameInput = document.querySelector("#reg-fullname");
const emailInput = document.querySelector("#reg-email");
const passwordInput = document.querySelector("#reg-password");
const btnRegister = document.querySelector("#btn-register");
const errorMessage = document.querySelector("#error-message");
const successMessage = document.querySelector("#success-message");

//LOGIN PAGE VARIABLES
const login_form = document.querySelector("#login-form");
const user_email = document.querySelector("#email");
const user_password = document.querySelector("#password");
const btnLogin = document.querySelector("#btn-login");
const loginErrorMessage = document.querySelector("#login-error-message");
const loginSuccessMessage = document.querySelector("#login-success-message");

//HANDLING SIGN UP FORM
signup_form.addEventListener("submit", function (event) {
	// 1. stop the page from reloading
	event.preventDefault();
	hideAlerts();

	// 2. get values from inputs
	const fullname = fullnameInput.value.trim();
	const email = emailInput.value.trim();
	const password = passwordInput.value;

	btnRegister.disabled = true;
	btnRegister.textContent = "Registering...";

	// 3. call Firebase to create the user
	auth
		.createUserWithEmailAndPassword(email, password)
		.then(function (userCredential) {
			const user = userCredential.user;
			return user.updateProfile({ displayName: fullname }).then(function () {
				return user.sendEmailVerification();
			});
		})

		.then(() => {
			// Everything succeeded
			successMessage.textContent = "Account created! Redirecting to login...";
			successMessage.style.display = "block";

			// Clear the form
			fullnameInput.value = "";
			emailInput.value = "";
			passwordInput.value = "";

			// Wait 2 seconds then go back to login
			//       setTimeout(() => {setTimeout
			//          window.location.href = "index.html";
			//       }, 2000);
		})

		.catch((error) => {
			btnRegister.disabled = false;
			btnRegister.textContent = "Register";

			// Translate Firebase error codes to user-friendly messages
			if (error.code === "auth/email-already-in-use") {
				errorMessage.textContent = "This email is already registered.";
			} else if (error.code === "auth/weak-password") {
				errorMessage.textContent = "Password must be at least 6 characters.";
			} else {
				errorMessage.textContent = error.message;
			}
			errorMessage.style.display = "block";
		});
});

function hideAlerts() {
	errorMessage.style.display = "none";
	successMessage.style.display = "none";
}

//HANDLING LOGIN FORM
login_form.addEventListener("submit", function (event) {
	event.preventDefault();
	hideLoginAlerts();

	const userEmail = user_email.value.trim();
	const userPassword = user_password.value;

	btnLogin.disabled = true;
	btnLogin.textContent = "Logging In...";

	auth
		.signInWithEmailAndPassword(userEmail, userPassword)
		.then(() => {
			// Success — onAuthStateChanged fires automatically
			// and shows the dashboard
			loginSuccessMessage.textContent = "Succsfuly Signed In!";
			loginSuccessMessage.style.display = "block";
		})
		.catch((error) => {
			btnLogin.disabled = false;
			btnLogin.textContent = "Sign In";

			if (error.code === "auth/invalid-credential") {
				loginErrorMessage.textContent = "Invalid email or password.";
			} else if (error.code === "auth/user-not-found") {
				loginErrorMessage.textContent = "No account found with this email.";
			} else {
				loginErrorMessage.textContent = error.message;
			}
			loginErrorMessage.style.display = "block";
		});
});

function hideLoginAlerts() {
	loginErrorMessage.style.display = "none";
	loginSuccessMessage.style.display = "none";
}

//AUTHSTATECHANGE
auth.onAuthStateChanged(function (user) {
	if (user) {
		if (user.emailVerified) {
			document.querySelector("#register-page").style.display = "none";
			document.querySelector("#login-page").style.display = "none";
			document.querySelector("#verify-page").style.display = "none";
			document.querySelector(".app-page").style.display = "flex";
			loadFeed();
			loadMyPosts();
			loadProfile();
			showTab("tab-all");
		} else {
			document.querySelector("#register-page").style.display = "none";
			document.querySelector("#login-page").style.display = "none";
			document.querySelector(".app-page").style.display = "none";
			document.querySelector("#verify-page").style.display = "block";
		}
	} else {
		document.querySelector("#verify-page").style.display = "none";
		document.querySelector(".app-page").style.display = "none";
		document.querySelector("#register-page").style.display = "block";
		document.querySelector("#login-page").style.display = "block";
	}
});



document.querySelector("#go-to-login").addEventListener("click", function(e) {
  e.preventDefault();
  document.querySelector("#register-page").style.display = "none";
  document.querySelector("#login-page").style.display = "flex";
});
document.querySelector("#go-to-signup").addEventListener("click", function(e) {
  e.preventDefault();
  document.querySelector("#login-page").style.display = "none";
  document.querySelector("#register-page").style.display = "flex";
});

document
	.querySelector("#btn-check-verified")
	.addEventListener("click", function () {
		auth.currentUser.reload().then(function () {
			if (auth.currentUser.emailVerified) {
				document.querySelector(".verify-page").style.display = "none";
				document.querySelector(".app-page").style.display = "block";
			} else {
				alert("Still not verified — click the link in your email first.");
			}
		});
	});

// document.querySelector("#btn-logout").addEventListener("click", function () {
// 	auth.signOut();
// });

function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active-tab');
  });
  document.getElementById(tabId).classList.add('active-tab');

  document.querySelectorAll('nav button').forEach(btn => {
    btn.classList.remove('active-nav');
  });
  document.getElementById('nav-' + tabId.replace('tab-', '')).classList.add('active-nav');
}

document.querySelector("#nav-all").addEventListener("click", function () {
	showTab("tab-all");
});

document.querySelector("#nav-mine").addEventListener("click", function () {
	showTab("tab-mine");
});

document.querySelector("#nav-profile").addEventListener("click", function () {
	showTab("tab-profile");
});
