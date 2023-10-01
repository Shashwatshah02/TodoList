// This shows the method 1 to the same
// module.exports = getDate;

// function getDate() {
//   const date = new Date();
//   const options = {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//   };

//   var day = date.toLocaleDateString("en-US", options);
//   return day;
// }

// Method 2
exports.getDate = () => {
  const date = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return date.toLocaleDateString("en-US", options);
};
