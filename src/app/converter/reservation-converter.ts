export class ReservationConverter {
  static getDateArray(arr) : Array<string> {
    if (!arr || arr.length == 0) {
      return []
    }
    return arr
      .filter(arrElem => !arrElem.time.includes("-"))
      .map(arrElem => arrElem.time.substr(0, arrElem.time.length - 3).toString());
  }
}
