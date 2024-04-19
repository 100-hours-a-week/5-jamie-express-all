// Header Modal
const $headerModal = document.getElementById("header-modal");
document.querySelector("header img").addEventListener("click", () => {
    if ($headerModal.style.display === "block") {
        $headerModal.style.display = "none";
    } else {
        $headerModal.style.display = "block";
    }
});
