//this function will reuturn hour if minute is > 60
export const minToHr = min => {
  if (min >= 60) {
    return min / 60;
  }
  return min;
};

// this will get the moon or sun icon based on time
export const tempIcon = () => {
  if (isDay()) {
    return 'sunny';
  } else {
    return 'moon';
  }
};

//return true if its day and false if its night
export const isDay = ()=>{
  const hour = new Date().getHours();
  if (hour > 5 && hour < 19) {
    return true;
  } else {
    return false;
  }
}