import "../css/reset.css";
import "../css/styles.css";
import "../css/modal.css";

import type { Password , PasswordStrength } from "./types";
import Modal from "./modal";
import { extractBackupDataFromFileInput , exportPasswords } from "./backup";

const StringifiedPasswords             = localStorage.getItem("saved-passwords") ?? JSON.stringify([]);
const SavedPasswords : Array<Password> = JSON.parse(StringifiedPasswords);
const PageTitle                        = document.querySelector<HTMLHeadingElement>("header nav #page-title");
const MenuButton                       = document.getElementById("menu");
const MainPage                         = document.getElementById("main-page");
const SavedPasswordsPage               = document.getElementById("saved-passwords-page");
const SearchPasswordsInput             = document.querySelector<HTMLInputElement & { type : "search" }>("input#search-passwords");
const ImportPasswordsInput             = document.querySelector<HTMLInputElement & { type : "file" }>("input#import-passwords");
const ExportPasswordsButton            = document.querySelector<HTMLButtonElement>("#export-passwords-btn");
const SavedPasswordsSection            = document.getElementById("saved-passwords");
const PasswordTitleInput               = document.querySelector<HTMLInputElement>("input#password-title");
const PasswordLengthInput              = document.querySelector<HTMLInputElement>("input#password-length");
const PasswordCharactersCheckboxes     = [...document.querySelectorAll<HTMLInputElement>("#password-characters input[type='checkbox']:not([name='all'])")];
const SelectAllCharactersCheckbox      = document.querySelector<HTMLInputElement>("#password-characters input[name='all']");
const GeneratedPasswordInput           = document.querySelector<HTMLInputElement>("#generated-password");
const PasswordStrengthContainer        = document.getElementById("password-strength-container");
const PasswordStrengthBar              = document.getElementById("password-strength-bar");
const PasswordStrengthLevel            = document.getElementById("password-strength-level");
const CreatePasswordButton             = document.querySelector<HTMLButtonElement>("button#create-password-btn");
const SavePasswordButton               = document.querySelector<HTMLButtonElement>("button#save-password-btn");
const ShowPasswordButton               = document.querySelector<HTMLButtonElement>("button#show-password-btn");
const CopyPasswordButton               = document.querySelector<HTMLButtonElement>("button#copy-password-btn");
const AlertsParagraph                  = document.querySelector("p#alerts");
const Footer                           = document.querySelector("footer");

let filteredPasswords : Array<Password> | undefined;

/**
 * @param passwords *(Default: __All Saved Passwords__)*
 */
function updatePasswords (passwords : Array<Password> = SavedPasswords) {
   
    if (Array.isArray(passwords))
        localStorage.setItem("saved-passwords" , JSON.stringify(passwords));
    
}

/**
 * @param passwords *(Default: __All Saved Passwords__)*
 */
