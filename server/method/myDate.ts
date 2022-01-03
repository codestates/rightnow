interface myDate {
  tommorow(): Date;
}

const myDate: myDate = {
  tommorow(): Date {
    let tommorow = new Date();
    tommorow.setDate(tommorow.getDate() + 1);
    return tommorow;
  },
};

export default myDate;
