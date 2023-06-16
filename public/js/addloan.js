// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const form = document.querySelector('.needs-validation');
  

  // Loop over them and prevent submission
    form.addEventListener('submit', async (event) => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      

      form.classList.add('was-validated')
    }, false)
})();


