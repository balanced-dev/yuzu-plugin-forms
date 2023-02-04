import { Controller } from "stimulus";
import Bouncer from 'formbouncerjs';
import conditions from './form_conditions';
import { utils } from "yuzu-plugin-core";
import formState from '../form-state';

var bouncerJS = new Bouncer('form', {
    customValidations: {
        requiredSet: function (field) {
            // where at least one checkbox must be checked
            let wrapper = field.closest('[data-required-set]');
            if (!wrapper) return false;
            let checkboxes = wrapper.querySelectorAll('input[type="checkbox"]');
            let checkedCount = wrapper.querySelectorAll('input[type="checkbox"]:checked').length;
            let errorMessage = wrapper.querySelector(field.getAttribute('data-bouncer-target'));            
            
            // Only validate all checkboxes on last checkbox
            if (checkboxes.length > 0) {
                errorMessage.innerHTML = '';
                
                if (checkedCount === 0) {
                    for(let index = 0; index < checkboxes.length; index++) {
                        const checkbox = checkboxes[index];
                        checkbox.classList.add('error');
                        checkbox.setAttribute('aria-invalid', true);               
                        checkbox.setAttribute('aria-describedby', errorMessage.id);   
                    };
                    return true;
                }
                else {
                    for(let index = 0; index < checkboxes.length; index++) {
                        const checkbox = checkboxes[index];  
                        checkbox.classList.remove('error');
                        checkbox.removeAttribute('aria-describedby');
                        checkbox.removeAttribute('aria-invalid');              
                    };
                    return false;
                }
            }
        }
    },
    messages: {
        missingValue: {
            default: function (field) {
                return field.getAttribute('data-msg-required') ? field.getAttribute('data-msg-required') : 'This field cannot be empty.';
            }
        },
        patternMismatch : {
            default: function (field) {
                return field.getAttribute('data-msg-regex') ? field.getAttribute('data-msg-regex') : 'The value is invalid.';
            }
        },
        requiredSet: function (field) {            
            return field.getAttribute('data-required-set') ? field.getAttribute('data-required-set') : 'At least one option must be selected.';
        }
    }
});


// Prevent form submission when invalid
document.addEventListener('bouncerFormInvalid', function (event) {
    event.preventDefault();
}, false);

export default class extends Controller {

    initialize() {

        utils.setup(this);

        this.settings = JSON.parse(this.element.attributes['data-settings'].value); 
        
        this.getForm().addEventListener('submit', this.refreshForm.bind(this));
        this.formSelectPlaceholders();

        conditions.init(this.getForm());
    }

    getForm() {
        return this.element.getElementsByTagName("Form")[0];
    }

    formSelectPlaceholders() {
        this.element.querySelectorAll('select').forEach(select => {
            const firstOption = select.options[0];
            if(select && select.value === '' && firstOption.value === '' && firstOption.disabled) {
                document.querySelector('select').classList.add('has-placeholder');
    
                select.addEventListener('change', (e) => {
                    e.currentTarget.classList.remove('has-placeholder');
                });
            }
        });
    }
    
    isFormValid() {
        let results = [];
        let fields = this.getForm().querySelectorAll('input,select,textarea');
        fields.forEach((field) => {
            let isValid = true;
            if(field.style.display !== 'none') {
                let result = bouncerJS.validate(field);
                if(result) isValid = result.valid;
            }
            results.push(isValid);
        });
        return results.every(r => r);
    }

    refreshForm(e) {
        e.stopPropagation();
        e.preventDefault();
        
        if(this.isFormValid()) {
            this.element.dispatchEvent(new CustomEvent('FormSubmitted', {detail: {}, bubbles: true}));
            this.toggleLoadingState();
            let formRequestInfo = {};
            let formUrl = this.settings.formUrl;
    
            this.addRecaptchaTokenIfPresent()
                .then(() => {

                    if (!this.isFrontend()) {
                        let formData = this.getFormData();
                        let headers = formState.getHeaders();
                        headers['yuzu-form'] = 'true';
                        formRequestInfo = { 
                            method: 'POST', 
                            body: formData,
                            headers: headers,
                        };
                        formUrl = this.formAction;
                        if (!formUrl.endsWith(this.settings.formUrl)){
                            if(this.settings.formUrl.startsWith('?')) {
                                formUrl = formUrl + this.settings.formUrl;
                            }
                            else {
                                formUrl = this.settings.formUrl;
                            }
                        }
                    }

                    this.sendRequest(this.getForm(), formUrl, formRequestInfo)
                    .then(() => this.toggleLoadingState());
                });
        }
        else {
            this.element.querySelector('[aria-invalid="true"]').focus();
        }
    }
    
    sendRequest(element, url, data) {
        return window.fetch(url, data)
            .then(response => response.text())
            .then((html) => this.handleResponse(element, html));
    }

    async handleResponse(element, html) {
        await this.utilites.simulateNetworkDelay(() => this.updateSectionHtml(element, html));
    }

    updateSectionHtml(element, htmlContent) {
        if(htmlContent.includes('data-form-success="true"')) {
            this.element.dispatchEvent(new CustomEvent('FormSuccess', {detail: {newContent: htmlContent, oldContent: this.getForm().innerHTML}, bubbles: true}));
        }
        element.innerHTML = htmlContent;
        element.scrollIntoView(true);
    }

    toggleLoadingState() {
        this.element.classList.toggle(this.settings.loadingClass);
    }

    getFormData() {
        let form = this.getForm();
        this.formAction = form.getAttribute('action');
        return new FormData(form);
    }

    addRecaptchaTokenIfPresent() {
        let fields = this.getForm().querySelectorAll('[data-grecaptcha]');
        if(fields.length == 1) {
            let field = fields[0];
            let siteId = field.dataset.grecaptchaSiteId;
            let useCase = field.dataset.grecaptchaUseCase;

            if(grecaptcha) {
                return grecaptcha.execute(siteId, { action: useCase }).then(function (token) {
                    field.value = token;
                });
            }
        }
        return Promise.resolve([]);
    }
}