'use strict';

const socket = io();

const formatAnnounce = (text) => {
  if (text.length <= 100) {
    return text
  } else {
    return text.slice(0, 100) + `...`;
  }
};

const popularPosts = document.querySelector(`.hot__list`);
const recentComments = document.querySelector(`.last__list`);

const updatePosts = (mostPopular) => {
  popularPosts.innerHTML = mostPopular.map((postInTrend) => {
    return `<li class="hot__list-item">
      <a class="hot__list-link" href="/articles/${postInTrend.id}">
        ${formatAnnounce(postInTrend.announce)} <sup class="hot__link-sup">${postInTrend.comments.length}</sup>
      </a>
    </li>`
  }).join(``);
}

const updateComments = (lastComments) => {
  recentComments.innerHTML = lastComments.map((comment) => {
    return `<li class=last__list-item>
        ${comment.users.avatar ? `<img class="last__list-image" src=img/${comment.users.avatar} width="20" height="20" alt="Аватар пользователя">` : ``}
        <b class="last__list-name">${comment.users.firstName} ${comment.users.lastName}</b>
        <a class="last__list-link" href="/articles/${comment.posts.id}">${comment.text}</a>
      </li>`}
  ).join(``);
}

socket.on(`comment`, async (data) => {
  const {posts, comments} = data;

  updatePosts(posts);
  updateComments(comments);
});

