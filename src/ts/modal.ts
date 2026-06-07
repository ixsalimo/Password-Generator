export default class Modal {

    static #backdrop = document.getElementById("modal-backdrop");
    static #title    = document.getElementById("modal-title");
    static #message  = document.getElementById("modal-message");
    static #input    = document.querySelector<HTMLInputElement>("#modal-input");
    static #confirm  = document.getElementById("modal-confirm");
    static #cancel   = document.getElementById("modal-cancel");

    static #show() {

        this.#backdrop?.classList.remove("hidden");

        requestAnimationFrame(() => this.#input?.focus());

    }

    static #hide() {
        this.#backdrop?.classList.add("hidden");
    }

    static #registerDismissEvents(onDismiss : Function) {

        const onEscape = (event : KeyboardEvent) => {

            if (event.key === "Escape")
                onDismiss();

        };

        const onBackdropClick = (event : PointerEvent) => {

            if (event.target === this.#backdrop)
                onDismiss();

        };

        document.addEventListener("keydown" , onEscape);

        this.#backdrop?.addEventListener("click" , onBackdropClick);

        return () => {

            document.removeEventListener("keydown" , onEscape);

            this.#backdrop?.removeEventListener("click" , onBackdropClick);

        };

    }

    static #registerEscapeEvent(onDismiss : Function) {

        const onEscape = (event : KeyboardEvent) => {

            if (event.key === "Escape")
                onDismiss();

        };

        document.addEventListener("keydown" , onEscape);

        return () => {

            document.removeEventListener("keydown" , onEscape);

        };

    }

    static alert({
        title = "Alert",
        message = "",
        confirmText = "OK"
    } = {}) : Promise<true> {

        return new Promise(resolve => {

            if (this.#title)
                this.#title.textContent = title;

            if (this.#message)
                this.#message.textContent = message;

            if (this.#confirm)
                this.#confirm.textContent = confirmText;

            this.#input?.classList.add("hidden");
            this.#cancel?.classList.add("hidden");

            const close = () => {

                cleanupDismiss();

                this.#confirm?.removeEventListener("click" , onConfirm);
                this.#hide();

                resolve(true);

            };

            const onConfirm = () => close();

            const cleanupDismiss = this.#registerDismissEvents(close);

            this.#confirm?.addEventListener("click" , onConfirm , { once: true });
            this.#show();

        });

    }

    static confirm({
        title = "Confirm",
        message = "",
        confirmText = "Confirm",
        cancelText = "Cancel"
    } = {}) : Promise<boolean> {

        return new Promise(resolve => {

            if (this.#title)
                this.#title.textContent = title;
            
            if (this.#message)
                this.#message.textContent = message;
            
            if (this.#confirm)
                this.#confirm.textContent = confirmText;
            
            if (this.#cancel) {

                this.#cancel.textContent = cancelText;
                this.#cancel.classList.remove("hidden");

            }

            this.#input?.classList.add("hidden");

            const cleanup = () => {

                cleanupDismiss();

                this.#confirm?.removeEventListener("click" , onConfirm);
                this.#cancel?.removeEventListener("click" , onCancel);
                this.#hide();

            };

            const onConfirm = () => {

                cleanup();

                resolve(true);

            };

            const onCancel = () => {

                cleanup();

                resolve(false);

            };

            const cleanupDismiss = this.#registerDismissEvents(onCancel);

            this.#confirm?.addEventListener("click", onConfirm , { once: true });
            this.#cancel?.addEventListener("click", onCancel , { once: true });
            this.#show();

        });

    }

    static prompt({
        title = "Input Required",
        message = "",
        value = "",
        placeholder = "",
        confirmText = "Confirm",
        cancelText = "Cancel"
    } = {}) : Promise<string | undefined | null> {

        return new Promise(resolve => {

            if (this.#title)
                this.#title.textContent = title;

            if (this.#message)
                this.#message.textContent = message;

            if (this.#input) {

                this.#input.value = value;
                this.#input.placeholder = placeholder;
                this.#input.classList.remove("hidden");

            }

            if (this.#confirm)
                this.#confirm.textContent = confirmText;

            if (this.#cancel) {

                this.#cancel.textContent = cancelText;
                this.#cancel.classList.remove("hidden");

            }

            const cleanup = () => {

                cleanupEscape();

                this.#confirm?.removeEventListener("click" , onConfirm);
                this.#cancel?.removeEventListener("click" , onCancel);
                this.#input?.removeEventListener("keydown" , onKeyDown);
                this.#hide();

            };

            const onConfirm = () => {

                const value = this.#input?.value.trim();

                cleanup();

                resolve(value);

            };

            const onCancel = () => {

                cleanup();

                resolve(null);

            };

            const onKeyDown = (event : KeyboardEvent) => {

                if (event.key === "Enter")
                    onConfirm();

            };

            const cleanupEscape = this.#registerEscapeEvent(onCancel);

            this.#confirm?.addEventListener("click" , onConfirm , { once: true });
            this.#cancel?.addEventListener("click" , onCancel , { once: true });
            this.#input?.addEventListener("keydown" , onKeyDown);
            this.#show();

        });

    }

}