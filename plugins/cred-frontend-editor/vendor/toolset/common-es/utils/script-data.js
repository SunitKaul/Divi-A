import { decodeBase64 } from './decode';

/**
 * ScriptData registered on server side
 * Once created this is static data and therefore used as Singelton to save resources by only doing the decoding once.
 *
 * @since 1.0.0
 */
class ScriptData {
	static instance;

	constructor() {
		if ( ScriptData.instance ) {
			return ScriptData.instance;
		}

		ScriptData.instance = this;

		// load sciptData
		const scriptDataNode = document.getElementById( 'toolset_common_es_data' );

		if ( scriptDataNode ) {
			this.data = JSON.parse( decodeBase64( scriptDataNode.textContent ) );
		} else {
			this.data = false;
		}
	}

	getData( key ) {
		if ( ! this.data ) {
			return null;
		}
		return this.data[ key ];
	}
}

export default new ScriptData();
