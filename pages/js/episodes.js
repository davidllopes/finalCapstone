// declare global variable for loaded episode list from json
let episodeData;

// flag var that tells the code whether we're in the bookmarks (saved for later) page
let bookmarksPage = false;

// create list of icons in each state (fontawesome icons)
const ICONS = {
    likes: {
        regular: '<i class="fa-regular fa-heart"></i>',
        solid: '<i class="fa-solid fa-heart"></i>',
    },
    bookmarks: {
        regular: '<i class="fa-regular fa-bookmark"></i>',
        solid: '<i class="fa-solid fa-bookmark"></i>',
    },
};

/**
 * Functions
 */
/**
 * Function that generates the list of episodes/bookmarks
 */
const generateList = () => {
    //clear contents in the DOM
    episodeList.innerHTML = "";
    //show empty bookmarks message
    defaultMsg(true);

    // reload data from session storage to ensure latest version of likes and bookmarks
    loadData();

    // loop from last episode to first (0)
    for (let i = episodeData.length - 1; i >= 0; i--) {
        const item = episodeData[i];

        //check if episode is in bookmarks
        let bookmarked = false;
        userData.bookmarks.forEach((bookmark) => {
            if (bookmark.epiID === item.id) {
                bookmarked = true;
            }
        });

        // check if item is bookmarked or if not in bookmarked only mode, then display episode
        if (!bookmarksPage || bookmarked) {
            // hide default content message
            defaultMsg(false);

            // create list item element
            const element = document.createElement("li");
            element.classList = "episodes__item";
            element.id = item.id;
            element.innerHTML = `<img src="../imgs/${item.thumbnail}" alt="" class="episodes__img">
        <div class="episode__content">
            <h3 class="heading heading--tertiary">${item.title}</h3><p>${item.description}</p>
        </div>`;

            // Like and bookmark
            const actionsDiv = document.createElement("div");
            actionsDiv.classList = "episodes__item__actions";

            // Like buttons - classes, data-epi-id, title, fontawesome icon
            const likeBtn = document.createElement("button");
            likeBtn.classList = "btn--icon btn--likes";
            likeBtn.dataset.epiId = item.id;
            likeBtn.title = "Like this episode";
            likeBtn.innerHTML = ICONS.likes.regular;
            //click event
            likeBtn.addEventListener("click", (e) => {
                let node = e.target;
                if (e.target.tagName === "I") {
                    node = e.target.parentNode;
                }
                likeEpisode(node.dataset.epiId);
            });

            // Bookmark buttons - classes, data-epi-id, title, fontawesome icon
            const bookmarkBtn = document.createElement("button");
            bookmarkBtn.classList = "btn--icon btn--bookmarks";
            bookmarkBtn.dataset.epiId = item.id;
            bookmarkBtn.title = "Bookmark this episode";
            bookmarkBtn.innerHTML = ICONS.bookmarks.regular;
            //click event
            bookmarkBtn.addEventListener("click", (e) => {
                let node = e.target;
                if (e.target.tagName === "I") {
                    node = e.target.parentNode;
                }
                bookmarkEpisode(node.dataset.epiId);
            });

            /**
             * Note: the bookmarks and likes elements and events could be combined into one function
             * which would generate the buttons separately
             */

            // append each element to each parent and DOM
            actionsDiv.append(likeBtn, bookmarkBtn);
            element.append(actionsDiv);
            episodeList.append(element);
        }
    }

    // refresh button states for Likes and Bookmarks
    updateBtns(["likes", "bookmarks"]);
};

/**
 * Function that updates the button states depending on the user data saved
 */
const updateBtns = (types) => {
    // reset all buttons
    resetBtns(types);

    types.forEach((btnType) => {
        userData[btnType].forEach((item) => {
            const element = document.querySelector(
                `#${item.epiID} .btn--${btnType}`
            );
            // check if the element exists in the DOM
            if (element) {
                element.classList.add("btn--selected");
                element.innerHTML = ICONS[btnType].solid;
            } else if (!bookmarksPage) {
                // if in the bookmarks, a liked episode might not be bookmarked so we ignore it
                // if we're in the all episodes page output the error to log
                console.trace(`#${item.epiID} .btn--${btnType} not found`);
            }
        });
    });

    //update counters
    updateBookmarkCounter();
};

// function that resets buttons of a certain type (i.e. bookmarks)
const resetBtns = (types) => {
    types.forEach((btnType) => {
        document.querySelectorAll(`.btn--${btnType}`).forEach((element) => {
            element.classList.remove("btn--selected");
            element.innerHTML = ICONS[btnType].regular;
        });
    });
};

// function that calls the update user data function with the likes type
const likeEpisode = (epiID) => {
    if (epiID && epiID.length > 0) {
        updateUserData("likes", epiID);
    } else {
        console.trace(epiID);
    }
    updateBtns(["likes"]);
};
// function that calls the update user data function with the bookmarks type
const bookmarkEpisode = (epiID) => {
    if (epiID && epiID.length > 0) {
        updateUserData("bookmarks", epiID);
        alert(`You have bookmarked ${userData.bookmarks.length} episodes!`);
    } else {
        console.trace(epiID);
    }

    // if bookmarks page, refresh the list by calling the generate list function again
    if (bookmarksPage) {
        generateList();
    } else {
        updateBtns(["bookmarks"]);
    }
};

// function that updates the userData variable adding or removing likes/bookmarks, by checking if the item exists already
const updateUserData = (type, epiID) => {
    let exists = false,
        index;
    userData[type].forEach((item, i) => {
        if (item.epiID === epiID) {
            exists = true;
            index = i;
        }
    });
    if (exists) {
        userData[type].splice(index, 1);
    } else {
        userData[type].push({ epiID: epiID });
    }

    // save data to session storage
    saveData();
};

// default message when no bookmarks exist
const defaultMsg = (show) => {
    const msg = document.querySelector(".default-msg");
    if (msg) {
        if (show) {
            msg.style.display = "block";
        } else {
            msg.style.display = "none";
        }
    }
};

// function that gets the bookmarks array length and outputs to the DOM
const updateBookmarkCounter = () => {
    const counter = document.querySelector(".bookmark-counter");
    if (counter) {
        counter.textContent = userData.bookmarks.length;
    }
};

//
/**
 * Episode list DOM element
 */
const episodeList = document.querySelector("ul.episode-list");
if (episodeList) {
    //
    // check whether to display bookmarked items only or all episodes
    if (episodeList.classList.contains("bookmarks-only")) {
        bookmarksPage = true;
    }

    //load episodes data from json
    fetch("js/episodes.json")
        .then((res) => res.json())
        .then((response) => {
            // store Data in global variable
            episodeData = response;

            // call generate list function
            generateList();
        }),
        (error) => console.error(error);
}
