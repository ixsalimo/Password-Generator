import type { Password , BackupData } from "./types";

/**
 * Export passwords as a JavaScript Object Notation (JSON) file
 */
export function exportPasswords (passwords : Array<Password>) {

    if (Array.isArray(passwords) && passwords.length) {

        const BackupData : BackupData = {
            application: "Password Generator",
            website: "https://ixsalimo.github.io/Password-Generator/",
            exportedAt: new Date().toISOString(),
            passwords
        };
        
        const BackupDataBlob      = new Blob([JSON.stringify(BackupData , null , 2)] , { type: "application/json" });
        const BackupDataObjectURL = URL.createObjectURL(BackupDataBlob);
        const AnchorElement       = document.createElement("a");

        AnchorElement.href     = BackupDataObjectURL;
        AnchorElement.download = `ixsalimo_password_generator-backup-${Date.now()}.json`;

        AnchorElement.click();

        URL.revokeObjectURL(BackupDataObjectURL);
        
        return true;
        
    } else return false;

}

export async function extractBackupDataFromFileInput (this: HTMLInputElement , event: Event) : Promise<BackupData | undefined> {

    if (event instanceof Event && this instanceof HTMLInputElement) {

        const BackupDataFile = this.files?.[0];

        if (BackupDataFile instanceof File) {

            try {

                const BackupDataFileContent = await BackupDataFile.text();

                return(BackupDataFileContent ? JSON.parse(BackupDataFileContent) : undefined);

            } catch {
                return;
            }

        } else return;

    } else return;

}