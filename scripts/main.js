const toArray = nodeList => Array.prototype.slice.call(nodeList);

const findActive = itemList => itemList.find(item => item.classList.contains("active"));

const findActiveIndex = itemList => itemList.findIndex(item => item.classList.contains('active'));

const updatePreviousItems = (item, multiplier) => {
    if (item && item.classList.contains("item")) {
        const left = parseInt(item.style.left.replace("%", ""));
        item.style.left = `${left + 100 * multiplier}%`;
        updatePreviousItems(item.previousElementSibling, multiplier);
    }
}

const updateNextItems = (item, multiplier) => {
    if (item && item.classList.contains("item")) {
        const left = parseInt(item.style.left.replace("%", ""));
        item.style.left = `${left + 100 * multiplier}%`;
        updateNextItems(item.nextElementSibling, multiplier);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById("carousel");
    const carouselItems = toArray(carousel.querySelectorAll(".item"));

    carouselItems.forEach((item, index) => {
        item.style.left = `${index * 100}%`;
    });

    const nextButton = document.getElementById("next");
    const prevButton = document.getElementById("prev");

    nextButton.addEventListener("click", () => {
        const currentActive = findActive(carouselItems);

        if (
            currentActive &&
            currentActive.nextElementSibling &&
            currentActive.nextElementSibling.classList.contains("item")
        ) {
            updatePreviousItems(currentActive.previousElementSibling, -1);

            currentActive.classList.remove("active");

            currentActive.nextElementSibling.classList.add("active");

            updateNextItems(currentActive, -1);
        }
    });

    prevButton.addEventListener("click", () => {
        const currentActive = findActive(carouselItems);

        if (
            currentActive &&
            currentActive.previousElementSibling &&
            currentActive.previousElementSibling.classList.contains("item")
        ) {
            updateNextItems(currentActive.nextElementSibling, 1);

            currentActive.classList.remove("active");

            currentActive.previousElementSibling.classList.add("active");

            updatePreviousItems(currentActive, 1);
        }
    })
});