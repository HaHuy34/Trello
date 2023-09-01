export const selectInlineText = (e) => {
  e.target.focus();
  e.target.select();
};

export const saveContentAfterPressEnter = (e) => {
  if (e.key === "Enter") {
    e.preventDefault()
    e.target.blur();
  }
};