function renderPasswords (passwords : Array<Password> = filteredPasswords || SavedPasswords) {
    
    if (Array.isArray(passwords) && SavedPasswordsSection && ExportPasswordsButton) {

        SavedPasswordsSection.innerHTML = '';
        ExportPasswordsButton.classList.toggle("hidden" , !passwords.length);
    
        passwords.forEach((savedPassword , index) => {
    
            SavedPasswordsSection.insertAdjacentHTML("beforeend" , `
                <section class="saved-password" data-number="${index + 1}">
                    ${savedPassword.title ? `<h2 class="password-title">${savedPassword.title}</h2>` : ''}
                    <input type="password" name="password" disabled>
                    <div class="password-action-buttons">
                        <button class="btn" data-action="delete" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1C4.29 1 1 4.29 1 12s3.29 11 11 11 11-3.29 11-11S19.71 1 12 1m0 20c-6.561 0-9-2.439-9-9s2.439-9 9-9 9 2.439 9 9-2.439 9-9 9m5.28-12.835c-.057-.017-.919-.262-2.256-.45a6 6 0 0 0-.361-1.018 1 1 0 0 0-.686-.521C13.943 6.168 13.123 6 12 6s-1.929.169-1.962.177a1 1 0 0 0-.679.52c-.035.068-.2.419-.361 1.015-1.351.188-2.221.437-2.278.454a.999.999 0 0 0 .28 1.96q.013-.001.025-.004a62 62 0 0 0-.026 1.722c0 2.996.515 4.866.537 4.944.091.322.337.579.657.682.067.021 1.674.53 3.806.53s3.739-.509 3.807-.53c.319-.103.565-.359.656-.682.021-.078.537-1.948.537-4.944 0-.555-.01-1.181-.026-1.737a.99.99 0 0 0 .986-.703 1 1 0 0 0-.68-1.238zm-2.622 7.539C14.093 15.831 13.13 16 12 16s-2.093-.169-2.658-.296C9.204 14.999 9 13.645 9 11.844c0-.683.016-1.495.04-2.114.802-.122 1.816-.23 2.96-.23s2.158.108 2.961.23c.023.619.039 1.431.039 2.114 0 1.803-.205 3.156-.342 3.86"/></svg>
                        </button>
                        <button class="btn" data-action="edit" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.153 6.875a3.014 3.014 0 0 0-4.238-.009l-5.411 5.411a4.87 4.87 0 0 0-1.435 3.25l-.063 1.429c-.038.569.474 1.081 1.042 1.043l1.439-.062a4.93 4.93 0 0 0 3.265-1.422l5.394-5.396c1.13-1.005 1.125-3.23.008-4.245zm-1.4 2.809-5.412 5.414a2.93 2.93 0 0 1-1.94.841l-.348.015.015-.339a2.87 2.87 0 0 1 .848-1.921l5.412-5.412c.392-.39 1.061-.367 1.438.033.306.278.315 1.084-.013 1.368zM12 1C4.29 1 1 4.29 1 12s3.29 11 11 11 11-3.29 11-11S19.71 1 12 1m0 20c-6.561 0-9-2.439-9-9s2.439-9 9-9 9 2.439 9 9-2.439 9-9 9"/></svg>
                        </button>
                        <button class="btn" data-action="change-password-visibility" title="Change Visibility">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M23.271 9.419A15.9 15.9 0 0 0 19.9 5.51l2.8-2.8a1 1 0 0 0-1.414-1.414l-3.045 3.049A12.05 12.05 0 0 0 12 2.655c-6.191 0-9.719 4.238-11.271 6.764a4.91 4.91 0 0 0 0 5.162A15.9 15.9 0 0 0 4.1 18.49l-2.8 2.8a1 1 0 1 0 1.414 1.414l3.052-3.052A12.05 12.05 0 0 0 12 21.345c6.191 0 9.719-4.238 11.271-6.764a4.91 4.91 0 0 0 0-5.162M2.433 13.534a2.92 2.92 0 0 1 0-3.068C3.767 8.3 6.782 4.655 12 4.655a10.1 10.1 0 0 1 4.766 1.165l-2.013 2.013a4.992 4.992 0 0 0-6.92 6.92l-2.31 2.31a13.7 13.7 0 0 1-3.09-3.529M15 12a3 3 0 0 1-3 3 2.95 2.95 0 0 1-1.285-.3l3.985-3.985A2.95 2.95 0 0 1 15 12m-6 0a3 3 0 0 1 3-3 2.95 2.95 0 0 1 1.285.3L9.3 13.285A2.95 2.95 0 0 1 9 12m12.567 1.534C20.233 15.7 17.218 19.345 12 19.345a10.1 10.1 0 0 1-4.766-1.165l2.013-2.013a4.992 4.992 0 0 0 6.92-6.92l2.31-2.31a13.7 13.7 0 0 1 3.09 3.529 2.92 2.92 0 0 1 0 3.068"/></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="hidden"><path d="M23.271 9.419C21.72 6.893 18.192 2.655 12 2.655S2.28 6.893.729 9.419a4.91 4.91 0 0 0 0 5.162C2.28 17.107 5.808 21.345 12 21.345s9.72-4.238 11.271-6.764a4.91 4.91 0 0 0 0-5.162m-1.705 4.115C20.234 15.7 17.219 19.345 12 19.345S3.766 15.7 2.434 13.534a2.92 2.92 0 0 1 0-3.068C3.766 8.3 6.781 4.655 12 4.655s8.234 3.641 9.566 5.811a2.92 2.92 0 0 1 0 3.068"/><path d="M12 7a5 5 0 1 0 5 5 5.006 5.006 0 0 0-5-5m0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3"/></svg>
                        </button>
                        <button class="btn" data-action="copy" title="Copy To Clipboard">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.737 19.131a32 32 0 0 1-.411 2.433 1 1 0 0 1-.762.762c-.126.028-3.101.673-6.064.673s-5.939-.646-6.064-.673a1 1 0 0 1-.762-.762c-.028-.125-.673-3.102-.673-6.064s.646-5.939.673-6.064a1 1 0 0 1 .762-.762c.042-.009 1.031-.225 2.433-.411a1 1 0 1 1 .263 1.983c-.66.087-1.227.183-1.629.256-.183 1.002-.502 3.033-.502 4.999s.319 3.996.502 4.998c1.002.183 3.032.502 4.998.502s3.997-.319 4.998-.502c.073-.402.169-.97.257-1.629a.999.999 0 1 1 1.982.263zM23 8.5c0 2.963-.646 5.939-.674 6.064a1 1 0 0 1-.762.762c-.126.028-3.102.673-6.064.673s-5.939-.646-6.064-.673a1 1 0 0 1-.762-.762c-.028-.125-.673-3.101-.673-6.064s.646-5.939.673-6.064a1 1 0 0 1 .762-.762c.125-.028 3.102-.673 6.064-.673s5.938.646 6.064.673a1 1 0 0 1 .762.762c.027.125.674 3.101.674 6.064m-2 0c0-1.966-.319-3.997-.502-4.998C19.496 3.319 17.466 3 15.5 3s-3.996.319-4.998.502C10.319 4.504 10 6.534 10 8.5s.319 3.997.502 4.998c1.002.183 3.032.502 4.998.502s3.996-.319 4.998-.502c.183-1.001.502-3.032.502-4.998"/></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="hidden"><path d="M17.305 9.539c-1.312 2.053-3.18 4.626-6.001 6.319a1 1 0 0 1-1.05-.013c-1.52-.963-2.661-1.995-3.594-3.248a1 1 0 0 1 1.603-1.194c.674.905 1.488 1.679 2.536 2.405 2.16-1.46 3.644-3.507 4.819-5.346a1 1 0 1 1 1.686 1.077zM23 12c0 7.71-3.29 11-11 11S1 19.71 1 12 4.29 1 12 1s11 3.29 11 11m-2 0c0-6.561-2.439-9-9-9s-9 2.439-9 9 2.439 9 9 9 9-2.439 9-9"/></svg>
                        </button>
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

            SavedPasswordsSection.querySelector<HTMLInputElement>(`.saved-password[data-number="${index + 1}"] input[name="password"]`)!.value = savedPassword.password;
    
        });

    }

}

/**
 * @param passwords *(Default: __All Saved Passwords__)*
 */
function updateAndRenderPasswords (passwords : Array<Password> = SavedPasswords) {

    updatePasswords(passwords);
    renderPasswords();

}

/**
 * @param state *(Default: `open`)*
 */
function setMenuState (state : "open" | "close" = "open") {

    if (PageTitle && MenuButton && MainPage && SavedPasswordsPage && SearchPasswordsInput && Footer) {

        const MenuLine1 = MenuButton.querySelector<HTMLSpanElement>("span:nth-child(1)");
        const MenuLine2 = MenuButton.querySelector<HTMLSpanElement>("span:nth-child(2)");
        const MenuLine3 = MenuButton.querySelector<HTMLSpanElement>("span:nth-child(3)");
    
        if (state === "close") {
    
            SearchPasswordsInput.value = "";
    
            filteredPasswords = undefined;

            renderPasswords();
    
        }
    
        Footer.style.display = state === "open" ? "none" : "";
    
        PageTitle.textContent = state === "open" ? "Saved Passwords" : "Password Generator";
        MainPage.classList.toggle("hidden" , state === "open");
        SavedPasswordsPage.classList.toggle("hidden" , state === "close");
    
        if (MenuLine1 && MenuLine2 && MenuLine3) {

            MenuLine2.style.transform = state === "open" ? "scale(0)" : "";
            MenuLine1.style.transform = state === "open" ? "rotate(45deg)" : "";
            MenuLine3.style.transform = state === "open" ? "rotate(-45deg)" : "";
        
            MenuLine1.classList.toggle("close-line" , state === "open");
            MenuLine3.classList.toggle("close-line" , state === "open");

        }
    
        MenuButton.dataset.state = state;

    }

}

/**
 * @param mode *(Default: `success`)*
 */
function showAlert (text : string , mode : "success" | "error" = "success") {

    if (text && AlertsParagraph) {

        AlertsParagraph.textContent = text;
        AlertsParagraph.classList.toggle("error" , mode === "error");
        AlertsParagraph.classList.remove("hidden");

        setTimeout(() => {
            AlertsParagraph.classList.add("hidden");
            AlertsParagraph.textContent = "";
        } , 2500);

    }

}

/**
 * Generates a cryptographically secure random integer between `0` (inclusive) and `max` (exclusive)
 */
function getRandomSecureNumber (max : number) {

    if (typeof max === "number" && max > 0) {

        const Uint32 = new Uint32Array(1);
    
        window.crypto.getRandomValues(Uint32);
    
        return Uint32[0] % max;

    } else return 0;

}

function shuffle (input : string) : string | null;
function shuffle<T> (input : Array<T>) : Array<T> | null;
function shuffle<T> (input : string | Array<T>) : string | Array<T> | null {
    
    if (input?.length) {

        let shuffledInput = [...(typeof input === "string" ? input.split('') : input)];
        let randomIndex : number | undefined;

        for (let i = shuffledInput.length - 1; i > 0; i--) {
            
            randomIndex = getRandomSecureNumber(i + 1);

            [ shuffledInput[i] , shuffledInput[randomIndex] ] = [ shuffledInput[randomIndex] , shuffledInput[i] ];
            
        }

        return typeof input === "string" ? shuffledInput.join('') : shuffledInput as Array<T>;

    } else return null;

}

function getRandom (input : string) : string | null;
function getRandom<T> (input : Array<T>) : T | null;
function getRandom<T> (input : string | Array<T>) : string | T | null {
    return input?.length ? input[getRandomSecureNumber(input.length)] : null;
}

function calculatePasswordEntropy (charactersContainerLength : number , passwordLength : number) {
    return typeof charactersContainerLength === "number" && typeof passwordLength === "number" ? passwordLength * Math.log2(charactersContainerLength) : 0;
}

function getPasswordStrengthPercentageByEntropy (passwordEntropy : number) {
    return Math.min(Math.round(passwordEntropy) , 100);
}

function getPasswordStrengthByEntropy (passwordEntropy : number) {

    const PasswordStrength : PasswordStrength = {
        level: "Excellent",
        color: "#065F46",
        percentage: getPasswordStrengthPercentageByEntropy(passwordEntropy)
    };

    if (passwordEntropy < 30) {

        PasswordStrength.level = "Too Weak";
        PasswordStrength.color = "#DC2626";

    } else if (passwordEntropy < 50) {

        PasswordStrength.level = "Weak";
        PasswordStrength.color = "#F97316";

    } else if (passwordEntropy < 70) {

        PasswordStrength.level = "Medium";
        PasswordStrength.color = "#EAB308";

    } else if (passwordEntropy < 90) {

        PasswordStrength.level = "Strong";
        PasswordStrength.color = "#84CC16";

    } else if (passwordEntropy < 110) {

        PasswordStrength.level = "Very Strong";
        PasswordStrength.color = "#15803D";
        
    }

    return PasswordStrength;

}

function generatePassword (length = 16 , { uppers = true , lowers = true , numbers = true , symbols = false , space = false } : Partial<{
    /** *(Default: `true`)* */
    uppers : boolean;
    /** *(Default: `true`)* */
    lowers : boolean;
    /** *(Default: `true`)* */
    numbers : boolean;
    /** *(Default: `false`)* */
    symbols : boolean;
    /** *(Default: `false`)* */
    space : boolean;
}> = {}) {

    if (typeof length === "number" && length) {

        const Uppers                               = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const Lowers                               = Uppers.toLowerCase();
        const Numbers                              = "0123456789";
        const Symbols                              = "!@#$%^&*()-_+=[]{}|;:'\",.<>/?~";
        const CharacterSets : Array<string> = [];
        const PasswordCharacters : Array<string>   = [];

        if (uppers)
            CharacterSets.push(Uppers);
        
        if (lowers)
            CharacterSets.push(Lowers);
        
        if (numbers)
            CharacterSets.push(Numbers);
        
        if (symbols)
            CharacterSets.push(Symbols);
        
        if (space)
            CharacterSets.push(' ');

        if (CharacterSets.length) {

            if (CharacterSets.length <= length)
                for (const CharacterSet of CharacterSets)
                    PasswordCharacters.push(getRandom(CharacterSet)!);

            const CharactersContainer = CharacterSets.join('');

            while (PasswordCharacters.length < length)
                PasswordCharacters.push(getRandom(CharactersContainer)!);
    
            return {
                password: shuffle(PasswordCharacters)!.join(''),
                entropy: calculatePasswordEntropy(CharactersContainer.length , length)
            };

        } else return null;

    } else return null;

}

/**
 * @param filterValue *(Default: __Search input's value__)*
 */
const filterPasswords = (filterValue = SearchPasswordsInput?.value.trim().toLowerCase()) => typeof filterValue === "string" && filterValue.length ? SavedPasswords.filter(password => password.title?.toLowerCase().includes(filterValue) || password.password.toLowerCase().includes(filterValue)) : undefined;

MenuButton?.addEventListener("click" ,
    function () {

        setMenuState(this.dataset.state === "open" ? "close" : "open");

    }
);

PasswordCharactersCheckboxes
.forEach(characterCheckbox => characterCheckbox?.addEventListener("click" ,
    function () {

        if (PasswordCharactersCheckboxes.some(checkbox => !checkbox.checked) && SelectAllCharactersCheckbox?.checked)
            SelectAllCharactersCheckbox.checked = false;
        
    }
));

SelectAllCharactersCheckbox?.addEventListener("click" ,
    function () {

        PasswordCharactersCheckboxes.forEach(checkbox => checkbox.checked = this.checked);

    }
);

SavePasswordButton?.addEventListener("click" ,
    /** @this { HTMLButtonElement } */
    function () {

        if (GeneratedPasswordInput?.value) {

            this.classList.add("hidden");

            const NewPassword : Password = {
                password: GeneratedPasswordInput.value,
                length: GeneratedPasswordInput.value.length,
                createdAt: new Date().toISOString()
            };
    
            if (PasswordTitleInput?.value)
                NewPassword.title = PasswordTitleInput.value.trim();
            
            SavedPasswords.push(NewPassword);
            
            updateAndRenderPasswords();
            
            showAlert("Saved ✅");

        } else showAlert("The password is empty ❌" , "error");

    }
);

CreatePasswordButton?.addEventListener("click" ,
    function () {

        const PasswordLength    = Number(PasswordLengthInput?.value || 16);
        const GeneratedPassword = generatePassword(PasswordLength , Object.fromEntries(PasswordCharactersCheckboxes.map(checkbox => [checkbox.name , checkbox.checked])));

        if (GeneratedPassword) {

            const GeneratedPasswordStrength = getPasswordStrengthByEntropy(GeneratedPassword.entropy);

            if (GeneratedPasswordInput)
                GeneratedPasswordInput.value = GeneratedPassword.password;

            if (PasswordStrengthContainer) {

                PasswordStrengthContainer.style.setProperty("--color" , GeneratedPasswordStrength.color);
                PasswordStrengthContainer.classList.remove("hidden");

            }

            if (PasswordStrengthBar)
                PasswordStrengthBar.style.width = `${GeneratedPasswordStrength.percentage}%`;

            if (PasswordStrengthLevel)
                PasswordStrengthLevel.textContent = GeneratedPasswordStrength.level;

            if (SavePasswordButton)
                SavePasswordButton.classList.remove("hidden");

            if (ShowPasswordButton) {

                ShowPasswordButton.classList.remove("hidden");
                ShowPasswordButton.removeAttribute("disabled");

            }

            if  (CopyPasswordButton) {

                CopyPasswordButton.classList.remove("hidden");
                CopyPasswordButton.removeAttribute("disabled");

            }

        } else showAlert("At least one character set must be selected ❗" , "error");

    }
);

ShowPasswordButton?.addEventListener("click" ,
    function () {

        if (GeneratedPasswordInput) {
            
            this.textContent = GeneratedPasswordInput.type === "password" ? "Hide" : "Show";
            GeneratedPasswordInput.type = GeneratedPasswordInput.type === "password" ? "text" : "password";

        }

    }
);

CopyPasswordButton?.addEventListener("click" ,
    function () {

        if (GeneratedPasswordInput?.value) {

            navigator.clipboard.writeText(GeneratedPasswordInput.value);
            showAlert("Copied ✅");

        } else showAlert("Password is empty ❗" , "error");

    }
);

SavedPasswordsSection?.addEventListener("click" ,
    async function (e : PointerEvent) {

        const ClickedElement = e.target;

        if (ClickedElement instanceof HTMLButtonElement) {

            const ClickedButtonAction  = ClickedElement.dataset.action as "change-password-visibility" | "copy" | "edit" | "delete";
            const ClickedButtonIcons   = ClickedElement.querySelectorAll("svg");
            const PasswordBox          = ClickedElement.parentElement?.parentElement;
            const PasswordInput        = PasswordBox?.querySelector<HTMLInputElement & { type : "password" | "text" }>("input[name='password']");
            const PasswordTitleElement = PasswordBox?.querySelector<HTMLInputElement>(".password-title");

            function toggleElementsHiddenClass (elements : NodeListOf<Element>) {

                elements?.forEach(element => {

                    if (element instanceof Element)
                        element.classList.toggle("hidden");

                });

            };

            if (ClickedButtonIcons.length > 1)
                toggleElementsHiddenClass(ClickedButtonIcons);
            
            switch (ClickedButtonAction) {
                case "change-password-visibility":
                    try {

                        if (PasswordInput)
                            PasswordInput.type = PasswordInput.type === "password" ? "text" : "password";

                    } catch (error) {
                        console.error(`Error in <Saved Passwords Page> click event handling | Action: ${ClickedButtonAction} ->` , error);
                    }
                    break;
                case "copy":
                    try {

                        if (PasswordInput?.value) {

                            navigator.clipboard.writeText(PasswordInput.value);
    
                            setTimeout(toggleElementsHiddenClass , 2500 , ClickedButtonIcons);

                        }

                    } catch (error) {
                        console.error(`Error in <Saved Passwords Page> click event handling | Action: ${ClickedButtonAction} ->` , error);
                    }
                    break;
                case "edit":
                case "delete":
                    try {

                        const PasswordIndex = SavedPasswords.findIndex(savedPassword => savedPassword.title === PasswordTitleElement?.textContent && savedPassword.password === PasswordInput?.value);

                        if (PasswordIndex >= 0) {

                            (ClickedButtonAction === "delete"
                                ? Modal.confirm({
                                    title: "Delete Password?",
                                    message: "This action cannot be undone",
                                    confirmText: "Delete"
                                })
                                : Modal.prompt({
                                    title: "Rename Password",
                                    confirmText: "Rename",
                                    placeholder: "Enter a name...",
                                    value: PasswordTitleElement?.textContent
                                })
                            ).then(userResponse => {

                                let updatePasswords = false;

                                if (ClickedButtonAction === "edit" && typeof userResponse === "string") {

                                    if (userResponse)
                                        SavedPasswords[PasswordIndex].title = userResponse;
                                    else delete SavedPasswords[PasswordIndex].title;
                                    
                                    updatePasswords = true;

                                } else if (userResponse) {

                                    SavedPasswords.splice(PasswordIndex , 1);
                                    PasswordBox?.remove();

                                    updatePasswords = true;

                                }

                                if (updatePasswords) {

                                    filteredPasswords = filterPasswords();

                                    updateAndRenderPasswords();

                                }
                                
                            });

                        }

                    } catch (error) {
                        console.error(`Error in <Saved Passwords Page> click event handling | Action: ${ClickedButtonAction} ->` , error);
                    }
                    break;
                default:
                    break;
            }

        }
        
    }
);

SearchPasswordsInput?.addEventListener("input" ,
    function () {

        filteredPasswords = filterPasswords();

        renderPasswords(Array.isArray(filteredPasswords) ? filteredPasswords : SavedPasswords);
        
    }
);

ImportPasswordsInput?.addEventListener("change" ,
    async function (e) {

        const ImportedPasswords = (await extractBackupDataFromFileInput.call(this , e))?.passwords;

        if (Array.isArray(ImportedPasswords)) {

            let alertTitle   = "Nothing Imported";
            let alertMessage = "No passwords were found in the selected file.";

            if (ImportedPasswords.length) {

                let importedPasswordsCount  = 0;
                let duplicatePasswordsCount = 0;

                const isSamePassword = (savedPassword : Password , importedPassword : Password) => savedPassword?.title === importedPassword?.title && savedPassword?.password === importedPassword?.password;
    
                ImportedPasswords.forEach(importedPassword => {
    
                    if (SavedPasswords.some(savedPassword => isSamePassword(savedPassword , importedPassword)))
                        duplicatePasswordsCount++;
                    else {

                        SavedPasswords.push(importedPassword);
                        importedPasswordsCount++;

                    }
    
                });

                if (importedPasswordsCount) {

                    updateAndRenderPasswords();
                    
                    alertTitle   = "Import Completed";
                    alertMessage = `${importedPasswordsCount.toLocaleString()} password${importedPasswordsCount === 1 ? '' : 's'} imported successfully.`;

                    if (duplicatePasswordsCount)
                        alertMessage += `\n${duplicatePasswordsCount.toLocaleString()} duplicate password${duplicatePasswordsCount === 1 ? '' : 's'} skipped.`;

                } else {

                    alertTitle   = "No New Passwords";
                    alertMessage = "All passwords in the selected file already exist.";

                }
    
            }

            await Modal.alert({
                title: alertTitle,
                message: alertMessage
            });

            this.value = '';

        }

    }
);

ExportPasswordsButton?.addEventListener("click" , () => exportPasswords(filteredPasswords?.length ? filteredPasswords : SavedPasswords));

renderPasswords();