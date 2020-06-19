//this function will reuturn hour if minute is > 60
export const minToHr = (min)=>{
    if (min >= 60) {
        return (min/60)
    }
    return min;
}