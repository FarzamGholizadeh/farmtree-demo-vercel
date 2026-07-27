(function (wp) {
  if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components || !wp.i18n) {
    return;
  }

  var el = wp.element.createElement;
  var Fragment = wp.element.Fragment;
  var __ = wp.i18n.__;
  var registerBlockType = wp.blocks.registerBlockType;
  var InspectorControls = wp.blockEditor.InspectorControls;
  var MediaUpload = wp.blockEditor.MediaUpload;
  var MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
  var PanelBody = wp.components.PanelBody;
  var TextControl = wp.components.TextControl;
  var TextareaControl = wp.components.TextareaControl;
  var ToggleControl = wp.components.ToggleControl;
  var Button = wp.components.Button;
  var Notice = wp.components.Notice;

  var defaults = {
    kicker: 'AGROFORESTRY INTELLIGENCE',
    title: 'Make agroforestry measurable, investable and scalable.',
    text: 'FarmTree helps organisations turn agroforestry complexity into clearer project intelligence for planning, reporting and investment decisions.',
    mediaUrl: '',
    mediaAlt: 'Agroforestry landscape planning — tree-based farming systems and landscape investment in Madagascar',
    primaryText: 'Request a demo ↗',
    primaryUrl: 'https://tool.farmtree.earth/Identity/Account/Register',
    secondaryText: 'Ask for a quotation ↗',
    futureLabel: 'Future service',
    futureTitle: 'Design your own agroforestry system',
    futureText: 'Explore how FarmTree turns agroforestry scenarios into measurable outcomes and investment-ready plans.',
    showFutureCard: true
  };

  function attr(attributes, key) {
    return attributes[key] === undefined || attributes[key] === '' ? defaults[key] : attributes[key];
  }

  function textControl(label, key, attributes, setAttributes, help) {
    return el(TextControl, {
      label: label,
      value: attr(attributes, key),
      help: help || '',
      onChange: function (value) {
        var next = {};
        next[key] = value;
        setAttributes(next);
      }
    });
  }

  if (wp.blocks.getBlockType('farmtree/homepage-hero')) {
    wp.blocks.unregisterBlockType('farmtree/homepage-hero');
  }

  registerBlockType('farmtree/homepage-hero', {
    title: __('FarmTree Homepage Hero', 'farmtree'),
    category: 'theme',
    icon: 'palmtree',
    description: __('Editable FarmTree homepage hero using the approved frontend design.', 'farmtree'),
    attributes: {
      kicker: {
        type: 'string',
        default: defaults.kicker
      },
      title: {
        type: 'string',
        default: defaults.title
      },
      text: {
        type: 'string',
        default: defaults.text
      },
      mediaId: {
        type: 'number',
        default: 0
      },
      mediaUrl: {
        type: 'string',
        default: defaults.mediaUrl
      },
      mediaAlt: {
        type: 'string',
        default: defaults.mediaAlt
      },
      primaryText: {
        type: 'string',
        default: defaults.primaryText
      },
      primaryUrl: {
        type: 'string',
        default: defaults.primaryUrl
      },
      secondaryText: {
        type: 'string',
        default: defaults.secondaryText
      },
      futureLabel: {
        type: 'string',
        default: defaults.futureLabel
      },
      futureTitle: {
        type: 'string',
        default: defaults.futureTitle
      },
      futureText: {
        type: 'string',
        default: defaults.futureText
      },
      showFutureCard: {
        type: 'boolean',
        default: defaults.showFutureCard
      }
    },
    supports: {
      align: false,
      anchor: false,
      color: false,
      customClassName: false,
      html: false,
      spacing: false,
      typography: false
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var mediaUrl = attr(attributes, 'mediaUrl') || (window.FT_ASSETS ? window.FT_ASSETS + '/case-giz_opt.webp' : '');
      var showFutureCard = attributes.showFutureCard !== false;

      return el(Fragment, {},
        el(InspectorControls, {},
          el(PanelBody, { title: __('Hero content', 'farmtree'), initialOpen: true },
            textControl(__('Kicker', 'farmtree'), 'kicker', attributes, setAttributes),
            textControl(__('Headline', 'farmtree'), 'title', attributes, setAttributes),
            el(TextareaControl, {
              label: __('Supporting text', 'farmtree'),
              value: attr(attributes, 'text'),
              rows: 4,
              onChange: function (value) { setAttributes({ text: value }); }
            })
          ),
          el(PanelBody, { title: __('Background media', 'farmtree'), initialOpen: false },
            el(MediaUploadCheck, {},
              el(MediaUpload, {
                allowedTypes: ['image'],
                value: attributes.mediaId || 0,
                onSelect: function (media) {
                  setAttributes({
                    mediaId: media.id || 0,
                    mediaUrl: media.url || '',
                    mediaAlt: media.alt || attr(attributes, 'mediaAlt')
                  });
                },
                render: function (obj) {
                  return el(Button, { variant: 'secondary', onClick: obj.open }, mediaUrl ? __('Replace image', 'farmtree') : __('Choose image', 'farmtree'));
                }
              })
            ),
            textControl(__('Image alt text', 'farmtree'), 'mediaAlt', attributes, setAttributes, __('Describe the visible image for accessibility.', 'farmtree'))
          ),
          el(PanelBody, { title: __('Calls to action', 'farmtree'), initialOpen: false },
            textControl(__('Primary CTA label', 'farmtree'), 'primaryText', attributes, setAttributes),
            textControl(__('Primary CTA URL', 'farmtree'), 'primaryUrl', attributes, setAttributes, __('Only HTTPS URLs are accepted on the frontend.', 'farmtree')),
            textControl(__('Secondary CTA label', 'farmtree'), 'secondaryText', attributes, setAttributes),
            el(ToggleControl, {
              label: __('Show future service card', 'farmtree'),
              checked: showFutureCard,
              onChange: function (value) { setAttributes({ showFutureCard: !!value }); }
            }),
            showFutureCard ? textControl(__('Future card label', 'farmtree'), 'futureLabel', attributes, setAttributes) : null,
            showFutureCard ? textControl(__('Future card title', 'farmtree'), 'futureTitle', attributes, setAttributes) : null,
            showFutureCard ? el(TextareaControl, {
              label: __('Future card text', 'farmtree'),
              value: attr(attributes, 'futureText'),
              rows: 3,
              onChange: function (value) { setAttributes({ futureText: value }); }
            }) : null
          )
        ),
        el('div', { className: 'ft-editor-lock-note' },
          el(Notice, { status: 'info', isDismissible: false },
            __('Design is locked to the approved FarmTree hero. Edit content and media only.', 'farmtree')
          )
        ),
        el('section', { className: 'page active ft-editor-homepage-hero-preview' },
          el('div', { className: 'hero' },
            mediaUrl ? el('img', { className: 'hero-img', src: mediaUrl, alt: attr(attributes, 'mediaAlt') }) : null,
            el('div', { className: 'green-blob' }),
            el('button', { type: 'button', className: 'arrow-side left', disabled: true }, '‹'),
            el('button', { type: 'button', className: 'arrow-side right', disabled: true }, '›'),
            el('div', { className: 'hero-content' },
              el('div', { className: 'kicker' }, attr(attributes, 'kicker')),
              el('h1', {}, attr(attributes, 'title')),
              el('p', {}, attr(attributes, 'text')),
              el('div', { className: 'ft-hero-cta-row' },
                el('span', { className: 'cta-link' }, attr(attributes, 'primaryText')),
                el('span', { className: 'cta-link secondary' }, attr(attributes, 'secondaryText'))
              ),
              showFutureCard ? el('div', { className: 'ft-free-plan-card' },
                el('span', {}, attr(attributes, 'futureLabel')),
                el('strong', {}, attr(attributes, 'futureTitle')),
                el('p', {}, attr(attributes, 'futureText'))
              ) : null
            ),
            el('div', { className: 'hero-controls', role: 'tablist', 'aria-label': 'Hero slides' },
              el('span', { className: 'hero-dot active' }),
              el('span', { className: 'hero-dot' })
            )
          )
        )
      );
    },
    save: function () {
      return null;
    }
  });
})(window.wp);
