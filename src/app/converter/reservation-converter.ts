export class ReservationConverter {
  static readonly SECONDS_SIZE = 3;

  static getDateArray(arr = null) : Array<string> {
    const convertingArray = (arr.length && arr ) || [];
    return convertingArray
      .filter(arrElem => arrElem.time && !arrElem.time.includes("-"))
      .map(arrElem => arrElem.time.substr(0, arrElem.time.length - ReservationConverter.SECONDS_SIZE).toString());
  }
}
