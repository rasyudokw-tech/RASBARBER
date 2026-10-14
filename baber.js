const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
});

reveals.forEach((el) => {
    observer.observe(el);
});

const text = "Welcome To RASBARBER✂️ ";
const typingText = document.getElementById("typing-text");

let index = 0;

function typing() {
    if (index < text.length) {
        typingText.textContent += text[index];
        index++;
        setTimeout(typing, 100);
    }
}

typing();


const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const message = document.getElementById("message").value.trim();

    const whatsappNumber = "6281234567890"; // Ganti dengan nomor tujuan

    const text = `Hello RASBARBER!

Name: ${name}
Phone: ${phone}
Service: ${service}
Message: ${message}`;

    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

    window.open(whatsappURL, "_blank");
});
