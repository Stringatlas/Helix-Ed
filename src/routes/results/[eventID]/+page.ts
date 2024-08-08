export const load = ( { params } ) => {
    const eventID = params.eventID;

    return {
        eventID: eventID,
    }
}