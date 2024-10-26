// Prevents the "Update" button from executing unless some data has changed.
const form = document.querySelector(".updateForm");
console.log(form)
form.addEventListener("change", function () {
  const updateBtn = document.querySelector('input[type="submit"]');
  console.log(updateBtn)
  updateBtn.removeAttribute("disabled");
  console.log(updateBtn)
});
