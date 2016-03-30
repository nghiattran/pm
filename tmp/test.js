var weather = require('npm-openweathermap')

weather.api_key = 'cb0fbee4c319c1507051390282b1d4c4';

weather.current_weather()
.then(function(result){
  console.log(result);
},function(error){
  console.log(error);
});