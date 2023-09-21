export async function validateMongodbID(id: string): Promise<boolean> {
    const regex = /^[0-9a-fA-F]{24}$/;
    return regex.test(id);
}
