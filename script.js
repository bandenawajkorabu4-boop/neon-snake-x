const API_URL = "/api/response";

/* ==============================
   SESSION
============================== */

let sessionId = localStorage.getItem("sruSessionId");

if (!sessionId) {
    sessionId =
        "sru-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).substring(2, 8);

    localStorage.setItem("sruSessionId", sessionId);
}


/* ==============================
   ELEMENTS
============================== */

const card = document.getElementById("card");
const title = document.getElementById("title");
const description = document.getElementById("description");
const content = document.getElementById("content");
const warning = document.getElementById("warning");
const startButton = document.getElementById("startButton");


/* ==============================
   SAVE RESPONSE
============================== */

async function saveResponse(question, answer) {

    try {

        await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                sessionId,
                question,
                answer
            })
        });

    } catch (error) {

        console.log(
            "Response could not be saved:",
            error
        );

    }

}


/* ==============================
   TYPING EFFECT
============================== */

function typeText(element, text, speed = 25) {

    return new Promise(resolve => {

        element.innerHTML = "";

        let index = 0;

        function type() {

            if (index < text.length) {

                element.innerHTML +=
                    text.charAt(index);

                index++;

                setTimeout(type, speed);

            } else {

                resolve();

            }

        }

        type();

    });

}


/* ==============================
   SCREEN TRANSITION
============================== */

function changeScreen(callback) {

    card.style.opacity = "0";
    card.style.transform =
        "translateY(20px) scale(.98)";

    setTimeout(() => {

        callback();

        card.style.opacity = "1";
        card.style.transform =
            "translateY(0) scale(1)";

    }, 350);

}


/* ==============================
   PARTICLES
============================== */

function createParticles(amount = 18) {

    for (let i = 0; i < amount; i++) {

        const particle =
            document.createElement("div");

        particle.className =
            "particle";

        particle.style.left =
            Math.random() * 100 + "%";

        particle.style.top =
            Math.random() * 100 + "%";

        particle.style.animationDelay =
            Math.random() * 3 + "s";

        particle.style.animationDuration =
            3 + Math.random() * 4 + "s";

        document.body.appendChild(particle);

    }

}


/* ==============================
   CHOICE BUTTONS
============================== */

function showChoices(question, choices, callback) {

    content.innerHTML = "";

    const container =
        document.createElement("div");

    container.className =
        "choice-container";


    choices.forEach(choice => {

        const button =
            document.createElement("button");

        button.className =
            "choice-button";

        button.textContent =
            choice.text;


        button.addEventListener(
            "click",
            async () => {

                if (button.disabled) {
                    return;
                }

                button.disabled = true;

                await saveResponse(
                    question,
                    choice.text
                );

                changeScreen(() => {

                    callback(choice);

                });

            }
        );


        container.appendChild(button);

    });


    content.appendChild(container);

}


/* ==============================
   START
============================== */

startButton.addEventListener(
    "click",
    async () => {

        startButton.disabled = true;

        await saveResponse(
            "start",
            "Clicked Okay, tell me 👀"
        );

        showQuestionOne();

    }
);


/* ==============================
   QUESTION 1
============================== */

function showQuestionOne() {

    changeScreen(async () => {

        title.innerHTML =
            "Okay Sru... 👀";

        description.innerHTML = "";

        content.innerHTML = "";

        warning.style.display =
            "none";

        startButton.style.display =
            "none";


        await typeText(
            description,
            "Before I say anything important, I need to know what kind of person I'm dealing with.",
            24
        );


        showChoices(

            "Which one are you?",

            [
                {
                    text: "😇 I'm innocent",

                    result:
                        "That's cute. I don't believe you though."
                },

                {
                    text: "😏 I'm trouble",

                    result:
                        "Honestly Sru, I suspected that from the beginning."
                }
            ],

            choice => {

                showQuestionTwo(
                    choice.result
                );

            }

        );

    });

}


/* ==============================
   QUESTION 2
============================== */

