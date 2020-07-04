import {isDay} from './time';

export const bgGradients = {
  warmDay: ['#FF4E50', '#F9D423'],
  coolDay: ['#6DD5FA', '#2980B9'],
  night: ['#414345', '#232526'],
};

export const getGradient = temp => {
  if (isDay()) {
    if (temp > 30) {
      return bgGradients.warmDay;
    } else {
      return bgGradients.coolDay;
    }
  } else {
    return bgGradients.night;
  }
};
