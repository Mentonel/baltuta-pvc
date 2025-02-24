document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".faq-toggle").forEach(button => {
        button.addEventListener("click", () => {
            const answer = button.nextElementSibling;

            // Închide toate celelalte răspunsuri
            document.querySelectorAll(".faq-answer").forEach(item => {
                if (item !== answer) {
                    item.style.display = "none";
                }
            });

            // Toggle pentru răspunsul curent
            answer.style.display = (answer.style.display === "block") ? "none" : "block";
        });
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});