/**
 * Will receive an array of portions
 * need to create an object with keys as quarter ids and values as array of portions
 */
export function sortPortionsIntoQuarters(portions) {
  const portionsMappedByQuarter = {};

  portions.forEach((portion) => {
    const { timeUnit, customRecitalDetails, lessons } = portion;
    const { recital } = customRecitalDetails;
    if (!portionsMappedByQuarter[timeUnit]) {
      portionsMappedByQuarter[timeUnit] = {
        portions: [],
        recitals: [],
        recitalToLessonMapper: {},
      };
    }

    portionsMappedByQuarter[timeUnit].portions.push(portion);
    portionsMappedByQuarter[timeUnit].recitals.push(recital);
    portionsMappedByQuarter[timeUnit].recitalToLessonMapper[recital] = lessons;
  });

  return portionsMappedByQuarter;
}

export function something() {}
