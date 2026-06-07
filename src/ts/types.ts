export type Password = {
    title ?: string;
    password : string;
    length : number;
    createdAt : string;
}

export type PasswordStrength = {
    level : "Too Weak" | "Weak" | "Medium" | "Strong" | "Very Strong" | "Excellent";
    color : "#DC2626" | "#F97316" | "#EAB308" | "#84CC16" | "#15803D" | "#065F46";
    percentage : number;
}

export type BackupData = {
    application : string;
    website : string;
    exportedAt : string;
    passwords : Array<Password>;
}