/**
 * Media manager for frontend file-related fields using native HTML file inputs.
 *
 * @since 2.4
 * @package CRED
 */

var Toolset = Toolset || {};

Toolset.CRED = Toolset.CRED || {};

Toolset.CRED.MediaFieldBasic = function( $ ) {

	var self = this;

	self.initConstats = function() {
		self.CONST = {
			FILE_SELECTOR: '.js-toolset-media-input-file-upload',
			HIDDEN_SELECTOR: '.js-wpv-credfile-hidden',
			DELETE_SELECTOR: '.js-toolset-media-basic-field-delete',
			SINGLE_CONTAINER_SELECTOR: '.js-wpt-field-items',
			REPEATING_CONTAINER_SELECTOR: '.wpt-repctl',
            PREVIEW_CONTAINER_SELECTOR: '.js-toolset-media-field-preview',
            PREVIEW_ITEM_SELECTOR: '.js-toolset-media-field-preview-item'
		};

		return self;
	};

	self.manageDeleteSelectorClick = function( $deleteSelector ) {
		$deleteSelector.hide();

        var $innerContainer = $deleteSelector.closest( self.CONST.REPEATING_CONTAINER_SELECTOR ),
			$outerContainer = $deleteSelector.closest( self.CONST.SINGLE_CONTAINER_SELECTOR ),
			$form = $deleteSelector.closest( 'form' );

        if ( $innerContainer.length < 1 ) {
            $innerContainer = $outerContainer;
		}

		var $previewContainer = $innerContainer.find( self.CONST.PREVIEW_CONTAINER_SELECTOR );

        // Hide the preview and empty it
        $previewContainer
            .hide()
            .find( self.CONST.PREVIEW_ITEM_SELECTOR )
                .html( '' );

        // Clear the file field
        $innerContainer
            .find( self.CONST.FILE_SELECTOR )
                .show()
                .val( '' )
                .trigger( 'change' );

		if ( $form.hasClass( 'cred_rel_form_class' ) ) {
			// Relationship forms do not "expect" data to be posted,
			// hence it can not act when it is missing:
			// we need to actively tell it that this field has an empty value
			// by making sure the form posts such empty value
			$innerContainer
				.find( self.CONST.HIDDEN_SELECTOR )
					.val( '' );
		} else {
			// Remove the hidden input that might hold current value
			// so nothing is posted for post and user forms
			$innerContainer
				.find( self.CONST.HIDDEN_SELECTOR )
					.remove();
		}
	};

	self.manageInputFileSelectorChange = function( $fileInput ) {
        if ( '' != $fileInput.val() ) {
            var $innerContainer = $fileInput.closest( self.CONST.REPEATING_CONTAINER_SELECTOR ),
                $outerContainer = $fileInput.closest( self.CONST.SINGLE_CONTAINER_SELECTOR );

            if ( $innerContainer.length < 1 ) {
                $innerContainer = $outerContainer;
            }

			var $previewContainer = $innerContainer.find( self.CONST.PREVIEW_CONTAINER_SELECTOR ),
				$deleteSelector = $innerContainer.find( self.CONST.DELETE_SELECTOR );

            $previewContainer
                .show()
                .find( self.CONST.PREVIEW_ITEM_SELECTOR )
					.html( '' );

			$deleteSelector.show();
        }
    };

	/**
	 * Initialize validation methods.
     *
     * Depends on the jQuery validator plugin.
	 *
	 * @since 2.4
	 */
	self.initValidationMethods = function() {
		if ( ! _.has( $, 'validator' ) ) {
            return;
        }

        $.validator.addMethod( 'credfilesize', function( value, element, param ) {
			if ( $( element ).hasClass( 'js-wpt-credfile-upload-file' ) ) {
				return ( this.optional( element ) || ( element.files[0].size <= param[0] ) );
			}
			return true;
		});

        $.validator.addMethod( 'credfiletype', function( value, element, param ) {
			if ( $( element ).hasClass( 'js-wpt-credfile-upload-file' ) ) {
				if ( 'file' === param[0] ) {
					return true;
				}
				return ( this.optional( element ) || ( new RegExp('^' + param[0] + '\/').test( element.files[0].type ) ) );
			}
			return true;
		});

        return self;
    };

	self.initEvents = function() {
		$( document ).on( 'click', self.CONST.DELETE_SELECTOR, function( e ) {
			e.preventDefault();
            self.manageDeleteSelectorClick( $( this ) );
		});

		$( document ).on( 'change', self.CONST.FILE_SELECTOR, function( e ) {
            e.preventDefault();
            self.manageInputFileSelectorChange( $( this ) );
		});

		return self;
	};

	self.init = function() {
		self.initConstats()
			.initValidationMethods()
			.initEvents();
	};

	self.init();
};

jQuery( document ).ready( function( $ ) {
	new Toolset.CRED.MediaFieldBasic( $ );
});