function showQuestionTwo(previousResult) {

    changeScreen(async () => {

        title.innerHTML =
            "Interesting... 😌";

        description.innerHTML = "";

        content.innerHTML = "";


        await typeText(
            description,
            previousResult +
            " Anyway, one more completely normal question.",
            24
        );


        showChoices(

            "Do you know that you're cute?",

            [
                {
                    text: "😌 Obviously",

                    result:
                        "Wow. Confidence. I respect it."
                },

                {
                    text: "🙄 No I'm not",

                    result:
                        "Sure Sru. And I'm a professional liar."
                },

                {
                    text: "🤨 Who said I'm cute?",

                    result:
                        "Nobody. That's the problem. I was trying to."
                }
            ],

            choice => {

                showQuestionThree(
                    choice.result
                );

            }

        );

    });

}


/* ==============================
   QUESTION 3
============================== */

function showQuestionThree(previousResult) {

    changeScreen(async () => {

        title.innerHTML =
            "Okay... serious question.";

        description.innerHTML = "";

        content.innerHTML = "";


        await typeText(
            description,
            previousResult +
            " But don't overthink this one.",
            24
        );


        showChoices(

            "Would you say yes if someone asked you something important?",

            [
                {
                    text: "👀 Depends...",

                    result:
                        "Ah. The dangerous answer."
                },

                {
                    text: "😌 Probably",

                    result:
                        "That's unexpectedly promising."
                },

                {
                    text: "🙄 No",

                    result:
                        "Good to know. I'll pretend I didn't hear that."
                }
            ],

            choice => {

                showQuestionFour(
                    choice.result
                );

            }

        );

    });

}


/* ==============================
   QUESTION 4
============================== */

function showQuestionFour(previousResult) {

    changeScreen(async () => {

        title.innerHTML =
            "Well then...";

        description.innerHTML = "";

        content.innerHTML = "";


        await typeText(
            description,
            previousResult +
            " There's actually something I've wanted to ask you for a while.",
            24
        );


        showChoices(

            "What should I do now?",

            [
                {
                    text: "👀 Then ask me",

                    result:
                        "You really want me to say it?"
                },

                {
                    text: "😂 Forget it",

                    result:
                        "Too late. Now I'm curious too."
                }
            ],

            choice => {

                showQuestionFive(
                    choice.result
                );

            }

        );

    });

}


/* ==============================
   QUESTION 5
============================== */

function showQuestionFive(previousResult) {

    changeScreen(async () => {

        title.innerHTML =
            "Here's the thing...";

        description.innerHTML = "";

        content.innerHTML = "";


        await typeText(
            description,
            previousResult +
            " But I'm not going to ask.",
            24
        );


        showChoices(

            "Should I actually ask?",

            [
                {
                    text: "😏 Yes. Ask.",

                    result:
                        "You literally asked me to. Don't blame me."
                },

                {
                    text: "😂 No, you're joking",

                    result:
                        "Maybe I am. Maybe I'm not."
                },

                {
                    text: "🙈 I'm scared now",

                    result:
                        "Perfect. That's exactly the reaction I wanted."
                }
            ],

            choice => {

                showProposal(
                    choice.result
                );

            }

        );

    });

}


/* ==============================
   PROPOSAL
============================== */

function showProposal(previousResult) {

    changeScreen(async () => {

        title.innerHTML =
            "Sru ❤️ + Me?";

        description.innerHTML = "";

        content.innerHTML = "";


        await typeText(
            description,
            previousResult +
            " Okay... here's my question.",
            27
        );


        await wait(400);


        const question =
            document.createElement("div");

        question.style.fontSize =
            "22px";

        question.style.fontWeight =
            "bold";

        question.style.margin =
            "20px 0";

        question.style.lineHeight =
            "1.5";

        question.textContent =
            "Will you be the person I get to annoy a little more than everyone else? 😌❤️";


        content.appendChild(question);


        const container =
            document.createElement("div");

        container.className =
            "choice-container";


        const maybe =
            createChoiceButton(
                "😏 Hmm... maybe"
            );

        const serious =
            createChoiceButton(
                "🤨 Are you seriously asking me?"
            );

        const joking =
            createChoiceButton(
                "😂 I think you're joking"
            );

        const no =
            createChoiceButton(
                "🙄 Absolutely not"
            );


        container.appendChild(maybe);
        container.appendChild(serious);
        container.appendChild(joking);
        container.appendChild(no);

        content.appendChild(container);


        maybe.onclick = async () => {

            await saveResponse(
                "Sru ❤️ + Me?",
                "😏 Hmm... maybe"
            );

            startConfessionMode("maybe");

        };


        serious.onclick = async () => {

            await saveResponse(
                "Sru ❤️ + Me?",
                "🤨 Are you seriously asking me?"
            );

            startConfessionMode("serious");

        };


        joking.onclick = async () => {

            await saveResponse(
                "Sru ❤️ + Me?",
                "😂 I think you're joking"
            );

            startConfessionMode("joking");

        };


        no.onclick = async () => {

            await saveResponse(
                "Sru ❤️ + Me?",
                "🙄 Absolutely not"
            );

            startConfessionMode("no");

        };


        /* NO BUTTON DODGE */

        let dodgeCount = 0;

        function dodgeButton() {

            if (dodgeCount >= 4) {
                return;
            }

            dodgeCount++;

            const x =
                Math.random() * 180 - 90;

            const y =
                Math.random() * 120 - 60;

            no.style.transform =
                `translate(${x}px, ${y}px)`;

        }


        no.addEventListener(
            "mouseenter",
            dodgeButton
        );

        no.addEventListener(
            "touchstart",
            dodgeButton
        );

    });

}


