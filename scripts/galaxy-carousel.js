const htmlCollectionToArray = (htmlCollection) => Array.prototype.slice.call(htmlCollection);

const findActiveItem = itemList => itemList.find(item => item.classList.contains("active"));

const findActiveDot = dotsList => dotsList.find(item => item.classList.contains("active"));

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
    if (!options) {
        options = {};
        options.container = ".galaxy-carousel-container";
        options.showButtons = true;
        options.showDots = false;
        options.shownItems = 1;
    } else {
        options.container = options.container ?? ".galaxy-carousel-container";
        options.showButtons = options.showButtons ?? true;
        options.showDots = options.showDots ?? false;
        options.shownItems = options.shownItems ?? 1;
    }

    const carousels = htmlCollectionToArray(document.querySelectorAll(options.container));

    carousels.forEach((carousel, index) => {
        const carouselItems = htmlCollectionToArray(carousel.querySelectorAll(".galaxy-item"));

        if (options.showDots) {
            const dots = document.createElement("div");
            dots.setAttribute("id", `galaxy-dots-${index}`);
            carousel.appendChild(dots);

            for (let i = 0; i < carouselItems.length; i++) {
                const dot = document.createElement("div");
                dot.classList.add("galaxy-dot");

                if (i === options.shownItems - 1) {
                    dot.classList.add("active");
                }

                dots.appendChild(dot);
            }
        }

        if (options.showButtons) {
            const nextButton = document.createElement("div");
            nextButton.setAttribute("id", `${index}-galaxy-next-button`);
            carousel.appendChild(nextButton);

            nextButton.addEventListener("click", () => {
                const currentActive = findActiveItem(carouselItems);

                if (
                    currentActive &&
                    currentActive.nextElementSibling &&
                    currentActive.nextElementSibling.classList.contains("galaxy-item")
                ) {
                    updatePreviousItems(currentActive.previousElementSibling, -1, options.shownItems);

                    currentActive.classList.remove("active");

                    currentActive.nextElementSibling.classList.add("active");

                    if (options.showDots) {
                        const dots = htmlCollectionToArray(document.querySelectorAll(`#galaxy-dots-${index} .galaxy-dot`));
                        const activeDot = findActiveDot(dots);

                        if (activeDot && activeDot.nextElementSibling) {
                            activeDot.classList.remove("active");
                            activeDot.nextElementSibling.classList.add("active");
                        }
                    }

                    updateNextItems(currentActive, -1, options.shownItems);
                }
            });
    
            const prevButton = document.createElement("div");
            prevButton.setAttribute("id", `${index}-galaxy-prev-button`);
            carousel.appendChild(prevButton);

            prevButton.addEventListener("click", () => {
                const currentActive = findActiveItem(carouselItems);

                if (
                    currentActive &&
                    currentActive.previousElementSibling &&
                    currentActive.previousElementSibling.classList.contains("galaxy-item") &&
                    getPreviousShownItem(currentActive, options.shownItems)
                ) {
                    updateNextItems(currentActive.nextElementSibling, 1, options.shownItems);

                    currentActive.classList.remove("active");

                    currentActive.previousElementSibling.classList.add("active");

                    if (options.showDots) {
                        const dots = htmlCollectionToArray(document.querySelectorAll(`#galaxy-dots-${index} .galaxy-dot`));
                        const activeDot = findActiveDot(dots);

                        if (activeDot && activeDot.previousElementSibling) {
                            activeDot.classList.remove("active");
                            activeDot.previousElementSibling.classList.add("active");
                        }
                    }

                    updatePreviousItems(currentActive, 1, options.shownItems);
                }
            });
        }

        carouselItems.forEach((carousel, index) => {
            if (index === options.shownItems - 1)
                carousel.classList.add("active");

            const width = 100 / options.shownItems;
            carousel.style.width = `${width.toFixed(2)}%`;
            const left = index * (100 / options.shownItems);
            carousel.style.left = `${left.toFixed(2)}%`;
        });
    });
};
