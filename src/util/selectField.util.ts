export function selectFields(field: string | string[]) {
    let selectFields = {};

    if (Array.isArray(field)) {
        selectFields = field.reduce((acc, curr) => {
            acc[curr] = true;
            return acc;
        }, {});
    } else if (field) {
        selectFields = { [field]: true };
    }

    return selectFields;
}
