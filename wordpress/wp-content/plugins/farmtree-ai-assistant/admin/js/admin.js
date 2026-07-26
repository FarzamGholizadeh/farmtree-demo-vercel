/* FarmTree AI — admin enhancements (progressive; the UI works without JS). */
(function () {
    'use strict';

    // Live character counters for length-limited textareas.
    document.querySelectorAll('textarea[data-ft-count]').forEach(function (ta) {
        var out = document.createElement('span');
        out.className = 'ft-ai-muted';
        ta.insertAdjacentElement('afterend', out);
        var update = function () { out.textContent = ta.value.length + ' chars'; };
        ta.addEventListener('input', update);
        update();
    });

    // Guard destructive submits that opt out of the inline confirm attribute.
    document.querySelectorAll('form[data-ft-confirm]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            if (!window.confirm(form.getAttribute('data-ft-confirm'))) {
                e.preventDefault();
            }
        });
    });
}());
