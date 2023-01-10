const contactForm = document.querySelector("#contact-form");

if (contactForm) {
    // add event listener for when form is submitted
    contactForm.addEventListener("submit", (e) => {
        // prevent refreshing page
        e.preventDefault();

        const inputs = document.querySelectorAll(".form-data"),
            data = {};
        let validInputs = true,
            type = "feedback";

        // loop through all input fields and check they're not empty
        inputs.forEach((input) => {
            if (input.required && input.value === "") {
                validInputs = false;
            } else if (input.name === "type" && input.checked) {
                type = input.value;
            } else if (input.name !== "type") {
                data[input.name] = input.value;
            }
        });

        // if all inputs are valid
        if (validInputs) {
            userData[type].push(data);

            //save data to session storage
            saveData();

            //update feedback section if on all episodes page
            if (generateFeedback) {
                generateFeedback();
            }

            //clear form
            contactForm.reset();
        } else {
            alert("Please make sure you fill in all fields");
        }
    });
}
