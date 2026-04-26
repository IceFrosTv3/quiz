export interface LoginResponseType {
    error: boolean,
    accessToken?: string,
    refreshToken?: string,
    fullName?: string,
    userId?: number,
    message: string,
}
