
export function getKeyOrDefault( dataSource, key, defaultReturn ) {
	if ( typeof dataSource !== 'object' ) {
		return defaultReturn;
	}

	return dataSource[ key ] ? dataSource[ key ] : defaultReturn;
}
