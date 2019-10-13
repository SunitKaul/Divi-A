/**
 * Media manager for frontend file-related fields.
 *
 * @since 2.4
 * @package CRED
 */

var Toolset = Toolset || {};

Toolset.CRED = Toolset.CRED || {};

Toolset.CRED.MediaField = function( $ ) {
    Toolset.Common.MediaField.call( this );

	var self = this;

	self.instanceI18n = cred_media_manager_i18n;

	// Sometimes, the global ajaxurl is not available
	// but it is needed by the images editor.
	// This should go to the prototype!!
	window.ajaxurl = self.instanceI18n.ajaxurl;

    self.initConstants = function() {
        self.CONST = _.extend( {}, self.CONST, {
            INPUT_HIDDEN_SELECTOR: '.js-toolset-media-field-hidden',
            DELETE_SELECTOR: '.js-toolset-media-field-delete',
            REPEATING_CONTAINER_SELECTOR: '.wpt-repctl',
            PREVIEW_CONTAINER_SELECTOR: '.js-toolset-media-field-preview',
            PREVIEW_ITEM_SELECTOR: '.js-toolset-media-field-preview-item'
        } );

        return self;
	};

	self.initDialogClassname = function() {
		self.dialogClassName += ' toolset-forms-frontend-media-frame js-toolset-forms-frontend-media-frame';
		return self;
	}

	self.initStyles = function() {
		if ( self.stylesAdded ) {
			return;
		}

		if ( document.getElementById( 'js-toolset-forms-frontend-media-frame-style' ) ) {
			self.stylesAdded = true;
			return;
		}

		var head = document.getElementsByTagName( 'head' )[0],
			style = document.createElement( 'style' ),
			css = '';

		// Hide edit action for users without edit_posts capabilities
		if ( ! self.instanceI18n.user.capabilities.edit ) {
			css += '.toolset-forms-frontend-media-frame .attachment-info .edit-attachment { display: none; }';
		}

		// Hide trash, delete and untrash actions
		css += '.toolset-forms-frontend-media-frame .button-link.untrash-attachment, ' +
			'.toolset-forms-frontend-media-frame .button-link.trash-attachment, ' +
			'.toolset-forms-frontend-media-frame .button-link.delete-attachment { display: none; }';

		// Enforce clearfix behavior and some important styles
		css += '.toolset-forms-frontend-media-frame .wp-clearfix { content: ""; display: table; clear: both; }';
		css += '.toolset-forms-frontend-media-frame .nowrap label { display: inline-block; }';

		// Make sure that the clear and replace handles are as well aligned as possible
		css += '.wpt-credfile-action .wpt-credfile-delete:before { vertical-align: top; }';

		// Theme specific styles
		css += self.instanceI18n.themeStyles;

		style.type = 'text/css';
		style.id = 'js-toolset-forms-frontend-media-frame-style';

		if ( style.styleSheet ) {
			// This is required for IE8 and below.
			style.styleSheet.cssText = css;
		} else {
			style.appendChild( document.createTextNode( css ) );
		}

		head.appendChild( style );

		self.stylesAdded = true;

		return self;
	}

    /**
	 * Initialize validation methods.
     *
     * Depends on the jQuery validator plugin.
	 *
	 * @since 2.2
	 */
	self.initValidationMethods = function() {
		if ( ! _.has( $, 'validator' ) ) {
            return;
        }

        /*
         * Define a mime_type validation method, always passes :-/
         * Keep it since we define a mime_type backend validation
         * which must span to frontend validation,
         * even if we do nothing.
         */
        $.validator.addMethod( "mime_type", function( value, element, param ) {
            return true;
        });

        return self;
    };

    self.initEvents = function() {
		self.constructor.prototype.initEvents.call( self );

        $( document ).on( 'click', self.CONST.DELETE_SELECTOR, function( e ) {
            e.preventDefault();
            self.manageDeleteSelectorClick( $( this ) );
        });

		return self;
	};

    self.initHooks = function() {
		self.constructor.prototype.initHooks.call( self );

        Toolset.hooks.addAction( 'toolset_media_field_wp_media_onOpen', function( data ) {
			data.wpMedia.uploader.uploader.param( 'toolsetOrigin', 'toolsetForms' );
			var $form = data.selector.closest( 'form' ),
				postId = $( "input[name='_cred_cred_prefix_post_id']", $form ).val(),
				formId = $( "input[name='_cred_cred_prefix_form_id']", $form ).val(),
				metaKey = data.metaData.metakey,
				metaType = data.metaData.type;
			data.wpMedia.uploader.uploader.param( 'toolsetFormsPostId', postId );
			data.wpMedia.uploader.uploader.param( 'toolsetFormsFormId', formId );
			data.wpMedia.uploader.uploader.param( 'toolsetFormsMetaKey', metaKey );
			data.wpMedia.uploader.uploader.param( 'toolsetFormsMetaType', metaType );
		});

        Toolset.hooks.addFilter( 'toolset_media_field_library_query_arguments', function( queryArguments, data ) {
			var $form = data.selector.closest( 'form' ),
				formId = $( "input[name='_cred_cred_prefix_form_id']", $form ).val();

			queryArguments.toolset_media_management_origin = 'toolsetForms';
			queryArguments.toolset_media_management_form_id = formId;
			return queryArguments;
		});

		return self;
	};

    self.setFieldValue = function( $instance, mediaItem ) {
        $instance
			.find( self.CONST.INPUT_HIDDEN_SELECTOR )
				.val( mediaItem.url )
				.trigger( 'change' );
    };

    self.manageFieldPreview = function( $instance, mediaItem ) {
        var $previewContainer = $instance.find( self.CONST.PREVIEW_CONTAINER_SELECTOR ),
			$mediaSelector = $instance.find( self.CONST.INPUT_SELECTOR ),
			$deleteSelector = $instance.find( self.CONST.DELETE_SELECTOR ),
            metaData = $mediaSelector.data( 'meta' );

        metaData = _.defaults( metaData, {
            metakey: '',
            parent: 0,
            type: '',
            preview: '',
            multiple: false,
            select_label: '',
            edit_label: ''
        });

        if ( '' == metaData.preview ) {
            if ( _.contains( [ 'audio', 'file', 'video' ], metaData.type ) ) {
                metaData.preview = 'url';
            }
            if ( _.contains( [ 'image' ], metaData.type ) ) {
                metaData.preview = 'img';
            }
        }

        switch( metaData.preview ) {
            case 'img':
                var previewString = '<img src="' + mediaItem.url + '" alt="' + mediaItem.alt + '" title="' + mediaItem.title + '" />';
                $previewContainer
                    .show()
                    .find( self.CONST.PREVIEW_ITEM_SELECTOR )
                        .html( previewString );
                break;
            case 'url':
                $previewContainer
                    .show()
                    .find( self.CONST.PREVIEW_ITEM_SELECTOR )
                        .html( mediaItem.url );
                break;
            case 'filename':
                $previewContainer
                    .show()
                    .find( self.CONST.PREVIEW_ITEM_SELECTOR )
                        .html( mediaItem.filename );
                break;
            default:
                $previewContainer.hide();
                break;
        }

		$mediaSelector.val( metaData[ 'edit_label' ] );
		$deleteSelector.show();

    };

    self.setParentId = function( parentId, $mediaSelector ) {
        wp.media.model.settings.post.id = parentId;
        return parentId;
    };

    self.manageDeleteSelectorClick = function( $deleteSelector ) {
		$deleteSelector.hide();

        var $innerContainer = $deleteSelector.closest( self.CONST.REPEATING_CONTAINER_SELECTOR ),
            $outerContainer = $deleteSelector.closest( self.CONST.SINGLE_CONTAINER_SELECTOR );

        if ( $innerContainer.length < 1 ) {
            $innerContainer = $outerContainer;
		}

		var $previewContainer = $innerContainer.find( self.CONST.PREVIEW_CONTAINER_SELECTOR );

        // Hide the preview and empty it
        $previewContainer
            .hide()
            .find( self.CONST.PREVIEW_ITEM_SELECTOR )
                .html( '' );

        // When using the native media manager, clear the hidden input holding the actual value
        $innerContainer
            .find( self.CONST.INPUT_HIDDEN_SELECTOR )
                .val( '' )
                .trigger( 'change' );

        // When using the native media manager, adjust the button label
        var $mediaSelector = $innerContainer.find( self.CONST.INPUT_SELECTOR );
        if ( $mediaSelector.length ) {
            var metaData = $mediaSelector.data( 'meta' );
            metaData = _.defaults( metaData, {
                select_label: ''
            });

            $mediaSelector.val( metaData[ 'select_label' ] );
        }
    };

    self.init();
};

Toolset.CRED.MediaField.prototype = Object.create( Toolset.Common.MediaField.prototype );

jQuery( document ).ready( function( $ ) {
	new Toolset.CRED.MediaField( $ );
});