/* ==============================
   CREATE BUTTON
============================== */

function createChoiceButton(text) {

    const button =
        document.createElement("button");

    button.className =
        "choice-button";

    button.textContent =
        text;

    return button;

}


/* ==============================
   WAIT
============================== */

function wait(milliseconds) {

    return new Promise(resolve => {

        setTimeout(
            resolve,
            milliseconds
        );

    });

}


/* ==============================
   CONFESSION MODE
============================== */

async function startConfessionMode(answerType) {

    changeScreen(async () => {

        title.innerHTML =
            "WAIT... 👀";

        description.innerHTML =
            "";

        content.innerHTML =
            "";

        warning.style.display =
            "none";


        /* Remove normal buttons */

        await wait(500);


        /* Dramatic pause */

        await typeText(
            description,
            "Okay...",
            180
        );


        await wait(1000);


        description.innerHTML =
            "";


        await typeText(
            description,
            "Maybe I should actually tell you.",
            65
        );


        await wait(1300);


        description.innerHTML =
            "";


        await typeText(
            description,
            "For once, I'm not joking.",
            65
        );


        await wait(1400);


        showConfession(answerType);

    });

}


/* ==============================
   CONFESSION
============================== */

async function showConfession(answerType) {

    changeScreen(async () => {

        title.innerHTML =
            "Sru... ❤️";

        description.innerHTML =
            "";

        content.innerHTML =
            "";


        await typeText(
            description,
            "You probably figured this out already...",
            50
        );


        await wait(1200);


        description.innerHTML =
            "";


        await typeText(
            description,
            "but yes...",
            90
        );


        await wait(1300);


        description.innerHTML =
            "";


        const confession =
            document.createElement("div");

        confession.style.fontSize =
            "21px";

        confession.style.fontWeight =
            "bold";

        confession.style.lineHeight =
            "1.7";

        confession.style.margin =
            "25px 0";

        confession.style.opacity =
            "0";

        confession.style.transition =
            "opacity 1s ease";


        confession.innerHTML =
            `
            I actually like you. ❤️
            <br><br>
            There.
            I said it.
            `;


        content.appendChild(confession);


        setTimeout(() => {

            confession.style.opacity =
                "1";

        }, 100);


        await wait(1800);


        const confusing =
            document.createElement("div");

        confusing.style.fontSize =
            "15px";

        confusing.style.lineHeight =
            "1.7";

        confusing.style.color =
            "rgba(255,255,255,.7)";

        confusing.innerHTML =
            `
            And before you start celebrating... 😌
            <br>
            I'm still going to annoy you.
            <br><br>
            So technically...
            nothing has changed.
            😂
            `;


        content.appendChild(confusing);


        await wait(1600);


        showFinalQuestion(answerType);

    });

}


/* ==============================
   FINAL QUESTION
============================== */

