export async function trimValidate(Record: string) {
    Object.keys(Record).map((Arg) => (Record[Arg] = typeof Record[Arg] == 'string' ? Record[Arg].trim() : Record[Arg]));
    return Record;
}
