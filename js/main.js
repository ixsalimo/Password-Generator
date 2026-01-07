/**
 * @typedef Password
 * @property { string } [title]
 * @property { string } password
 * @property { number } length
 * @property { string } createdAt
 */

localStorage.getItem("saved-passwords") ?? localStorage.setItem("saved-passwords" , JSON.stringify([]));

const Elements = {
    /** @type { ?HTMLHeadingElement } */
    PageTitle: document.querySelector("header nav #page-title"),
    /** @type { ?HTMLDivElement } */
    MenuButton: document.querySelector("header nav #menu"),
    MainPage: document.getElementById("main-page"),
    SavedPasswordsPage: document.getElementById("saved-passwords-page"),
    SavedPasswordsSection: document.getElementById("saved-passwords"),
    /** @type { ?HTMLInputElement } */
    PasswordNameInput: document.querySelector("input#password-name"),
    /** @type { ?HTMLInputElement } */
    PasswordLengthInput: document.querySelector("input#password-length"),
    /** @type { Array<HTMLInputElement> } */
    PasswordCharactersCheckboxes: [...document.querySelectorAll("#password-characters input[type='checkbox']:not([name='all'])")],
    /** @type { ?HTMLInputElement } */
    SelectAllCharactersCheckbox: document.querySelector("#password-characters input[name='all']"),
    /** @type { ?HTMLInputElement } */
    GeneratedPasswordInput: document.getElementById("generated-password"),
    /** @type { ?HTMLButtonElement } */
    CreatePasswordButton: document.querySelector("button#create-password-btn"),
    /** @type { ?HTMLButtonElement } */
    SavePasswordButton: document.querySelector("button#save-password-btn"),
    /** @type { ?HTMLButtonElement } */
    ShowPasswordButton: document.querySelector("button#show-password-btn"),
    /** @type { ?HTMLButtonElement } */
    CopyPasswordButton: document.querySelector("button#copy-password-btn"),
    /** @type { ?HTMLParagraphElement } */
    AlertsParagraph: document.querySelector("p#alerts"),
    /** @type { ?HTMLElement } */
    Footer: document.querySelector("footer")
};

/** @type { Array<Password> } */
const SavedPasswords = JSON.parse(localStorage.getItem("saved-passwords"));

/**
 * @param { "open" | "close" } state - *(Default: `open`)*
 */
function setMenuState (state = "open") {

    /** @type { ?HTMLSpanElement } */
    const MenuLine1 = Elements.MenuButton.querySelector("span:nth-child(1)");
    /** @type { ?HTMLSpanElement } */
    const MenuLine2 = Elements.MenuButton.querySelector("span:nth-child(2)");
    /** @type { ?HTMLSpanElement } */
    const MenuLine3 = Elements.MenuButton.querySelector("span:nth-child(3)");

    Elements.Footer.style.display = state === "open" ? "none" : "";

    Elements.PageTitle.textContent = state === "open" ? "Saved Passwords" : "Password Generator";
    Elements.MainPage.classList.toggle("hidden" , state === "open");
    Elements.SavedPasswordsPage.classList.toggle("hidden" , state === "close");
    // Elements.SavedPasswordsPage.style.overflowY = state === "open" ? "scroll" : "";

    MenuLine2.style.transform = state === "open" ? "scale(0)" : "";
    MenuLine1.style.transform = state === "open" ? "rotate(45deg)" : "";
    MenuLine3.style.transform = state === "open" ? "rotate(-45deg)" : "";

    MenuLine1.classList.toggle("close-line" , state === "open");
    MenuLine3.classList.toggle("close-line" , state === "open");
    
    Elements.MenuButton.dataset.state = state;

}

/**
 * @param { string } text
 * @param { "success" | "error" } [mode] - *(Default: `success`)*
 */
function showAlert (text , mode = "success") {

    if (text) {

        Elements.AlertsParagraph.textContent = text;
        Elements.AlertsParagraph.classList.toggle("error" , mode === "error");
        Elements.AlertsParagraph.classList.remove("hidden");

        setTimeout(() => {
            Elements.AlertsParagraph.classList.add("hidden");
            Elements.AlertsParagraph.textContent = "";
        } , 2500);

    }

}