function showFinalQuestion(answerType) {

    const finalBox =
        document.createElement("div");

    finalBox.style.marginTop =
        "25px";

    finalBox.style.padding =
        "18px";

    finalBox.style.borderRadius =
        "16px";

    finalBox.style.background =
        "rgba(255,255,255,.06)";

    finalBox.style.border =
        "1px solid rgba(255,255,255,.1)";


    const text =
        document.createElement("div");

    text.style.fontSize =
        "18px";

    text.style.fontWeight =
        "bold";

    text.innerHTML =
        "So... what do you think? 👀";


    finalBox.appendChild(text);


    const buttonContainer =
        document.createElement("div");

    buttonContainer.className =
        "choice-container";


    const yes =
        createChoiceButton(
            "❤️ I knew it"
        );

    const maybe =
        createChoiceButton(
            "😏 I need to think"
        );

    const joke =
        createChoiceButton(
            "😂 You are so stupid"
        );


    buttonContainer.appendChild(yes);
    buttonContainer.appendChild(maybe);
    buttonContainer.appendChild(joke);


    finalBox.appendChild(
        buttonContainer
    );


    content.appendChild(
        finalBox
    );


    yes.onclick = async () => {

        await saveResponse(
            "Final confession reaction",
            "❤️ I knew it"
        );

        finish("yes");

    };


    maybe.onclick = async () => {

        await saveResponse(
            "Final confession reaction",
            "😏 I need to think"
        );

        finish("maybe");

    };


    joke.onclick = async () => {

        await saveResponse(
            "Final confession reaction",
            "😂 You are so stupid"
        );

        finish("joke");

    };

}


/* ==============================
   FINISH
============================== */

function finish(type) {

    changeScreen(async () => {

        title.innerHTML =
            "Okay... that's enough. 😂❤️";

        description.innerHTML =
            "";

        content.innerHTML =
            "";


        let message;


        if (type === "yes") {

            message =
                `
                <strong>Oh.</strong>
                <br><br>
                So you knew?
                👀
                <br><br>
                And you still stayed until the end?
                <br><br>
                Interesting, Sru...
                very interesting. 😌❤️
                `;

        }


        if (type === "maybe") {

            message =
                `
                <strong>Take your time. 😌</strong>
                <br><br>
                I'll be here...
                pretending I'm not checking your answer.
                👀
                <br><br>
                No pressure. ❤️
                `;

        }


        if (type === "joke") {

            message =
                `
                <strong>Wow. Rude. 😂</strong>
                <br><br>
                I just confessed my feelings
                and this is the respect I get?
                <br><br>
                Unbelievable, Sru. 😭❤️
                `;

        }


        const result =
            document.createElement("div");

        result.style.fontSize =
            "17px";

        result.style.lineHeight =
            "1.7";

        result.style.margin =
            "20px 0";

        result.innerHTML =
            message;


        content.appendChild(
            result
        );


        await wait(1200);


        const tiny =
            document.createElement("p");

        tiny.style.fontSize =
            "13px";

        tiny.style.color =
            "rgba(255,255,255,.55)";

        tiny.textContent =
            "P.S. Yes, this entire website was made just to annoy you. 😌";


        content.appendChild(
            tiny
        );


        await wait(800);


        const replay =
            document.createElement("button");

        replay.id =
            "startButton";

        replay.textContent =
            "🔄 Make me suffer again";


        replay.style.marginTop =
            "20px";


        replay.onclick = () => {

            location.reload();

        };


        content.appendChild(
            replay
        );


        createExtraHearts();

    });

}


/* ==============================
   EXTRA HEARTS
============================== */

function createExtraHearts() {

    const hearts = [
        "♡",
        "♥",
        "💗",
        "💕",
        "💖",
        "❤️"
    ];


    for (let i = 0; i < 20; i++) {

        const heart =
            document.createElement("div");

        heart.className =
            "heart";

        heart.textContent =
            hearts[
                Math.floor(
                    Math.random() *
                    hearts.length
                )
            ];


        heart.style.position =
            "fixed";

        heart.style.left =
            Math.random() * 100 + "vw";

        heart.style.bottom =
            "-40px";

        heart.style.fontSize =
            15 +
            Math.random() * 28 +
            "px";

        heart.style.pointerEvents =
            "none";

        heart.style.zIndex =
            "50";

        heart.style.animation =
            `floatHeart ${4 + Math.random() * 4}s linear forwards`;


        document.body.appendChild(
            heart
        );


        setTimeout(() => {

            heart.remove();

        }, 9000);

    }

}


/* ==============================
   INITIAL PARTICLES
============================== */

createParticles(18);