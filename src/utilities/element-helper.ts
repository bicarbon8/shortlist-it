export module ElementHelper {
    /**
     * removes any characters that cannot be used
     * @param input a `string` containing any values
     * @returns a `string` that can be used as a valid element id
     */
    export function idEncode(input: string): string {
        if (!input) {
            return null;
        }
        // remove any non-alphanumeric characters and replace with '-'
        const id = input?.replace(/([^a-zA-Z0-9]+)/g, '-');
        // if id starts with number prepend 'id-' because ids cannot start with numbers
        return (id.match(/^[0-9]+/)) ? 'id-' + id : id;
    }
}