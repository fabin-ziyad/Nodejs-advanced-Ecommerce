module.exports = {
    convertDate: (dateobj) => {
        return new Promise((resolve, reject) => {
          let date_ob = dateobj;
          // current date
          // adjust 0 before single digit date
          let date = ("0" + date_ob?.getDate()).slice(-2);
      
          // current month
          let month = ("0" + (date_ob?.getMonth() + 1)).slice(-2);
      
          // current year
          let year = date_ob?.getFullYear();
      
          // current hours
          let hours = date_ob?.getHours();
          let hr = hours >= 12 ? "PM" : "AM";
          // convert to 12-hour format
          let hours12 = hours % 12 || 12;
      
          // current minutes
          let minutes = date_ob?.getMinutes();
      
          // time in 12-hour format
          let time = `${hours12}:${minutes?.toString().padStart(2, '0')} ${hr}`;
      
          // final date-time string
          let dateRes = `${date}-${month}-${year}, ${time}`;
      
          resolve(dateRes);
        });
      }
      
}