(function (wp) {
  if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components) {
    return;
  }

  var el = wp.element.createElement;
  var Fragment = wp.element.Fragment;
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

  registerBlockType('farmtree/homepage-hero', {
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var mediaUrl = attr(attributes, 'mediaUrl') || (window.FT_ASSETS ? window.FT_ASSETS + '/case-giz_opt.webp' : '');
      var showFutureCard = attributes.showFutureCard !== false;

      return el(Fragment, {},
        el(InspectorControls, {},
          el(PanelBody, { title: 'Hero content', initialOpen: true },
            textControl('Kicker', 'kicker', attributes, setAttributes),
            textControl('Headline', 'title', attributes, setAttributes),
            el(TextareaControl, {
              label: 'Supporting text',
              value: attr(attributes, 'text'),
              rows: 4,
              onChange: function (value) { setAttributes({ text: value }); }
            })
          ),
          el(PanelBody, { title: 'Background media', initialOpen: false },
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
                  return el(Button, { variant: 'secondary', onClick: obj.open }, mediaUrl ? 'Replace image' : 'Choose image');
                }
              })
            ),
            textControl('Image alt text', 'mediaAlt', attributes, setAttributes, 'Describe the visible image for accessibility.')
          ),
          el(PanelBody, { title: 'Calls to action', initialOpen: false },
            textControl('Primary CTA label', 'primaryText', attributes, setAttributes),
            textControl('Primary CTA URL', 'primaryUrl', attributes, setAttributes, 'Only HTTPS URLs are accepted on the frontend.'),
            textControl('Secondary CTA label', 'secondaryText', attributes, setAttributes),
            el(ToggleControl, {
              label: 'Show future service card',
              checked: showFutureCard,
              onChange: function (value) { setAttributes({ showFutureCard: !!value }); }
            }),
            showFutureCard ? textControl('Future card label', 'futureLabel', attributes, setAttributes) : null,
            showFutureCard ? textControl('Future card title', 'futureTitle', attributes, setAttributes) : null,
            showFutureCard ? el(TextareaControl, {
              label: 'Future card text',
              value: attr(attributes, 'futureText'),
              rows: 3,
              onChange: function (value) { setAttributes({ futureText: value }); }
            }) : null
          )
        ),
        el('div', { className: 'ft-editor-lock-note' },
          el(Notice, { status: 'info', isDismissible: false },
            'Design is locked to the approved FarmTree hero. Edit content and media only.'
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
