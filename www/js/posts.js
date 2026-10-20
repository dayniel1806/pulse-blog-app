function renderPostCard(post, postId) {
  const card = document.createElement("div");
  card.className = "post-card";

  const user = auth.currentUser;
  const likedBy = post.likedBy || [];
  const alreadyLiked = likedBy.includes(user.uid);
  const timestamp = post.createdAt ? post.createdAt.toDate().toLocaleString() : "";

  card.innerHTML = `
    <img src="data:image/jpeg;base64,${post.image}" alt="${post.title}">
    <div class="post-card-body">
      <h3 class="post-card-title">${post.title}</h3>
      <p class="post-card-content">${post.content.substring(0, 100)}...</p>
      <div class="post-card-meta">
        <span class="post-card-author">${post.bloggerName}</span>
        <span>${timestamp}</span>
      </div>
      <div style="display:flex; align-items:center; gap:10px; margin-top:10px;">
        <button class="spark-btn ${alreadyLiked ? 'sparked' : ''}" data-id="${postId}">
          ⚡ ${alreadyLiked ? 'Sparked' : 'Spark'} · ${likedBy.length}
        </button>
        <button class="read-more-btn" data-id="${postId}">Read More</button>
      </div>
    </div>
  `;
  return card;
}




document.querySelector("#btn-publish").addEventListener("click", function() {
  const title = document.querySelector("#post-title").value.trim();
  const content = document.querySelector("#post-content").value.trim();
  const user = auth.currentUser;

  if (!title || !content) {
    alert("Please add a title and content.");
    return;
  }
  if (!capturedImageBase64) {
    alert("Please take a photo or upload one first.");
    return;
  }

  const btnPublish = document.querySelector("#btn-publish");
  btnPublish.disabled = true;
  btnPublish.textContent = "Posting...";

  db.collection("posts").add({
    title: title,
    content: content,
    image: capturedImageBase64,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    bloggerId: user.uid,
    bloggerName: user.displayName,
    likedBy: []
  })
  .then(function() {
    alert("Post published!");
    document.querySelector("#post-title").value = "";
    document.querySelector("#post-content").value = "";
    capturedImageBase64 = null;
    document.querySelector("#captured-preview").style.display = "none";
  })
  .catch(function(error) {
    alert("Error posting: " + error.message);
  })
  .finally(function() {
    btnPublish.disabled = false;
    btnPublish.textContent = "Publish Post";
  });
});



function openPostDetail(post) {
  document.querySelector("#detail-image").src = "data:image/jpeg;base64," + post.image;
  document.querySelector("#detail-title").textContent = post.title;
  document.querySelector("#detail-content").textContent = post.content;
  document.querySelector("#detail-author").textContent = "By " + post.bloggerName;
  document.querySelector("#detail-time").textContent = post.createdAt
    ? post.createdAt.toDate().toLocaleString()
    : "";

  document.querySelector(".app-page").style.display = "none";
  document.querySelector("#post-detail-screen").style.display = "block";
}

document.querySelector("#btn-back-to-feed").addEventListener("click", function() {
  document.querySelector("#post-detail-screen").style.display = "none";
  document.querySelector(".app-page").style.display = "block";
});




function loadFeed() {
  const feedContainer = document.querySelector("#feed-container");

  db.collection("posts")
    .orderBy("createdAt", "desc")
    .onSnapshot(function(snapshot) {
      feedContainer.innerHTML = "";
      snapshot.forEach(function(doc) {
        const post = doc.data();
        feedContainer.appendChild(renderPostCard(post, doc.id));
      });
    });
}


function loadMyPosts() {
  const user = auth.currentUser;
  const container = document.querySelector("#myposts-container");

  db.collection("posts")
    .where("bloggerId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .onSnapshot(function(snapshot) {
      container.innerHTML = "";
      snapshot.forEach(function(doc) {
        const post = doc.data();
        container.appendChild(renderPostCard(post, doc.id));
      });
    }, function(error) {
      console.log("My posts error:", error);
    });
}


document.querySelector("#feed-container").addEventListener("click", function(event) {
  if (event.target.classList.contains("read-more-btn")) {
    const postId = event.target.dataset.id;
    db.collection("posts").doc(postId).get().then(function(doc) {
      openPostDetail(doc.data());
    });
  }
});

document.querySelector("#myposts-container").addEventListener("click", function(event) {
  if (event.target.classList.contains("read-more-btn")) {
    const postId = event.target.dataset.id;
    db.collection("posts").doc(postId).get().then(function(doc) {
      openPostDetail(doc.data());
    });
  }
});


document.querySelector("#feed-container").addEventListener("click", handleSparkClick);
document.querySelector("#myposts-container").addEventListener("click", handleSparkClick);

function handleSparkClick(event) {
  if (!event.target.classList.contains("spark-btn")) return;

  const postId = event.target.dataset.id;
  const user = auth.currentUser;
  const postRef = db.collection("posts").doc(postId);

  postRef.get().then(function(doc) {
    const likedBy = doc.data().likedBy || [];
    if (likedBy.includes(user.uid)) {
      postRef.update({ likedBy: firebase.firestore.FieldValue.arrayRemove(user.uid) });
    } else {
      postRef.update({ likedBy: firebase.firestore.FieldValue.arrayUnion(user.uid) });
    }
  });
}



