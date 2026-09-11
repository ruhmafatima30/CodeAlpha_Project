const inputText =
    document.getElementById("inputText");

const outputText =
    document.getElementById("outputText");

const sourceLanguage =
    document.getElementById("sourceLanguage");

const targetLanguage =
    document.getElementById("targetLanguage");

const translateButton =
    document.getElementById("translateButton");

const buttonText =
    document.getElementById("buttonText");

const loader =
    document.getElementById("loader");

const copyButton =
    document.getElementById("copyButton");

const speakButton =
    document.getElementById("speakButton");

const clearButton =
    document.getElementById("clearButton");

const swapButton =
    document.getElementById("swapButton");

const charCount =
    document.getElementById("charCount");

const status =
    document.getElementById("status");

const detectedLanguage =
    document.getElementById("detectedLanguage");


inputText.addEventListener("input", function () {

    charCount.textContent =
        `${inputText.value.length} / 5000`;

});

translateButton.addEventListener(
    "click",
    async function () {

        const text =
            inputText.value.trim();

        const source =
            sourceLanguage.value;

        const target =
            targetLanguage.value;


        if (!text) {

            showStatus(
                "Please enter some text first.",
                "error"
            );

            return;
        }


        if (
            source !== "auto" &&
            source === target
        ) {

            showStatus(
                "Please select different languages.",
                "error"
            );

            return;
        }


        translateButton.disabled = true;

        buttonText.textContent =
            "Translating...";

        loader.classList.remove("hidden");

        status.textContent = "";


        try {

            const response =
                await fetch("/translate", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        text: text,

                        source: source,

                        target: target

                    })

                });


            const data =
                await response.json();


            if (!data.success) {

                throw new Error(
                    data.error ||
                    "Translation failed."
                );

            }


            outputText.innerHTML = "";

            outputText.textContent =
                data.translatedText;


            if (
                source === "auto" &&
                data.detectedLanguage
            ) {

                detectedLanguage.textContent =
                    `Detected: ${data.detectedLanguage}`;

            } else {

                detectedLanguage.textContent =
                    "Translation complete";

            }


            showStatus(
                "Translation completed successfully.",
                "success"
            );

        }

        catch (error) {

            outputText.innerHTML = "";

            outputText.textContent =
                "Unable to translate your text.";

            showStatus(
                error.message,
                "error"
            );

        }

        translateButton.disabled = false;

        buttonText.textContent =
            "Translate Text";

        loader.classList.add("hidden");

    }
);


copyButton.addEventListener(
    "click",
    async function () {

        const text =
            outputText.textContent.trim();


        if (
            !text ||
            text ===
            "Unable to translate your text."
        ) {

            showStatus(
                "Nothing to copy yet.",
                "error"
            );

            return;
        }


        try {

            await navigator.clipboard
                .writeText(text);

            showStatus(
                "Translation copied to clipboard!",
                "success"
            );

        }

        catch {

            showStatus(
                "Could not copy the text.",
                "error"
            );

        }

    }
);


clearButton.addEventListener(
    "click",
    function () {

        inputText.value = "";

        charCount.textContent =
            "0 / 5000";

        outputText.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ✦
                </div>

                <h4>
                    Your translation will appear here
                </h4>

                <p>
                    Select your languages and click
                    translate to get started.
                </p>

            </div>

        `;

        detectedLanguage.textContent =
            "Ready to translate";

        status.textContent = "";

    }
);

swapButton.addEventListener(
    "click",
    function () {

        const source =
            sourceLanguage.value;

        const target =
            targetLanguage.value;


        if (source === "auto") {

            showStatus(
                "Choose a source language before swapping.",
                "error"
            );

            return;
        }


        sourceLanguage.value =
            target;

        targetLanguage.value =
            source;


        const input =
            inputText.value;

        const output =
            outputText.textContent.trim();


        if (
            output &&
            output !==
            "Your translation will appear here"
        ) {

            inputText.value =
                output;

            outputText.textContent =
                input;

            charCount.textContent =
                `${input.length} / 5000`;

        }


        showStatus(
            "Languages swapped.",
            "success"
        );

    }
);


speakButton.addEventListener(
    "click",
    function () {

        const text =
            outputText.textContent.trim();


        if (
            !text ||
            text ===
            "Unable to translate your text."
        ) {

            showStatus(
                "Nothing to listen to yet.",
                "error"
            );

            return;
        }


        if (
            !("speechSynthesis" in window)
        ) {

            showStatus(
                "Text-to-speech is not supported.",
                "error"
            );

            return;
        }


        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(text);


        const languageMap = {

            en: "en-US",

            ur: "ur-PK",

            ar: "ar-SA",

            fr: "fr-FR",

            de: "de-DE",

            es: "es-ES",

            it: "it-IT",

            hi: "hi-IN",

            zh: "zh-CN",

            ja: "ja-JP",

            ko: "ko-KR"

        };


        speech.lang =
            languageMap[targetLanguage.value] ||
            "en-US";


        speech.rate = 0.9;

        speech.pitch = 1;


        window.speechSynthesis.speak(
            speech
        );


        showStatus(
            "Playing translation...",
            "success"
        );

    }
);

function showStatus(message, type) {

    status.textContent =
        message;


    if (type === "success") {

        status.style.color =
            "#39d98a";

    }

    else {

        status.style.color =
            "#ff6b7a";

    }

}
