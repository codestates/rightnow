interface myDate {
  tommorow(): Date;
  sleep(num: number): void;
  dateToString(date: Date, format: string, needTime: boolean): string;
}

const myDate: myDate = {
  tommorow(): Date {
    let tommorow = new Date();
    tommorow.setDate(tommorow.getDate() + 1);
    return tommorow;
  },
  sleep(num: number): void {
    //[1/1000초]

    let now = new Date();

    let stop = now.getTime() + num;

    while (true) {
      now = new Date();

      if (now.getTime() > stop) return;
    }
  },
  dateToString(
    date: Date,
    format: string = '',
    needTime: boolean = false,
  ): string {
    let dd: any = date.getDate();
    let mm: any = date.getMonth() + 1; //January is 0!

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

    let m: any = date.getHours();
    let s: any = date.getMinutes();

    if (m < 10) {
      m = '0' + m;
    }
    if (s < 10) {
      s = '0' + s;
    }
    m = m.toString();
    s = s.toString();

    let s1 = yyyy + format + mm + format + dd;
    let s2 = yyyy + format + mm + format + dd + ' ' + m + ':' + s;
    return needTime ? s2 : s1;
  },
};

export default myDate;
