// this helps to coodinate the display
export function formatCoordinate(num) {
    return Math.abs(num) >= 100 
        ? num.toFixed(0) 
        : Math.abs(num) >= 10 
            ? num.toFixed(1) 
            : num.toFixed(2);
}