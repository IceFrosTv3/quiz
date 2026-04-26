export interface SignupResponseType {
    error: boolean,
    user?: { id: number, email: string, name: string, lastName: string },
    message: string,
}
