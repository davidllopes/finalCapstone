/**
 * data is prepopulated with some likes, bookmarks, and feedback
 * loading data from session storage if exists will overwrite the defaults
 *
 * Notes: Likes and bookmarks function can be found in the "All episodes" page
 * I already had a contact and feedback form combined in one page
 * I've added a functionality where the feedback saved in the forms appears in the quotes section
 * added the quotes section and feedback form into the episodes.html page
 * Leaving a comment will update the comments section with the new comment
 * Saved for later/bookmarks can be seen in bookmarks.html
 */
const userData = {
    likes: [{ epiID: "E004" }],
    bookmarks: [{ epiID: "E004" }],
    question: [],
    feedback: [
        {
            fullname: "Moira Leone",
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati tempora corrupti iusto et earum, in molestiae, natus excepturi quod cupiditate magni asperiores dolorem voluptatibus eum incidunt nihil vel fugiat consectetur sunt vitae necessitatibus. Dolor, explicabo sunt. Perferendis, necessitatibus tempore quos impedit aliquam quam non, reiciendis, dolorem molestias dolore velit. Eveniet!",
            email: "a@a.a",
        },
        {
            fullname: "Sinead Lewis",
            text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa molestiae ex aperiam esse. Iusto itaque temporibus tempore quia aspernatur quaerat nihil quae veniam cum omnis.",
            email: "a@a.a",
        },
    ],
};

/**
 * Using same functions as task T40 for storage manipulation
 */

// function to save data to session storage
const saveData = () => {
    // convert object to string and save to storage
    sessionStorage.setItem("podcastData", JSON.stringify(userData));
};

// function to load data from session storage
const loadData = () => {
    // convert string to JSON object
    const savedData = JSON.parse(sessionStorage.getItem("podcastData"));

    // if the storage exists
    if (savedData) {
        // data types i.e. likes, bookmarks, etc
        const dataTypes = Object.keys(savedData);

        dataTypes.forEach((type) => {
            // clear existing objects
            userData[type].splice(0);

            // push each value in the saved data to the array
            savedData[type].forEach((element) => {
                userData[type].push(element);
            });
        });
    }
};

// run load data function when script loads
loadData();
