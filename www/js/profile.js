function loadProfile() {
  const user = auth.currentUser;
  document.querySelector("#profile-name").textContent = "Name: " + user.displayName;
  document.querySelector("#profile-email").textContent = "Email: " + user.email;
  document.querySelector("#profile-avatar-initial").textContent = user.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : "?";

  db.collection("users").doc(user.uid).get().then(function (doc) {
    if (doc.exists) {
      const data = doc.data();
      document.querySelector("#profile-bio").value = data.bio || "";
      document.querySelector("#profile-phone").value = data.phone || "";
      document.querySelector("#profile-location").value = data.location || "";

      if (data.profilePic) {
        document.querySelector("#profile-pic-preview").src = "data:image/jpeg;base64," + data.profilePic;
        document.querySelector("#profile-pic-preview").style.display = "block";
      }
    }
  });
}

document
	.querySelector("#profile-form")
	.addEventListener("submit", function (event) {
		event.preventDefault();
		const user = auth.currentUser;

		const bio = document.querySelector("#profile-bio").value.trim();
		const phone = document.querySelector("#profile-phone").value.trim();
		const location = document.querySelector("#profile-location").value.trim();

		const btnSave = document.querySelector("#btn-save-profile");
		btnSave.disabled = true;
		btnSave.textContent = "Saving...";
		const updateData = {
			bio: bio,
			phone: phone,
			location: location,
		};

		if (profilePicBase64) {
			updateData.profilePic = profilePicBase64;
		}

		db.collection("users")
			.doc(user.uid)
			.set(updateData, { merge: true })

			// merge: true means it won't overwrite other fields you might add later
			.then(function () {
				const msg = document.querySelector("#profile-save-message");
				msg.textContent = "Profile saved!";
				msg.style.display = "block";
			})
			.catch(function (error) {
				alert("Error saving profile: " + error.message);
			})
			.finally(function () {
				btnSave.disabled = false;
				btnSave.textContent = "Save Profile";
			});
	});

let profilePicBase64 = null;

document
	.querySelector("#btn-profile-pic")
	.addEventListener("click", function () {
		document.querySelector("#profile-pic-upload").click();
	});

document
	.querySelector("#profile-pic-upload")
	.addEventListener("change", function (event) {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = function () {
			document.querySelector("#profile-pic-preview").src = reader.result;
			document.querySelector("#profile-pic-preview").style.display = "block";
			profilePicBase64 = reader.result.split(",")[1];
		};
		reader.readAsDataURL(file);
	});

document
	.querySelector("#profile-btn-logout")
	.addEventListener("click", function () {
		auth.signOut();
	});
