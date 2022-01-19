const htmlCollectionToArray = (htmlCollection) => Array.prototype.slice.call(htmlCollection);

const findActive = itemList => itemList.find(item => item.classList.contains("active"));

const updatePreviousItems = (item, multiplier) => {
    if (item && item.classList.contains("galaxy-item")) {
        const left = parseInt(item.style.left.replace("%", ""));
        item.style.left = `${left + 100 * multiplier}%`;
        updatePreviousItems(item.previousElementSibling, multiplier);
    }
}

const updateNextItems = (item, multiplier) => {
    if (item && item.classList.contains("galaxy-item")) {
        const left = parseInt(item.style.left.replace("%", ""));
        item.style.left = `${left + 100 * multiplier}%`;
        updateNextItems(item.nextElementSibling, multiplier);
    }
}

/**
 * Options:
 * - container: The carousel's container selector
 * - shownItems: The number of items to show at once
 * - showButtons: Whether to show the buttons
 */

const galaxyCarousel = (options) => {
    const carousels = htmlCollectionToArray(document.querySelectorAll(options.container));

    carousels.forEach((carousel, index) => {
        const carouselItems = htmlCollectionToArray(carousel.querySelectorAll(".galaxy-item"));
        carouselItems.forEach((carousel, index) => {
            carousel.style.width = `${100 / options.shownItems}%`;
            carousel.style.left = `${index * (100 / options.shownItems)}%`;
        });

        if (options.showButtons) {
            const nextButton = document.createElement("div");
            nextButton.setAttribute("id", "galaxy-next-button");
            carousel.appendChild(nextButton);

            nextButton.addEventListener("click", () => {
                const currentActive = findActive(carouselItems);

                if (
                    currentActive &&
                    currentActive.nextElementSibling &&
                    currentActive.nextElementSibling.classList.contains("galaxy-item")
                ) {
                    updatePreviousItems(currentActive.previousElementSibling, -1);

                    currentActive.classList.remove("active");

                    currentActive.nextElementSibling.classList.add("active");

                    updateNextItems(currentActive, -1);
                }
            });
    
            const prevButton = document.createElement("div");
            prevButton.setAttribute("id", "galaxy-prev-button");
            carousel.appendChild(prevButton);

            prevButton.addEventListener("click", () => {
                const currentActive = findActive(carouselItems);

                if (
                    currentActive &&
                    currentActive.previousElementSibling &&
                    currentActive.previousElementSibling.classList.contains("galaxy-item")
                ) {
                    updateNextItems(currentActive.nextElementSibling, 1);

                    currentActive.classList.remove("active");

                    currentActive.previousElementSibling.classList.add("active");

                    updatePreviousItems(currentActive, 1);
                }
            });
        }
    });
};
