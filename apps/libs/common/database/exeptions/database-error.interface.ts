export interface IDatabaseError {
    readonly code: string
    readonly detail: string
    readonly table: string
}