const getTokenHeader = (token) => {
  return token.split(" ")[1];
};

const randomToken = () => {
  return (
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  );
};

module.exports = { getTokenHeader, randomToken };
