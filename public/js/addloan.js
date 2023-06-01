// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', async (event) => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      const name = form.name.value;
      const description = form.description.value;
      const amount = form.amount.value;

      if (description === '') {
        const descInput = document.querySelector('#desc');
        descInput.setCustomValidity("Invalid field.");
      }

      if (description !== '') {
        const descInput = document.querySelector('#desc');
        descInput.setCustomValidity("");
      }

      

      if (name != '' && description != '' && amount != '' && amount != 0) {
        try {
          const res = await fetch('/addloan',{
              method: 'POST',
              body: JSON.stringify({name:name,description:description,amount:amount}),
              headers: {'Content-Type' : 'application/json'}
          });

          const status = await res.json();

          if (status.transaction.err || status.loan.err) {
            if (status.transaction.err) {
              alert(status.transaction.err);
            } else {
              alert(status.loan.err);
            }
            
          }

          if (status.transaction.success && status.loan.success) {
            
          }

          // if (data.user) {
          //   location.assign('/');
          // }
      } catch (err) {
          console.log(err);
      }
      }

      form.classList.add('was-validated')
    }, false)
  })
})()
