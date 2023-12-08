export function PrettifyAge(age: number | null | undefined): string
{
    if (age == null)
    {
        return "";
    }
    switch(age) {
        case 0:
            // This case is this to support ethical puppy adoption practices.
            return "Under one year old";
        case 1:
            return `${age} year old`;
        case 2:
            // Some languages have a dual case, normally I think this would probably warrant a library
            return `${age} years old`;
        default:
            return `${age} years old`;
    }
}