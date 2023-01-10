const generateFeedback = () => {
    const container = document.querySelector(".quotes__container");
    if (container) {
        container.innerHTML = "";
        userData.feedback.forEach((item) => {
            const quote = document.createElement("div");
            quote.classList = "quote";
            quote.innerHTML = `<blockquote>
                                    <i class="fa-solid fa-quote-left"></i>
                                    ${item.text}
                                    <i class="fa-solid fa-quote-right"></i>
                                    </blockquote>
                                <p class="author">~ ${item.fullname}</p>`;
            container.append(quote);
        });
    }
};

generateFeedback();
