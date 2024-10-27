// Prevents the "Update" button from executing unless some data has changed.
const forms = document.querySelectorAll(".updateForm");
forms.forEach(function (form, i) { 
  form.classList.remove("updateForm")
  form.classList.add(`updateForm${i}`)

  form.addEventListener("change", function () {
    const updateBtn = form.querySelector('input[type="submit"]');
    updateBtn.removeAttribute("disabled");
  });
});
