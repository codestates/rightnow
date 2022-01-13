module.exports = {
  dateToString(date: any, format: string = '', needTime: boolean = false) {
    let dd: string | number = date.getDate();
    let mm: string | number = date.getMonth() + 1; //January is 0!

    let yyyy: any = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }

    yyyy = yyyy.toString();
    mm = mm.toString();
    dd = dd.toString();

    let m: string | number = date.getHours();
    let s: string | number = date.getMinutes();

    if (m < 10) {
      m = '0' + m;
    }
    if (s < 10) {
      s = '0' + s;
    }
    m = m.toString();
    s = s.toString();

    let s1: string = yyyy + format + mm + format + dd;
    let s2: string = yyyy + format + mm + format + dd + ' ' + m + ':' + s;
    return needTime ? s2 : s1;
  },
  randomString(num: any, origin: any) {
    return (
      this.dateToString(new Date()) +
      '-' +
      Math.random().toString(36).substring(0, num) +
      '-' +
      origin
    );
  },
};
