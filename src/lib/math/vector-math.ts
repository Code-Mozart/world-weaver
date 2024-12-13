export namespace VectorMath {
    export function sqrMagnitude(x: number, y: number) {
        return x * x + y * y;
    }

    export function magnitude(x: number, y: number) {
        return Math.sqrt(sqrMagnitude(x, y));
    }
}