/**
 * @overload
 * @param { string } input
 * @returns { ?string }
 */
/**
 * @overload
 * @param { Array } input
 * @returns { ?Array }
 */
function shuffle (input) {
    
    if (input?.length) {

        let shuffledInput = [...typeof input === "string" ? input.split('') : input];
        let randomIndex;

        for (let i = shuffledInput.length - 1; i > 0; i--) {
            
            randomIndex = Math.floor(Math.random() * (i + 1));

            [ shuffledInput[i] , shuffledInput[randomIndex] ] = [ shuffledInput[randomIndex] , shuffledInput[i] ];
            
        }

        return typeof input === "string" ? shuffledInput.join('') : shuffledInput;

    } else return null;

}

/**
 * @param { number } length - *(Default: `16`)*
 * @param { object } [characters]
 * @param { boolean } [characters.uppers] - *(Default: `true`)*
 * @param { boolean } [characters.lowers] - *(Default: `true`)*
 * @param { boolean } [characters.numbers] - *(Default: `true`)*
 * @param { boolean } [characters.symbols] - *(Default: `false`)*
 * @param { boolean } [characters.space] - *(Default: `false`)*
 */
function generatePassword (length = 16 , { uppers = true , lowers = true , numbers = true , symbols = false , space = false } = {}) {

    if (typeof length === "number" && length) {

        const Uppers  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const Lowers  = Uppers.toLowerCase();
        const Numbers = "0123456789";
        const Symbols = "!@#$%^&*()-_+=[]{}|;:'\",.<>/?~";

        let password = "";
        let charactersContainer = "";

        if (uppers)
            charactersContainer += Uppers;
        
        if (lowers)
            charactersContainer += Lowers;
        
        if (numbers)
            charactersContainer += Numbers;
        
        if (symbols)
            charactersContainer += Symbols;
        
        if (space)
            charactersContainer += ' ';

        if (charactersContainer) {

            charactersContainer = shuffle(charactersContainer);

            const CharactersContainerLength = charactersContainer.length;

            for (let i = 0; i < length; i++)
                password += charactersContainer[Math.floor(Math.random() * CharactersContainerLength)];
    
            return password;

        } else return null;

    } else return null;

}

function insertSavedPasswordsToDocument () {
    
    Elements.SavedPasswordsSection.innerHTML = '';

    SavedPasswords.forEach(function (savedPassword , index) {

        Elements.SavedPasswordsSection.insertAdjacentHTML("beforeend" , `
            <section class="saved-password" data-number="${index + 1}">
                ${savedPassword.title ? `<h2 class="password-title">${savedPassword.title}</h2>` : ''}
                <input type="password" name="password" disabled>
                <div class="password-action-buttons">
                    <button class="btn" data-action="delete">Delete</button>
                    <button class="btn" data-action="copy">Copy</button>
                    <button class="btn" data-action="change-password-visibility">Show</button>
                </div>
                <p class="create-date">${
                    new Date(savedPassword.createdAt).toLocaleString(undefined , {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false
                    })
                }</p>
            </section>`
        );

        Elements.SavedPasswordsSection.querySelector(`.saved-password[data-number="${index + 1}"] > input[name="password"]`).value = savedPassword.password;

    });

}

Elements.MenuButton?.addEventListener("click" ,
    function () {

        setMenuState(this.dataset.state === "open" ? "close" : "open");

    }
);

Elements.PasswordCharactersCheckboxes
.forEach(characterCheckbox => characterCheckbox?.addEventListener("click" ,
    function () {

        if (Elements.PasswordCharactersCheckboxes.some(checkbox => !checkbox.checked) && Elements.SelectAllCharactersCheckbox.checked)
            Elements.SelectAllCharactersCheckbox.checked = false;
        
    }
));

Elements.SelectAllCharactersCheckbox?.addEventListener("click" ,
    function () {

        Elements.PasswordCharactersCheckboxes.forEach(checkbox => checkbox.checked = this.checked);

    }
);

