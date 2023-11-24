const getTokenHeader = (token) => {
  return token.split(" ")[1];
};

const randomToken = () => {
  return (
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  );
};

const giveCurrentDateTime = () => {
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + ' ' + time;
  return dateTime;
}

module.exports = { getTokenHeader, randomToken, giveCurrentDateTime };
