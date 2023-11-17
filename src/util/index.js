const getTokenHeader = (token) => {
  return token.split(" ")[1];
};

module.exports = { getTokenHeader };
