(function(global, doc, eZ, $) {
    const SELECTOR_FIELD = '.ez-field-edit--verse-edit';
    const SELECTOR_INPUT = '.ez-data-source__richtext';
    const SELECTOR_MODAL = '#modal-edit-verse';
    const SELECTOR_VERSE_EDIT_BTN = '.btn--verse-edit';
    const modal = doc.querySelector(SELECTOR_MODAL);
    // TODO: replace ////////////////////////////////
    const fetchedFromServer = '<section xmlns="http://ez.no/namespaces/ezpublish5/xhtml5/edit"><p>asd</p><p>asdf</p><p> </p></section>';
    const saveToServer = (newValue, callback) => {
        console.log(newValue);

        callback();
    };
    /////////////////////////////////////////////////

    $(SELECTOR_MODAL).modal({ show: false });

    doc.querySelectorAll(SELECTOR_VERSE_EDIT_BTN).forEach((verseEditBtn) => {
        verseEditBtn.addEventListener('click', () => {
            $(SELECTOR_MODAL).modal({ show: true, backdrop: 'static', focus: false });

            const richtextContainer = modal.querySelector(`${SELECTOR_FIELD} ${SELECTOR_INPUT}`);
            const textarea = richtextContainer.closest('.ez-data-source').querySelector('textarea');

            textarea.value = fetchedFromServer;

            const richtext = new global.eZ.BaseRichText();
            const alloyEditor = richtext.init(richtextContainer);
            const handleSave = () => {
                saveToServer(textarea.value, (errorMessage) => {
                    if (errorMessage) {
                        eZ.helpers.notification.showErrorNotification(errorMessage);
                        return;
                    }

                    $(SELECTOR_MODAL).modal('hide');
                });
            };
            const confirmBtn = modal.querySelector('.ez-btn--confirm');
            const handleConfirmBtnClick = () => {
                handleSave();
            };

            confirmBtn.addEventListener('click', handleConfirmBtnClick, false);

            $(SELECTOR_MODAL).one('hidden.bs.modal', () => {
                confirmBtn.removeEventListener('click', handleConfirmBtnClick);
                alloyEditor.destructor();
            });
        });
    });
})(window, window.document, window.eZ, window.jQuery);