Elements.SavePasswordButton?.addEventListener("click" ,
    /** @this { HTMLButtonElement } */
    function () {

        if (Elements.GeneratedPasswordInput.value) {

            this.classList.add("hidden");
    
            /** @type { Password } */
            const NewPassword = {
                password: Elements.GeneratedPasswordInput.value,
                length: Elements.GeneratedPasswordInput.value.length,
                createdAt: new Date().toISOString()
            };
    
            if (Elements.PasswordNameInput.value)
                NewPassword.title = Elements.PasswordNameInput.value.trim();
            
            SavedPasswords.push(NewPassword);
            
            localStorage.setItem("saved-passwords" , JSON.stringify(SavedPasswords));
    
            insertSavedPasswordsToDocument();
            
            showAlert("Saved ✅");

        } else showAlert("The password is empty ❌" , "error");

    }
);

Elements.CreatePasswordButton?.addEventListener("click" ,
    function () {

        const PasswordLength = parseInt(Elements.PasswordLengthInput?.value || 16);
        const Password = generatePassword(PasswordLength , Object.fromEntries(Elements.PasswordCharactersCheckboxes.map(checkbox => [checkbox.name , checkbox.checked])));

        if (Password) {

            Elements.GeneratedPasswordInput.value = Password;
            Elements.SavePasswordButton.classList.remove("hidden");
            Elements.ShowPasswordButton.classList.remove("hidden");
            Elements.CopyPasswordButton.classList.remove("hidden");
            Elements.ShowPasswordButton.removeAttribute("disabled");
            Elements.CopyPasswordButton.removeAttribute("disabled");

        } else showAlert("At least one character set must be selected ❗" , "error");

    }
);

Elements.ShowPasswordButton?.addEventListener("click" ,
    function () {

        this.textContent = Elements.GeneratedPasswordInput.type === "password" ? "Hide" : "Show";
        Elements.GeneratedPasswordInput.type = Elements.GeneratedPasswordInput.type === "password" ? "text" : "password";

    }
);

Elements.CopyPasswordButton?.addEventListener("click" ,
    function () {

        navigator.clipboard.writeText(Elements.GeneratedPasswordInput.value);
        showAlert("Copied ✅");

    }
);

Elements.SavedPasswordsSection?.addEventListener("click" ,
    function (e) {

        if (e.target.tagName === "BUTTON") {

            /** @type { HTMLButtonElement & { dataset ?: { action : "change-password-visibility" | "copy" | "delete" } } } */
            const ClickedButton = e.target;
            /** @type { HTMLInputElement & { type : "password" | "text" } } */
            const PasswordInput = ClickedButton.parentElement.parentElement.querySelector("input");
            
            switch (ClickedButton.dataset.action) {
                case "change-password-visibility":
                    try {

                        if (PasswordInput) {

                            ClickedButton.textContent = PasswordInput.type === "password" ? "Hide" : "Show";
                            PasswordInput.type = PasswordInput.type === "password" ? "text" : "password";

                        }

                    } catch (error) {
                        console.error(`Error in <Saved Passwords Page> click event handling | Action: ${ClickedButton.dataset.action} ->` , error);
                    }
                    break;
                case "copy":
                    try {

                        navigator.clipboard.writeText(PasswordInput.value);
                        ClickedButton.textContent = "Copied";

                        setTimeout(() => ClickedButton.textContent = "Copy" , 2500);

                    } catch (error) {
                        console.error(`Error in <Saved Passwords Page> click event handling | Action: ${ClickedButton.dataset.action} ->` , error);
                    }
                    break;
                case "delete":
                    try {

                        const PasswordIndex = SavedPasswords.findIndex(savedPassword => savedPassword.title === PasswordInput.parentElement.querySelector(".password-title")?.textContent && savedPassword.password === PasswordInput.value);
                        
                        if (PasswordIndex >= 0) {

                            SavedPasswords.splice(PasswordIndex , 1);
                            ClickedButton.parentElement.parentElement.remove();
                            localStorage.setItem("saved-passwords" , JSON.stringify(SavedPasswords));
    
                            insertSavedPasswordsToDocument();
                            
                        }

                    } catch (error) {
                        console.error(`Error in <Saved Passwords Page> click event handling | Action: ${ClickedButton.dataset.action} ->` , error);
                    }
                    break;
                default:
                    break;
            }

        }
        
    }
);

insertSavedPasswordsToDocument();