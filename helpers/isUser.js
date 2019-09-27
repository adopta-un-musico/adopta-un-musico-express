/* eslint-disable no-else-return */
const hbs = require('hbs');

const isUser = hbs.registerHelper('isUser', (username, user) => {
  if(username === user) {
    const userChat = `<p class="user">
    {{username}}: {{message}}
    </p>`;
    return userChat;
  } else {
    const otherUserChat = `<p class="other-user">
    {{username}}: {{message}}
    </p>`;
    return otherUserChat;
  }
});

module.exports = isUser;
