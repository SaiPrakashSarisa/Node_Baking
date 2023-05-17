exports.dateAndTime = () => {
  let timestamp = new Date();
  let date = timestamp.getDate();
  let hrs = timestamp.getHours();
  let min = timestamp.getMinutes();
  let sec = timestamp.getSeconds();
  let year = timestamp.getFullYear();
  let mon = timestamp.getMonth();

  if (date < 10) {
    date = "0" + date;
  }

  if (mon < 10) {
    mon = "0" + mon;
  }

  if (hrs < 10) {
    hrs = "0" + hrs;
  }

  if (min < 10) {
    min = "0" + min;
  }

  if (sec < 10) {
    sec = "0" + sec;
  }
  // time
  const time = hrs + ":" + min + ":" + sec;
  // console.log(time);

  // date
  const datee = year + "-" + mon + "-" + date;
  //console.log(datee);

  return { date: datee, time: time };
};
