function randomValue(min, max, decimals = 0) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

export function getSensorsData(sensors) {
  const data = {};

  sensors.forEach(code => {
    // Convert snake_case to PascalCase for function name
    const funcName = 'get' + code.split('_')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');

    if (typeof this[funcName] === 'function') {
      data[code] = this[funcName](); // call the function
    } else {
      console.warn(`*** Function ${funcName} not found`);
    }
  });

  return data;
}

export function getTemperature() {
  return randomValue(18, 24, 1);
}

export function getCpuTemperature() {
  return randomValue(40, 75, 1);
}

export function getHumidity() {
  return randomValue(53, 68, 1);
}

export function getLed() {
  return Math.random() < 0.5; // true/false
}