/* =========================================================
   BANDENAWAZ KORABU PORTFOLIO
   COMPLETE JAVASCRIPT
========================================================= */


/* =========================================================
   MOBILE MENU
========================================================= */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

if (menuBtn && navMenu) {

    menuBtn.addEventListener("click", () => {

        navMenu.classList.toggle("active");

        if (navMenu.classList.contains("active")) {

            menuBtn.textContent = "✕";

        } else {

            menuBtn.textContent = "☰";

        }

    });


    const navLinks =
        document.querySelectorAll("#navMenu a");


    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");

            menuBtn.textContent = "☰";

        });

    });

}


/* =========================================================
   CURRENT YEAR
========================================================= */

const yearElement =
    document.getElementById("year");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".skill-card, .project-card, .stat, .contact-box"
    );


const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach((element, index) => {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(30px)";

    element.style.transition =
        `opacity 0.7s ease ${index * 0.05}s,
         transform 0.7s ease ${index * 0.05}s`;

    revealObserver.observe(element);

});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );

const navigationLinks =
    document.querySelectorAll(
        ".navbar nav a"
    );


const navObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    navigationLinks.forEach(link => {

                        link.classList.remove("active");

                    });


                    const activeLink =
                        document.querySelector(
                            `.navbar nav a[href="#${entry.target.id}"]`
                        );


                    if (activeLink) {

                        activeLink.classList.add(
                            "active"
                        );

                    }

                }

            });

        },
        {
            threshold: 0.45
        }
    );


sections.forEach(section => {

    navObserver.observe(section);

});


/* =========================================================
   TYPING EFFECT
========================================================= */

const typingTarget =
    document.querySelector(".hero h2");


if (typingTarget) {

    const originalText =
        typingTarget.textContent.trim();


    /*
       Keep the HTML structure visually clean.
       The effect cycles through developer roles.
    */

    const roles = [
        "Software & Web Developer",
        "BE CSE Student",
        "Web Application Developer",
        "AI Enthusiast"
    ];


    let roleIndex = 0;

    let characterIndex = 0;

    let deleting = false;


    function typeRole() {

        const currentRole =
            roles[roleIndex];


        if (!deleting) {

            characterIndex++;

        } else {

            characterIndex--;

        }


        typingTarget.innerHTML =
            currentRole.substring(
                0,
                characterIndex
            );


        let speed =
            deleting ? 45 : 80;


        if (
            !deleting &&
            characterIndex ===
            currentRole.length
        ) {

            speed = 1800;

            deleting = true;

        }


        if (
            deleting &&
            characterIndex === 0
        ) {

            deleting = false;

            roleIndex =
                (roleIndex + 1) %
                roles.length;

            speed = 400;

        }


        setTimeout(
            typeRole,
            speed
        );

    }


    /*
       Start after page loads.
    */

    setTimeout(
        typeRole,
        1000
    );

}


/* =========================================================
   TERMINAL TYPING CURSOR
========================================================= */

const terminal =
    document.querySelector(".terminal");


if (terminal) {

    terminal.addEventListener(
        "mouseenter",
        () => {

            terminal.style.transform =
                "translateY(-4px)";

            terminal.style.transition =
                "transform 0.3s ease";

        }
    );


    terminal.addEventListener(
        "mouseleave",
        () => {

            terminal.style.transform =
                "translateY(0)";

        }
    );

}


/* =========================================================
   STAT COUNTER ANIMATION
========================================================= */

const stats =
    document.querySelectorAll(
        ".stat strong"
    );


function animateCounter(element) {

    const text =
        element.textContent.trim();


    /*
       Do not animate infinity.
    */

    if (text === "∞") {

        return;

    }


    const numericValue =
        parseInt(
            text.replace(/\D/g, ""),
            10
        );


    if (
        isNaN(numericValue)
    ) {

        return;

    }


    let current = 0;


    const suffix =
        text.includes("+")
            ? "+"
            : "";


    const duration = 1000;

    const steps = 30;

    const increment =
        numericValue / steps;


    const interval =
        duration / steps;


    const timer =
        setInterval(() => {

            current += increment;


            if (
                current >=
                numericValue
            ) {

                current =
                    numericValue;

                clearInterval(timer);

            }


            element.textContent =
                Math.floor(current) +
                suffix;

        }, interval);

}


const statsObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    const stat =
                        entry.target;

                    animateCounter(stat);

                    statsObserver.unobserve(
                        stat
                    );

                }

            });

        },
        {
            threshold: 0.8
        }
    );


stats.forEach(stat => {

    statsObserver.observe(stat);

});


/* =========================================================
   SCROLL TO TOP BUTTON
========================================================= */

const topButton =
    document.createElement("button");


topButton.innerHTML =
    "↑";


topButton.setAttribute(
    "aria-label",
    "Scroll to top"
);


topButton.id =
    "scrollTopButton";


document.body.appendChild(
    topButton
);


/* BUTTON STYLE */

Object.assign(
    topButton.style,
    {

        position: "fixed",

        right: "25px",

        bottom: "25px",

        width: "45px",

        height: "45px",

        border: "1px solid rgba(118,92,255,0.4)",

        borderRadius: "10px",

        background: "rgba(10,15,25,0.9)",

        color: "#a18fff",

        fontSize: "20px",

        cursor: "pointer",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        opacity: "0",

        visibility: "hidden",

        transform: "translateY(15px)",

        transition: "0.3s ease",

        zIndex: "999"

    }

);


/* SHOW / HIDE */

window.addEventListener(
    "scroll",
    () => {

        if (
            window.scrollY > 500
        ) {

            topButton.style.opacity =
                "1";

            topButton.style.visibility =
                "visible";

            topButton.style.transform =
                "translateY(0)";

        } else {

            topButton.style.opacity =
                "0";

            topButton.style.visibility =
                "hidden";

            topButton.style.transform =
                "translateY(15px)";

        }

    }
);


/* CLICK */

topButton.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);


/* =========================================================
   BUTTON RIPPLE EFFECT
========================================================= */

const buttons =
    document.querySelectorAll(
        ".btn, .contact-links a"
    );


buttons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            this.style.transform =
                "scale(0.97)";


            setTimeout(() => {

                this.style.transform =
                    "";

            }, 120);

        }
    );

});


/* =========================================================
   PROJECT CARD TILT
========================================================= */

const projectCards =
    document.querySelectorAll(
        ".project-card"
    );


projectCards.forEach(card => {

    card.addEventListener(
        "mousemove",
        event => {

            if (
                window.innerWidth < 850
            ) {

                return;

            }


            const rect =
                card.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            const centerX =
                rect.width / 2;


            const centerY =
                rect.height / 2;


            const rotateX =
                ((y - centerY) /
                    centerY) *
                -2;


            const rotateY =
                ((x - centerX) /
                    centerX) *
                2;


            card.style.transform =
                `perspective(800px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-5px)`;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform =
                "";

        }
    );

});


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
           Press "/" to focus the page
           without doing anything dangerous.
        */

        if (
            event.key === "/" &&
            document.activeElement.tagName !==
            "INPUT" &&
            document.activeElement.tagName !==
            "TEXTAREA"
        ) {

            event.preventDefault();

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }

    }
);


/* =========================================================
   PAGE LOAD
========================================================= */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "loaded"
        );


        console.log(
            "🚀 Bandenawaz Korabu Portfolio loaded successfully!"
        );


        console.log(
            "💻 Developer mode: ACTIVE"
        );

    }
);