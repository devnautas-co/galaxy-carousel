const htmlCollectionToArray = (htmlCollection) => Array.prototype.slice.call(htmlCollection);

const findActive = itemList => itemList.find(item => item.classList.contains("active"));

const getPreviousShownItem = (item, shownItems) => {
    if (item && shownItems)
        return getPreviousShownItem(item.previousElementSibling, shownItems - 1);

    return item;
}

const calcLeft = (item, multiplier, shownItems) => {
    const left = parseFloat(item.style.left.replace("%", ""));
    const calc = left + 100 / shownItems * multiplier;
    return calc.toFixed(2);
}

const updatePreviousItems = (item, multiplier, shownItems) => {
    if (item && item.classList.contains("galaxy-item")) {
        item.style.left = `${calcLeft(item, multiplier, shownItems)}%`;
        updatePreviousItems(item.previousElementSibling, multiplier, shownItems);
    }
}

const updateNextItems = (item, multiplier, shownItems) => {
    if (item && item.classList.contains("galaxy-item")) {
        item.style.left = `${calcLeft(item, multiplier, shownItems)}%`;
        updateNextItems(item.nextElementSibling, multiplier, shownItems);
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
            if (index === options.shownItems - 1)
                carousel.classList.add("active");

            const width = 100 / options.shownItems;
            carousel.style.width = `${width.toFixed(2)}%`;
            const left = index * (100 / options.shownItems);
            carousel.style.left = `${left.toFixed(2)}%`;
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
                    updatePreviousItems(currentActive.previousElementSibling, -1, options.shownItems);

                    currentActive.classList.remove("active");

                    currentActive.nextElementSibling.classList.add("active");

                    updateNextItems(currentActive, -1, options.shownItems);
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
                    currentActive.previousElementSibling.classList.contains("galaxy-item") &&
                    getPreviousShownItem(currentActive, options.shownItems)
                ) {
                    updateNextItems(currentActive.nextElementSibling, 1, options.shownItems);

                    currentActive.classList.remove("active");

                    currentActive.previousElementSibling.classList.add("active");

                    updatePreviousItems(currentActive, 1, options.shownItems);
                }
            });
        }
    });
};
