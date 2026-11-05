/** A field's error message under it, or nothing. */
export function InputError({ message, id }: { message?: string | null; id?: string }) {
    if (!message) return null;

    return <p id={id} className="cm:text-sm cm:text-destructive">{message}</p>;
}
