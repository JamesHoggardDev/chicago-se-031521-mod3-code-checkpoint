const likeBttn = document.querySelector("button.like-button");
const commForm = document.querySelector("form.comment-form");
const centTitle = document.querySelector("h2.title");
const centImg = document.querySelector("img.image");
const centLikes = document.querySelector("span.likes");
let commUl = document.querySelector("ul.comments");

fetch("http://localhost:3000/images")
  .then((res) => res.json())
  .then((dogArr) => {
    dispOneDog(dogArr[0]);
  });

function dispOneDog(dogObj) {
  centTitle.textContent = dogObj.title;
  centImg.src = dogObj.image;
  centLikes.textContent = `${dogObj.likes} Likes`;
  let lisToRemove = document.querySelectorAll("li");
  lisToRemove.forEach((li) => {
    li.remove();
  });
  fetch("http://localhost:3000/comments")
    .then((res) => res.json())
    .then((commArr) => {
      commArr.forEach((commObj) => renderComm(commObj));
    });
}

function renderComm(commObj) {
  let comment = document.createElement("li");
  comment.textContent = commObj.content;
  comment.dataset.id = commObj.id;
  commUl.append(comment);
}

likeBttn.addEventListener("click", (evt) => {
  let numLikes = parseInt(centLikes.textContent);
  fetch("http://localhost:3000/images/1", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({ likes: numLikes + 1 }),
  })
    .then((res) => res.json())
    .then((dogObj) => {
      centLikes.textContent = `${dogObj.likes} Likes`;
    });
});

commForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  let newComment = {
    id: "",
    imageId: 1,
    content: evt.target.comment.value,
  };
  fetch("http://localhost:3000/comments", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(newComment),
  })
    .then((res) => res.json())
    .then((commObj) => {
      renderComm(commObj);
    });
    commForm.reset()
});

commUl.addEventListener("click", (evt) => {
  if (evt.target.matches("li")) {
    fetch(`http://localhost:3000/comments/${evt.target.dataset.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(evt.target.remove());
  }
});