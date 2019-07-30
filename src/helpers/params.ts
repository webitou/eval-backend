export const ValidateId = ( id ) => ( /^[a-zA-Z0-9]{24}$/.test( id ) );

export const ValidateInteger = ( number: Number ) => ( number === parseInt(number.toString() ) );
