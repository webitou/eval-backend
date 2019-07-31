export const escapeRegExp = ( term: string ): string => ( term.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' ) );

