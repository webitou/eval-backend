export const ValidateId = ( id ) => ( /^[a-zA-Z0-9]{24}$/.test( id ) );

// USE TO MODELS FORMATION & MANAGE-FORMATION
export const ValidateInteger = ( number: Number ) => ( number === parseInt(number.toString(), 10 ) );
