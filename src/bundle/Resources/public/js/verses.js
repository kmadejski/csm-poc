(function(global, doc, eZ, $) {
    const SELECTOR_FIELD = '.ez-field-edit--verse-edit';
    const SELECTOR_INPUT = '.ez-data-source__richtext';
    const SELECTOR_MODAL = '#modal-edit-verse';
    const SELECTOR_VERSE_EDIT_BTN = '.btn--verse-edit';
    const modal = doc.querySelector(SELECTOR_MODAL);

    const LOAD_VERSE_FIELD_DATA_URL = '/admin/load-verse-data';
    const UPDATE_VERSE_FIELD_URL = '/admin/update-verse';

    const saveData = (contentId, fieldIdentifier, content, successCallback, errorCallback) => {
        fetch(UPDATE_VERSE_FIELD_URL, {
            method: 'POST',
            body: JSON.stringify({
                contentId: parseInt(contentId),
                fieldIdentifier: fieldIdentifier,
                content: content
            })
        })
            .then((response) => {
                if (response.ok) {
                    successCallback();
                }
            })
            .catch((err) => {
                errorCallback(err);
            });
        };

    const fetchData = (contentId, fieldIdentifier) => {
        return fetch(LOAD_VERSE_FIELD_DATA_URL + '/' + contentId + '/' + fieldIdentifier)
            .then(function(response) {
                return response.json();
            });
    };

    $(SELECTOR_MODAL).modal({ show: false });

    doc.querySelectorAll(SELECTOR_VERSE_EDIT_BTN).forEach((verseEditBtn) => {
        const richtextContainer = modal.querySelector(`${SELECTOR_FIELD} ${SELECTOR_INPUT}`);
        const textarea = richtextContainer.closest('.ez-data-source').querySelector('textarea');

        verseEditBtn.addEventListener('click', (event) => {
            const btn = event.currentTarget;
            const {contentId, fieldIdentifier} = btn.dataset;

            const dataFetched = fetchData(contentId, fieldIdentifier);

            dataFetched.then((value) => {
                textarea.value = value.value;

                const richtext = new global.eZ.BaseRichText();
                const alloyEditor = richtext.init(richtextContainer);

                $(SELECTOR_MODAL).modal({ show: true, backdrop: 'static', focus: false });

                const handleSave = () => {
                    saveData(contentId, fieldIdentifier, textarea.value,
                        (successCallback) => {
                            eZ.helpers.notification.showSuccessNotification('Verse has been updated.');

                            $(SELECTOR_MODAL).modal('hide');
                        },
                        (errorMessage) => {
                            if (errorMessage) {
                                eZ.helpers.notification.showErrorNotification(errorMessage);
                                return;
                            }

                            $(SELECTOR_MODAL).modal('hide');
                        }
                    );
                };

                const confirmBtn = modal.querySelector('.ez-btn--confirm');

                confirmBtn.addEventListener('click', handleSave, false);

                $(SELECTOR_MODAL).one('hidden.bs.modal', () => {
                    confirmBtn.removeEventListener('click', handleSave);
                    alloyEditor.destructor();
                });
            });
        });
    });
})(window, window.document, window.eZ, window.jQuery);
