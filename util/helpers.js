module.exports = {
  // add helper functions for handlebars here
  // Example:
  // json: object => JSON.stringify(object, null, 4),
};

// make helper for post timestamp
module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
};
