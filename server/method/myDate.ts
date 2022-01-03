interface myDate {
  tommorow(): Date;
  sleep(num: number): void;
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
};

export default myDate;
